import { supabase } from '../client';
import type {
  ChecklistTemplate,
  ChecklistTemplateInsert,
  ChecklistTemplateUpdate,
  ChecklistTemplateFilter,
  CompletedChecklist,
  CompletedChecklistInsert,
  CompletedChecklistUpdate,
  CompletedChecklistFilter,
  DatabaseResponse,
  DatabaseListResponse,
  QueryOptions
} from '../types';

/**
 * Repository for checklist operations
 * Provides data access layer for checklist templates and completed checklists
 */
export class ChecklistRepository {
  
  private handleError<T>(error: any): DatabaseResponse<T> {
    console.error('Checklist repository error:', error);
    return {
      data: null,
      error: new Error(error?.message || 'Database operation failed')
    };
  }

  private handleListError<T>(error: any): DatabaseListResponse<T> {
    console.error('Checklist repository error:', error);
    return {
      data: null,
      error: new Error(error?.message || 'Database operation failed'),
      count: 0
    };
  }

  // Checklist Templates
  async getTemplates(
    userId: string, 
    filter?: ChecklistTemplateFilter, 
    options?: QueryOptions
  ): Promise<DatabaseListResponse<ChecklistTemplate>> {
    try {
      let query = (supabase as any)
        .from('checklist_templates')
        .select('*', { count: 'exact' })
        .or(`user_id.eq.${userId},is_default.eq.true`);

      // Apply filters
      if (filter?.category) {
        query = query.eq('category', filter.category);
      }
      if (filter?.is_default !== undefined) {
        query = query.eq('is_default', filter.is_default);
      }

      // Apply query options
      if (options?.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending ?? true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 50)) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        data: data as ChecklistTemplate[],
        error: null,
        count: count || data?.length || 0
      };
    } catch (error) {
      return this.handleListError<ChecklistTemplate>(error);
    }
  }

  async getTemplateById(id: string, userId: string): Promise<DatabaseResponse<ChecklistTemplate>> {
    try {
      const { data, error } = await (supabase as any)
        .from('checklist_templates')
        .select('*')
        .eq('id', id)
        .or(`user_id.eq.${userId},is_default.eq.true`)
        .single();

      if (error) {
        throw error;
      }

      return {
        data: data as ChecklistTemplate,
        error: null
      };
    } catch (error) {
      return this.handleError<ChecklistTemplate>(error);
    }
  }

  async createTemplate(template: ChecklistTemplateInsert): Promise<DatabaseResponse<ChecklistTemplate>> {
    try {
      const { data, error } = await (supabase as any)
        .from('checklist_templates')
        .insert(template)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        data: data as ChecklistTemplate,
        error: null
      };
    } catch (error) {
      return this.handleError<ChecklistTemplate>(error);
    }
  }

  async updateTemplate(
    id: string, 
    userId: string, 
    updates: ChecklistTemplateUpdate
  ): Promise<DatabaseResponse<ChecklistTemplate>> {
    try {
      const { data, error } = await (supabase as any)
        .from('checklist_templates')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        data: data as ChecklistTemplate,
        error: null
      };
    } catch (error) {
      return this.handleError<ChecklistTemplate>(error);
    }
  }

  async deleteTemplate(id: string, userId: string): Promise<DatabaseResponse<boolean>> {
    try {
      const { error } = await (supabase as any)
        .from('checklist_templates')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return {
        data: true,
        error: null
      };
    } catch (error) {
      return this.handleError<boolean>(error);
    }
  }

  // Completed Checklists
  async getCompletedChecklists(
    userId: string, 
    filter?: CompletedChecklistFilter, 
    options?: QueryOptions
  ): Promise<DatabaseListResponse<CompletedChecklist>> {
    try {
      let query = (supabase as any)
        .from('completed_checklists')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // Apply filters
      if (filter?.status) {
        query = query.eq('status', filter.status);
      }
      if (filter?.template_id) {
        query = query.eq('template_id', filter.template_id);
      }
      if (filter?.equipment_id) {
        query = query.eq('equipment_id', filter.equipment_id);
      }
      if (filter?.completed_by) {
        query = query.ilike('completed_by', `%${filter.completed_by}%`);
      }

      // Apply query options
      if (options?.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending ?? true });
      } else {
        query = query.order('completed_at', { ascending: false });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 50)) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        data: data as CompletedChecklist[],
        error: null,
        count: count || data?.length || 0
      };
    } catch (error) {
      return this.handleListError<CompletedChecklist>(error);
    }
  }

  async getCompletedChecklistById(id: string, userId: string): Promise<DatabaseResponse<CompletedChecklist>> {
    try {
      const { data, error } = await (supabase as any)
        .from('completed_checklists')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }

      return {
        data: data as CompletedChecklist,
        error: null
      };
    } catch (error) {
      return this.handleError<CompletedChecklist>(error);
    }
  }

  async createCompletedChecklist(checklist: CompletedChecklistInsert): Promise<DatabaseResponse<CompletedChecklist>> {
    try {
      const { data, error } = await (supabase as any)
        .from('completed_checklists')
        .insert(checklist)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        data: data as CompletedChecklist,
        error: null
      };
    } catch (error) {
      return this.handleError<CompletedChecklist>(error);
    }
  }

  async updateCompletedChecklist(
    id: string, 
    userId: string, 
    updates: CompletedChecklistUpdate
  ): Promise<DatabaseResponse<CompletedChecklist>> {
    try {
      const { data, error } = await (supabase as any)
        .from('completed_checklists')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        data: data as CompletedChecklist,
        error: null
      };
    } catch (error) {
      return this.handleError<CompletedChecklist>(error);
    }
  }

  async deleteCompletedChecklist(id: string, userId: string): Promise<DatabaseResponse<boolean>> {
    try {
      const { error } = await (supabase as any)
        .from('completed_checklists')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return {
        data: true,
        error: null
      };
    } catch (error) {
      return this.handleError<boolean>(error);
    }
  }
}

// Export singleton instance
export const checklistRepository = new ChecklistRepository(); 