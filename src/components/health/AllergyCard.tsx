
import { Allergy } from '@/types/health';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AllergyCardProps {
  allergy: Allergy;
  onViewPlan?: (id: string) => void;
}

const AllergyCard = ({ allergy, onViewPlan }: AllergyCardProps) => {
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
  
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{allergy.allergen}</h4>
              {getSeverityBadge(allergy.severity)}
            </div>
            <p className="text-sm">
              <span className="font-medium">Reaction:</span> {allergy.reaction}
            </p>
          </div>
          
          {allergy.managementPlan && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewPlan && onViewPlan(allergy.id)}
            >
              View Plan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AllergyCard;
