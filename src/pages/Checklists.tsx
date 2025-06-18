import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCheck, Plus, Search, Filter, CheckCircle, Edit, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { checklistService } from '@/lib/database/services/checklist';
import CreateTemplateModal from '@/components/checklists/CreateTemplateModal';
import EditTemplateModal from '@/components/checklists/EditTemplateModal';
import type { ChecklistTemplate, CompletedChecklist } from '@/lib/database/types';



const demoChecklist = {
  title: "Tractor Pre-Operation Safety Checklist",
  equipment: "John Deere 6M Series",
  sections: [
    {
      name: "Engine & Fluids",
      items: [
        { id: 1, text: "Engine oil level is adequate", checked: false },
        { id: 2, text: "Coolant level is adequate", checked: false },
        { id: 3, text: "Fuel level is adequate for planned operation", checked: false },
        { id: 4, text: "No visible fluid leaks", checked: false }
      ]
    },
    {
      name: "Safety Systems",
      items: [
        { id: 5, text: "ROPS (Roll-Over Protection Structure) is intact", checked: false },
        { id: 6, text: "Seatbelt functions properly", checked: false },
        { id: 7, text: "PTO shields are in place and undamaged", checked: false },
        { id: 8, text: "SMV (Slow Moving Vehicle) emblem is visible and clean", checked: false },
        { id: 9, text: "All warning lights function properly", checked: false }
      ]
    },
    {
      name: "Lights & Electronics",
      items: [
        { id: 10, text: "Headlights function properly", checked: false },
        { id: 11, text: "Tail lights function properly", checked: false },
        { id: 12, text: "Turn signals function properly", checked: false },
        { id: 13, text: "Horn functions properly", checked: false }
      ]
    },
    {
      name: "Tires & Brakes",
      items: [
        { id: 14, text: "Tire pressure is appropriate", checked: false },
        { id: 15, text: "No visible tire damage", checked: false },
        { id: 16, text: "Brakes function properly", checked: false },
        { id: 17, text: "Parking brake functions properly", checked: false }
      ]
    }
  ],
  notes: ""
};

