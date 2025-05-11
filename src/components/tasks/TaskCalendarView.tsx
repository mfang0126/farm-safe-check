
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { Task } from '@/types/tasks';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import TaskCard from './TaskCard';

interface TaskCalendarViewProps {
  tasks: Task[];
  filters: any;
  onTaskUpdate: (taskId: string, updates: any) => void;
}

const TaskCalendarView = ({ tasks, filters, onTaskUpdate }: TaskCalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Apply filters except status (we want to see all statuses in the calendar)
  const filteredTasks = tasks.filter(task => {
    // Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }
    
    // Category filter
    if (filters.category !== 'all' && task.category !== filters.category) {
      return false;
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
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const getPriorityIndicator = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getCategoryIndicator = (category: string) => {
    switch(category) {
      case 'safety': return 'bg-blue-500';
      case 'maintenance': return 'bg-emerald-500';
      case 'inventory': return 'bg-purple-500';
      case 'training': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  // Helper to get week rows for the calendar
  const getWeekRows = () => {
    const rows = [];
    let currentWeek = [];
    
    // Add empty cells for days before the month start
    const firstDayOfMonth = monthStart.getDay();
    for (let i = 0; i < firstDayOfMonth; i++) {
      currentWeek.push(null);
    }
    
    // Add days of the month
    days.forEach(day => {
      if (currentWeek.length === 7) {
        rows.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    
    // Add empty cells for days after the month end
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    rows.push(currentWeek);
    
    return rows;
  };

  const weekRows = getWeekRows();

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get tasks for a specific day
  const getTasksForDay = (day: Date | null) => {
    if (!day) return [];
    
    return filteredTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, day);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 bg-muted">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 divide-x divide-y">
          {weekRows.map((week, weekIndex) => (
            week.map((day, dayIndex) => {
              const tasksForDay = getTasksForDay(day);
              const isCurrentMonth = day ? isSameMonth(day, currentDate) : false;
              const isCurrentDay = day ? isToday(day) : false;
              
              return (
                <div 
                  key={`${weekIndex}-${dayIndex}`} 
                  className={`h-32 p-1 ${
                    !day || !isCurrentMonth ? 'bg-muted/20' : ''
                  } ${
                    isCurrentDay ? 'bg-accent' : ''
                  } overflow-hidden`}
                >
                  {day && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${
                          !isCurrentMonth ? 'text-muted-foreground' : ''
                        } ${
                          isCurrentDay ? 'font-bold' : ''
                        }`}>
                          {format(day, 'd')}
                        </span>
                        {tasksForDay.length > 0 && (
                          <span className="text-xs text-muted-foreground bg-accent rounded-full px-1.5">
                            {tasksForDay.length}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 mt-1 overflow-y-auto max-h-[85px]">
                        {tasksForDay.slice(0, 3).map(task => (
                          <div 
                            key={task.id}
                            className={`text-xs p-1 rounded truncate flex items-center gap-1 ${
                              task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityIndicator(task.priority)}`}></span>
                            <span className="truncate">{task.title}</span>
                          </div>
                        ))}
                        {tasksForDay.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{tasksForDay.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Priority:</span>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-xs">Critical</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span className="text-xs">High</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-xs">Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCalendarView;
