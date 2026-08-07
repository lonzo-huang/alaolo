// Auto-translation helper: takes Chinese (zh) content and generates
// translations for all other supported locales using OpenAI.
// Requires OPENAI_API_KEY in the environment. If not set, translation is
// skipped and the zh text is reused as a fallback for every locale (so the
// site still works, just without real translations).

const TARGET_LOCALES = ['en', 'ja', 'ko', 'de', 'fr', 'nl', 'es', 'it', 'ru']

const LANG_NAMES = {
  en: 'English', ja: 'Japanese', ko: 'Korean', de: 'German', fr: 'French',
  nl: 'Dutch', es: 'Spanish', it: 'Italian', ru: 'Russian',
}

async function translateJSON(zhObj, targetLang) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return zhObj
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.OPENAI_TRANSLATE_MODEL || 'gpt-4o-mini',
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a professional localization translator. Translate every string value in the given JSON object from Chinese to ${targetLang}. Keep the exact same JSON keys and structure (including arrays). Never translate keys, only values. Keep tone natural and concise, suitable for a website. Return valid JSON only, no markdown, no explanations.`,
        },
        { role: 'user', content: JSON.stringify(zhObj) },
      ],
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Translation API error ${res.status}: ${text}`)
  }
  const data = await res.json()
  try {
    return JSON.parse(data.choices[0].message.content)
  } catch {
    return zhObj
  }
}

/**
 * Translate a flat object of zh strings/arrays-of-strings into all target locales.
 * Input:  { name: '工具名', slogan: '...', use_cases: ['场景1','场景2'] }
 * Output: { name: { zh: '工具名', en: '...', ja: '...', ... }, slogan: {...}, use_cases: {...} }
 */
export async function translateToAllLocales(zhContent) {
  const perLocale = await Promise.all(
    TARGET_LOCALES.map(async (loc) => [loc, await translateJSON(zhContent, LANG_NAMES[loc])])
  )
  const result = {}
  for (const key of Object.keys(zhContent)) {
    result[key] = { zh: zhContent[key] }
    for (const [loc, obj] of perLocale) {
      result[key][loc] = obj?.[key] ?? zhContent[key]
    }
  }
  return result
}

/**
 * Convert a locale-keyed object of arrays into an array of locale-keyed objects.
 * Input:  { zh: ['a','b'], en: ['A','B'] }
 * Output: [{ zh: 'a', en: 'A' }, { zh: 'b', en: 'B' }]
 */
export function transposeLocaleArrays(localesObj) {
  const locs = Object.keys(localesObj)
  const len = localesObj.zh?.length || 0
  const out = []
  for (let i = 0; i < len; i++) {
    const item = {}
    for (const loc of locs) item[loc] = localesObj[loc]?.[i] ?? ''
    out.push(item)
  }
  return out
}

export { TARGET_LOCALES, LANG_NAMES }
