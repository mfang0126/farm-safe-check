# Database Architecture

## Overview

This document outlines the improved database architecture for the FarmSafe application, focusing on maintainability, readability, and reusability. The new architecture follows a layered approach with clear separation of concerns.

## Architecture Principles

### 1. **Separation of Concerns**
- **Repository Layer**: Direct database access and query logic
- **Service Layer**: Business logic and validation
- **Component Layer**: UI and presentation logic

### 2. **Type Safety**
- Strongly typed throughout the application
- Generated types from database schema
- Consistent error handling

### 3. **Reusability**
- Modular structure with singleton services
- Consistent patterns across all entities
- Easy to extend with new features

### 4. **Maintainability**
- Centralized database operations
- Clear naming conventions
- Comprehensive error handling

## Folder Structure

```
src/lib/database/
├── index.ts                 # Main exports
├── client.ts                # Database client wrapper
├── types.ts                 # Application-specific types
├── utils.ts                 # Database utilities
├── repositories.ts          # Repository exports
├── services.ts              # Service exports
├── repositories/
│   ├── index.ts
│   ├── base.ts              # Base repository interface
│   ├── profiles.ts          # Profile repository
│   ├── equipment.ts         # Equipment repository (placeholder)
│   └── tasks.ts             # Tasks repository (placeholder)
└── services/
    ├── index.ts
    ├── auth.ts              # Authentication service
    ├── equipment.ts         # Equipment service
    └── tasks.ts             # Tasks service
```

## Layer Breakdown

### 1. Database Client (`src/lib/database/client.ts`)
- Wrapper around Supabase client
- Type-safe database operations
- Centralized client configuration

```typescript
import { supabase } from './client';
export type Tables = Database['public']['Tables'];
```

### 2. Types (`src/lib/database/types.ts`)
- Application-specific database types
- Request/Response interfaces
- Filter and query option types

```typescript
export interface Equipment {
  id: string;
  user_id: string;
  type: string;
  make_model: string;
  // ... other fields
}
```

### 3. Utilities (`src/lib/database/utils.ts`)
- Error handling functions
- Response builders
- Validation helpers
- Date formatting utilities

```typescript
export function handleDatabaseError(error: Error, operation: string): void;
export function validateRequiredFields<T>(data: T, fields: (keyof T)[]): ValidationResult;
```

### 4. Repository Layer (`src/lib/database/repositories/`)
- Direct database access
- CRUD operations
- Query building
- Data transformation

```typescript
export class ProfilesRepository {
  async getCurrentProfile(userId: string): Promise<DatabaseResponse<Profile>>;
  async updateProfile(userId: string, data: ProfileUpdate): Promise<DatabaseResponse<Profile>>;
}
```

### 5. Service Layer (`src/lib/database/services/`)
- Business logic
- Validation
- Cross-repository operations
- User notifications

```typescript
export class EquipmentService {
  async createEquipment(userId: string, data: EquipmentInsert);
  async getEquipmentStats(userId: string);
}
```

## Usage Patterns

### 1. **In Components**
```typescript
import { equipmentService } from '@/lib/database';

// In a React component
const { data: equipment } = await equipmentService.getUserEquipment(userId);
```

### 2. **Error Handling**
```typescript
const result = await equipmentService.createEquipment(userId, data);
if (result.error) {
  // Error already handled by service layer
  return;
}
// Success case
setEquipment(prev => [...prev, result.data]);
```

### 3. **Type Safety**
```typescript
// All operations are fully typed
const equipment: Equipment = result.data;
const filter: EquipmentFilter = { status: 'Passed', type: 'Tractor' };
```

## Migration from Current Architecture

### Current Issues
1. **Scattered Logic**: Database operations mixed with UI components
2. **Mock Data**: Multiple mock data files throughout the codebase
3. **No Consistency**: Different patterns for different features
4. **Limited Reusability**: Duplicate code across components

### Migration Steps

