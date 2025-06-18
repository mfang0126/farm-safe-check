import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { addDays } from 'date-fns';

// Types
import { MaintenanceStatus, MaintenanceType } from '@/types/maintenance';
import type { MaintenanceTask, MaintenanceTaskFilter } from '@/lib/database/types';

// Services
import { MaintenanceService } from '@/lib/database/services/maintenance';

// Auth
import { useAuth } from '@/contexts/AuthContext';

// Components
import { MaintenanceListView } from '@/components/maintenance/MaintenanceListView';
import { MaintenanceCalendarView } from '@/components/maintenance/MaintenanceCalendarView';
import { MaintenanceForm } from '@/components/maintenance/MaintenanceForm';

// Create service instance
const maintenanceService = new MaintenanceService();

// Form data interface
interface MaintenanceFormData {
  title: string;
  equipment: string;
  type: MaintenanceType;
  dueDate: string;
  assignedTo: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

const Maintenance = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [viewType, setViewType] = useState<'calendar' | 'list'>('list');
  const [filter, setFilter] = useState<MaintenanceStatus | 'all'>('all');
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Load maintenance tasks from database
  useEffect(() => {
    const loadTasks = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const result = await maintenanceService.getUserMaintenanceTasks(user.id);
        if (result.data) {
          setTasks(result.data);
        }
      } catch (error) {
        console.error('Error loading maintenance tasks:', error);
        toast({
          title: "Error",
          description: "Failed to load maintenance tasks",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [user?.id, toast]);

  const handleAddTask = async (data: MaintenanceFormData) => {
    if (!user?.id) return;
    
    try {
      const taskData = {
        title: data.title,
        equipment: data.equipment,
        equipment_id: `EQ-${Math.floor(Math.random() * 1000)}`,
        type: data.type,
        due_date: data.dueDate,
        assigned_to: data.assignedTo,
        description: data.description,
        priority: data.priority as 'low' | 'medium' | 'high'
      };

      const result = await maintenanceService.createMaintenanceTask(user.id, taskData);
      
      if (result.data) {
        // Refresh the tasks list
        const tasksResult = await maintenanceService.getUserMaintenanceTasks(user.id);
        if (tasksResult.data) {
          setTasks(tasksResult.data);
        }
        setIsAddTaskOpen(false);
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add maintenance task",
        variant: "destructive"
      });
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    if (!user?.id) return;
    
    try {
      const result = await maintenanceService.completeMaintenanceTask(taskId, user.id);
      if (result.data) {
        // Refresh the tasks list
        const tasksResult = await maintenanceService.getUserMaintenanceTasks(user.id);
        if (tasksResult.data) {
          setTasks(tasksResult.data);
        }
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleStartTask = async (taskId: string) => {
    if (!user?.id) return;
    
    try {
      const result = await maintenanceService.startMaintenanceTask(taskId, user.id);
      if (result.data) {
        // Refresh the tasks list
        const tasksResult = await maintenanceService.getUserMaintenanceTasks(user.id);
        if (tasksResult.data) {
          setTasks(tasksResult.data);
        }
      }
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Scheduler</h1>
          <p className="text-muted-foreground">Manage and track equipment maintenance schedules</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 bg-white rounded-lg shadow p-1">
            <Button 
              variant={viewType === 'list' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewType('list')}
              className="px-3"
            >
              List
            </Button>
            <Button 
              variant={viewType === 'calendar' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewType('calendar')}
              className="px-3"
            >
              Calendar
            </Button>
          </div>
          
          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogTrigger asChild>
              <Button>
                Add Maintenance Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Maintenance Task</DialogTitle>
                <DialogDescription>
                  Create a new maintenance task. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <MaintenanceForm 
                onSubmit={handleAddTask}
                onCancel={() => setIsAddTaskOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {viewType === 'list' ? (
        <MaintenanceListView 
          tasks={filteredTasks}
          onCompleteTask={handleCompleteTask}
          onStartTask={handleStartTask}
        />
      ) : (
        <MaintenanceCalendarView 
          tasks={filteredTasks}
          onCompleteTask={handleCompleteTask}
        />
      )}
    </div>
  );
};

export default Maintenance;
