import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import FarmMap from '@/components/FarmMap';
import { ActionPlan } from '@/types/farmMap';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus,
  Edit,
  Eye,
  Trash2,
  MapPin,
  Move,
  Save,
  RotateCcw,
  ClipboardList,
  AlertCircle,
  FileText,
} from 'lucide-react';
import ActionPlanModal from '@/components/risk/ActionPlanModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { mockIncidents } from '@/components/risk/mock-incidents';
import DetailedRiskAssessmentModal from '@/components/risk/DetailedRiskAssessmentModal';
import { RiskService } from '@/lib/database/services/risk';
import { Tables } from '@/integrations/supabase/types';

type RiskZoneData = Tables<'risk_zones'>;
type FarmMapData = Tables<'farm_maps'> & { risk_zones: RiskZoneData[] };

// Risk zone form data interface
interface RiskZoneFormData {
  name: string;
  category: string;
  risk_level: string;
  location: string;
  description: string;
}

// Risk categories and levels
const RISK_CATEGORIES = [
  "Loading & Unloading Operations",
  "Machinery & Equipment Areas", 
  "Livestock Handling Areas",
  "Storage & Processing Facilities",
  "Environmental & Weather Hazards"
];

const RISK_LEVELS = ["Low", "Medium", "High", "Critical"];

