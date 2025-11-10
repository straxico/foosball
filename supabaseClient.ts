import { createClient } from '@supabase/supabase-js'

// For platforms like Vercel, environment variables exposed to the client
// must have a specific prefix. For Vite-based projects, this is `VITE_`.
// FIX: Cast `import.meta` to `any` to resolve TypeScript errors for `import.meta.env`
// when Vite client types are not properly configured.
const supabaseUrl = (import.meta as any).env.SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key are required. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel project settings.");
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey)