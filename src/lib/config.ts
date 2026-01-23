/**
 * Configuración centralizada de variables de entorno - Finora
 *
 * Este archivo centraliza TODAS las variables de entorno del proyecto.
 * Bun lee automáticamente los archivos .env sin dependencias adicionales.
 *
 * Uso:
 *   import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/config'
 */

// =============================================================================
// Destructuración de variables de entorno
// =============================================================================
const {
  // Supabase
  SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  // App
  NEXT_PUBLIC_APP_URL,
} = process.env;

// =============================================================================
// Exports con fallbacks y aliases
// =============================================================================

// Supabase URL (soporta ambos nombres de variable)
export const supabaseUrl = SUPABASE_URL || NEXT_PUBLIC_SUPABASE_URL || '';

// Supabase Anon Key
export const supabaseAnonKey = NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase Service Role Key (solo servidor)
export const supabaseServiceRoleKey = SUPABASE_SERVICE_ROLE_KEY || '';

// App URL
export const appUrl = NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// =============================================================================
// Validaciones (ejecutadas al importar)
// =============================================================================
if (!supabaseUrl) {
  throw new Error(
    'Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
      'Please check your .env file.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' + 'Please check your .env file.'
  );
}

// =============================================================================
// Config object (alternativa agrupada)
// =============================================================================
export const config = {
  supabase: {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    serviceRoleKey: supabaseServiceRoleKey,
  },
  app: {
    url: appUrl,
  },
} as const;
