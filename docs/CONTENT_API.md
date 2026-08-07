# 内容发布 API 文档

用于发布/管理 `resources`（工具/资源/推荐条目）内容。发布时只需提供**中文（zh）**内容，系统会自动调用 OpenAI 将其翻译为其余 9 种语言（en/ja/ko/de/fr/nl/es/it/ru）并写入数据库。

网站的 SEO（`generateMetadata`）、`sitemap.xml`（含 hreflang alternates）、以及各语言页面都是直接从这些多语言字段读取的，**发布后无需任何额外操作即可在所有语言站点同步生效**。

## 环境变量配置

在 `.env.local` / 部署平台的环境变量中添加：

```bash
# 已有（Supabase）
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# 新增：内容发布 API 的鉴权密钥（自己生成一个随机字符串）
CONTENT_API_KEY=your-random-secret-key

# 新增：自动翻译用的 OpenAI Key（未配置则跳过翻译，直接复用中文文本作为兜底）
OPENAI_API_KEY=sk-...
# 可选，默认 gpt-4o-mini
OPENAI_TRANSLATE_MODEL=gpt-4o-mini

# 新增：图片上传 -> 提交到「专门的媒体仓库」（与代码仓库完全分离），通过 jsDelivr CDN 加速
# 步骤：
#   1. 新建一个空的 PUBLIC 仓库，例如 alaolo-media（必须公开，jsDelivr 才能读取）
#   2. 生成一个 fine-grained PAT，Repository access 只勾选这个新仓库，权限选 Contents: Read and write
#   3. 填入下面几个变量（指向新仓库，不是代码仓库！）
GITHUB_MEDIA_TOKEN=github_pat_xxx
GITHUB_MEDIA_OWNER=lonzo-huang
GITHUB_MEDIA_REPO=alaolo-media
GITHUB_MEDIA_BRANCH=main

# 新增：PDF/大文件上传 -> Cloudflare R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=alaolo-files
# R2 桶的公开访问域名（R2.dev 公共 URL 或绑定的自定义域名）
R2_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev
```

## 鉴权

所有写操作（POST / PATCH / DELETE）需要在请求头中带上：

```
x-api-key: <CONTENT_API_KEY>
```

GET 为只读，暂不需要鉴权。

---

## `POST /api/upload` — 上传图片 / 文件（多媒体资产）

`multipart/form-data`，字段：

| 字段 | 必填 | 说明 |
|---|---|---|
| `file` | ✅ | 要上传的文件 |
| `type` | 否 | `image`（默认，走 GitHub+jsDelivr）或 `file`（走 Cloudflare R2） |
| `folder` | 否 | 子目录，默认 `images` 或 `files` |

**图片（`type=image`，默认）**：
- 通过 GitHub Contents API 真正提交一个 commit 到本仓库 `public/images/` 目录
- 返回的 `url` 是锁定该次 commit SHA 的 jsDelivr 链接，**立即生效、不会被 CDN 缓存拖慢**
- 限制：单文件 ≤ 1.5MB（GitHub Contents API 对大文件不稳定），超出会返回 `400` 并提示改用 `type=file`

**文件（`type=file`，PDF / 大文件）**：
- 直接上传到 Cloudflare R2，返回 R2 公开域名的 URL
- 无大小限制顾虑（R2 支持到 5TB/对象）

**响应示例（图片）**：
```json
{
  "ok": true,
  "url": "https://cdn.jsdelivr.net/gh/lonzo-huang/alaolo-media@a1b2c3d/images/tools/1699999999-chatgpt-logo.png",
  "path": "images/tools/1699999999-chatgpt-logo.png",
  "commitSha": "a1b2c3d...",
  "jsdelivrLatestUrl": "https://cdn.jsdelivr.net/gh/lonzo-huang/alaolo-media@main/images/tools/1699999999-chatgpt-logo.png",
  "githubRawUrl": "https://raw.githubusercontent.com/lonzo-huang/alaolo-media/main/images/tools/1699999999-chatgpt-logo.png"
}
```

**curl 示例**：
```bash
curl -X POST https://your-domain.com/api/upload \
  -H "x-api-key: your-random-secret-key" \
  -F "file=@./chatgpt-logo.png" \
  -F "type=image" \
  -F "folder=images/tools"

curl -X POST https://your-domain.com/api/upload \
  -H "x-api-key: your-random-secret-key" \
  -F "file=@./whitepaper.pdf" \
  -F "type=file" \
  -F "folder=files/docs"
```

上传得到的 `url` 直接填入 `/api/resources` 的 `logo_url` / `cover_url` 字段，或文章正文里引用即可。

---

## `POST /api/resources` — 发布新内容

**Body**（仅需中文）：

