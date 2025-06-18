import { supabase } from '../client';
import type { 
  MaintenanceTask, 
  MaintenanceTaskInsert, 
  MaintenanceTaskUpdate,
  MaintenanceTaskFilter,
  DatabaseResponse,
  DatabaseListResponse,
  QueryOptions
} from '../types';

/**
 * Repository for maintenance task operations
 */
export class MaintenanceRepository {
  
  /**
   * Get all maintenance tasks for a user with optional filtering and pagination
   */
  async getAllMaintenanceTasks(
    userId: string, 
    filter?: MaintenanceTaskFilter,
    options?: QueryOptions
  ): Promise<DatabaseListResponse<MaintenanceTask>> {
    try {
      let query = supabase
        .from('maintenance_tasks')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

      // Apply filters
      if (filter?.status && filter.status !== 'all') {
        query = query.eq('status', filter.status);
      }
      if (filter?.type) {
        query = query.eq('type', filter.type);
      }
      if (filter?.priority) {
        query = query.eq('priority', filter.priority);
      }
      if (filter?.equipment_id) {
        query = query.eq('equipment_id', filter.equipment_id);
      }
      if (filter?.assigned_to) {
        query = query.eq('assigned_to', filter.assigned_to);
      }

      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      // Apply custom ordering
      if (options?.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending !== false });
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching maintenance tasks:', error);
        return { data: [], error, count: 0 };
      }

      return { data: data || [], error: null, count: count || 0 };
    } catch (error) {
      console.error('Error in getAllMaintenanceTasks:', error);
      return { data: [], error: error as Error, count: 0 };
    }
  }

  /**
   * Get maintenance task by ID
   */
  async getMaintenanceTaskById(id: string, userId: string): Promise<DatabaseResponse<MaintenanceTask>> {
    try {
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching maintenance task:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in getMaintenanceTaskById:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create new maintenance task
   */
  async createMaintenanceTask(data: MaintenanceTaskInsert): Promise<DatabaseResponse<MaintenanceTask>> {
    try {
      const { data: task, error } = await supabase
        .from('maintenance_tasks')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Error creating maintenance task:', error);
        return { data: null, error };
      }

      return { data: task, error: null };
    } catch (error) {
      console.error('Error in createMaintenanceTask:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update maintenance task
   */
  async updateMaintenanceTask(
    id: string, 
    userId: string, 
    data: MaintenanceTaskUpdate
  ): Promise<DatabaseResponse<MaintenanceTask>> {
    try {
      const { data: task, error } = await supabase
        .from('maintenance_tasks')
        .update(data)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating maintenance task:', error);
        return { data: null, error };
      }

      return { data: task, error: null };
    } catch (error) {
      console.error('Error in updateMaintenanceTask:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Delete maintenance task
   */
  async deleteMaintenanceTask(id: string, userId: string): Promise<DatabaseResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('maintenance_tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting maintenance task:', error);
        return { data: false, error };
      }

      return { data: true, error: null };
    } catch (error) {
      console.error('Error in deleteMaintenanceTask:', error);
      return { data: false, error: error as Error };
    }
  }

  /**
   * Get maintenance tasks due within specified days
   */
  async getMaintenanceTasksDueSoon(userId: string, days: number = 7): Promise<DatabaseListResponse<MaintenanceTask>> {
    try {
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['upcoming', 'overdue'])
        .lte('due_date', new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Error fetching maintenance tasks due soon:', error);
        return { data: [], error, count: 0 };
      }

      return { data: data || [], error: null, count: data?.length || 0 };
    } catch (error) {
      console.error('Error in getMaintenanceTasksDueSoon:', error);
      return { data: [], error: error as Error, count: 0 };
    }
  }

  /**
   * Get overdue maintenance tasks
   */
  async getOverdueMaintenanceTasks(userId: string): Promise<DatabaseListResponse<MaintenanceTask>> {
    try {
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'overdue')
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Error fetching overdue maintenance tasks:', error);
        return { data: [], error, count: 0 };
      }

      return { data: data || [], error: null, count: data?.length || 0 };
    } catch (error) {
      console.error('Error in getOverdueMaintenanceTasks:', error);
      return { data: [], error: error as Error, count: 0 };
    }
  }

  /**
   * Complete maintenance task
   */
  async completeMaintenanceTask(id: string, userId: string): Promise<DatabaseResponse<MaintenanceTask>> {
    try {
      const { data: task, error } = await supabase
        .from('maintenance_tasks')
        .update({ 
          status: 'completed',
          completed_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error completing maintenance task:', error);
        return { data: null, error };
      }

      return { data: task, error: null };
    } catch (error) {
      console.error('Error in completeMaintenanceTask:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Start maintenance task (set status to in-progress)
   */
  async startMaintenanceTask(id: string, userId: string): Promise<DatabaseResponse<MaintenanceTask>> {
    try {
      const { data: task, error } = await supabase
        .from('maintenance_tasks')
        .update({ status: 'in-progress' })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error starting maintenance task:', error);
        return { data: null, error };
      }

      return { data: task, error: null };
    } catch (error) {
      console.error('Error in startMaintenanceTask:', error);
      return { data: null, error: error as Error };
    }
  }
}

// Export singleton instance
export const maintenanceRepository = new MaintenanceRepository(); 