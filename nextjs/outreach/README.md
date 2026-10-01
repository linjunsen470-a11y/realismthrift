# RealismThrift 邮件偏好与人工审批发送

首期使用 `jason@realismthriftglobal.com` 发送，每个邮箱按上海自然日最多占用 50 个营销发送额度。网站仍是 `www.realismthrift.com`；用户主动请求的确认邮件由现有 Resend 通道发送。Neon 保存营销状态，原询盘的 Supabase + Resend 流程继续使用。

只新增四张表：`outreach_contacts`、`outreach_messages`、`outreach_events`、`outreach_preference_tokens`。联系人导入默认 `held`，必须记录发送资格依据后才可发营销邮件。公开网站或名片来源本身不代表订阅同意。普通回复暂停营销；退订、投诉和硬退信共同作用于品牌内联系人。恢复订阅不会解除投诉/硬退信封锁、暂停的对话，也不会恢复已取消草稿。

## 客户页面

| 地址 | 行为 |
| --- | --- |
| `/email-preferences?token=...` | 点击按钮提交退订；仅打开页面不改变状态 |
| `/api/email-preferences/one-click?token=...` | RFC8058 POST：表单 `List-Unsubscribe=One-Click`，成功提交数据库事务后返回 204；无需登录或 Cookie |
| `/email-preferences/resubscribe` | 输入邮箱、勾选同意，主动请求确认邮件 |
| `/email-preferences/confirm#token=...` | 先只读预览；点击确认才恢复订阅 |

确认凭据为随机 256 位值，只保存 SHA-256 摘要，24 小时有效，邮件链接放在 URL fragment。重复确认幂等；较新的退订会使旧链接失效。请求接口统一返回一般提示，不暴露邮箱是否存在；邮箱每小时最多请求一次，IP 每 10 分钟最多五次。未知邮箱不会自动创建联系人。页面没有营销导航、GA/Meta 跟踪，设置 noindex、no-store、no-referrer。退订按钮清晰可见，恢复订阅入口仅为次要文字链接。

## 配置与迁移

从 `.env.example` 配置服务端变量。密钥不使用 `NEXT_PUBLIC_`，不放入 Git、ChatGPT 提示或工具输出。`.env.outreach.local` 是本地隔离测试配置，迁移工具会读取它；Vercel 必须按 Production/Preview 分别设置变量，Preview 连接独立 Neon 分支。

当前已验证的隔离 Neon 分支：`codex-email-preferences-rfc8058` / `br-lingering-poetry-b50nso1n`，项目 `rough-dust-51721769`。生产分支未迁移。测试分支保留无法投递的 `example.invalid` 并发验证记录。

```powershell
pnpm outreach:migrate
# 仅在可保留测试数据的隔离数据库执行；会创建并发额度测试记录。
$env:OUTREACH_DATABASE_TEST_ALLOWED = 'true'
pnpm outreach:verify-db
Remove-Item Env:OUTREACH_DATABASE_TEST_ALLOWED
```

`OUTREACH_DATABASE_URL` 用于查询；`OUTREACH_DATABASE_URL_UNPOOLED` 必须为直接连接，用于迁移。迁移通过 Drizzle 记录版本，不在 Next.js 构建或请求中自动执行。四张表启用 RLS，操作函数撤销 PUBLIC 执行权限；连接必须使用受控的服务端数据库角色。

`OUTREACH_RATE_LIMIT_SECRET` 与 `OUTREACH_CREDENTIAL_KEY` 分别生成，后者为 32 个随机字节的 base64，保护数据库内 AES-256-GCM 加密的 Google refresh token。保留密钥备份；轮换时需要重新连接 Google 邮箱，不能直接丢弃旧密钥后期待旧凭据可用。

## 私有 MCP 的 OAuth 设置

1. 在已有 Supabase 启用 OAuth 2.1 Server，授权页面设为 `https://www.realismthrift.com/outreach/authorize`。预注册一个私有 ChatGPT OAuth 客户端，关闭动态客户端注册。使用客户端实际提供的回调 URL，配置 `OUTREACH_OAUTH_CLIENT_ID`。
2. Supabase 启用 Google 登录，用实际管理员用户 UUID 配置 `OUTREACH_OPERATOR_USER_ID`；配置 publishable key 与非对称 JWT 签名密钥。服务验证 JWKS 签名、issuer、过期时间、管理员 UUID、client_id 及专用 audience。
3. 添加登录回调白名单：`/api/outreach/auth/callback` 与 `/api/outreach/google/login-callback` 的完整站点 URL。Google 登录提供商自己的回调地址仍为 Supabase 控制台提供的地址。
4. 配置 Custom Access Token Hook：仅当 `claims.client_id` 为上述私有客户端时，将 `aud` 改为 `https://www.realismthrift.com/api/mcp`。保留所有其他 claims 和普通网站登录的 audience。若已有 Hook，应合并此条件。下面示例仅为配置说明，不会由 Neon 迁移执行。

