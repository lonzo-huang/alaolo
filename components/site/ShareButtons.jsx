'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Share2, Link2, Check } from 'lucide-react'
import { toast } from 'sonner'

export function ShareButtons({ url }) {
  const t = useTranslations('detail')
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url || window.location.href)
      setCopied(true)
      toast.success(t('copied'))
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ url: url || window.location.href }) } catch {}
    } else {
      copy()
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button onClick={share} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-hover border border-app text-primary hover:bg-surface text-sm"><Share2 className="w-4 h-4" />{t('share')}</button>
      <button onClick={copy} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-hover border border-app text-primary hover:bg-surface text-sm">
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}
        {copied ? t('copied') : t('copyLink')}
      </button>
    </div>
  )
}
