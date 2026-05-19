-- =============================================
-- InmuebleRD - Fix ALL missing columns
-- Run ONCE in Supabase SQL Editor
-- This adds every column that the app needs
-- =============================================

-- FIX PROFILES TABLE
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS agency_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS license_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_plan text CHECK (subscription_plan IN ('free', 'basic', 'premium')) DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_expires_at timestamp with time zone;

-- FIX PROPERTIES TABLE
-- Drop all CHECK constraints to avoid conflicts with existing data
-- Validation is handled by the frontend form
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_property_type_check;
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_operation_type_check;
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_currency_check;

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
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS floor int default 0;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS year_built int;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS amenities text[];
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS features jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS neighborhood text;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS building_name text;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS photos text[];
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS is_featured boolean default false;

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';