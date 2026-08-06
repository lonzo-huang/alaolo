'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ChevronDown, Zap, BookOpen, FolderOpen, Sparkles, TrendingUp, Trophy, FileText, GraduationCap, Code2, Brain, Download, Star as StarIcon } from 'lucide-react'

export function SubNav({ locale }) {
  const t = useTranslations('nav')
  const [openKey, setOpenKey] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpenKey(null) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const flatLinks = [
    { key: 'home', label: t('home'), href: `/${locale}` },
    { key: 'tools', label: t('tools'), href: `/${locale}/tools` },
  ]

  const groups = [
    { key: 'knowledge', label: t('knowledge'), allLabel: t('subKnowledgeAll'), href: `/${locale}?cat=knowledge`, sub: [
      { label: t('subKnowledgeTutorials'), href: `/${locale}?cat=knowledge&sub=Tutorial`, icon: <GraduationCap className="w-3.5 h-3.5" /> },
      { label: t('subKnowledgeArticles'), href: `/${locale}?cat=knowledge&sub=Article`, icon: <FileText className="w-3.5 h-3.5" /> },
    ]},
    { key: 'resources', label: t('resources'), allLabel: t('subResourcesAll'), href: `/${locale}?cat=resources`, sub: [
      { label: t('subResourcesDev'), href: `/${locale}?cat=resources&sub=API`, icon: <Code2 className="w-3.5 h-3.5" /> },
      { label: t('subResourcesAI'), href: `/${locale}?cat=resources&sub=AI`, icon: <Brain className="w-3.5 h-3.5" /> },
      { label: t('subResourcesLearning'), href: `/${locale}?cat=resources&sub=Learning`, icon: <BookOpen className="w-3.5 h-3.5" /> },
    ]},
    { key: 'recommendations', label: t('recommendations'), allLabel: t('subRecommendationsAll'), href: `/${locale}?cat=recommendations`, sub: [
      { label: t('subRecommendationsSoftware'), href: `/${locale}?cat=recommendations&sub=macOS`, icon: <Download className="w-3.5 h-3.5" /> },
      { label: t('subRecommendationsAI'), href: `/${locale}?cat=recommendations&sub=AI`, icon: <Brain className="w-3.5 h-3.5" /> },
      { label: t('subRecommendationsTrending'), href: `/${locale}/trending`, icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { label: t('subRecommendationsLeaderboard'), href: `/${locale}/leaderboard`, icon: <Trophy className="w-3.5 h-3.5" /> },
    ]},
  ]

  return (
    <nav className="hidden lg:flex items-center gap-0.5" ref={ref}>
      {flatLinks.map(l => (
        <Link key={l.key} href={l.href} className="px-3 py-1.5 text-[13px] text-secondary hover:text-primary rounded-md hover:bg-surface-hover transition-colors">
          {l.label}
        </Link>
      ))}
      {groups.map(g => (
        <div key={g.key} className="relative">
          <button onClick={() => setOpenKey(openKey === g.key ? null : g.key)} className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-secondary hover:text-primary rounded-md hover:bg-surface-hover transition-colors">
            {g.label}<ChevronDown className={`w-3 h-3 transition-transform ${openKey === g.key ? 'rotate-180' : ''}`} />
          </button>
          {openKey === g.key && (
            <div className="absolute left-0 top-full mt-1 w-56 rounded-lg border border-app-strong bg-surface shadow-2xl py-1.5 z-50">
              <Link href={g.href} onClick={() => setOpenKey(null)} className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-primary hover:bg-surface-hover border-b border-app mb-1">→ {g.allLabel}</Link>
              {g.sub.map(s => (
                <Link key={s.label} href={s.href} onClick={() => setOpenKey(null)} className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-secondary hover:text-primary hover:bg-surface-hover">
                  <span className="text-tertiary">{s.icon}</span>{s.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}
