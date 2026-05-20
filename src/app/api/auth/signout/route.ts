import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // Use the origin from the actual request to determine the base URL
  const requestUrl = new URL(request.url)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    || (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null)
    || requestUrl.origin
    || 'http://localhost:3000'

  return NextResponse.redirect(new URL('/auth/login', baseUrl))
}