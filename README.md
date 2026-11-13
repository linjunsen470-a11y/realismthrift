# RealismThrift 项目说明文档

本项目是 RealismThrift 的数字化官网与内容管理系统，用于展示二手服装、鞋、包批发业务，接收海外客户询盘，并维护面向采购买家的英文博客内容。

---

## 一、项目核心组成

1. **对外官网（Next.js）**  
   面向全球客户访问的前台网站，包含首页、产品分类、公司介绍、订购流程、FAQ、联系方式、博客文章和询盘表单。

2. **内容后台（Sanity Studio）**  
   供团队维护博客文章、作者、分类、封面图、正文图片、SEO 标题、SEO 描述和 Open Graph 图片。后台支持 Visual Editing（可视化编辑）和实时预览。

3. **询盘系统（Supabase + Resend + API Route）**
   客户提交后，系统先保存询盘和邮件任务，再由后台发送销售通知与客户确认邮件，失败任务按既有机制重试。

---

## 二、当前主要能力

- **六语种核心页面**：英语保留原网址，西班牙语、法语、阿拉伯语、越南语、印尼语使用独立语言路径；博客及搜索界面保持英文。新会话的适用入口依次参考手动选择、浏览器语言、访问国家和英语；语言菜单始终可用。维护、SEO 与验证边界见 [多语言说明](nextjs/docs/internationalization.md)。
- **完整官网展示**：包含首页、关于我们、联系我们、订购流程、FAQ、Used Brand Clothes、Used Brand Shoes、Used Brand Bags 等页面。
- **产品分类说明**：围绕旧衣、旧鞋、旧包三大业务线，展示产品特点、质量标准、采购建议和询盘入口。
- **博客内容管理**：博客内容由 Sanity 管理，支持英文文章、分类、作者、图文排版、表格、封面图和 SEO 字段。
- **全站搜索**：支持产品、FAQ 和博客内容的站内检索，帮助访客快速找到相关信息。
- **询盘收集**：客户可通过网站表单、WhatsApp 和邮箱联系销售团队。
- **询盘统计与广告归因**：成功询盘触发 GA4 的 `generate_lead`。公开页共用 Google 标签加载 GA4 和 Google Ads 基础标签；Meta Pixel 和 CAPI 通过相同提交 ID 为 `Lead` 去重。各平台的事件与广告后台核验步骤见[测量说明](nextjs/docs/meta-tracking.md)。
- **SEO 基础设施**：已配置页面 Metadata、OpenGraph、Canonical、sitemap.xml、robots.txt、结构化数据和图片 Alt Text。
- **入口与表单漏斗**：记录销售 WhatsApp、邮件、电话点击和询盘开始/失败事件；UTM 使用营销参数白名单，点击不等同于有效询盘。
- **无障碍交互**：提供表单标签、键盘导航和减少动画支持；询盘成功后焦点移至提示标题，WhatsApp 文字按钮采用符合 AA 对比度要求的配色。
- **可视化预览**：博客内容可在 Sanity Studio 中预览实际前台效果，减少发布错误。

---

## 三、快速使用指南

### 1. 发布或修改博客

1. 登录 Sanity Studio 后台。
2. 进入 `Post`。
3. 填写或修改标题、slug、摘要、正文、分类、作者、封面图和 SEO 字段。
4. 上传图片时填写具体 Alt Text。
5. 使用 Presentation 模式预览页面效果。
6. 确认无误后点击 `Publish`。

### 2. 处理客户询盘

客户提交后，询盘先保存到 Supabase，再由邮件任务通知销售并向客户发送英文回执。六种语言共用回执模板。页面显示成功表示询盘已保存，可在 `inquiry_delivery_overview` 中核实投递状态。业务联系邮箱为 `sales@realismthrift.com`。

如果没有收到邮件，请检查：

- 本地运行时检查 `.env.local`；生产环境检查 Vercel Production 中的 `RESEND_API_KEY` 和 `CONTACT_EMAIL`，不要输出密钥值。
- 发件域名是否完成 Resend 验证。
- 邮件是否进入垃圾邮件箱。
- Supabase 的邮件任务状态、每五分钟的定时重试及其实际 HTTP 响应是否正常。数据库权限、发信配置和重试排查见[询盘部署说明](nextjs/supabase/README.md)。

Vercel Preview 的询盘提交返回 503。检查生产环境时使用真实流量和只读日志，不提交测试询盘或合成广告转化。

