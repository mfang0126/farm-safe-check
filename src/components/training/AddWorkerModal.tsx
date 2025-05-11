
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

const departmentOptions = [
  { value: 'field_operations', label: 'Field Operations' },
  { value: 'processing', label: 'Processing' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'management', label: 'Management' },
  { value: 'administration', label: 'Administration' },
  { value: 'quality_control', label: 'Quality Control' },
];

const positionOptions = {
  field_operations: [
    { value: 'field_worker', label: 'Field Worker' },
    { value: 'equipment_operator', label: 'Equipment Operator' },
    { value: 'field_supervisor', label: 'Field Supervisor' },
  ],
  processing: [
    { value: 'processing_worker', label: 'Processing Worker' },
    { value: 'machine_operator', label: 'Machine Operator' },
    { value: 'quality_inspector', label: 'Quality Inspector' },
  ],
  maintenance: [
    { value: 'maintenance_technician', label: 'Maintenance Technician' },
    { value: 'electrician', label: 'Electrician' },
    { value: 'mechanic', label: 'Mechanic' },
  ],
  management: [
    { value: 'farm_manager', label: 'Farm Manager' },
    { value: 'operations_manager', label: 'Operations Manager' },
    { value: 'team_lead', label: 'Team Lead' },
  ],
  administration: [
    { value: 'administrative_assistant', label: 'Administrative Assistant' },
    { value: 'hr_specialist', label: 'HR Specialist' },
    { value: 'office_manager', label: 'Office Manager' },
  ],
  quality_control: [
    { value: 'quality_analyst', label: 'Quality Analyst' },
    { value: 'compliance_officer', label: 'Compliance Officer' },
    { value: 'safety_coordinator', label: 'Safety Coordinator' },
  ],
};

const formSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  employeeId: z.string().min(3, 'Employee ID is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().min(1, 'Start date is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface AddWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddWorkerModal = ({ isOpen, onClose }: AddWorkerModalProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      employeeId: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      startDate: new Date().toISOString().split('T')[0],
    },
  });
  
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    try {
      // In a real app, you would save the worker to the database here
      console.log('New worker data:', data);
      
      toast({
        title: 'Worker Added Successfully',
        description: `${data.firstName} ${data.lastName} has been added to the system.`,
      });
      
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error adding worker:', error);
      toast({
        title: 'Error Adding Worker',
        description: 'There was a problem adding the worker. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    form.setValue('department', value);
    form.setValue('position', ''); // Reset position when department changes
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Worker</DialogTitle>
          <DialogDescription>
            Enter the worker's information to add them to the training register.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input placeholder="EMP-2024-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.smith@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select 
                      onValueChange={handleDepartmentChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departmentOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedDepartment}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={selectedDepartment ? "Select position" : "Select department first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedDepartment && positionOptions[selectedDepartment]?.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Add Worker
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkerModal;
