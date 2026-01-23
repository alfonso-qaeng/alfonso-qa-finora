/**
 * Supabase Server Client
 *
 * Use this client for server-side operations (Server Components, Route Handlers, Server Actions).
 * Handles cookies via next/headers.
 *
 * IMPORTANT: In Next.js 15+, cookies() is async and must be awaited.
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';
import { supabaseUrl, supabaseAnonKey } from '../config';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}
