
import { useState } from 'react';
import { Search, SlidersHorizontal, X, Circle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { format } from "date-fns";

interface TaskFiltersProps {
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  onSortChange: (value: string) => void;
}

const TaskFilters = ({ filters, onFilterChange, onSortChange }: TaskFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const priorityOptions = [
    { value: 'all', label: 'All', icon: '○' },
    { value: 'critical', label: 'Critical', icon: '🔴' },
    { value: 'high', label: 'High', icon: '🟠' },
    { value: 'medium', label: 'Medium', icon: '🟡' },
    { value: 'low', label: 'Low', icon: '🟢' }
  ];
  
  const categoryOptions = [
    { value: 'all', label: 'All Categories', icon: '📋' },
    { value: 'safety', label: 'Safety', icon: '⚡' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { value: 'inventory', label: 'Inventory', icon: '📦' },
    { value: 'training', label: 'Training', icon: '📚' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={filters.view} onValueChange={(value) => onFilterChange('view', value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mine">My Tasks</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(value) => onSortChange(value)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="due_date">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="created_date">Created</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={showAdvanced ? "bg-accent" : ""}
          >
            <SlidersHorizontal size={16} />
          </Button>
        </div>
      </div>
      
      {showAdvanced && (
        <div className="bg-muted/50 p-4 rounded-lg space-y-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <div className="flex gap-2 flex-wrap">
                {priorityOptions.map(option => (
                  <Button
                    key={option.value}
                    variant={filters.priority === option.value ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange('priority', option.value)}
                    className="flex items-center gap-1"
                  >
                    {option.icon === '○' ? 
                      <Circle className="h-3 w-3" /> : 
                      <span>{option.icon}</span>
                    }
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <div className="flex gap-2 flex-wrap">
                {categoryOptions.map(option => (
                  <Button
                    key={option.value}
                    variant={filters.category === option.value ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange('category', option.value)}
                    className="flex items-center gap-1"
                  >
                    <span>{option.icon}</span>
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    {filters.startDate ? (
                      format(filters.startDate, "PP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.startDate}
                    onSelect={(date) => onFilterChange('startDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    {filters.endDate ? (
                      format(filters.endDate, "PP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.endDate}
                    onSelect={(date) => onFilterChange('endDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onFilterChange('reset', null)}>
              Reset Filters
            </Button>
            <Button variant="secondary" size="sm" className="flex items-center gap-2" 
              onClick={() => setShowAdvanced(false)}>
              <X size={14} />
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;

