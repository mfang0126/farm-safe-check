import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Move,
  Save,
  RotateCcw,
  MapPin,
  Edit,
  ClipboardList
} from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import FarmMap from '@/components/FarmMap';

type RiskZoneData = Tables<'risk_zones'>;
type FarmMapData = Tables<'farm_maps'> & { risk_zones: RiskZoneData[] };

interface ExtendedGeometry {
  id?: string;
  name?: string;
  type?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
}

interface MapManagementTabProps {
  farmMapData: FarmMapData | null;
  selectedZone: RiskZoneData | null;
  hoveredZone: RiskZoneData | null;
  isEditMode: boolean;
  draggedZoneId: string | null;
  onAddZoneToMap: () => void;
  onToggleEditMode: () => void;
  onSaveChanges: () => void;
  onDiscardChanges: () => void;
  onZoneClick: (zone: RiskZoneData) => void;
  onZoneHover: (zone: RiskZoneData | null) => void;
  onZoneSelect: (zone: RiskZoneData | null) => void;
  onZonePositionChange: (zoneId: string, newPosition: { x: number; y: number }) => void;
  onEditZone: (zone: RiskZoneData) => void;
  onManagePlan: (zone: RiskZoneData) => void;
  setDraggedZoneId: (id: string | null) => void;
}

export const MapManagementTab = ({
  farmMapData,
  selectedZone,
  hoveredZone,
  isEditMode,
  draggedZoneId,
  onAddZoneToMap,
  onToggleEditMode,
  onSaveChanges,
  onDiscardChanges,
  onZoneClick,
  onZoneHover,
  onZoneSelect,
  onZonePositionChange,
  onEditZone,
  onManagePlan,
  setDraggedZoneId
}: MapManagementTabProps) => {
  const getRiskLevelBadgeColor = (level: string | null) => {
    switch (level) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100';
    }
  };

  const getExtendedGeometry = (zone: RiskZoneData): ExtendedGeometry => {
    return zone.geometry as ExtendedGeometry;
  };

  return (
    <div className="space-y-6">
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
              <Button variant="outline" onClick={onAddZoneToMap}>
                <Plus className="mr-2" size={16} />
                Add Zone to Map
              </Button>
              <Button onClick={onToggleEditMode}>
                <Move className="mr-2" size={16} />
                Edit Positions
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onDiscardChanges}>
                <RotateCcw className="mr-2" size={16} />
                Discard Changes
              </Button>
              <Button onClick={onSaveChanges}>
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
                onZoneClick={onZoneClick}
                onZoneHover={onZoneHover}
                onZoneSelect={onZoneSelect}
                isEditMode={isEditMode}
                onZonePositionChange={onZonePositionChange}
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
                  onClick={() => onZoneSelect(null)}
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
                  <Button size="sm" variant="outline" onClick={() => onEditZone(selectedZone)}>
                    <Edit className="mr-1" size={14} />
                    Edit Info
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onManagePlan(selectedZone)}>
                    <ClipboardList className="mr-1" size={14} />
                    Manage Plan
                  </Button>
                  <Button size="sm" onClick={onToggleEditMode}>
                    <Move className="mr-1" size={14} />
                    Edit Position
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 