const Checklists = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [runningCheck, setRunningCheck] = useState(false);
  const [checklist, setChecklist] = useState(demoChecklist);
  const [notes, setNotes] = useState("");
  
  // Template management state
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [completedChecklists, setCompletedChecklists] = useState<CompletedChecklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ChecklistTemplate | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CompletedChecklist | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    if (user) {
      loadTemplates();
      loadCompletedChecklists();
    }
  }, [user]);

  const loadTemplates = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const result = await checklistService.getTemplates(user.id);
      if (result.error) {
        toast({
          title: "Error Loading Templates",
          description: result.error.message,
          variant: "destructive"
        });
      } else {
        setTemplates(result.data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCompletedChecklists = async () => {
    if (!user) return;
    
    try {
      const result = await checklistService.getCompletedChecklists(user.id);
      if (result.error) {
        console.error("Error loading completed checklists:", result.error);
      } else {
        setCompletedChecklists(result.data || []);
      }
    } catch (error) {
      console.error("Failed to load completed checklists:", error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!user) return;
    
    try {
      const result = await checklistService.deleteTemplate(templateId, user.id);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Template Deleted",
          description: "Template has been deleted successfully.",
        });
        loadTemplates();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive"
      });
    }
  };

  const handleEditTemplate = (template: ChecklistTemplate) => {
    setEditingTemplate(template);
    setShowEditModal(true);
  };

  const handleTemplateCreated = () => {
    loadTemplates();
  };

  const handleTemplateUpdated = () => {
    loadTemplates();
    setEditingTemplate(null);
  };

  const handleViewDetails = (record: CompletedChecklist) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from templates
  const categories = Array.from(new Set(templates.map(t => t.category)));
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Passed': return 'text-green-700 bg-green-100';
      case 'Needs Maintenance': return 'text-amber-700 bg-amber-100';
      case 'Failed': return 'text-red-700 bg-red-100';
      default: return '';
    }
  };
  
  const handleCheckItem = (sectionIndex: number, itemId: number) => {
    setChecklist(prev => {
      const newSections = [...prev.sections];
      const itemIndex = newSections[sectionIndex].items.findIndex(item => item.id === itemId);
      
      newSections[sectionIndex].items[itemIndex] = {
        ...newSections[sectionIndex].items[itemIndex],
        checked: !newSections[sectionIndex].items[itemIndex].checked
      };
      
      return {
        ...prev,
        sections: newSections
      };
    });
  };
  
  const handleSubmitCheck = () => {
    // Count how many items are checked
    const totalItems = checklist.sections.reduce((total, section) => total + section.items.length, 0);
    const checkedItems = checklist.sections.reduce((total, section) => {
      return total + section.items.filter(item => item.checked).length;
    }, 0);
    
    if (checkedItems < totalItems) {
      toast({
        title: "Incomplete Checklist",
        description: `You've completed ${checkedItems} out of ${totalItems} items. Please verify all items or note exceptions.`,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Checklist Completed",
      description: "Your safety check has been recorded successfully.",
    });
    
    // Reset the form and go back to templates view
    setRunningCheck(false);
    setActiveTab("history");
    
    // Reset the checklist
    setChecklist({
      ...demoChecklist,
      sections: demoChecklist.sections.map(section => ({
        ...section,
        items: section.items.map(item => ({ ...item, checked: false }))
      }))
    });
    setNotes("");
  };

  return (
    <div className="space-y-6">
      {!runningCheck ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Safety Checklists</h1>
              <p className="text-gray-600 mt-1">Create and manage equipment safety checklists</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Create Template
              </Button>
              {/* TODO: Implement global "Run Check" functionality - currently unclear what this button should do */}
              <Button 
                onClick={() => setRunningCheck(true)}
                variant="outline"
                className="flex items-center gap-2"
                disabled={true}
              >
                <CheckCircle size={16} />
                Run Check
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates" className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search templates..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full lg:w-48">
                    <div className="flex items-center gap-2">
                      <Filter size={16} />
                      <SelectValue placeholder="All Categories" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="h-full">
                      <CardHeader>
                        <Skeleton className="h-6 w-20 mb-2" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </CardHeader>
                      <CardFooter className="pt-0">
                        <Skeleton className="h-8 w-16 mr-2" />
                        <Skeleton className="h-8 w-20" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <FileCheck size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {searchTerm || categoryFilter !== "all" ? "No templates found" : "No templates yet"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || categoryFilter !== "all" 
                      ? "Try adjusting your search or filter criteria"
                      : "Create your first checklist template to get started"
                    }
                  </p>
                  {(!searchTerm && categoryFilter === "all") && (
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus size={16} className="mr-2" />
                      Create Template
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className="h-full">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm text-primary bg-primary/10 px-2 py-1 rounded mb-2 w-fit">
                              {template.category}
                            </div>
                            <div className="text-xs text-gray-500">
                              {template.item_count} items
                            </div>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                <Trash2 size={14} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Template</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{template.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteTemplate(template.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex gap-2 pt-0">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" onClick={() => setRunningCheck(true)}>
                          <CheckCircle size={14} className="mr-1" />
                          Run Check
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Checklist History</CardTitle>
                  <CardDescription>
                    Review previously completed safety checklists
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {completedChecklists.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No completed checklists</h3>
                      <p className="text-gray-500">Your completed safety checks will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {completedChecklists.map((record) => (
                        <div key={record.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{record.equipment_name}</h4>
                            <p className="text-sm text-gray-600">{record.template_name}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>Completed by: {record.completed_by}</span>
                              <span>Date: {new Date(record.completed_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-xs ${getStatusClass(record.status)}`}>
                              {record.status}
                            </span>
                            {record.issues_count > 0 && (
                              <span className="text-xs text-amber-600">
                                {record.issues_count} issue{record.issues_count !== 1 ? 's' : ''}
                              </span>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(record)}
                              className="flex items-center gap-1"
                            >
                              <Eye size={14} />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{checklist.title}</h1>
              <p className="text-gray-600 mt-1">Equipment: {checklist.equipment}</p>
            </div>
            <Button variant="outline" onClick={() => setRunningCheck(false)}>
              Cancel
            </Button>
          </div>
          
          <div className="bg-white rounded-lg border p-6 space-y-8">
            {checklist.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">{section.name}</h3>
                <div className="space-y-3">
                  {section.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <Checkbox 
                        id={`item-${item.id}`} 
                        checked={item.checked}
                        onCheckedChange={() => handleCheckItem(sectionIndex, item.id)}
                        className="h-5 w-5"
                      />
                      <Label 
                        htmlFor={`item-${item.id}`}
                        className={`flex-1 ${item.checked ? 'line-through text-gray-500' : ''}`}
                      >
                        {item.text}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes:</Label>
              <Input 
                id="notes" 
                placeholder="Enter any issues, observations, or comments..." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <div className="pt-4 space-y-4">
              <div className="flex gap-4 items-center">
                <Label htmlFor="status">Safety Status:</Label>
                <Select defaultValue="passed">
                  <SelectTrigger id="status" className="w-[200px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passed">Passed</SelectItem>
                    <SelectItem value="needs-maintenance">Needs Maintenance</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="bg-primary hover:bg-primary-600 w-full" 
                size="lg" 
                onClick={handleSubmitCheck}
              >
                <CheckCircle size={16} className="mr-2" />
                Complete Safety Check
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals - Place outside conditional rendering so they're always available */}
      <CreateTemplateModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onTemplateCreated={handleTemplateCreated}
      />

      <EditTemplateModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        template={editingTemplate}
        onTemplateUpdated={handleTemplateUpdated}
      />

      {/* Checklist Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Checklist Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-6">
              {/* Header Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Equipment</Label>
                  <p className="text-lg font-semibold">{selectedRecord.equipment_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Template</Label>
                  <p className="text-lg font-semibold">{selectedRecord.template_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Completed By</Label>
                  <p>{selectedRecord.completed_by}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Completion Date</Label>
                  <p>{new Date(selectedRecord.completed_at).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(selectedRecord.status)}`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Issues Found</Label>
                  <p className={selectedRecord.issues_count > 0 ? "text-amber-600 font-medium" : "text-green-600"}>
                    {selectedRecord.issues_count > 0 
                      ? `${selectedRecord.issues_count} issue${selectedRecord.issues_count !== 1 ? 's' : ''}` 
                      : 'No issues'
                    }
                  </p>
                </div>
              </div>

              {/* Checklist Responses */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Checklist Responses</h3>
                <div className="space-y-4">
                  {selectedRecord.responses && Array.isArray(selectedRecord.responses) ? 
                    selectedRecord.responses.map((section, sectionIndex: number) => (
                      <div key={sectionIndex} className="border rounded-lg p-4">
                        {section.name && section.name.trim() && (
                          <h4 className="font-medium text-lg mb-3 border-b pb-2">{section.name}</h4>
                        )}
                        <div className="space-y-2">
                          {section.items?.map((item, itemIndex: number) => (
                            <div key={itemIndex} className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                item.checked 
                                  ? 'bg-green-500 border-green-500' 
                                  : 'border-gray-300'
                              }`}>
                                {item.checked && (
                                  <CheckCircle size={12} className="text-white" />
                                )}
                              </div>
                              <span className={item.checked ? 'text-gray-900' : 'text-red-600'}>
                                {item.text}
                              </span>
                            </div>
                          )) || []}
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-500 italic">No detailed responses available</p>
                    )
                  }
                </div>
              </div>

              {/* Notes */}
              {selectedRecord.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedRecord.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checklists;
