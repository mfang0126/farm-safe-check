import { maintenanceRepository } from '../repositories/maintenance';
import type { 
  MaintenanceTask, 
  MaintenanceTaskInsert, 
  MaintenanceTaskUpdate,
  MaintenanceTaskFilter,
  QueryOptions,
  DatabaseResponse,
  DatabaseListResponse
} from '../types';
import { validateRequiredFields } from '../utils';
import { toast } from 'sonner';

/**
 * Maintenance service providing high-level maintenance task operations
 */
export class MaintenanceService {
  
  /**
   * Get all maintenance tasks for a user with optional filtering and pagination
   */
  async getUserMaintenanceTasks(
    userId: string, 
    filter?: MaintenanceTaskFilter, 
    options?: QueryOptions
  ): Promise<DatabaseListResponse<MaintenanceTask>> {
    return await maintenanceRepository.getAllMaintenanceTasks(userId, filter, options);
  }

  /**
   * Get maintenance task by ID
   */
  async getMaintenanceTaskById(id: string, userId: string): Promise<DatabaseResponse<MaintenanceTask>> {
    return await maintenanceRepository.getMaintenanceTaskById(id, userId);
  }

  /**
   * Create new maintenance task
   */
  async createMaintenanceTask(
    userId: string, 
    data: Omit<MaintenanceTaskInsert, 'user_id'>
  ): Promise<DatabaseResponse<MaintenanceTask>> {
    // Validate required fields
    const validation = validateRequiredFields(data, [
      'title', 
      'equipment', 
      'equipment_id', 
      'type', 
      'due_date', 
      'assigned_to'
    ]);

    if (!validation.isValid) {
      const error = new Error(`Missing required fields: ${validation.missingFields.join(', ')}`);
      toast.error(error.message);
      return { data: null, error };
    }

    // Validate due date is not in the past (unless it's a repair)
    const dueDate = new Date(data.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    if (data.type !== 'repair' && dueDate < today) {
      const error = new Error('Due date cannot be in the past');
      toast.error(error.message);
      return { data: null, error };
    }

    // Validate priority
    if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
      const error = new Error('Priority must be low, medium, or high');
      toast.error(error.message);
      return { data: null, error };
    }

    // Validate type
    if (!['scheduled', 'unscheduled', 'inspection', 'repair'].includes(data.type)) {
      const error = new Error('Invalid maintenance type');
      toast.error(error.message);
      return { data: null, error };
    }

    const taskData: MaintenanceTaskInsert = {
      ...data,
      user_id: userId,
      priority: data.priority || 'medium',
      status: 'upcoming'
    };

    const result = await maintenanceRepository.createMaintenanceTask(taskData);
    
    if (result.data) {
      toast.success(`Maintenance task "${data.title}" has been created successfully`);
    } else if (result.error) {
      toast.error('Failed to create maintenance task');
    }

    return result;
  }

  /**
   * Update maintenance task
   */
  async updateMaintenanceTask(
    id: string, 
    userId: string, 
    data: MaintenanceTaskUpdate
  ): Promise<DatabaseResponse<MaintenanceTask>> {
    // Validate due date if provided
    if (data.due_date) {
      const dueDate = new Date(data.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (data.type !== 'repair' && dueDate < today) {
        const error = new Error('Due date cannot be in the past');
        toast.error(error.message);
        return { data: null, error };
      }
    }

    // Validate priority if provided
    if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
      const error = new Error('Priority must be low, medium, or high');
      toast.error(error.message);
      return { data: null, error };
    }

    // Validate type if provided
    if (data.type && !['scheduled', 'unscheduled', 'inspection', 'repair'].includes(data.type)) {
      const error = new Error('Invalid maintenance type');
      toast.error(error.message);
      return { data: null, error };
    }

    // Validate status if provided
    if (data.status && !['upcoming', 'overdue', 'completed', 'in-progress'].includes(data.status)) {
      const error = new Error('Invalid status');
      toast.error(error.message);
      return { data: null, error };
    }

    const result = await maintenanceRepository.updateMaintenanceTask(id, userId, data);
    
    if (result.data) {
      toast.success('Maintenance task updated successfully');
    } else if (result.error) {
      toast.error('Failed to update maintenance task');
    }

    return result;
  }

