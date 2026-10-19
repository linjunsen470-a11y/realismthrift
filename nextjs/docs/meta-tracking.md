# GA4、Meta Pixel 与 Conversions API

本说明维护网站询盘的当前测量配置，更新于 2026-10-19。适用于网站表单，不涉及 Meta 原生潜在客户广告、目录或 WhatsApp 站外对话事件。

## GA4 询盘关键事件

- 生产属性：`realismthrift`，Property ID `534735463`；Web 测量 ID：`G-854G1RXBJM`。
- 浏览器只在 `/api/send` 返回 HTTP 成功且 `ok: true` 后发送 `generate_lead`。校验失败、入库失败或网络错误不发送成功事件。
- 在 GA4 Admin → Data display → Events 中，将 `generate_lead` 标记为关键事件，计数采用 **Once per event**。事件被接收不等于已标记为关键事件。
- GA4 的询盘事件名为 `generate_lead`；Meta 的标准事件名为 `Lead`。不要在 GA4 中另建同义的 `Lead` 关键事件，也不要在没有业务触发逻辑时标记 `qualify_lead`、`close_convert_lead`。系统内置 `purchase` 保留默认行为。
- GA4 参数仅包含表单名称、产品选项、数量选项和页面路径，不传姓名、邮箱、电话、WhatsApp、国家自由文本或留言。国家字段仍保存在业务询盘中。
- 属性报表时区为 `America/Los_Angeles`。与 Supabase 对账时须用相同时区和日期，并留出报表处理时间。
- 关键事件标记只影响之后的数据，不追溯修改历史计数。历史询盘测量可查看 `generate_lead` 的 Event count。
- 当前仅使用浏览器 GA4 上报，没有 Measurement Protocol 或持久测量队列。拦截、网络中断和报表延迟都可能造成与数据库记录数不同；Supabase 是业务询盘记录的依据。

