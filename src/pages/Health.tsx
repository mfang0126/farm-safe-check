
import HealthProfile from '@/components/health/HealthProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Health = () => {
  // In a real application, this would come from the authenticated user
  // or route params
  const workerId = '1';
  
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Worker Health</h1>
      <p className="text-muted-foreground">
        Manage worker health profiles, medical accommodations, and fitness for work.
      </p>
      
      <HealthProfile workerId={workerId} />
    </div>
  );
};

export default Health;
