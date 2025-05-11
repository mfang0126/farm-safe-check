
import { useState } from 'react';
import { Task } from '@/types/tasks';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Clipboard, 
  MessageCircle,
  Paperclip,
  CalendarDays,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TaskDetailsModal from './TaskDetailsModal';

interface TaskCardProps {
  task: Task;
  view?: 'board' | 'list' | 'calendar';
  onUpdate: (taskId: string, updates: any) => void;
}

const TaskCard = ({ task, view = 'board', onUpdate }: TaskCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const getPriorityConfig = (priority: string) => {
    const configs: any = {
      critical: { color: 'bg-red-500', textColor: 'text-red-500', icon: <AlertCircle className="w-4 h-4" />, label: 'Critical' },
      high: { color: 'bg-orange-500', textColor: 'text-orange-500', icon: <AlertCircle className="w-4 h-4" />, label: 'High' },
      medium: { color: 'bg-yellow-500', textColor: 'text-yellow-500', icon: <AlertCircle className="w-4 h-4" />, label: 'Medium' },
      low: { color: 'bg-green-500', textColor: 'text-green-500', icon: <AlertCircle className="w-4 h-4" />, label: 'Low' }
    };
    return configs[priority] || configs.medium;
  };
  
  const getCategoryIcon = (category: string) => {
    const icons: any = {
      safety: '⚡',
      maintenance: '🔧',
      inventory: '📦',
      training: '📚',
      construction: '🏗️',
      other: '📋'
    };
    return icons[category] || icons.other;
  };
  
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const priorityConfig = getPriorityConfig(task.priority);
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'todo':
        return <Badge variant="outline" className="text-gray-500 border-gray-300">To Do</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-blue-500 border-blue-300">In Progress</Badge>;
      case 'review':
        return <Badge variant="outline" className="text-purple-500 border-purple-300">Review</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-500 border-green-300">Completed</Badge>;
      default:
        return null;
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getInitials = (name: string) => {
    return name ? name.split(' ').map(part => part[0]).join('').toUpperCase() : '??';
  };
  
  if (view === 'board') {
    return (
      <>
        <div 
          className={`bg-card border p-4 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-3 ${isOverdue ? 'border-red-300' : 'border-border'}`}
          onClick={() => setShowDetails(true)}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getCategoryIcon(task.category)}</span>
              <span className={`w-2 h-2 rounded-full ${priorityConfig.color}`}></span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(true);
                }}>
                  <Clipboard className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  // Edit task logic
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Delete task logic
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <h3 className="font-medium text-sm mb-2 line-clamp-2">{task.title}</h3>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              <span className={isOverdue ? 'text-destructive font-medium' : ''}>
                {isOverdue ? 'Overdue: ' : 'Due: '}
                {formatDate(task.dueDate)}
              </span>
            </div>
            {task.subtasks.length > 0 && (
              <div className="flex items-center gap-1">
                <Clipboard className="h-3 w-3" />
                <span>
                  {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                </span>
              </div>
            )}
          </div>
          
          {task.subtasks.length > 0 && (
            <Progress value={task.completion} className="h-1 mb-3" />
          )}
          
          <div className="flex justify-between items-center">
            <div className="flex -space-x-2">
              {task.assignedTo.map((userId, index) => (
                <Avatar key={index} className="h-6 w-6 border-2 border-background">
                  <AvatarFallback className="text-xs">
                    {getInitials(userId)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            
            <div className="flex gap-2 items-center text-muted-foreground">
              {task.attachments.length > 0 && (
                <span className="flex items-center text-xs gap-1">
                  <Paperclip className="h-3 w-3" />
                  {task.attachments.length}
                </span>
              )}
              {task.comments.length > 0 && (
                <span className="flex items-center text-xs gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {task.comments.length}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {showDetails && (
          <TaskDetailsModal 
            task={task}
            onClose={() => setShowDetails(false)}
            onUpdate={onUpdate}
          />
        )}
      </>
    );
  }
  
  if (view === 'list') {
    return (
      <>
        <div 
          className={`flex items-center gap-4 p-3 hover:bg-accent/50 rounded-md cursor-pointer ${
            isOverdue ? 'border-l-2 border-destructive' : ''
          }`}
          onClick={() => setShowDetails(true)}
        >
          <div className="flex-shrink-0">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(task.id, { 
                  status: task.status === 'completed' ? 'todo' : 'completed',
                  completedAt: task.status === 'completed' ? undefined : new Date()
                });
              }}
            >
              {task.status === 'completed' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <div className={`h-5 w-5 rounded-full border-2 ${
                  task.priority === 'critical' ? 'border-red-500' :
                  task.priority === 'high' ? 'border-orange-500' :
                  task.priority === 'medium' ? 'border-yellow-500' :
                  'border-green-500'
                }`} />
              )}
            </Button>
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex justify-between">
              <h3 className={`font-medium text-sm ${
                task.status === 'completed' ? 'line-through text-muted-foreground' : ''
              }`}>
                {task.title}
              </h3>
              <div className="flex items-center gap-2">
                {getStatusBadge(task.status)}
                <span className="text-xs flex gap-1 items-center">
                  {task.category && (
                    <span>{getCategoryIcon(task.category)}</span>
                  )}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between mt-1">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className={`flex items-center gap-1 ${
                  isOverdue ? 'text-destructive font-medium' : ''
                }`}>
                  <Clock className="h-3 w-3" />
                  {formatDate(task.dueDate)}
                </span>
                
                {task.subtasks.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Clipboard className="h-3 w-3" />
                    {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                  </span>
                )}
                
                {task.attachments.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    {task.attachments.length}
                  </span>
                )}
                
                {task.comments.length > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {task.comments.length}
                  </span>
                )}
              </div>
              
              <div className="flex -space-x-2">
                {task.assignedTo.map((userId, index) => (
                  <Avatar key={index} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      {getInitials(userId)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {showDetails && (
          <TaskDetailsModal 
            task={task}
            onClose={() => setShowDetails(false)}
            onUpdate={onUpdate}
          />
        )}
      </>
    );
  }

  // Calendar item will be more compact
  return (
    <>
      <div 
        className={`p-2 rounded cursor-pointer ${priorityConfig.color} bg-opacity-20 hover:bg-opacity-30`}
        onClick={() => setShowDetails(true)}
      >
        <div className="flex justify-between items-start">
          <span className="text-xs">{getCategoryIcon(task.category)}</span>
          <span className={`w-2 h-2 rounded-full ${priorityConfig.color}`}></span>
        </div>
        <h4 className="text-xs font-medium truncate">{task.title}</h4>
      </div>
      
      {showDetails && (
        <TaskDetailsModal 
          task={task}
          onClose={() => setShowDetails(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default TaskCard;
