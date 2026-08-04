import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'

export async function POST(request) {
  try {
    const { email, locale } = await request.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'invalid email' }, { status: 400 })
    }
    const sb = createSupabaseAdmin()
    // Check existing
    const { data: existing } = await sb.from('subscribers').select('id').eq('email', email).maybeSingle()
    if (existing) return NextResponse.json({ already: true })
    const { error } = await sb.from('subscribers').insert({ email, locale: locale || 'zh' })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
