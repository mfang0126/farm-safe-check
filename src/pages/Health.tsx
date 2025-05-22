
import DashboardLayout from '@/components/DashboardLayout';
import HealthProfile from '@/components/health/HealthProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Health = () => {
  // In a real application, this would come from the authenticated user
  // or route params
  const workerId = '1';
  
  return (
    <DashboardLayout>
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary-700">Worker Health</h1>
            <p className="text-muted-foreground mt-1">
              Manage worker health profiles, medical accommodations, and fitness for work.
            </p>
          </div>
          
          <div className="flex space-x-2">
            <div className="bg-primary-50 px-3 py-1 rounded-full text-sm text-primary border border-primary-100">
              Health Module Active
            </div>
          </div>
        </div>
        
        <HealthProfile workerId={workerId} />
      </div>
    </DashboardLayout>
  );
};

export default Health;
