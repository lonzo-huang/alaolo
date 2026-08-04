import { getResources, getTrending, getEditorsPicks, getLatest } from '@/lib/data'
import { HomeClient } from '@/components/site/HomeClient'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return {
    title: t('heroTitle'),
    description: t('heroSubtitle'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        zh: '/zh',
        en: '/en',
        ja: '/ja',
        ko: '/ko',
      },
    },
  }
}

export default async function HomePage({ params }) {
  const { locale } = await params
  const [resources, trending, picks, latest] = await Promise.all([
    getResources({ limit: 100 }),
    getTrending(6),
    getEditorsPicks(6),
    getLatest(6),
  ])
  return <HomeClient locale={locale} resources={resources} trending={trending} picks={picks} latest={latest} />
}
