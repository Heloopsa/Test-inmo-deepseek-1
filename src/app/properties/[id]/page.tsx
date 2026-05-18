import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PropertyCard from '@/components/PropertyCard'
import PropertyGallery from '@/components/PropertyGallery'
import PropertyMap from '@/components/PropertyMap'
import PropertyContact from '@/components/PropertyContact'
import PropertyActions from '@/components/PropertyActions'
import { createClient } from '@/lib/supabase/server'
import type { Property, Profile, Municipality, Province } from '@/types/database.types'
import {
  BedDouble, Bath, Ruler, MapPin, Car, ArrowLeft, Heart, Share2,
  CheckCircle2, Building2, Calendar, Layers, Zap, Home,
} from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

// Extended property type with optional relations
interface PropertyWithRelations extends Property {
  agent: Profile | null
  municipality: (Municipality & { province: { name: string; slug: string } | null }) | null
}

const propertyTypeLabels: Record<string, string> = {
  apartment: 'Apartamento', house: 'Casa', condo: 'Condominio',
  land: 'Terreno', commercial: 'Comercial', office: 'Oficina', local: 'Local',
}

const operationTypeLabels: Record<string, string> = {
  sale: 'En Venta', rent: 'En Alquiler', rental_with_option: 'Alquiler con opción',
}

