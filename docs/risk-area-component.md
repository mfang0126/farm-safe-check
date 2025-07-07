# Risk Area Component - Technical Documentation

## Overview

The **RiskArea component** (`src/pages/RiskArea.tsx`) is a comprehensive farm risk management system that allows users to define, visualize, and manage safety zones across their farm operations. It combines an interactive canvas-based map with traditional form-based data management in a dual-tab interface.

## Key Features

- **Interactive Farm Map**: Canvas-based visualization using Konva.js with zoom, pan, and drag capabilities
- **Risk Zone Management**: Create, edit, and position safety zones with detailed risk assessments
- **Dual-Mode Interface**: Separate tabs for information management vs. position editing
- **Real-time Interactions**: Live hover, selection, and drag-and-drop positioning
- **Professional UI**: Clean design with modals, forms, and comprehensive feedback systems

---

## Architecture & Dependencies

### Core Dependencies
```typescript
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FarmMap from '@/components/FarmMap';          // Konva.js canvas component
import { FarmMapData, RiskZoneData, createMockFarmMapData } from '@/types/farmMap';
```

### UI Dependencies
- **Shadcn/UI Components**: Cards, Tabs, Buttons, Dialogs, Forms
- **Lucide Icons**: Plus, Edit, Eye, MapPin, Move, Save, RotateCcw
- **Toast System**: User feedback for all operations

### Type System
```typescript
interface RiskZoneFormData {
  name: string;
  category: string;
  riskLevel: string;
  location: string;
  description: string;
}
```

---

## Component Structure

### 1. State Management

```typescript
// Tab and Modal State
const [activeTab, setActiveTab] = useState('zones');
const [showAddModal, setShowAddModal] = useState(false);
const [editingZone, setEditingZone] = useState<RiskZoneData | null>(null);

// Map Interaction State
const [selectedZone, setSelectedZone] = useState<RiskZoneData | null>(null);
const [hoveredZone, setHoveredZone] = useState<RiskZoneData | null>(null);
const [farmMapData, setFarmMapData] = useState<FarmMapData | null>(null);

// Edit Mode State
const [isEditMode, setIsEditMode] = useState(false);
const [draggedZoneId, setDraggedZoneId] = useState<string | null>(null);

// Form State
const [formData, setFormData] = useState<RiskZoneFormData>({
  name: '',
  category: '',
  riskLevel: '',
  location: '',
  description: ''
});
```

### 2. Constants and Configuration

```typescript
// Risk Categories (as specified by requirements)
const RISK_CATEGORIES = [
  "Loading & Unloading Operations",
  "Machinery & Equipment Areas", 
  "Livestock Handling Areas",
  "Storage & Processing Facilities",
  "Environmental & Weather Hazards"
];

const RISK_LEVELS = ["Low", "Medium", "High", "Critical"];
```

---

## Core Functionality

### 1. Zone Creation Workflow

#### From "Manage Zones" Tab:
1. User clicks "Add New Zone" button
2. Modal opens with comprehensive form
3. User fills required fields (name, category, risk level, location, description)
4. Form validation ensures all fields are complete
5. New zone is created and positioned at map center
6. Toast confirmation displayed

#### From "View Map" Tab:
1. User clicks "Add Zone to Map" button
2. Automatically switches to "Manage Zones" tab
3. Opens modal for zone creation
4. Same workflow as above

```typescript
const handleAddZone = async () => {
  if (!canSubmit() || !farmMapData) return;

  const newZone: RiskZoneData = {
    id: `zone-${Date.now()}`,
    name: formData.name,
    category: formData.category,
    riskLevel: formData.riskLevel as 'Low' | 'Medium' | 'High' | 'Critical',
    // ... other properties
    geometry: {
      // Positioned at map center as requested
      x: (farmMapData.bounds.width / 2) - 50,
      y: (farmMapData.bounds.height / 2) - 40,
      width: 100,
      height: 80,
      type: 'rectangle'
    }
  };

  setFarmMapData({
    ...farmMapData,
    riskZones: [...farmMapData.riskZones, newZone]
  });
};
```

### 2. Zone Information Editing

#### Edit Info Workflow:
1. User clicks "Edit Info" button on zone card or selected zone panel
2. Modal opens pre-populated with existing zone data
3. User modifies any information fields
4. Changes are validated and applied
5. Zone name updates are synchronized with map geometry