#### 1. **Replace AuthProvider Logic**
```typescript
// Before (in AuthProvider.tsx)
const updateProfile = async (data) => {
  const { error } = await supabase.from('profiles').update(data)...
};

// After (use service)
import { authService } from '@/lib/database';
const profile = await authService.updateUserProfile(userId, data);
```

#### 2. **Replace Mock Data**
```typescript
// Before (in Equipment.tsx)
const [equipment, setEquipment] = useState(mockEquipment);

// After (use service)
import { equipmentService } from '@/lib/database';
const { data: equipment } = await equipmentService.getUserEquipment(userId);
```

#### 3. **Standardize Error Handling**
```typescript
// Before (custom error handling in each component)
try {
  const { data, error } = await supabase...
  if (error) {
    toast.error(error.message);
  }
} catch (error) {
  console.error(error);
}

// After (handled by service layer)
const result = await equipmentService.createEquipment(userId, data);
// Errors automatically handled with user-friendly messages
```

## Database Schema Updates Needed

### 1. **Equipment Table**
```sql
CREATE TABLE public.equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL,
  make_model TEXT NOT NULL,
  operator TEXT NOT NULL,
  last_inspection DATE,
  next_inspection DATE,
  purchase_date DATE,
  status TEXT CHECK (status IN ('Passed', 'Needs Maintenance', 'Failed')) DEFAULT 'Passed',
  safety_features TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own equipment" ON equipment
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own equipment" ON equipment
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own equipment" ON equipment
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own equipment" ON equipment
  FOR DELETE USING (auth.uid() = user_id);
```

### 2. **Tasks Table**
```sql
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
  status TEXT CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')) DEFAULT 'Pending',
  assigned_to TEXT,
  due_date DATE,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create similar policies as equipment
```

## Benefits of New Architecture

### 1. **Maintainability**
- Centralized database logic
- Consistent error handling
- Easy to debug and test

### 2. **Readability**
- Clear separation of concerns
- Self-documenting code
- Standardized patterns

### 3. **Reusability**
- Modular services and repositories
- Shared utilities and types
- Easy to extend with new features

### 4. **Type Safety**
- Compile-time error detection
- Autocomplete and IntelliSense
- Reduced runtime errors

### 5. **Performance**
- Optimized queries
- Efficient data loading
- Minimal re-renders

## Best Practices

### 1. **Always use services in components**
```typescript
// ✅ Good
import { equipmentService } from '@/lib/database';
const equipment = await equipmentService.getUserEquipment(userId);

// ❌ Avoid
import { supabase } from '@/integrations/supabase';
const { data } = await supabase.from('equipment').select('*');
```

### 2. **Handle errors gracefully**
```typescript
// ✅ Good - Service handles error display
const result = await equipmentService.createEquipment(userId, data);
if (result.data) {
  // Handle success
}

// ❌ Avoid - Manual error handling
try {
  const result = await supabase.from('equipment').insert(data);
} catch (error) {
  toast.error(error.message);
}
```

### 3. **Use TypeScript types**
```typescript
// ✅ Good
const filter: EquipmentFilter = { status: 'Passed' };
const options: QueryOptions = { limit: 10, orderBy: 'created_at' };

// ❌ Avoid
const filter = { status: 'Passed' };
const options = { limit: 10, orderBy: 'created_at' };
```

### 4. **Keep repositories simple**
Repositories should only handle database operations, not business logic.

### 5. **Put business logic in services**
Services should handle validation, business rules, and orchestrate multiple repository calls.

## Future Extensions

### 1. **Caching Layer**
- Add Redis/memory caching
- Cache frequently accessed data
- Invalidate cache on updates

### 2. **Real-time Updates**
- Supabase real-time subscriptions
- Live data updates
- Optimistic updates

### 3. **Offline Support**
- Local storage fallback
- Sync when online
- Conflict resolution

### 4. **Advanced Querying**
- Full-text search
- Complex filters
- Aggregations and analytics

This architecture provides a solid foundation for the FarmSafe application that can scale and evolve with the project's needs. 