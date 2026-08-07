import { HomeClient } from '@/components/site/HomeClient'
import { getTranslations } from 'next-intl/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return {
    title: `alaolo · ${t('heroHead')}`,
    description: t('heroSub'),
    alternates: { canonical: `/${locale}`, languages: { zh: '/zh', en: '/en', ja: '/ja', ko: '/ko', de: '/de', fr: '/fr', nl: '/nl', es: '/es', it: '/it', ru: '/ru' } },
  }
}

export default async function HomePage({ params }) {
  const { locale } = await params
  const sb = await createSupabaseServer()
  const { data: all } = await sb.from('resources').select('*').order('featured', { ascending: false }).order('editors_pick', { ascending: false }).order('rating', { ascending: false })

  const byCategory = { tools: [], knowledge: [], recommendations: [] }
  for (const r of (all || [])) {
    if (r.super_category && byCategory[r.super_category]) byCategory[r.super_category].push(r)
  }

  return <HomeClient locale={locale} byCategory={byCategory} all={all || []} />
}
