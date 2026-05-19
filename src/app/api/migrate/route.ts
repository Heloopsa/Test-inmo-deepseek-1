import { NextResponse } from 'next/server'

export async function POST() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const projectRef = 'ichymotczbfvlyeyjgvc'

  if (!serviceKey) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 })
  }

  // Try the Management API (requires access token, may fail)
  try {
    const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
          ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS agency_name text;
          ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS license_number text;
          ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
          ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
          ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_plan text DEFAULT 'free';
          ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS area_sqm numeric(8,2);
          ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS bedrooms int;
          ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS bathrooms int;
          ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS parking_spaces int default 0;
          ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS agent_id uuid;
          ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS property_type text;
          ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS operation_type text;
          ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS price_per_sqm numeric(10,2);
          ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS condo_fee numeric(10,2);
          ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS is_verified boolean default false;
          ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS latitude numeric(10,8);
          ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS longitude numeric(11,8);
          ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS views_count int default 0;
          NOTIFY pgrst, 'reload schema';
        `,
      }),
    })

    const data = await res.text()
    return NextResponse.json({ success: res.ok, data, status: res.status })
  } catch (err: any) {
    return NextResponse.json({
      error: 'Management API not accessible',
      message: err.message,
      instructions: 'Ve a Supabase Dashboard > SQL Editor y pega el contenido de supabase/schema.sql',
    }, { status: 500 })
  }
}