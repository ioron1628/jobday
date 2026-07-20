import { createClient } from "@supabase/supabase-js";

const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const configuredAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Keep production builds from crashing during route analysis when environment
// variables are temporarily unavailable. Vercel should still provide the real
// values in Production and Preview environments.
const supabaseUrl = configuredUrl ?? "https://placeholder.supabase.co";
const supabaseAnonKey = configuredAnonKey ?? "placeholder-anon-key";

export const isAutobotSupabaseConfigured = Boolean(configuredUrl && configuredAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});
