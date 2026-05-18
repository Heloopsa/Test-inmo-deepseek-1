import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border bg-white p-8 shadow-sm sm:p-12">
          <Link href="/" className="text-sm text-emerald-600 hover:text-emerald-700 mb-6 inline-block">
            ← Volver al inicio
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Privacidad</h1>

          <div className="prose prose-gray max-w-none space-y-6">
            <p className="text-gray-600 leading-relaxed">
              En <strong>InmuebleRD</strong>, nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.
            </p>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Información que recopilamos</h2>
              <p className="text-gray-600 leading-relaxed">
                Recopilamos la información que nos proporcionas directamente al registrarte, como tu nombre, correo electrónico,
                número de teléfono y datos de perfil. También recopilamos información sobre las propiedades que publicas
                y las consultas que realizas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Uso de la información</h2>
              <p className="text-gray-600 leading-relaxed">
                Utilizamos tu información para:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-2">
                <li>Crear y mantener tu cuenta de agente o comprador</li>
                <li>Publicar y gestionar propiedades inmobiliarias</li>
                <li>Conectar compradores con agentes inmobiliarios</li>
                <li>Enviar notificaciones sobre consultas y leads</li>
                <li>Mejorar nuestros servicios y la experiencia del usuario</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Protección de datos</h2>
              <p className="text-gray-600 leading-relaxed">
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal
                contra acceso no autorizado, alteración, divulgación o destrucción. Todos los datos se almacenan
                en servidores seguros con encriptación SSL/TLS.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Compartición de datos</h2>
              <p className="text-gray-600 leading-relaxed">
                No vendemos tu información personal a terceros. Compartimos información solo cuando es necesario
                para el funcionamiento del servicio, como con procesadores de pago (Stripe) para suscripciones,
                o cuando la ley lo requiera.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Tus derechos</h2>
              <p className="text-gray-600 leading-relaxed">
                Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento
                desde la configuración de tu cuenta. También puedes solicitar la exportación de tus datos
                contactándonos a través de nuestro formulario de contacto.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contacto</h2>
              <p className="text-gray-600 leading-relaxed">
                Si tienes preguntas sobre esta política de privacidad, puedes contactarnos a través de
                nuestro formulario de contacto o enviando un correo a privacidad@inmueble-rd.com.
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