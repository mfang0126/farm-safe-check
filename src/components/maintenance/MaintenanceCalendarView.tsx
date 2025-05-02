
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, isSameDay, parseISO } from 'date-fns';
import { MaintenanceTask } from '@/types/maintenance';
import { getStatusClass } from './MaintenanceTask';

interface MaintenanceCalendarViewProps {
  tasks: MaintenanceTask[];
  onCompleteTask: (taskId: string) => void;
}

export const MaintenanceCalendarView: React.FC<MaintenanceCalendarViewProps> = ({ 
  tasks, 
  onCompleteTask 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = parseISO(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Calendar</CardTitle>
        <CardDescription>
          View scheduled maintenance tasks by date
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border pointer-events-auto"
        />
        
        <div className="mt-8">
          <h3 className="font-medium text-lg mb-4">
            {selectedDate ? `Tasks for ${format(selectedDate, 'MMMM d, yyyy')}` : 'Select a date to view tasks'}
          </h3>
          {selectedDate && getTasksForDate(selectedDate).length === 0 ? (
            <div className="text-center py-6 text-gray-500 border rounded-lg">
              No maintenance tasks scheduled for this date
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDate &&
                getTasksForDate(selectedDate).map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{task.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusClass(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{task.equipment}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Assigned to: {task.assignedTo}</span>
                      {(task.status === 'upcoming' || task.status === 'overdue') && (
                        <Button 
                          size="sm" 
                          onClick={() => onCompleteTask(task.id)}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
