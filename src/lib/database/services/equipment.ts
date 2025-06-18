import { equipmentRepository } from '../repositories/equipment';
import type { 
  Equipment, 
  EquipmentInsert, 
  EquipmentUpdate, 
  EquipmentFilter,
  QueryOptions
} from '../types';
import { validateRequiredFields } from '../utils';
import { toast } from 'sonner';

/**
 * Equipment service providing high-level equipment operations
 */
export class EquipmentService {
  
  /**
   * Get all equipment for a user with optional filtering and pagination
   */
  async getUserEquipment(userId: string, filter?: EquipmentFilter, options?: QueryOptions) {
    return await equipmentRepository.getAllEquipment(userId, filter, options);
  }

  /**
   * Get equipment by ID
   */
  async getEquipmentById(id: string, userId: string) {
    return await equipmentRepository.getEquipmentById(id, userId);
  }

  /**
   * Create new equipment with validation
   */
  async createEquipment(userId: string, data: Omit<EquipmentInsert, 'user_id'>) {
    // Validate required fields
    const validation = validateRequiredFields(data, ['type', 'make_model', 'operator']);
    if (!validation.isValid) {
      toast.error(`Missing required fields: ${validation.missingFields.join(', ')}`);
      return { data: null, error: new Error('Validation failed') };
    }

    const equipmentData: EquipmentInsert = {
      ...data,
      user_id: userId
    };

    const result = await equipmentRepository.createEquipment(equipmentData);
    if (result.data) {
      toast.success('Equipment added successfully');
    }
    return result;
  }

  /**
   * Update equipment with validation
   */
  async updateEquipment(id: string, userId: string, data: EquipmentUpdate) {
    const result = await equipmentRepository.updateEquipment(id, userId, data);
    if (result.data) {
      toast.success('Equipment updated successfully');
    }
    return result;
  }

  /**
   * Delete equipment
   */
  async deleteEquipment(id: string, userId: string) {
    const result = await equipmentRepository.deleteEquipment(id, userId);
    if (result.data) {
      toast.success('Equipment deleted successfully');
    }
    return result;
  }

  /**
   * Get equipment by status
   */
  async getEquipmentByStatus(userId: string, status: Equipment['status']) {
    return await equipmentRepository.getEquipmentByStatus(userId, status);
  }

  /**
   * Get equipment due for inspection
   */
  async getEquipmentDueForInspection(userId: string, days: number = 30) {
    return await equipmentRepository.getEquipmentDueForInspection(userId, days);
  }

  /**
   * Update equipment status
   */
  async updateEquipmentStatus(id: string, userId: string, status: Equipment['status']) {
    return await this.updateEquipment(id, userId, { status });
  }

  /**
   * Get equipment statistics for dashboard
   */
  async getEquipmentStats(userId: string) {
    try {
      const [allEquipment, passedEquipment, maintenanceEquipment, failedEquipment] = await Promise.all([
        this.getUserEquipment(userId),
        this.getEquipmentByStatus(userId, 'Passed'),
        this.getEquipmentByStatus(userId, 'Needs Maintenance'),
        this.getEquipmentByStatus(userId, 'Failed')
      ]);

      return {
        total: allEquipment.count || 0,
        passed: passedEquipment.count || 0,
        needsMaintenance: maintenanceEquipment.count || 0,
        failed: failedEquipment.count || 0
      };
    } catch (error) {
      console.error('Error fetching equipment stats:', error);
      return {
        total: 0,
        passed: 0,
        needsMaintenance: 0,
        failed: 0
      };
    }
  }
}

// Export singleton instance
export const equipmentService = new EquipmentService(); 