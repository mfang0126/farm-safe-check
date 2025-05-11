
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, User, Users, BookOpen } from 'lucide-react';
import WorkerProfiles from '@/components/training/WorkerProfiles';
import TrainingCalendar from '@/components/training/TrainingCalendar';
import ComplianceDashboard from '@/components/training/ComplianceDashboard';
import TrainingCourses from '@/components/training/TrainingCourses';

const TrainingRegister = () => {
  const [activeTab, setActiveTab] = useState('workers');
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Training Register</h1>
        <p className="text-muted-foreground">Manage worker certifications and training programs</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="workers" className="flex items-center gap-2">
            <Users size={16} />
            Worker Profiles
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar size={16} />
            Training Calendar
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen size={16} />
            Training Courses
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <User size={16} />
            Compliance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="workers" className="mt-4">
          <WorkerProfiles />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-4">
          <TrainingCalendar />
        </TabsContent>
        
        <TabsContent value="courses" className="mt-4">
          <TrainingCourses />
        </TabsContent>
        
        <TabsContent value="compliance" className="mt-4">
          <ComplianceDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingRegister;
