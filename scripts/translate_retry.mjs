// Retry translation for missed resources with delays between calls
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(readFileSync('/app/.env', 'utf-8').split('\n').filter(l => l.trim() && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } })

const LLM_KEY = 'sk-emergent-026E422B6E8Ac4aAbE'
const LLM_URL = 'https://integrations.emergentagent.com/llm/chat/completions'
const NEW_LANGS = ['de', 'fr', 'nl', 'es', 'it', 'ru']
const LANG_NAMES = { de: 'German', fr: 'French', nl: 'Dutch', es: 'Spanish', it: 'Italian', ru: 'Russian' }

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function callLLM(src, maxRetries = 6) {
  const system = 'Localization engine. Return ONLY valid JSON. Preserve product/brand/model names (Claude, ChatGPT, GPT-4o, Sonnet, MDN, API, etc.) unchanged.'
  const user = `Translate this English JSON to 6 languages: ${NEW_LANGS.map(l => `${l}=${LANG_NAMES[l]}`).join(', ')}. Return JSON: {"de":{...},"fr":{...},"nl":{...},"es":{...},"it":{...},"ru":{...}}. Keep keys/structure identical, translate only values. Brand names stay in English. No commentary.\n\nInput:\n${JSON.stringify(src)}`

  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch(LLM_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${LLM_KEY}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.2, response_format: { type: 'json_object' } }),
    })
    if (res.ok) return JSON.parse((await res.json()).choices[0].message.content)
    const body = await res.text()
    if (body.includes('budget_exceeded') || res.status === 429) {
      const wait = 5000 + i * 3000
      console.log(`    budget/rate limit, wait ${wait}ms (attempt ${i+1}/${maxRetries})`)
      await sleep(wait)
      continue
    }
    throw new Error(`LLM ${res.status}: ${body.slice(0, 200)}`)
  }
  throw new Error('Max retries exceeded')
}

const merge = (existing, next) => ({ ...(existing || {}), ...next })

async function translateResource(slug) {
  console.log(`\n=== ${slug} ===`)
  const { data: r } = await sb.from('resources').select('*').eq('slug', slug).single()
  if (!r) return

  // Skip if already has de/fr/nl/es/it/ru in slogan (already translated)
  if (r.slogan?.de && r.slogan?.fr && r.slogan?.nl && r.slogan?.es && r.slogan?.it && r.slogan?.ru) {
    console.log(`  already translated, skip`)
    return
  }

  const [{ data: infoGrid }, { data: prosCons }, { data: pricing }, { data: screenshots }] = await Promise.all([
    sb.from('info_grid').select('*').eq('resource_id', r.id).order('sort_order'),
    sb.from('pros_cons').select('*').eq('resource_id', r.id).order('sort_order'),
    sb.from('pricing_plans').select('*').eq('resource_id', r.id).order('sort_order'),
    sb.from('screenshots').select('*').eq('resource_id', r.id).order('sort_order'),
  ])

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

  const newSlogan = merge(r.slogan, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.slogan || ''])))
  const newDesc = merge(r.description, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.description || ''])))
  const newName = merge(r.name, Object.fromEntries(NEW_LANGS.map(l => [l, r.name?.en || ''])))
  const newUseCases = merge(r.use_cases, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.use_cases || []])))
  const newHighlights = merge(r.highlights, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.highlights || []])))
  await sb.from('resources').update({ name: newName, slogan: newSlogan, description: newDesc, use_cases: newUseCases, highlights: newHighlights }).eq('id', r.id)

  for (const g of (infoGrid || [])) {
    const gi = source.info_grid.findIndex(x => x.id === g.id); if (gi < 0) continue
    await sb.from('info_grid').update({
      label: merge(g.label, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.info_grid?.[gi]?.label || '']))),
      value: merge(g.value, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.info_grid?.[gi]?.value || '']))),
    }).eq('id', g.id)
  }
  for (const pc of (prosCons || [])) {
    const arr = pc.type === 'pro' ? source.pros : source.cons
    const idx = arr.findIndex(x => x.id === pc.id); if (idx < 0) continue
    const key = pc.type === 'pro' ? 'pros' : 'cons'
    await sb.from('pros_cons').update({ content: merge(pc.content, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.[key]?.[idx]?.content || '']))) }).eq('id', pc.id)
  }
  for (const p of (pricing || [])) {
    const idx = source.pricing.findIndex(x => x.id === p.id); if (idx < 0) continue
    await sb.from('pricing_plans').update({
      name: merge(p.name, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.pricing?.[idx]?.name || '']))),
      price_period: merge(p.price_period, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.pricing?.[idx]?.period || '']))),
      features: (p.features || []).map((f, fi) => merge(f, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.pricing?.[idx]?.features?.[fi] || ''])))),
    }).eq('id', p.id)
  }
  for (const s of (screenshots || [])) {
    if (!s.caption) continue
    const idx = source.screenshots.findIndex(x => x.id === s.id); if (idx < 0) continue
    await sb.from('screenshots').update({ caption: merge(s.caption, Object.fromEntries(NEW_LANGS.map(l => [l, t[l]?.screenshots?.[idx]?.caption || '']))) }).eq('id', s.id)
  }
  console.log(`  ✓ ${slug}`)
}

const slugs = ['chatgpt', 'public-apis', 'papers-with-code']  // the 3 that failed
for (const s of slugs) {
  try { await translateResource(s); await sleep(4000) } catch (e) { console.error(`  ✗ ${s}: ${e.message}`) }
}
console.log('\n✅ Done')
