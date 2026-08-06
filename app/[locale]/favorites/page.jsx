import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ResourceCard } from '@/components/site/ResourceCard'
import { t as tt } from '@/lib/i18n/config'

export const dynamic = 'force-dynamic'

export default async function FavoritesPage({ params }) {
  const { locale } = await params
  const sb = await createSupabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations({ locale, namespace: 'auth' })
  const { data: favs } = await sb.from('favorites').select('resource_id, resources(*, categories(slug, name, color, icon))').eq('user_id', user.id).order('created_at', { ascending: false })
  const resources = (favs || []).map(f => f.resources).filter(Boolean)

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">{t('myFavorites')}</h1>
      {resources.length === 0 ? (
        <div className="text-center py-16 text-tertiary border border-dashed border-app rounded-xl">{t('noFavorites')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {resources.map(r => <ResourceCard key={r.id} resource={r} locale={locale} />)}
        </div>
      )}
    </div>
  )
}
