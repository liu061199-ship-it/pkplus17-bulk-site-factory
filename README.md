# Bulk Site Factory

一个最小可运行的批量静态建站系统。通过 `sites/sites.json` 配置多个网站，通过 `content/articles.json` 维护文章，然后运行生成命令，一次性输出多个可部署的静态网站。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- JSON 配置驱动
- GitHub Actions 自动生成与构建

## 目录结构

```text
sites/sites.json          网站配置
content/articles.json     文章内容
data/sites.csv            批量导入网站配置的表格模板
templates/                静态 HTML 模板
scripts/import-sites.ts   CSV 导入脚本
scripts/generate-sites.ts 批量生成脚本
public/logos/             Logo 静态资源
output/                   生成后的网站文件
```

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`，可以预览 `sites/sites.json` 中配置的网站。

## 如何添加新网站

在 `sites/sites.json` 中新增一个对象：

```json
{
  "slug": "my-site",
  "siteName": "My Site",
  "domain": "my-site.com",
  "logo": "/logos/my-site.svg",
  "themeColor": "#0f766e",
  "title": "My Site",
  "description": "My generated static website.",
  "keywords": ["site", "static"],
  "contactEmail": "hello@my-site.com",
  "heroTitle": "Welcome to My Site",
  "heroSubtitle": "Generated from sites.json.",
  "articles": [
    "launch-checklist",
    "seo-basics",
    "content-planning",
    "deployment-options",
    "performance-tips"
  ]
}
```

字段说明：

- `slug`：输出目录名和本地预览路径。
- `domain`：用于生成该站点的 `sitemap.xml` 和 `robots.txt`。
- `logo`：放在 `public/logos` 下的 Logo 路径。
- `themeColor`：站点主题色。
- `title`、`description`、`keywords`：SEO 信息。
- `articles`：引用 `content/articles.json` 里的文章 `slug`。

## 如何添加文章

在 `content/articles.json` 中新增文章：

```json
{
  "slug": "new-article",
  "title": "New Article",
  "description": "Article summary.",
  "date": "2026-06-21",
  "content": "Article body."
}
```

然后把 `new-article` 加到对应网站的 `articles` 数组中。

## 如何用 CSV 批量导入网站

当网站数量达到 10、50、100、200 个时，建议先维护 `data/sites.csv`，再自动生成 `sites/sites.json`。

CSV 表头固定为：

```text
slug,template,contentFramework,siteName,domain,logo,themeColor,title,description,keywords,contactEmail,heroTitle,heroSubtitle,appVersion,appSize,downloadUrl,offerText,paymentMethods,featureBullets,articles
```

其中：

- `keywords` 使用英文分号分隔，例如 `seo;static site;local business`。
- `articles` 使用英文分号分隔，例如 `launch-checklist;seo-basics;content-planning`。
- `template` 决定首页模板，目前支持：
  - `download-landing`
  - `review-magazine`
  - `bonus-guide`
  - `howto-tutorial`
  - `updates-hub`
- `contentFramework` 用来标记内容框架，例如 Download Landing、Review Magazine、Tutorial Hub。
- 每一行代表一个网站，方便在 Excel、Google Sheets 或普通文本编辑器中复制修改。

导入命令：

```bash
npm run import:sites
```

也可以指定其他 CSV 文件：

```bash
npm run import:sites -- data/my-sites.csv
```

推荐批量流程：

```bash
npm run import:sites
npm run generate
npm run build
```

## 如何批量生成

```bash
npm run generate
```

生成结果：

```text
output/<site-slug>/index.html
output/<site-slug>/about/index.html
output/<site-slug>/contact/index.html
output/<site-slug>/blog/index.html
output/<site-slug>/blog/<article-slug>/index.html
output/<site-slug>/sitemap.xml
output/<site-slug>/robots.txt
```

## GitHub Actions

项目已添加 `.github/workflows/build.yml`。

触发条件：

- push 到 `main` 分支时自动运行。

自动流程：

```bash
npm install
npm run generate
npm run build
```

构建完成后会上传两个构建产物：

- `generated-sites`：`output/` 中的批量静态站点文件。
- `next-build`：`.next/` 中的 Next.js 构建结果。

## PKPlus17 SEO 模板说明

本项目已加入面向 Pakistan APK 搜索意图的 PKPlus17 SEO 模板方向：

- 移动优先 APK 落地页
- 下载 CTA
- APK 信息卡
- 注册、安装、充值提现、功能和 FAQ 区块
- 文章集群内链
- `MobileApplication` JSON-LD
- 支持 5 种不同首页模板和内容框架：
  - Download Landing Page
  - Review Magazine Article
  - Step-by-Step Tutorial Hub
  - Bonus and Promotion Guide
  - News and Updates Hub

详细拆解见 `docs/pkplus17-seo-analysis.md`。

## 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

当前最小版本只需要：

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

说明：

- `NEXT_PUBLIC_APP_URL` 用于 Next.js 预览应用的根级 `sitemap.xml`。
- 批量生成的静态站点使用 `sites/sites.json` 中每个网站的 `domain` 字段生成站点级 `sitemap.xml` 和 `robots.txt`。

## 部署到 Vercel

部署 Next.js 预览应用：

1. 将 GitHub 仓库导入 Vercel。
2. Framework Preset 选择 `Next.js`。
3. Install Command 使用 `npm install`。
4. Build Command 使用 `npm run build`。
5. 如果需要预览应用 sitemap，设置环境变量 `NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app`。

如果你要部署批量生成后的纯静态站点：

1. 先运行 `npm run generate`。
2. 选择 `output/<site-slug>` 作为静态站根目录。
3. 将该目录上传到支持静态文件托管的平台，或为每个站点单独创建部署项目。

## 部署到 Cloudflare Pages

部署 Next.js 预览应用：

1. 在 Cloudflare Pages 连接 GitHub 仓库。
2. Framework preset 选择 `Next.js`。
3. Build command 填写 `npm run build`。
4. 设置环境变量 `NEXT_PUBLIC_APP_URL=https://your-pages-domain.pages.dev`。

部署生成后的纯静态站点：

1. 运行 `npm run generate`。
2. 选择 `output/<site-slug>` 作为静态站根目录。
3. Build command 可填写 `npm run generate`。
4. Output directory 填写对应站点目录，例如 `output/northstar-studio`。
5. 绑定 `sites/sites.json` 中配置的对应域名。

## 常用命令

```bash
npm run dev
npm run import:sites
npm run generate
npm run build
```
