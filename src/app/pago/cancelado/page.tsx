import Link from 'next/link'
import { XCircle, Home, ArrowLeft } from 'lucide-react'

export default function PagoCanceladoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Home className="h-6 w-6 text-emerald-600" />
            <span className="text-lg font-bold text-gray-900">
              Inmueble<span className="text-emerald-600">RD</span>
            </span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-white p-8 shadow-lg text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pago cancelado
          </h1>
          <p className="text-gray-600 mb-8">
            El proceso de pago fue cancelado. No se ha realizado ningún cargo.
            Puedes intentarlo de nuevo cuando quieras.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard/subscription"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a planes
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              <Home className="h-4 w-4" />
              Ir al dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}