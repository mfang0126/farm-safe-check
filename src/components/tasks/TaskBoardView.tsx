
import { Task } from '@/types/tasks';
import TaskCard from './TaskCard';

interface TaskBoardViewProps {
  tasks: Task[];
  filters: any;
  onTaskUpdate: (taskId: string, updates: any) => void;
}

const TaskBoardView = ({ tasks, filters, onTaskUpdate }: TaskBoardViewProps) => {
  // Apply filters
  const filteredTasks = tasks.filter(task => {
    // Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }
    
    // Category filter
    if (filters.category !== 'all' && task.category !== filters.category) {
      return false;
    }
    
    // Date range filter
    if (filters.startDate && new Date(task.dueDate) < filters.startDate) {
      return false;
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      if (new Date(task.dueDate) > endDate) {
        return false;
      }
    }
    
    // View filter (mine, team, all)
    if (filters.view === 'mine' && !task.assignedTo.includes('user-001')) {
      return false;
    } else if (filters.view === 'team' && task.assignedTo.every(id => id !== 'user-001')) {
      // For demo, assuming current user's team includes user-001, user-002
      return false;
    }
    
    return true;
  });

  // Group by status
  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in_progress');
  const reviewTasks = filteredTasks.filter(task => task.status === 'review');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* To Do Column */}
      <div className="space-y-3">
        <div className="flex justify-between items-center pb-2 border-b">
          <h3 className="font-medium">To Do</h3>
          <span className="text-muted-foreground text-sm">{todoTasks.length}</span>
        </div>
        <div className="space-y-2">
          {todoTasks.map(task => (
            <TaskCard 
              key={task.id}
              task={task}
              view="board"
              onUpdate={onTaskUpdate}
            />
          ))}
          {todoTasks.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-md">
              <p className="text-sm text-muted-foreground">No tasks</p>
            </div>
          )}
        </div>
      </div>
      
      {/* In Progress Column */}
      <div className="space-y-3">
        <div className="flex justify-between items-center pb-2 border-b">
          <h3 className="font-medium">In Progress</h3>
          <span className="text-muted-foreground text-sm">{inProgressTasks.length}</span>
        </div>
        <div className="space-y-2">
          {inProgressTasks.map(task => (
            <TaskCard 
              key={task.id}
              task={task}
              view="board"
              onUpdate={onTaskUpdate}
            />
          ))}
          {inProgressTasks.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-md">
              <p className="text-sm text-muted-foreground">No tasks</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Review Column */}
      <div className="space-y-3">
        <div className="flex justify-between items-center pb-2 border-b">
          <h3 className="font-medium">Review</h3>
          <span className="text-muted-foreground text-sm">{reviewTasks.length}</span>
        </div>
        <div className="space-y-2">
          {reviewTasks.map(task => (
            <TaskCard 
              key={task.id}
              task={task}
              view="board"
              onUpdate={onTaskUpdate}
            />
          ))}
          {reviewTasks.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-md">
              <p className="text-sm text-muted-foreground">No tasks</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Completed Column */}
      <div className="space-y-3">
        <div className="flex justify-between items-center pb-2 border-b">
          <h3 className="font-medium">Completed</h3>
          <span className="text-muted-foreground text-sm">{completedTasks.length}</span>
        </div>
        <div className="space-y-2">
          {completedTasks.map(task => (
            <TaskCard 
              key={task.id}
              task={task}
              view="board"
              onUpdate={onTaskUpdate}
            />
          ))}
          {completedTasks.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-md">
              <p className="text-sm text-muted-foreground">No tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskBoardView;
