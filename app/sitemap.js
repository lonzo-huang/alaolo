import { locales } from '@/lib/i18n/config'
import { createSupabaseAdmin } from '@/lib/supabase/server'

export const revalidate = 3600

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const sb = createSupabaseAdmin()
  const { data: resources } = await sb.from('resources').select('slug, updated_at')

  const urls = []
  const langsMap = Object.fromEntries(locales.map(l => [l, '']))

  for (const locale of locales) {
    urls.push({
      url: `${base}/${locale}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(locales.map(l => [l, `${base}/${l}`])),
      },
    })
    for (const r of (resources || [])) {
      urls.push({
        url: `${base}/${locale}/resource/${r.slug}`,
        lastModified: new Date(r.updated_at),
        alternates: {
          languages: Object.fromEntries(locales.map(l => [l, `${base}/${l}/resource/${r.slug}`])),
        },
      })
    }
  }
  return urls
}
