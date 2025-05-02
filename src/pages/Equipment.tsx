
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, CheckCircle, AlertCircle, XCircle, Plus, Search, FilterIcon } from 'lucide-react';

interface Equipment {
  id: number;
  type: string;
  makeModel: string;
  operator: string;
  lastInspection: string;
  status: 'Passed' | 'Needs Maintenance' | 'Failed';
  safetyFeatures: string[];
}

const initialEquipment: Equipment[] = [
  {
    id: 1,
    type: 'Tractor',
    makeModel: 'John Deere 6M Series',
    operator: 'John Farmer',
    lastInspection: '2025-04-15',
    status: 'Passed',
    safetyFeatures: ['ROPS', 'Seatbelt', 'PTO Guard', 'SMV Emblem']
  },
  {
    id: 2,
    type: 'Harvester',
    makeModel: 'Case IH 250 Series',
    operator: 'Mark Smith',
    lastInspection: '2025-04-20',
    status: 'Needs Maintenance',
    safetyFeatures: ['Operator Presence System', 'Emergency Stop', 'Safety Shields']
  },
  {
    id: 3,
    type: 'Sprayer',
    makeModel: 'Kubota M7060',
    operator: 'Sarah Jones',
    lastInspection: '2025-04-10',
    status: 'Passed',
    safetyFeatures: ['Chemical Guards', 'Pressure Relief', 'Auto Shutoff']
  },
  {
    id: 4,
    type: 'Tillage Equipment',
    makeModel: 'John Deere 2230',
    operator: 'Mike Johnson',
    lastInspection: '2025-03-05',
    status: 'Failed',
    safetyFeatures: ['Transport Locks', 'Safety Chains', 'Hydraulic Locks']
  }
];

const equipmentTypes = [
  'Tractor',
  'Harvester',
  'Sprayer',
  'Tillage Equipment',
  'Planter',
  'Baler',
  'ATV/UTV',
  'Truck',
  'Other'
];

const safetyFeaturesOptions = [
  'ROPS (Rollover Protection)',
  'Seatbelt',
  'PTO Guard',
  'SMV Emblem',
  'Operator Presence System',
  'Emergency Stop',
  'Safety Shields',
  'Chemical Guards',
  'Pressure Relief',
  'Auto Shutoff',
  'Transport Locks',
  'Safety Chains',
  'Hydraulic Locks',
  'Fire Extinguisher',
  'First Aid Kit'
];

const Equipment = () => {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEquipment, setNewEquipment] = useState<Omit<Equipment, 'id'>>({
    type: '',
    makeModel: '',
    operator: '',
    lastInspection: new Date().toISOString().split('T')[0],
    status: 'Passed',
    safetyFeatures: []
  });
  
  const { toast } = useToast();

  const handleAddEquipment = () => {
    // Validate form
    if (!newEquipment.type || !newEquipment.makeModel || !newEquipment.operator) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }
    
    // Add new equipment
    const newId = Math.max(...equipment.map(e => e.id), 0) + 1;
    setEquipment([...equipment, { ...newEquipment, id: newId }]);
    
    // Reset form and close dialog
    setNewEquipment({
      type: '',
      makeModel: '',
      operator: '',
      lastInspection: new Date().toISOString().split('T')[0],
      status: 'Passed',
      safetyFeatures: []
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: 'Equipment Added',
      description: 'New equipment has been successfully added.'
    });
  };
  
  const handleSafetyFeatureChange = (feature: string) => {
    setNewEquipment(prev => {
      if (prev.safetyFeatures.includes(feature)) {
        return {
          ...prev,
          safetyFeatures: prev.safetyFeatures.filter(f => f !== feature)
        };
      } else {
        return {
          ...prev,
          safetyFeatures: [...prev.safetyFeatures, feature]
        };
      }
    });
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Passed': 
        return <CheckCircle size={20} className="text-green-600" />;
      case 'Needs Maintenance': 
        return <AlertCircle size={20} className="text-amber-600" />;
      case 'Failed': 
        return <XCircle size={20} className="text-red-600" />;
      default:
        return null;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Passed': return 'text-green-700 bg-green-100';
      case 'Needs Maintenance': return 'text-amber-700 bg-amber-100';
      case 'Failed': return 'text-red-700 bg-red-100';
      default: return '';
    }
  };
  
  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = 
      item.makeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.operator.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' ||
      item.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Equipment Registry</h1>
            <p className="text-gray-600 mt-1">Manage and monitor all your farm equipment safety</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-600">
                <Plus size={16} className="mr-2" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
                <DialogDescription>
                  Enter the details of the new equipment to add to your registry.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="equipmentType" className="text-right">
                    Type*
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={newEquipment.type} 
                      onValueChange={(value) => setNewEquipment({...newEquipment, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select equipment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="makeModel" className="text-right">
                    Make/Model*
                  </Label>
                  <Input
                    id="makeModel"
                    placeholder="e.g., John Deere 6M Series"
                    className="col-span-3"
                    value={newEquipment.makeModel}
                    onChange={(e) => setNewEquipment({...newEquipment, makeModel: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="operator" className="text-right">
                    Operator*
                  </Label>
                  <Input
                    id="operator"
                    placeholder="Name of primary operator"
                    className="col-span-3"
                    value={newEquipment.operator}
                    onChange={(e) => setNewEquipment({...newEquipment, operator: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="inspectionDate" className="text-right">
                    Last Inspection
                  </Label>
                  <div className="col-span-3 relative">
                    <Input
                      id="inspectionDate"
                      type="date"
                      value={newEquipment.lastInspection}
                      onChange={(e) => setNewEquipment({...newEquipment, lastInspection: e.target.value})}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={newEquipment.status} 
                      onValueChange={(value: 'Passed' | 'Needs Maintenance' | 'Failed') => setNewEquipment({...newEquipment, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Passed">Passed</SelectItem>
                        <SelectItem value="Needs Maintenance">Needs Maintenance</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-1">
                    Safety Features
                  </Label>
                  <div className="col-span-3 grid grid-cols-2 gap-2">
                    {safetyFeaturesOptions.map(feature => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox 
                          id={feature}
                          checked={newEquipment.safetyFeatures.includes(feature)}
                          onCheckedChange={() => handleSafetyFeatureChange(feature)}
                        />
                        <Label htmlFor={feature} className="text-sm font-normal">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button className="bg-primary hover:bg-primary-600" onClick={handleAddEquipment}>Add Equipment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input 
              placeholder="Search equipment..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <div className="flex items-center gap-2">
                <FilterIcon size={16} />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="passed">Passed</SelectItem>
              <SelectItem value="needs maintenance">Needs Maintenance</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredEquipment.map(item => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{item.makeModel}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <CardDescription>{item.type}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Operator</p>
                  <p className="text-sm text-gray-600">{item.operator}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Last Inspection</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <CalendarIcon size={14} />
                    {new Date(item.lastInspection).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Safety Features</p>
                  <div className="flex flex-wrap gap-1">
                    {item.safetyFeatures.map(feature => (
                      <span 
                        key={feature} 
                        className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Run Check</Button>
                <Button variant="ghost" size="sm">View History</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No equipment found matching your criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Equipment;
