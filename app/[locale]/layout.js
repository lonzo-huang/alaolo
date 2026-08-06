import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/lib/i18n/config'
import { Providers } from '../providers'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { ThemedToaster } from '@/components/site/ThemedToaster'
import '../globals.css'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'alaolo · all latest articles on leading objects',
    template: '%s · alaolo',
  },
  description: 'A curated hub of the best developer, AI, and productivity resources.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-app text-primary antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Header locale={locale} />
            <main className="pt-16">{children}</main>
            <Footer locale={locale} />
            <ThemedToaster />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
