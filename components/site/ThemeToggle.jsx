'use client'
import { Sun, Moon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const t = useTranslations('common')
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const html = document.documentElement
    const next = html.classList.contains('dark') ? 'light' : 'dark'
    html.classList.remove('dark', 'light')
    html.classList.add(next)
    localStorage.setItem('theme', next)
    setIsDark(next === 'dark')
  }

  return (
    <button
      onClick={toggle}
      className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
      aria-label={isDark ? t('lightMode') : t('darkMode')}
      title={isDark ? t('lightMode') : t('darkMode')}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}
