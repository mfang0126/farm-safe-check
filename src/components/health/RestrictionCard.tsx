
import { Restriction } from '@/types/health';
import { Card, CardContent } from "@/components/ui/card";

interface RestrictionCardProps {
  restriction: Restriction;
}

const RestrictionCard = ({ restriction }: RestrictionCardProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Calculate days remaining until endDate
  const getDaysRemaining = (endDate: Date) => {
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{restriction.description}</h4>
            <p className="text-sm text-muted-foreground">
              {restriction.type}
            </p>
          </div>
          
          <div className="text-right text-sm">
            <div>Until: {formatDate(restriction.endDate || new Date())}</div>
            {restriction.endDate && (
              <div className={`text-xs mt-1 ${getDaysRemaining(restriction.endDate) < 14 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                {getDaysRemaining(restriction.endDate)} days remaining
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestrictionCard;
