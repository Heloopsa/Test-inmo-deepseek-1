import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET === 'your-stripe-webhook-secret-here') {
      // Stripe not configured, webhook events ignored in dev
      return NextResponse.json({ received: true })
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      const userId = session.metadata?.user_id
      const plan = session.metadata?.plan

      if (userId && plan) {
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()

        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

        await supabase
          .from('profiles')
          .update({
            subscription_plan: plan,
            subscription_expires_at: thirtyDaysFromNow.toISOString(),
          })
          .eq('id', userId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}