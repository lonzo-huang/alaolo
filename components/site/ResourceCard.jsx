'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { t as tt } from '@/lib/i18n/config'
import { Star } from 'lucide-react'

// category slug -> pill classes (colored primary chip)
const CAT_CHIP = {
  ai: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30',
  dev: 'bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30',
  network: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
  learning: 'bg-orange-500/15 text-orange-600 dark:text-orange-300 border-orange-500/30',
  productivity: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/30',
}

export function ResourceCard({ resource, locale, compact = false }) {
  const t = useTranslations('home')
  const cat = resource.categories
  const catSlug = cat?.slug || 'dev'
  const chip = CAT_CHIP[catSlug] || CAT_CHIP.dev
  const highlights = resource.highlights?.[locale] || resource.highlights?.en || []
  const catName = tt(cat?.name, locale)
  const price = resource.pricing_summary || (resource.rating >= 4.7 ? 'Freemium' : t('free'))

  return (
    <div className="group rounded-xl border border-app bg-surface hover:border-app-strong transition-all p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3">
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
