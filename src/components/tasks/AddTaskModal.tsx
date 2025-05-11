
import { useState } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TaskCategory, TaskPriority } from '@/types/tasks';

interface AddTaskModalProps {
  onClose: () => void;
  onTaskAdd: (task: any) => void;
}

const AddTaskModal = ({ onClose, onTaskAdd }: AddTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('maintenance');
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [assignedTo, setAssignedTo] = useState(['user-001']); // Default to current user
  
  const handleSubmit = () => {
    if (!title || !dueDate) return;

    const newTask = {
      id: `task-${uuidv4().slice(0, 8)}`,
      title,
      description,
      
      // Assignment
      assignedTo,
      createdBy: 'user-001', // Current user
      
      // Scheduling
      dueDate,
      
      // Status
      status: 'todo',
      priority,
      completion: 0,
      
      // Classification
      category,
      tags: [],
      isRecurring: false,
      subtasks: [],
      
      // Relationships
      relatedEquipment: [],
      relatedIncidents: [],
      relatedChecklists: [],
      
      // Attachments & Comments
      attachments: [],
      comments: [],
      timeEntries: [],
      
      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    onTaskAdd(newTask);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Task details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={priority} 
                onValueChange={(value: TaskPriority) => setPriority(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={category} 
                onValueChange={(value: TaskCategory) => setCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">🔧 Maintenance</SelectItem>
                  <SelectItem value="safety">⚡ Safety</SelectItem>
                  <SelectItem value="inventory">📦 Inventory</SelectItem>
                  <SelectItem value="training">📚 Training</SelectItem>
                  <SelectItem value="construction">🏗️ Construction</SelectItem>
                  <SelectItem value="other">📋 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left">
                    {dueDate ? (
                      format(dueDate, "MMM dd, yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label>Assigned To</Label>
              <Select
                defaultValue="user-001"
                onValueChange={(value) => setAssignedTo([value])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign to..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user-001">Me (Current User)</SelectItem>
                  <SelectItem value="user-002">Sarah Lopez</SelectItem>
                  <SelectItem value="user-003">Mike Thompson</SelectItem>
                  <SelectItem value="user-004">Lisa Park</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title || !dueDate}>Save Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
