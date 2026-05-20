import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Home, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

interface PageProps {
  searchParams: Promise<{ plan?: string; session_id?: string }>
}

export default async function PagoExitoPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const planName = params.plan === 'premium' ? 'Premium' : params.plan === 'basic' ? 'Básico' : ''

  // If user is logged in and no plan upgrade was applied yet, apply it now
  if (user && params.plan) {
    const planKey = params.plan === 'basic' ? 'basic' : params.plan === 'premium' ? 'premium' : null
    if (planKey) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single()

      if ((profile as any)?.subscription_plan !== planKey) {
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

        await supabase
          .from('profiles')
          .update({
            subscription_plan: planKey,
            subscription_expires_at: thirtyDaysFromNow.toISOString(),
          })
          .eq('id', user.id)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Home className="h-6 w-6 text-emerald-600" />
            <span className="text-lg font-bold text-gray-900">
              Inmueble<span className="text-emerald-600">RD</span>
            </span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-white p-8 shadow-lg text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Pago exitoso!
          </h1>
          <p className="text-gray-600 mb-6">
            {planName ? (
              <>Tu suscripción al <strong className="text-emerald-700">Plan {planName}</strong> ha sido activada.</>
            ) : (
              <>Tu suscripción ha sido activada correctamente.</>
            )}
          </p>

          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 mb-6 text-left">
            <h3 className="font-semibold text-emerald-800 mb-2">Beneficios activados:</h3>
            <ul className="space-y-2 text-sm text-emerald-700">
              {params.plan === 'premium' ? (
                <>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" /> Propiedades ilimitadas</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" /> Galería de hasta 20 fotos</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" /> Estadísticas avanzadas</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" /> Soporte prioritario</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" /> Tour virtual 360°</li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" /> Hasta 15 propiedades</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" /> Galería de hasta 10 fotos</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" /> Estadísticas básicas</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" /> Soporte por email</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
            >
              <Home className="h-4 w-4" />
              Ir al dashboard
            </Link>
            <Link
              href="/dashboard/properties/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              Publicar propiedad
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}