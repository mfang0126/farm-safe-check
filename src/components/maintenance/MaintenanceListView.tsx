
import { CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaintenanceTask } from '@/types/maintenance';
import { MaintenanceTaskItem } from './MaintenanceTask';
import { useState } from 'react';

interface MaintenanceListViewProps {
  tasks: MaintenanceTask[];
  onCompleteTask: (taskId: string) => void;
  onStartTask: (taskId: string) => void;
}

export const MaintenanceListView: React.FC<MaintenanceListViewProps> = ({
  tasks,
  onCompleteTask,
  onStartTask
}) => {
  const [selectedTab, setSelectedTab] = useState('upcoming');

  // Filter tasks based on selected tab
  const getTabTasks = () => {
    switch (selectedTab) {
      case 'upcoming':
        return tasks.filter(task => task.status === 'upcoming');
      case 'overdue':
        return tasks.filter(task => task.status === 'overdue');
      case 'in-progress':
        return tasks.filter(task => task.status === 'in-progress');
      case 'completed':
        return tasks.filter(task => task.status === 'completed');
      default:
        return tasks;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Maintenance Tasks</CardTitle>
        <CardDescription>
          View and manage all equipment maintenance tasks
        </CardDescription>
        <Tabs 
          defaultValue="upcoming" 
          className="mt-4"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="grid w-full grid-cols-4 sm:w-auto">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {getTabTasks().length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No tasks found</h3>
              <p>There are no {selectedTab} maintenance tasks at the moment.</p>
            </div>
          ) : (
            getTabTasks().map((task) => (
              <MaintenanceTaskItem 
                key={task.id}
                task={task}
                onCompleteTask={onCompleteTask}
                onStartTask={onStartTask}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
