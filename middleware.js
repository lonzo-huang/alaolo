import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/lib/i18n/config'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

export async function middleware(request) {
  // Skip api routes and auth callback (needs supabase cookie handling)
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/api') || pathname.includes('/auth/callback')) {
    return NextResponse.next()
  }

  const response = intlMiddleware(request)

  // Refresh session
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )
    await supabase.auth.getUser()
  } catch {}

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|favicon.ico|.*\\..*).*)'],
}
