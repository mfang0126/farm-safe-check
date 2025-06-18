import type { TablesRow, TablesInsert, TablesUpdate } from './client';

// Application-specific types based on database schema
export type Profile = TablesRow<'profiles'>;
export type ProfileInsert = TablesInsert<'profiles'>;
export type ProfileUpdate = TablesUpdate<'profiles'>;

// Equipment types from database schema
export type Equipment = TablesRow<'equipment'>;
export type EquipmentInsert = TablesInsert<'equipment'>;
export type EquipmentUpdate = TablesUpdate<'equipment'>;

// Maintenance types from database schema
export type MaintenanceTask = TablesRow<'maintenance_tasks'>;
export type MaintenanceTaskInsert = TablesInsert<'maintenance_tasks'>;
export type MaintenanceTaskUpdate = TablesUpdate<'maintenance_tasks'>;

// Task types (to be added to database schema)  
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  assigned_to?: string;
  due_date?: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export type TaskInsert = Omit<Task, 'id' | 'created_at' | 'updated_at'>;
export type TaskUpdate = Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

// Checklist types
export interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
}

export interface ChecklistSection {
  name: string;
  items: ChecklistItem[];
}

export interface ChecklistTemplate {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  item_count: number;
  sections: ChecklistSection[];
  created_at: string;
  updated_at: string;
}

export interface CompletedChecklist {
  id: string;
  user_id: string;
  template_id: string;
  equipment_id?: string;
  equipment_name: string;
  template_name: string;
  completed_by: string;
  status: 'Passed' | 'Needs Maintenance' | 'Failed';
  responses: ChecklistSection[];
  notes?: string;
  issues_count: number;
  completed_at: string;
}

export type ChecklistTemplateInsert = Omit<ChecklistTemplate, 'id' | 'created_at' | 'updated_at'>;
export type ChecklistTemplateUpdate = Partial<Omit<ChecklistTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export type CompletedChecklistInsert = Omit<CompletedChecklist, 'id' | 'completed_at'>;
export type CompletedChecklistUpdate = Partial<Omit<CompletedChecklist, 'id' | 'user_id' | 'completed_at'>>;

// Common database response types
export interface DatabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface DatabaseListResponse<T> {
  data: T[] | null;
  error: Error | null;
  count?: number;
}

// Query options
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
}

// Filter types
export interface BaseFilter {
  [key: string]: string | number | boolean | null | undefined;
}

export interface EquipmentFilter extends BaseFilter {
  type?: string;
  status?: Equipment['status'] | 'all';
  operator?: string;
  search?: string;
}

export interface TaskFilter extends BaseFilter {
  status?: Task['status'];
  priority?: Task['priority'];
  category?: string;
  assigned_to?: string;
}

export interface ChecklistTemplateFilter extends BaseFilter {
  category?: string;
}

export interface CompletedChecklistFilter extends BaseFilter {
  status?: CompletedChecklist['status'];
  template_id?: string;
  equipment_id?: string;
  completed_by?: string;
}

export interface MaintenanceTaskFilter extends BaseFilter {
  status?: MaintenanceTask['status'] | 'all';
  type?: MaintenanceTask['type'];
  priority?: MaintenanceTask['priority'];
  equipment_id?: string;
  assigned_to?: string;
} 