```typescript
const handleEditZone = async () => {
  const updatedZones = farmMapData.riskZones.map(zone => 
    zone.id === editingZone.id 
      ? {
          ...zone,
          name: formData.name,
          category: formData.category,
          // ... other updated fields
          geometry: {
            ...zone.geometry,
            name: formData.name  // Sync name with geometry
          }
        }
      : zone
  );
  
  setFarmMapData({ ...farmMapData, riskZones: updatedZones });
};
```

### 3. Position Management System

#### Edit Mode Toggle:
```typescript
const toggleEditMode = () => {
  setIsEditMode(!isEditMode);
  setSelectedZone(null);
};
```

#### Position Change Handling:
```typescript
const handleZonePositionChange = (zoneId: string, newPosition: { x: number; y: number }) => {
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

  setFarmMapData({ ...farmMapData, riskZones: updatedZones });
};
```

---

## User Interface Design

### 1. Tab-Based Layout

#### **"Manage Zones" Tab** - Information Focus
- **Purpose**: Edit zone details and properties
- **Features**:
  - Zone cards displaying all information
  - "Edit Info" buttons for modal-based editing
  - "View on Map" buttons for cross-tab navigation
  - Empty state design for first-time users

#### **"View Map" Tab** - Visual/Position Focus  
- **Purpose**: Manage zone positions and visual layout
- **Features**:
  - Interactive canvas map with zones
  - Edit mode toggle for position changes
  - Save/Discard functionality
  - Selected zone information panel

### 2. Modal System

#### Add/Edit Zone Modal Features:
- **Required Field Validation**: All fields must be completed
- **Dropdown Selections**: Risk categories and levels
- **Text Inputs**: Zone name and location
- **Textarea**: Detailed description
- **Real-time Validation**: Submit button disabled until form is valid

```typescript
const canSubmit = () => {
  return formData.name.trim() && 
         formData.category && 
         formData.riskLevel && 
         formData.location.trim() && 
         formData.description.trim();
};
```

### 3. Interactive Map Features

#### Map Controls:
- **Zoom**: Mouse wheel (10% to 500%)
- **Pan**: Click and drag (disabled in edit mode)
- **Zone Selection**: Click zones to select/deselect
- **Zone Dragging**: Available only in edit mode

#### Visual Elements:
- **Risk Level Colors**: Different colors for Critical/High/Medium/Low
- **Grid Overlay**: Reference coordinate system
- **Legend**: Risk level color indicators
- **Edit Mode Indicator**: Blue banner when in edit mode

---

## Data Models & Types

### 1. Core Interfaces

```typescript
interface RiskZoneData {
  // Identification
  id: string;
  name: string;
  
  // Risk Assessment
  category: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  location: string;
  
  // Database Fields (Supabase-ready)
  created_at: string;
  updated_at: string;
  user_id: string;
  
  // Metadata
  lastReview: string;
  incidentsThisYear: number;
  actionPlanId?: string;
  isActive: boolean;
  
  // Visual Properties
  geometry: RiskZoneGeometry;
  color?: string;
  opacity?: number;
}

interface RiskZoneGeometry {
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
}
```

### 2. Map Data Structure

```typescript
interface FarmMapData {
  id: string;
  name: string;
  description: string;
  
  // Database metadata
  created_at: string;
  updated_at: string;
  user_id: string;
  
  // Map configuration
  bounds: MapBounds;
  config: MapConfig;
  riskZones: RiskZoneData[];
  
  // Optional background
  backgroundImage?: BackgroundImage;
}
```

---

## Integration with FarmMap Component

### 1. Props Interface

```typescript
interface FarmMapProps {
  mapData: FarmMapData;
  onZoneClick?: (zone: RiskZoneData) => void;
  onZoneHover?: (zone: RiskZoneData | null) => void;
  onZoneSelect?: (zone: RiskZoneData | null) => void;
  onZonePositionChange?: (zoneId: string, newPosition: { x: number; y: number }) => void;
  editMode?: boolean;
  className?: string;
  height?: number;
  width?: number;
}
```

### 2. Event Handling Flow

```typescript
// RiskArea passes these handlers to FarmMap
<FarmMap
  mapData={farmMapData}
  onZoneClick={handleZoneClick}           // Selection management
  onZoneHover={handleZoneHover}           // Hover state updates  
  onZoneSelect={handleZoneSelect}         // Cross-component sync
  onZonePositionChange={handleZonePositionChange}  // Position updates
  editMode={isEditMode}                   // Controls dragging behavior
/>
```

