import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CheckCircle2, ArrowLeft, Home, Building2, Star, Crown } from 'lucide-react'

const plans = [
  {
    name: 'Gratis',
    price: 'RD$ 0',
    period: 'Siempre',
    description: 'Perfecto para empezar',
    features: [
      'Hasta 3 propiedades',
      'Fotos básicas',
      'Perfil de agente',
      'Recibir consultas',
    ],
    cta: 'Plan actual',
    ctaClass: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50',
    popular: false,
    icon: Home,
  },
  {
    name: 'Básico',
    price: 'RD$ 1,500',
    period: '/mes',
    description: 'Para agentes activos',
    features: [
      'Hasta 15 propiedades',
      'Galería de hasta 10 fotos',
      'Estadísticas básicas',
      'Soporte por email',
      'Prioridad en búsquedas',
    ],
    cta: 'Elegir plan',
    ctaClass: 'bg-emerald-600 text-white hover:bg-emerald-700',
    popular: true,
    icon: Building2,
  },
  {
    name: 'Premium',
    price: 'RD$ 3,500',
    period: '/mes',
    description: 'Para agencias profesionales',
    features: [
      'Propiedades ilimitadas',
      'Galería de hasta 20 fotos',
      'Estadísticas avanzadas',
      'Soporte prioritario',
      'Máxima prioridad en búsquedas',
      'Tour virtual 360°',
      'Logo de agencia destacado',
    ],
    cta: 'Elegir plan',
    ctaClass: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700',
    popular: false,
    icon: Crown,
  },
]

export default async function SubscriptionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_plan')
    .eq('id', user.id)
    .single()

  const currentPlan = (profile as any)?.subscription_plan || 'free'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600 mb-3">
            <ArrowLeft className="h-4 w-4" />
            Volver al dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Planes de suscripción</h1>
          <p className="text-gray-600 mt-1">Elige el plan ideal para tu negocio inmobiliario</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Current Plan Banner */}
        <div className={`rounded-xl border p-6 mb-10 shadow-sm ${
          currentPlan === 'premium' ? 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200' :
          currentPlan === 'basic' ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200' :
          'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${
                currentPlan === 'premium' ? 'bg-amber-200' :
                currentPlan === 'basic' ? 'bg-emerald-200' : 'bg-gray-200'
              }`}>
                {currentPlan === 'premium' ? <Crown className="h-6 w-6 text-amber-700" /> :
                 currentPlan === 'basic' ? <Star className="h-6 w-6 text-emerald-700" /> :
                 <Home className="h-6 w-6 text-gray-600" />}
              </div>
              <div>
                <p className="text-sm text-gray-600">Plan actual</p>
                <p className={`text-xl font-bold ${
                  currentPlan === 'premium' ? 'text-amber-700' :
                  currentPlan === 'basic' ? 'text-emerald-700' : 'text-gray-700'
                }`}>
                  {currentPlan === 'free' ? 'Plan Gratis' :
                   currentPlan === 'basic' ? 'Plan Básico' : 'Plan Premium'}
                </p>
              </div>
            </div>
            {currentPlan !== 'premium' && (
              <span className="text-sm text-gray-500">Mejora tu plan para acceder a más beneficios</span>
            )}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.name.toLowerCase()
            const PlanIcon = plan.icon

            return (
              <div
                key={plan.name}
                className={`relative rounded-xl border bg-white shadow-sm transition-all hover:shadow-lg ${
                  plan.popular ? 'ring-2 ring-emerald-500 scale-105' : ''
                } ${isCurrent ? 'ring-2 ring-blue-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">
                      <Star className="h-3 w-3" />
                      Más popular
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${
                    plan.popular ? 'bg-emerald-100' : 'bg-gray-100'
                  }`}>
                    <PlanIcon className={`h-7 w-7 ${plan.popular ? 'text-emerald-600' : 'text-gray-600'}`} />
                  </div>

                  <h3 className="text-center text-lg font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-center text-sm text-gray-500 mb-4">{plan.description}</p>

                  <div className="text-center mb-6">
                    <span className={`font-bold ${plan.price === 'RD$ 0' ? 'text-3xl' : 'text-4xl'} text-gray-900`}>
                      {plan.price}
                    </span>
                    {plan.period !== 'Siempre' && (
                      <span className="text-sm text-gray-500">{plan.period}</span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                          plan.popular ? 'text-emerald-500' : 'text-gray-400'
                        }`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-6 pb-6">
                  {isCurrent ? (
                    <div className="w-full rounded-lg border border-blue-300 bg-blue-50 px-4 py-2.5 text-center text-sm font-semibold text-blue-700">
                      Plan actual
                    </div>
                  ) : (
                    <form action={`/api/checkout?plan=${plan.name.toLowerCase()}`} method="POST">
                      <button
                        type="submit"
                        disabled={plan.price === 'RD$ 0'}
                        className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${plan.ctaClass}`}
                      >
                        {plan.price === 'RD$ 0' ? 'Plan gratuito' : plan.cta}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Features Comparison */}
        <div className="mt-16 rounded-xl border bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Comparativa de planes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Característica</th>
                  <th className="text-center py-3 px-4 text-gray-700 font-semibold">Gratis</th>
                  <th className="text-center py-3 px-4 text-emerald-700 font-semibold">Básico</th>
                  <th className="text-center py-3 px-4 text-amber-700 font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'Propiedades', free: '3', basic: '15', premium: 'Ilimitado' },
                  { name: 'Fotos por propiedad', free: '5', basic: '10', premium: '20+' },
                  { name: 'Estadísticas', free: '—', basic: 'Básicas', premium: 'Avanzadas' },
                  { name: 'Soporte', free: '—', basic: 'Email', premium: 'Prioritario' },
                  { name: 'Prioridad búsquedas', free: '—', basic: '✓', premium: 'Máxima' },
                  { name: 'Tour virtual', free: '—', basic: '—', premium: '✓' },
                  { name: 'Logo destacado', free: '—', basic: '—', premium: '✓' },
                ].map((row) => (
                  <tr key={row.name}>
                    <td className="py-3 px-4 text-gray-900">{row.name}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{row.free}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{row.basic}</td>
                    <td className="py-3 px-4 text-center font-medium text-gray-900">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}