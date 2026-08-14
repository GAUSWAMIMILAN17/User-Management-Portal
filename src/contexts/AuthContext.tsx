import { createContext, useContext, useEffect, useState } from 'react';
import type { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { mockDb } from '../services/mockStorage';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isMockMode: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, fullName: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMockMode = !isSupabaseConfigured;

  useEffect(() => {
    async function initAuth() {
      setLoading(true);
      try {
        const client = supabase;
        if (isSupabaseConfigured && client) {
          const { data: { session } } = await client.auth.getSession();
          if (session?.user) {
            const { data: profile } = await client
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(profile as UserProfile);
            } else {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || 'Warehouse Manager',
                role: session.user.user_metadata?.role || 'Warehouse Manager',
              });
            }
          } else {
            setUser(null);
          }
        } else {
          const currentUser = mockDb.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err: any) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();

    const client = supabase;
    if (isSupabaseConfigured && client) {
      const { data: authListener } = client.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await client
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser(profile || {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || 'Warehouse Manager',
            role: session.user.user_metadata?.role || 'Warehouse Manager',
          });
        } else {
          setUser(null);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [isMockMode]);

  const signIn = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error: authErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: pass,
        });

        if (authErr) {
          const errMsg = authErr.message.toLowerCase();
          if (errMsg.includes('email not confirmed')) {
            throw new Error('Your email address has not been confirmed yet. Please check your email inbox for the confirmation link or disable "Confirm Email" in Supabase Auth settings.');
          }
          if (errMsg.includes('invalid') || authErr.status === 400) {
            throw new Error('Invalid email or password. If you do not have an account on this live database yet, please click "Sign Up" below to register.');
          }
          throw authErr;
        }

        if (data.session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          setUser(profile || {
            id: data.session.user.id,
            email: data.session.user.email || '',
            full_name: data.session.user.user_metadata?.full_name || 'Warehouse Manager',
            role: data.session.user.user_metadata?.role || 'Warehouse Manager',
          });
        }
      } else {
        const profile = mockDb.loginUser(email, pass);
        setUser(profile);
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to sign in. Please check your credentials.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, fullName: string, role: string) => {
    setError(null);
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error: authErr } = await supabase.auth.signUp({
          email: email.trim(),
          password: pass,
          options: {
            data: {
              full_name: fullName,
              role: role || 'Warehouse Manager',
            },
          },
        });

        if (authErr) {
          if (authErr.message.toLowerCase().includes('already registered')) {
            throw new Error('An account with this email address already exists. Please sign in instead.');
          }
          throw authErr;
        }

        // Supabase duplicate email check: identities array is empty if user already exists
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          throw new Error('An account with this email address already exists. Please sign in instead.');
        }

        // If email confirmation is required in Supabase, data.session will be null
        if (data.user && !data.session) {
          throw new Error('Account created! Please check your email inbox to confirm your account before signing in, OR disable "Confirm email" in Supabase Auth Settings for instant login.');
        }

        if (data.session) {
          await supabase.auth.signOut();
        }
        setUser(null);
      } else {
        mockDb.registerUser(fullName, email, role, pass);
        setUser(null);
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to register account. Please try again.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      } else {
        mockDb.setCurrentUser(null);
      }
      setUser(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isMockMode,
        signIn,
        signUp,
        signOut,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
