import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCheck, Plus, Search, Filter, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const checklistTemplates = [
  {
    id: 1,
    title: "Tractor Pre-Operation Safety Checklist",
    description: "Standard safety check for all tractors before operation",
    category: "Tractors",
    items: 15,
    lastUsed: "2025-04-25"
  },
  {
    id: 2,
    title: "Harvester Safety Inspection",
    description: "Comprehensive harvester safety and maintenance check",
    category: "Harvesters",
    items: 20,
    lastUsed: "2025-04-20"
  },
  {
    id: 3,
    title: "Sprayer Equipment Safety Verification",
    description: "Safety check for chemical spraying equipment",
    category: "Sprayers",
    items: 18,
    lastUsed: "2025-04-15"
  },
  {
    id: 4,
    title: "Farm Vehicle Safety Inspection",
    description: "For ATVs, UTVs, and farm utility vehicles",
    category: "Vehicles",
    items: 12,
    lastUsed: "2025-04-10"
  }
];

const checklistHistory = [
  {
    id: 101,
    equipmentName: "John Deere 6M Tractor",
    templateName: "Tractor Pre-Operation Safety Checklist",
    completedBy: "John Farmer",
    completedOn: "2025-04-25",
    status: "Passed",
    issues: 0
  },
  {
    id: 102,
    equipmentName: "Case IH Harvester",
    templateName: "Harvester Safety Inspection",
    completedBy: "Mark Smith",
    completedOn: "2025-04-20",
    status: "Needs Maintenance",
    issues: 3
  },
  {
    id: 103,
    equipmentName: "Kubota Sprayer",
    templateName: "Sprayer Equipment Safety Verification",
    completedBy: "Sarah Jones",
    completedOn: "2025-04-15",
    status: "Passed",
    issues: 1
  }
];

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
  const [activeTab, setActiveTab] = React.useState("templates");
  const [runningCheck, setRunningCheck] = React.useState(false);
  const [checklist, setChecklist] = React.useState(demoChecklist);
  const [notes, setNotes] = React.useState("");
  const { toast } = useToast();
  
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
    !runningCheck ? (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Safety Checklists</h1>
            <p className="text-gray-600 mt-1">Create and manage equipment safety checklists</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => setRunningCheck(true)}
              className="flex items-center gap-2"
            >
              <FileCheck size={16} />
              Create Template
            </Button>
            <Button 
              onClick={() => setRunningCheck(true)}
              variant="outline"
              className="flex items-center gap-2"
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
                />
              </div>
              <Select>
                <SelectTrigger className="w-full lg:w-48">
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    <SelectValue placeholder="All Categories" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tractors">Tractors</SelectItem>
                  <SelectItem value="harvesters">Harvesters</SelectItem>
                  <SelectItem value="sprayers">Sprayers</SelectItem>
                  <SelectItem value="vehicles">Vehicles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {checklistTemplates.map((template) => (
                <Card key={template.id} className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-primary bg-primary/10 px-2 py-1 rounded mb-2 w-fit">
                          {template.category}
                        </div>
                        <div className="text-xs text-gray-500">
                          {template.items} items
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex gap-2 pt-0">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button size="sm" onClick={() => setRunningCheck(true)}>
                      Run Check
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
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
                <div className="space-y-4">
                  {checklistHistory.map((record) => (
                    <div key={record.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{record.equipmentName}</h4>
                        <p className="text-sm text-gray-600">{record.templateName}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Completed by: {record.completedBy}</span>
                          <span>Date: {record.completedOn}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusClass(record.status)}`}>
                          {record.status}
                        </span>
                        {record.issues > 0 && (
                          <span className="text-xs text-amber-600">
                            {record.issues} issue{record.issues !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
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
    )
  );
};

export default Checklists;
