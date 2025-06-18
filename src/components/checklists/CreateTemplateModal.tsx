import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, GripVertical, ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { checklistService } from '@/lib/database/services/checklist';
import type { ChecklistSection, ChecklistItem } from '@/lib/database/types';

interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateCreated: () => void;
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

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  open,
  onOpenChange,
  onTemplateCreated
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TemplateFormData>({
    title: '',
    description: '',
    category: '',
    sections: [
      {
        name: 'General Safety',
        items: [
          { id: 1, text: 'Visual inspection completed', checked: false }
        ]
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      title: '',
      description: '',
      category: '',
      sections: [
        {
          name: 'General Safety',
          items: [
            { id: 1, text: 'Visual inspection completed', checked: false }
          ]
        }
      ]
    });
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  // Step 1: Basic Information
  const renderBasicInfoStep = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Template Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Tractor Pre-Operation Safety Checklist"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of what this checklist covers"
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
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
  );

  // Step 2: Sections and Items
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

  const renderSectionsStep = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Checklist Sections</h3>
        <Button onClick={addSection} size="sm" variant="outline">
          <Plus size={16} className="mr-1" />
          Add Section
        </Button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
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
  );

  // Step 3: Review
  const getTotalItemCount = () => {
    return formData.sections.reduce((total, section) => total + section.items.length, 0);
  };

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Review Template</h3>
        
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div>
            <Label className="font-semibold">Title:</Label>
            <p className="text-gray-700">{formData.title}</p>
          </div>
          
          {formData.description && (
            <div>
              <Label className="font-semibold">Description:</Label>
              <p className="text-gray-700">{formData.description}</p>
            </div>
          )}
          
          <div>
            <Label className="font-semibold">Category:</Label>
            <Badge variant="secondary" className="ml-2">{formData.category}</Badge>
          </div>
          
          <div>
            <Label className="font-semibold">Summary:</Label>
            <p className="text-gray-700">
              {formData.sections.length} sections, {getTotalItemCount()} total items
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Sections Preview:</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {formData.sections.map((section, index) => (
            <Card key={index} className="bg-gray-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{section.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <li key={item.id} className="flex items-center">
                      <span className="w-4 h-4 border rounded mr-2"></span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() && formData.category;
      case 2:
        return formData.sections.length > 0 && 
               formData.sections.every(section => 
                 section.name.trim() && 
                 section.items.length > 0 && 
                 section.items.every(item => item.text.trim())
               );
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed() || !user) return;

    setLoading(true);
    try {
      const templateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        item_count: getTotalItemCount(),
        sections: formData.sections
      };

      const result = await checklistService.createTemplate(user.id, templateData);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      toast({
        title: "Template Created",
        description: `"${formData.title}" has been created successfully.`,
      });
      
      onTemplateCreated();
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Basic Info", component: renderBasicInfoStep },
    { number: 2, title: "Sections & Items", component: renderSectionsStep },
    { number: 3, title: "Review", component: renderReviewStep }
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create New Checklist Template</DialogTitle>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className={`flex items-center gap-2 ${
                  currentStep === step.number 
                    ? 'text-primary' 
                    : currentStep > step.number 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep === step.number 
                      ? 'bg-primary text-white' 
                      : currentStep > step.number 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200'
                  }`}>
                    {step.number}
                  </div>
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-px ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {steps[currentStep - 1].component()}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            variant="outline"
            disabled={currentStep === 1}
          >
            <ArrowLeft size={16} className="mr-1" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            
            {currentStep < steps.length ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight size={16} className="ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
              >
                <Save size={16} className="mr-1" />
                {loading ? 'Creating...' : 'Create Template'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateModal; 