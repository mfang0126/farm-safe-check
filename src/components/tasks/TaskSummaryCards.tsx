
import { Task } from '@/types/tasks';
import { Card, CardContent } from "@/components/ui/card";
import { Circle, CircleAlert, CalendarClock, CheckCircle } from 'lucide-react';

interface TaskSummaryCardsProps {
  tasks: Task[];
}

const TaskSummaryCards = ({ tasks }: TaskSummaryCardsProps) => {
  // Helper to check if a task is overdue
  const isOverdue = (task: Task) => {
    return new Date(task.dueDate) < new Date() && task.status !== 'completed';
  };

  // Helper to check if a task is due today
  const isDueToday = (task: Task) => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate.getDate() === today.getDate() && 
           dueDate.getMonth() === today.getMonth() &&
           dueDate.getFullYear() === today.getFullYear() &&
           task.status !== 'completed';
  };

  // Helper to check if a task is upcoming (due in the future but not today)
  const isUpcoming = (task: Task) => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate > today && !isDueToday(task) && task.status !== 'completed';
  };

  // Helper to check if a task was completed this week
  const isCompletedThisWeek = (task: Task) => {
    if (!task.completedAt || task.status !== 'completed') return false;
    
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    
    const completedDate = new Date(task.completedAt);
    return completedDate >= weekAgo && completedDate <= today;
  };

  // Calculate counters
  const overdueTasks = tasks.filter(isOverdue);
  const dueTodayTasks = tasks.filter(isDueToday);
  const upcomingTasks = tasks.filter(isUpcoming);
  const completedThisWeek = tasks.filter(isCompletedThisWeek);

  // Calculate priority counts for overdue tasks
  const overdueCritical = overdueTasks.filter(t => t.priority === 'critical').length;
  const overdueHigh = overdueTasks.filter(t => t.priority === 'high').length;
  const overdueMedium = overdueTasks.filter(t => t.priority === 'medium').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CircleAlert className="text-red-600" size={18} /> 
                Overdue: {overdueTasks.length}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Priority breakdown:</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 bg-red-600 rounded-full mr-2"></span>
                  Critical: {overdueCritical}
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                  High: {overdueHigh}
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  Medium: {overdueMedium}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CalendarClock className="text-blue-600" size={18} /> 
                Due Soon: {dueTodayTasks.length + upcomingTasks.length}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Timeline:</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                  Today: {dueTodayTasks.length}
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                  Tomorrow: {upcomingTasks.filter(t => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const dueDate = new Date(t.dueDate);
                    return dueDate.getDate() === tomorrow.getDate() &&
                           dueDate.getMonth() === tomorrow.getMonth() &&
                           dueDate.getFullYear() === tomorrow.getFullYear();
                  }).length}
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 bg-blue-300 rounded-full mr-2"></span>
                  This Week: {upcomingTasks.filter(t => {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    const dueDate = new Date(t.dueDate);
                    const today = new Date();
                    return dueDate > today && dueDate <= nextWeek;
                  }).length}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CheckCircle className="text-green-600" size={18} /> 
                Completed This Week
              </h3>
              <div className="mt-4">
                <span className="text-3xl font-bold">{completedThisWeek.length}</span>
                <span className="text-sm text-muted-foreground ml-2">tasks completed</span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ 
                    width: `${Math.min(100, (completedThisWeek.length / Math.max(1, tasks.length)) * 100)}%` 
                  }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((completedThisWeek.length / Math.max(1, tasks.length)) * 100)}% of all tasks
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskSummaryCards;
