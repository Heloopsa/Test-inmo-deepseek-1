-- Migration: Add missing columns to profiles table
-- Run this in Supabase SQL Editor to fix "column not found" errors
-- Generated: 2026-05-19

-- Add bio column if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;

-- Ensure all other expected columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS agency_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS license_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_plan text CHECK (subscription_plan IN ('free', 'basic', 'premium')) DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_expires_at timestamptz;

-- Refresh PostgREST schema cache so new columns are immediately available
NOTIFY pgrst, 'reload schema';