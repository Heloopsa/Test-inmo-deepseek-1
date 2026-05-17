import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value)
          })
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser() - just pass through the response. For example,
  // redirecting the user, we must return the response (including the cookies) -
  // before we can redirect.
  try {
    const { data } = await supabase.auth.getUser()

    // Protected routes that require authentication
    const protectedPaths = ['/dashboard']
    const isProtectedPath = protectedPaths.some(
      (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + '/')
    )

    if (isProtectedPath && !data.user) {
      // No user, redirect to login
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages
    if (request.nextUrl.pathname.startsWith('/auth/') && data.user) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  } catch {
    // Ignore errors
  }

  return supabaseResponse
}