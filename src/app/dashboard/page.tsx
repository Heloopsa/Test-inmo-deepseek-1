import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, Building2, Eye, MessageSquare, DollarSign, Plus, TrendingUp, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch stats
  const profileAny = profile as any
  const { data: properties } = profileAny?.role === 'agent'
    ? await supabase
        .from('properties')
        .select('id')
        .eq('agent_id', user.id)
    : { data: [] }

  const { data: leads } = await supabase
    .from('leads')
    .select('id')
    .eq('agent_id', user.id)
    .eq('status', 'new')

  const propertyCount = (properties as any[])?.length ?? 0
  const leadCount = (leads as any[])?.length ?? 0

  const roleLabelMap: Record<string, string> = {
    buyer: 'Comprador',
    seller: 'Vendedor',
    agent: 'Agente Inmobiliario',
    admin: 'Administrador',
  }

  const roleLabel = roleLabelMap[profileAny?.role || 'buyer'] || 'Usuario'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Bienvenido, {(profile as any)?.full_name || user.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                {roleLabel}
              </span>
              {/* <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                Plan Gratis
              </span> */}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Propiedades</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{propertyCount}</p>
              </div>
              <div className="rounded-lg bg-emerald-100 p-3">
                <Home className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Leads Nuevos</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{leadCount}</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Visitas</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">—</p>
              </div>
              <div className="rounded-lg bg-purple-100 p-3">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ingresos</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">—</p>
              </div>
              <div className="rounded-lg bg-amber-100 p-3">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {profile?.role === 'agent' && (
            <>
              <Link
                href="/dashboard/properties/new"
                className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center transition-all hover:border-emerald-500 hover:shadow-md"
              >
                <Plus className="h-10 w-10 mx-auto text-emerald-600 mb-3" />
                <h3 className="font-semibold text-gray-900">Publicar propiedad</h3>
                <p className="text-sm text-gray-500 mt-1">Agrega una nueva propiedad a tu perfil</p>
              </Link>

              <Link
                href="/dashboard/properties"
                className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center transition-all hover:border-emerald-500 hover:shadow-md"
              >
                <Building2 className="h-10 w-10 mx-auto text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900">Mis propiedades</h3>
                <p className="text-sm text-gray-500 mt-1">Gestiona tus propiedades publicadas</p>
              </Link>

              <Link
                href="/dashboard/leads"
                className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center transition-all hover:border-emerald-500 hover:shadow-md"
              >
                <Users className="h-10 w-10 mx-auto text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900">Leads</h3>
                <p className="text-sm text-gray-500 mt-1">Revisa los interesados en tus propiedades</p>
              </Link>
            </>
          )}

          <Link
            href="/dashboard/settings"
            className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center transition-all hover:border-emerald-500 hover:shadow-md"
          >
            <svg className="h-10 w-10 mx-auto text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.554 0c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.554 0c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.554 0v4c0 1.11-.89 2-2 2h-4a2 2 0 01-2-2v-4z" />
            </svg>
            <h3 className="font-semibold text-gray-900">Configuración</h3>
            <p className="text-sm text-gray-500 mt-1">Edita tu perfil y preferencias</p>
          </Link>

          <Link
            href="/dashboard/subscription"
            className="rounded-xl border-2 border-dashed border-emerald-200 p-6 text-center transition-all hover:border-emerald-500 hover:shadow-md bg-emerald-50"
          >
            <TrendingUp className="h-10 w-10 mx-auto text-emerald-600 mb-3" />
            <h3 className="font-semibold text-gray-900">Mejorar plan</h3>
            <p className="text-sm text-gray-500 mt-1">Desbloquea más funciones y propiedades</p>
          </Link>
        </div>

        {/* Recent Properties */}
        {propertyCount > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Propiedades recientes</h2>
              <Link href="/dashboard/properties" className="text-sm text-emerald-600 hover:text-emerald-700">
                Ver todas →
              </Link>
            </div>
            <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Propiedad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      No tienes propiedades aún.{' '}
                      <Link href="/dashboard/properties/new" className="text-emerald-600 hover:text-emerald-700">
                        Publica tu primera propiedad →
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}