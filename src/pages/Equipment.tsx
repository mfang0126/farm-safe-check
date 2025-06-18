import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, CheckCircle, AlertCircle, XCircle, Plus, Search, FilterIcon, Truck, FileCheck, Archive, ClipboardCheck, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { equipmentService } from '@/lib/database';
import { Equipment as EquipmentType, EquipmentInsert } from '@/lib/database/types';
import { formatDatabaseDate } from '@/lib/database/utils';

// UI adapter for the database equipment type
interface UIEquipment {
  id: string;
  type: string;
  makeModel: string;
  operator: string;
  lastInspection: string;
  nextInspection: string;
  purchaseDate: string;
  status: 'Passed' | 'Needs Maintenance' | 'Failed';
  safetyFeatures: string[];
  notes?: string;
}

// Convert database equipment to UI equipment format
const mapToUIEquipment = (dbEquipment: EquipmentType): UIEquipment => ({
  id: dbEquipment.id,
  type: dbEquipment.type,
  makeModel: dbEquipment.make_model,
  operator: dbEquipment.operator,
  lastInspection: dbEquipment.last_inspection,
  nextInspection: dbEquipment.next_inspection,
  purchaseDate: dbEquipment.purchase_date,
  status: dbEquipment.status,
  safetyFeatures: dbEquipment.safety_features,
  notes: dbEquipment.notes
});

