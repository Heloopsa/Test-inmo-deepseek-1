import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Home,
  BedDouble,
  Bath,
  Ruler,
  MapPin,
  Car,
  ArrowLeft,
  Heart,
  Share2,
  Phone,
  Mail,
  Star,
  CheckCircle2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getWhatsAppUrl, getPropertyWhatsAppMessage } from '@/lib/whatsapp'

interface PageProps {
  params: Promise<{ id: string }>
}

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
  sale: 'En Venta',
  rent: 'En Alquiler',
  rental_with_option: 'Alquiler con opción a compra',
}

const amenityLabels: Record<string, string> = {
  pool: 'Piscina',
  gym: 'Gimnasio',
  security: 'Seguridad 24/7',
  parking: 'Estacionamiento',
  elevator: 'Elevador',
  garden: 'Jardín',
  playground: 'Zona de juegos',
  barbecue: 'Parrilla',
  laundry: 'Lavandería',
  storage: 'Cuarto de almacenamiento',
  concierge: 'Conserje',
  solar: 'Energía solar',
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch property with agent info
  const { data: property, error } = await supabase
    .from('properties')
    .select(`
      *,
      agent:agent_id (
        id,
        full_name,
        phone,
        avatar_url,
        agency_name,
        bio,
        license_number
      ),
      municipality:municipality_id (
        id,
        name,
        slug,
        province:province_id (
          name,
          slug
        )
      )
    `)
    .eq('id', id)
    .single()

  if (!property || property.status !== 'active') {
    notFound()
  }

  // Increment views
  await supabase
    .from('properties')
    .update({ views_count: (property as any).views_count + 1 })
    .eq('id', id)

  // Fetch similar properties
  const { data: similarProperties } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .eq('property_type', (property as any).property_type)
    .neq('id', id)
    .order('created_at', { ascending: false })
    .limit(4)

  const prop = property as any
  const typeLabel = propertyTypeLabels[prop.property_type] || prop.property_type
  const operationLabel = operationTypeLabels[prop.operation_type] || prop.operation_type
  const currencySymbol = prop.currency === 'USD' ? 'US$' : 'RD$'

  const formatPrice = (price: number, currency: string): string => {
    return `${currencySymbol} ${price.toLocaleString('es-DO')}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/properties" className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600">
            <ArrowLeft className="h-4 w-4" />
            Volver a propiedades
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
              {prop.photos && prop.photos.length > 0 ? (
                <div className="relative aspect-[16/9]">
                  <Image
                    src={prop.photos[0]}
                    alt={prop.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 right-4 rounded-lg bg-black/70 px-3 py-1.5 text-sm text-white">
                    {prop.photos.length} fotos
                  </div>
                </div>
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-gray-100">
                  <Home className="h-16 w-16 text-gray-400" />
                </div>
              )}

              {/* Thumbnail gallery */}
              {prop.photos && prop.photos.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {prop.photos.slice(0, 6).map((photo: string, index: number) => (
                    <div key={index} className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={photo}
                        alt={`${prop.title} - Foto ${index + 1}`}
                        fill
                        className="cursor-pointer object-cover hover:opacity-80"
                      />
                    </div>
                  ))}
                  {prop.photos.length > 6 && (
                    <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">+{prop.photos.length - 6}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                      prop.operation_type === 'sale' ? 'bg-blue-600' : 'bg-purple-600'
                    }`}>
                      {operationLabel}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                      {typeLabel}
                    </span>
                    {prop.is_verified && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> Verificada
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">{prop.title}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50" aria-label="Compartir">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50" aria-label="Favorito">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Location */}
              {(prop.neighborhood || prop.address) && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <span>
                    {prop.neighborhood && <span>{prop.neighborhood}</span>}
                    {prop.neighborhood && prop.address && <span>, </span>}
                    {prop.address && <span>{prop.address}</span>}
                    {prop.municipality && (
                      <span>, {prop.municipality.name}</span>
                    )}
                    {prop.municipality?.province && (
                      <span>, {prop.municipality.province.name}</span>
                    )}
                  </span>
                </div>
              )}

              {/* Description */}
              {prop.description && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{prop.description}</p>
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                {prop.bedrooms && (
                  <div className="text-center">
                    <BedDouble className="h-6 w-6 mx-auto text-emerald-600 mb-1" />
                    <p className="text-sm font-semibold text-gray-900">{prop.bedrooms}</p>
                    <p className="text-xs text-gray-500">Habitaciones</p>
                  </div>
                )}
                {prop.bathrooms && (
                  <div className="text-center">
                    <Bath className="h-6 w-6 mx-auto text-emerald-600 mb-1" />
                    <p className="text-sm font-semibold text-gray-900">{prop.bathrooms}</p>
                    <p className="text-xs text-gray-500">Baños</p>
                  </div>
                )}
                <div className="text-center">
                  <Ruler className="h-6 w-6 mx-auto text-emerald-600 mb-1" />
                  <p className="text-sm font-semibold text-gray-900">{prop.area_sqm}</p>
                  <p className="text-xs text-gray-500">m²</p>
                </div>
                {prop.parking_spaces > 0 && (
                  <div className="text-center">
                    <Car className="h-6 w-6 mx-auto text-emerald-600 mb-1" />
                    <p className="text-sm font-semibold text-gray-900">{prop.parking_spaces}</p>
                    <p className="text-xs text-gray-500">Estacionamiento</p>
                  </div>
                )}
              </div>

              {/* Additional info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                {prop.floor > 0 && (
                  <div>
                    <p className="text-xs text-gray-500">Piso</p>
                    <p className="font-medium text-gray-900">{prop.floor}</p>
                  </div>
                )}
                {prop.year_built && (
                  <div>
                    <p className="text-xs text-gray-500">Año construcción</p>
                    <p className="font-medium text-gray-900">{prop.year_built}</p>
                  </div>
                )}
                {prop.condo_fee > 0 && (
                  <div>
                    <p className="text-xs text-gray-500">Cuota condominio</p>
                    <p className="font-medium text-gray-900">{formatPrice(prop.condo_fee, prop.currency)}</p>
                  </div>
                )}
                {prop.building_name && (
                  <div>
                    <p className="text-xs text-gray-500">Edificio</p>
                    <p className="font-medium text-gray-900">{prop.building_name}</p>
                  </div>
                )}
              </div>

              {/* Amenities */}
              {prop.amenities && prop.amenities.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Amenidades</h2>
                  <div className="flex flex-wrap gap-2">
                    {prop.amenities.map((amenity: string) => (
                      <span key={amenity} className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        {amenityLabels[amenity] || amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="rounded-xl border bg-white p-6 shadow-sm sticky top-24">
              <p className="text-3xl font-bold text-emerald-600 mb-1">
                {formatPrice(prop.price, prop.currency)}
              </p>
              {prop.price_per_sqm && (
                <p className="text-sm text-gray-500 mb-4">
                  {formatPrice(prop.price_per_sqm, prop.currency)} / m²
                </p>
              )}

              {/* Agent Info */}
              {prop.agent && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Agente</h3>
                  <div className="flex items-center gap-3 mb-4">
                    {prop.agent.avatar_url ? (
                      <Image
                        src={prop.agent.avatar_url}
                        alt={prop.agent.full_name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                        <span className="text-lg font-bold text-emerald-700">
                          {prop.agent.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{prop.agent.full_name}</p>
                      {prop.agent.agency_name && (
                        <p className="text-sm text-gray-500">{prop.agent.agency_name}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact buttons */}
                  <div className="space-y-2">
                    {prop.agent.phone && (
                      <a
                        href={getWhatsAppUrl(prop.agent.phone, getPropertyWhatsAppMessage(prop.title, prop.agent.phone))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                      </a>
                    )}
                    {prop.agent.phone && (
                      <a
                        href={`tel:${prop.agent.phone}`}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
                      >
                        <Phone className="h-4 w-4" />
                        Llamar
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Lead form */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">¿Te interesa esta propiedad?</h3>
                <form action={`/api/leads/${prop.id}`} method="POST" className="space-y-3">
                  <input type="text" name="buyer_name" placeholder="Tu nombre" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  <input type="email" name="buyer_email" placeholder="Tu email" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  <textarea name="message" placeholder="Hola, me interesa esta propiedad..." rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  <button type="submit" className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700">
                    Enviar consulta
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties && similarProperties.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Propiedades similares</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p as any} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// PropertyCard import from components
import PropertyCard from '@/components/PropertyCard'