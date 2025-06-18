import { supabase } from '../client';
import type { 
  Equipment, 
  EquipmentInsert, 
  EquipmentUpdate,
  EquipmentFilter,
  DatabaseResponse,
  DatabaseListResponse,
  QueryOptions
} from '../types';

/**
 * Repository for equipment operations
 */
export class EquipmentRepository {
  
  /**
   * Get all equipment for a user with optional filtering and pagination
   */
  async getAllEquipment(
    userId: string, 
    filter?: EquipmentFilter,
    options?: QueryOptions
  ): Promise<DatabaseListResponse<Equipment>> {
    try {
      let query = supabase
        .from('equipment')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filter?.status && filter.status !== 'all') {
        query = query.eq('status', filter.status);
      }
      if (filter?.type) {
        query = query.eq('type', filter.type);
      }
      if (filter?.search) {
        query = query.or(`make_model.ilike.%${filter.search}%,operator.ilike.%${filter.search}%,type.ilike.%${filter.search}%`);
      }

      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching equipment:', error);
        return { data: [], error, count: 0 };
      }

      return { data: data || [], error: null, count: count || 0 };
    } catch (error) {
      console.error('Error in getAllEquipment:', error);
      return { data: [], error: error as Error, count: 0 };
    }
  }

  /**
   * Get equipment by ID
   */
  async getEquipmentById(id: string, userId: string): Promise<DatabaseResponse<Equipment>> {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching equipment by ID:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in getEquipmentById:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create new equipment
   */
  async createEquipment(data: EquipmentInsert): Promise<DatabaseResponse<Equipment>> {
    try {
      const { data: equipment, error } = await supabase
        .from('equipment')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Error creating equipment:', error);
        return { data: null, error };
      }

      return { data: equipment, error: null };
    } catch (error) {
      console.error('Error in createEquipment:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update equipment
   */
  async updateEquipment(id: string, userId: string, data: EquipmentUpdate): Promise<DatabaseResponse<Equipment>> {
    try {
      const { data: equipment, error } = await supabase
        .from('equipment')
        .update(data)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating equipment:', error);
        return { data: null, error };
      }

      return { data: equipment, error: null };
    } catch (error) {
      console.error('Error in updateEquipment:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Delete equipment
   */
  async deleteEquipment(id: string, userId: string): Promise<DatabaseResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting equipment:', error);
        return { data: false, error };
      }

      return { data: true, error: null };
    } catch (error) {
      console.error('Error in deleteEquipment:', error);
      return { data: false, error: error as Error };
    }
  }

  /**
   * Get equipment by status
   */
  async getEquipmentByStatus(
    userId: string, 
    status: Equipment['status']
  ): Promise<DatabaseListResponse<Equipment>> {
    try {
      const { data, error, count } = await supabase
        .from('equipment')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching equipment by status:', error);
        return { data: [], error, count: 0 };
      }

      return { data: data || [], error: null, count: count || 0 };
    } catch (error) {
      console.error('Error in getEquipmentByStatus:', error);
      return { data: [], error: error as Error, count: 0 };
    }
  }

  /**
   * Get equipment due for inspection within specified days
   */
  async getEquipmentDueForInspection(userId: string, days: number = 30): Promise<DatabaseListResponse<Equipment>> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + days);
      const cutoffDateString = cutoffDate.toISOString().split('T')[0];

      const { data, error, count } = await supabase
        .from('equipment')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .lte('next_inspection', cutoffDateString)
        .order('next_inspection', { ascending: true });

      if (error) {
        console.error('Error fetching equipment due for inspection:', error);
        return { data: [], error, count: 0 };
      }

      return { data: data || [], error: null, count: count || 0 };
    } catch (error) {
      console.error('Error in getEquipmentDueForInspection:', error);
      return { data: [], error: error as Error, count: 0 };
    }
  }
}

// Export singleton instance
export const equipmentRepository = new EquipmentRepository(); 