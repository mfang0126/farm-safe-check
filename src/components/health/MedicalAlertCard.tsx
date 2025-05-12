
import { MedicalAlertLevel } from '@/types/health';
import { Button } from '@/components/ui/button';

interface Action {
  id: string;
  type: string;
  label: string;
}

interface MedicalAlertProps {
  title: string;
  description: string;
  level?: MedicalAlertLevel;
  instructions?: string[];
  expiresAt?: Date;
  actions?: Action[];
  onActionClick?: (action: Action) => void;
}

const MedicalAlertCard = ({ 
  title, 
  description, 
  level = 'normal', 
  instructions,
  expiresAt,
  actions,
  onActionClick 
}: MedicalAlertProps) => {
  const getLevelStyles = (level: MedicalAlertLevel) => {
    const styles = {
      critical: {
        borderColor: 'border-red-500',
        bgColor: 'bg-red-50',
        textColor: 'text-red-800',
        icon: '🚨'
      },
      high: {
        borderColor: 'border-amber-500',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-800',
        icon: '⚠️'
      },
      medium: {
        borderColor: 'border-yellow-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-800',
        icon: '⚠️'
      },
      normal: {
        borderColor: 'border-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-800',
        icon: 'ℹ️'
      }
    };
    return styles[level] || styles.normal;
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  const styles = getLevelStyles(level);
  
  return (
    <div 
      className={`rounded-md border-2 border-l-8 ${styles.borderColor} ${styles.bgColor} ${styles.textColor} p-4 mb-3`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{styles.icon}</span>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      
      <div className="ml-7">
        <p className="mb-2">{description}</p>
        
        {instructions && instructions.length > 0 && (
          <div className="mt-2">
            <strong>Instructions:</strong>
            <ul className="list-disc ml-5 mt-1">
              {instructions.map((instruction, idx) => (
                <li key={idx}>{instruction}</li>
              ))}
            </ul>
          </div>
        )}
        
        {expiresAt && (
          <div className="text-sm mt-2">
            Expires: {formatDate(expiresAt)}
          </div>
        )}
        
        {actions && actions.length > 0 && (
          <div className="flex gap-2 mt-3">
            {actions.map((action) => (
              <Button 
                key={action.id}
                variant={action.type === 'primary' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onActionClick && onActionClick(action)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalAlertCard;
