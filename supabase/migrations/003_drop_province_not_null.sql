-- =============================================
-- Fix: "province" column has NOT NULL constraint
-- but the form doesn't include this field
-- =============================================

-- Remove NOT NULL constraint from province column
ALTER TABLE public.properties ALTER COLUMN province DROP NOT NULL;

-- Also ensure municipality_id has no NOT NULL (it's optional)
ALTER TABLE public.properties ALTER COLUMN municipality_id DROP NOT NULL;

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';