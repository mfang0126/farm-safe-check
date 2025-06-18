import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, GripVertical, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { checklistService } from '@/lib/database/services/checklist';
import type { ChecklistTemplate, ChecklistSection, ChecklistItem } from '@/lib/database/types';

interface EditTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: ChecklistTemplate | null;
  onTemplateUpdated: () => void;
}

interface TemplateFormData {
  title: string;
  description: string;
  category: string;
  sections: ChecklistSection[];
}

const defaultCategories = [
  'Tractors',
  'Harvesters', 
  'Sprayers',
  'Vehicles',
  'Tools',
  'Safety Equipment',
  'Irrigation',
  'Storage'
];

const EditTemplateModal: React.FC<EditTemplateModalProps> = ({
  open,
  onOpenChange,
  template,
  onTemplateUpdated
}) => {
  const [formData, setFormData] = useState<TemplateFormData>({
    title: '',
    description: '',
    category: '',
    sections: []
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize form data when template changes
  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title,
        description: template.description || '',
        category: template.category,
        sections: JSON.parse(JSON.stringify(template.sections)) // Deep copy
      });
    }
  }, [template]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      sections: []
    });
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  // Section management
  const addSection = () => {
    const newSection: ChecklistSection = {
      name: `Section ${formData.sections.length + 1}`,
      items: [
        { id: Date.now(), text: 'New checklist item', checked: false }
      ]
    };
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const removeSection = (sectionIndex: number) => {
    if (formData.sections.length <= 1) {
      toast({
        title: "Cannot Remove Section",
        description: "Template must have at least one section.",
        variant: "destructive"
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== sectionIndex)
    }));
  };

  const updateSectionName = (sectionIndex: number, name: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) => 
        index === sectionIndex ? { ...section, name } : section
      )
    }));
  };

  // Item management
  const addItem = (sectionIndex: number) => {
    const newItem: ChecklistItem = {
      id: Date.now(),
      text: 'New checklist item',
      checked: false
    };
    
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) => 
        index === sectionIndex 
          ? { ...section, items: [...section.items, newItem] }
          : section
      )
    }));
  };

  const removeItem = (sectionIndex: number, itemId: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) => 
        index === sectionIndex 
          ? { 
              ...section, 
              items: section.items.filter(item => item.id !== itemId)
            }
          : section
      )
    }));
  };

  const updateItemText = (sectionIndex: number, itemId: number, text: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) => 
        index === sectionIndex 
          ? {
              ...section,
              items: section.items.map(item => 
                item.id === itemId ? { ...item, text } : item
              )
            }
          : section
      )
    }));
  };

  const getTotalItemCount = () => {
    return formData.sections.reduce((total, section) => total + section.items.length, 0);
  };

  const canSave = () => {
    return formData.title.trim() && 
           formData.category &&
           formData.sections.length > 0 && 
           formData.sections.every(section => 
             section.name.trim() && 
             section.items.length > 0 && 
             section.items.every(item => item.text.trim())
           );
  };

  const handleSubmit = async () => {
    if (!canSave() || !template || !user) return;

    setLoading(true);
    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        item_count: getTotalItemCount(),
        sections: formData.sections
      };

      const result = await checklistService.updateTemplate(template.id, user.id, updateData);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      toast({
        title: "Template Updated",
        description: `"${formData.title}" has been updated successfully.`,
      });
      
      onTemplateUpdated();
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit Template: {template.title}</DialogTitle>
          <div className="text-sm text-gray-500">
            {formData.sections.length} sections, {getTotalItemCount()} total items
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Template Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Tractor Pre-Operation Safety Checklist"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of what this checklist covers"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Sections and Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Checklist Sections</h3>
              <Button onClick={addSection} size="sm" variant="outline">
                <Plus size={16} className="mr-1" />
                Add Section
              </Button>
            </div>

            <div className="space-y-4">
              {formData.sections.map((section, sectionIndex) => (
                <Card key={sectionIndex}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical size={16} className="text-gray-400" />
                      <Input
                        value={section.name}
                        onChange={(e) => updateSectionName(sectionIndex, e.target.value)}
                        className="font-semibold"
                        placeholder="Section name"
                      />
                      <Button
                        onClick={() => removeSection(sectionIndex)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <GripVertical size={14} className="text-gray-400" />
                        <Input
                          value={item.text}
                          onChange={(e) => updateItemText(sectionIndex, item.id, e.target.value)}
                          placeholder="Checklist item description"
                          className="flex-1"
                        />
                        <Button
                          onClick={() => removeItem(sectionIndex, item.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => addItem(sectionIndex)}
                      size="sm"
                      variant="outline"
                      className="w-full mt-2"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Item
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{formData.category}</Badge>
            <span className="text-sm text-gray-500">
              {formData.sections.length} sections, {getTotalItemCount()} items
            </span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSave() || loading}
            >
              <Save size={16} className="mr-1" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTemplateModal; 