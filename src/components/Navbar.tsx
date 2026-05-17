import Link from 'next/link'
import { Home, Search, LogIn, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import MobileMenu from './MobileMenu'

// Re-export proxy for potential future use
export { updateSession } from '@/proxy'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">
              Inmueble<span className="text-emerald-600">RD</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-emerald-600"
            >
              <Home className="h-4 w-4" />
              Inicio
            </Link>
            <Link
              href="/properties"
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-emerald-600"
            >
              <Search className="h-4 w-4" />
              Propiedades
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-emerald-600"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <form action="/api/auth/signout" method="post">
                  <button
                    type="submit"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600"
                  >
                    Cerrar sesión
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600"
                >
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <MobileMenu user={user ?? undefined} />
          </div>
        </div>
      </div>
    </nav>
  )
}