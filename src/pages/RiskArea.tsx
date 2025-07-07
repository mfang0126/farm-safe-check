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
import { Tables, Json } from '@/integrations/supabase/types';

type RiskZoneData = Tables<'risk_zones'>;
type FarmMapData = Tables<'farm_maps'> & { risk_zones: RiskZoneData[] };

// Extended geometry interface to include action plan
interface ExtendedGeometry {
  id?: string;
  name?: string;
  type?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  actionPlan?: ActionPlan;
}

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
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100';
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
        description: `"${formData.name}" has been added to the center of the map.`,
      });

      setShowAddModal(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add risk zone. Please try again.",
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
      };

      const { data: updatedZone, error } = await riskService.updateRiskZone(
        editingZone.id,
        user.id,
        updatedZoneData
      );

      if (error || !updatedZone) {
        throw new Error(error?.message || "Failed to update risk zone.");
      }

      setFarmMapData(prev => prev ? {
        ...prev,
        risk_zones: prev.risk_zones.map(zone =>
          zone.id === editingZone.id ? updatedZone : zone
        )
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
        description: "Failed to update risk zone. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteZone = async (zoneId: string) => {
    if (!user) return;

    try {
      const { error } = await riskService.deleteRiskZone(zoneId, user.id);

      if (error) {
        throw new Error(error.message);
      }

      setFarmMapData(prev => prev ? {
        ...prev,
        risk_zones: prev.risk_zones.filter(zone => zone.id !== zoneId)
      } : null);

      toast({
        title: "Risk Zone Deleted",
        description: "The risk zone has been removed successfully.",
      });

      if (selectedZone?.id === zoneId) {
        setSelectedZone(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete risk zone. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (zone: RiskZoneData) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      category: zone.category,
      risk_level: zone.risk_level,
      location: zone.location,
      description: zone.description,
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
    if (!zoneForPlan || !farmMapData) return;

    try {
      // For now, we'll store action plans in the geometry metadata
      // In a full implementation, you'd want a separate action_plans table
      const currentGeometry = zoneForPlan.geometry as ExtendedGeometry;
      const updatedGeometry: ExtendedGeometry = {
        ...currentGeometry,
        actionPlan: plan
      };

      const { data: updatedZone, error } = await riskService.updateRiskZone(
        zoneForPlan.id,
        user?.id || '',
        { geometry: updatedGeometry as unknown as Json }
      );

      if (error || !updatedZone) {
        throw new Error(error?.message || "Failed to save action plan.");
      }

      setFarmMapData(prev => prev ? {
        ...prev,
        risk_zones: prev.risk_zones.map(zone =>
          zone.id === zoneForPlan.id ? updatedZone : zone
        )
      } : null);

      toast({
        title: "Action Plan Saved",
        description: `Action plan for "${zoneForPlan.name}" has been updated.`,
      });

      closePlanModal();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save action plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleZoneClick = (zone: RiskZoneData) => {
    setSelectedZone(zone);
  };

  const handleZoneHover = (zone: RiskZoneData | null) => {
    setHoveredZone(zone);
  };

  const handleZoneSelect = (zone: RiskZoneData | null) => {
    setSelectedZone(zone);
  };

  const handleZonePositionChange = async (zoneId: string, newPosition: { x: number; y: number }) => {
    if (!farmMapData || !user) return;

    const zone = riskZones.find(z => z.id === zoneId);
    if (!zone) return;

    try {
      const currentGeometry = zone.geometry as ExtendedGeometry;
      const updatedGeometry: ExtendedGeometry = {
        ...currentGeometry,
        x: newPosition.x,
        y: newPosition.y
      };

      const { data: updatedZone, error } = await riskService.updateRiskZone(
        zoneId,
        user.id,
        { geometry: updatedGeometry as unknown as Json }
      );

      if (error || !updatedZone) {
        throw new Error(error?.message || "Failed to update zone position.");
      }

      setFarmMapData(prev => prev ? {
        ...prev,
        risk_zones: prev.risk_zones.map(z =>
          z.id === zoneId ? updatedZone : z
        )
      } : null);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update zone position. Please try again.",
        variant: "destructive"
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
    toast({
      title: "Changes Saved",
      description: "All zone position changes have been saved.",
      duration: 3000,
    });
    setIsEditMode(false);
  };

  const discardMapChanges = async () => {
    if (!farmMapData) return;

    // Reload the original data to discard changes
    await fetchFarmMap(farmMapData.id);
    setIsEditMode(false);
    
    toast({
      title: "Changes Discarded",
      description: "All unsaved position changes have been discarded.",
      duration: 3000,
    });
  };

  const openAssessmentModal = (zone: RiskZoneData) => {
    setZoneForAssessment(zone);
    setIsAssessmentModalOpen(true);
  };

  const closeAssessmentModal = () => {
    setIsAssessmentModalOpen(false);
    setZoneForAssessment(null);
  };

  const openPlanModal = (zone: RiskZoneData) => {
    setZoneForPlan(zone);
    setIsPlanModalOpen(true);
  };

  // Helper function to get geometry as ExtendedGeometry
  const getExtendedGeometry = (zone: RiskZoneData): ExtendedGeometry => {
    return zone.geometry as ExtendedGeometry;
  };

  return (
    <div className="space-y-6">
      {/* Clean header design matching previous version */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Risk Area Management</h1>
          <p className="text-muted-foreground">Define and monitor risk zones across your farm operations</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-auto">
          <TabsTrigger value="zones">Manage Zones</TabsTrigger>
          <TabsTrigger value="map">View Map</TabsTrigger>
        </TabsList>

        {/* Manage Zones Tab - Edit info/field values only */}
        <TabsContent value="zones" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Zone Information Management</h2>
              <p className="text-sm text-muted-foreground">Edit zone details and properties</p>
            </div>
            <Button onClick={openAddModal}>
              <Plus className="mr-2" size={16} />
              Add New Zone
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {riskZones.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Risk Zones Yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start by adding your first risk zone to monitor safety areas across your farm.
                  </p>
                  <Button onClick={openAddModal}>
                    <Plus className="mr-2" size={16} />
                    Add First Zone
                  </Button>
                </CardContent>
              </Card>
            ) : (
              riskZones.map((zone) => {
                const geometry = getExtendedGeometry(zone);
                // Create a normalized zone object to match the expected format
                const normalizedZone = {
                  ...zone,
                  riskLevel: zone.risk_level,
                  lastReview: zone.last_review,
                  incidentsThisYear: zone.incidents_this_year || 0,
                  actionPlan: geometry.actionPlan,
                  relatedIncidentIds: zone.incidents_this_year > 0 ? Array.from({ length: zone.incidents_this_year }, (_, i) => `incident-${zone.id}-${i}`) : []
                };
                
                return (
                  <Card key={zone.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{normalizedZone.name}</h3>
                            <Badge className={getRiskLevelBadgeColor(normalizedZone.riskLevel)}>
                              {normalizedZone.riskLevel}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{normalizedZone.category}</p>
                          <p className="text-sm mb-2">{normalizedZone.description}</p>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Location:</strong> {normalizedZone.location}
                          </p>
                          {normalizedZone.actionPlan && (
                            <div className="text-xs mt-2 p-2 bg-gray-50 rounded-md border">
                              <p className="font-semibold flex items-center gap-1.5">
                                <ClipboardList size={14} />
                                Action Plan: <span className={`font-bold ${
                                  normalizedZone.actionPlan.status === 'Completed' ? 'text-green-600' : 
                                  normalizedZone.actionPlan.status === 'In Progress' ? 'text-blue-600' : ''
                                }`}>{normalizedZone.actionPlan.status}</span>
                              </p>
                              <p className="text-muted-foreground mt-1 truncate">
                                {normalizedZone.actionPlan.details}
                              </p>
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
                            <span>Last review: {normalizedZone.lastReview ? new Date(normalizedZone.lastReview).toLocaleDateString() : 'Never'} | {normalizedZone.incidentsThisYear} incidents this year</span>
                            {normalizedZone.relatedIncidentIds && normalizedZone.relatedIncidentIds.length > 0 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="flex items-center gap-1 font-semibold text-amber-600 cursor-pointer">
                                      <AlertCircle size={14} />
                                      {normalizedZone.relatedIncidentIds.length} Incident(s)
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="p-1">
                                      <h4 className="font-bold mb-1">Recent Incidents</h4>
                                      <ul className="list-disc list-inside">
                                        {mockIncidents
                                          .filter(inc => normalizedZone.relatedIncidentIds?.includes(inc.id))
                                          .map(inc => <li key={inc.id}>{inc.title}</li>)
                                        }
                                      </ul>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Button size="sm" variant="outline" onClick={() => openAssessmentModal(zone)}>
                            <FileText className="mr-1" size={14} />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openEditModal(zone)}>
                            <Edit className="mr-1" size={14} />
                            Edit Info
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {setActiveTab('map'); setSelectedZone(zone);}}>
                            <Eye className="mr-1" size={14} />
                            View on Map
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openPlanModal(zone)}>
                            <ClipboardList className="mr-1" size={14} />
                            Manage Plan
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* View Map Tab - Edit positions only */}
        <TabsContent value="map" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Zone Position Management</h2>
              <p className="text-sm text-muted-foreground">
                {isEditMode 
                  ? "Click and drag zones to reposition them. Click save when finished." 
                  : "View and manage zone positions on the farm map"}
              </p>
            </div>
            <div className="flex gap-2">
              {!isEditMode ? (
                <>
                  <Button variant="outline" onClick={handleAddZoneToMap}>
                    <Plus className="mr-2" size={16} />
                    Add Zone to Map
                  </Button>
                  <Button onClick={toggleEditMode}>
                    <Move className="mr-2" size={16} />
                    Edit Positions
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={discardMapChanges}>
                    <RotateCcw className="mr-2" size={16} />
                    Discard Changes
                  </Button>
                  <Button onClick={saveMapChanges}>
                    <Save className="mr-2" size={16} />
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {farmMapData ? (
                <div className="relative border rounded-lg overflow-hidden">
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
                  
                  {/* Edit mode indicator */}
                  {isEditMode && (
                    <div className="absolute top-4 left-4 bg-blue-100 border border-blue-200 text-blue-800 px-3 py-1 rounded-md text-sm font-medium">
                      Edit Mode: Click and drag zones to reposition
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin size={48} className="mx-auto mb-2" />
                    <p className="font-medium">Loading Map...</p>
                    <p className="text-sm">Initializing farm layout</p>
                  </div>
                </div>
              )}
              
              {/* Selected zone info panel */}
              {selectedZone && (
                <div className="p-4 bg-blue-50 border-t border-blue-200">
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
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Category:</strong> {selectedZone.category}</p>
                      <p><strong>Location:</strong> {selectedZone.location}</p>
                    </div>
                    <div>
                      {(() => {
                        const geometry = getExtendedGeometry(selectedZone);
                        return (
                          <>
                            <p><strong>Position:</strong> ({Math.round(geometry.x || 0)}, {Math.round(geometry.y || 0)})</p>
                            <p><strong>Size:</strong> {Math.round(geometry.width || 0)} × {Math.round(geometry.height || 0)}</p>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  {!isEditMode && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {setActiveTab('zones'); openEditModal(selectedZone);}}>
                        <Edit className="mr-1" size={14} />
                        Edit Info
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openPlanModal(selectedZone)}>
                        <ClipboardList className="mr-1" size={14} />
                        Manage Plan
                      </Button>
                      <Button size="sm" onClick={toggleEditMode}>
                        <Move className="mr-1" size={14} />
                        Edit Position
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Zone Modal */}
      <Dialog open={showAddModal} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingZone ? 'Edit Risk Zone' : 'Add New Risk Zone'}
            </DialogTitle>
            <DialogDescription>
              {editingZone 
                ? 'Update the zone information. Position changes must be made in the View Map tab.'
                : 'Create a new risk zone. The zone will be added to the center of the map.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="zone-name">Zone Name *</Label>
              <Input
                id="zone-name"
                placeholder="e.g., Chemical Storage Area A"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="risk-category">Risk Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select risk category" />
                </SelectTrigger>
                <SelectContent>
                  {RISK_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="risk-level">Risk Level *</Label>
              <Select
                value={formData.risk_level}
                onValueChange={(value) => setFormData(prev => ({ ...prev, risk_level: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  {RISK_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="zone-location">Physical Location *</Label>
              <Input
                id="zone-location"
                placeholder="e.g., North paddock, near main gate"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="zone-description">Risk Description *</Label>
              <Textarea
                id="zone-description"
                placeholder="Describe the specific risks and hazards in this area..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              onClick={editingZone ? handleEditZone : handleAddZone}
              disabled={!canSubmit()}
            >
              {editingZone ? 'Update Zone' : 'Add Zone'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Plan Modal */}
      {isPlanModalOpen && zoneForPlan && (
        <ActionPlanModal
          isOpen={isPlanModalOpen}
          zone={zoneForPlan}
          onClose={closePlanModal}
          onSave={handleSavePlan}
        />
      )}

      {/* Detailed Assessment Modal */}
      {isAssessmentModalOpen && zoneForAssessment && (
        <DetailedRiskAssessmentModal
          isOpen={isAssessmentModalOpen}
          zone={zoneForAssessment}
          onClose={closeAssessmentModal}
          incidents={[]}
        />
      )}
    </div>
  );
};

export default RiskArea; 