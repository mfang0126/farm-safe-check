import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Session } from '@supabase/supabase-js';
import { AuthContext } from '@/contexts/AuthContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Notify user of sign-in/sign-out events
          if (event === 'SIGNED_IN') {
            toast.success('Signed in successfully');
            navigate('/dashboard');
          } else if (event === 'SIGNED_OUT') {
            toast.success('Signed out successfully');
          }
        }
      );
  
      // THEN check for existing session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });
  
      return () => {
        subscription.unsubscribe();
      };
    }, [navigate]);
  
    const signUp = async (email: string, password: string, metadata?: { first_name?: string, last_name?: string }) => {
      try {
        setLoading(true);
        const { error } = await supabase.auth.signUp({ 
          email,
          password,
          options: {
            data: metadata
          }
        });
  
        if (error) throw error;
        
        toast.success('Signup successful! Check your email for the confirmation link.', {
          duration: 5000,
        });
        
        // In development, we can auto-navigate to dashboard
        navigate('/dashboard');
      } catch (error) {
        toast.error((error as Error).message || 'An error occurred during sign up');
        throw error;
      } finally {
        setLoading(false);
      }
    };
  
    const signIn = async (email: string, password: string) => {
      try {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
  
        if (error) throw error;
        
        // Navigation will happen automatically via onAuthStateChange listener
      } catch (error) {
        toast.error((error as Error).message || 'An error occurred during sign in');
        throw error;
      } finally {
        setLoading(false);
      }
    };
  
    const signOut = async () => {
      try {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        navigate('/');
      } catch (error) {
        toast.error((error as Error).message || 'An error occurred during sign out');
      } finally {
        setLoading(false);
      }
    };
  
    const updateProfile = async (data: { first_name?: string, last_name?: string, farm_name?: string }) => {
      try {
        if (!user) throw new Error('User not authenticated');
        
        // Update the profile table
        const { error } = await supabase
          .from('profiles')
          .update(data)
          .eq('id', user.id);
  
        if (error) throw error;
        toast.success('Profile updated successfully');
      } catch (error) {
        toast.error((error as Error).message || 'An error occurred while updating profile');
        throw error;
      }
    };
  
    return (
      <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, updateProfile }}>
        {children}
      </AuthContext.Provider>
    );
  }
  