# RealismThrift 专用开发信插件：轻量实现

## 目标与第一版

复用 www.realismthrift.com 的 Vercel 网关、现有 Neon 联系人状态和 Jason 的 Gmail 授权。插件独立命名 RealismThrift Cold Email；不绑定通用 Gmail 插件，不复制收件箱或建立新的 CRM。

邮件为纯文本和 HTML 双版本：560px 最大宽度、白底、系统字体、小型金色品牌线、Jason 签名、公司地址和文字退订链接。输入仅为主题和短段落，服务器转义内容；不接受自由 HTML、追踪像素、图片或附件。旧邮件和已经批准的旧草稿不改写。初版不加入自动跟进、多邮箱轮换或群发。

第一版五个工具：
- lookup_cold_email_contact：查询一个已有联系人的来源及营销状态。
- create_cold_email_draft：为已有人工审核记录、未退订且未暂停的联系人保存一封 HTML/纯文本草稿；不发送。
- review_outreach_draft：读取已保存原文，检查资格、来信及退订页脚，返回 fingerprint。
- send_approved_outreach：针对确切草稿取得本人批准后，沿用已有即时抑制、额度和发送对账机制。
- reconcile_outreach_send：只对账结果不明的发送，不能自动重发。

MCP 层只接受 cold_marketing 消息，requested_reply 不在此插件内。普通 Gmail 插件继续用于其他邮件。服务器不开放全邮箱搜索、任意 Gmail API、直接恢复订阅、绕过回复暂停、批量导入或自动准入工具。

## 操作流程

先确认联系人存在并已有人工准入记录 → 起草短邮件 → 保存真实 Gmail 草稿 → 读取原草稿审核 → 本人批准 → 网关发送。联系人不符合条件时停止，来源或准入审核继续由现有管理员流程处理。

先用此版本验证一个合法联系人；只有成功连接、真实草稿读取/发送验收后，才考虑第二版：按明确定义的字段导入待审核联系人、专用待审列表、多语言文案。多邮箱需要分别的凭据、额度和抑制一致性设计，不在首版实施。

## 连接与权限

真实 MCP 地址为 https://www.realismthrift.com/api/mcp，streamable-http。公开资源元数据能返回 Supabase 授权服务器，未认证 MCP 返回 401。Gmail 网站授权与 ChatGPT 插件 OAuth 是两层独立授权；已有 Gmail connected 不等于插件 connected。

发现的接入缺口：
1. Supabase 当前静态 OAuth 客户端 0634381c-0081-451c-a9a9-714d3356f297（RealismThrift Outreach MCP）为 confidential，redirect_uri 指向网站自己的 /api/outreach/auth/callback。这不是已验证的 ChatGPT 插件回调，不能把它当作可用连接。
2. 服务器需要 OUTREACH_OAUTH_CLIENT_ID 固定为实际插件客户端。未配置时保持拒绝连接，不能临时接受所有 OAuth 客户端。
3. Supabase 当前 OAuth access token 使用 aud=authenticated；代码已按其官方文档修正并保留 issuer、签名算法、过期时间、管理员 sub、client_id 的强校验。普通网站登录 token 缺少 client_id，仍被拒绝。

插件保存后，从该插件的实际连接设置读取准确的 OAuth redirect URI 和客户端身份。创建或修正 Supabase 静态客户端；配置正确的授权页面和相应 Vercel client_id。若平台明确支持并要求 DCR，则需单独审查启用方式与具体客户端登记；不为方便连接开放任意客户端。不把 OAuth secret 放入插件 ZIP、Git 或聊天。

新的插件访问授权须由本人在 ChatGPT 的连接流程确认。第一项测试只调用只读 lookup，不发送或恢复任何订阅。连接通过后才能称为插件端到端可用。

## 验收与上线边界

31 项相关单元测试、类型检查和相关 ESLint 已通过；包含内容 HTML 转义、真实 MIME 双版本、退订联系人/暂停会话拒绝起草、无发送调用、普通 Supabase token 和其他客户端/用户被拒绝。

私有插件包与部署结果随后记录于本地验收文件。发送开关保持关闭，测试地址保持退订。本轮没有实际发送邮件或修改联系人营销许可。新 HTML 样式尚需正式插件连接后的受控收件验收；不能把本地截图视为 Gmail 实际显示验收。

参考：
- https://supabase.com/docs/guides/auth/oauth-server/oauth-flows
- https://supabase.com/docs/guides/auth/oauth-server/mcp-authentication

