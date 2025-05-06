
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Tractor, BarChart3 } from 'lucide-react';

// Import refactored components
import { OverviewTab } from '@/components/dashboard/tabs/OverviewTab';
import { EquipmentTab } from '@/components/dashboard/tabs/EquipmentTab';
import { AnalyticsTab } from '@/components/dashboard/tabs/AnalyticsTab';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your farm safety hub</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard size={16} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              <Tractor size={16} />
              Equipment
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Analytics
            </TabsTrigger>
          </TabsList>
        
          <TabsContent value="overview" className="m-0">
            <OverviewTab />
          </TabsContent>
          
          <TabsContent value="equipment" className="m-0">
            <EquipmentTab />
          </TabsContent>
          
          <TabsContent value="analytics" className="m-0">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
