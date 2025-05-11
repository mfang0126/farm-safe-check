
import { Task } from '@/types/tasks';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CalendarDays,
  Clock,
  User,
  CheckSquare,
  MessageCircle,
  Paperclip,
  Edit,
  Trash2,
} from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (taskId: string, updates: any) => void;
}

const TaskDetailsModal = ({ task, onClose, onUpdate }: TaskDetailsModalProps) => {
  const getInitials = (name: string) => {
    return name ? name.split(' ').map(part => part[0]).join('').toUpperCase() : '??';
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 text-yellow-950">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    const icons: any = {
      safety: '⚡',
      maintenance: '🔧',
      inventory: '📦',
      training: '📚',
      construction: '🏗️',
      other: '📋'
    };
    
    const colors: any = {
      safety: 'bg-blue-500',
      maintenance: 'bg-green-500',
      inventory: 'bg-purple-500',
      training: 'bg-amber-500',
      construction: 'bg-stone-500',
      other: 'bg-gray-500'
    };
    
    return (
      <Badge className={colors[category] || colors.other}>
        {icons[category] || icons.other} {category}
      </Badge>
    );
  };

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
  
  const handleStatusChange = (newStatus: string) => {
    const updates: any = { status: newStatus };
    
    // If marked as completed, set completedAt date
    if (newStatus === 'completed' && task.status !== 'completed') {
      updates.completedAt = new Date();
    } else if (newStatus !== 'completed' && task.status === 'completed') {
      updates.completedAt = undefined;
    }
    
    onUpdate(task.id, updates);
  };
  
  const handleSubtaskToggle = (subtaskId: string, completed: boolean) => {
    const updatedSubtasks = task.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed } : st
    );
    
    // Calculate new completion percentage
    const completedCount = updatedSubtasks.filter(st => st.completed).length;
    const totalCount = updatedSubtasks.length;
    const newCompletion = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    onUpdate(task.id, { 
      subtasks: updatedSubtasks,
      completion: newCompletion
    });
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-xl">{task.title}</DialogTitle>
              <DialogDescription>
                Task ID: {task.id}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <div className="text-sm">
                {task.description || "No description provided."}
              </div>
            </div>
            
            {task.subtasks.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-muted-foreground">Subtasks</h3>
                  <span className="text-xs text-muted-foreground">
                    {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} completed
                  </span>
                </div>
                
                <Progress value={task.completion} className="h-2" />
                
                <div className="space-y-2">
                  {task.subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={subtask.id} 
                        checked={subtask.completed}
                        onCheckedChange={(checked) => 
                          handleSubtaskToggle(subtask.id, checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={subtask.id} 
                        className={`text-sm cursor-pointer ${
                          subtask.completed ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {subtask.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {task.comments.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" /> Comments
                </h3>
                <div className="space-y-4">
                  {task.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(comment.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{comment.userName}</p>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {task.attachments.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Paperclip className="h-4 w-4" /> Attachments
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {task.attachments.map(attachment => (
                    <div 
                      key={attachment.id}
                      className="flex items-center gap-2 p-2 border rounded-md text-sm"
                    >
                      <Paperclip className="h-4 w-4" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{attachment.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(attachment.uploadedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
              <Select 
                value={task.status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Assigned to</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.assignedTo.map((userId, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getInitials(userId)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{userId}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Due Date</h3>
              </div>
              <div className="text-sm">
                {format(new Date(task.dueDate), 'MMMM d, yyyy')}
                {new Date(task.dueDate) < new Date() && task.status !== 'completed' && (
                  <Badge variant="destructive" className="ml-2">Overdue</Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Priority</span>
                  <span>{getPriorityBadge(task.priority)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span>{getCategoryBadge(task.category)}</span>
                </div>
                
                {task.estimatedHours !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Time</span>
                    <span>{task.estimatedHours} hours</span>
                  </div>
                )}
                
                {task.isRecurring && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Recurring</span>
                    <Badge variant="outline" className="text-blue-500 border-blue-200">Recurring</Badge>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Timeline</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{format(new Date(task.updatedAt), 'MMM d, yyyy')}</span>
                </div>
                {task.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed</span>
                    <span>{format(new Date(task.completedAt), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {task.status !== 'completed' && (
            <Button 
              variant="default"
              onClick={() => handleStatusChange('completed')}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              Mark Complete
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
