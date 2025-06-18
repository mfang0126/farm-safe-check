import { checklistRepository } from '../repositories/checklist';
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
 * Service layer for checklist operations
 * Provides business logic and data transformation for checklist features
 */
export class ChecklistService {
  
  // Checklist Templates
  async getTemplates(
    userId: string, 
    filter?: ChecklistTemplateFilter, 
    options?: QueryOptions
  ): Promise<DatabaseListResponse<ChecklistTemplate>> {
    return checklistRepository.getTemplates(userId, filter, options);
  }

  async getTemplateById(id: string, userId: string): Promise<DatabaseResponse<ChecklistTemplate>> {
    return checklistRepository.getTemplateById(id, userId);
  }

  async createTemplate(userId: string, template: Omit<ChecklistTemplateInsert, 'user_id'>): Promise<DatabaseResponse<ChecklistTemplate>> {
    const templateData: ChecklistTemplateInsert = {
      ...template,
      user_id: userId
    };
    return checklistRepository.createTemplate(templateData);
  }

  async updateTemplate(
    id: string, 
    userId: string, 
    updates: ChecklistTemplateUpdate
  ): Promise<DatabaseResponse<ChecklistTemplate>> {
    return checklistRepository.updateTemplate(id, userId, updates);
  }

  async deleteTemplate(id: string, userId: string): Promise<DatabaseResponse<boolean>> {
    return checklistRepository.deleteTemplate(id, userId);
  }

  async getTemplatesByCategory(
    userId: string, 
    category: string
  ): Promise<DatabaseListResponse<ChecklistTemplate>> {
    return checklistRepository.getTemplates(userId, { category });
  }

  // Completed Checklists
  async getCompletedChecklists(
    userId: string, 
    filter?: CompletedChecklistFilter, 
    options?: QueryOptions
  ): Promise<DatabaseListResponse<CompletedChecklist>> {
    return checklistRepository.getCompletedChecklists(userId, filter, options);
  }

  async getCompletedChecklistById(id: string, userId: string): Promise<DatabaseResponse<CompletedChecklist>> {
    return checklistRepository.getCompletedChecklistById(id, userId);
  }

  async createCompletedChecklist(
    userId: string, 
    checklist: Omit<CompletedChecklistInsert, 'user_id'>
  ): Promise<DatabaseResponse<CompletedChecklist>> {
    // Calculate issues count from responses
    const issuesCount = this.calculateIssuesCount(checklist.responses, checklist.status);
    
    const checklistData: CompletedChecklistInsert = {
      ...checklist,
      user_id: userId,
      issues_count: issuesCount
    };
    
    return checklistRepository.createCompletedChecklist(checklistData);
  }

  async updateCompletedChecklist(
    id: string, 
    userId: string, 
    updates: CompletedChecklistUpdate
  ): Promise<DatabaseResponse<CompletedChecklist>> {
    // Recalculate issues count if responses or status changed
    if (updates.responses || updates.status) {
      const current = await checklistRepository.getCompletedChecklistById(id, userId);
      if (current.data) {
        const responses = updates.responses || current.data.responses;
        const status = updates.status || current.data.status;
        updates.issues_count = this.calculateIssuesCount(responses, status);
      }
    }
    
    return checklistRepository.updateCompletedChecklist(id, userId, updates);
  }

  async deleteCompletedChecklist(id: string, userId: string): Promise<DatabaseResponse<boolean>> {
    return checklistRepository.deleteCompletedChecklist(id, userId);
  }

  async getCompletedChecklistsByStatus(
    userId: string, 
    status: CompletedChecklist['status']
  ): Promise<DatabaseListResponse<CompletedChecklist>> {
    return checklistRepository.getCompletedChecklists(userId, { status });
  }

  async getCompletedChecklistsByTemplate(
    userId: string, 
    templateId: string
  ): Promise<DatabaseListResponse<CompletedChecklist>> {
    return checklistRepository.getCompletedChecklists(userId, { template_id: templateId });
  }

  async getRecentCompletedChecklists(
    userId: string, 
    limit: number = 10
  ): Promise<DatabaseListResponse<CompletedChecklist>> {
    return checklistRepository.getCompletedChecklists(
      userId, 
      {}, 
      { limit, orderBy: 'completed_at', ascending: false }
    );
  }

  // Helper methods
  private calculateIssuesCount(responses: unknown, status: string): number {
    if (status === 'Failed') {
      return 1; // At least one issue if failed
    }
    
    // For now, return 0 for passed/maintenance status
    // In a full implementation, you could count unchecked items or other criteria
    return status === 'Needs Maintenance' ? 1 : 0;
  }

  // Utility methods for working with checklist data
  getTotalItemCount(template: ChecklistTemplate): number {
    return template.sections.reduce((total, section) => total + section.items.length, 0);
  }

  getCompletedItemCount(responses: unknown[]): number {
    if (!Array.isArray(responses)) return 0;
    
    let count = 0;
    for (const section of responses) {
      if (section && typeof section === 'object' && 'items' in section && Array.isArray(section.items)) {
        for (const item of section.items) {
          if (item && typeof item === 'object' && 'checked' in item && item.checked) {
            count++;
          }
        }
      }
    }
    return count;
  }

  getCompletionPercentage(template: ChecklistTemplate, responses: unknown[]): number {
    const totalItems = this.getTotalItemCount(template);
    const completedItems = this.getCompletedItemCount(responses);
    
    if (totalItems === 0) return 0;
    return Math.round((completedItems / totalItems) * 100);
  }
}

// Export singleton instance
export const checklistService = new ChecklistService(); 