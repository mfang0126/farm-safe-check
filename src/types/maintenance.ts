
export type MaintenanceType = 'scheduled' | 'unscheduled' | 'inspection' | 'repair';
export type MaintenanceStatus = 'upcoming' | 'overdue' | 'completed' | 'in-progress';

// Legacy interface - now matches database schema for compatibility
export interface MaintenanceTask {
  id: string;
  user_id: string;
  title: string;
  equipment: string;
  equipment_id: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  due_date: string;
  completed_date?: string | null; 
  assigned_to: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}
