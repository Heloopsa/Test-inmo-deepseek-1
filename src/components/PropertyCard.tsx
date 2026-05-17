import Link from 'next/link'
import Image from 'next/image'
import {
  BedDouble,
  Bath,
  Ruler,
  MapPin,
  Heart,
  Star,
} from 'lucide-react'
import type { Property } from '@/types/database.types'

interface PropertyCardProps {
  property: Property
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

const propertyTypeLabels: Record<Property['property_type'], string> = {
  apartment: 'Apartamento',
  house: 'Casa',
  condo: 'Condominio',
  land: 'Terreno',
  commercial: 'Comercial',
  office: 'Oficina',
  local: 'Local',
}

const operationTypeLabels: Record<Property['operation_type'], string> = {
  sale: 'Venta',
  rent: 'Alquiler',
  rental_with_option: 'Alquiler con opción',
}

const currencySymbols: Record<'USD' | 'DOP', string> = {
  USD: 'US$',
  DOP: 'RD$',
}

export default function PropertyCard({ property, isFavorite, onToggleFavorite }: PropertyCardProps) {
  const typeLabel = propertyTypeLabels[property.property_type] || property.property_type
  const operationLabel = operationTypeLabels[property.operation_type] || property.operation_type
  const currencySymbol = currencySymbols[property.currency] || '$'

  const formatPrice = (price: number, currency: string): string => {
    return `${currencySymbol} ${price.toLocaleString('es-DO')}`
  }

  return (
    <Link href={`/properties/${property.id}`} className="group">
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-lg group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {property.photos && property.photos.length > 0 ? (
            <Image
              src={property.photos[0]}
              alt={property.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-sm">Sin imagen</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
              property.operation_type === 'sale' ? 'bg-blue-600' : 'bg-purple-600'
            }`}>
              {operationLabel}
            </span>
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 backdrop-blur-sm">
              {typeLabel}
            </span>
          </div>

          {/* Featured badge */}
          {property.is_featured && (
            <div className="absolute right-3 top-3">
              <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2 py-1 text-xs font-semibold text-white shadow-sm">
                <Star className="h-3 w-3" /> Destacada
              </span>
            </div>
          )}

          {/* Favorite button */}
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleFavorite()
              }}
              className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 shadow-sm transition-all hover:bg-white hover:shadow-md"
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </button>
          )}

          {/* Verified badge */}
          {property.is_verified && (
            <div className="absolute bottom-3 left-3">
              <span className="rounded-full bg-emerald-500 px-2 py-1 text-xs font-semibold text-white shadow-sm">
                ✓ Verificada
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="line-clamp-1 text-lg font-semibold text-gray-900 group-hover:text-emerald-600">
            {property.title}
          </h3>

          {/* Location */}
          {(property.neighborhood || property.address) && (
            <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">
                {property.neighborhood}
                {property.address && ` - ${property.address}`}
              </span>
            </div>
          )}

          {/* Price */}
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {formatPrice(property.price, property.currency)}
          </p>

          {/* Features */}
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <BedDouble className="h-4 w-4" />
                <span>{property.bedrooms} Hab.</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms} Baños</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Ruler className="h-4 w-4" />
              <span>{property.area_sqm} m²</span>
            </div>
          </div>

          {/* Extra info */}
          {property.parking_spaces > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              🚗 {property.parking_spaces} {property.parking_spaces === 1 ? 'Estacionamiento' : 'Estacionamientos'}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}