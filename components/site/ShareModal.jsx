'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Share2, Link2, Check, X as XIcon } from 'lucide-react'
import { toast } from 'sonner'

const PLATFORMS = [
  { key: 'x', label: 'X (Twitter)', color: '#000', href: (u, t) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`, icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>) },
  { key: 'linkedin', label: 'LinkedIn', color: '#0A66C2', href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`, icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>) },
  { key: 'whatsapp', label: 'WhatsApp', color: '#25D366', href: (u, t) => `https://wa.me/?text=${encodeURIComponent(t + ' ' + u)}`, icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>) },
  { key: 'telegram', label: 'Telegram', color: '#26A5E4', href: (u, t) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`, icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>) },
  { key: 'reddit', label: 'Reddit', color: '#FF4500', href: (u, t) => `https://reddit.com/submit?url=${encodeURIComponent(u)}&title=${encodeURIComponent(t)}`, icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>) },
  { key: 'facebook', label: 'Facebook', color: '#1877F2', href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`, icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>) },
]

// no direct web share for these; use QR (WeChat) or copy (TikTok, RedNote)
const NO_URL = [
  { key: 'wechat', labelKey: 'shareWechat', color: '#07C160', qr: true, icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M8.691 2C4.008 2 .2 5.16.2 9.06c0 2.16 1.176 4.076 3.062 5.418l-.708 2.16 2.489-1.257c.87.198 1.708.354 2.647.354.28 0 .55-.01.83-.03-.169-.6-.269-1.235-.269-1.869C8.251 10.253 12.079 7.36 16.752 7.36c.24 0 .479.01.719.03C16.643 3.807 12.998 2 8.691 2zm-3.03 3.51c.63 0 1.14.51 1.14 1.14s-.51 1.14-1.14 1.14a1.144 1.144 0 01-1.14-1.14c0-.63.51-1.14 1.14-1.14zm5.879 0c.63 0 1.14.51 1.14 1.14s-.51 1.14-1.14 1.14a1.144 1.144 0 01-1.14-1.14c0-.63.51-1.14 1.14-1.14zM16.75 8.72c-4.443 0-8.05 3.036-8.05 6.79 0 3.755 3.607 6.79 8.05 6.79.94 0 1.836-.14 2.65-.395l2.24 1.234-.635-2.033c1.72-1.256 2.795-3.076 2.795-5.116 0-3.754-3.607-6.79-8.05-6.79zm-2.83 3.045c.514 0 .93.418.93.933 0 .516-.416.934-.93.934a.934.934 0 010-1.867zm5.16 0c.515 0 .933.418.933.933 0 .516-.418.934-.933.934a.933.933 0 110-1.867z"/></svg>) },
  { key: 'rednote', labelKey: 'shareRednote', color: '#FF2442', copy: true, icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M9 3v12l-3 3V6l3-3zm6 0v18l3-3V6l-3-3zm-2 6h-2v6h2V9z"/></svg>) },
  { key: 'tiktok', label: 'TikTok', color: '#000', copy: true, icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43V8.87a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.84-.3z"/></svg>) },
]

export function ShareModal({ url, title }) {
  const t = useTranslations('detail')
  const [open, setOpen] = useState(false)
  const [showQR, setShowQR] = useState(null)
  const [copied, setCopied] = useState(false)

  const shareUrl = url
  const shareText = title

  const handleClick = (p) => {
    if (p.qr) { setShowQR(p); return }
    if (p.copy) {
      navigator.clipboard.writeText(shareUrl)
      toast.success(`${t('copied')} — ${p.label}`)
      return
    }
    const link = p.href(shareUrl, shareText)
    window.open(link, '_blank', 'noopener,noreferrer,width=600,height=600')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success(t('copied'))
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-hover border border-app text-primary hover:bg-surface text-sm">
        <Share2 className="w-4 h-4" />{t('share')}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => { setOpen(false); setShowQR(null) }}>
          <div className="w-full max-w-md rounded-2xl border border-app-strong bg-surface p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-primary">{t('share')}</h3>
              <button onClick={() => { setOpen(false); setShowQR(null) }} className="text-tertiary hover:text-primary p-1"><XIcon className="w-4 h-4" /></button>
            </div>

            {showQR ? (
              <div className="text-center py-2">
                <div className="inline-block p-3 rounded-xl bg-white">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`} alt="QR" className="w-48 h-48" />
                </div>
                <p className="mt-4 text-sm text-secondary">{t('scanQR')} · {t(showQR.labelKey)}</p>
                <button onClick={() => setShowQR(null)} className="mt-4 text-xs text-tertiary hover:text-primary">{t('shareBack')}</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[...PLATFORMS, ...NO_URL].map(p => (
                    <button key={p.key} onClick={() => handleClick(p)} className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-app bg-surface-hover hover:bg-surface transition-colors">
                      <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ background: p.color }}>{p.icon}</span>
                      <span className="text-[11px] text-secondary">{p.labelKey ? t(p.labelKey) : p.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-hover border border-app">
                  <div className="flex-1 text-[12px] text-tertiary truncate px-2">{shareUrl}</div>
                  <button onClick={copyLink} className="px-3 py-1.5 rounded-md bg-[#F5C518] hover:bg-[#e6b800] text-black text-xs font-medium inline-flex items-center gap-1">
                    {copied ? <><Check className="w-3 h-3" />{t('copied')}</> : <><Link2 className="w-3 h-3" />{t('copyLink')}</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