官方说明：[标记关键事件](https://support.google.com/analytics/answer/13128484)。

## 事件链路

- `/api/send` 先持久化询盘与邮件 outbox，再进行现有的限时 Meta CAPI 上报并返回成功。邮件任务通过 Next.js `after()` 在响应结束后处理，邮件变慢或失败不会阻塞浏览器成功响应；失败邮件继续由定时任务恢复。
- 生产公共页面发送浏览器 `PageView`，客户端站内导航继续记录页面访问。
- 询盘首次成功入库（`created:true`）后，服务端发送标准 `Lead`，接口返回 `event_id`；浏览器收到成功响应后使用同值 `eventID` 发送 `Lead`。
- 两端均使用这次询盘的 `submissionId`。相同提交在响应丢失后重试，数据库复用询盘，测量继续复用同一个 ID。
- `createInquiry()` 返回 `created:false` 的幂等重放不再调用 CAPI，仅新增一行 `skipped / duplicate_submission` 日志。接口仍返回相同事件 ID，邮件 `after()` 和浏览器 Pixel 行为保持原样；并发相同提交也由数据库的 created 结果决定谁发送。
- 首次入库后若 CAPI 失败、缺配置或进程中断，之后重提同一 submissionId 不会补发；修复配置或部署前已有的询盘也不例外。当前没有自动补发机制。不能只根据投递次数判断转化计数，Meta 实际去重率须在事件管理工具确认。

关键文件：`app/api/send/route.ts`、`components/InquiryForm.tsx`、`components/Analytics.tsx`、`lib/meta-pixel.ts`、`lib/meta-capi.ts` 和 `lib/meta-capi-log.ts`。

## 匹配参数与数据边界

| 参数 | 来源及处理 |
| --- | --- |
| `fbp` | 校验已有 `_fbp` Cookie 后按原值发送。 |
| `fbc` | 校验已有 `_fbc` Cookie 后按原值发送。 |
| `em` | 成功入库后，将邮箱去除首尾空格、转小写，计算 SHA-256；仅散列值进入 CAPI。 |
| `ph` | 仅明确带 `+` 或 `00` 的号码可参与校验；通过后将规范化国际号码去掉 `+`，对剩余数字计算 SHA-256。 |
| `client_ip_address` / `client_user_agent` | 经检查的原始技术参数，不散列。 |
| `event_source_url` | 公共页面地址，服务端去除查询参数、片段与凭据。 |

浏览器 Pixel 的手动 Lead 参数仅包含固定的询盘名称和白名单产品类别；自动配置关闭，不把表单联系字段加入 Pixel 或 GA4 参数。CAPI 不接收明文邮箱、电话、姓名、公司、国家或留言内容。散列值也不返回浏览器。

表单告知与 `/privacy-policy` 已说明向 Meta 分享邮箱和有效国际 WhatsApp 号码的散列值。Supabase 询盘与邮件处理保持原有数据用途，不回传历史询盘。

## 真实广告点击保存

Pixel 的内联初始化代码先检查当前落地 URL 的 `fbclid`，再加载外部 Meta SDK，因此 SDK 被阻止时仍可保存落地标识。

- 仅在 URL 中存在格式合格的真实 `fbclid` 时创建 `_fbc`，不为普通访问随机生成点击标识。
- 使用 `fb.1.<首次捕获的毫秒时间>.<fbclid>`，Cookie 设置 `Path=/`、`SameSite=Lax`、90 天 `Max-Age`；HTTPS 页面额外设置 `Secure`。
- 同一个点击标识保留已有时间，新广告点击才更新。普通页面跳转继续使用已有 Cookie。
- Cookie 被浏览器禁止时跳过保存，避免影响网站和询盘提交。

## 电话匹配规则

服务端使用精确锁定版本的 `libphonenumber-js/max`，不指定默认国家，严格解析后调用 `isValid()`。

| 输入情况 | 结果 |
| --- | --- |
| `+1 (650) 555-1212` | 通过国际号码规则后，对 `16505551212` 散列。 |
| `0016505551212` | 开头 `00` 转为 `+`，其余流程相同。 |
| 缺少 `+` / `00` 的裸数字或本地号码 | 省略 `ph`，即使填写了国家也不猜区号。 |
| 无效区号、号段或长度 | 省略 `ph`。 |
| 文字、分机或多个号码 | 省略 `ph`，避免提取或拼接成另一个号码。 |

保留意大利等号码中的有效国内前导零，不对号码做全局去零。上述校验针对号码计划，不检查是否开通 WhatsApp。电话不符合匹配规则时，原询盘仍保存，邮箱及其他匹配参数继续发送。前端仅增加区号提示，不增加阻止本地号码提交的格式限制；原有必填规则保持不变。

## 环境配置

生产 Pixel：`1661409812003549`。

| 变量 | 行为 |
| --- | --- |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `false` 同时关闭 GA4、Meta Pixel 和 CAPI。 |
| `NEXT_PUBLIC_GA_ID` | GA4 Web 测量 ID；`generate_lead` 的关键事件标记与计数方式在 GA4 后台维护。 |
| `VERCEL_ENV` | 仅 `production` 启用 Meta，Vercel 自动设置；本地和 Preview 默认关闭。 |
| `NEXT_PUBLIC_META_ENVIRONMENT` | 由 `next.config.ts` 从构建时的 `VERCEL_ENV` 派生，确保浏览器环境隔离；无需单独配置。 |
| `NEXT_PUBLIC_FB_PIXEL_ID` | 数字格式的 Pixel ID；空值回退到生产 ID，无效值禁用 Pixel。环境隔离仍然适用。 |
| `META_CAPI_ACCESS_TOKEN` | 仅服务端读取的生产密钥。缺失时跳过 CAPI，询盘仍成功。 |

完整变量模板见 [环境示例](../.env.example)。真实密钥只保存在本地环境或部署平台。修改公开变量或构建时环境后，需要重新构建部署。

## 投递与失败处理

- 同一次 CAPI 调用最多两次尝试，共享约 4 秒等待预算；超时、网络错误、HTTP 429 和 5xx 可有限重试。
- 重试复用完全相同的请求体，包括事件 ID 与发生时间；遇到较长的 `Retry-After`，预算不足则停止。
- 参数和 Token 的常见 4xx 错误不重试。HTTP 成功仍须确认 `events_received === 1`，不能仅凭 HTTP 200 标记投递成功。
- `public.meta_capi_delivery_logs` 每次已入库请求对应独立日志 UUID，先尽力写入 started，再用同一 UUID upsert 完整终态；重复提交直接记录 skipped，不覆盖首次日志。`event_id` 不唯一。
- 日志保留实际 Pixel、Graph 版本、事件时间、匹配字段存在性布尔值、总耗时及最多两次 HTTP 尝试摘要。第一次 503 后第二次成功时，顶层为 sent，attempts 仍保留第一次失败。
- 日志不存 Token、Supabase 密钥、原始请求/响应体、联系信息、匹配散列、IP、UA、来源地址或 Cookie 值。追踪 ID 只接受限定字符和长度，错误名与字段均采用白名单。
- 开始和终态写入各有 1500ms 预算并中止超时 I/O，正常最多额外等待约 3 秒，重复提交最多约 1500ms；数据库等待不占发送器 4 秒预算。日志失败仅输出安全控制台错误，不阻断询盘响应，也不会重发 CAPI。
- 测量失败不改变已接受的询盘结果。CAPI 采用有限重试，没有持久测量队列；进程中断或持续故障仍可能导致漏报。邮件有独立的持久 outbox 与定时重试，参见[询盘部署说明](../supabase/README.md)。

| 日志状态 | 含义 |
| --- | --- |
| `started` | 终态尚未保存；可能执行中、进程中断或终态存储失败，发送结果未知。 |
| `sent` | HTTP 2xx 且 `events_received === 1`，表示 Meta 已接收批次，不保证归因、转化或去重。 |
| `skipped` | 无 HTTP 尝试，原因包括 disabled、missing_token、missing_pixel、invalid_event_id、duplicate_submission。 |
| `failed` | 发送失败、预算耗尽、无效成功响应或意外异常；网络超时下 Meta 是否接收仍可能未知。 |

`attempt_count` 为正常终态的实际 HTTP 次数（0–2），与 attempts 数组长度相同；started 或发送器意外抛出时为 null，不能当作 0。日志与 Meta 投递无法原子提交，可能只有 started 或完全缺日志。尝试明细在内存收集，进程硬中断时可能丢失。日志跟随关联询盘级联删除，沿用现有保留期；日志行数与 HTTP 尝试数均不代表转化数。

新日志表须先 apply migration，再部署应用代码。Dashboard 查看和 RLS/权限验证见[部署说明](../supabase/README.md#meta-capi-delivery-logs)。

## 验证与上线检查

在 `nextjs/` 下运行：

```powershell
pnpm test:unit
pnpm exec tsc --noEmit
pnpm exec playwright test tests/analytics.spec.ts --project=chromium --project=mobile-chromium --workers=2
```

Playwright 的本地服务器显式模拟生产 Meta 环境，测试拦截 GA/Meta 传输及询盘 API。不要去掉这些拦截后向生产数据集发送合成转化。

浏览器验证涵盖成功/失败询盘、延迟 Google 脚本时保留事件、国家自由文本排除、真实落地参数跨页面保留、失败后重试复用 ID、缺区号仍可提交及私有页面排除。服务端单元测试覆盖慢邮件不阻塞成功响应、后台邮件异常隔离、入库失败不安排邮件任务，以及邮箱/电话散列规则。每次改动应重新运行相关检查，不沿用历史批次的测试数量或构建结论。

这些测试使用模拟依赖，不证明 Meta 后台已接收生产 Lead。部署后需确认：

1. Vercel 生产部署的 Git SHA 与已推送修复一致，生产 Token 已配置。
2. Meta 测试事件中的浏览器 `eventID` 与服务端 `event_id` 一致。
3. 使用真实广告点击产生的询盘核对 `fbc`，并核对邮箱与有效电话匹配字段；普通访问没有 `fbc` 是预期行为。
4. 按修复部署后的独立日期窗口查看去重率、参数覆盖率和事件匹配质量，不用修复前的混合历史窗口判断效果。
5. 在 GA4 中确认 `generate_lead` 的星标与 Once per event 计数；用修复后的真实询盘核对事件报告，不能只看首页关键事件卡片。
