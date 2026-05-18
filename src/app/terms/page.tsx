import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border bg-white p-8 shadow-sm sm:p-12">
          <Link href="/" className="text-sm text-emerald-600 hover:text-emerald-700 mb-6 inline-block">
            ← Volver al inicio
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Términos y Condiciones</h1>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>
              Bienvenido a <strong>InmuebleRD</strong>. Al acceder y utilizar esta plataforma, aceptas los
              siguientes términos y condiciones. Si no estás de acuerdo con ellos, te recomendamos no utilizar
              nuestros servicios.
            </p>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Descripción del servicio</h2>
              <p>
                InmuebleRD es una plataforma inmobiliaria que conecta compradores e inquilinos con agentes
                y agencias inmobiliarias en República Dominicana. Los agentes pueden publicar propiedades
                y recibir consultas de interesados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Registro de agentes</h2>
              <p>
                Para publicar propiedades, los agentes deben registrarse y proporcionar información veraz.
                Los agentes son responsables de la exactitud de los datos de las propiedades que publican.
                InmuebleRD se reserva el derecho de suspender cuentas que proporcionen información falsa.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Planes de suscripción</h2>
              <p>
                Los agentes pueden elegir entre planes gratuitos y de pago. El plan gratuito permite publicar
                hasta 3 propiedades. Los planes de pago ofrecen beneficios adicionales como propiedades ilimitadas,
                estadísticas avanzadas y prioridad en búsquedas. Los pagos se procesan a través de Stripe.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Responsabilidad</h2>
              <p>
                InmuebleRD actúa como intermediario entre agentes y compradores. No nos hacemos responsables
                de las transacciones finales entre las partes. Recomendamos verificar toda la información
                de las propiedades antes de realizar cualquier acuerdo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cancelación y reembolsos</h2>
              <p>
                Los agentes pueden cancelar su suscripción en cualquier momento desde la configuración de su cuenta.
                Los reembolsos se manejan caso por caso. Para solicitar un reembolso, contacta a nuestro equipo
                de soporte dentro de los primeros 14 días de la compra.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Modificaciones</h2>
              <p>
                InmuebleRD se reserva el derecho de modificar estos términos en cualquier momento.
                Los cambios serán notificados a los usuarios registrados por correo electrónico.
                El uso continuado de la plataforma después de las modificaciones constituye la aceptación
                de los nuevos términos.
              </p>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-500">
                Última actualización: 17 de mayo de 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}