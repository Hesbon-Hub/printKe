import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseClients: Partial<Record<"persistent" | "session", SupabaseClient>> = {};
let missingConfiguration = false;

export function getSupabaseClient(rememberMe = true) {
  const storageMode = rememberMe ? "persistent" : "session";
  if (supabaseClients[storageMode]) return supabaseClients[storageMode] ?? null;
  if (missingConfiguration) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    missingConfiguration = true;
    return null;
  }

  const storage = typeof window === "undefined" ? undefined : rememberMe ? window.localStorage : window.sessionStorage;
  const client = createClient(url, anonKey, { auth: { storage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  supabaseClients[storageMode] = client;
  return client;
}