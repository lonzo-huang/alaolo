import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'
import { t as tt } from '@/lib/i18n/config'
import Link from 'next/link'
import { AdminSignOut } from '@/components/site/AdminSignOut'

export const dynamic = 'force-dynamic'

export default async function AdminPage({ params }) {
  const { locale } = await params
  const sb = await createSupabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect(`/${locale}/admin/login`)

  // Check admin status via admins table
  const admin = createSupabaseAdmin()
  const { data: adminRow } = await admin.from('admins').select('user_id').eq('user_id', user.id).maybeSingle()
  if (!adminRow) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white">Not authorized</h1>
        <p className="mt-2 text-slate-400">Signed in as {user.email} — but you are not an admin.</p>
        <AdminSignOut label="Sign out" locale={locale} className="mt-4 inline-block px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-sm" />
      </div>
    )
  }

  const t = await getTranslations({ locale, namespace: 'admin' })
  const [{ count: resourceCount }, { count: subscriberCount }, { data: resources }] = await Promise.all([
    admin.from('resources').select('*', { count: 'exact', head: true }),
    admin.from('subscribers').select('*', { count: 'exact', head: true }),
    admin.from('resources').select('id, slug, name, category_id, view_count, rating, featured, editors_pick, trending, updated_at, categories(name, slug)').order('updated_at', { ascending: false }),
  ])

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t('title')}</h1>
          <p className="text-sm text-slate-400 mt-1">Signed in as {user.email}</p>
        </div>
        <AdminSignOut label={t('signOut')} locale={locale} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-sm hover:bg-white/10" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard label={t('resources')} value={resourceCount || 0} />
        <StatCard label={t('subscribers')} value={subscriberCount || 0} />
        <StatCard label="Languages" value={10} />
      </div>

      <div className="rounded-xl border border-white/10 bg-[#10141C] overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-white font-semibold">{t('resources')}</h2>
          <span className="text-xs text-slate-500">Full CRUD coming next — currently view-only</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.02] text-left text-xs text-slate-400">
              <tr>
                <th className="px-5 py-2">Slug</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Views</th>
                <th className="px-3 py-2">Rating</th>
                <th className="px-3 py-2">Flags</th>
                <th className="px-3 py-2">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {(resources || []).map(r => (
                <tr key={r.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-2.5"><Link href={`/${locale}/resource/${r.slug}`} className="text-[#F5C518] hover:underline text-xs">{r.slug}</Link></td>
                  <td className="px-3 py-2.5 text-slate-200">{tt(r.name, 'en')}</td>
                  <td className="px-3 py-2.5 text-slate-400 text-xs">{tt(r.categories?.name, 'en')}</td>
                  <td className="px-3 py-2.5 text-slate-300">{r.view_count}</td>
                  <td className="px-3 py-2.5 text-slate-300">{r.rating}</td>
                  <td className="px-3 py-2.5 text-xs">
                    {r.featured && <span className="text-[#F5C518] mr-1">F</span>}
                    {r.editors_pick && <span className="text-purple-400 mr-1">E</span>}
                    {r.trending && <span className="text-orange-400">T</span>}
                  </td>
                  <td className="px-3 py-2.5 text-slate-500 text-xs">{new Date(r.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="p-4 rounded-xl border border-white/10 bg-[#10141C]">
      <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
      <div className="mt-1 text-2xl font-bold text-white">{value}</div>
    </div>
  )
}
