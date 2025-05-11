
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import IncidentForm from '@/components/incidents/IncidentForm';
import IncidentList from '@/components/incidents/IncidentList';
import IncidentDashboard from '@/components/incidents/IncidentDashboard';
import { Button } from "@/components/ui/button";
import { PlusCircle, List, LayoutDashboard } from 'lucide-react';

const IncidentReporting = () => {
  const [activeTab, setActiveTab] = useState('report');
  const { toast } = useToast();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Incident Reporting</h1>
          <p className="text-muted-foreground">Report, track, and manage safety incidents</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="report" className="flex items-center gap-2">
            <PlusCircle size={16} />
            Report
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List size={16} />
            Incidents
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard size={16} />
            Dashboard
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="report" className="mt-6">
          <IncidentForm onSubmitSuccess={() => {
            setActiveTab('list');
            toast({
              title: "Incident reported",
              description: "Your incident report has been submitted successfully.",
            });
          }} />
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          <IncidentList />
        </TabsContent>
        
        <TabsContent value="dashboard" className="mt-6">
          <IncidentDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IncidentReporting;
