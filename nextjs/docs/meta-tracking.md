# Meta Pixel 与 Conversions API

本说明对应 2026-10-18 的归因修复批次，适用于网站询盘；不涉及 Meta 原生潜在客户广告、目录或 WhatsApp 站外对话事件。

## 事件链路

- 生产公共页面发送浏览器 `PageView`，客户端站内导航继续记录页面访问。
- 询盘成功入库后，服务端发送标准 `Lead`，接口返回 `event_id`；浏览器收到成功响应后使用同值 `eventID` 发送 `Lead`。
- 两端均使用这次询盘的 `submissionId`。相同提交在响应丢失后重试，数据库复用询盘，测量继续复用同一个 ID。
- 重复请求可能再次投递相同 ID 的事件。不能只根据投递次数判断转化计数，Meta 接收端的实际去重率须在事件管理工具确认。
- 不按数据库 `created: false` 一律跳过：首次保存后可能发生测量失败或响应丢失，重试仍需要恢复投递；浏览器也可能直到重试响应成功才有机会发送 Pixel Lead。

关键文件：`app/api/send/route.ts`、`components/InquiryForm.tsx`、`components/Analytics.tsx`、`lib/meta-pixel.ts` 和 `lib/meta-capi.ts`。

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

表单告知与 `/privacy-policy` 已说明向 Meta 分享邮箱和有效国际 WhatsApp 号码的散列值。现有 Supabase 询盘和邮件处理保持原有数据用途；此次修复不修改数据库结构，也不回传历史询盘。

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
| `VERCEL_ENV` | 仅 `production` 启用 Meta，Vercel 自动设置；本地和 Preview 默认关闭。 |
| `NEXT_PUBLIC_META_ENVIRONMENT` | 由 `next.config.ts` 从构建时的 `VERCEL_ENV` 派生，确保浏览器环境隔离；无需单独配置。 |
| `NEXT_PUBLIC_FB_PIXEL_ID` | 数字格式的 Pixel ID；空值回退到生产 ID，无效值禁用 Pixel。环境隔离仍然适用。 |
| `META_CAPI_ACCESS_TOKEN` | 仅服务端读取的生产密钥。缺失时跳过 CAPI，询盘仍成功。 |

完整示例见 `../.env.example`。真实密钥只保存在本地环境或部署平台。修改公开变量或构建时环境后，需要重新构建部署。

## 投递与失败处理

- 同一次 CAPI 调用最多两次尝试，共享约 4 秒等待预算；超时、网络错误、HTTP 429 和 5xx 可有限重试。
- 重试复用完全相同的请求体，包括事件 ID 与发生时间；遇到较长的 `Retry-After`，预算不足则停止。
- 参数和 Token 的常见 4xx 错误不重试。HTTP 成功仍须确认 `events_received === 1`，不能仅凭 HTTP 200 标记投递成功。
- 日志仅保留成功状态、错误类型、HTTP 状态及安全错误代码/追踪标识，不记录 Token、完整请求体、联系信息或匹配散列值。
- 测量失败不改变已接受的询盘结果。本批次采用有限重试，没有新增持久测量队列；进程中断或持续故障仍可能导致漏报。

## 验证与上线检查

在 `nextjs/` 下运行：

```powershell
pnpm test:unit
pnpm exec tsc --noEmit
pnpm exec playwright test tests/analytics.spec.ts --project=chromium --project=mobile-chromium --workers=2
```

Playwright 的本地服务器显式模拟生产 Meta 环境，测试拦截 GA/Meta 传输及询盘 API。不要去掉这些拦截后向生产数据集发送合成转化。

本批次已通过 155 项单元测试、12 项桌面/手机浏览器回归、TypeScript、变更文件 ESLint 与生产构建。浏览器验证涵盖真实落地参数跨页面保留、Cookie 随询盘请求携带、失败后重试复用 ID、缺区号仍可提交及私有页面排除；服务端单元测试覆盖邮箱/电话规范化和请求体仅包含散列值。

这些测试使用模拟依赖，不证明 Meta 后台已接收生产 Lead。部署后需确认：

1. Vercel 生产部署的 Git SHA 与已推送修复一致，生产 Token 已配置。
2. Meta 测试事件中的浏览器 `eventID` 与服务端 `event_id` 一致。
3. 使用真实广告点击产生的询盘核对 `fbc`，并核对邮箱与有效电话匹配字段；普通访问没有 `fbc` 是预期行为。
4. 按修复部署后的独立日期窗口查看去重率、参数覆盖率和事件匹配质量，不用修复前的混合历史窗口判断效果。
