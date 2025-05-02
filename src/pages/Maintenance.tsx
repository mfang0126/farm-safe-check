
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, AlertTriangle, CheckCircle, Calendar as CalendarClockIcon, Filter, Clock } from 'lucide-react';
import { format, addDays, isSameDay, parseISO, isAfter, isBefore, addMonths } from 'date-fns';

// Types for maintenance tasks
type MaintenanceType = 'scheduled' | 'unscheduled' | 'inspection' | 'repair';
type MaintenanceStatus = 'upcoming' | 'overdue' | 'completed' | 'in-progress';

interface MaintenanceTask {
  id: string;
  title: string;
  equipment: string;
  equipmentId: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  dueDate: string;
  completedDate?: string; 
  assignedTo: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

const Maintenance = () => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
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

  const form = useForm({
    defaultValues: {
      title: '',
      equipment: '',
      type: 'scheduled' as MaintenanceType,
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      assignedTo: '',
      description: '',
      priority: 'medium' as 'low' | 'medium' | 'high'
    }
  });

  const handleAddTask = (data: any) => {
    const newTask: MaintenanceTask = {
      id: `${tasks.length + 1}`,
      title: data.title,
      equipment: data.equipment,
      equipmentId: `EQ-${Math.floor(Math.random() * 1000)}`,
      type: data.type as MaintenanceType,
      status: 'upcoming',
      dueDate: new Date(data.dueDate).toISOString(),
      assignedTo: data.assignedTo,
      description: data.description,
      priority: data.priority as 'low' | 'medium' | 'high'
    };
    
    setTasks([...tasks, newTask]);
    setIsAddTaskOpen(false);
    form.reset();
    
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

  // Filter tasks based on selected tab
  const getTabTasks = () => {
    switch (selectedTab) {
      case 'upcoming':
        return filteredTasks.filter(task => task.status === 'upcoming');
      case 'overdue':
        return filteredTasks.filter(task => task.status === 'overdue');
      case 'in-progress':
        return filteredTasks.filter(task => task.status === 'in-progress');
      case 'completed':
        return filteredTasks.filter(task => task.status === 'completed');
      default:
        return filteredTasks;
    }
  };

  // Tasks for the selected date in calendar view
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = parseISO(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  // Generate calendar day rendering
  const renderCalendarDay = (day: Date, modifiers: any) => {
    const tasksForDate = getTasksForDate(day);
    const hasOverdue = tasksForDate.some(task => task.status === 'overdue');
    const hasUpcoming = tasksForDate.some(task => task.status === 'upcoming');
    const hasInProgress = tasksForDate.some(task => task.status === 'in-progress');
    
    return (
      <div className="h-full w-full p-1">
        <div className="text-right">{format(day, 'd')}</div>
        {tasksForDate.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {hasOverdue && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
            {hasUpcoming && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
            {hasInProgress && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
            {tasksForDate.length > 0 && (
              <span className="text-xs text-gray-500">{tasksForDate.length}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  const getStatusClass = (status: MaintenanceStatus) => {
    switch (status) {
      case 'upcoming': return 'bg-amber-100 text-amber-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: MaintenanceStatus) => {
    switch (status) {
      case 'upcoming': return <CalendarClockIcon className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const daysWithTasks = () => {
    // Create a map of dates with tasks
    const datesMap = new Map();
    
    tasks.forEach(task => {
      const date = parseISO(task.dueDate);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!datesMap.has(dateKey)) {
        datesMap.set(dateKey, {
          date,
          tasks: []
        });
      }
      
      datesMap.get(dateKey).tasks.push(task);
    });
    
    return Array.from(datesMap.values());
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Maintenance Scheduler</h1>
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
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddTask)} className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter maintenance task title" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="equipment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Equipment</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select equipment" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="John Deere Tractor">John Deere Tractor</SelectItem>
                              <SelectItem value="Case IH Harvester">Case IH Harvester</SelectItem>
                              <SelectItem value="Kubota Tractor">Kubota Tractor</SelectItem>
                              <SelectItem value="New Holland Baler">New Holland Baler</SelectItem>
                              <SelectItem value="Sprayer">Sprayer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="unscheduled">Unscheduled</SelectItem>
                                <SelectItem value="inspection">Inspection</SelectItem>
                                <SelectItem value="repair">Repair</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Due Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="assignedTo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assigned To</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select person" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="John Farmer">John Farmer</SelectItem>
                                <SelectItem value="Mark Smith">Mark Smith</SelectItem>
                                <SelectItem value="Sarah Jones">Sarah Jones</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter task description" 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Task</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex flex-col">
          {viewType === 'list' ? (
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
                      <div key={task.id} className="bg-white border rounded-lg overflow-hidden">
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
                                onClick={() => handleStartTask(task.id)}
                              >
                                Start Task
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleCompleteTask(task.id)}
                              >
                                Complete
                              </Button>
                            </div>
                          )}
                          
                          {task.status === 'in-progress' && (
                            <div className="mt-4 flex justify-end">
                              <Button 
                                size="sm"
                                onClick={() => handleCompleteTask(task.id)}
                              >
                                Mark Complete
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            // Calendar View
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
                                  onClick={() => handleCompleteTask(task.id)}
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Maintenance;
