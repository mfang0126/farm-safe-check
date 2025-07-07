import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line, Group, Transformer } from 'react-konva';
import Konva from 'konva';
import { Tables } from '@/integrations/supabase/types';
import { RISK_LEVEL_STYLES } from '@/types/farmMap';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type RiskZoneData = Tables<'risk_zones'>;
type FarmMapData = Tables<'farm_maps'> & { risk_zones: RiskZoneData[] };

interface FarmMapProps {
  farmMapData: FarmMapData;
  selectedZoneId: string | null;
  hoveredZoneId: string | null;
  onZoneClick: (zone: RiskZoneData) => void;
  onZoneHover: (zone: RiskZoneData | null) => void;
  onZoneSelect: (zone: RiskZoneData | null) => void;
  onZonePositionChange: (zoneId: string, newPosition: { x: number; y: number }) => void;
  onZoneGeometryChange?: (zoneId: string, newGeometry: { x: number; y: number; width?: number; height?: number; radius?: number }) => void;
  onZoneDelete?: (zoneId: string) => void;
  isEditMode: boolean;
  draggedZoneId: string | null;
  setDraggedZoneId: (id: string | null) => void;
  className?: string;
}

interface RiskZoneProps {
  zone: RiskZoneData;
  isSelected: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onPositionChange?: (newPosition: { x: number; y: number }) => void;
  onGeometryChange?: (newGeometry: { x: number; y: number; width?: number; height?: number; radius?: number }) => void;
  showLabels: boolean;
  draggable: boolean;
  isEditMode: boolean;
}

