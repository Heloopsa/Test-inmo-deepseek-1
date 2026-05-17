import { Suspense } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/PropertyCard'
import Link from 'next/link'

// Property type and operation labels
const propertyTypeLabels: Record<string, string> = {
  apartment: 'Apartamento',
  house: 'Casa',
  condo: 'Condominio',
  land: 'Terreno',
  commercial: 'Comercial',
  office: 'Oficina',
  local: 'Local',
}

const operationTypeLabels: Record<string, string> = {
  sale: 'Venta',
  rent: 'Alquiler',
  rental_with_option: 'Alquiler con opción',
}

interface SearchParams {
  q?: string
  type?: string
  operation?: string
  province?: string
  minPrice?: string
  maxPrice?: string
  bedrooms?: string
  page?: string
}

async function PropertiesContent({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  
  // Helper to get string value from search param
  const getParam = (key: string): string | undefined => {
    const val = params[key]
    if (typeof val === 'string') return val
    if (Array.isArray(val)) return val[0]
    return undefined
  }

  const supabase = await createClient()

  // Build query
  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('status', 'active')

  // Apply filters
  const q = getParam('q')
  const type = getParam('type')
  const operation = getParam('operation')
  const minPrice = getParam('minPrice')
  const maxPrice = getParam('maxPrice')
  const bedrooms = getParam('bedrooms')

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,neighborhood.ilike.%${q}%`)
  }
  
  if (type) {
    query = query.eq('property_type', type)
  }
  
  if (operation) {
    query = query.eq('operation_type', operation)
  }
  
  if (minPrice) {
    query = query.gte('price', parseFloat(minPrice))
  }
  
  if (maxPrice) {
    query = query.lte('price', parseFloat(maxPrice))
  }
  
  if (bedrooms) {
    query = query.gte('bedrooms', parseInt(bedrooms))
  }

  // Order by newest
  query = query.order('created_at', { ascending: false })

  // Pagination
  const page = parseInt(params.page as string) || 1
  const limit = 12
  const from = (page - 1) * limit
  const to = from + limit - 1

  query = query.range(from, to)

  const { data: properties, count: totalCount, error } = await query

  const count = totalCount ?? 0
  const totalPages = count > 0 ? Math.ceil(count / limit) : 1

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Propiedades</h1>
          
          {/* Search and filters */}
          <form action="/properties" method="GET" className="mt-4 space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  name="q"
                  type="text"
                  placeholder="Buscar por zona, ciudad o título..."
                  defaultValue={params.q as string | undefined}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Buscar
              </button>
            </div>

            {/* Filter row */}
            <div className="flex flex-wrap gap-2">
              <select name="type" defaultValue={params.type as string | undefined} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none">
                <option value="">Todos los tipos</option>
                {Object.entries(propertyTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <select name="operation" defaultValue={params.operation as string | undefined} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none">
                <option value="">Todas las operaciones</option>
                {Object.entries(operationTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <input
                name="minPrice"
                type="number"
                placeholder="Precio mín."
                defaultValue={params.minPrice as string | undefined}
                className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />

              <input
                name="maxPrice"
                type="number"
                placeholder="Precio máx."
                defaultValue={params.maxPrice as string | undefined}
                className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />

              <select name="bedrooms" defaultValue={params.bedrooms as string | undefined} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none">
                <option value="">Habitaciones</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>

              {/* Active filters */}
              {(q || type || operation || minPrice || maxPrice || bedrooms) && (
                <Link
                  href="/properties"
                  className="flex items-center gap-1 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                >
                  <X className="h-4 w-4" />
                  Limpiar
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {count !== undefined && count > 0 ? (
              <>
                Mostrando <span className="font-medium">{Math.min(count, limit)}</span> de{' '}
                <span className="font-medium">{count}</span> propiedades
                {(q || type || operation) && (
                  <span> para "{q}"</span>
                )}
              </>
            ) : (
              'No se encontraron propiedades'
            )}
          </p>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filtros</span>
          </div>
        </div>

        {properties && properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property as any} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/properties${new URLSearchParams({ ...params as Record<string, string>, page: String(page - 1) }).toString()}`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Anterior
                  </Link>
                )}

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum = i + 1
                    if (totalPages > 5) {
                      if (page <= 3) pageNum = i + 1
                      else if (page >= totalPages - 2) pageNum = totalPages - 4 + i
                      else pageNum = page - 2 + i
                    }
                    
                    return (
                      <Link
                        key={pageNum}
                        href={`/properties${new URLSearchParams({ ...params as Record<string, string>, page: String(pageNum) }).toString()}`}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium ${
                          pageNum === page
                            ? 'bg-emerald-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    )
                  })}
                </div>

                {page < totalPages && (
                  <Link
                    href={`/properties${new URLSearchParams({ ...params as Record<string, string>, page: String(page + 1) }).toString()}`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Siguiente
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron propiedades</h3>
            <p className="text-gray-600 mb-4">Intenta con otros filtros o términos de búsqueda</p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Ver todas las propiedades
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    }>
      <PropertiesContent searchParams={searchParams} />
    </Suspense>
  )
}