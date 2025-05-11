
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskCategory = 'safety' | 'maintenance' | 'inventory' | 'training' | 'construction' | 'other';

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  description: string;
  category: 'work' | 'break' | 'meeting';
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  
  // Assignment
  assignedTo: string[];
  createdBy: string;
  supervisor?: string;
  
  // Scheduling
  dueDate: Date;
  startDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  
  // Status
  status: TaskStatus;
  priority: TaskPriority;
  completion: number; // 0-100
  
  // Classification
  category: TaskCategory;
  tags: string[];
  isRecurring: boolean;
  parentTask?: string;
  subtasks: SubTask[];
  
  // Relationships
  relatedEquipment?: string[];
  relatedIncidents?: string[];
  relatedChecklists?: string[];
  
  // Attachments & Comments
  attachments: TaskAttachment[];
  comments: Comment[];
  timeEntries: TimeEntry[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface RecurringPattern {
  taskId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[];
  monthlyOn?: 'date' | 'day';
  endDate?: Date;
  maxOccurrences?: number;
  nextOccurrence: Date;
}
