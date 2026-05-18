import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MessageSquare, Home, Phone, Mail, Eye, CheckCircle2, Clock, ArrowRight } from 'lucide-react'

export default async function DashboardLeadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: leads } = await supabase
    .from('leads')
    .select(`
      *,
      property:property_id (id, title, photos, property_type)
    `)
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false })

  const leadsList = (leads as any[]) || []

  const typeLabels: Record<string, string> = {
    apartment: 'Apartamento', house: 'Casa', condo: 'Condominio',
    land: 'Terreno', commercial: 'Comercial', office: 'Oficina', local: 'Local',
  }

  const getLeadColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'contacted': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'qualified': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'closed': return 'bg-gray-100 text-gray-500 border-gray-200'
      default: return 'bg-gray-100 text-gray-500 border-gray-200'
    }
  }

  const getLeadIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="h-3.5 w-3.5" />
      case 'contacted': return <Phone className="h-3.5 w-3.5" />
      case 'qualified': return <CheckCircle2 className="h-3.5 w-3.5" />
      case 'closed': return <Eye className="h-3.5 w-3.5" />
      default: return <MessageSquare className="h-3.5 w-3.5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Leads y Consultas</h1>
              <p className="text-gray-600 mt-1">Personas interesadas en tus propiedades</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {leadsList.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
            <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No tienes leads aún</h2>
            <p className="text-gray-500 mb-6">
              Los leads aparecerán aquí cuando los interesados te contacten a través de tus propiedades.
            </p>
            <Link
              href="/dashboard/properties/new"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
            >
              <Home className="h-4 w-4" />
              Publicar más propiedades
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {leadsList.map((lead: any) => (
              <div key={lead.id} className="rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                          <span className="text-sm font-bold text-emerald-700">
                            {lead.buyer_name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{lead.buyer_name}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(lead.created_at).toLocaleDateString('es-DO', {
                              year: 'numeric', month: 'long', day: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        <a href={`mailto:${lead.buyer_email}`} className="flex items-center gap-1.5 hover:text-emerald-600 transition-all">
                          <Mail className="h-3.5 w-3.5" />
                          {lead.buyer_email}
                        </a>
                        {lead.buyer_phone && (
                          <a href={`tel:${lead.buyer_phone}`} className="flex items-center gap-1.5 hover:text-emerald-600 transition-all">
                            <Phone className="h-3.5 w-3.5" />
                            {lead.buyer_phone}
                          </a>
                        )}
                      </div>

                      {lead.property && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                            {typeLabels[lead.property.property_type] || lead.property.property_type}
                          </span>
                          <Link
                            href={`/properties/${lead.property.id}`}
                            className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                            target="_blank"
                          >
                            {lead.property.title}
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      )}

                      {lead.message && (
                        <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700 italic border border-gray-100">
                          &ldquo;{lead.message}&rdquo;
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getLeadColor(lead.status)}`}>
                        {getLeadIcon(lead.status)}
                        {lead.status === 'new' ? 'Nuevo' :
                         lead.status === 'contacted' ? 'Contactado' :
                         lead.status === 'qualified' ? 'Calificado' :
                         lead.status === 'closed' ? 'Cerrado' : lead.status}
                      </span>
                      <a
                        href={`mailto:${lead.buyer_email}?subject=Consulta sobre propiedad en InmuebleRD&body=Hola ${lead.buyer_name}, gracias por tu interés.`}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-emerald-700"
                      >
                        <Mail className="h-3 w-3" />
                        Responder
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}