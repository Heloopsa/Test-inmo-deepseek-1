export function getWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

export function getPropertyWhatsAppMessage(
  propertyTitle: string,
  agentPhone: string
): string {
  return `Hola, estoy interesado(a) en la propiedad "${propertyTitle}" que vi en InmuebleRD. ¿Podrías darme más información?`
}

export function getAgentContactButton(agentPhone: string, propertyTitle: string): string {
  const message = getPropertyWhatsAppMessage(propertyTitle, agentPhone)
  return getWhatsAppUrl(agentPhone, message)
}