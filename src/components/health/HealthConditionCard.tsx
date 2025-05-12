
import { MedicalCondition } from '@/types/health';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HealthConditionCardProps {
  condition: MedicalCondition;
  onViewPlan?: (id: string) => void;
}

const HealthConditionCard = ({ condition, onViewPlan }: HealthConditionCardProps) => {
  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case 'severe':
        return <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium">Severe</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">Moderate</span>;
      case 'mild':
        return <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">Mild</span>;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long'
    }).format(date);
  };
  
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{condition.name}</h4>
              {getSeverityBadge(condition.severity)}
            </div>
            <p className="text-sm text-muted-foreground">
              Diagnosed: {formatDate(condition.diagnosedDate)}
            </p>
          </div>
          
          {condition.managementPlan && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewPlan && onViewPlan(condition.id)}
            >
              View Plan
            </Button>
          )}
        </div>
        
        {condition.triggers && (
          <div className="mt-2 text-sm">
            <span className="font-medium">Triggers:</span> {condition.triggers.join(', ')}
          </div>
        )}
        
        {condition.treatment && (
          <div className="mt-1 text-sm">
            <span className="font-medium">Treatment:</span> {condition.treatment}
          </div>
        )}
        
        {condition.workImpact && (
          <div className="mt-1 text-sm">
            <span className="font-medium">Work Impact:</span> {condition.workImpact}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthConditionCard;
