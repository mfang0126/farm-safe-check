import { tasksRepository } from '../repositories/tasks';
import type { 
  Task, 
  TaskInsert, 
  TaskUpdate, 
  TaskFilter,
  QueryOptions
} from '../types';

/**
 * Tasks service providing high-level task operations
 */
export class TasksService {
  
  /**
   * Get all tasks for a user with optional filtering and pagination
   */
  async getUserTasks(userId: string, filter?: TaskFilter, options?: QueryOptions) {
    return await tasksRepository.getAllTasks(userId, filter, options);
  }

  /**
   * Get task by ID
   */
  async getTaskById(id: string, userId: string) {
    return await tasksRepository.getTaskById(id, userId);
  }

  /**
   * Create new task
   */
  async createTask(userId: string, data: Omit<TaskInsert, 'user_id'>) {
    const taskData: TaskInsert = {
      ...data,
      user_id: userId
    };

    return await tasksRepository.createTask(taskData);
  }

  /**
   * Update task
   */
  async updateTask(id: string, userId: string, data: TaskUpdate) {
    return await tasksRepository.updateTask(id, userId, data);
  }

  /**
   * Delete task
   */
  async deleteTask(id: string, userId: string) {
    return await tasksRepository.deleteTask(id, userId);
  }
}

// Export singleton instance
export const tasksService = new TasksService(); 