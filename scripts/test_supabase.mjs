import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const envRaw = readFileSync('/app/.env', 'utf-8')
const env = Object.fromEntries(
  envRaw.split('\n').filter(l => l.trim() && !l.startsWith('#')).map(l => {
    const i = l.indexOf('=')
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
  })
)

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data, error } = await sb.from('resources').select('slug').limit(1)
console.log('resources check:', error ? `ERROR: ${error.message}` : `OK, ${data.length} rows`)

const { data: c, error: ce } = await sb.from('categories').select('slug').limit(1)
console.log('categories check:', ce ? `ERROR: ${ce.message}` : `OK, ${c.length} rows`)