  /**
   * Delete maintenance task
   */
  async deleteMaintenanceTask(id: string, userId: string): Promise<DatabaseResponse<boolean>> {
    const result = await maintenanceRepository.deleteMaintenanceTask(id, userId);
    
    if (result.data) {
      toast.success('Maintenance task deleted successfully');
    } else if (result.error) {
      toast.error('Failed to delete maintenance task');
    }

    return result;
  }

  /**
   * Complete maintenance task
   */
  async completeMaintenanceTask(id: string, userId: string): Promise<DatabaseResponse<MaintenanceTask>> {
    const result = await maintenanceRepository.completeMaintenanceTask(id, userId);
    
    if (result.data) {
      toast.success('Maintenance task marked as completed');
    } else if (result.error) {
      toast.error('Failed to complete maintenance task');
    }

    return result;
  }

  /**
   * Start maintenance task
   */
  async startMaintenanceTask(id: string, userId: string): Promise<DatabaseResponse<MaintenanceTask>> {
    const result = await maintenanceRepository.startMaintenanceTask(id, userId);
    
    if (result.data) {
      toast.success('Maintenance task started');
    } else if (result.error) {
      toast.error('Failed to start maintenance task');
    }

    return result;
  }

  /**
   * Get maintenance tasks due soon
   */
  async getMaintenanceTasksDueSoon(userId: string, days: number = 7): Promise<DatabaseListResponse<MaintenanceTask>> {
    return await maintenanceRepository.getMaintenanceTasksDueSoon(userId, days);
  }

  /**
   * Get overdue maintenance tasks
   */
  async getOverdueMaintenanceTasks(userId: string): Promise<DatabaseListResponse<MaintenanceTask>> {
    return await maintenanceRepository.getOverdueMaintenanceTasks(userId);
  }

  /**
   * Get maintenance statistics for dashboard
   */
  async getMaintenanceStats(userId: string): Promise<{
    total: number;
    upcoming: number;
    overdue: number;
    inProgress: number;
    completed: number;
    dueSoon: number;
  }> {
    try {
      // Get all tasks for stats
      const allTasksResult = await this.getUserMaintenanceTasks(userId);
      const tasks = allTasksResult.data || [];

      // Get tasks due soon
      const dueSoonResult = await this.getMaintenanceTasksDueSoon(userId, 7);
      const dueSoonTasks = dueSoonResult.data || [];

      return {
        total: tasks.length,
        upcoming: tasks.filter(t => t.status === 'upcoming').length,
        overdue: tasks.filter(t => t.status === 'overdue').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        dueSoon: dueSoonTasks.length
      };
    } catch (error) {
      console.error('Error getting maintenance stats:', error);
      return {
        total: 0,
        upcoming: 0,
        overdue: 0,
        inProgress: 0,
        completed: 0,
        dueSoon: 0
      };
    }
  }

  /**
   * Update overdue tasks status
   * This method checks all upcoming tasks and marks those past due date as overdue
   */
  async updateOverdueTasks(userId: string): Promise<void> {
    try {
      const upcomingTasksResult = await this.getUserMaintenanceTasks(userId, { status: 'upcoming' });
      const upcomingTasks = upcomingTasksResult.data || [];
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const task of upcomingTasks) {
        const dueDate = new Date(task.due_date);
        if (dueDate < today) {
          await this.updateMaintenanceTask(task.id, userId, { status: 'overdue' });
        }
      }
    } catch (error) {
      console.error('Error updating overdue tasks:', error);
    }
  }
}

// Export singleton instance
export const maintenanceService = new MaintenanceService(); 