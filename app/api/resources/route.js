import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'
import { translateToAllLocales, transposeLocaleArrays } from '@/lib/translate'

function checkAuth(request) {
  const key = request.headers.get('x-api-key')
  return !!process.env.CONTENT_API_KEY && key === process.env.CONTENT_API_KEY
}

function unauthorized() {
  return NextResponse.json({ error: 'unauthorized: missing or invalid x-api-key header' }, { status: 401 })
}

// GET /api/resources?slug=xxx           -> single resource (full detail)
// GET /api/resources?category=xxx&limit=20 -> list
export async function GET(request) {
  const sb = createSupabaseAdmin()
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (slug) {
    const { data: resource, error } = await sb.from('resources').select('*, categories(slug, name)').eq('slug', slug).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!resource) return NextResponse.json({ error: 'not found' }, { status: 404 })
    const [pros_cons, info_grid, pricing_plans] = await Promise.all([
      sb.from('pros_cons').select('*').eq('resource_id', resource.id).order('sort_order').then(r => r.data || []),
      sb.from('info_grid').select('*').eq('resource_id', resource.id).order('sort_order').then(r => r.data || []),
      sb.from('pricing_plans').select('*').eq('resource_id', resource.id).order('sort_order').then(r => r.data || []),
    ])
    return NextResponse.json({ resource: { ...resource, pros_cons, info_grid, pricing_plans } })
  }

  const category = searchParams.get('category')
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200)
  let q = sb.from('resources').select('id, slug, name, slogan, category_id, view_count, rating, featured, editors_pick, trending, updated_at, categories(slug, name)').order('updated_at', { ascending: false }).limit(limit)
  if (category) {
    const { data: cat } = await sb.from('categories').select('id').eq('slug', category).maybeSingle()
    if (cat) q = q.eq('category_id', cat.id)
  }
  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ resources: data || [] })
}

// POST /api/resources
// Body: {
//   slug, category, website_url, logo_url?, cover_url?, brand_color?, featured?, editors_pick?, trending?,
//   content: { name, slogan?, description?, use_cases?: [], highlights?: [] },  // all in Chinese (zh)
//   pros?: [], cons?: [],
// }
// Requires header: x-api-key: <CONTENT_API_KEY>
// All zh text fields are automatically machine-translated into every other
// supported locale (en/ja/ko/de/fr/nl/es/it/ru) via OpenAI before saving.
export async function POST(request) {
  if (!checkAuth(request)) return unauthorized()
  try {
    const body = await request.json()
    const {
      slug, category, website_url, logo_url, cover_url, brand_color,
      featured, editors_pick, trending,
      content = {}, pros = [], cons = [],
    } = body

    if (!slug || !website_url || !content.name) {
      return NextResponse.json({ error: 'slug, website_url, and content.name are required' }, { status: 400 })
    }

    const sb = createSupabaseAdmin()

    const { data: existing } = await sb.from('resources').select('id').eq('slug', slug).maybeSingle()
    if (existing) return NextResponse.json({ error: `slug "${slug}" already exists` }, { status: 409 })

    let category_id = null
    if (category) {
      const { data: cat } = await sb.from('categories').select('id').eq('slug', category).maybeSingle()
      if (!cat) return NextResponse.json({ error: `category "${category}" not found` }, { status: 400 })
      category_id = cat.id
    }

    const toTranslate = {
      name: content.name,
      slogan: content.slogan || '',
      description: content.description || '',
      use_cases: content.use_cases || [],
      highlights: content.highlights || [],
      pros,
      cons,
    }
    const translated = await translateToAllLocales(toTranslate)

    const { data: resource, error } = await sb.from('resources').insert({
      slug,
      name: translated.name,
      slogan: translated.slogan,
      description: translated.description,
      use_cases: translated.use_cases,
      highlights: translated.highlights,
      logo_url: logo_url || null,
      cover_url: cover_url || null,
      website_url,
      category_id,
      brand_color: brand_color || '#F5C518',
      featured: !!featured,
      editors_pick: !!editors_pick,
      trending: !!trending,
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const prosLocalized = transposeLocaleArrays(translated.pros)
    const consLocalized = transposeLocaleArrays(translated.cons)
    const pcRows = [
      ...prosLocalized.map((c, i) => ({ resource_id: resource.id, type: 'pro', content: c, sort_order: i + 1 })),
      ...consLocalized.map((c, i) => ({ resource_id: resource.id, type: 'con', content: c, sort_order: i + 1 })),
    ]
    if (pcRows.length) await sb.from('pros_cons').insert(pcRows)

    return NextResponse.json({ ok: true, resource }, { status: 201 })
  } catch (e) {
    console.error('POST /api/resources error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// PATCH /api/resources?slug=xxx
// Body: any subset of { category, website_url, logo_url, cover_url, brand_color,
//   featured, editors_pick, trending, content: { name?, slogan?, description?, use_cases?, highlights? } }
// If `content` is provided, those zh fields are re-translated into all locales.
export async function PATCH(request) {
  if (!checkAuth(request)) return unauthorized()
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    if (!slug) return NextResponse.json({ error: 'slug query param required' }, { status: 400 })

    const body = await request.json()
    const { category, website_url, logo_url, cover_url, brand_color, featured, editors_pick, trending, content } = body

    const sb = createSupabaseAdmin()
    const update = {}
    if (website_url !== undefined) update.website_url = website_url
    if (logo_url !== undefined) update.logo_url = logo_url
    if (cover_url !== undefined) update.cover_url = cover_url
    if (brand_color !== undefined) update.brand_color = brand_color
    if (featured !== undefined) update.featured = !!featured
    if (editors_pick !== undefined) update.editors_pick = !!editors_pick
    if (trending !== undefined) update.trending = !!trending

    if (category) {
      const { data: cat } = await sb.from('categories').select('id').eq('slug', category).maybeSingle()
      if (!cat) return NextResponse.json({ error: `category "${category}" not found` }, { status: 400 })
      update.category_id = cat.id
    }

    if (content) {
      const toTranslate = {}
      if (content.name !== undefined) toTranslate.name = content.name
      if (content.slogan !== undefined) toTranslate.slogan = content.slogan
      if (content.description !== undefined) toTranslate.description = content.description
      if (content.use_cases !== undefined) toTranslate.use_cases = content.use_cases
      if (content.highlights !== undefined) toTranslate.highlights = content.highlights
      if (Object.keys(toTranslate).length) {
        const translated = await translateToAllLocales(toTranslate)
        Object.assign(update, translated)
      }
    }

    update.updated_at = new Date().toISOString()

    const { data: resource, error } = await sb.from('resources').update(update).eq('slug', slug).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!resource) return NextResponse.json({ error: 'not found' }, { status: 404 })

    return NextResponse.json({ ok: true, resource })
  } catch (e) {
    console.error('PATCH /api/resources error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// DELETE /api/resources?slug=xxx
export async function DELETE(request) {
  if (!checkAuth(request)) return unauthorized()
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug query param required' }, { status: 400 })
  const sb = createSupabaseAdmin()
  const { error } = await sb.from('resources').delete().eq('slug', slug)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
