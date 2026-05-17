import Link from 'next/link'
import { Search, MapPin, Home, Building2, Star, ArrowRight, Shield, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/PropertyCard'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch featured properties server-side
  const { data: featuredProperties } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6)

  // Fetch latest properties
  const { data: latestProperties } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(9)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Encuentra tu propiedad
              <br />
              <span className="text-emerald-200">ideal en RD</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-emerald-100">
              La plataforma inmobiliaria #1 de República Dominicana. 
              Miles de propiedades en venta y alquiler te esperan.
            </p>

            {/* Search Bar */}
            <div className="mt-10 mx-auto max-w-3xl">
              <form action="/properties" className="rounded-2xl bg-white p-3 shadow-xl">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <input
                    type="text"
                    name="q"
                    placeholder="Buscar por zona o ciudad..."
                    className="rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <select
                    name="type"
                    className="rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">Tipo</option>
                    <option value="apartment">Apartamento</option>
                    <option value="house">Casa</option>
                    <option value="condo">Condominio</option>
                    <option value="land">Terreno</option>
                    <option value="commercial">Comercial</option>
                  </select>
                  <select
                    name="operation"
                    className="rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">Operación</option>
                    <option value="sale">Venta</option>
                    <option value="rent">Alquiler</option>
                    <option value="rental_with_option">Alquiler con opción</option>
                  </select>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <Search className="h-5 w-5" />
                    Buscar
                  </button>
                </div>
              </form>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-sm text-emerald-200">Propiedades</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">200+</p>
                <p className="text-sm text-emerald-200">Agentes</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">50+</p>
                <p className="text-sm text-emerald-200">Zonas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Explora por tipo de propiedad
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {[
              { icon: Building2, label: 'Apartamentos', value: 'apartment' },
              { icon: Home, label: 'Casas', value: 'house' },
              { icon: Home, label: 'Condominios', value: 'condo' },
              { icon: MapPin, label: 'Terrenos', value: 'land' },
              { icon: Building2, label: 'Comerciales', value: 'commercial' },
              { icon: Building2, label: 'Oficinas', value: 'office' },
            ].map((type) => (
              <Link
                key={type.value}
                href={`/properties?type=${type.value}`}
                className="flex flex-col items-center rounded-xl border p-6 text-center transition-all hover:border-emerald-500 hover:shadow-md"
              >
                <type.icon className="h-8 w-8 text-emerald-600 mb-3" />
                <span className="text-sm font-medium text-gray-900">{type.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Propiedades destacadas</h2>
              <p className="text-gray-600 mt-1">Las mejores propiedades seleccionadas para ti</p>
            </div>
            <Link
              href="/properties"
              className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredProperties && featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property as any} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
              <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Aún no hay propiedades destacadas</p>
              <Link
                href="/properties"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Ver propiedades disponibles
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Latest Properties */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Últimas publicaciones</h2>
              <p className="text-gray-600 mt-1">Recientemente agregadas a InmuebleRD</p>
            </div>
            <Link
              href="/properties"
              className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {latestProperties && latestProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestProperties.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property as any} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
              <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Aún no hay propiedades publicadas</p>
              <Link
                href="/auth/register"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Sé el primero en publicar
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why InmuebleRD */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            ¿Por qué elegir InmuebleRD?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: 'Propiedades verificadas',
                description: 'Todas las propiedades son verificadas para garantizar su autenticidad y calidad.',
              },
              {
                icon: Heart,
                title: 'Atención personalizada',
                description: 'Conecta directamente con agentes inmobiliarios profesionales en RD.',
              },
              {
                icon: Star,
                title: 'Plataforma líder',
                description: 'La plataforma inmobiliaria más confiable de República Dominicana.',
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border bg-white p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <feature.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-700">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            ¿Quieres vender o alquilar tu propiedad?
          </h2>
          <p className="mt-4 text-emerald-100">
            Publica tu propiedad en InmuebleRD y llega a miles de compradores potenciales.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
            <Link
              href="/auth/register"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition-all hover:bg-gray-100"
            >
              Publicar propiedad gratis
            </Link>
            <Link
              href="/properties"
              className="rounded-xl border border-emerald-400 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-600"
            >
              Explorar propiedades
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}