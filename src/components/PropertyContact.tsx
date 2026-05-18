'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Phone, Mail, Loader2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getWhatsAppUrl, getPropertyWhatsAppMessage } from '@/lib/whatsapp'

interface PropertyContactProps {
  agent: {
    id: string
    full_name: string
    phone: string | null
    avatar_url: string | null
    agency_name: string | null
    bio: string | null
  }
  propertyTitle: string
  propertyId: string
}

export default function PropertyContact({ agent, propertyTitle, propertyId }: PropertyContactProps) {
  const router = useRouter()
  const supabase = createClient()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const form = e.currentTarget
      const formData = new FormData(form)

      const leadData = {
        agent_id: agent.id,
        property_id: propertyId,
        buyer_name: formData.get('buyer_name') as string,
        buyer_email: formData.get('buyer_email') as string,
        buyer_phone: formData.get('buyer_phone') as string,
        message: formData.get('message') as string,
        status: 'new',
      }

      const { error: insertError } = await supabase
        .from('leads')
        .insert(leadData)

      if (insertError) throw insertError

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Error al enviar consulta')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-6 pt-6 border-t">
      {/* Agent Info */}
      <div className="flex items-center gap-3 mb-4">
        {agent.avatar_url ? (
          <Image src={agent.avatar_url} alt={agent.full_name} width={48} height={48} className="rounded-full object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 shrink-0">
            <span className="text-lg font-bold text-emerald-700">
              {agent.full_name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{agent.full_name}</p>
          {agent.agency_name && <p className="text-sm text-gray-500 truncate">{agent.agency_name}</p>}
          {agent.bio && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{agent.bio}</p>}
        </div>
      </div>

      {/* Contact Buttons */}
      <div className="space-y-2 mb-4">
        {agent.phone && (
          <a
            href={getWhatsAppUrl(agent.phone, getPropertyWhatsAppMessage(propertyTitle, agent.phone))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        )}
        <div className="flex gap-2">
          {agent.phone && (
            <a href={`tel:${agent.phone}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50">
              <Phone className="h-4 w-4" />
              Llamar
            </a>
          )}
          <a href={`mailto:${agent.id}@inmueble-rd.com`}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50">
            <Mail className="h-4 w-4" />
            Email
          </a>
        </div>
      </div>

      {/* Lead Form */}
      {submitted ? (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-emerald-700">¡Consulta enviada!</p>
          <p className="text-xs text-emerald-600 mt-1">El agente te contactará pronto.</p>
        </div>
      ) : (
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">¿Te interesa esta propiedad?</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" name="buyer_name" placeholder="Tu nombre" required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            <input type="email" name="buyer_email" placeholder="Tu email" required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            <input type="tel" name="buyer_phone" placeholder="Tu teléfono (opcional)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            <textarea name="message" placeholder="Hola, me interesa esta propiedad. Me gustaría recibir más información..."
              rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button type="submit" disabled={isSubmitting}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? 'Enviando...' : 'Enviar consulta'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}