const RiskArea = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('zones');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingZone, setEditingZone] = useState<RiskZoneData | null>(null);
  const [selectedZone, setSelectedZone] = useState<RiskZoneData | null>(null);
  const [hoveredZone, setHoveredZone] = useState<RiskZoneData | null>(null);
  const [farmMapData, setFarmMapData] = useState<FarmMapData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedZoneId, setDraggedZoneId] = useState<string | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [zoneForPlan, setZoneForPlan] = useState<RiskZoneData | null>(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [zoneForAssessment, setZoneForAssessment] = useState<RiskZoneData | null>(null);
  const riskService = useMemo(() => new RiskService(), []);

  // Form state for adding/editing zones
  const [formData, setFormData] = useState<RiskZoneFormData>({
    name: '',
    category: '',
    risk_level: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      const loadMap = async () => {
        const { data: map, error } = await riskService.getOrCreateFarmMap(user.id);
        if (error) {
          toast({ title: "Error", description: "Could not load or create farm map.", variant: "destructive" });
        } else if (map) {
          fetchFarmMap(map.id);
        }
      };
      loadMap();
    }
  }, [user, riskService, toast]);

  const fetchFarmMap = async (farmMapId: string) => {
    if (!user) return;
    const { data, error } = await riskService.getFarmMapWithRiskZones(farmMapId, user.id);
    if (error) {
      toast({
        title: 'Error fetching farm map data',
        description: error.message,
        variant: 'destructive',
      });
    } else if (data) {
      setFarmMapData(data);
    }
  };

  const riskZones = farmMapData?.risk_zones || [];
  
  const mapBounds = useMemo(() => {
    if (farmMapData?.bounds && typeof farmMapData.bounds === 'object' && farmMapData.bounds !== null) {
      return farmMapData.bounds as { width: number; height: number; scale: number };
    }
    return { width: 800, height: 600, scale: 1 };
  }, [farmMapData]);


  const getRiskLevelColor = (level: string | null) => {
    switch (level) {
      case 'Critical': return 'bg-red-500 hover:bg-red-600';
      case 'High': return 'bg-orange-500 hover:bg-orange-600';
      case 'Medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Low': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getRiskLevelBadgeColor = (level: string | null) => {
    switch (level) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      risk_level: '',
      location: '',
      description: ''
    });
    setEditingZone(null);
  };

  const canSubmit = () => {
    return formData.name.trim() && 
           formData.category && 
           formData.risk_level && 
           formData.location.trim() && 
           formData.description.trim();
  };

  const handleAddZone = async () => {
    if (!canSubmit() || !farmMapData || !user) return;

    try {
      const newZoneData = {
        farm_map_id: farmMapData.id,
        user_id: user.id,
        name: formData.name,
        category: formData.category,
        risk_level: formData.risk_level as 'Low' | 'Medium' | 'High' | 'Critical',
        location: formData.location,
        description: formData.description,
        last_review: new Date().toISOString(),
        incidents_this_year: 0,
        is_active: true,
        geometry: {
          id: `geo-${Date.now()}`,
          name: formData.name,
          type: 'rectangle',
          x: (mapBounds.width / 2) - 50,
          y: (mapBounds.height / 2) - 40,
          width: 100,
          height: 80,
          rotation: 0
        }
      };

      const { data: newZone, error } = await riskService.createRiskZone(newZoneData);

      if (error || !newZone) {
        throw new Error(error?.message || "Failed to create risk zone.");
      }
      
      setFarmMapData(prev => prev ? { ...prev, risk_zones: [...prev.risk_zones, newZone] } : null);

      toast({
        title: "Risk Zone Added",
        description: `"${formData.name}" has been added to the map.`,
      });

      setShowAddModal(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const handleEditZone = async () => {
    if (!canSubmit() || !editingZone || !farmMapData || !user) return;

    try {
      const updatedData = {
        name: formData.name,
        category: formData.category,
        risk_level: formData.risk_level as 'Low' | 'Medium' | 'High' | 'Critical',
        location: formData.location,
        description: formData.description,
        updated_at: new Date().toISOString(),
        geometry: {
          ...(editingZone.geometry as object),
          name: formData.name
        }
      };

      const { data: updatedZone, error } = await riskService.updateRiskZone(editingZone.id, user.id, updatedData);
      
      if (error || !updatedZone) {
        throw new Error(error?.message || "Failed to update risk zone.");
      }

      setFarmMapData(prev => prev ? {
        ...prev,
        risk_zones: prev.risk_zones.map(zone => zone.id === editingZone.id ? updatedZone : zone)
      } : null);

      toast({
        title: "Risk Zone Updated",
        description: `"${formData.name}" has been updated successfully.`,
      });

      setShowAddModal(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteZone = async (zoneId: string) => {
    if (!user) return;

    try {
      const { data, error } = await riskService.deleteRiskZone(zoneId, user.id);
      
      if (error || !data) {
        throw new Error(error?.message || "Failed to delete risk zone.");
      }

      setFarmMapData(prev => prev ? {
        ...prev,
        risk_zones: prev.risk_zones.filter(zone => zone.id !== zoneId)
      } : null);
      
      toast({
        title: "Risk Zone Deleted",
        description: "The risk zone has been deleted."
      });

    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const openEditModal = (zone: RiskZoneData) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      category: zone.category || '',
      risk_level: zone.risk_level || '',
      location: zone.location || '',
      description: zone.description || ''
    });
    setShowAddModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const closePlanModal = () => {
    setIsPlanModalOpen(false);
    setZoneForPlan(null);
  };

  const handleSavePlan = async (plan: ActionPlan) => {
    if (!zoneForPlan || !farmMapData || !user) return;
    
    const updatedData = { 
      action_plan: plan as any, // fix type later
      updated_at: new Date().toISOString()
    };
    
    const { data: updatedZone, error } = await riskService.updateRiskZone(zoneForPlan.id, user.id, updatedData);

    if (error || !updatedZone) {
      toast({ title: "Error", description: "Failed to save action plan.", variant: "destructive" });
      return;
    }

    setFarmMapData(prev => prev ? {
      ...prev,
      risk_zones: prev.risk_zones.map(z => z.id === zoneForPlan.id ? updatedZone : z)
    } : null);

    toast({ title: "Success", description: "Action plan saved." });
    closePlanModal();
  };

  const handleZoneClick = (zone: RiskZoneData) => {
    setSelectedZone(zone);
    // Potentially open details view
    console.log("Clicked zone:", zone);
  };
  
  const handleZoneHover = (zone: RiskZoneData | null) => {
    setHoveredZone(zone);
  };
  
  const handleZoneSelect = (zone: RiskZoneData | null) => {
    setSelectedZone(zone);
  };

  const handleZonePositionChange = async (zoneId: string, newPosition: { x: number; y: number }) => {
    if (!farmMapData || !user) return;
    
    const zoneToUpdate = farmMapData.risk_zones.find(zone => zone.id === zoneId);
    if (!zoneToUpdate) return;
    
    const newGeometry = {
      ...(zoneToUpdate.geometry as object),
      ...newPosition
    };
    
    const { data: updatedZone, error } = await riskService.updateRiskZone(zoneId, user.id, { geometry: newGeometry });

    if (error || !updatedZone) {
      toast({ title: "Error", description: "Failed to update zone position.", variant: "destructive" });
      // Optionally revert local state change
    } else {
      setFarmMapData(prev => {
        if (!prev) return null;
        const updatedZones = prev.risk_zones.map(zone => 
          zone.id === zoneId ? updatedZone : zone
        );
        return { ...prev, risk_zones: updatedZones };
      });
    }
  };

  const handleAddZoneToMap = () => {
    openAddModal();
  };
  
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const saveMapChanges = () => {
    // In a real app, this might trigger a batch update of all changes
    toast({
      title: "Changes Saved",
      description: "Map positions and properties have been updated.",
    });
    setIsEditMode(false);
  };

  const discardMapChanges = () => {
    if (farmMapData) {
      fetchFarmMap(farmMapData.id);
    }
    setIsEditMode(false);
  };
  
  const openAssessmentModal = (zone: RiskZoneData) => {
    setZoneForAssessment(zone);
    setIsAssessmentModalOpen(true);
  };
  
  const closeAssessmentModal = () => {
    setIsAssessmentModalOpen(false);
    setZoneForAssessment(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Risk Area Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define and monitor high-risk zones across your farm operations.
        </p>
      </header>
      
      <main className="flex-grow p-4 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="zones">Manage Zones</TabsTrigger>
              <TabsTrigger value="map">View Map</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              {activeTab === 'map' && (
                <>
                  <Button variant={isEditMode ? "destructive" : "outline"} onClick={toggleEditMode}>
                    {isEditMode ? 'Cancel' : 'Edit Map Layout'}
                  </Button>
                  {isEditMode && (
                    <>
                      <Button onClick={saveMapChanges}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
                      <Button variant="outline" onClick={discardMapChanges}><RotateCcw className="mr-2 h-4 w-4" /> Discard</Button>
                    </>
                  )}
                </>
              )}
              {activeTab === 'zones' && (
                <Button onClick={openAddModal}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Risk Zone
                </Button>
              )}
            </div>
          </div>
          
          <TabsContent value="zones" className="flex-grow">
            <Card>
              <CardHeader>
                <CardTitle>All Risk Zones</CardTitle>
                <CardDescription>
                  List of all identified risk zones. Click on a zone to view details or take action.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {riskZones.map(zone => (
                    <Card key={zone.id} className="flex flex-col justify-between">
                      <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                          <span>{zone.name}</span>
                          <Badge className={getRiskLevelBadgeColor(zone.risk_level)}>{zone.risk_level}</Badge>
                        </CardTitle>
                        <CardDescription>{zone.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {zone.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          <MapPin className="inline-block mr-1 h-3 w-3" />
                          {zone.location}
                        </p>
                      </CardContent>
                      <div className="p-4 border-t flex justify-end space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => openAssessmentModal(zone)}>
                                <ClipboardList className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Detailed Assessment</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => { setZoneForPlan(zone); setIsPlanModalOpen(true); }}>
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Action Plan</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => openEditModal(zone)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Zone</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteZone(zone.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Zone</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="map" className="flex-grow h-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
            {farmMapData && (
              <FarmMap 
                farmMapData={farmMapData}
                selectedZoneId={selectedZone?.id || null}
                hoveredZoneId={hoveredZone?.id || null}
                onZoneClick={handleZoneClick}
                onZoneHover={handleZoneHover}
                onZoneSelect={handleZoneSelect}
                isEditMode={isEditMode}
                onZonePositionChange={handleZonePositionChange}
                draggedZoneId={draggedZoneId}
                setDraggedZoneId={setDraggedZoneId}
              />
            )}
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>
                  Generate and export reports on risk exposure and safety compliance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Reporting features are under development.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Configure risk assessment parameters and notification preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Settings are under development.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add/Edit Zone Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingZone ? 'Edit Risk Zone' : 'Add New Risk Zone'}</DialogTitle>
            <DialogDescription>
              {editingZone ? 'Update the details of this risk zone.' : 'Define a new high-risk area on your farm.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {RISK_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="risk-level" className="text-right">Risk Level</Label>
              <Select value={formData.risk_level} onValueChange={(value) => setFormData({...formData, risk_level: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a risk level" />
                </SelectTrigger>
                <SelectContent>
                  {RISK_LEVELS.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Location</Label>
              <Input id="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="col-span-3" />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={editingZone ? handleEditZone : handleAddZone} disabled={!canSubmit()}>
              {editingZone ? 'Save Changes' : 'Add Zone'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Action Plan Modal */}
      {zoneForPlan && (
        <ActionPlanModal
          isOpen={isPlanModalOpen}
          onClose={closePlanModal}
          onSave={handleSavePlan}
          zone={zoneForPlan}
        />
      )}
      
      {/* Detailed Risk Assessment Modal */}
      {zoneForAssessment && (
         <DetailedRiskAssessmentModal
            isOpen={isAssessmentModalOpen}
            onClose={closeAssessmentModal}
            zone={zoneForAssessment}
            incidents={mockIncidents.filter(inc => inc.location === zoneForAssessment.location)}
        />
      )}
    </div>
  );
};

export default RiskArea; 