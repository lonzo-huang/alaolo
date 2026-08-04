// Create the admin user in Supabase Auth + add row in admins table
// Usage: node scripts/create_admin.mjs
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(readFileSync('/app/.env', 'utf-8').split('\n').filter(l => l.trim() && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } })

const ADMIN_EMAIL = 'admin@alaolo.com'
const ADMIN_PASSWORD = 'Alaolo@2025Admin!'

// Create user
console.log('Creating admin user...')
const { data: created, error: createErr } = await sb.auth.admin.createUser({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  email_confirm: true,
  user_metadata: { role: 'admin' },
})

let userId
if (createErr) {
  if (createErr.message?.includes('already') || createErr.status === 422) {
    // User exists, look them up
    console.log('User exists, fetching...')
    const { data: list } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 })
    const existing = list?.users?.find(u => u.email === ADMIN_EMAIL)
    if (!existing) { console.error('Could not find existing admin user'); process.exit(1) }
    userId = existing.id
    // Reset password to known
    await sb.auth.admin.updateUserById(userId, { password: ADMIN_PASSWORD })
    console.log('Password reset to known value.')
  } else {
    console.error('Create error:', createErr)
    process.exit(1)
  }
} else {
  userId = created.user.id
  console.log('User created.')
}

// Upsert into admins table
console.log('Upserting into admins table...')
const { error: adminErr } = await sb.from('admins').upsert({ user_id: userId, email: ADMIN_EMAIL })
if (adminErr) { console.error('Admin insert error:', adminErr); process.exit(1) }

console.log('\n✅ Admin ready!')
console.log('  Login URL: /zh/admin/login (or any locale)')
console.log('  Email:    ', ADMIN_EMAIL)
console.log('  Password: ', ADMIN_PASSWORD)