const RiskZone: React.FC<RiskZoneProps> = ({ 
  zone, 
  isSelected, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave, 
  onClick,
  onPositionChange,
  onGeometryChange,
  showLabels,
  draggable,
  isEditMode
}) => {
  const groupRef = useRef<Konva.Group>(null);
  const rectRef = useRef<Konva.Rect>(null);
  const circleRef = useRef<Konva.Circle>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [currentSize, setCurrentSize] = useState({ width: 0, height: 0, radius: 0 });
  const riskLevel = zone.risk_level || 'Low';
  const style = RISK_LEVEL_STYLES[riskLevel];
  
  const geometry = zone.geometry as {
    id: string;
    name: string;
    type: 'rectangle' | 'circle' | 'polygon';
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    points?: number[];
    rotation?: number;
  } | null;

  const { x, y, width, height, radius, type, rotation } = geometry || { x: 0, y: 0, width: 0, height: 0, radius: 0, type: 'rectangle' as const, rotation: 0 };

  // Initialize current position and size from geometry
  useEffect(() => {
    if (geometry) {
      setCurrentPosition({ x, y });
      setCurrentSize({ 
        width: width || 0, 
        height: height || 0, 
        radius: radius || 0 
      });
    }
  }, [geometry, x, y, width, height, radius]);

  // Attach transformer when selected
  useEffect(() => {
    if (isSelected && isEditMode && trRef.current) {
      const shapeNode = type === 'rectangle' ? rectRef.current : circleRef.current;
      if (shapeNode) {
        trRef.current.nodes([shapeNode]);
        trRef.current.getLayer()?.batchDraw();
      }
    }
  }, [isSelected, isEditMode, type]);

  if (!geometry) {
    return null;
  }

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    // Update current position during drag so labels follow
    setCurrentPosition({
      x: e.target.x(),
      y: e.target.y()
    });
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const newPos = {
      x: e.target.x(),
      y: e.target.y()
    };
    setCurrentPosition(newPos);
    if (onPositionChange) {
      onPositionChange(newPos);
    }
  };

  const handleTransformEnd = () => {
    const shapeNode = type === 'rectangle' ? rectRef.current : circleRef.current;
    if (!shapeNode || !onGeometryChange) return;

    const scaleX = shapeNode.scaleX();
    const scaleY = shapeNode.scaleY();

    console.log('=== RESIZE EVENT START ===');
    console.log('Zone:', zone.name, '| Zone ID:', zone.id);
    console.log('Shape Type:', type);
    console.log('Scale X:', scaleX, '| Scale Y:', scaleY);
    console.log('Current Group Position:', currentPosition);
    console.log('Shape Position (relative to group):', { x: shapeNode.x(), y: shapeNode.y() });
    console.log('Original Dimensions:', { width, height, radius });

    // Reset scale back to 1
    shapeNode.scaleX(1);
    shapeNode.scaleY(1);

    // Reset shape position to (0,0) within the group - this is key!
    shapeNode.x(0);
    shapeNode.y(0);

    // Keep the group's position unchanged during resize - only change dimensions
    const newGeometry: { x: number; y: number; width?: number; height?: number; radius?: number } = {
      x: currentPosition.x,
      y: currentPosition.y
    };

    if (type === 'rectangle') {
      // Calculate new dimensions based on scale
      const newWidth = Math.max(20, (width || 100) * scaleX);
      const newHeight = Math.max(20, (height || 80) * scaleY);
      
      newGeometry.width = newWidth;
      newGeometry.height = newHeight;

      console.log('NEW Rectangle Dimensions:', { 
        x: currentPosition.x, 
        y: currentPosition.y, 
        width: newWidth, 
        height: newHeight 
      });

      setCurrentSize({ ...currentSize, width: newWidth, height: newHeight });
    } else if (type === 'circle') {
      // For circles, use the average of scaleX and scaleY
      const newRadius = Math.max(10, (radius || 50) * Math.max(scaleX, scaleY));
      
      newGeometry.radius = newRadius;

      console.log('NEW Circle Dimensions:', { 
        x: currentPosition.x, 
        y: currentPosition.y, 
        radius: newRadius 
      });

      setCurrentSize({ ...currentSize, radius: newRadius });
    }

    console.log('Final Geometry Object:', newGeometry);
    console.log('Position should remain at:', currentPosition);
    console.log('=== RESIZE EVENT END ===');

    // Don't update currentPosition - it should stay the same during resize
    onGeometryChange(newGeometry);
  };

  const commonProps = {
    x: 0, // Relative to group
    y: 0, // Relative to group
    rotation: rotation || 0,
    fill: isSelected ? style.selectedColor : isHovered ? style.hoverColor : style.color,
    stroke: style.strokeColor,
    strokeWidth: style.strokeWidth,
    opacity: style.opacity,
    shadowColor: 'black',
    shadowBlur: isHovered ? 10 : 0,
    shadowOpacity: 0.3,
    onMouseEnter,
    onMouseLeave,
    onClick,
    listening: true,
    onTransformEnd: handleTransformEnd,
  };

  const renderShape = () => {
    switch (type) {
      case 'rectangle':
        return <Rect {...commonProps} ref={rectRef} width={currentSize.width} height={currentSize.height} />;
      case 'circle':
        return <Circle {...commonProps} ref={circleRef} radius={currentSize.radius} />;
      default:
        return null;
    }
  };

  const renderLabel = () => {
    if (!showLabels) return null;
    
    // Position label relative to the group, so it moves with the shape
    const labelX = type === 'rectangle' ? currentSize.width / 2 : 0;
    const labelY = -20; // Above the shape

    return (
      <Text
        x={labelX}
        y={labelY}
        text={zone.name}
        fontSize={14}
        fill="#333"
        fontStyle="bold"
        align="center"
        verticalAlign="middle"
        listening={false} // Label should not interfere with events
      />
    );
  };

  return (
    <>
      <Group
        ref={groupRef}
        x={currentPosition.x}
        y={currentPosition.y}
        draggable={draggable}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        {renderShape()}
        {renderLabel()}
      </Group>
      {isSelected && isEditMode && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize - prevent shapes from becoming too small
            const minSize = type === 'circle' ? 20 : 40;
            if (Math.abs(newBox.width) < minSize || Math.abs(newBox.height) < minSize) {
              return oldBox;
            }
            return newBox;
          }}
          anchorStroke="#2563eb"
          anchorFill="#2563eb"
          anchorSize={8}
          borderStroke="#2563eb"
          borderDash={[2, 2]}
        />
      )}
    </>
  );
};

