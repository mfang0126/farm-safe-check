// Farm Map Types for Interactive Canvas and Database Integration

export interface Coordinates {
  x: number;
  y: number;
}

export interface MapBounds {
  width: number;
  height: number;
  scale: number;
}

export interface RiskZoneGeometry {
  id: string;
  name: string;
  type: 'rectangle' | 'circle' | 'polygon';
  // Position and size for rectangles and circles
  x: number;
  y: number;
  width?: number; // for rectangles
  height?: number; // for rectangles
  radius?: number; // for circles
  // For complex polygon shapes
  points?: number[]; // [x1, y1, x2, y2, ...] for polygons
  rotation?: number; // rotation in degrees
}

export interface RiskZoneData {
  id: string;
  name: string;
  category: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  location: string;
  // Database fields for Supabase
  created_at: string;
  updated_at: string;
  user_id: string;
  // Additional metadata
  lastReview: string;
  incidentsThisYear: number;
  actionPlanId?: string;
  isActive: boolean;
  // Visual properties
  geometry: RiskZoneGeometry;
  color?: string; // override default risk level color
  opacity?: number;
}

export interface FarmMapData {
  id: string;
  name: string;
  description: string;
  // Map metadata for database
  created_at: string;
  updated_at: string;
  user_id: string;
  // Map bounds and scale
  bounds: MapBounds;
  // Background image (optional)
  backgroundImage?: {
    url: string;
    width: number;
    height: number;
    opacity: number;
  };
  // All risk zones on this map
  riskZones: RiskZoneData[];
  // Map configuration
  config: {
    showGrid: boolean;
    gridSize: number;
    snapToGrid: boolean;
    showLabels: boolean;
    showLegend: boolean;
    allowEditing: boolean;
  };
}

export interface MapInteractionState {
  selectedZoneId: string | null;
  hoveredZoneId: string | null;
  isDrawing: boolean;
  drawingMode: 'select' | 'rectangle' | 'circle' | 'polygon' | 'pan';
  zoom: number;
  panOffset: Coordinates;
}

export interface RiskLevelStyle {
  color: string;
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
  hoverColor: string;
  selectedColor: string;
}

export const RISK_LEVEL_STYLES: Record<string, RiskLevelStyle> = {
  Critical: {
    color: '#ef4444', // red-500
    strokeColor: '#dc2626', // red-600
    strokeWidth: 2,
    opacity: 0.7,
    hoverColor: '#dc2626',
    selectedColor: '#b91c1c'
  },
  High: {
    color: '#f97316', // orange-500
    strokeColor: '#ea580c', // orange-600
    strokeWidth: 2,
    opacity: 0.7,
    hoverColor: '#ea580c',
    selectedColor: '#c2410c'
  },
  Medium: {
    color: '#eab308', // yellow-500
    strokeColor: '#ca8a04', // yellow-600
    strokeWidth: 2,
    opacity: 0.7,
    hoverColor: '#ca8a04',
    selectedColor: '#a16207'
  },
  Low: {
    color: '#22c55e', // green-500
    strokeColor: '#16a34a', // green-600
    strokeWidth: 2,
    opacity: 0.7,
    hoverColor: '#16a34a',
    selectedColor: '#15803d'
  }
};

// Mock data for development
export const createMockFarmMapData = (userId: string): FarmMapData => {
  const now = new Date().toISOString();
  
  return {
    id: 'farm-map-1',
    name: 'Main Farm Layout',
    description: 'Primary farm operational areas with risk zone mapping',
    created_at: now,
    updated_at: now,
    user_id: userId,
    bounds: {
      width: 800,
      height: 600,
      scale: 1
    },
    config: {
      showGrid: true,
      gridSize: 20,
      snapToGrid: false,
      showLabels: true,
      showLegend: true,
      allowEditing: true
    },
    riskZones: [
      {
        id: 'zone-1',
        name: 'Loading Bay Alpha',
        category: 'Loading & Unloading Operations',
        riskLevel: 'Critical',
        description: 'Heavy machinery operations, vehicle/pedestrian conflicts',
        location: 'North paddock, near main gate',
        created_at: now,
        updated_at: now,
        user_id: userId,
        lastReview: 'March 2024',
        incidentsThisYear: 3,
        isActive: true,
        geometry: {
          id: 'geo-1',
          name: 'Loading Bay Alpha',
          type: 'rectangle',
          x: 50,
          y: 50,
          width: 120,
          height: 80,
          rotation: 0
        }
      },
      {
        id: 'zone-2',
        name: 'Chemical Storage Area',
        category: 'Storage & Processing Facilities',
        riskLevel: 'High',
        description: 'Pesticide/fertilizer storage, spill risks, exposure hazards',
        location: 'South side, secured compound',
        created_at: now,
        updated_at: now,
        user_id: userId,
        lastReview: 'February 2024',
        incidentsThisYear: 1,
        isActive: true,
        geometry: {
          id: 'geo-2',
          name: 'Chemical Storage Area',
          type: 'rectangle',
          x: 50,
          y: 450,
          width: 150,
          height: 100,
          rotation: 0
        }
      },
      {
        id: 'zone-3',
        name: 'Grain Storage Facility',
        category: 'Storage & Processing Facilities',
        riskLevel: 'Medium',
        description: 'Dust explosion prevention, confined space entry',
        location: 'Central area, main building',
        created_at: now,
        updated_at: now,
        user_id: userId,
        lastReview: 'March 2024',
        incidentsThisYear: 0,
        isActive: true,
        geometry: {
          id: 'geo-3',
          name: 'Grain Storage Facility',
          type: 'rectangle',
          x: 350,
          y: 250,
          width: 180,
          height: 140,
          rotation: 0
        }
      },
      {
        id: 'zone-4',
        name: 'Livestock Handling Yards',
        category: 'Livestock Handling Areas',
        riskLevel: 'Medium',
        description: 'Cattle yards, unpredictable animal behavior, crushing risks',
        location: 'West field, animal handling area',
        created_at: now,
        updated_at: now,
        user_id: userId,
        lastReview: 'February 2024',
        incidentsThisYear: 2,
        isActive: true,
        geometry: {
          id: 'geo-4',
          name: 'Livestock Handling Yards',
          type: 'rectangle',
          x: 600,
          y: 50,
          width: 140,
          height: 120,
          rotation: 0
        }
      },
      {
        id: 'zone-5',
        name: 'Water Tank Area',
        category: 'Environmental & Weather Hazards',
        riskLevel: 'Low',
        description: 'Water storage, slip hazards when wet',
        location: 'East side, near irrigation system',
        created_at: now,
        updated_at: now,
        user_id: userId,
        lastReview: 'January 2024',
        incidentsThisYear: 0,
        isActive: true,
        geometry: {
          id: 'geo-5',
          name: 'Water Tank Area',
          type: 'circle',
          x: 650,
          y: 400,
          radius: 60,
          rotation: 0
        }
      }
    ]
  };
}; 