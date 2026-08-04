import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(readFileSync('/app/.env', 'utf-8').split('\n').filter(l => l.trim()).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } })

const map = {
  claude: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=128',
  chatgpt: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128',
  mdn: 'https://www.google.com/s2/favicons?domain=developer.mozilla.org&sz=128',
  'public-apis': 'https://www.google.com/s2/favicons?domain=github.com&sz=128',
  'awesome-selfhosted': 'https://www.google.com/s2/favicons?domain=awesome-selfhosted.net&sz=128',
  'papers-with-code': 'https://www.google.com/s2/favicons?domain=paperswithcode.com&sz=128',
}
for (const [slug, url] of Object.entries(map)) {
  const { error } = await sb.from('resources').update({ logo_url: url }).eq('slug', slug)
  console.log(slug, error ? error.message : 'ok')
}
