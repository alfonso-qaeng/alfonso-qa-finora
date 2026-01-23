/**
 * Supabase Admin Client
 *
 * Use this client for server-side operations that need to bypass RLS.
 * ONLY use in trusted server environments (API routes, server actions).
 *
 * WARNING: This client has FULL access to the database. NEVER expose to client.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { supabaseUrl, supabaseServiceRoleKey } from '../config';

/**
 * Creates an admin Supabase client that bypasses Row Level Security.
 * Use sparingly and only when absolutely necessary.
 */
export function createAdminClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
        'Admin client requires service role key.'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
