import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Flag útil para que los componentes puedan caer a mockData si aún no hay credenciales.
export const isSupabaseConfigured = Boolean(
  url && anonKey && !url.includes("YOUR_PROJECT_REF") && !/^(tu_|YOUR_)/.test(anonKey)
);

if (!isSupabaseConfigured) {
  console.warn("ChowPulse: Supabase no configurado en .env.local — usando datos mock.");
}

export const supabase = createClient(url || "http://localhost", anonKey || "public-anon-placeholder");
