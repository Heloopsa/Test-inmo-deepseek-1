# MEMORY BANK — InmuebleRD

## Project Overview

Micro SaaS inmobiliario para República Dominicana. Plataforma de marketplace de propiedades con autenticación, pagos Stripe, mapas Leaflet y backend en Supabase.

- **Repo**: https://github.com/Heloopsa/Test-inmo-deepseek-1
- **Stack**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Supabase + Stripe + Leaflet
- **Framework**: Next.js 16.2.6 con Turbopack
- **Deploy**: Vercel (Dashboard → Settings → Git → Root Directory: `inmueble-rd`)

---

## Architecture

### Middleware Pattern (Next.js 16)

- **NO** `src/middleware.ts` — se usa `src/proxy.ts` como middleware
- El proxy protege rutas `/dashboard` y redirige usuarios autenticados fuera de `/auth/*`

### Auth Flow

- Supabase SSR con `@supabase/ssr` para sesiones cookie-based
- Login: email/password + Google OAuth
- Registro: `signUp()` → trigger en Supabase crea perfil en tabla `profiles`
- Callback: `/auth/callback` intercambia code por session y redirige a `/dashboard`

### Database Schema (Supabase PostgreSQL)

```
profiles          → Perfiles de agentes/compradores
provinces         → 32 provincias de RD + Distrito Nacional
municipalities    → Municipios con foreign key a provinces
properties        → Inmuebles (venta/alquiler) con fotos en Storage
property_images   → Galería de imágenes por propiedad
leads             → Contactos de interesados
favorites         → Propiedades guardadas
reviews           → Reseñas de propiedades
```

### RLS Policies

- Todas las tablas tienen Row Level Security habilitado
- `profiles`: usuarios ven/editan solo su propio perfil
- `properties`: cualquiera ve activos, creador edita los suyos
- `leads`: solo el agente propietario puede ver
- `favorites`: usuarios ven solo sus favoritos

### Storage

- Bucket: `property-images` (público para lectura)
- Path: `properties/[property_id]/[filename]`

---

## File Structure

```
inmueble-rd/
├── src/
│   ├── proxy.ts                    # Middleware (Next.js 16 pattern)
│   ├── app/
│   │   ├── layout.tsx              # Root layout con Supabase provider
│   │   ├── page.tsx                # Homepage
│   │   ├── api/auth/signout/route.ts
│   │   ├── auth/callback/route.ts  # OAuth callback
│   │   ├── auth/login/page.tsx     # Login form
│   │   ├── auth/register/page.tsx  # Register form
│   │   ├── auth/forgot-password/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx          # Dashboard shell
│   │   │   ├── page.tsx            # Dashboard overview
│   │   │   ├── properties/         # CRUD properties
│   │   │   ├── leads/page.tsx      # Leads list
│   │   │   ├── settings/page.tsx   # Profile settings
│   │   │   └── subscription/page.tsx
│   │   ├── properties/
│   │   │   ├── page.tsx            # Property listings
│   │   │   └── [id]/page.tsx       # Property detail
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── components/
│   │   ├── Navbar.tsx              # Header con navegación
│   │   ├── Footer.tsx              # Footer con links
│   │   ├── MobileMenu.tsx          # Menú responsive
│   │   ├── PropertyCard.tsx        # Card de propiedad
│   │   ├── PropertyGallery.tsx     # Galería interactiva (lightbox)
│   │   ├── PropertyMap.tsx         # Leaflet map
│   │   ├── PropertyContact.tsx     # Agent card + lead form
│   │   └── PropertyActions.tsx     # Share/Favorite buttons
│   ├── lib/
│   │   ├── supabase/server.ts      # Supabase server client
│   │   ├── supabase/client.ts      # Supabase browser client
│   │   ├── stripe.ts               # Stripe helpers
│   │   └── whatsapp.ts             # WhatsApp URL builder
│   └── types/
│       └── database.types.ts       # Generated Supabase types
├── supabase/
│   └── schema.sql                  # Full DB schema + seed data
├── .env.local                      # Environment variables
├── vercel.json                     # Vercel config (minimal)
└── next.config.ts                  # Next.js config
```

