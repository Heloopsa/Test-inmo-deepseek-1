import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'InmuebleRD - Plataforma Inmobiliaria de República Dominicana',
  description: 'Encuentra tu propiedad ideal en República Dominicana. Casas, apartamentos, condominios y más en venta y alquiler.',
  keywords: ['inmuebles republica dominicana', 'propiedades santo domingo', 'casa venta rd', 'apartamento alquiler'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased text-gray-900">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}