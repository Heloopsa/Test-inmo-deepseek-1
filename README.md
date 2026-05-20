# 🏠 InmuebleRD - Plataforma Inmobiliaria para República Dominicana

Un Micro SaaS inmobiliario completo para el mercado dominicano, construido con Next.js 14, Supabase y Stripe.

## ✨ Características

- 🔐 **Autenticación completa** con Supabase Auth (Email/Password + Google OAuth)
- 🏘️ **Gestión de propiedades** - CRUD completo para agentes inmobiliarios
- 🔍 **Búsqueda avanzada** con filtros por tipo, operación, precio, habitaciones
- 📱 **Integración WhatsApp** para contacto directo agente-cliente
- 💳 **Pagos con Stripe** - Planes de suscripción para agentes (Gratis, Básico, Premium)
- 📊 **Dashboard** para agentes con estadísticas
- 📧 **Sistema de leads** - Formularios de contacto para propiedades
- 🌍 **Datos locales** - Provincias y municipios de República Dominicana precargados
- 📸 **Galería de imágenes** con Supabase Storage
- 🎨 **Diseño responsive** con Tailwind CSS

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilos | Tailwind CSS v4 |
| Backend/DB | Supabase (PostgreSQL + Auth + Storage) |
| Pagos | Stripe (Checkout Sessions) |
| Iconos | Lucide React |
| Deploy | Vercel + Supabase Cloud |

## 📋 Prerrequisitos

- Node.js >= 18.0.0
- npm o pnpm
- Cuenta de Supabase
- Cuenta de Stripe (para pagos)

## ⚡ Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd inmueble-rd

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales (ver abajo)

# 4. Ejecutar el servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 🔧 Configuración

### Variables de Entorno (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_tu-key
STRIPE_WEBHOOK_SECRET=whsec_tu-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu-key

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Base de Datos (Supabase)

1. Crear una cuenta en [supabase.com](https://supabase.com)
2. Crear un nuevo proyecto
3. Ejecutar el SQL en `supabase/schema.sql` en el SQL Editor de Supabase
4. Configurar el bucket de almacenamiento `property-images` en Storage
5. Copiar las credenciales en `.env.local`

### Stripe

1. Crear cuenta en [stripe.com](https://stripe.com)
2. Crear los productos y precios en el Dashboard de Stripe
3. Configurar el webhook endpoint en `http://localhost:3000/api/webhook`
4. Copiar las claves en `.env.local`

## 📁 Estructura del Proyecto

```
inmueble-rd/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/               # Páginas de autenticación
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── callback/route.ts
│   │   ├── properties/         # Listado y detalle de propiedades
│   │   │   ├── page.tsx        # Listado con filtros
│   │   │   └── [id]/page.tsx   # Detalle de propiedad
│   │   ├── dashboard/          # Panel del agente
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/                # Route Handlers
│   │   │   └── auth/signout/route.ts
│   │   ├── page.tsx            # Home page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css
│   ├── components/             # Componentes reutilizables
│   │   ├── Navbar.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── Footer.tsx
│   │   └── PropertyCard.tsx
│   ├── lib/                    # Utilidades
│   │   ├── supabase/           # Clientes Supabase
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── stripe.ts
│   │   └── whatsapp.ts
│   ├── middleware.ts           # Next.js middleware
│   └── types/
│       └── database.types.ts   # Tipos TypeScript generados
├── supabase/
│   └── schema.sql              # Schema completo de la BD
├── .env.local                  # Variables de entorno
├── package.json
└── README.md
```

## 🗄️ Modelo de Datos

### Tablas principales:

| Tabla | Descripción |
|-------|-------------|
| `profiles` | Perfiles de usuarios (agentes, compradores) |
| `properties` | Propiedades inmobiliarias |
| `provinces` | Provincias de RD |
| `municipalities` | Municipios por provincia |
| `leads` | Consultas de interesados |
| `favorites` | Propiedades favoritas del usuario |
| `reviews` | Reseñas para agentes |

### Tipos de propiedad:
- Apartamento, Casa, Condominio, Terreno, Comercial, Oficina, Local

### Operaciones:
- Venta, Alquiler, Alquiler con opción a compra

### Planes para agentes:
| Plan | Precio | Propiedades | Destacados/mes |
|------|--------|-------------|----------------|
| Gratis | $0 | 3 | 0 |
| Básico | $29/mes | 20 | 2 |
| Premium | $79/mes | Ilimitadas | 10 |

## 🚦 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Producción
npm start

# Linting
npm run lint
```

## 🔒 Seguridad

- **Row Level Security (RLS)** activado en todas las tablas
- **Autenticación** con sesiones de Supabase (no localStorage)
- **Validación en servidor** para todas las operaciones
- **Imágenes** subidas a Supabase Storage, no al servidor local

## 📱 Páginas del Sitio

| Ruta | Descripción |
|------|-------------|
| `/` | Home con buscador y propiedades destacadas |
| `/properties` | Listado con filtros avanzados |
| `/properties/[id]` | Detalle de propiedad con galería |
| `/auth/login` | Login con email/Google |
| `/auth/register` | Registro con selección de rol |
| `/auth/forgot-password` | Recuperación de contraseña |
| `/dashboard` | Panel del agente (protegido) |

## 🗺️ Roadmap

- [x] Autenticación completa
- [x] Listado de propiedades con filtros
- [x] Detalle de propiedad
- [x] Dashboard del agente
- [x] CRUD completo de propiedades (crear/editar/eliminar)
- [x] Subida de imágenes a Supabase Storage
- [ ] Sistema de leads completo
- [ ] Perfil de agente con reseñas
- [ ] Integración Stripe Checkout
- [ ] Webhook de Stripe para suscripciones
- [ ] Tour virtual integrado
- [ ] Mapa interactivo con Leaflet
- [ ] SEO optimizado
- [ ] PWA support

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor abrir un issue primero para discutir cambios.

## 📄 Licencia

MIT

## 🇩🇴 Hecho en República Dominicana

Con ❤️ para el mercado inmobiliario dominicano.