---

## Key Code Patterns

### Server Component Data Fetching

```typescript
// src/app/properties/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch property (no JOIN — use maybeSingle for optional relations)
  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // Optional agent fetch
  let agentInfo = null;
  if (property?.agent_id) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", property.agent_id)
      .single();
    agentInfo = data;
  }
}
```

### Client Component (Interactive)

```typescript
// src/components/PropertyActions.tsx
'use client'

export default function PropertyActions({ title }: { title: string }) {
  const handleShare = () => {
    if (navigator.share) navigator.share({ title, url: window.location.href })
    else navigator.clipboard.writeText(window.location.href)
  }
  return <button onClick={handleShare}>Compartir</button>
}
```

### Supabase Server Client

```typescript
// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          /* ... */
        },
      },
    },
  );
}
```

### Supabase Browser Client

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
```

---

## Environment Variables (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://ichymotczbfvlyeyjgvc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_PY0w_yX-Pg1ZFWyEnytfnA_8FtmJ1qV
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

STRIPE_SECRET_KEY=your-stripe-secret-key-here
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret-here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key-here

NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Routes (18 total)

| Route                             | Type          | Description                                    |
| --------------------------------- | ------------- | ---------------------------------------------- |
| `/`                               | Server        | Homepage con buscador + propiedades destacadas |
| `/properties`                     | Server        | Listado con filtros                            |
| `/properties/[id]`                | Server        | Detalle con galería, mapa, contacto            |
| `/auth/login`                     | Client        | Login (email + Google OAuth)                   |
| `/auth/register`                  | Client        | Registro de agentes                            |
| `/auth/forgot-password`           | Client        | Reset password                                 |
| `/auth/callback`                  | Route Handler | OAuth callback                                 |
| `/dashboard`                      | Server        | Dashboard overview                             |
| `/dashboard/properties`           | Server        | CRUD propiedades del agente                    |
| `/dashboard/properties/new`       | Client        | Crear propiedad                                |
| `/dashboard/properties/[id]/edit` | Client        | Editar propiedad                               |
| `/dashboard/leads`                | Server        | Leads/contactos recibidos                      |
| `/dashboard/settings`             | Client        | Configurar perfil                              |
| `/dashboard/subscription`         | Server        | Planes de suscripción Stripe                   |
| `/privacy`                        | Static        | Política de privacidad                         |
| `/terms`                          | Static        | Términos de uso                                |

---

## Known Issues & Resolutions

| Issue                                                           | Resolution                                                        |
| --------------------------------------------------------------- | ----------------------------------------------------------------- |
| `middleware.ts` conflicts with `proxy.ts`                       | Delete `middleware.ts`, keep only `proxy.ts` (Next.js 16 pattern) |
| JOIN queries fail on null relations                             | Use separate optional queries with try/catch                      |
| "Event handlers cannot be passed to Client Component props"     | Extract interactive buttons to `'use client'` component           |
| `.next/dev/` cache corruption after `rm -rf .next` + `next dev` | Full restart: kill port, rm .next, start fresh                    |
| VS Code TS errors from monorepo root                            | Use `js/ts.tsdk` in `.vscode/settings.json`                       |
| Vercel 404 on dynamic routes                                    | Set Root Directory in Vercel Dashboard to `inmueble-rd`           |

---

## Build Commands

```bash
# Development
npx next dev -p 3000

# Production build
npx next build

# Type check only
npx tsc --noEmit
```

## Git

```bash
git remote add origin https://github.com/Heloopsa/Test-inmo-deepseek-1.git
git push origin main
```

---

## Design System

- **Primary color**: Emerald (emerald-50 through emerald-900)
- **Cards**: White background, rounded-xl, subtle border/shadow
- **Typography**: Sans-serif, bold headings, gray-600 body text
- **Buttons**: Solid emerald bg, white text, rounded-lg
- **Inputs**: Gray-100 bg, gray-300 border, focus ring emerald-500
- **Badges**: Rounded-full, colored bg + text pairs

---

## Last Updated

2026-05-19
