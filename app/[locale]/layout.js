import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { locales } from '@/lib/i18n/config'
import { Providers } from '../providers'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { ThemedToaster } from '@/components/site/ThemedToaster'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' })

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'alaolo · all latest articles on leading objects',
    template: '%s · alaolo',
  },
  description: 'A curated hub of the best developer, AI, and productivity resources.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
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
    <html lang={locale} suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{__html: `(function(){try{var t=localStorage.getItem('theme')||(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.classList.add(t)}catch(e){document.documentElement.classList.add('dark')}})()`}} />
      </head>
      <body className="min-h-screen bg-app text-primary antialiased font-sans">
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
