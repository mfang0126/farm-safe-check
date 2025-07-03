import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line } from 'react-konva';
import Konva from 'konva';
import { 
  FarmMapData, 
  RiskZoneData, 
  MapInteractionState, 
  RISK_LEVEL_STYLES,
  RiskZoneGeometry 
} from '@/types/farmMap';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface FarmMapProps {
  mapData: FarmMapData;
  onZoneClick?: (zone: RiskZoneData) => void;
  onZoneHover?: (zone: RiskZoneData | null) => void;
  onZoneSelect?: (zone: RiskZoneData | null) => void;
  className?: string;
  height?: number;
  width?: number;
}

interface RiskZoneProps {
  zone: RiskZoneData;
  isSelected: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  showLabels: boolean;
}

// Risk categories as specified by user
const RISK_CATEGORIES = [
  "Loading & Unloading Operations",
  "Machinery & Equipment Areas", 
  "Livestock Handling Areas",
  "Storage & Processing Facilities",
  "Environmental & Weather Hazards"
];

const RISK_LEVELS = ["Low", "Medium", "High", "Critical"];

interface AddRiskZoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onZoneAdded: (zone: RiskZoneData) => void;
}

const AddRiskZoneModal: React.FC<AddRiskZoneModalProps> = ({
  open,
  onOpenChange,
  onZoneAdded
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    riskLevel: '',
    location: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      riskLevel: '',
      location: '',
      description: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const canSubmit = () => {
    return formData.name.trim() && 
           formData.category && 
           formData.riskLevel && 
           formData.location.trim() && 
           formData.description.trim();
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;

    setLoading(true);
    try {
      const now = new Date().toISOString();
      const zoneId = `zone-${Date.now()}`;
      // Generate a simple ID and random position for demo
      const newZone: RiskZoneData = {
        id: zoneId,
        name: formData.name,
        category: formData.category,
        riskLevel: formData.riskLevel as 'Low' | 'Medium' | 'High' | 'Critical',
        location: formData.location,
        description: formData.description,
        created_at: now,
        updated_at: now,
        user_id: 'current-user', // Replace with actual user ID
        lastReview: now,
        incidentsThisYear: 0,
        isActive: true,
        geometry: {
          id: `geo-${zoneId}`,
          name: formData.name,
          type: 'rectangle',
          // Random position within farm bounds for demo
          x: 100 + Math.random() * 300,
          y: 100 + Math.random() * 200,
          width: 80 + Math.random() * 40,
          height: 60 + Math.random() * 30,
          rotation: 0
        }
      };

      onZoneAdded(newZone);
      
      toast({
        title: "Risk Zone Added",
        description: `"${formData.name}" has been added successfully.`,
      });
      
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add risk zone. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Risk Zone</DialogTitle>
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
              placeholder="e.g., North-East Sector, Building 3"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description & Hazards *</Label>
            <Textarea
              id="description"
              placeholder="Describe the specific risks, hazards, and safety concerns for this zone..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit() || loading}
          >
            {loading ? 'Adding...' : 'Add Zone'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const RiskZone: React.FC<RiskZoneProps> = ({ 
  zone, 
  isSelected, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave, 
  onClick,
  showLabels 
}) => {
  const style = RISK_LEVEL_STYLES[zone.riskLevel];
  const geometry = zone.geometry;
  
  // Determine colors based on state
  const fillColor = isSelected 
    ? style.selectedColor 
    : isHovered 
      ? style.hoverColor 
      : zone.color || style.color;
  
  const strokeColor = isSelected || isHovered ? style.strokeColor : style.strokeColor;
  const strokeWidth = isSelected || isHovered ? style.strokeWidth + 1 : style.strokeWidth;
  const opacity = zone.opacity || style.opacity;

  const commonProps = {
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    opacity: opacity,
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
    onClick: onClick,
    onTap: onClick, // for mobile
    cursor: 'pointer',
  };

  const renderShape = () => {
    switch (geometry.type) {
      case 'rectangle':
        return (
          <Rect
            {...commonProps}
            x={geometry.x}
            y={geometry.y}
            width={geometry.width || 100}
            height={geometry.height || 100}
            rotation={geometry.rotation || 0}
          />
        );
      
      case 'circle':
        return (
          <Circle
            {...commonProps}
            x={geometry.x}
            y={geometry.y}
            radius={geometry.radius || 50}
          />
        );
      
      case 'polygon':
        return (
          <Line
            {...commonProps}
            points={geometry.points || []}
            closed={true}
          />
        );
      
      default:
        return null;
    }
  };

  const renderLabel = () => {
    if (!showLabels) return null;
    
    let labelX = geometry.x;
    let labelY = geometry.y;
    
    // Position label at center of shape
    if (geometry.type === 'rectangle') {
      labelX += (geometry.width || 100) / 2;
      labelY += (geometry.height || 100) / 2;
    } else if (geometry.type === 'circle') {
      // labelX and labelY are already center for circles
    }

    return (
      <Text
        x={labelX}
        y={labelY}
        text={zone.name}
        fontSize={12}
        fontFamily="Arial"
        fill="white"
        stroke="black"
        strokeWidth={0.3}
        align="center"
        offsetX={zone.name.length * 3} // rough centering
        offsetY={6}
        listening={false} // don't interfere with zone clicks
      />
    );
  };

  return (
    <>
      {renderShape()}
      {renderLabel()}
    </>
  );
};

const FarmMap: React.FC<FarmMapProps> = ({ 
  mapData, 
  onZoneClick,
  onZoneHover,
  onZoneSelect,
  className = '',
  height = 500,
  width = 800
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [interactionState, setInteractionState] = useState<MapInteractionState>({
    selectedZoneId: null,
    hoveredZoneId: null,
    isDrawing: false,
    drawingMode: 'select',
    zoom: 1,
    panOffset: { x: 0, y: 0 }
  });

  // Handle zone interactions
  const handleZoneClick = useCallback((zone: RiskZoneData) => {
    setInteractionState(prev => ({
      ...prev,
      selectedZoneId: zone.id === prev.selectedZoneId ? null : zone.id
    }));
    
    onZoneClick?.(zone);
    onZoneSelect?.(zone.id === interactionState.selectedZoneId ? null : zone);
  }, [onZoneClick, onZoneSelect, interactionState.selectedZoneId]);

  const handleZoneMouseEnter = useCallback((zone: RiskZoneData) => {
    setInteractionState(prev => ({ ...prev, hoveredZoneId: zone.id }));
    onZoneHover?.(zone);
  }, [onZoneHover]);

  const handleZoneMouseLeave = useCallback(() => {
    setInteractionState(prev => ({ ...prev, hoveredZoneId: null }));
    onZoneHover?.(null);
  }, [onZoneHover]);

  // Handle stage clicks (deselect zones when clicking empty space)
  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    // Check if we clicked on the stage itself (not on a shape)
    if (e.target === e.target.getStage()) {
      setInteractionState(prev => ({ ...prev, selectedZoneId: null }));
      onZoneSelect?.(null);
    }
  }, [onZoneSelect]);

  // Handle zoom with mouse wheel
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // Zoom speed
    const scaleBy = 1.05;
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    // Limit zoom levels
    const clampedScale = Math.max(0.1, Math.min(5, newScale));

    stage.scale({ x: clampedScale, y: clampedScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };
    
    stage.position(newPos);
    
    setInteractionState(prev => ({
      ...prev,
      zoom: clampedScale,
      panOffset: newPos
    }));
  }, []);

  // Render grid if enabled
  const renderGrid = () => {
    if (!mapData.config.showGrid) return null;
    
    const gridSize = mapData.config.gridSize;
    const lines = [];
    
    // Vertical lines
    for (let i = 0; i <= mapData.bounds.width; i += gridSize) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i, 0, i, mapData.bounds.height]}
          stroke="#e5e5e5"
          strokeWidth={0.5}
          listening={false}
        />
      );
    }
    
    // Horizontal lines
    for (let i = 0; i <= mapData.bounds.height; i += gridSize) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, i, mapData.bounds.width, i]}
          stroke="#e5e5e5"
          strokeWidth={0.5}
          listening={false}
        />
      );
    }
    
    return lines;
  };

  // Render farm boundary
  const renderFarmBoundary = () => (
    <Rect
      x={0}
      y={0}
      width={mapData.bounds.width}
      height={mapData.bounds.height}
      stroke="#94a3b8"
      strokeWidth={2}
      fill="rgba(34, 197, 94, 0.1)" // light green background
      listening={false}
    />
  );

  return (
    <div className={`farm-map-container ${className}`}>
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onWheel={handleWheel}
        draggable={true}
      >
        <Layer>
          {/* Farm boundary */}
          {renderFarmBoundary()}
          
          {/* Grid */}
          {renderGrid()}
          
          {/* Risk zones */}
          {mapData.riskZones
            .filter(zone => zone.isActive)
            .map(zone => (
              <RiskZone
                key={zone.id}
                zone={zone}
                isSelected={interactionState.selectedZoneId === zone.id}
                isHovered={interactionState.hoveredZoneId === zone.id}
                onMouseEnter={() => handleZoneMouseEnter(zone)}
                onMouseLeave={handleZoneMouseLeave}
                onClick={() => handleZoneClick(zone)}
                showLabels={mapData.config.showLabels}
              />
            ))}
        </Layer>
      </Stage>
      
      {/* Map controls UI overlay */}
      <div className="absolute top-2 left-2 bg-white rounded-lg shadow-sm p-2 text-xs">
        <div>Zoom: {Math.round(interactionState.zoom * 100)}%</div>
        <div className="text-gray-500">Scroll to zoom, drag to pan</div>
      </div>
      
      {/* Legend */}
      {mapData.config.showLegend && (
        <div className="absolute top-2 right-2 bg-white rounded-lg shadow-sm p-3">
          <div className="text-sm font-semibold mb-2">Risk Levels</div>
          {Object.entries(RISK_LEVEL_STYLES).map(([level, style]) => (
            <div key={level} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded border"
                style={{ 
                  backgroundColor: style.color,
                  borderColor: style.strokeColor 
                }}
              />
              <span className="text-xs">{level}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmMap;
export { AddRiskZoneModal }; 