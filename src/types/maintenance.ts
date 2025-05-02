
export type MaintenanceType = 'scheduled' | 'unscheduled' | 'inspection' | 'repair';
export type MaintenanceStatus = 'upcoming' | 'overdue' | 'completed' | 'in-progress';

export interface MaintenanceTask {
  id: string;
  title: string;
  equipment: string;
  equipmentId: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  dueDate: string;
  completedDate?: string; 
  assignedTo: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}
