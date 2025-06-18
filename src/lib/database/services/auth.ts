import { supabase } from '../client';
import { profilesRepository } from '../repositories/profiles';
import type { Profile, ProfileUpdate } from '../types';
import { handleDatabaseError } from '../utils';
import { toast } from 'sonner';

/**
 * Authentication service providing high-level auth operations
 */
export class AuthService {
  
  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string, metadata?: { first_name?: string, last_name?: string }) {
    try {
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
    } catch (error) {
      handleDatabaseError(error as Error, 'signing up');
      throw error;
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      handleDatabaseError(error as Error, 'signing in');
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      handleDatabaseError(error as Error, 'signing out');
      throw error;
    }
  }

  /**
   * Get current user's profile
   */
  async getCurrentUserProfile(userId: string): Promise<Profile | null> {
    const response = await profilesRepository.getCurrentProfile(userId);
    return response.data;
  }

  /**
   * Update current user's profile
   */
  async updateUserProfile(userId: string, data: ProfileUpdate): Promise<Profile | null> {
    const response = await profilesRepository.updateProfile(userId, data);
    if (response.data) {
      toast.success('Profile updated successfully');
    }
    return response.data;
  }

  /**
   * Get current auth session
   */
  async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  /**
   * Get current auth user
   */
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
}

// Export singleton instance
export const authService = new AuthService(); 