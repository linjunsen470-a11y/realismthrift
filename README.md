# RealismThrift 项目说明文档

本项目是 RealismThrift 的数字化官网与内容管理系统，用于展示二手服装、鞋、包批发业务，接收海外客户询盘，并维护面向采购买家的英文博客内容。

---

## 一、项目核心组成

1. **对外官网（Next.js）**  
   面向全球客户访问的前台网站，包含首页、产品分类、公司介绍、订购流程、FAQ、联系方式、博客文章和询盘表单。

2. **内容后台（Sanity Studio）**  
   供团队维护博客文章、作者、分类、封面图、正文图片、SEO 标题、SEO 描述和 Open Graph 图片。后台支持 Visual Editing（可视化编辑）和实时预览。

3. **询盘系统（Resend + API Route）**  
   客户提交表单后，系统会把询盘内容发送到指定销售邮箱，方便销售团队跟进海外买家。

---

## 二、当前主要能力

- **完整官网展示**：包含首页、关于我们、联系我们、订购流程、FAQ、Used Brand Clothes、Used Brand Shoes、Used Brand Bags 等页面。
- **产品分类说明**：围绕旧衣、旧鞋、旧包三大业务线，展示产品特点、质量标准、采购建议和询盘入口。
- **博客内容管理**：博客内容由 Sanity 管理，支持英文文章、分类、作者、图文排版、表格、封面图和 SEO 字段。
- **全站搜索**：支持产品、FAQ 和博客内容的站内检索，帮助访客快速找到相关信息。
- **询盘收集**：客户可通过网站表单、WhatsApp 和邮箱联系销售团队。
- **SEO 基础设施**：已配置页面 Metadata、OpenGraph、Canonical、sitemap.xml、robots.txt、结构化数据和图片 Alt Text。
- **可视化预览**：博客内容可在 Sanity Studio 中预览实际前台效果，减少发布错误。

---

## 三、重构与优化亮点

本项目基于 RealismThrift 官网业务重新整理，在保持品牌识别的基础上，重点优化了内容可信度、页面结构和海外买家体验。

1. **视觉与交互优化**  
   网站采用统一的品牌视觉风格，并对图标、间距、响应式布局和移动端显示进行了调整，使页面更适合海外 B2B 买家浏览。

2. **业务模块补齐**  
   完整覆盖 Used Brand Clothes、Used Brand Shoes、Used Brand Bags 三类核心产品，不再只依赖单一产品页面。

3. **博客内容生态**  
   独立搭建 Blog 模块，并接入 Sanity Studio。博客文章改为面向海外采购商的英文实务笔记，内容重点包括货源、分级、混批、装柜和出口准备。

4. **内容可信度修正**  
   旧站中过于夸张或不符合二手货行业实际的表达已逐步调整，例如避免“每件都是名牌”“完美无瑕”等绝对承诺，改为解释真实的 A-Grade 标准和可接受轻微使用痕迹。

5. **SEO 与 AEO 优化**  
   网站已配置面向搜索引擎和 AI 答案引擎的基础结构，包括：
   - 页面标题和描述。
   - OpenGraph 分享信息。
   - sitemap.xml 和 robots.txt。
   - 产品、FAQ、文章、博客列表和面包屑结构化数据。
   - 具体、可理解的图片 Alt Text。

6. **询盘链路实装**  
   表单系统已连接邮件发送服务。只要环境变量配置正确，客户询盘即可发送到销售邮箱。

---

## 四、快速使用指南

### 1. 发布或修改博客

1. 登录 Sanity Studio 后台。
2. 进入 `Post`。
3. 填写或修改标题、slug、摘要、正文、分类、作者、封面图和 SEO 字段。
4. 上传图片时填写具体 Alt Text。
5. 使用 Presentation 模式预览页面效果。
6. 确认无误后点击 `Publish`。

> 注意：修改后必须点击 `Publish`，前台网站才会显示正式内容。

### 2. 处理客户询盘

客户提交表单后，系统会自动把询盘发送到配置的销售邮箱。当前业务联系邮箱为：

- `sales@realismthrift.com`

如果没有收到邮件，请检查：

- `.env.local` 中的 `RESEND_API_KEY` 是否正确。
- `CONTACT_EMAIL` 是否设置为正确接收邮箱。
- 发件域名是否完成 Resend 验证。
- 邮件是否进入垃圾邮件箱。

### 3. 修改网站联系信息

全站通用的联系方式、页脚链接和社交媒体地址主要维护在：

- `nextjs/data/siteData.ts`

常见可维护内容包括：

- WhatsApp 电话。
- 邮箱地址。
- 公司地址。
- 页脚链接。
- Facebook、Instagram、YouTube、X 等社交媒体链接。

### 4. 修改首页统计数据

首页展示的部分公司数据也集中维护在：

- `nextjs/data/siteData.ts`

如需调整出口国家数、工厂面积、业务年限等数据，请先确认这些数字与全站其他页面一致，再进行修改。

- 注意：该项目footer中的社媒按钮目前已暂被注释隐藏。

---

## 五、项目结构与配置

### 1. 目录说明

- `nextjs/`：官网前台代码。
- `sanity/studio-realismthrift/`：Sanity 内容管理后台代码。
- `AGENTS.MD`：业务背景、团队角色和项目维护规则。
- `Company_Introduction.md`：公司介绍文档。
- `Company_Introduction_Professional.md`：更克制、专业版本的公司介绍。
- `background-audit.md`：内容审计和可信度优化记录。
- `archive/`：历史审计、临时方案和过期技术文档。本目录已加入 `.gitignore`，后续默认不纳入 Git 版本管理。

### 2. 包管理要求

本项目强制使用 **pnpm** 进行依赖管理。请勿使用 `npm` 或 `yarn`，否则 `preinstall` 钩子会报错。

常用命令：

```powershell
cd nextjs
pnpm install
pnpm dev
pnpm lint
pnpm build
```

Sanity Studio：

```powershell
cd sanity/studio-realismthrift
pnpm install
pnpm dev
pnpm build
```

### 3. 关键环境变量

网站正常运行需要配置环境变量。真实密钥只应保存在本地或部署平台，不应提交到代码仓库。

- `RESEND_API_KEY`：邮件发送服务密钥。
- `CONTACT_EMAIL`：接收询盘的邮箱。
- `CONTACT_FROM_EMAIL`：系统发件邮箱。
- `NEXT_PUBLIC_SANITY_PROJECT_ID`：Sanity 项目 ID。
- `NEXT_PUBLIC_SANITY_DATASET`：Sanity 数据集。
- `NEXT_PUBLIC_SANITY_API_VERSION`：Sanity API 版本。
- `SANITY_API_EDITOR_TOKEN`：用于写入 Sanity 内容的 token。
- `SANITY_API_READ_TOKEN`：用于读取 Sanity 内容的 token。

---

## 六、注意事项与常见问题

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

## 七、联系我们

- **WhatsApp**: [+86 133 6748 1710](https://wa.me/8613367481710)
- **Email**: sales@realismthrift.com
- **Address**: Fuyida Industrial Park, No. 52 Yida Road, Boluo County, Huizhou City, Guangdong Province, China
- **Website**: [www.realismthrift.com](https://www.realismthrift.com)

Copyright 2026 RealismThrift Export Co., Ltd.