const FarmMap: React.FC<FarmMapProps> = ({ 
  farmMapData,
  selectedZoneId,
  hoveredZoneId,
  onZoneClick,
  onZoneHover,
  onZoneSelect,
  onZonePositionChange,
  onZoneGeometryChange,
  onZoneDelete,
  isEditMode,
  draggedZoneId,
  setDraggedZoneId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [stage, setStage] = useState({ scale: 1, x: 0, y: 0 });

  const mapBounds = farmMapData.bounds as { width: number; height: number, scale: number} || { width: 800, height: 600, scale: 1 };
  const riskZones = farmMapData.risk_zones;
  const config = farmMapData.config as { showGrid: boolean, gridSize: number, snapToGrid: boolean, showLabels: boolean };
  
  // Keyboard event handler for deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedZoneId && onZoneDelete && isEditMode) {
          e.preventDefault();
          onZoneDelete(selectedZoneId);
        }
      }
    };

    // Only add event listener when component is focused and we have a selected zone
    if (selectedZoneId && onZoneDelete && isEditMode) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedZoneId, onZoneDelete, isEditMode]);
  
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
      updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Center the farm map when dimensions or mapBounds change
  useEffect(() => {
    const centerMap = () => {
      const canvasCenterX = dimensions.width / 2;
      const canvasCenterY = dimensions.height / 2;
      
      const farmCenterX = mapBounds.width / 2;
      const farmCenterY = mapBounds.height / 2;
      
      const offsetX = canvasCenterX - farmCenterX;
      const offsetY = canvasCenterY - farmCenterY;
      
      setStage(prevStage => ({
        ...prevStage,
        x: offsetX,
        y: offsetY
      }));
    };

    // Only center if we have valid dimensions and the stage hasn't been manually moved
    if (dimensions.width > 0 && dimensions.height > 0 && stage.x === 0 && stage.y === 0) {
      centerMap();
    }
  }, [dimensions, mapBounds, stage.x, stage.y]);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    setStage({
      scale: newScale,
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Deselect if clicking on the stage background
    if (e.target === e.target.getStage()) {
      onZoneSelect(null);
    }
  };

  const resetZoomAndPan = () => {
    const canvasCenterX = dimensions.width / 2;
    const canvasCenterY = dimensions.height / 2;
    
    const farmCenterX = mapBounds.width / 2;
    const farmCenterY = mapBounds.height / 2;
    
    const offsetX = canvasCenterX - farmCenterX;
    const offsetY = canvasCenterY - farmCenterY;
    
    setStage({ scale: 1, x: offsetX, y: offsetY });
  };

  const renderGrid = () => {
    if (!config.showGrid) return null;
    const lines = [];
    for (let i = 0; i < mapBounds.width / config.gridSize; i++) {
      lines.push(
        <Line
          key={`v${i}`}
          points={[Math.round(i * config.gridSize) + 0.5, 0, Math.round(i * config.gridSize) + 0.5, mapBounds.height]}
          stroke="#ddd"
          strokeWidth={1}
          opacity={0.3}
          listening={false}
        />
      );
    }
    for (let i = 0; i < mapBounds.height / config.gridSize; i++) {
      lines.push(
        <Line
          key={`h${i}`}
          points={[0, Math.round(i * config.gridSize) + 0.5, mapBounds.width, Math.round(i * config.gridSize) + 0.5]}
          stroke="#ddd"
          strokeWidth={1}
          opacity={0.3}
          listening={false}
        />
      );
    }
    return lines;
  };

  const renderFarmBoundary = () => (
    <Rect
      x={0}
      y={0}
      width={mapBounds.width}
      height={mapBounds.height}
      stroke="black"
      strokeWidth={2}
      listening={false}
    />
  );

  return (
    <div ref={containerRef} className="w-full h-full relative bg-gray-100 dark:bg-gray-800">
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleStageClick}
        scaleX={stage.scale}
        scaleY={stage.scale}
        x={stage.x}
        y={stage.y}
        draggable
      >
        <Layer>
          {renderGrid()}
          {renderFarmBoundary()}
          {riskZones.map(zone => (
              <RiskZone
                key={zone.id}
                zone={zone}
                isSelected={zone.id === selectedZoneId}
                isHovered={zone.id === hoveredZoneId}
                onMouseEnter={() => onZoneHover(zone)}
                onMouseLeave={() => onZoneHover(null)}
                onClick={() => onZoneClick(zone)}
                onPositionChange={(pos) => onZonePositionChange(zone.id, pos)}
                onGeometryChange={(geometry) => onZoneGeometryChange?.(zone.id, geometry)}
                showLabels={config.showLabels}
                draggable={isEditMode}
                isEditMode={isEditMode}
              />
            ))}
        </Layer>
      </Stage>
      {/* Risk Levels Legend - Moved to top right */}
      <div className="absolute top-4 right-4 bg-slate-100 backdrop-blur-sm border border-slate-300 rounded-lg p-3 shadow-lg">
        <h3 className="text-sm font-semibold text-slate-800 mb-2">Risk Levels</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-xs text-slate-700">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-xs text-slate-700">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-xs text-slate-700">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs text-slate-700">Low</span>
          </div>
        </div>
      </div>

      {/* Zoom Controls - Bottom Right */}
      <div className="absolute bottom-4 right-4 bg-gray-50 backdrop-blur-sm border border-gray-300 rounded-lg shadow-lg">
        <div className="flex items-center">
          <Button size="icon" variant="ghost" onClick={() => setStage(s => ({ ...s, scale: s.scale / 1.2 }))}>
            <ZoomOut size={16}/>
            </Button>
          <span className="px-2 text-sm font-medium text-gray-700">
            {Math.round(stage.scale * 100)}%
          </span>
          <Button size="icon" variant="ghost" onClick={() => setStage(s => ({ ...s, scale: s.scale * 1.2 }))}>
            <ZoomIn size={16}/>
            </Button>
          <div className="border-l border-gray-300 ml-1">
            <Button size="icon" variant="ghost" onClick={resetZoomAndPan}>
              <RotateCcw size={16}/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmMap;