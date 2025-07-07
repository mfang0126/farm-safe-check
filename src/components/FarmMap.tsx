import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line, Group } from 'react-konva';
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
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface FarmMapProps {
  mapData: FarmMapData;
  onZoneClick?: (zone: RiskZoneData) => void;
  onZoneHover?: (zone: RiskZoneData | null) => void;
  onZoneSelect?: (zone: RiskZoneData | null) => void;
  onZonePositionChange?: (zoneId: string, newPosition: { x: number; y: number }) => void;
  editMode?: boolean;
  className?: string;
  height?: number; // Optional - falls back to responsive calculation
  width?: number;  // Optional - falls back to responsive calculation
}

interface RiskZoneProps {
  zone: RiskZoneData;
  isSelected: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onPositionChange?: (newPosition: { x: number; y: number }) => void;
  showLabels: boolean;
  draggable: boolean;
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
  onPositionChange,
  showLabels,
  draggable
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

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const newPosition = {
      x: e.target.x(),
      y: e.target.y()
    };
    onPositionChange?.(newPosition);
  };

  // Common props for the group (handles drag and interactions)
  const groupProps = {
    x: geometry.x,
    y: geometry.y,
    draggable: draggable,
    onDragEnd: handleDragEnd,
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
    onClick: onClick,
    onTap: onClick, // for mobile
  };

  // Shape props (positioning relative to group)
  const shapeProps = {
    x: 0, // relative to group
    y: 0, // relative to group
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    opacity: opacity,
    cursor: draggable ? 'move' : 'pointer',
  };

  const renderShape = () => {
    switch (geometry.type) {
      case 'rectangle':
        return (
          <Rect
            {...shapeProps}
            width={geometry.width || 100}
            height={geometry.height || 100}
            rotation={geometry.rotation || 0}
          />
        );
      
      case 'circle':
        return (
          <Circle
            {...shapeProps}
            radius={geometry.radius || 50}
          />
        );
      
      case 'polygon':
        return (
          <Line
            {...shapeProps}
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
    
    let labelX = 0; // relative to group
    let labelY = 0; // relative to group
    
    // Position label at center of shape (relative to group)
    if (geometry.type === 'rectangle') {
      labelX = (geometry.width || 100) / 2;
      labelY = (geometry.height || 100) / 2;
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
    <Group {...groupProps}>
      {renderShape()}
      {renderLabel()}
    </Group>
  );
};

const FarmMap: React.FC<FarmMapProps> = ({ 
  mapData, 
  onZoneClick,
  onZoneHover,
  onZoneSelect,
  onZonePositionChange,
  editMode = false,
  className = '',
  height,
  width
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: width || 800,
    height: height || 600
  });
  const [interactionState, setInteractionState] = useState<MapInteractionState>({
    selectedZoneId: null,
    hoveredZoneId: null,
    isDrawing: false,
    drawingMode: 'select',
    zoom: 1,
    panOffset: { x: 0, y: 0 }
  });

  // Handle responsive resizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        // Ensure minimum dimensions to prevent Konva from rendering with 0 size
        const minWidth = 400;
        const minHeight = 300;
        
        const newWidth = width || Math.max(containerRect.width || minWidth, minWidth);
        const newHeight = height || Math.max(
          containerRect.height || Math.min(containerRect.width * 0.6, 600),
          minHeight
        );
        
        setDimensions({
          width: newWidth,
          height: newHeight
        });
      }
    };

    // Initial size calculation with a small delay to ensure container is rendered
    const timeoutId = setTimeout(updateDimensions, 10);

    // Set up ResizeObserver for responsive updates
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also listen to window resize as fallback
    window.addEventListener('resize', updateDimensions);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [width, height]);

  // Disable mouse wheel scroll on the page when hovering over the map
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (containerRef.current && containerRef.current.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    // Add wheel event listener to document to prevent page scrolling
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

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

  // Handle zoom with buttons
  const handleZoomIn = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const newScale = Math.min(5, oldScale * 1.2);
    
    // Zoom towards center
    const stageWidth = stage.width();
    const stageHeight = stage.height();
    const centerX = stageWidth / 2;
    const centerY = stageHeight / 2;
    
    const mousePointTo = {
      x: (centerX - stage.x()) / oldScale,
      y: (centerY - stage.y()) / oldScale,
    };

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: centerX - mousePointTo.x * newScale,
      y: centerY - mousePointTo.y * newScale,
    };
    
    stage.position(newPos);
    
    setInteractionState(prev => ({
      ...prev,
      zoom: newScale,
      panOffset: newPos
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const newScale = Math.max(0.1, oldScale / 1.2);
    
    // Zoom towards center
    const stageWidth = stage.width();
    const stageHeight = stage.height();
    const centerX = stageWidth / 2;
    const centerY = stageHeight / 2;
    
    const mousePointTo = {
      x: (centerX - stage.x()) / oldScale,
      y: (centerY - stage.y()) / oldScale,
    };

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: centerX - mousePointTo.x * newScale,
      y: centerY - mousePointTo.y * newScale,
    };
    
    stage.position(newPos);
    
    setInteractionState(prev => ({
      ...prev,
      zoom: newScale,
      panOffset: newPos
    }));
  }, []);

  const handleResetZoom = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    stage.scale({ x: 1, y: 1 });
    stage.position({ x: 0, y: 0 });
    
    setInteractionState(prev => ({
      ...prev,
      zoom: 1,
      panOffset: { x: 0, y: 0 }
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
          stroke="#e5e7eb"
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
          stroke="#e5e7eb"
          strokeWidth={0.5}
          listening={false}
        />
      );
    }
    
    return lines;
  };

  // Render farm boundary with new background color
  const renderFarmBoundary = () => (
    <Rect
      x={0}
      y={0}
      width={mapData.bounds.width}
      height={mapData.bounds.height}
      stroke="#64748b"
      strokeWidth={2}
      fill="rgba(148, 163, 184, 0.15)" // slate-400 with low opacity - blue-gray background
      listening={false}
    />
  );

  return (
    <div 
      ref={containerRef}
      className={`farm-map-container w-full relative ${className}`}
      style={{ minHeight: '400px' }}
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleStageClick}
        onTap={handleStageClick}
        draggable={!editMode}
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
                onPositionChange={(newPosition) => onZonePositionChange?.(zone.id, newPosition)}
                showLabels={mapData.config.showLabels}
                draggable={editMode}
              />
            ))}
        </Layer>
      </Stage>
      
      {/* Zoom controls at bottom right */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <div className="bg-gray-50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-300 p-1">
          <div className="flex flex-row gap-1 items-center">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleZoomOut}
              className="h-8 w-8 p-0 hover:bg-gray-200 text-gray-700"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </Button>
            <div className="text-xs text-center text-gray-700 py-1 px-2 min-w-[60px] font-medium">
              {Math.round(interactionState.zoom * 100)}%
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleZoomIn}
              className="h-8 w-8 p-0 hover:bg-gray-200 text-gray-700"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleResetZoom}
              className="h-8 w-8 p-0 hover:bg-gray-200 border-l border-gray-300 text-gray-700 ml-1"
              title="Reset Zoom"
            >
              <RotateCcw size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      {mapData.config.showLegend && (
        <div className="absolute top-2 right-2 bg-slate-100 backdrop-blur-sm rounded-lg shadow-lg border border-slate-300 p-3">
          <div className="text-sm font-semibold mb-2 text-slate-800">Risk Levels</div>
          {Object.entries(RISK_LEVEL_STYLES).map(([level, style]) => (
            <div key={level} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded border"
                style={{ 
                  backgroundColor: style.color,
                  borderColor: style.strokeColor 
                }}
              />
              <span className="text-xs text-slate-700">{level}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmMap;
export { AddRiskZoneModal }; 