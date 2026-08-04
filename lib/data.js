import { createSupabaseServer } from './supabase/server'

export async function getCategories() {
  const sb = await createSupabaseServer()
  const { data } = await sb.from('categories').select('*').order('sort_order')
  return data || []
}

export async function getResources({ categorySlug = null, sort = 'recommended', limit = 60 } = {}) {
  const sb = await createSupabaseServer()
  let q = sb.from('resources').select('*, categories(slug, name, color, icon)').limit(limit)
  if (categorySlug) {
    const { data: cat } = await sb.from('categories').select('id').eq('slug', categorySlug).single()
    if (cat) q = q.eq('category_id', cat.id)
  }
  if (sort === 'latest') q = q.order('updated_at', { ascending: false })
  else if (sort === 'popular') q = q.order('view_count', { ascending: false })
  else q = q.order('featured', { ascending: false }).order('editors_pick', { ascending: false }).order('rating', { ascending: false })
  const { data } = await q
  return data || []
}

export async function getTrending(limit = 6) {
  const sb = await createSupabaseServer()
  const { data } = await sb.from('resources').select('*, categories(slug, name, color, icon)').eq('trending', true).order('view_count', { ascending: false }).limit(limit)
  return data || []
}

export async function getEditorsPicks(limit = 6) {
  const sb = await createSupabaseServer()
  const { data } = await sb.from('resources').select('*, categories(slug, name, color, icon)').eq('editors_pick', true).order('rating', { ascending: false }).limit(limit)
  return data || []
}

export async function getLatest(limit = 6) {
  const sb = await createSupabaseServer()
  const { data } = await sb.from('resources').select('*, categories(slug, name, color, icon)').order('updated_at', { ascending: false }).limit(limit)
  return data || []
}

export async function getResourceBySlug(slug) {
  const sb = await createSupabaseServer()
  const { data: resource } = await sb.from('resources').select('*, categories(slug, name, color, icon, id)').eq('slug', slug).single()
  if (!resource) return null
  const [infoGrid, prosCons, pricing, screenshots, alternatives] = await Promise.all([
    sb.from('info_grid').select('*').eq('resource_id', resource.id).order('sort_order').then(r => r.data || []),
    sb.from('pros_cons').select('*').eq('resource_id', resource.id).order('sort_order').then(r => r.data || []),
    sb.from('pricing_plans').select('*').eq('resource_id', resource.id).order('sort_order').then(r => r.data || []),
    sb.from('screenshots').select('*').eq('resource_id', resource.id).order('sort_order').then(r => r.data || []),
    sb.from('alternatives').select('alt_resource_id, resources!alternatives_alt_resource_id_fkey(*, categories(slug, name, color, icon))').eq('resource_id', resource.id).then(r => (r.data || []).map(x => x.resources).filter(Boolean)),
  ])
  // increment view count (fire and forget)
  sb.rpc('increment_view', { resource_slug: slug }).then(() => {}).catch(() => {})
  return {
    ...resource,
    info_grid: infoGrid,
    pros: prosCons.filter(pc => pc.type === 'pro'),
    cons: prosCons.filter(pc => pc.type === 'con'),
    pricing_plans: pricing,
    screenshots,
    alternatives_resources: alternatives,
  }
}

export async function getAdjacentResources(currentId, categoryId) {
  const sb = await createSupabaseServer()
  const { data: all } = await sb.from('resources').select('slug, name').eq('category_id', categoryId).order('created_at')
  if (!all) return { prev: null, next: null }
  const idx = all.findIndex(r => r.slug === currentId)
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  }
}

export async function getRelated(categoryId, excludeSlug, limit = 4) {
  const sb = await createSupabaseServer()
  const { data } = await sb.from('resources').select('*, categories(slug, name, color, icon)').eq('category_id', categoryId).neq('slug', excludeSlug).limit(limit)
  return data || []
}
