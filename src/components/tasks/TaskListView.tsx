
import { Task } from '@/types/tasks';
import TaskCard from './TaskCard';

interface TaskListViewProps {
  tasks: Task[];
  filters: any;
  sortBy: string;
  onTaskUpdate: (taskId: string, updates: any) => void;
}

const TaskListView = ({ tasks, filters, sortBy, onTaskUpdate }: TaskListViewProps) => {
  // Apply filters
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }
    
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

  // Apply sorting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'due_date':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority': {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      case 'created_date':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-1">
      {sortedTasks.length > 0 ? (
        sortedTasks.map(task => (
          <TaskCard 
            key={task.id}
            task={task}
            view="list"
            onUpdate={onTaskUpdate}
          />
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tasks match your filters</p>
        </div>
      )}
    </div>
  );
};

export default TaskListView;