const amenityLabels: Record<string, string> = {
  pool: 'Piscina', gym: 'Gimnasio', security: 'Seguridad 24/7', parking: 'Estacionamiento',
  elevator: 'Elevador', garden: 'Jardín', playground: 'Zona de juegos', barbecue: 'Parrilla',
  laundry: 'Lavandería', storage: 'Almacenamiento', concierge: 'Conserje', solar: 'Energía solar',
  ac: 'Aire acondicionado', furnished: 'Amueblado', terrace: 'Terraza', balcony: 'Balcón',
  laundry_room: 'Cuarto de lavado', walk_in_closet: 'Walk-in closet', study: 'Estudio',
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // First fetch just the property (avoid JOIN failures when relations are missing)
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !property) notFound()

  // Build property with relations (optional queries avoid JOIN failures)
  const prop: PropertyWithRelations = {
    ...property,
    agent: null,
    municipality: null,
  }

  // Try to fetch agent info separately (optional)
  if (prop.agent_id) {
    try {
      const { data: agent } = await supabase
        .from('profiles')
        .select('id, full_name, phone, avatar_url, agency_name, bio')
        .eq('id', prop.agent_id)
        .single()
      if (agent) prop.agent = agent as Profile
    } catch {}
  }

  // Try to fetch municipality separately (optional)
  if (prop.municipality_id) {
    try {
      const { data: mun } = await supabase
        .from('municipalities')
        .select('id, name, slug, province:province_id (name, slug)')
        .eq('id', prop.municipality_id)
        .single()
      if (mun) prop.municipality = mun as any
    } catch {}
  }

  // Increment views (non-critical)
  try {
    await supabase.from('properties').update({ views_count: (prop.views_count || 0) + 1 }).eq('id', id)
  } catch {}

  const typeLabel = propertyTypeLabels[prop.property_type] || prop.property_type
  const operationLabel = operationTypeLabels[prop.operation_type] || prop.operation_type
  const currencySymbol = prop.currency === 'USD' ? 'US$' : 'RD$'
  const formatPrice = (price: number) => `${currencySymbol} ${price.toLocaleString('es-DO')}`

  // Get similar properties
  let similarProperties: Property[] = []
  try {
    const { data: similar } = await supabase
      .from('properties')
      .select('*')
      .eq('property_type', prop.property_type)
      .neq('id', id)
      .order('created_at', { ascending: false })
      .limit(4)
    similarProperties = similar || []
  } catch {}

  // Build location string
  const locationParts = [
    prop.neighborhood,
    prop.address,
    prop.municipality?.name,
    prop.municipality?.province?.name,
  ].filter(Boolean)
  const locationString = locationParts.join(', ')

  // Build features array for display
  const features = [
    { icon: BedDouble, label: 'Habitaciones', value: prop.bedrooms ?? 0, show: (prop.bedrooms ?? 0) > 0 },
    { icon: Bath, label: 'Baños', value: prop.bathrooms ?? 0, show: (prop.bathrooms ?? 0) > 0 },
    { icon: Ruler, label: 'Área construida', value: `${prop.area_sqm} m²`, show: !!prop.area_sqm },
    { icon: Car, label: 'Estacionamiento', value: prop.parking_spaces, show: prop.parking_spaces > 0 },
  ]

  const details = [
    { icon: Building2, label: 'Tipo', value: typeLabel },
    { icon: Zap, label: 'Operación', value: operationLabel },
    { icon: Calendar, label: 'Año construcción', value: prop.year_built, show: !!prop.year_built },
    { icon: Layers, label: 'Piso', value: prop.floor, show: prop.floor > 0 },
    { icon: Home, label: 'Edificio', value: prop.building_name, show: !!prop.building_name },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/properties" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-emerald-600 transition-all">
              <ArrowLeft className="h-4 w-4" />
              Volver a propiedades
            </Link>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                prop.operation_type === 'sale' ? 'bg-blue-600' : 'bg-purple-600'
              }`}>
                {operationLabel}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                {typeLabel}
              </span>
              {prop.is_verified && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" /> Verificada
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ========== LEFT COLUMN ========== */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <PropertyGallery photos={prop.photos || []} title={prop.title} />

            {/* Title & Price */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 break-words">{prop.title}</h1>
                  {locationString && (
                    <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                      <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span className="text-sm">{locationString}</span>
                    </div>
                  )}
                </div>
                <PropertyActions title={prop.title} />
              </div>

              <div className="flex items-baseline gap-2 mt-4 pt-4 border-t">
                <span className="text-3xl font-bold text-emerald-600">{formatPrice(prop.price)}</span>
                {prop.operation_type === 'rent' && <span className="text-gray-500 text-sm font-medium">/mes</span>}
                {prop.price_per_sqm && (
                  <span className="text-sm text-gray-400 ml-2">
                    ≈ {formatPrice(prop.price_per_sqm)} / m²
                  </span>
                )}
              </div>
            </div>

            {/* Features Grid */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Características</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {features.filter(f => f.show).map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div key={feature.label} className="text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                        <Icon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <p className="text-xl font-bold text-gray-900">{feature.value}</p>
                      <p className="text-xs text-gray-500">{feature.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h2>
              <div className="prose prose-gray max-w-none">
                {prop.description ? (
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{prop.description}</p>
                ) : (
                  <p className="text-gray-400 italic">No hay descripción disponible para esta propiedad.</p>
                )}
              </div>
            </div>

            {/* Details Table */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles de la propiedad</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {details.filter(d => d.show !== false).map((detail) => {
                  const Icon = detail.icon
                  return (
                    <div key={detail.label} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-gray-200">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{detail.label}</p>
                        <p className="text-sm font-medium text-gray-900">{detail.value || '—'}</p>
                      </div>
                    </div>
                  )
                })}
                {(prop.condo_fee ?? 0) > 0 && (
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-gray-200">
                      <Building2 className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Cuota condominio</p>
                      <p className="text-sm font-medium text-gray-900">{formatPrice(prop.condo_fee ?? 0)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            {prop.amenities && prop.amenities.length > 0 && (
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenidades</h2>
                <div className="flex flex-wrap gap-2">
                  {prop.amenities.map((amenity: string) => (
                    <span key={amenity}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      {amenityLabels[amenity] || amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {prop.latitude && prop.longitude && (
              <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
                <div className="p-4 border-b bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900">Ubicación</h2>
                  {locationString && <p className="text-sm text-gray-500 mt-0.5">{locationString}</p>}
                </div>
                <PropertyMap latitude={prop.latitude} longitude={prop.longitude} title={prop.title} />
              </div>
            )}

            {/* Similar Properties */}
            {similarProperties.length > 0 && (
              <div className="pt-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Propiedades similares</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {similarProperties.map((p: any) => <PropertyCard key={p.id} property={p} />)}
                </div>
              </div>
            )}
          </div>

          {/* ========== RIGHT COLUMN (SIDEBAR) ========== */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="rounded-xl border bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <p className="text-3xl font-bold text-emerald-600">{formatPrice(prop.price)}</p>
              {prop.operation_type === 'rent' && <p className="text-sm text-gray-500">Por mes</p>}
              {prop.price_per_sqm && (
                <p className="text-sm text-gray-400 mt-1">{formatPrice(prop.price_per_sqm)} / m²</p>
              )}

              {/* Quick stats */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t text-sm text-gray-600">
                {(prop.bedrooms ?? 0) > 0 && <span><BedDouble className="h-3.5 w-3.5 inline mr-1" />{prop.bedrooms ?? 0} hab</span>}
                {(prop.bathrooms ?? 0) > 0 && <span><Bath className="h-3.5 w-3.5 inline mr-1" />{prop.bathrooms ?? 0} baños</span>}
                {prop.area_sqm && <span>{prop.area_sqm} m²</span>}
              </div>

              {/* Agent Card */}
              {prop.agent && (
                <PropertyContact agent={prop.agent} propertyTitle={prop.title} propertyId={prop.id} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}