### 3. State Synchronization

- **Selection State**: Selected zones are synchronized between map and UI
- **Hover State**: Map hover events update component state
- **Position Changes**: Drag operations immediately update zone geometry
- **Edit Mode**: Controls both map behavior and UI indicators

---

## Technical Implementation Details

### 1. Responsive Design

#### Canvas Sizing:
```typescript
// FarmMap handles responsive sizing internally
const [dimensions, setDimensions] = useState({
  width: width || 800,
  height: height || 600
});

// ResizeObserver for real-time adaptation
useEffect(() => {
  const resizeObserver = new ResizeObserver(() => {
    updateDimensions();
  });
  
  if (containerRef.current) {
    resizeObserver.observe(containerRef.current);
  }
}, []);
```

#### Minimum Dimensions:
- **Fallback Values**: 400x300 minimum to prevent zero-size rendering
- **Timeout Delay**: 10ms for initial size calculation
- **Container Reference**: Uses ref to measure actual DOM dimensions

### 2. Performance Optimizations

#### Efficient Rendering:
- **Konva.js**: Hardware-accelerated canvas rendering
- **Selective Updates**: Only re-render changed zones
- **Event Debouncing**: Smooth interaction without performance impact

#### Memory Management:
- **Cleanup Functions**: Proper removal of event listeners
- **State Optimization**: Minimal re-renders through careful state management

### 3. Error Handling

```typescript
const handleAddZone = async () => {
  try {
    // Zone creation logic
    toast({
      title: "Risk Zone Added",
      description: `"${formData.name}" has been added successfully.`,
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to add risk zone. Please try again.",
      variant: "destructive"
    });
  }
};
```

---

## Recent Bug Fixes & Improvements

### 1. Map Rendering Issue Resolution (2025-01-28)

**Problem**: Empty map appearing due to zero-size Konva canvas
**Solution**: 
- Added minimum dimension safety guards (400x300)
- Implemented 10ms timeout for DOM readiness
- Added proper fallback values for container measurements

### 2. Drag Functionality Implementation

**Problem**: Missing drag capabilities after code changes
**Solution**:
- Added `editMode` and `onZonePositionChange` props to FarmMap
- Implemented proper drag handlers in RiskZone component
- Fixed stage/zone interaction conflicts

### 3. Responsive Design Enhancement

**Problem**: Fixed-width map not adapting to different screen sizes
**Solution**:
- Dynamic dimension calculation from container size
- ResizeObserver for real-time adaptation
- Cross-device compatibility testing

---

## Future Enhancement Areas

### 1. Database Integration
- **Supabase Integration**: Connect TypeScript interfaces to database tables
- **Real-time Sync**: Multi-user collaboration capabilities
- **Data Persistence**: Save/load map configurations

### 2. Advanced Features
- **GPS Coordinates**: Real-world mapping with satellite overlay
- **Polygon Drawing**: Custom shape creation tools
- **Import/Export**: Zone data exchange capabilities
- **Keyboard Shortcuts**: Hotkeys for common operations

### 3. User Experience Improvements
- **Zone Deletion**: Safe removal with confirmation dialogs
- **Bulk Operations**: Multi-zone selection and editing
- **Template System**: Pre-configured zone types
- **Audit Trail**: Change history and review tracking

---

## Usage Guidelines

### 1. Adding New Risk Zones
1. Use descriptive names that clearly identify the area
2. Select appropriate risk categories from the predefined list
3. Provide detailed descriptions of specific hazards
4. Include precise location references for easy identification

### 2. Managing Zone Positions
1. Enter Edit Mode before attempting to move zones
2. Use the grid overlay as a reference coordinate system
3. Save changes before switching modes or tabs
4. Test positioning on different screen sizes

### 3. Best Practices
- **Regular Reviews**: Update zone information quarterly
- **Incident Tracking**: Log incidents in zone descriptions
- **Cross-Reference**: Link zones to action plans and procedures
- **Team Collaboration**: Share maps with relevant stakeholders

---

This documentation provides a comprehensive understanding of the RiskArea component's architecture, functionality, and implementation details. The component represents a sophisticated risk management system that successfully combines interactive visualization with traditional data management paradigms. 