'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, Building2, Users, CreditCard, Settings, 
  Plus, LogOut, Menu, X
} from 'lucide-react'

interface DashboardSidebarProps {
  user: {
    email?: string
  }
  userProfile: {
    role: string
    full_name?: string
  } | null
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Propiedades', href: '/dashboard/properties', icon: Building2 },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
  { name: 'Suscripción', href: '/dashboard/subscription', icon: CreditCard },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardSidebar({ user, userProfile }: DashboardSidebarProps) {
  const pathname = usePathname()
  const isAgent = userProfile?.role === 'agent'

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-20 left-4 z-40">
        <button
          className="p-2 bg-white rounded-lg shadow-md border"
          onClick={() => document.getElementById('dashboard-sidebar')?.classList.toggle('hidden')}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        id="dashboard-sidebar"
        className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r overflow-y-auto"
      >
        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-lg font-bold text-emerald-700">
                {userProfile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {userProfile?.full_name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          {/* Quick Action - New Property */}
          {isAgent && (
            <Link
              href="/dashboard/properties/new"
              className="flex items-center gap-2 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 mb-6"
            >
              <Plus className="h-4 w-4" />
              Nueva propiedad
            </Link>
          )}

          {/* Navigation */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Section */}
          <div className="mt-8 pt-6 border-t">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all mb-2"
            >
              <Home className="h-5 w-5 text-gray-400" />
              Ver sitio público
            </Link>
            <form action="/api/auth/signout" method="post" className="w-full">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="h-5 w-5" />
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <div 
        className="lg:hidden fixed inset-0 bg-black/50 z-30 hidden" 
        onClick={() => document.getElementById('dashboard-sidebar')?.classList.add('hidden')}
      />
    </>
  )
}