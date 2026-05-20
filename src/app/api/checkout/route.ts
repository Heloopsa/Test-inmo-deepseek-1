import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, STRIPE_PLANS, type StripePlanKey } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    const { searchParams } = new URL(request.url)
    const planParam = searchParams.get('plan')

    if (!planParam) {
      return NextResponse.redirect(new URL('/dashboard/subscription?error=no-plan', request.url))
    }

    // Map Spanish plan names to keys
    const planMap: Record<string, StripePlanKey> = {
      gratis: 'free',
      basic: 'basic',
      básico: 'basic',
      premium: 'premium',
    }

    const planKey = planMap[planParam.toLowerCase()]
    if (!planKey || planKey === 'free') {
      return NextResponse.redirect(new URL('/dashboard/subscription', request.url))
    }

    const plan = STRIPE_PLANS[planKey]
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      || (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null)
      || new URL(request.url).origin

    // If Stripe is not configured, simulate checkout and upgrade directly
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'your-stripe-secret-key-here') {
      // Simulate successful payment for development
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          subscription_plan: planKey,
          subscription_expires_at: thirtyDaysFromNow.toISOString(),
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating subscription:', updateError)
        return NextResponse.redirect(new URL('/dashboard/subscription?error=update-failed', request.url))
      }

      return NextResponse.redirect(new URL(`/pago/exito?plan=${planKey}`, request.url))
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Plan ${plan.name}`,
              description: planKey === 'basic'
                ? 'Hasta 20 propiedades, estadísticas básicas, soporte por email'
                : 'Propiedades ilimitadas, estadísticas avanzadas, soporte prioritario',
            },
            unit_amount: plan.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
        plan: planKey,
      },
      success_url: `${baseUrl}/pago/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pago/cancelado`,
    })

    return NextResponse.redirect(session.url!, 303)
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.redirect(new URL('/dashboard/subscription?error=stripe-error', err.url || request.url))
  }
}