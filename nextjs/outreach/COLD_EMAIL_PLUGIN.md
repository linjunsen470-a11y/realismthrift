# RealismThrift Cold Email：个人使用

复用现有 Vercel 网关、Neon 联系人状态和 Jason 的 Gmail 授权。插件只提供查询联系人、起草、审核、批准发送和发送对账五个工具；不另建 CRM、用户体系、批量发送或多邮箱调度。

## 日常流程

查询一个已有且人工审核过的联系人 → 保存 Gmail 草稿 → 显示原文审核 → 本人批准 → 网关发送。退订、回复暂停、单收件人、每日 50 封额度和发送结果不明时禁止重发的检查继续由服务器执行。普通邮件回复使用其他邮箱插件；回复不会恢复营销许可。

草稿同时包含纯文本与简洁 HTML：白底、系统字体、560px 最大宽度、小型金色品牌线、Jason 签名、地址及文字退订链接。服务器转义段落；无追踪像素、外部图片或自由 HTML。

## 最小接入方式

ChatGPT 网页 Chat → Supabase 托管 OAuth → `/api/mcp` → 已连接的 Jason Gmail。

网页 Chat 不能携带自定义 API key。私人插件的可见性也不能保护公网发送接口，因此保留一套托管 OAuth。服务器只验证签名、有效期、固定 Jason 身份及专用客户端；没有注册、角色、团队、租户或自建 token 服务。Gmail OAuth 继续保存于服务器，日常使用无需重新授权邮箱。

`/oauth/consent` 是唯一授权页面，直接对应 Supabase 的现有配置。首次登录共用 `/api/outreach/google` 和已有 `login-callback`；批准与取消使用 Next.js Server Actions。旧 `/outreach/authorize` 链接只跳转到此页。已删除重复的 `/api/outreach/authorize` 和 `/api/outreach/auth/callback`，不再维护插件专用登录回调。

已有 Supabase consent 会复用。新的权限、首次登录和 OAuth 同意由本人完成。一次连接授权不等于批准任何邮件发送。

## 私有插件

同一插件 `plugins_6abec11be1ac81918fce6d2d8b1d56eb` 更新为 0.2.0，保留名称、图标、三个默认提示和私人范围。通过 `.app.json` 依赖已创建的云端 App `asdk_app_6abec56015f48191a27e8c54701c4a8e`，工具服务器仍为 https://www.realismthrift.com/api/mcp。直接 MCP 配置显式清空，避免只支持 Desktop 的导入方式；没有在插件包中存储凭据。

专用 Supabase PKCE public client：`62369d93-d1ed-423c-9604-f3928e40f465`，无 client secret；精确平台回调：`https://chatgpt.com/connector/oauth/V3RGmY4ygzgA`。Production `OUTREACH_OAUTH_CLIENT_ID` 固定为该客户端。旧客户端不变。

## 验收

37 项单元回归通过：OAuth 固定账户及客户端、过期/错误请求、批准/拒绝、已授权连接复用、邮件 MIME 和退订/暂停拦截。8 项桌面与手机浏览器回归通过：共用登录表单、同源 Origin、保留授权请求和旧链接兼容。类型检查与相关 ESLint 通过。

发布记录和网页 Chat 实际连接验收另记于本地 `archive/`。代码测试、插件发布、实际云端连接分别记录，不把安装成功当作可用验收。发送开关保持关闭，本轮不发送邮件、不修改联系人营销许可。Gmail 顶部退订按钮是否显示由 Gmail 决定。

参考：
- https://developers.openai.com/plugins/build/auth
- https://learn.chatgpt.com/docs/enterprise/plugin-management
- https://supabase.com/docs/guides/auth/oauth-server/oauth-flows
