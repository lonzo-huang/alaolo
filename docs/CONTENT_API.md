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
```

## 鉴权

所有写操作（POST / PATCH / DELETE）需要在请求头中带上：

```
x-api-key: <CONTENT_API_KEY>
```

GET 为只读，暂不需要鉴权。

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
