import { createBrowserClient } from "@supabase/ssr";

const DEFAULT_SUPABASE_URL = "https://teycynizlqktphpszfrf.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_ojNxTcuHEKzlK-7UoYD9GQ_-IowPYTO";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_KEY;

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
