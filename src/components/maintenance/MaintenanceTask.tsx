
import { Button } from '@/components/ui/button';
import { format, parseISO, isSameDay } from 'date-fns';
import { AlertTriangle, CheckCircle, Clock, CalendarClock } from 'lucide-react';
import { MaintenanceStatus, MaintenanceTask } from '@/types/maintenance';

interface MaintenanceTaskProps {
  task: MaintenanceTask;
  onCompleteTask: (taskId: string) => void;
  onStartTask: (taskId: string) => void;
}

export const getStatusClass = (status: MaintenanceStatus) => {
  switch (status) {
    case 'upcoming': return 'bg-amber-100 text-amber-700';
    case 'overdue': return 'bg-red-100 text-red-700';
    case 'completed': return 'bg-green-100 text-green-700';
    case 'in-progress': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const getStatusIcon = (status: MaintenanceStatus) => {
  switch (status) {
    case 'upcoming': return <CalendarClock className="h-4 w-4" />;
    case 'overdue': return <AlertTriangle className="h-4 w-4" />;
    case 'completed': return <CheckCircle className="h-4 w-4" />;
    case 'in-progress': return <Clock className="h-4 w-4" />;
    default: return null;
  }
};

export const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-700';
    case 'medium': return 'bg-amber-100 text-amber-700';
    case 'low': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const MaintenanceTaskItem: React.FC<MaintenanceTaskProps> = ({ 
  task, 
  onCompleteTask, 
  onStartTask 
}) => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusClass(task.status)}`}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(task.status)}
                  <span className="capitalize">{task.status}</span>
                </div>
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-1">{task.equipment} ({task.equipmentId})</div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(task.priority)}`}>
            {task.priority} Priority
          </span>
        </div>
        
        <div className="mt-3">
          <p className="text-sm text-gray-600">{task.description}</p>
          <div className="mt-3 text-xs text-gray-500">
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <span className="font-medium">Due:</span> {format(parseISO(task.dueDate), 'PPP')}
              </div>
              <div className="flex gap-2">
                <span className="font-medium">Assigned to:</span> {task.assignedTo}
              </div>
              {task.completedDate && (
                <div className="flex gap-2">
                  <span className="font-medium">Completed:</span> {format(parseISO(task.completedDate), 'PPP')}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {(task.status === 'upcoming' || task.status === 'overdue') && (
          <div className="mt-4 flex gap-2 justify-end">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onStartTask(task.id)}
            >
              Start Task
            </Button>
            <Button 
              size="sm" 
              onClick={() => onCompleteTask(task.id)}
            >
              Complete
            </Button>
          </div>
        )}
        
        {task.status === 'in-progress' && (
          <div className="mt-4 flex justify-end">
            <Button 
              size="sm"
              onClick={() => onCompleteTask(task.id)}
            >
              Mark Complete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
