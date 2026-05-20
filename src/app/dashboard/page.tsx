import Link from 'next/link'
import { Home, Building2, Eye, MessageSquare, DollarSign, Plus, Users, MapPin, Edit, Eye as ViewIcon, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

const typeLabels: Record<string, string> = {
  apartment: 'Apartamento', house: 'Casa', condo: 'Condominio',
  land: 'Terreno', commercial: 'Comercial', office: 'Oficina', local: 'Local',
}

const currencySymbol = (c: string) => c === 'USD' ? 'US$' : 'RD$'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const profileAny = profile as any
  const isAgent = profileAny?.role === 'agent'

  const { data: properties } = isAgent
    ? await supabase
        .from('properties')
        .select('*')
        .eq('agent_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5)
    : { data: [] }

  const { data: leads } = isAgent
    ? await supabase
        .from('leads')
        .select('id, created_at, buyer_name, status')
        .eq('agent_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5)
    : { data: [] }

  const totalViews = (properties as any[])?.reduce((sum: number, p: any) => sum + (p.views_count || 0), 0) ?? 0
  const propertyList = (properties as any[]) || []
  const leadList = (leads as any[]) || []

  const roleLabelMap: Record<string, string> = {
    buyer: 'Comprador',
    seller: 'Vendedor',
    agent: 'Agente Inmobiliario',
    admin: 'Administrador',
  }

  const roleLabel = roleLabelMap[profileAny?.role || 'buyer'] || 'Usuario'

  return (
    <div>
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Bienvenido, {profileAny?.full_name || user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                {roleLabel}
              </span>
              {profileAny?.subscription_plan && profileAny.subscription_plan !== 'free' && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                  Plan {profileAny.subscription_plan}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Propiedades</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{propertyList.length}</p>
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
                <p className="mt-2 text-3xl font-bold text-gray-900">{leadList.length}</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Visitas</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{totalViews}</p>
              </div>
              <div className="rounded-lg bg-purple-100 p-3">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Mi Plan</p>
                <p className="mt-2 text-xl font-bold text-gray-900 capitalize">{profileAny?.subscription_plan || 'free'}</p>
              </div>
              <div className="rounded-lg bg-amber-100 p-3">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {isAgent && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
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
          </div>
        )}

        {isAgent && propertyList.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Propiedades recientes</h2>
              <Link href="/dashboard/properties" className="text-sm text-emerald-600 hover:text-emerald-700">
                Ver todas
              </Link>
            </div>
            <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Propiedad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {propertyList.map((property: any) => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {property.photos?.[0] ? (
                              <img src={property.photos[0]} alt="" className="h-10 w-14 rounded object-cover" />
                            ) : (
                              <div className="h-10 w-14 rounded bg-gray-100 flex items-center justify-center">
                                <Home className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">{property.title}</p>
                              {property.neighborhood && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {property.neighborhood}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                            {typeLabels[property.property_type] || property.property_type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-emerald-600">
                            {currencySymbol(property.currency)} {Number(property.price).toLocaleString('es-DO')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            property.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                            property.status === 'sold' ? 'bg-red-100 text-red-700' :
                            property.status === 'rented' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              property.status === 'active' ? 'bg-emerald-500' :
                              property.status === 'sold' ? 'bg-red-500' :
                              property.status === 'rented' ? 'bg-blue-500' : 'bg-gray-400'
                            }`} />
                            {property.status === 'active' ? 'Activa' : 
                             property.status === 'sold' ? 'Vendida' : 
                             property.status === 'rented' ? 'Alquilada' : property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{property.views_count || 0}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/properties/${property.id}`}
                              target="_blank"
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                              title="Ver"
                            >
                              <ViewIcon className="h-4 w-4" />
                            </Link>
                            <Link
                              href={`/dashboard/properties/${property.id}/edit`}
                              className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {isAgent && propertyList.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center mb-8">
            <Home className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No tienes propiedades</h2>
            <p className="text-gray-500 mb-6">Publica tu primera propiedad para empezar a recibir consultas.</p>
            <Link
              href="/dashboard/properties/new"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Publicar primera propiedad
            </Link>
          </div>
        )}

        {isAgent && leadList.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Leads recientes</h2>
              <Link href="/dashboard/leads" className="text-sm text-emerald-600 hover:text-emerald-700">
                Ver todos
              </Link>
            </div>
            <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leadList.map((lead: any) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{lead.buyer_name}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {new Date(lead.created_at).toLocaleDateString('es-DO')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                            lead.status === 'contacted' ? 'bg-amber-100 text-amber-700' :
                            lead.status === 'converted' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {lead.status === 'new' ? 'Nuevo' :
                             lead.status === 'contacted' ? 'Contactado' :
                             lead.status === 'converted' ? 'Convertido' : lead.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!isAgent && (
          <div className="rounded-xl border bg-white p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-emerald-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Bienvenido a InmuebleRD</h2>
            <p className="text-gray-600 mb-6">
              Explora miles de propiedades en República Dominicana. Si eres agente inmobiliario, actualiza tu perfil para publicar propiedades.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                <Search className="h-4 w-4" />
                Explorar propiedades
              </Link>
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Actualizar perfil
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}