// Mock data to use when database table is not yet implemented
const mockEquipment: UIEquipment[] = [
  {
    id: "1",
    type: 'Tractor',
    makeModel: 'John Deere 6M Series',
    operator: 'John Farmer',
    lastInspection: '2025-04-15',
    nextInspection: '2025-07-15',
    purchaseDate: '2023-06-10',
    status: 'Passed',
    safetyFeatures: ['ROPS', 'Seatbelt', 'PTO Guard', 'SMV Emblem'],
    notes: 'Regular maintenance completed on schedule. All systems working properly.'
  },
  {
    id: "2",
    type: 'Harvester',
    makeModel: 'Case IH 250 Series',
    operator: 'Mark Smith',
    lastInspection: '2025-04-20',
    nextInspection: '2025-06-20',
    purchaseDate: '2022-08-15',
    status: 'Needs Maintenance',
    safetyFeatures: ['Operator Presence System', 'Emergency Stop', 'Safety Shields'],
    notes: 'Hydraulic system needs inspection. Scheduled maintenance for next week.'
  },
  {
    id: "3",
    type: 'Sprayer',
    makeModel: 'Kubota M7060',
    operator: 'Sarah Jones',
    lastInspection: '2025-04-10',
    nextInspection: '2025-07-10',
    purchaseDate: '2024-01-22',
    status: 'Passed',
    safetyFeatures: ['Chemical Guards', 'Pressure Relief', 'Auto Shutoff'],
    notes: 'New pressure gauge installed. All safety features verified.'
  },
  {
    id: "4",
    type: 'Tillage Equipment',
    makeModel: 'John Deere 2230',
    operator: 'Mike Johnson',
    lastInspection: '2025-03-05',
    nextInspection: '2025-06-05',
    purchaseDate: '2021-11-30',
    status: 'Failed',
    safetyFeatures: ['Transport Locks', 'Safety Chains', 'Hydraulic Locks'],
    notes: 'Critical safety issue with hydraulic system. Equipment tagged out of service.'
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
  const [equipment, setEquipment] = useState<UIEquipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<UIEquipment | null>(null);
  const [equipmentToDelete, setEquipmentToDelete] = useState<UIEquipment | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [loading, setLoading] = useState(true);
  const [newEquipment, setNewEquipment] = useState<Omit<UIEquipment, 'id'>>({
    type: '',
    makeModel: '',
    operator: '',
    lastInspection: new Date().toISOString().split('T')[0],
    nextInspection: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
    purchaseDate: new Date().toISOString().split('T')[0],
    status: 'Passed',
    safetyFeatures: [],
    notes: ''
  });
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Load equipment on component mount
  useEffect(() => {
    const loadEquipment = async () => {
      setLoading(true);
      try {
        if (user) {
          const result = await equipmentService.getUserEquipment(user.id);
          if (result.data) {
            // Use real data from database if available
            setEquipment(result.data.map(mapToUIEquipment));
          } else {
            // Use mock data if database table doesn't exist yet
            setEquipment(mockEquipment);
          }
        } else {
          // Use mock data if not logged in
          setEquipment(mockEquipment);
        }
      } catch (error) {
        console.error('Error loading equipment:', error);
        setEquipment(mockEquipment);
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, [user]);

  const handleAddEquipment = async () => {
    // Validate form
    if (!newEquipment.type || !newEquipment.makeModel || !newEquipment.operator) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      if (user) {
        // Convert UI equipment to database format
        const equipmentInsert: Omit<EquipmentInsert, 'user_id'> = {
          type: newEquipment.type,
          make_model: newEquipment.makeModel,
          operator: newEquipment.operator,
          last_inspection: newEquipment.lastInspection,
          next_inspection: newEquipment.nextInspection,
          purchase_date: newEquipment.purchaseDate,
          status: newEquipment.status,
          safety_features: newEquipment.safetyFeatures,
          notes: newEquipment.notes
        };
        
        // Add to database
        const result = await equipmentService.createEquipment(user.id, equipmentInsert);
        
        if (result.data) {
          // Add to local state
          setEquipment([...equipment, mapToUIEquipment(result.data)]);
        } else {
          // If database table doesn't exist yet, add to local state with mock ID
          const mockId = Math.random().toString(36).substring(2, 15);
          setEquipment([...equipment, { ...newEquipment, id: mockId }]);
        }
      } else {
        // If not logged in, just add to local state with mock ID
        const mockId = Math.random().toString(36).substring(2, 15);
        setEquipment([...equipment, { ...newEquipment, id: mockId }]);
      }
      
      // Reset form and close dialog
      setNewEquipment({
        type: '',
        makeModel: '',
        operator: '',
        lastInspection: new Date().toISOString().split('T')[0],
        nextInspection: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
        purchaseDate: new Date().toISOString().split('T')[0],
        status: 'Passed',
        safetyFeatures: [],
        notes: ''
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding equipment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add equipment. Please try again.',
        variant: 'destructive'
      });
    }
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
  
  const handleViewEquipment = (item: UIEquipment) => {
    setCurrentEquipment(item);
    setIsViewDialogOpen(true);
  };

  const handleDeleteEquipment = (item: UIEquipment) => {
    setEquipmentToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteEquipment = async () => {
    if (!equipmentToDelete) return;

    try {
      if (user) {
        // Delete from database
        const result = await equipmentService.deleteEquipment(equipmentToDelete.id, user.id);
        
        if (!result.data && !result.error?.message.includes('not yet implemented')) {
          // If there was an actual error (not just the table not existing yet)
          throw new Error('Failed to delete equipment');
        }
      }
      
      // Remove from local state regardless of database result
      const updatedEquipment = equipment.filter(equip => equip.id !== equipmentToDelete.id);
      setEquipment(updatedEquipment);
      
      // Close any open dialogs for this equipment
      if (currentEquipment && currentEquipment.id === equipmentToDelete.id) {
        setCurrentEquipment(null);
        setIsViewDialogOpen(false);
      }
      
      setEquipmentToDelete(null);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: 'Success',
        description: 'Equipment deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete equipment. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleStatusChange = async (item: UIEquipment, newStatus: 'Passed' | 'Needs Maintenance' | 'Failed') => {
    try {
      if (user) {
        // Update in database
        const result = await equipmentService.updateEquipmentStatus(item.id, user.id, newStatus);
        
        if (!result.data && !result.error?.message.includes('not yet implemented')) {
          // If there was an actual error (not just the table not existing yet)
          throw new Error('Failed to update equipment status');
        }
      }
      
      // Update in local state regardless of database result
      const updatedEquipment = equipment.map(equip => {
        if (equip.id === item.id) {
          return { ...equip, status: newStatus };
        }
        return equip;
      });
      
      setEquipment(updatedEquipment);
      
      // If viewing an item, update the current equipment too
      if (currentEquipment && currentEquipment.id === item.id) {
        setCurrentEquipment({ ...currentEquipment, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating equipment status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update equipment status. Please try again.',
        variant: 'destructive'
      });
    }
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Equipment Registry</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all your farm equipment safety</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Tabs value={viewMode} onValueChange={(value: 'cards' | 'table') => setViewMode(value)} className="mr-2">
            <TabsList className="grid w-[180px] grid-cols-2">
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
          
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
              
              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
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
                  <Label htmlFor="lastInspection" className="text-right">
                    Last Inspection
                  </Label>
                  <div className="col-span-3 relative">
                    <Input
                      id="lastInspection"
                      type="date"
                      value={newEquipment.lastInspection}
                      onChange={(e) => setNewEquipment({...newEquipment, lastInspection: e.target.value})}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nextInspection" className="text-right">
                    Next Inspection
                  </Label>
                  <div className="col-span-3 relative">
                    <Input
                      id="nextInspection"
                      type="date"
                      value={newEquipment.nextInspection}
                      onChange={(e) => setNewEquipment({...newEquipment, nextInspection: e.target.value})}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="purchaseDate" className="text-right">
                    Purchase Date
                  </Label>
                  <div className="col-span-3 relative">
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={newEquipment.purchaseDate}
                      onChange={(e) => setNewEquipment({...newEquipment, purchaseDate: e.target.value})}
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
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <div className="col-span-3">
                    <textarea
                      id="notes"
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Additional notes about this equipment..."
                      value={newEquipment.notes || ''}
                      onChange={(e) => setNewEquipment({...newEquipment, notes: e.target.value})}
                    />
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
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-300 h-12 w-12 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      )}
      
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        {currentEquipment && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{currentEquipment.makeModel}</DialogTitle>
              <DialogDescription>
                {currentEquipment.type}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusClass(currentEquipment.status)}`}>
                  {currentEquipment.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium block">Operator</span>
                  <span className="text-sm text-gray-600">{currentEquipment.operator}</span>
                </div>
                
                <div>
                  <span className="text-sm font-medium block">Purchase Date</span>
                  <span className="text-sm text-gray-600">{new Date(currentEquipment.purchaseDate).toLocaleDateString()}</span>
                </div>
                
                <div>
                  <span className="text-sm font-medium block">Last Inspection</span>
                  <span className="text-sm text-gray-600">{new Date(currentEquipment.lastInspection).toLocaleDateString()}</span>
                </div>
                
                <div>
                  <span className="text-sm font-medium block">Next Inspection</span>
                  <span className="text-sm text-gray-600">{new Date(currentEquipment.nextInspection).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium block">Safety Features</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentEquipment.safetyFeatures.map(feature => (
                    <span 
                      key={feature} 
                      className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              {currentEquipment.notes && (
                <div>
                  <span className="text-sm font-medium block">Notes</span>
                  <p className="text-sm text-gray-600 mt-1">{currentEquipment.notes}</p>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex justify-between mt-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleStatusChange(currentEquipment, 'Passed')}>
                  Mark Passed
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleStatusChange(currentEquipment, 'Needs Maintenance')}>
                  Needs Maintenance
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Equipment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this equipment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {equipmentToDelete && (
            <div className="space-y-2 py-4">
              <p className="font-medium">{equipmentToDelete.makeModel}</p>
              <p className="text-sm text-gray-600">{equipmentToDelete.type} - {equipmentToDelete.operator}</p>
            </div>
          )}
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteEquipment}>
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Tabs value={viewMode} className="w-full">
        <TabsContent value="cards" className="m-0">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredEquipment.map(item => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{item.makeModel}</CardTitle>
                      <CardDescription>{item.type}</CardDescription>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusClass(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Operator</p>
                    <p className="text-sm text-gray-600">{item.operator}</p>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">Last Inspection</p>
                      <p className="text-gray-600 flex items-center gap-1">
                        <CalendarIcon size={14} />
                        {new Date(item.lastInspection).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Next Check</p>
                      <p className="text-gray-600 flex items-center gap-1">
                        <CalendarIcon size={14} />
                        {new Date(item.nextInspection).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Safety Features</p>
                    <div className="flex flex-wrap gap-1">
                      {item.safetyFeatures.slice(0, 3).map(feature => (
                        <span 
                          key={feature} 
                          className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {item.safetyFeatures.length > 3 && (
                        <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full">
                          +{item.safetyFeatures.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleViewEquipment(item)}
                  >
                    <ClipboardCheck size={14} />
                    Details
                  </Button>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <FileCheck size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Archive size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteEquipment(item)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="table" className="m-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Last Inspection</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipment.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.makeModel}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.operator}</TableCell>
                      <TableCell>{new Date(item.lastInspection).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 ${getStatusClass(item.status)}`}>
                          {getStatusIcon(item.status)}
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewEquipment(item)}
                          >
                            Details
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteEquipment(item)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {filteredEquipment.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Truck size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 font-medium">No equipment found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default Equipment;
