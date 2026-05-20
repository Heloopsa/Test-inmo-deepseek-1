-- =============================================
-- Fix: Drop NOT NULL from all columns that
-- the form doesn't necessarily send
-- =============================================

-- Drop NOT NULL from columns that may exist but the form doesn't send
ALTER TABLE public.properties ALTER COLUMN province DROP NOT NULL;
ALTER TABLE public.properties ALTER COLUMN city DROP NOT NULL;
ALTER TABLE public.properties ALTER COLUMN municipality_id DROP NOT NULL;
ALTER TABLE public.properties ALTER COLUMN agent_id DROP NOT NULL;

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';