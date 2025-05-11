
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, ListTodo, CalendarDays } from 'lucide-react';
import TaskBoardView from '@/components/tasks/TaskBoardView';
import TaskListView from '@/components/tasks/TaskListView';
import TaskCalendarView from '@/components/tasks/TaskCalendarView';
import TaskSummaryCards from '@/components/tasks/TaskSummaryCards';
import TaskFilters from '@/components/tasks/TaskFilters';
import { Button } from "@/components/ui/button";
import AddTaskModal from '@/components/tasks/AddTaskModal';
import { useToast } from "@/hooks/use-toast";
import { mockTasks } from '@/components/tasks/mock-data';

const TaskDashboard = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [tasks, setTasks] = useState(mockTasks);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [filters, setFilters] = useState({
    view: 'mine',
    status: 'all',
    priority: 'all',
    category: 'all',
    startDate: null,
    endDate: null,
  });
  const [sortBy, setSortBy] = useState('due_date');
  
  const { toast } = useToast();

  const handleFilterChange = (key: string, value: any) => {
    if (key === 'reset') {
      setFilters({
        view: 'mine',
        status: 'all',
        priority: 'all',
        category: 'all',
        startDate: null,
        endDate: null,
      });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleTaskAdd = (newTask: any) => {
    setTasks(prev => [newTask, ...prev]);
    setShowAddTaskModal(false);
    toast({
      title: "Task created",
      description: "Your task has been created successfully.",
    });
  };

  const handleTaskUpdate = (taskId: string, updates: any) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
    
    if (updates.status === 'completed') {
      toast({
        title: "Task completed",
        description: "The task has been marked as complete.",
      });
    } else {
      toast({
        title: "Task updated",
        description: "Your changes have been saved.",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <p className="text-muted-foreground">Organize, track, and manage farm safety tasks</p>
        </div>

        <Button onClick={() => setShowAddTaskModal(true)} className="flex items-center gap-2">
          <ListTodo size={16} /> New Task
        </Button>
      </div>

      <TaskSummaryCards tasks={tasks} />
      
      <TaskFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onSortChange={setSortBy} 
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <ListTodo size={16} />
            List
          </TabsTrigger>
          <TabsTrigger value="board" className="flex items-center gap-2">
            <LayoutDashboard size={16} />
            Board
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays size={16} />
            Calendar
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="list" className="mt-6">
          <TaskListView 
            tasks={tasks} 
            filters={filters}
            sortBy={sortBy}
            onTaskUpdate={handleTaskUpdate} 
          />
        </TabsContent>
        
        <TabsContent value="board" className="mt-6">
          <TaskBoardView 
            tasks={tasks} 
            filters={filters}
            onTaskUpdate={handleTaskUpdate} 
          />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-6">
          <TaskCalendarView 
            tasks={tasks} 
            filters={filters}
            onTaskUpdate={handleTaskUpdate} 
          />
        </TabsContent>
      </Tabs>

      {showAddTaskModal && (
        <AddTaskModal 
          onClose={() => setShowAddTaskModal(false)} 
          onTaskAdd={handleTaskAdd}
        />
      )}
    </div>
  );
};

export default TaskDashboard;
