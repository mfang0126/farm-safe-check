import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Re-export the main client for convenience
export { supabase };

// Type-safe client instance
export type DatabaseClient = typeof supabase;

// Database types for easy access
export type Tables = Database['public']['Tables'];
export type TablesInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type TablesUpdate<T extends keyof Tables> = Tables[T]['Update'];
export type TablesRow<T extends keyof Tables> = Tables[T]['Row'];

// Helper function to get the database client
export const getDatabase = () => supabase; 