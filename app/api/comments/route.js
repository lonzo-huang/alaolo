import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'

export async function POST(request) {
  try {
    const { resource_slug, guest_name, content, rating } = await request.json()
    if (!resource_slug || !guest_name?.trim() || !content?.trim()) return NextResponse.json({ error: 'missing fields' }, { status: 400 })
    if (content.length > 2000 || guest_name.length > 80) return NextResponse.json({ error: 'too long' }, { status: 400 })
    const sb = createSupabaseAdmin()
    const { data, error } = await sb.from('comments').insert({
      resource_slug, guest_name: guest_name.slice(0, 80), content: content.slice(0, 2000),
      rating: rating || null, approved: true,
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, comment: data })
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function GET(request) {
  const slug = new URL(request.url).searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
  const sb = createSupabaseAdmin()
  const { data } = await sb.from('comments').select('*').eq('resource_slug', slug).eq('approved', true).order('created_at', { ascending: false }).limit(50)
  return NextResponse.json({ comments: data || [] })
}
