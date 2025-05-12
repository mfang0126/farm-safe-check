
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tractor, CheckSquare, Clock, BarChart3, FileText, Heart } from 'lucide-react';

export const QuickAccessTools = () => {
  const { toast } = useToast();
  
  const handleToolClick = (toolName: string) => {
    toast({
      title: `Navigating to ${toolName}`,
      description: `Opening the ${toolName} tool...`,
    });
  };
  
  return (
    <Card className="mt-8 hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Quick Access Tools</CardTitle>
        <CardDescription>All your essential farm safety tools in one place</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
            onClick={() => handleToolClick("Equipment Registry")}
            asChild
          >
            <Link to="/dashboard/equipment">
              <Tractor size={24} />
              <span>Equipment Registry</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
            onClick={() => handleToolClick("Safety Checklists")}
            asChild
          >
            <Link to="/dashboard/checklists">
              <CheckSquare size={24} />
              <span>Safety Checklists</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
            onClick={() => handleToolClick("Maintenance")}
            asChild
          >
            <Link to="/dashboard/maintenance">
              <Clock size={24} />
              <span>Maintenance</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
            onClick={() => handleToolClick("Risk Dashboard")}
            asChild
          >
            <Link to="/dashboard/risk">
              <BarChart3 size={24} />
              <span>Risk Dashboard</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
            onClick={() => handleToolClick("Resource Hub")}
            asChild
          >
            <Link to="/dashboard/resources">
              <FileText size={24} />
              <span>Resource Hub</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
            onClick={() => handleToolClick("Worker Health")}
            asChild
          >
            <Link to="/dashboard/health">
              <Heart size={24} />
              <span>Worker Health</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
