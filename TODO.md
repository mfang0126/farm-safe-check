# Farm Map Enhancement TODO

## 🚨 CRITICAL PERFORMANCE ISSUES - IMMEDIATE FIX REQUIRED

### ⚠️ **Zone Resizing Flashing/Vibrating Problem**
**Status**: Active issue affecting user experience

**Problem Description**:
- 50+ React Fragment errors flooding console during edit mode
- Error: "Invalid prop `data-lov-id` supplied to `React.Fragment`"
- Causes severe performance degradation and visual flashing/vibrating
- Makes zone resizing functionality nearly unusable

**Root Cause**:
- Debugging/monitoring tool injecting invalid `data-lov-id` attributes into React Fragments
- React Fragments cannot accept custom props besides `key` and `children`
- This creates rendering conflicts and performance bottlenecks

**Immediate Action Required**:
1. **Identify Source**: Find which development tool is injecting `data-lov-id`
2. **Disable/Configure**: Remove or properly configure the problematic tool
3. **Code Review**: Ensure no custom props are being passed to React Fragments
4. **Testing**: Verify fix resolves flashing/vibrating behavior

### 🔧 **Minor ReactKonva Warning**
- **Issue**: One remaining draggable node warning
- **Location**: Resize handles in FarmMap component
- **Priority**: Low (functionality works, just console warning)

---

## Background Image Upload Feature 🖼️

### 📋 Requirements
- Allow users to upload a background image for the farm map
- Image should be positioned behind the grid and zones
- Support common image formats (PNG, JPG, JPEG, SVG)
- Include image scaling and positioning controls
- Maintain aspect ratio options

### 🏗️ Implementation Plan
1. **Image Upload Component**
   - File picker with drag-and-drop support
   - Image preview functionality
   - File validation (type, size)
   - Progress indicator during upload

2. **Image Storage**
   - Store uploaded images in Supabase Storage
   - Reference image URL in farm_maps table
   - Handle image compression for performance

3. **Map Integration**
   - Add background image layer in Konva Stage
   - Position image behind grid and zones
   - Implement image scaling controls
   - Add image opacity controls for better zone visibility

4. **UI Controls**
   - Upload button in map management interface
   - Image position/scale adjustment tools
   - Option to remove/replace background image
   - Toggle visibility of background image

### 🎨 UI Components Needed
- `ImageUploadModal` - Handle file selection and upload
- `BackgroundImageControls` - Position, scale, opacity controls
- Enhanced `FarmMap` component with image layer
- Image management in map settings

### 📊 Database Changes
```sql
-- Add background_image_url to farm_maps table
ALTER TABLE farm_maps ADD COLUMN background_image_url TEXT;
ALTER TABLE farm_maps ADD COLUMN background_image_config JSONB DEFAULT '{}';
```

### ⚡ Performance Considerations
- Lazy load images
- Implement image caching
- Compress large images automatically
- Optimize for mobile devices

---

## Current Development Tasks

### ✅ Completed
- Basic farm map with zones
- Drag-and-drop position editing
- Grid system with transparency

### 🚧 In Progress
- **Zone resizing functionality** (Current Priority)
  - Add resize handles to selected zones
  - Support both rectangle and circle resizing
  - Update geometry data on resize
  - Maintain aspect ratio option

### 📅 Next Up
1. Zone resizing implementation
2. Improved grid transparency
3. Enhanced edit mode UX
4. Background image upload feature

### 🐛 Known Issues
- Need to update button text from "Edit Positions" to "Edit"
- Grid needs better transparency in edit mode
- Zone labels could be more responsive

---

## Future Enhancements

### 🎯 Short Term (Next 2-4 weeks)
- Zone rotation handles
- Multi-zone selection and bulk operations
- Undo/redo functionality for map changes
- Keyboard shortcuts for map operations

### 🎯 Long Term (1-3 months)
- Satellite imagery integration
- GPS coordinate mapping
- Zone templates and presets
- Advanced drawing tools (polygons, lines)
- Collaborative editing support 