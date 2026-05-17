import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia' as any,
  typescript: true,
})

export const STRIPE_PLANS = {
  free: {
    id: 'free',
    name: 'Plan Gratis',
    price: 0,
    propertiesLimit: 3,
    featuredPerMonth: 0,
    verified: false,
  },
  basic: {
    id: 'basic',
    name: 'Plan Básico',
    price: 2900, // $29.00 USD in cents
    propertiesLimit: 20,
    featuredPerMonth: 2,
    verified: true,
  },
  premium: {
    id: 'premium',
    name: 'Plan Premium',
    price: 7900, // $79.00 USD in cents
    propertiesLimit: -1, // unlimited
    featuredPerMonth: 10,
    verified: true,
  },
} as const

export type StripePlanKey = keyof typeof STRIPE_PLANS