import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/lib/i18n/config'
import { Providers } from '../providers'
import { Header } from '@/components/site/Header'
import { Toaster } from '@/components/ui/sonner'
import '../globals.css'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'alaolo · Resource Hub',
    template: '%s · alaolo',
  },
  description: 'A curated hub of the best developer, AI, and productivity resources.',
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[#0B0E14] text-slate-100 antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Header locale={locale} />
            <main className="pt-16">{children}</main>
            <Toaster theme="dark" position="top-center" />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
