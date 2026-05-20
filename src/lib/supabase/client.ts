import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = 'https://ichymotczbfvlyeyjgvc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PY0w_yX-Pg1ZFWyEnytfnA_8FtmJ1qV';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || SUPABASE_KEY;
  return createBrowserClient(url, key) as any;
}