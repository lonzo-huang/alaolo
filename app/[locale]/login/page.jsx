'use client'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Github, Mail, ArrowRight } from 'lucide-react'

export default function LoginPage({ params }) {
  const t = useTranslations('auth')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin')  // signin | signup | magic
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const callbackUrl = () => `${window.location.origin}/auth/callback?next=/${locale}`

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const sb = createSupabaseBrowser()
    try {
      if (mode === 'magic') {
        const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: callbackUrl() } })
        if (error) throw error
        toast.success(t('magicSent'))
      } else if (mode === 'signup') {
        const { error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: callbackUrl() } })
        if (error) throw error
        toast.success(t('magicSent'))
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success(t('welcome'))
        router.push(`/${locale}`)
        router.refresh()
      }
    } catch (e) {
      toast.error(e.message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  const oauth = async (provider) => {
    setLoading(true)
    const sb = createSupabaseBrowser()
    const { error } = await sb.auth.signInWithOAuth({ provider, options: { redirectTo: callbackUrl() } })
    if (error) {
      toast.error(t('oauthError', { provider }))
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <div className="relative">
        <div className="absolute -top-20 -inset-x-10 h-40 bg-[#F5C518]/10 blur-3xl -z-10" />
        <div className="p-8 rounded-2xl border border-app bg-surface">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-[#F5C518] flex items-center justify-center font-black text-black text-xl mx-auto shadow-[0_0_28px_rgba(245,197,24,0.5)]">a</div>
            <h1 className="mt-4 text-2xl font-bold text-primary">{t('welcome')}</h1>
            <p className="mt-1 text-sm text-secondary">{t('loginPrompt')}</p>
          </div>

          <div className="flex gap-2 mb-4">
            <button onClick={() => oauth('github')} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-app bg-surface-hover text-primary hover:bg-surface text-sm"><Github className="w-4 h-4" />GitHub</button>
            <button onClick={() => oauth('google')} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-app bg-surface-hover text-primary hover:bg-surface text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-app" /></div>
            <div className="relative flex justify-center"><span className="px-2 bg-surface text-xs text-tertiary">or</span></div>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-xs text-secondary">{t('email')}</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-lg bg-app border border-app text-primary placeholder-tertiary focus:border-[#F5C518]/50 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/30 text-sm" placeholder="you@example.com" />
            </div>
            {mode !== 'magic' && (
              <div>
                <label className="text-xs text-secondary">{t('password')}</label>
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-lg bg-app border border-app text-primary placeholder-tertiary focus:border-[#F5C518]/50 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/30 text-sm" placeholder="••••••••" />
              </div>
            )}
            <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#F5C518] hover:bg-[#e6b800] text-black font-medium text-sm disabled:opacity-50">
              {mode === 'magic' ? <Mail className="w-4 h-4" /> : null}
              {mode === 'signin' ? t('login') : mode === 'signup' ? t('signup') : t('magicLink')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 flex justify-between text-xs">
            <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="text-secondary hover:text-primary">{mode === 'signin' ? t('signup') : t('login')}</button>
            <button onClick={() => setMode('magic')} className="text-secondary hover:text-primary">{t('magicLink')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
