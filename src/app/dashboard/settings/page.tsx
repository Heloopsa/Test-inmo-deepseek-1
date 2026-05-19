'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, Save, User, Building2, Phone, Shield, Mail } from 'lucide-react'

export default function DashboardSettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  const loadProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) { router.push('/auth/login'); return }
      setUser(authUser)

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      setProfile(data as any)
    } catch {
      // silent
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const form = e.currentTarget
      const formData = new FormData(form)

      const profileData = {
        full_name: formData.get('full_name') as string,
        phone: formData.get('phone') as string,
        agency_name: formData.get('agency_name') as string,
        license_number: formData.get('license_number') as string,
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)

      if (updateError) throw updateError
      setSuccess('Perfil actualizado correctamente')
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600 mb-3">
            <ArrowLeft className="h-4 w-4" />
            Volver al dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-1">Edita tu perfil y preferencias de cuenta</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
          )}
          {success && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700 flex items-center gap-2">
              <Save className="h-4 w-4" />
              {success}
            </div>
          )}

          {/* Account Info */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="rounded-lg bg-emerald-100 p-2.5">
                <Mail className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Información de la cuenta</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="h-3.5 w-3.5 inline mr-1" />
                  Nombre completo *
                </label>
                <input
                  type="text" name="full_name" required
                  defaultValue={profile?.full_name || ''}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="h-3.5 w-3.5 inline mr-1" />
                  Teléfono
                </label>
                <input
                  type="tel" name="phone"
                  defaultValue={profile?.phone || ''}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="+1 (809) 555-0000"
                />
              </div>
            </div>
          </div>

          {/* Agent Info */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="rounded-lg bg-blue-100 p-2.5">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Información profesional</h2>
                <p className="text-sm text-gray-500">Datos de tu agencia o perfil profesional</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building2 className="h-3.5 w-3.5 inline mr-1" />
                  Nombre de agencia
                </label>
                <input
                  type="text" name="agency_name"
                  defaultValue={profile?.agency_name || ''}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Ej: Inmobiliaria Piantini"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Shield className="h-3.5 w-3.5 inline mr-1" />
                  Licencia / Matrícula
                </label>
                <input
                  type="text" name="license_number"
                  defaultValue={profile?.license_number || ''}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Número de licencia"
                />
              </div>
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
              <textarea
                name="bio" rows={4}
                defaultValue={profile?.bio || ''}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Cuéntales a tus clientes sobre ti y tu experiencia..."
              />
            </div> */}
          </div>

          {/* Danger Zone */}
          <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-red-700 mb-4">Zona de peligro</h2>
            <p className="text-sm text-gray-500 mb-4">
              Una vez que elimines tu cuenta, no hay vuelta atrás. Todos tus datos serán eliminados permanentemente.
            </p>
            <button
              type="button"
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:bg-red-50"
              onClick={async () => {
                if (window.confirm('¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.')) {
                  const { error } = await supabase.rpc('delete_user')
                  if (!error) {
                    await supabase.auth.signOut()
                    router.push('/')
                  } else {
                    setError('Error al eliminar cuenta. Contacta a soporte.')
                  }
                }
              }}
            >
              Eliminar mi cuenta
            </button>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}