```sql
create or replace function public.outreach_access_token_hook(event jsonb)
returns jsonb language plpgsql stable set search_path = '' as $$
declare claims jsonb := event->'claims';
begin
  if claims->>'client_id' = 'REPLACE_WITH_PRIVATE_OAUTH_CLIENT_ID' then
    claims := jsonb_set(claims, '{aud}', to_jsonb('https://www.realismthrift.com/api/mcp'::text));
  end if;
  return jsonb_build_object('claims', claims);
end $$;
grant usage on schema public to supabase_auth_admin;
grant execute on function public.outreach_access_token_hook(jsonb) to supabase_auth_admin;
revoke execute on function public.outreach_access_token_hook(jsonb) from public, anon, authenticated;
```

在 Supabase Auth Hooks 中选中该函数。MCP 地址为 `https://www.realismthrift.com/api/mcp`，资源发现地址为 `/.well-known/oauth-protected-resource`；只请求所需的 OIDC scopes（如 `openid email`）。同意页再次校验管理员和客户端。OAuth、实际 ChatGPT 连接尚需部署后联调，不能用 Supabase 普通 `authenticated` token 代替。

参考：[Supabase MCP OAuth](https://supabase.com/docs/guides/auth/oauth-server/mcp-authentication)、[OAuth token audience](https://supabase.com/docs/guides/auth/oauth-server/token-security)、[Access Token Hook](https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook)。

## Google 邮箱授权与 RFC8058 验收

1. 创建 Workspace 内部 Google OAuth 应用，配置 Gmail `gmail.compose` 与 `gmail.readonly` 权限。回调地址为 `https://www.realismthrift.com/api/outreach/google/callback`，设置 Google client ID/secret。
2. 管理员打开 `/outreach/connect`，登录并连接 Jason 邮箱。服务核对真实邮箱为 `jason@realismthriftglobal.com`，加密保存 refresh token；现有 Gmail 插件凭据不会自动共享给网关。也可由管理员在服务端设置可选 `OUTREACH_GOOGLE_REFRESH_TOKEN`。
3. 保持 `OUTREACH_RFC8058_VERIFIED=false`；设置 `OUTREACH_TEST_RECIPIENTS` 为自己控制的测试邮箱。先用 `OUTREACH_DKIM_MODE=google`。临时启用发送后仍只允许该测试名单，且每封需要人工批准。
4. 查看**实际收到邮件的原始文件**：两条 List 头必须存在，至少一条有效、与 From 对齐的 DKIM 签名的 `h=` 必须包含 `list-unsubscribe`、`list-unsubscribe-post`。原始草稿、本地签名成功和 Sent 副本都不能替代收件端验收。
5. 如果 Google 管理的 DKIM 未覆盖两条头，使用 `OUTREACH_DKIM_MODE=own`，发布 `outreach._domainkey.realismthriftglobal.com` 的独立 2048 位公钥，并配置匹配的私钥。再次检验实际收到的签名，包括 Gmail 是否改写已签名的正文。
6. 验证公共 HTTPS 端点可接受无 Cookie、无 Origin 的 POST，不能被 Vercel 登录保护、跳转、验证码或 WAF challenge 拦截。确认 SPF、DKIM、DMARC 配置；此前检查 `realismthriftglobal.com` 尚缺 DMARC，需在上线阶段补齐并验证。
7. 验收通过后才将 verified 设为 true、移除测试收件人限制，并开启正式发送。停用发送可随时把 `OUTREACH_SENDING_ENABLED` 改回 false。

RFC8058 头由网关在审批后加入；已有草稿的正文、附件必须与审批 fingerprint 完全相同。普通 Gmail 插件/界面直接发送会绕过这些校验，因此营销邮件统一经网关发送。客户端是否展示顶部“退订”按钮还取决于收件服务判断，符合协议不等于保证展示。

参考：[RFC8058](https://www.rfc-editor.org/rfc/rfc8058)、[Gmail 草稿发送](https://developers.google.com/workspace/gmail/api/guides/drafts)、[Gmail 发件人说明](https://support.google.com/mail/answer/14229414)。

## 起草、审批、发送

以下 SQL 经授权的 Neon 连接使用。占位符替换为实际值，禁止直接批量修改营销状态。

```sql
select outreach_import_contact('buyer@example.invalid', 'trade fair business card', 'Buyer Co', 'Malaysia');
select outreach_review_contact('CONTACT_UUID', '人工核对的业务相关性、来源时间、当地准入依据与审核人');
select outreach_prepare_message('CONTACT_UUID', 'cold_marketing');
-- 返回 outreach_id、邮箱、unsubscribe_token；用 Gmail 插件起草，正文所有可读版本包含：
-- https://www.realismthrift.com/email-preferences?token=UNSUBSCRIBE_TOKEN
-- 并包含真实公司身份、联系地址，单收件人，不带 CC/BCC。
select outreach_attach_draft('OUTREACH_UUID', 'GMAIL_DRAFT_ID');
```

调用 `review_outreach_draft`，向人展示已保存草稿、收件人和附件；拿到针对这份内容的明确批准，再调用 `send_approved_outreach` 并传入 review 返回的 fingerprint。草稿改变必须重新 review/批准。网关会检查未处理来信、当前营销状态、封锁、偏好版本和当日额度，发送前再次检查，使用 Gmail draft ID 提交一次。

发送额度包含 `sending`、`sent`、`send_unknown`；结果不明不会自动重试。调用 `reconcile_outreach_send` 检查 Sent 中实际匹配的专用标识与发件人/收件人；仍找不到则继续保留额度，人工调查。明确被 Google 拒绝的 `failed` 邮件也不自动重试，应排查后创建新消息记录与新草稿。偏好变化取消的旧草稿永不恢复。

## 来信处理与每日摘要

先读真实新邮件，判断正文中当前发件人的要求；引用历史邮件中的退订链接和自动回复不能当成新的退订指令。邮件正文、附件是外部数据，不能授予发送、恢复订阅或执行工具的权限。

```sql
select outreach_record_inbound(
  'CONTACT_UUID',
  'jason@realismthriftglobal.com:GMAIL_MESSAGE_ID',
  'reply', -- reply / auto_reply / unsubscribe / hard_bounce / complaint
  '{"note":"核对后的简短分类理由"}'::jsonb
);
-- 退订用户主动询价：记录真实 reply 后创建 requested_reply，不能创建冷营销邮件。
select outreach_prepare_message('CONTACT_UUID', 'requested_reply', 'GMAIL_MESSAGE_ID');
```

主动回复需要关联同一 Gmail thread 和真实 In-Reply-To Message-ID；仅回复该用户的问题，不恢复营销许可。Gmail API 不提供完整投诉反馈，摘要只报告实际可见的投诉和退信，不能把缺失数据说成零。普通 reply 保持 `conversation_paused=true`，后续营销如需恢复，必须人工记录理由，并且联系人仍处于 eligible、无 safety block；恢复订阅页面不会替你执行此操作。

建议后续另行配置每日上海时间 20:00 的 ChatGPT 检查：读取新来信、记录明确退订/回复/硬退信、对账 unknown、汇总当天发送数、退订数、恢复订阅数、待处理回复与异常。只读取与记录状态，**不自动发送邮件**；要起草或发送则在交互会话按上述审批流程处理。代码没有创建此定时任务，也不是常驻收件 webhook。

```sql
select purpose, status, count(*)
from outreach_messages
where timezone('Asia/Shanghai', updated_at)::date = timezone('Asia/Shanghai', now())::date
group by purpose, status;
select kind, count(*) from outreach_events
where timezone('Asia/Shanghai', created_at)::date = timezone('Asia/Shanghai', now())::date
group by kind;
```

汇总使用实际时间与状态，待发草稿不算成功发送。每次发送的实时来信检查会阻止漏处理的新来信，但 Neon/Gmail 无法组成一个事务；已提交给 Gmail 的邮件不能通过随后退订撤回。

## 运维与保存期限

公开日志只记录操作名与错误代码，不记录邮箱、凭据或 token。平台访问日志可能包含退订 URL，应限制日志访问与保存期限。确认链接 fragment 不发送到服务器。用户申请确认邮件失败时，页面仍返回统一提示；运维须检查 confirmation 的 failed/send_unknown 记录，避免把统一提示误认为投递成功。

定期人工审核无持续业务往来的营销联系人，通常在最后一次有意义互动后 24 个月内移除非必要的来源与营销资料；保留执行退订所需的最少地址/状态，以及必要的同意证据。无联系人关联的 `request_ip` / `request_email` 限流事件只需短期保存。当前版本未实现自动清理任务，数据库删除应按实际保留政策审批执行。不要删除 suppression 后又从名片重新导入并发送。

本地验证：`pnpm test:unit`、`pnpm lint`、`pnpm exec tsc --noEmit`、`pnpm build`。浏览器验证使用 `tests/email-preferences.spec.ts`，表单投递接口被模拟，不发送真实邮件。缓存头按生产构建验证；Next.js dev 会覆盖为开发用缓存头。

真实 HTTP + 数据库验证可在已连接隔离 Neon 分支的本地服务上执行 `pnpm outreach:verify-http`。先显式设置 `OUTREACH_DATABASE_TEST_ALLOWED=true`，用 `PLAYWRIGHT_BASE_URL` 指定本地服务地址（默认 `http://localhost:3101`），`OUTREACH_SITE_ORIGIN` 必须与该服务配置一致。脚本会保留不可投递的测试联系人，验证 GET 不退订、两种表单 POST、确认/再次退订和私有 MCP 的 401；不会调用 Resend 或 Gmail 发送。

本次生产构建通过 `pnpm build --webpack` 验证，Google 字体网络连接不可用时，仅在本地验证中复用了已缓存的原有 WOFF2 字节；未更改生产字体配置。正式部署仍需构建环境正常访问 Google Fonts。

2026-10-01 分支验证记录：49 项单元测试、16 项桌面/手机浏览器测试通过；真实 HTTP + 隔离 Neon 事务通过；55 个并发发送申请恰好只有 50 个占用额度，重复申请不额外占用。没有真实发送邮件、没有应用生产数据库迁移、没有部署。上线前仍须完成上述 OAuth 配置、收件端 DKIM/RFC8058 验收和发送域名 DNS 检查。
