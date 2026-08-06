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

  const groups = [
    { key: 'tools', label: t('tools'), href: `/${locale}/tools`, sub: [
      { label: 'AI 工具 · AI Tools', href: `/${locale}/tools?sub=AI`, icon: <Brain className="w-3.5 h-3.5" /> },
      { label: '开发 · Dev', href: `/${locale}/tools?sub=Dev`, icon: <Code2 className="w-3.5 h-3.5" /> },
      { label: '效率 · Productivity', href: `/${locale}/tools?sub=Productivity`, icon: <Zap className="w-3.5 h-3.5" /> },
      { label: '设计 · Design', href: `/${locale}/tools?sub=Design`, icon: <StarIcon className="w-3.5 h-3.5" /> },
    ]},
    { key: 'knowledge', label: t('knowledge'), href: `/${locale}?cat=knowledge`, sub: [
      { label: '教程 · Tutorials', href: `/${locale}?cat=knowledge&sub=Tutorial`, icon: <GraduationCap className="w-3.5 h-3.5" /> },
      { label: '文章 · Articles', href: `/${locale}?cat=knowledge&sub=Article`, icon: <FileText className="w-3.5 h-3.5" /> },
      { label: '量子 · Quantum', href: `/${locale}?cat=quantum`, icon: <Sparkles className="w-3.5 h-3.5" /> },
    ]},
    { key: 'resources', label: t('resources'), href: `/${locale}?cat=resources`, sub: [
      { label: '开发资源 · Dev', href: `/${locale}?cat=resources&sub=API`, icon: <Code2 className="w-3.5 h-3.5" /> },
      { label: 'AI 资源 · AI', href: `/${locale}?cat=resources&sub=AI`, icon: <Brain className="w-3.5 h-3.5" /> },
      { label: '学习资源 · Learn', href: `/${locale}?cat=resources&sub=Learning`, icon: <BookOpen className="w-3.5 h-3.5" /> },
    ]},
    { key: 'recommendations', label: t('recommendations'), href: `/${locale}?cat=recommendations`, sub: [
      { label: '软件推荐 · Software', href: `/${locale}?cat=recommendations&sub=macOS`, icon: <Download className="w-3.5 h-3.5" /> },
      { label: 'AI 工具推荐', href: `/${locale}?cat=recommendations&sub=AI`, icon: <Brain className="w-3.5 h-3.5" /> },
      { label: '今日热榜 · Today Hot', href: `/${locale}/trending`, icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { label: '排行榜 · Leaderboard', href: `/${locale}/leaderboard`, icon: <Trophy className="w-3.5 h-3.5" /> },
    ]},
  ]

  return (
    <nav className="hidden lg:flex items-center gap-0.5" ref={ref}>
      {groups.map(g => (
        <div key={g.key} className="relative">
          <button onClick={() => setOpenKey(openKey === g.key ? null : g.key)} className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-secondary hover:text-primary rounded-md hover:bg-surface-hover transition-colors">
            {g.label}<ChevronDown className={`w-3 h-3 transition-transform ${openKey === g.key ? 'rotate-180' : ''}`} />
          </button>
          {openKey === g.key && (
            <div className="absolute left-0 top-full mt-1 w-56 rounded-lg border border-app-strong bg-surface shadow-2xl py-1.5 z-50">
              <Link href={g.href} onClick={() => setOpenKey(null)} className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-primary hover:bg-surface-hover border-b border-app mb-1">→ 全部 {g.label}</Link>
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
