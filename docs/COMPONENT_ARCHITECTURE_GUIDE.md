# Component Architecture & Reusability Guide

## 📋 Table of Contents
1. [Component Breakdown Strategy](#component-breakdown-strategy)
2. [Custom Hooks for State Management](#custom-hooks-for-state-management)
3. [Reusable Component Patterns](#reusable-component-patterns)
4. [Prompt Template for Similar Pages](#prompt-template-for-similar-pages)
5. [Folder Structure Recommendations](#folder-structure-recommendations)

## 🔧 Component Breakdown Strategy

### Current RiskArea.tsx Should Be Split Into:

#### 1. **Page-Level Component** (`RiskArea.tsx` - ~100 lines)
```typescript
// Main page coordinator - handles routing between tabs only
- Tab navigation
- Page header
- Global state coordination
```

#### 2. **Feature Components** (src/components/risk-area/)
```typescript
ZoneManagementTab.tsx        // Zone CRUD operations
MapManagementTab.tsx         // Map interactions & positioning  
ZoneInfoCard.tsx            // Individual zone display
ZoneFormModal.tsx           // Add/Edit zone form
MapView.tsx                 // Map display logic
ZonePositionEditor.tsx      // Drag & drop functionality
```

#### 3. **Custom Hooks** (src/hooks/)
```typescript
useRiskZones.ts             // Zone CRUD operations
useMapInteraction.ts        // Map state & interactions
useZoneForm.ts              // Form state & validation
useModalManager.ts          // Modal state management
```

#### 4. **Shared Components** (src/components/shared/)
```typescript
EntityCard.tsx              // Reusable card for any entity
CRUDModal.tsx              // Generic add/edit modal
PositionEditor.tsx         // Drag & drop for any positioned item
StatusBadge.tsx            // Status indicators
```

## 🎣 Custom Hooks for State Management

### 1. **useRiskZones Hook**
```typescript
// src/hooks/useRiskZones.ts
export const useRiskZones = (farmMapId: string) => {
  const [zones, setZones] = useState<RiskZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const createZone = async (data: RiskZoneFormData) => {
    // Implementation
  };
  
  const updateZone = async (id: string, data: Partial<RiskZoneFormData>) => {
    // Implementation
  };
  
  const deleteZone = async (id: string) => {
    // Implementation
  };
  
  return {
    zones,
    loading,
    error,
    createZone,
    updateZone,
    deleteZone,
    refreshZones
  };
};
```

### 2. **useModalManager Hook**
```typescript
// src/hooks/useModalManager.ts
export const useModalManager = () => {
  const [modals, setModals] = useState<Record<string, boolean>>({});
  
  const openModal = (modalId: string) => {
    setModals(prev => ({ ...prev, [modalId]: true }));
  };
  
  const closeModal = (modalId: string) => {
    setModals(prev => ({ ...prev, [modalId]: false }));
  };
  
  const isOpen = (modalId: string) => !!modals[modalId];
  
  return { openModal, closeModal, isOpen };
};
```

### 3. **useEntityForm Hook**
```typescript
// src/hooks/useEntityForm.ts
export const useEntityForm = <T extends Record<string, any>>(
  initialData: T,
  validationSchema: ZodSchema<T>
) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  
  const updateField = (field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Real-time validation
    validateField(field, value);
  };
  
  const validateForm = () => {
    // Validation logic
  };
  
  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
    setIsDirty(false);
  };
  
  return {
    formData,
    errors,
    isDirty,
    updateField,
    validateForm,
    resetForm,
    isValid: Object.keys(errors).length === 0
  };
};
```

## 🧩 Reusable Component Patterns

### 1. **EntityCard Component**
```typescript
// src/components/shared/EntityCard.tsx
interface EntityCardProps<T> {
  entity: T;
  title: string;
  description?: string;
  status?: { label: string; variant: BadgeVariant };
  metadata?: Array<{ label: string; value: string }>;
  actions?: Array<{
    label: string;
    icon: LucideIcon;
    onClick: (entity: T) => void;
    variant?: ButtonVariant;
  }>;
  additionalContent?: React.ReactNode;
}

export const EntityCard = <T,>({ 
  entity, 
  title, 
  description, 
  status, 
  metadata, 
  actions,
  additionalContent 
}: EntityCardProps<T>) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{title}</h3>
              {status && (
                <Badge variant={status.variant}>{status.label}</Badge>
              )}
            </div>
            {description && (
              <p className="text-sm mb-2">{description}</p>
            )}
            {metadata && (
              <div className="text-xs text-muted-foreground space-y-1">
                {metadata.map(({ label, value }, index) => (
                  <p key={index}>
                    <strong>{label}:</strong> {value}
                  </p>
                ))}
              </div>
            )}
            {additionalContent}
          </div>
          {actions && actions.length > 0 && (
            <div className="flex flex-col gap-2 ml-4">
              {actions.map(({ label, icon: Icon, onClick, variant = "outline" }, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={variant}
                  onClick={() => onClick(entity)}
                >
                  <Icon className="mr-1" size={14} />
                  {label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
```

### 2. **CRUDModal Component**
```typescript
// src/components/shared/CRUDModal.tsx
interface CRUDModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  entity?: T | null; // null = create mode, object = edit mode
  onSubmit: (data: T) => Promise<void>;
  children: React.ReactNode; // Form fields
  submitLabel?: string;
  loading?: boolean;
}

export const CRUDModal = <T,>({
  isOpen,
  onClose,
  title,
  description,
  entity,
  onSubmit,
  children,
  submitLabel,
  loading = false
}: CRUDModalProps<T>) => {
  const isEditMode = !!entity;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          {children}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : (submitLabel || (isEditMode ? "Update" : "Create"))}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
```

### 3. **TabPageLayout Component**
```typescript
// src/components/shared/TabPageLayout.tsx
interface TabPageLayoutProps {
  title: string;
  description?: string;
  headerActions?: React.ReactNode;
  tabs: Array<{
    id: string;
    label: string;
    icon?: LucideIcon;
    content: React.ReactNode;
  }>;
  defaultTab?: string;
}

export const TabPageLayout = ({
  title,
  description,
  headerActions,
  tabs,
  defaultTab
}: TabPageLayoutProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {headerActions}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid grid-cols-${tabs.length} w-full md:w-auto`}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <TabsTrigger key={id} value={id} className="flex items-center gap-2">
              {Icon && <Icon size={16} />}
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(({ id, content }) => (
          <TabsContent key={id} value={id} className="space-y-6">
            {content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
```

## 📝 Prompt Template for Similar Pages

When creating complex dashboard pages with similar patterns, use this prompt:

```
Create a [PAGE_NAME] page component following these specifications:

## 🎯 Requirements
- **Purpose**: [Describe the main purpose - e.g., "Manage equipment inventory and maintenance schedules"]
- **User Actions**: [List key actions - e.g., "Add/edit equipment, schedule maintenance, view reports"]
- **Data Sources**: [Specify data - e.g., "Equipment table, maintenance_tasks table, user profiles"]

## 🏗️ Architecture Requirements

### 1. **Page Structure**
- Use TabPageLayout component with [X] tabs: [Tab1, Tab2, Tab3]
- Each tab should be a separate component in `src/components/[feature-name]/`
- Main page component should be max 150 lines, focused on coordination only

### 2. **Required Components** (Create in `src/components/[feature-name]/`)
- `[Feature]ManagementTab.tsx` - Primary CRUD interface  
- `[Feature]ListView.tsx` - List/grid view of items
- `[Feature]FormModal.tsx` - Add/edit modal
- `[Feature]Card.tsx` - Individual item display
- `[Feature]Filters.tsx` - Filtering and search (if needed)
- `[Feature]Stats.tsx` - Summary statistics (if needed)

### 3. **Custom Hooks** (Create in `src/hooks/`)
- `use[Feature].ts` - Data operations (CRUD)
- `use[Feature]Form.ts` - Form state management
- `useModalManager.ts` - Modal state (reuse existing if available)

### 4. **Service Integration**
- Use existing service pattern: `[FeatureName]Service` class
- Extend existing repository pattern if needed
- Follow error handling patterns with `useErrorHandler` hook

## 🎨 UI/UX Requirements
- **Design System**: Use shadcn/ui components consistently
- **Responsive**: Mobile-first approach with responsive breakpoints  
- **Loading States**: Show skeleton loaders during data fetching
- **Error Handling**: Use toast notifications for user feedback
- **Empty States**: Provide helpful empty state messages with CTAs

## 📊 Data Requirements
### Database Tables Needed:
- `[table_name]` - [description]
- [Add more tables as needed]

### Form Validation:
- Use Zod schema validation
- Real-time field validation
- Clear error messages

### State Management:
- Minimize useState hooks in main component
- Extract complex state to custom hooks
- Use React Query/SWR for server state (if applicable)

## 🔧 Technical Specifications
- **TypeScript**: Strict typing throughout
- **Performance**: Lazy load heavy components
- **Testing**: Components should be easily unit testable
- **Accessibility**: ARIA labels, keyboard navigation
- **Error Boundaries**: Wrap each tab in error boundary

## 📁 Expected File Structure:
```
src/
├── components/
│   ├── [feature-name]/
│   │   ├── [Feature]ManagementTab.tsx
│   │   ├── [Feature]ListView.tsx  
│   │   ├── [Feature]FormModal.tsx
│   │   ├── [Feature]Card.tsx
│   │   └── index.ts
│   └── shared/ (reuse existing components)
├── hooks/
│   ├── use[Feature].ts
│   └── use[Feature]Form.ts
├── lib/database/
│   ├── services/[feature].ts
│   └── repositories/[feature].ts
├── pages/
│   └── [PageName].tsx (main coordinator)
└── types/
    └── [feature].ts
```

## ✅ Definition of Done:
- [ ] All components under 200 lines
- [ ] Reusable patterns extracted to shared components
- [ ] Custom hooks handle complex state
- [ ] Error handling implemented
- [ ] Loading states working
- [ ] Mobile responsive
- [ ] TypeScript strict compliance
- [ ] Basic accessibility features
```

## 📁 Folder Structure Recommendations

### Enhanced Component Organization:
```
src/components/
├── shared/           # Reusable across features
│   ├── EntityCard.tsx
│   ├── CRUDModal.tsx
│   ├── TabPageLayout.tsx
│   ├── StatusBadge.tsx
│   ├── PositionEditor.tsx
│   └── EmptyState.tsx
├── risk-area/        # Feature-specific
│   ├── ZoneManagementTab.tsx
│   ├── MapManagementTab.tsx
│   ├── ZoneInfoCard.tsx
│   ├── ZoneFormModal.tsx
│   ├── MapView.tsx
│   └── index.ts
└── ui/              # Design system (existing)
    └── [existing shadcn components]
```

### Hook Organization:
```
src/hooks/
├── data/            # Data fetching & mutations
│   ├── useRiskZones.ts
│   ├── useEquipment.ts
│   └── useTasks.ts
├── ui/              # UI state management  
│   ├── useModalManager.ts
│   ├── useFormState.ts
│   └── useSelection.ts
└── shared/          # Cross-cutting concerns
    ├── use-error-handler.ts (existing)
    ├── use-toast.ts (existing)
    └── use-mobile.tsx (existing)
```

This architecture promotes:
- ✅ **Single Responsibility** - Each component has one clear purpose
- ✅ **Reusability** - Shared components work across features  
- ✅ **Testability** - Small, focused components are easy to test
- ✅ **Maintainability** - Changes are localized and predictable
- ✅ **Type Safety** - Strong TypeScript patterns throughout
- ✅ **Performance** - Lazy loading and optimal re-renders
``` 