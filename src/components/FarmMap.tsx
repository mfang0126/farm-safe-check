import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line, Group } from 'react-konva';
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
  showLabels: boolean;
  draggable: boolean;
}

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
  const shapeRef = useRef<Konva.Shape>(null);
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

  if (!geometry) {
    return null; // Or some placeholder
  }
  
  const { x, y, width, height, radius, type, rotation } = geometry;

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (onPositionChange) {
      onPositionChange({
        x: e.target.x(),
        y: e.target.y()
      });
    }
  };

  const commonProps = {
    x,
    y,
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
    draggable,
    onDragEnd: handleDragEnd,
    listening: true,
  };

  const renderShape = () => {
    switch (type) {
      case 'rectangle':
        return <Rect {...commonProps} width={width} height={height} />;
      case 'circle':
        return <Circle {...commonProps} radius={radius} />;
      // Polygon case can be added here if needed
      default:
        return null;
    }
  };

  const renderLabel = () => {
    if (!showLabels) return null;
    
    const labelX = x;
    const labelY = y - 20;

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
    <Group>
      {renderShape()}
      {renderLabel()}
    </Group>
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
    setStage({ scale: 1, x: 0, y: 0 });
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
        onWheel={handleWheel}
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
              showLabels={config.showLabels}
              draggable={isEditMode}
            />
          ))}
        </Layer>
      </Stage>
      <div className="absolute top-2 right-2 flex flex-col space-y-2">
        <Button size="icon" onClick={() => setStage(s => ({ ...s, scale: s.scale * 1.2 }))}><ZoomIn size={20}/></Button>
        <Button size="icon" onClick={() => setStage(s => ({ ...s, scale: s.scale / 1.2 }))}><ZoomOut size={20}/></Button>
        <Button size="icon" onClick={resetZoomAndPan}><RotateCcw size={20}/></Button>
      </div>
    </div>
  );
};

export default FarmMap; 