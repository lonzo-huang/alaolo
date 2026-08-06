// Translate all 6 seeded resources' JSONB content to 6 new languages (de/fr/nl/es/it/ru)
// Uses Emergent Universal LLM key with OpenAI-compatible endpoint
// Run: node scripts/translate.mjs
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(readFileSync('/app/.env', 'utf-8').split('\n').filter(l => l.trim() && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } })

const LLM_KEY = 'sk-emergent-026E422B6E8Ac4aAbE'
const LLM_URL = 'https://integrations.emergentagent.com/llm/chat/completions'
const NEW_LANGS = ['de', 'fr', 'nl', 'es', 'it', 'ru']
const LANG_NAMES = {
  de: 'German', fr: 'French', nl: 'Dutch', es: 'Spanish', it: 'Italian', ru: 'Russian',
}

async function callLLM(englishSource) {
  const system = 'You are a professional localization engine. Return ONLY valid JSON. Preserve technical terms (product names, brand names, "GPT-4o", "API", "Sonnet", "SOTA", "Web", "MDN", "PDF", model versions) in their original form.'
  const user = `Translate this English JSON content into these 6 languages: ${NEW_LANGS.map(l => `${l} (${LANG_NAMES[l]})`).join(', ')}.

Return JSON in this exact shape:
{
  "de": { ...same keys as input, values translated to German... },
  "fr": { ...French... },
  "nl": { ...Dutch... },
  "es": { ...Spanish... },
  "it": { ...Italian... },
  "ru": { ...Russian... }
}

Rules:
- Do NOT translate keys, only values
- Preserve array lengths and structure exactly
- Brand names, product names, model names stay in English (Claude, ChatGPT, GPT-4o, Sonnet, MDN, Web API, etc.)
- Keep tone natural and native, not literal
- Do not add comments, do not wrap in code fences

Input English JSON:
${JSON.stringify(englishSource, null, 2)}`

  const res = await fetch(LLM_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${LLM_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  })
  if (!res.ok) throw new Error(`LLM ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return JSON.parse(data.choices[0].message.content)
}

// Merge new language translations into an existing JSONB field
// existing = { en: "...", zh: "...", ja: "...", ko: "..." }, newTrans = { de: "...", fr: "...", ... }
// Result: { en, zh, ja, ko, de, fr, nl, es, it, ru }
function merge(existing, newTrans) {
  return { ...(existing || {}), ...newTrans }
}

async function translateResource(slug) {
  console.log(`\n=== ${slug} ===`)
  // 1. Fetch resource + all children
  const { data: r } = await sb.from('resources').select('*').eq('slug', slug).single()
  if (!r) { console.log('  not found, skip'); return }

  const [{ data: infoGrid }, { data: prosCons }, { data: pricing }, { data: screenshots }] = await Promise.all([
    sb.from('info_grid').select('*').eq('resource_id', r.id).order('sort_order'),
    sb.from('pros_cons').select('*').eq('resource_id', r.id).order('sort_order'),
    sb.from('pricing_plans').select('*').eq('resource_id', r.id).order('sort_order'),
    sb.from('screenshots').select('*').eq('resource_id', r.id).order('sort_order'),
  ])

  // 2. Build English source
  const source = {
    slogan: r.slogan?.en || '',
    description: r.description?.en || '',
    use_cases: r.use_cases?.en || [],
    highlights: r.highlights?.en || [],
    info_grid: (infoGrid || []).map(g => ({ id: g.id, label: g.label?.en || '', value: g.value?.en || '' })),
    pros: (prosCons || []).filter(pc => pc.type === 'pro').map(p => ({ id: p.id, content: p.content?.en || '' })),
    cons: (prosCons || []).filter(pc => pc.type === 'con').map(c => ({ id: c.id, content: c.content?.en || '' })),
    pricing: (pricing || []).map(p => ({ id: p.id, name: p.name?.en || '', period: p.price_period?.en || '', features: (p.features || []).map(f => f?.en || '') })),
    screenshots: (screenshots || []).filter(s => s.caption).map(s => ({ id: s.id, caption: s.caption?.en || '' })),
  }

  console.log('  calling LLM...')
  const t = await callLLM(source)
  console.log(`  got ${Object.keys(t).join(',')}`)

  // 3. Merge per-language translations into JSONB
  // Resource
  const newSlogan = merge(r.slogan, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.slogan || ''])))
  const newDesc = merge(r.description, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.description || ''])))
  const newName = merge(r.name, Object.fromEntries(NEW_LANGS.map(l => [l, r.name?.en || ''])))  // brand name stays
  const newUseCases = merge(r.use_cases, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.use_cases || []])))
  const newHighlights = merge(r.highlights, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.highlights || []])))
  await sb.from('resources').update({
    name: newName, slogan: newSlogan, description: newDesc,
    use_cases: newUseCases, highlights: newHighlights,
  }).eq('id', r.id)

  // info_grid
  for (const g of (infoGrid || [])) {
    const gt = source.info_grid.findIndex(x => x.id === g.id)
    if (gt < 0) continue
    const newLabel = merge(g.label, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.info_grid?.[gt]?.label || ''])))
    const newValue = merge(g.value, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.info_grid?.[gt]?.value || ''])))
    await sb.from('info_grid').update({ label: newLabel, value: newValue }).eq('id', g.id)
  }

  // pros_cons
  const prosArr = source.pros
  const consArr = source.cons
  for (const pc of (prosCons || [])) {
    const arr = pc.type === 'pro' ? prosArr : consArr
    const idx = arr.findIndex(x => x.id === pc.id)
    if (idx < 0) continue
    const key = pc.type === 'pro' ? 'pros' : 'cons'
    const newContent = merge(pc.content, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.[key]?.[idx]?.content || ''])))
    await sb.from('pros_cons').update({ content: newContent }).eq('id', pc.id)
  }

  // pricing_plans
  for (const p of (pricing || [])) {
    const idx = source.pricing.findIndex(x => x.id === p.id)
    if (idx < 0) continue
    const newName = merge(p.name, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.pricing?.[idx]?.name || ''])))
    const newPeriod = merge(p.price_period, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.pricing?.[idx]?.period || ''])))
    const newFeatures = (p.features || []).map((f, fi) => merge(f, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.pricing?.[idx]?.features?.[fi] || '']))))
    await sb.from('pricing_plans').update({ name: newName, price_period: newPeriod, features: newFeatures }).eq('id', p.id)
  }

  // screenshots
  for (const s of (screenshots || [])) {
    if (!s.caption) continue
    const idx = source.screenshots.findIndex(x => x.id === s.id)
    if (idx < 0) continue
    const newCaption = merge(s.caption, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.screenshots?.[idx]?.caption || ''])))
    await sb.from('screenshots').update({ caption: newCaption }).eq('id', s.id)
  }

  // Categories - translate category names once (share across resources but do only once)
  console.log(`  ✓ ${slug} updated`)
}

async function translateCategories() {
  console.log('\n=== categories ===')
  const { data: cats } = await sb.from('categories').select('*')
  const source = Object.fromEntries((cats || []).map(c => [c.slug, c.name?.en || '']))
  const catT = await callLLM({ categories: source })
  for (const c of (cats || [])) {
    const newName = merge(c.name, Object.fromEntries(NEW_LANGS.map(l => [l, catT[l]?.categories?.[c.slug] || c.name?.en || ''])))
    await sb.from('categories').update({ name: newName }).eq('id', c.id)
    console.log(`  ✓ ${c.slug}`)
  }
}

const slugs = ['claude', 'chatgpt', 'mdn', 'public-apis', 'awesome-selfhosted', 'papers-with-code']
console.log(`Translating ${slugs.length} resources + categories to ${NEW_LANGS.join('/')} ...`)
await translateCategories()
for (const s of slugs) {
  try { await translateResource(s) } catch (e) { console.error(`  ✗ ${s}:`, e.message) }
}
console.log('\n✅ Done')
