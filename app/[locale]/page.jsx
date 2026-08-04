import { getResources, getTrending, getEditorsPicks, getLatest } from '@/lib/data'
import { HomeClient } from '@/components/site/HomeClient'
import { getTranslations } from 'next-intl/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return {
    title: `alaolo.com · ${t('heroKw1')}${t('heroSep')}${t('heroKw2')}${t('heroSep')}${t('heroKw3')}`,
    description: t('heroDesc'),
    alternates: {
      canonical: `/${locale}`,
      languages: { zh: '/zh', en: '/en', ja: '/ja', ko: '/ko' },
    },
  }
}

async function getHotAI(limit = 4) {
  const sb = await createSupabaseServer()
  const { data: cat } = await sb.from('categories').select('id').eq('slug', 'ai').single()
  if (!cat) return []
  const { data } = await sb.from('resources').select('*, categories(slug, name, color, icon)').eq('category_id', cat.id).order('rating', { ascending: false }).limit(limit)
  return data || []
}

export default async function HomePage({ params }) {
  const { locale } = await params
  const [resources, trending, picks, latest, hotAI] = await Promise.all([
    getResources({ limit: 100 }),
    getTrending(3),
    getEditorsPicks(3),
    getLatest(3),
    getHotAI(3),
  ])
  return <HomeClient locale={locale} resources={resources} trending={trending} picks={picks} latest={latest} hotAI={hotAI} />
}
