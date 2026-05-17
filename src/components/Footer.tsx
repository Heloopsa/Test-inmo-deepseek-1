import Link from 'next/link'
import { Home, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-6 w-6 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">
                Inmueble<span className="text-emerald-600">RD</span>
              </span>
            </Link>
            <p className="text-sm text-gray-600">
              La plataforma inmobiliaria #1 de República Dominicana. Encuentra tu propiedad ideal.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Navegación</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-emerald-600">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-sm text-gray-600 hover:text-emerald-600">
                  Propiedades
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-sm text-gray-600 hover:text-emerald-600">
                  Publicar propiedad
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Tipos de propiedad</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/properties?type=apartment" className="text-sm text-gray-600 hover:text-emerald-600">
                  Apartamentos
                </Link>
              </li>
              <li>
                <Link href="/properties?type=house" className="text-sm text-gray-600 hover:text-emerald-600">
                  Casas
                </Link>
              </li>
              <li>
                <Link href="/properties?type=condo" className="text-sm text-gray-600 hover:text-emerald-600">
                  Condos
                </Link>
              </li>
              <li>
                <Link href="/properties?type=commercial" className="text-sm text-gray-600 hover:text-emerald-600">
                  Comerciales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Contacto</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-emerald-600" />
                info@inmoblererd.com
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-emerald-600" />
                +1 (809) 555-0123
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-emerald-600" />
                Santo Domingo, R.D.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} InmuebleRD. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}