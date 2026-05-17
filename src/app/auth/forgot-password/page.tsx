'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) {
        setError('No se pudo enviar el email. Verifica que el email exista.')
        return
      }

      setSuccess(true)
    } catch {
      setError('Error inesperado. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <Home className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">
                Inmueble<span className="text-emerald-600">RD</span>
              </span>
            </Link>
          </div>

          <div className="rounded-2xl border bg-white p-8 shadow-lg text-center">
            <CheckCircle className="h-16 w-16 mx-auto text-emerald-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email enviado</h1>
            <p className="text-gray-600 mb-6">
              Te hemos enviado un email con instrucciones para restablecer tu contraseña. Revisa tu bandeja de entrada.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Home className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-gray-900">
              Inmueble<span className="text-emerald-600">RD</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border bg-white p-8 shadow-lg">
          <Link href="/auth/login" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Volver al login
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Recuperar contraseña</h1>
          <p className="text-gray-600 mb-6">
            Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
          </p>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar instrucciones'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}