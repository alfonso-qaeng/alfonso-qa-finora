/**
 * Supabase Browser Client
 *
 * Use this client for client-side operations (React components, hooks).
 * Automatically handles cookies via document.cookie.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

// Access env vars directly - Next.js replaces NEXT_PUBLIC_* at build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
        'Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file.'
    );
  }
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