```json
{
  "slug": "chatgpt",
  "category": "ai-chatbots",
  "website_url": "https://chat.openai.com",
  "logo_url": "https://.../logo.png",
  "cover_url": "https://.../cover.png",
  "brand_color": "#F5C518",
  "featured": true,
  "editors_pick": false,
  "trending": true,
  "content": {
    "name": "ChatGPT",
    "slogan": "由 OpenAI 打造的对话式 AI 助手",
    "description": "ChatGPT 是一个强大的大语言模型助手，可以...",
    "use_cases": ["写作辅助", "代码调试", "头脑风暴"],
    "highlights": ["支持插件生态", "多模态输入", "响应速度快"]
  },
  "pros": ["回答质量高", "生态成熟"],
  "cons": ["免费额度有限"]
}
```

**必填字段**：`slug`、`website_url`、`content.name`。

**响应**（`201`）：

```json
{ "ok": true, "resource": { "id": "...", "slug": "chatgpt", "name": {"zh":"ChatGPT","en":"ChatGPT",...}, ... } }
```

- `slug` 已存在会返回 `409`。
- `category` 传的是分类的 `slug`（对应 `categories` 表），不存在会返回 `400`。

---

## `PATCH /api/resources?slug=chatgpt` — 更新内容

Body 支持部分字段更新，只传需要改的字段即可。若传了 `content` 中的任意字段，会重新翻译对应字段（其余字段保持不变）。

```json
{
  "content": { "description": "更新后的中文描述..." },
  "featured": true
}
```

---

## `DELETE /api/resources?slug=chatgpt` — 删除

无 Body，删除后会级联删除关联的 `pros_cons` / `info_grid` / `pricing_plans` / `screenshots` 等子表数据。

---

## `GET /api/resources` — 列表（无需鉴权）

```
GET /api/resources?category=ai-chatbots&limit=20
```

## `GET /api/resources?slug=chatgpt` — 详情（无需鉴权）

返回完整字段（含 `pros_cons` / `info_grid` / `pricing_plans`）。

---

## 覆盖范围与限制

- 当前自动翻译覆盖字段：`name`、`slogan`、`description`、`use_cases`、`highlights`、`pros`、`cons`（网站上最主要的 SEO/展示文本）。
- `info_grid`（信息卡片）、`pricing_plans`（价格方案）、`screenshots`（截图）暂不支持通过此 API 创建，如需要请直接在 Supabase 后台按已有 schema（见 `supabase/migrations/001_init.sql`）写入，字段结构与 `resources` 一致（JSONB 多语言对象 `{zh, en, ja, ...}`）。
- 翻译使用 OpenAI JSON mode，每次发布/更新会产生 9 次 API 调用（每语言 1 次，一次性翻译该次涉及的所有字段），未配置 `OPENAI_API_KEY` 时会直接回退为中文文本。
- 建议先在测试环境验证翻译质量后再用于生产内容发布。

### GitHub + jsDelivr 图片方案的已知取舍

- 图片提交到**专门的媒体仓库**（`GITHUB_MEDIA_REPO`），与代码仓库（本仓库）完全分离 —— 代码仓库的体积、clone 速度、CI 构建时间都不受影响。
- 媒体仓库本身依然会随图片数量持续增长（历史 commit 不会自动清理），这是 Git 的天然特性，与放哪个仓库无关。免费、集成简单、jsDelivr 全球 CDN 加速是优点；代价是长期图片量很大（比如上万张）之后这个媒体仓库体积会变大，如果将来要迁移/清理会麻烦一些。
- 如果图片量级预期会做到"海量文章配图"的规模，建议图片也走 R2（用 `type=file`），只把 GitHub+jsDelivr 用于中小规模或者固定资源（logo、图标等）。当前 API 两种方式都支持，按需选择即可。
- jsDelivr 对 `@分支名` 形式的链接有缓存（最长约 7 天），本 API 返回的 `url` 是锁定 commit SHA 的链接，不受此缓存影响，可放心直接使用。
- PDF 依然建议走 R2，不建议塞进媒体仓库：GitHub 单文件硬限制 100MB，Contents API 对超过 ~1-1.5MB 的文件也不稳定，新建仓库不会改变这个限制。

## 示例（curl）

```bash
curl -X POST https://your-domain.com/api/resources \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-random-secret-key" \
  -d '{
    "slug": "example-tool",
    "category": "ai-tools",
    "website_url": "https://example.com",
    "content": {
      "name": "示例工具",
      "slogan": "一句话介绍这个工具",
      "description": "详细描述...",
      "use_cases": ["场景一", "场景二"],
      "highlights": ["亮点一", "亮点二"]
    },
    "pros": ["优点一"],
    "cons": ["缺点一"]
  }'
```
