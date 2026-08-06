import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('/app/.env', 'utf-8').split('\n').filter(l => l.trim() && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } })
const { data } = await sb.from('resources').select('slug, slogan')
for (const r of data) {
  const langs = Object.keys(r.slogan || {})
  const missing = ['de','fr','nl','es','it','ru'].filter(l => !langs.includes(l) || !r.slogan[l])
  console.log(r.slug.padEnd(24), 'has:', langs.join(','), missing.length ? `MISSING: ${missing.join(',')}` : '✅')
}
