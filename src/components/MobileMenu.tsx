'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Home, Search, LogIn, User, Menu, X } from 'lucide-react'

interface MobileMenuProps {
  user?: { id: string }
}

export default function MobileMenu({ user }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-16 border-b bg-white shadow-lg md:hidden">
          <div className="flex flex-col gap-2 p-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              <Home className="h-4 w-4" />
              Inicio
            </Link>
            <Link
              href="/properties"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              <Search className="h-4 w-4" />
              Propiedades
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <form action="/api/auth/signout" method="post">
                  <button
                    type="submit"
                    className="w-full rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 text-left"
                  >
                    Cerrar sesión
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  onClick={() => setOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}