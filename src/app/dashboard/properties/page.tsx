import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Home, Edit, Eye, Search, MapPin, BedDouble, Bath } from 'lucide-react'

export default async function DashboardPropertiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false })

  const propertyList = (properties as any[]) || []

  const typeLabels: Record<string, string> = {
    apartment: 'Apartamento', house: 'Casa', condo: 'Condominio',
    land: 'Terreno', commercial: 'Comercial', office: 'Oficina', local: 'Local',
  }

  const currencySymbol = (c: string) => c === 'USD' ? 'US$' : 'RD$'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Propiedades</h1>
              <p className="text-gray-600 mt-1">Gestiona tus propiedades publicadas</p>
            </div>
            <Link
              href="/dashboard/properties/new"
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Nueva propiedad
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {propertyList.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
            <Home className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No tienes propiedades</h2>
            <p className="text-gray-500 mb-6">Publica tu primera propiedad para empezar a recibir consultas.</p>
            <Link
              href="/dashboard/properties/new"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Publicar primera propiedad
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {propertyList.map((property: any) => (
              <div key={property.id} className="rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row">
                  {property.photos?.[0] ? (
                    <div className="relative h-48 w-full sm:w-56 shrink-0">
                      <img src={property.photos[0]} alt={property.title} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-48 w-full sm:w-56 items-center justify-center bg-gray-100 shrink-0">
                      <Home className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{property.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{property.neighborhood || property.address || 'Sin ubicación'}</span>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-emerald-600 whitespace-nowrap">
                          {currencySymbol(property.currency)} {Number(property.price).toLocaleString('es-DO')}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                          {typeLabels[property.property_type] || property.property_type}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          property.operation_type === 'sale' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {property.operation_type === 'sale' ? 'Venta' : property.operation_type === 'rent' ? 'Alquiler' : 'Alquiler con opción'}
                        </span>
                        {property.bedrooms > 0 && <span><BedDouble className="h-3.5 w-3.5 inline" /> {property.bedrooms}</span>}
                        {property.bathrooms > 0 && <span><Bath className="h-3.5 w-3.5 inline" /> {property.bathrooms}</span>}
                        {property.area_sqm && <span><Search className="h-3.5 w-3.5 inline" /> {property.area_sqm} m²</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
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
                          {property.status === 'active' ? 'Activa' : property.status === 'sold' ? 'Vendida' : property.status === 'rented' ? 'Alquilada' : property.status === 'inactive' ? 'Inactiva' : property.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/properties/${property.id}`}
                          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-all hover:bg-gray-50"
                          target="_blank"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Ver
                        </Link>
                        <Link
                          href={`/dashboard/properties/${property.id}/edit`}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-all hover:bg-emerald-100"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Editar
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}