### 3. 修改网站资料

联系方式、页脚链接和首页经营数据维护在 [siteData.ts](nextjs/data/siteData.ts)。涉及地址、业务数字或产品说明时，同步核对相关页面、翻译和结构化数据。实质内容变更的日期维护在 [sitemap.ts](nextjs/app/sitemap.ts)。

## 四、项目结构与配置

### 1. 目录说明

- `nextjs/`：官网前台代码。
- `sanity/studio-realismthrift/`：Sanity 内容管理后台代码。
- [AGENTS.md](AGENTS.md)：业务背景、团队角色和项目维护规则。
- `Company_Introduction.md`：公司介绍文档。
- `Company_Introduction_Professional.md`：更克制、专业版本的公司介绍。
- [knowledge/README.md](knowledge/README.md)：七份业务问答资料的索引和使用范围。
- `plugins/`：开发信工具的私有插件与操作说明；服务实现位于 `nextjs/outreach/` 和 `nextjs/lib/outreach/`。
- `archive/`：历史审计、临时方案和过期技术文档。本目录已加入 `.gitignore`，后续默认不纳入 Git 版本管理。

### 2. 包管理要求

官网和 Studio 各有一份锁文件，两者均使用 Node.js 24 和 pnpm 10.33.0。从仓库根目录分别进入对应目录执行命令。

常用命令：

```powershell
cd nextjs
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm test:unit
pnpm build
```

Sanity Studio：

```powershell
cd sanity/studio-realismthrift
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

### 3. 关键环境变量

按功能从[环境变量示例](nextjs/.env.example)配置本地或部署环境。部署平台保存真实凭据。

| 维护事项 | 说明 |
| --- | --- |
| 官网语言、自动选择和 SEO | [多语言说明](nextjs/docs/internationalization.md) |
| GA4、Google Ads、Meta 与询盘归因 | [测量说明](nextjs/docs/meta-tracking.md) |
| 询盘入库、回执和重试 | [Supabase 与 Resend](nextjs/supabase/README.md) |
| 开发信、邮箱连接和退订 | [开发信运维](nextjs/outreach/README.md) |
| 博客预览、查询类型生成 | [Sanity Studio](sanity/studio-realismthrift/README.md) |
| 网站自托管字体及许可证 | [字体说明](nextjs/app/fonts/README.md) |

## 五、注意事项与常见问题

### 1. 可视化编辑覆盖范围

目前 Visual Editing 主要用于博客内容预览。首页、产品页、FAQ 等页面大多仍由代码维护，文案调整通常需要开发人员协助。

### 2. 博客 slug 修改

博客 slug 修改后，文章 URL 会变化。当前项目默认不为旧 slug 做重定向，因此修改前应确认旧链接没有重要外部流量或广告投放。

### 3. 图片使用原则

优先使用真实仓库、货堆、分拣、质检、包装等实拍图。避免使用明显 AI 感的精致仓库、物流港口或不真实质检图片。

图片 Alt Text 应描述图片内容，例如：

- `Workers sorting used clothes inside a warehouse area`
- `Used shoes prepared for wholesale batch inspection`

不要写空泛词，例如：

- `premium image`
- `perfect quality`
- `best warehouse`

### 4. 内容表达原则

二手货行业需要真实、克制、可验证的表达。网站内容应避免：

- “每件都是名牌”
- “绝对无瑕疵”
- “全球第一”
- “100% 完美”

更推荐的表达方式：

- “A-Grade means sellable used quality, not new condition.”
- “Light signs of use may appear when the item remains clean, wearable, and functional.”
- “First-pick sourcing improves the starting raw material, but it does not guarantee every item is branded.”

### 5. 发布前检查

发布页面或博客前，建议确认：

- 标题是否清楚。
- 摘要是否准确。
- SEO 标题和描述是否填写。
- 图片是否有具体 Alt Text。
- 联系方式是否正确。
- 页面是否能在移动端正常阅读。
- 询盘入口是否可见。

---

## 六、联系我们

- **WhatsApp**: [+86 17279444062](https://wa.me/8617279444062)
- **Email**: sales@realismthrift.com
- **Address**: RealismThrift (Baisha Alley Weilitang), County Road 193, Yuanzhou Town, Boluo County, Huizhou City, Guangdong Province, China
- **Website**: [www.realismthrift.com](https://www.realismthrift.com)

Copyright 2026 Dongguan Huihe Realismthrift Trading Co., Ltd.
