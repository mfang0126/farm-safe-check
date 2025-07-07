# 🏗️ Dashboard Page Creation Prompt Template

Use this template when creating new complex dashboard pages with multiple tabs, CRUD operations, and reusable components.

## 📋 **Prompt Template for Complex Dashboard Pages**

```
Create a [PAGE_NAME] page following these specifications:

🏗️ **Architecture Requirements:**
- Use TabPageLayout component with [X] tabs: [TAB_1], [TAB_2], [TAB_3]
- Each tab as separate component in src/components/[feature-name]/
- Main page component max 150 lines
- Custom hooks for complex state management
- Service layer for data operations

📊 **Data Management:**
- Create use[FeatureName] hook for all CRUD operations
- Create use[FeatureName]Form hook for form state and validation
- Use useModalManager for modal state management
- Integrate with existing [SERVICE_NAME] service layer

🎨 **UI/UX Requirements:**
- shadcn/ui components consistently
- Mobile-first responsive design using Tailwind
- Loading states with skeleton loaders
- Error handling with toast notifications
- Helpful empty states with clear CTAs
- Consistent button styling and spacing

🧩 **Component Structure:**
src/components/[feature-name]/
├── [FeatureName]Card.tsx           # Entity display component
├── [Tab1Name]Tab.tsx               # First tab content
├── [Tab2Name]Tab.tsx               # Second tab content  
├── [Tab3Name]Tab.tsx               # Third tab content (if needed)
└── index.ts                        # Export all components

src/hooks/
├── use[FeatureName].ts             # Main data operations hook
├── use[FeatureName]Form.ts         # Form state management hook
└── useModalManager.ts              # (already exists - reuse)

🔧 **Required Features:**
- [FEATURE_1]: [Description]
- [FEATURE_2]: [Description]
- [FEATURE_3]: [Description]
- Search and filtering capabilities
- Sorting options
- Bulk operations (if applicable)

📱 **Responsive Design:**
- Grid layouts that adapt to screen size
- Collapsible sidebar on mobile
- Touch-friendly buttons and interactions
- Proper text scaling for different devices

✅ **Definition of Done:**
- All components under 200 lines
- Reusable patterns extracted to src/components/shared/
- Error handling implemented with proper user feedback
- TypeScript strict compliance
- Proper loading states throughout
- Empty states with helpful messaging
- Consistent with existing app design patterns

🧪 **Testing Considerations:**
- Components can be unit tested in isolation
- Custom hooks can be tested independently
- Mock data available for development
- Error scenarios handled gracefully

📋 **Example Implementation Pattern:**
Reference the RiskArea implementation for:
- Custom hooks: useRiskZones, useRiskZoneForm, useModalManager
- Component structure: TabPageLayout, CRUDModal, EntityCard
- Service integration pattern
- Error handling and loading states
```

## 🎯 **Specific Use Cases**

### For Equipment Management Page:
```
Create an Equipment Management page following these specifications:

🏗️ Architecture Requirements:
- Use TabPageLayout component with 3 tabs: Equipment List, Categories, Maintenance Schedule
- Each tab as separate component in src/components/equipment/
- Main page component max 150 lines
- Custom hooks for complex state management
- Service layer for data operations

📊 Data Management:
- Create useEquipment hook for all CRUD operations
- Create useEquipmentForm hook for form state and validation
- Use useModalManager for modal state management
- Integrate with existing EquipmentService service layer

🧩 Component Structure:
src/components/equipment/
├── EquipmentCard.tsx               # Equipment display component
├── EquipmentListTab.tsx            # Equipment listing and management
├── CategoriesTab.tsx               # Equipment categories management
├── MaintenanceScheduleTab.tsx      # Maintenance scheduling view
└── index.ts                        # Export all components

🔧 Required Features:
- Equipment CRUD operations
- Category management
- Maintenance scheduling
- Search and filtering by category, status, location
- Export to CSV functionality
- Bulk status updates

📱 Responsive Design:
- Equipment cards in responsive grid (1 col mobile, 2-3 col tablet, 3-4 col desktop)
- Collapsible filters on mobile
- Touch-friendly action buttons
- Proper text scaling for equipment details
```

### For Safety Checklists Page:
```
Create a Safety Checklists page following these specifications:

🏗️ Architecture Requirements:
- Use TabPageLayout component with 3 tabs: Active Checklists, Templates, Compliance Reports
- Each tab as separate component in src/components/checklists/
- Main page component max 150 lines
- Custom hooks for complex state management
- Service layer for data operations

📊 Data Management:
- Create useChecklists hook for all CRUD operations
- Create useChecklistForm hook for form state and validation
- Use useModalManager for modal state management
- Integrate with existing ChecklistService service layer

🧩 Component Structure:
src/components/checklists/
├── ChecklistCard.tsx               # Checklist display component
├── ActiveChecklistsTab.tsx         # Active checklists management
├── TemplatesTab.tsx                # Template creation and management
├── ComplianceReportsTab.tsx        # Reporting and analytics
└── index.ts                        # Export all components

🔧 Required Features:
- Checklist creation from templates
- Progress tracking and completion
- Template management
- Compliance reporting
- Due date notifications
- PDF export capabilities

📱 Responsive Design:
- Checklist cards stack on mobile
- Progress bars scale appropriately
- Touch-friendly checkboxes
- Proper spacing for checklist items
```

## 🎨 **UI Pattern Examples**

### Entity Card Pattern:
```tsx
// Use this pattern for displaying entities
<EntityCard
  entity={item}
  title={item.name}
  description={item.description}
  status={{ label: item.status, variant: getStatusVariant(item.status) }}
  metadata={[
    { label: "Location", value: item.location },
    { label: "Last Updated", value: formatDate(item.updated_at) }
  ]}
  actions={[
    { label: "Edit", icon: Edit, onClick: () => onEdit(item) },
    { label: "View Details", icon: Eye, onClick: () => onViewDetails(item) },
    { label: "Delete", icon: Trash, onClick: () => onDelete(item), variant: "destructive" }
  ]}
/>
```

### Custom Hook Pattern:
```tsx
// Follow this pattern for data management hooks
export const use[FeatureName] = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const create = async (formData) => {
    setLoading(true);
    try {
      const result = await service.create(formData);
      setData(prev => [...prev, result]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const update = async (id, formData) => {
    // Similar pattern
  };
  
  const remove = async (id) => {
    // Similar pattern
  };
  
  return { data, loading, error, create, update, remove };
};
```

### Modal Management Pattern:
```tsx
// Use useModalManager for all modal state
const { openModal, closeModal, isOpen } = useModalManager();

// Open modals with specific IDs
const handleEdit = (item) => {
  setEditingItem(item);
  openModal('edit-form');
};

// Check modal state
{isOpen('edit-form') && (
  <CRUDModal
    isOpen={isOpen('edit-form')}
    onClose={() => closeModal('edit-form')}
    title="Edit Item"
    // ... other props
  />
)}
```

## 📚 **Reference Implementation**

The RiskArea page serves as the complete reference implementation:
- **File**: `src/pages/RiskArea.tsx` (refactored version)
- **Components**: `src/components/risk-area/`
- **Hooks**: `src/hooks/useRiskZones.ts`, `src/hooks/useRiskZoneForm.ts`
- **Shared Components**: `src/components/shared/TabPageLayout.tsx`, `src/components/shared/CRUDModal.tsx`

Use this as a blueprint for architecture, naming conventions, and implementation patterns. 