import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import useErrorHandler from '@/hooks/use-error-handler';
import { Tractor, CheckSquare, Clock, BarChart3, FileText, Heart } from 'lucide-react';

export const QuickAccessTools = () => {
  const { toast } = useToast();
  const { handleNavigation } = useErrorHandler();
  
  const handleToolClick = (toolName: string, path: string) => {
    toast({
      title: `Navigating to ${toolName}`,
      description: `Opening the ${toolName} tool...`,
    });
    
    // Use error handler for safe navigation
    handleNavigation(path);
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
            onClick={() => handleToolClick("Equipment Registry", "/dashboard/equipment")}
          >
            <Tractor size={24} />
            <span>Equipment Registry</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
            onClick={() => handleToolClick("Safety Checklists", "/dashboard/checklists")}
          >
            <CheckSquare size={24} />
            <span>Safety Checklists</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
            onClick={() => handleToolClick("Maintenance", "/dashboard/maintenance")}
          >
            <Clock size={24} />
            <span>Maintenance</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
            onClick={() => handleToolClick("Risk Dashboard", "/dashboard/risk")}
          >
            <BarChart3 size={24} />
            <span>Risk Dashboard</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center gap-2 opacity-50 cursor-not-allowed"
            disabled
          >
            <FileText size={24} />
            <span>Resource Hub</span>
          </Button>
          
          <Button 
            variant="outline"
            className="flex flex-col h-24 items-center justify-center gap-2 opacity-50 cursor-not-allowed"
            disabled
          >
            <Heart size={24} />
            <span>Worker Health</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
