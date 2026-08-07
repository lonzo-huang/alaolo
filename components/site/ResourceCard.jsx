'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { t as tt } from '@/lib/i18n/config'
import { Star } from 'lucide-react'
import { useSpotlight, SPOTLIGHT_CLASS } from '@/lib/hooks/useSpotlight'

// category slug -> pill classes (colored primary chip)
const CAT_CHIP = {
  ai: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30',
  dev: 'bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30',
  network: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
  learning: 'bg-orange-500/15 text-orange-600 dark:text-orange-300 border-orange-500/30',
  productivity: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/30',
  chat: 'bg-violet-500/15 text-violet-600 dark:text-violet-300 border-violet-500/30',
  coding: 'bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30',
  image: 'bg-pink-500/15 text-pink-600 dark:text-pink-300 border-pink-500/30',
  video: 'bg-red-500/15 text-red-600 dark:text-red-300 border-red-500/30',
  audio: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30',
  knowledge: 'bg-teal-500/15 text-teal-600 dark:text-teal-300 border-teal-500/30',
  search: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/30',
  agent: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-500/30',
  data: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
  '3d': 'bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300 border-fuchsia-500/30',
  office: 'bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30',
  legal: 'bg-stone-500/15 text-stone-600 dark:text-stone-300 border-stone-500/30',
  medical: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30',
  quant: 'bg-green-500/15 text-green-600 dark:text-green-300 border-green-500/30',
  devops: 'bg-orange-500/15 text-orange-600 dark:text-orange-300 border-orange-500/30',
  career: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-300 border-yellow-500/30',
}

export function ResourceCard({ resource, locale, compact = false }) {
  const t = useTranslations('home')
  const cat = resource.categories
  const catSlug = cat?.slug || 'dev'
  const chip = CAT_CHIP[catSlug] || CAT_CHIP.dev
  const highlights = resource.highlights?.[locale] || resource.highlights?.en || []
  const catName = tt(cat?.name, locale)
  const price = resource.pricing_summary || (resource.rating >= 4.7 ? 'Freemium' : t('free'))
  const spotlight = useSpotlight()

  return (
    <div ref={spotlight.ref} onMouseMove={spotlight.onMouseMove} onMouseLeave={spotlight.onMouseLeave} className={`group rounded-xl border border-app bg-surface hover:border-app-strong transition-all p-5 flex flex-col gap-3 overflow-hidden ${SPOTLIGHT_CLASS}`}>
      <div className="flex items-start gap-3 relative z-[2]">
        <div className="w-10 h-10 rounded-lg bg-surface-hover border border-app flex items-center justify-center overflow-hidden shrink-0">
          {resource.logo_url ? (
            <img src={resource.logo_url} alt="" className="w-7 h-7 object-contain" onError={(e) => { e.target.style.display = 'none' }} />
          ) : (
            <span className="text-base font-bold text-primary">{tt(resource.name, locale)[0]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary text-[15px] leading-tight truncate">{tt(resource.name, locale)}</h3>
          <p className="text-xs text-secondary mt-0.5 truncate">{tt(resource.slogan, locale)}</p>
        </div>
        <button className="shrink-0 text-tertiary hover:text-[#F5C518] p-1 opacity-70 hover:opacity-100" aria-label="favorite">
          <Star className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[13px] text-secondary leading-relaxed line-clamp-2">{tt(resource.description, locale)}</p>

      {(highlights.length > 0 || catName) && (
        <div className="flex flex-wrap gap-1.5">
          {catName && (
            <span className={`px-2 py-0.5 rounded-md border text-[11px] font-medium ${chip}`}>{catName}</span>
          )}
          {highlights.slice(0, 4).map((h, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md text-[11px] text-secondary bg-surface-hover border border-app">{h}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-1 mt-auto">
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/resource/${resource.slug}`} className="px-3 py-1.5 rounded-md bg-[#F5C518] hover:bg-[#e6b800] text-black text-[12.5px] font-medium">{t('details')}</Link>
          <a href={resource.website_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-md bg-surface-hover hover:bg-surface border border-app text-primary text-[12.5px]">{t('visit')}</a>
        </div>
        <div className="flex items-center gap-2 text-[11.5px] text-tertiary">
          <span>{catName} · {price}</span>
          {resource.rating > 0 && <span className="text-secondary"><span className="text-[#F5C518]">★</span> {resource.rating}</span>}
        </div>
      </div>
    </div>
  )
}
