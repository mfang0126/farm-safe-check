import { useState, useEffect } from 'react';
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
import { FarmMapData, RiskZoneData, createMockFarmMapData, ActionPlan } from '@/types/farmMap';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus,
  Edit,
  Eye,
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

// Risk zone form data interface
interface RiskZoneFormData {
  name: string;
  category: string;
  riskLevel: string;
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

  // Form state for adding/editing zones
  const [formData, setFormData] = useState<RiskZoneFormData>({
    name: '',
    category: '',
    riskLevel: '',
    location: '',
    description: ''
  });

  // Initialize farm map data
  useEffect(() => {
    if (user) {
      const mockData = createMockFarmMapData(user.id);
      setFarmMapData(mockData);
    }
  }, [user]);

  // Get risk zones from farm map data
  const riskZones = farmMapData?.riskZones || [];

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-500 hover:bg-red-600';
      case 'High': return 'bg-orange-500 hover:bg-orange-600';
      case 'Medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Low': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getRiskLevelBadgeColor = (level: string) => {
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
      riskLevel: '',
      location: '',
      description: ''
    });
    setEditingZone(null);
  };

  const canSubmit = () => {
    return formData.name.trim() && 
           formData.category && 
           formData.riskLevel && 
           formData.location.trim() && 
           formData.description.trim();
  };

  const handleAddZone = async () => {
    if (!canSubmit() || !farmMapData) return;

    try {
      const now = new Date().toISOString();
      const zoneId = `zone-${Date.now()}`;
      
      const newZone: RiskZoneData = {
        id: zoneId,
        name: formData.name,
        category: formData.category,
        riskLevel: formData.riskLevel as 'Low' | 'Medium' | 'High' | 'Critical',
        location: formData.location,
        description: formData.description,
        created_at: now,
        updated_at: now,
        user_id: user?.id || 'current-user',
        lastReview: now,
        incidentsThisYear: 0,
        isActive: true,
        geometry: {
          id: `geo-${zoneId}`,
          name: formData.name,
          type: 'rectangle',
          // Add to center of map as requested
          x: (farmMapData.bounds.width / 2) - 50,
          y: (farmMapData.bounds.height / 2) - 40,
          width: 100,
          height: 80,
          rotation: 0
        }
      };

      setFarmMapData({
        ...farmMapData,
        riskZones: [...farmMapData.riskZones, newZone]
      });

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
    if (!canSubmit() || !editingZone || !farmMapData) return;

    try {
      const updatedZones = farmMapData.riskZones.map(zone => 
        zone.id === editingZone.id 
          ? {
              ...zone,
              name: formData.name,
              category: formData.category,
              riskLevel: formData.riskLevel as 'Low' | 'Medium' | 'High' | 'Critical',
              location: formData.location,
              description: formData.description,
              updated_at: new Date().toISOString(),
              geometry: {
                ...zone.geometry,
                name: formData.name
              }
            }
          : zone
      );

      setFarmMapData({
        ...farmMapData,
        riskZones: updatedZones
      });

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

  const openEditModal = (zone: RiskZoneData) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      category: zone.category,
      riskLevel: zone.riskLevel,
      location: zone.location,
      description: zone.description
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

  const openPlanModal = (zone: RiskZoneData) => {
    setZoneForPlan(zone);
    setIsPlanModalOpen(true);
  };

  const closePlanModal = () => {
    setZoneForPlan(null);
    setIsPlanModalOpen(false);
  };

  const handleSavePlan = (plan: ActionPlan) => {
    if (!zoneForPlan || !farmMapData) return;

    const updatedZones = farmMapData.riskZones.map(zone =>
      zone.id === zoneForPlan.id
        ? { ...zone, actionPlan: plan, updated_at: new Date().toISOString() }
        : zone
    );

    setFarmMapData({
      ...farmMapData,
      riskZones: updatedZones
    });

    toast({
      title: "Action Plan Saved",
      description: `The action plan for "${zoneForPlan.name}" has been updated.`,
    });
  };

  // Map interaction handlers
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

  const handleZonePositionChange = (zoneId: string, newPosition: { x: number; y: number }) => {
    if (!farmMapData) return;
    
    const updatedZones = farmMapData.riskZones.map(zone => 
      zone.id === zoneId 
        ? {
            ...zone,
            geometry: {
              ...zone.geometry,
              x: newPosition.x,
              y: newPosition.y
            }
          }
        : zone
    );

    setFarmMapData({
      ...farmMapData,
      riskZones: updatedZones
    });
  };

  const handleAddZoneToMap = () => {
    // Switch to manage zones tab to open modal
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

  const discardMapChanges = () => {
    // Reset to original positions (in a real app, we'd reload from database)
    if (user) {
      const mockData = createMockFarmMapData(user.id);
      setFarmMapData(mockData);
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
      {/* Clean header design matching Maintenance page */}
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
              riskZones.map((zone) => (
                <Card key={zone.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{zone.name}</h3>
                          <Badge className={getRiskLevelBadgeColor(zone.riskLevel)}>
                            {zone.riskLevel}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{zone.category}</p>
                        <p className="text-sm mb-2">{zone.description}</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Location:</strong> {zone.location}
                        </p>
                        {zone.actionPlan && (
                          <div className="text-xs mt-2 p-2 bg-gray-50 rounded-md border">
                            <p className="font-semibold flex items-center gap-1.5">
                              <ClipboardList size={14} />
                              Action Plan: <span className={`font-bold ${
                                zone.actionPlan.status === 'Completed' ? 'text-green-600' : 
                                zone.actionPlan.status === 'In Progress' ? 'text-blue-600' : ''
                              }`}>{zone.actionPlan.status}</span>
                            </p>
                            <p className="text-muted-foreground mt-1 truncate">
                              {zone.actionPlan.details}
                            </p>
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
                          <span>Last review: {new Date(zone.lastReview).toLocaleDateString()} | {zone.incidentsThisYear} incidents this year</span>
                          {zone.relatedIncidentIds && zone.relatedIncidentIds.length > 0 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex items-center gap-1 font-semibold text-amber-600 cursor-pointer">
                                    <AlertCircle size={14} />
                                    {zone.relatedIncidentIds.length} Incident(s)
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="p-1">
                                    <h4 className="font-bold mb-1">Recent Incidents</h4>
                                    <ul className="list-disc list-inside">
                                      {mockIncidents
                                        .filter(inc => zone.relatedIncidentIds?.includes(inc.id))
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
              ))
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
                    mapData={farmMapData}
                    onZoneClick={handleZoneClick}
                    onZoneHover={handleZoneHover}
                    onZoneSelect={handleZoneSelect}
                    onZonePositionChange={handleZonePositionChange}
                    editMode={isEditMode}
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
                      <Badge className={getRiskLevelBadgeColor(selectedZone.riskLevel)}>
                        {selectedZone.riskLevel}
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
                      <p><strong>Position:</strong> ({Math.round(selectedZone.geometry.x)}, {Math.round(selectedZone.geometry.y)})</p>
                      <p><strong>Size:</strong> {Math.round(selectedZone.geometry.width || 0)} × {Math.round(selectedZone.geometry.height || 0)}</p>
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
                value={formData.riskLevel}
                onValueChange={(value) => setFormData(prev => ({ ...prev, riskLevel: value }))}
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
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., North paddock, near main gate"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the risk factors and safety concerns..."
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
      {zoneForPlan && (
        <ActionPlanModal 
          isOpen={isPlanModalOpen}
          onClose={closePlanModal}
          onSave={handleSavePlan}
          zoneName={zoneForPlan.name}
          actionPlan={zoneForPlan.actionPlan}
        />
      )}

      {/* Detailed Risk Assessment Modal */}
      <DetailedRiskAssessmentModal 
        isOpen={isAssessmentModalOpen}
        onClose={closeAssessmentModal}
        zone={zoneForAssessment}
        incidents={mockIncidents}
      />
    </div>
  );
};

export default RiskArea; 