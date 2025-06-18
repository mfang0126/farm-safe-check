import { supabase } from '../client';
import type { 
  Profile, 
  ProfileInsert, 
  ProfileUpdate,
  DatabaseResponse 
} from '../types';
import {
  handleDatabaseError,
  createSuccessResponse,
  createErrorResponse
} from '../utils';

/**
 * Repository for profile operations
 */
export class ProfilesRepository {
  
  /**
   * Get current user's profile
   */
  async getCurrentProfile(userId: string): Promise<DatabaseResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return createSuccessResponse(data);
    } catch (error) {
      handleDatabaseError(error as Error, 'fetching profile');
      return createErrorResponse(error as Error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: ProfileUpdate): Promise<DatabaseResponse<Profile>> {
    try {
      const { data: result, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return createSuccessResponse(result);
    } catch (error) {
      handleDatabaseError(error as Error, 'updating profile');
      return createErrorResponse(error as Error);
    }
  }

  /**
   * Create a new profile (usually handled by trigger, but available for manual creation)
   */
  async createProfile(data: ProfileInsert): Promise<DatabaseResponse<Profile>> {
    try {
      const { data: result, error } = await supabase
        .from('profiles')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return createSuccessResponse(result);
    } catch (error) {
      handleDatabaseError(error as Error, 'creating profile');
      return createErrorResponse(error as Error);
    }
  }
}

// Export singleton instance
export const profilesRepository = new ProfilesRepository(); 