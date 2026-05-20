import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    || (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null)
    || 'http://localhost:3000'

  return NextResponse.redirect(new URL('/auth/login', baseUrl))
}