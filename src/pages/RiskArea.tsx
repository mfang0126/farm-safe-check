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
  Download,
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
        description: `"${formData.name}" has been added successfully.`,
      });

      resetForm();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding zone:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add risk zone. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditZone = async () => {
    if (!canSubmit() || !editingZone || !farmMapData || !user) return;

    try {
      const updatedZoneData = {
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

      const { data: updatedZone, error } = await riskService.updateRiskZone(editingZone.id, user.id, updatedZoneData);

      if (error || !updatedZone) {
        throw new Error(error?.message || "Failed to update risk zone.");
      }

      const updatedZones = farmMapData.risk_zones.map(zone => 
        zone.id === editingZone.id ? updatedZone : zone
      );

      setFarmMapData({
        ...farmMapData,
        risk_zones: updatedZones
      });

      toast({
        title: "Risk Zone Updated",
        description: `"${formData.name}" has been updated successfully.`,
      });

      resetForm();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error updating zone:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update risk zone. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteZone = async (zoneId: string) => {
    if (!farmMapData || !user) return;

    try {
      const { error } = await riskService.deleteRiskZone(zoneId, user.id);

      if (error) {
        throw new Error(error.message);
      }

      const updatedZones = farmMapData.risk_zones.filter(zone => zone.id !== zoneId);
      setFarmMapData({
        ...farmMapData,
        risk_zones: updatedZones
      });

      toast({
        title: "Risk Zone Deleted",
        description: "The risk zone has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting zone:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete risk zone. Please try again.",
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
    setZoneForPlan(null);
    setIsPlanModalOpen(false);
  };

  const handleSavePlan = async (plan: ActionPlan) => {
    if (!zoneForPlan || !farmMapData || !user) return;

    try {
      const updatedZoneData = {
        action_plan: plan,
        updated_at: new Date().toISOString()
      };

      const { data: updatedZone, error } = await riskService.updateRiskZone(zoneForPlan.id, user.id, updatedZoneData);

      if (error || !updatedZone) {
        throw new Error(error?.message || "Failed to update action plan.");
      }

      const updatedZones = farmMapData.risk_zones.map(zone =>
        zone.id === zoneForPlan.id ? updatedZone : zone
    );

    setFarmMapData({
      ...farmMapData,
        risk_zones: updatedZones
    });

    toast({
      title: "Action Plan Saved",
      description: `The action plan for "${zoneForPlan.name}" has been updated.`,
    });
    } catch (error) {
      console.error('Error saving action plan:', error);
      toast({
        title: "Error",
        description: "Failed to save action plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleZoneClick = (zone: RiskZoneData) => {
    if (isEditMode) {
      setSelectedZone(zone);
    }
  };

  const handleZoneHover = (zone: RiskZoneData | null) => {
    setHoveredZone(zone);
  };

  const handleZoneSelect = (zone: RiskZoneData | null) => {
    setSelectedZone(zone);
  };

  const handleZonePositionChange = async (zoneId: string, newPosition: { x: number; y: number }) => {
    if (!farmMapData) return;
    
    const updatedZones = farmMapData.risk_zones.map(zone => 
      zone.id === zoneId 
        ? {
            ...zone,
            geometry: {
              ...(zone.geometry as object),
              x: newPosition.x,
              y: newPosition.y
            }
          }
        : zone
    );

    setFarmMapData({
      ...farmMapData,
      risk_zones: updatedZones
    });

    // Save to database in edit mode
    if (isEditMode && user) {
      try {
        const zoneToUpdate = farmMapData.risk_zones.find(zone => zone.id === zoneId);
        if (zoneToUpdate) {
          const updatedZoneData = {
            geometry: {
              ...(zoneToUpdate.geometry as object),
              x: newPosition.x,
              y: newPosition.y
            }
          };
          await riskService.updateRiskZone(zoneId, user.id, updatedZoneData);
        }
      } catch (error) {
        console.error('Error updating zone position:', error);
      }
    }
  };

  const handleAddZoneToMap = () => {
    setActiveTab('zones');
    openAddModal();
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedZone(null);
  };

  const saveMapChanges = () => {
    if (farmMapData) {
      toast({
        title: "Map Saved",
        description: "All position changes have been saved successfully.",
      });
    }
    setIsEditMode(false);
    setSelectedZone(null);
  };

  const discardMapChanges = async () => {
    if (user && farmMapData) {
      await fetchFarmMap(farmMapData.id);
    }
    setIsEditMode(false);
    setSelectedZone(null);
    toast({
      title: "Changes Discarded",
      description: "All unsaved position changes have been discarded.",
    });
  };

  const openAssessmentModal = (zone: RiskZoneData) => {
    setZoneForAssessment(zone);
    setIsAssessmentModalOpen(true);
  };

  const closeAssessmentModal = () => {
    setZoneForAssessment(null);
    setIsAssessmentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Only 2 tabs: Manage Zones and View Map */}
        <TabsList className="grid grid-cols-2 w-full md:w-auto">
          <TabsTrigger value="zones">Manage Zones</TabsTrigger>
          <TabsTrigger value="map">View Map</TabsTrigger>
        </TabsList>

        <TabsContent value="zones" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">High-Risk Zones Management</h2>
              <p className="text-gray-600">Manage and configure your farm's risk areas</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2" size={16} />
                Export Report
              </Button>
              <Button size="sm" onClick={openAddModal}>
              <Plus className="mr-2" size={16} />
                Add New Risk Zone
            </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Current Risk Zones */}
              <Card>
              <CardHeader>
                <CardTitle>Current Risk Zones</CardTitle>
                <CardDescription>Active risk areas requiring management attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskZones.map((zone) => (
                    <div 
                      key={zone.id} 
                      className={`border rounded-lg p-4 space-y-3 transition-all cursor-pointer ${
                        selectedZone?.id === zone.id ? 'ring-2 ring-blue-500 border-blue-500' : 
                        hoveredZone?.id === zone.id ? 'border-gray-400 shadow-md' : ''
                      }`}
                      onClick={() => handleZoneSelect(zone)}
                    >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{zone.name}</h3>
                            <Badge className={getRiskLevelBadgeColor(zone.risk_level)}>
                              {zone.risk_level}
                          </Badge>
                        </div>
                          <p className="text-sm text-gray-600 mb-1">{zone.category}</p>
                          <p className="text-sm text-gray-800 mb-2">{zone.description}</p>
                          <div className="text-xs text-gray-500">
                            <p>Last review: {zone.last_review ? new Date(zone.last_review).toLocaleDateString() : 'Never'} | {zone.incidents_this_year || 0} incidents this year</p>
                            <p>Position: ({Math.round((zone.geometry as object & {x?: number, y?: number})?.x || 0)}, {Math.round((zone.geometry as object & {x?: number, y?: number})?.y || 0)})</p>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-4">
                        <Button size="sm" variant="outline" onClick={() => openAssessmentModal(zone)}>
                            <Eye className="mr-1" size={14} />
                            View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEditModal(zone)}>
                          <Edit className="mr-1" size={14} />
                            Edit
                        </Button>
                          <Button size="sm" className={getRiskLevelColor(zone.risk_level)} onClick={() => { setZoneForPlan(zone); setIsPlanModalOpen(true); }}>
                            <FileText className="mr-1" size={14} />
                            Action Plan
                        </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                    </div>
                  </CardContent>
                </Card>
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Full-Screen Interactive Farm Map</h2>
              <p className="text-gray-600">
                Expanded view of your farm's risk zones with enhanced interaction
                {selectedZone && (
                  <span className="ml-2 text-blue-600 font-medium">
                    • Selected: {selectedZone.name}
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant={isEditMode ? "destructive" : "outline"} onClick={toggleEditMode}>
                {isEditMode ? 'Cancel Edit' : 'Edit Map Layout'}
                  </Button>
              {isEditMode && (
                <>
                  <Button onClick={saveMapChanges}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={discardMapChanges}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Discard
                  </Button>
                </>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Farm Risk Map</CardTitle>
              <CardDescription>
                Click and drag to pan, scroll to zoom, click zones for details
                {selectedZone && (
                  <span className="ml-2 text-blue-600 font-medium">
                    • Selected: {selectedZone.name}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border rounded-lg overflow-hidden">
              {farmMapData ? (
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
                    className="relative"
                  />
              ) : (
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin size={48} className="mx-auto mb-2" />
                      <p className="font-medium">Loading Interactive Map...</p>
                      <p className="text-sm">Initializing farm layout with risk zones</p>
                    </div>
                  </div>
                )}
                </div>
              
              {/* Zone details panel */}
              {selectedZone && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      {selectedZone.name}
                      <Badge className={getRiskLevelBadgeColor(selectedZone.risk_level)}>
                        {selectedZone.risk_level}
                      </Badge>
                    </h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedZone(null)}
                    >
                      ✕
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{selectedZone.category}</p>
                  <p className="text-sm mb-2">{selectedZone.description}</p>
                  <div className="text-xs text-gray-500 flex gap-4">
                    <span>Last review: {selectedZone.last_review ? new Date(selectedZone.last_review).toLocaleDateString() : 'Never'}</span>
                    <span>{selectedZone.incidents_this_year || 0} incidents this year</span>
                    <span>Location: {selectedZone.location}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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