import { toast } from 'sonner';
import type { DatabaseResponse, DatabaseListResponse, QueryOptions } from './types';

/**
 * Handle database errors consistently across the application
 */
export function handleDatabaseError(error: Error, operation: string): void {
  console.error(`Database error during ${operation}:`, error);
  
  // User-friendly error messages
  let message = `An error occurred during ${operation}`;
  
  if (error.message.includes('duplicate key')) {
    message = 'This record already exists';
  } else if (error.message.includes('not found')) {
    message = 'Record not found';
  } else if (error.message.includes('permission')) {
    message = 'You do not have permission to perform this action';
  } else if (error.message.includes('network')) {
    message = 'Network error. Please check your connection';
  }
  
  toast.error(message);
}

/**
 * Create a successful database response
 */
export function createSuccessResponse<T>(data: T): DatabaseResponse<T> {
  return { data, error: null };
}

/**
 * Create a successful database list response
 */
export function createSuccessListResponse<T>(data: T[], count?: number): DatabaseListResponse<T> {
  return { data, error: null, count };
}

/**
 * Create an error database response
 */
export function createErrorResponse<T>(error: Error): DatabaseResponse<T> {
  return { data: null, error };
}

/**
 * Create an error database list response
 */
export function createErrorListResponse<T>(error: Error): DatabaseListResponse<T> {
  return { data: null, error };
}

/**
 * Build query options for Supabase queries
 * Returns a configured query builder function
 */
export function buildQueryOptions(options?: QueryOptions) {
  return (query: any) => {
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.offset(options.offset);
    }
    
    if (options?.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.ascending ?? true
      });
    }
    
    return query;
  };
}

/**
 * Convert database timestamps to local date strings
 */
export function formatDatabaseDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

/**
 * Convert database timestamps to local datetime strings
 */
export function formatDatabaseDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

/**
 * Generate a database-safe slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Validate required fields before database operations
 */
export function validateRequiredFields<T extends Record<string, unknown>>(
  data: T,
  requiredFields: (keyof T)[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && (data[field] as string).trim() === '')) {
      missingFields.push(String(field));
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
} 