import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Newsletter } from './Newsletter'

export async function Footer({ locale }) {
  const t = await getTranslations({ locale, namespace: 'footer' })
  const tHome = await getTranslations({ locale, namespace: 'home' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  return (
    <footer className="border-t border-app mt-16">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <Newsletter />

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-[#F5C518] flex items-center justify-center font-black text-black text-xs">a</div>
              <span className="font-semibold text-primary">alaolo.com</span>
            </div>
            <p className="text-tertiary text-[13px] leading-relaxed">{t('tagline')}</p>
          </div>
          <div>
            <div className="text-primary font-medium mb-3">{tNav('discover')}</div>
            <ul className="space-y-1.5 text-secondary">
              <li><Link href={`/${locale}?cat=ai`} className="hover:text-primary">AI</Link></li>
              <li><Link href={`/${locale}?cat=dev`} className="hover:text-primary">Dev</Link></li>
              <li><Link href={`/${locale}?cat=network`} className="hover:text-primary">Network</Link></li>
              <li><Link href={`/${locale}?cat=learning`} className="hover:text-primary">{tNav('learning')}</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-primary font-medium mb-3">{t('sections')}</div>
            <ul className="space-y-1.5 text-secondary">
              <li><Link href={`/${locale}`} className="hover:text-primary">{tHome('secTrending')}</Link></li>
              <li><Link href={`/${locale}`} className="hover:text-primary">{tHome('secFeatured')}</Link></li>
              <li><Link href={`/${locale}`} className="hover:text-primary">{tHome('secHotAI')}</Link></li>
              <li><Link href={`/${locale}#newsletter`} className="hover:text-primary">Newsletter</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-primary font-medium mb-3">{t('info')}</div>
            <ul className="space-y-1.5 text-secondary">
              <li><Link href={`/${locale}/submit`} className="hover:text-primary">{tNav('submit')}</Link></li>
              <li><a href="https://github.com/lonzo-huang/alaolo" target="_blank" rel="noopener noreferrer" className="hover:text-primary">GitHub</a></li>
              <li><Link href={`/${locale}/admin`} className="hover:text-primary">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-app text-xs text-tertiary text-center">
          {t('copyright')}
        </div>
      </div>
    </footer>
  )
}
