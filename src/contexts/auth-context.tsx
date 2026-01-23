'use client';

/**
 * AuthContext - Supabase Authentication
 *
 * Provides authentication state and methods throughout the app.
 * Uses Supabase Auth SDK for real authentication.
 *
 * Usage:
 *   import { useAuth } from '@/contexts/auth-context'
 *   const { user, signIn, signOut } = useAuth()
 */

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

// Profile type from database
type Profile = Database['public']['Tables']['profiles']['Row'];

// Auth context state
interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
}

// Auth context methods
interface AuthMethods {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

type AuthContextType = AuthState & AuthMethods;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
  });

  const supabase = createClient();

  // Fetch user profile from database
  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
      }

      return data;
    },
    [supabase]
  );

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (!state.user) return;

    const profile = await fetchProfile(state.user.id);
    setState(prev => ({ ...prev, profile }));
  }, [state.user, fetchProfile]);

  // Sign in with email and password
  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    },
    [supabase]
  );

  // Sign up with email and password
  const signUp = useCallback(
    async (email: string, password: string, name?: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      // Create profile after successful signup
      if (!error && data.user) {
        await supabase.from('profiles').insert({
          user_id: data.user.id,
          name: name || null,
          currency_symbol: '$',
        });
      }

      return { error };
    },
    [supabase]
  );

  // Sign out
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({
      user: null,
      profile: null,
      session: null,
      isLoading: false,
    });
  }, [supabase]);

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setState({
          user: session.user,
          profile,
          session,
          isLoading: false,
        });
      } else {
        setState({
          user: null,
          profile: null,
          session: null,
          isLoading: false,
        });
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setState({
          user: session.user,
          profile,
          session,
          isLoading: false,
        });
      } else {
        setState({
          user: null,
          profile: null,
          session: null,
          isLoading: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
