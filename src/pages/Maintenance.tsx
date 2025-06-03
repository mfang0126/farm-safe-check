import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { addDays } from 'date-fns';

// Types
import { MaintenanceStatus, MaintenanceTask } from '@/types/maintenance';

// Components
import { MaintenanceListView } from '@/components/maintenance/MaintenanceListView';
import { MaintenanceCalendarView } from '@/components/maintenance/MaintenanceCalendarView';
import { MaintenanceForm } from '@/components/maintenance/MaintenanceForm';

const Maintenance = () => {
  const { toast } = useToast();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [viewType, setViewType] = useState<'calendar' | 'list'>('list');
  const [filter, setFilter] = useState<MaintenanceStatus | 'all'>('all');
  
  // Mock data for maintenance tasks
  const [tasks, setTasks] = useState<MaintenanceTask[]>([
    {
      id: '1',
      title: 'Annual Inspection',
      equipment: 'John Deere Tractor',
      equipmentId: 'JDTR-001',
      type: 'inspection',
      status: 'upcoming',
      dueDate: addDays(new Date(), 5).toISOString(),
      assignedTo: 'John Farmer',
      description: 'Complete annual safety and operational inspection as required by manufacturer.',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Oil Change',
      equipment: 'Case IH Harvester',
      equipmentId: 'CIHV-002',
      type: 'scheduled',
      status: 'overdue',
      dueDate: addDays(new Date(), -2).toISOString(),
      assignedTo: 'Mark Smith',
      description: 'Change oil and replace oil filter.',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Replace Brake Pads',
      equipment: 'Kubota Tractor',
      equipmentId: 'KUBT-003',
      type: 'repair',
      status: 'in-progress',
      dueDate: addDays(new Date(), 1).toISOString(),
      assignedTo: 'Sarah Jones',
      description: 'Replace worn brake pads on front and rear wheels.',
      priority: 'high'
    },
    {
      id: '4',
      title: 'Lubricate Bearings',
      equipment: 'New Holland Baler',
      equipmentId: 'NHBL-004',
      type: 'scheduled',
      status: 'completed',
      dueDate: addDays(new Date(), -7).toISOString(),
      completedDate: addDays(new Date(), -6).toISOString(),
      assignedTo: 'John Farmer',
      description: 'Apply grease to all bearings according to maintenance manual.',
      priority: 'low'
    },
    {
      id: '5',
      title: 'Hydraulic Fluid Check',
      equipment: 'John Deere Tractor',
      equipmentId: 'JDTR-001',
      type: 'scheduled',
      status: 'upcoming',
      dueDate: addDays(new Date(), 3).toISOString(),
      assignedTo: 'Mark Smith',
      description: 'Check hydraulic fluid levels and top up if necessary.',
      priority: 'medium'
    },
    {
      id: '6',
      title: 'Battery Replacement',
      equipment: 'Sprayer',
      equipmentId: 'SPRY-005',
      type: 'unscheduled',
      status: 'completed',
      dueDate: addDays(new Date(), -10).toISOString(),
      completedDate: addDays(new Date(), -9).toISOString(),
      assignedTo: 'John Farmer',
      description: 'Replace battery that is no longer holding charge.',
      priority: 'high'
    }
  ]);

  const handleAddTask = (data: MaintenanceTask) => {
    const newTask: MaintenanceTask = {
      id: `${tasks.length + 1}`,
      title: data.title,
      equipment: data.equipment,
      equipmentId: `EQ-${Math.floor(Math.random() * 1000)}`,
      type: data.type,
      status: 'upcoming',
      dueDate: new Date(data.dueDate).toISOString(),
      assignedTo: data.assignedTo,
      description: data.description,
      priority: data.priority as 'low' | 'medium' | 'high'
    };
    
    setTasks([...tasks, newTask]);
    setIsAddTaskOpen(false);
    
    toast({
      title: "Task added",
      description: `${data.title} has been added to the maintenance schedule.`
    });
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed', completedDate: new Date().toISOString() } 
        : task
    ));
    
    toast({
      title: "Task completed",
      description: "The maintenance task has been marked as completed."
    });
  };

  const handleStartTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'in-progress' } 
        : task
    ));
    
    toast({
      title: "Task started",
      description: "The maintenance task has been marked as in progress."
    });
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
