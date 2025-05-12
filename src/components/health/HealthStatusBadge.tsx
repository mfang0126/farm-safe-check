
import { FitnessStatus } from '@/types/health';

interface HealthStatusBadgeProps {
  status: FitnessStatus;
  restrictionsCount?: number;
  onClick?: () => void;
}

const HealthStatusBadge = ({ status, restrictionsCount = 0, onClick }: HealthStatusBadgeProps) => {
  const getStatusConfig = (status: FitnessStatus, hasRestrictions: boolean) => {
    const configs = {
      fit: { 
        color: 'green', 
        bgColor: 'bg-green-50', 
        textColor: 'text-green-700',
        borderColor: 'border-green-300',
        icon: '✓', 
        label: 'Fit for Work'
      },
      fit_with_restrictions: { 
        color: 'orange', 
        bgColor: 'bg-amber-50', 
        textColor: 'text-amber-700',
        borderColor: 'border-amber-300',
        icon: '⚠️', 
        label: 'Fit with Restrictions' 
      },
      temporarily_unfit: { 
        color: 'red', 
        bgColor: 'bg-red-50', 
        textColor: 'text-red-700',
        borderColor: 'border-red-300',
        icon: '✗', 
        label: 'Temporarily Unfit' 
      },
      permanently_unfit: { 
        color: 'darkred', 
        bgColor: 'bg-red-100', 
        textColor: 'text-red-900',
        borderColor: 'border-red-500',
        icon: '❌', 
        label: 'Permanently Unfit' 
      },
      assessment_required: { 
        color: 'blue', 
        bgColor: 'bg-blue-50', 
        textColor: 'text-blue-700',
        borderColor: 'border-blue-300',
        icon: '❓', 
        label: 'Assessment Required' 
      }
    };
    
    // If fit but has restrictions, use the restricted status
    if (status === 'fit' && hasRestrictions) {
      return configs.fit_with_restrictions;
    }
    
    return configs[status] || configs.assessment_required;
  };
  
  const hasRestrictions = restrictionsCount > 0;
  const statusConfig = getStatusConfig(status, hasRestrictions);
  
  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <span className="status-icon">{statusConfig.icon}</span>
      <span className="status-label font-medium">{statusConfig.label}</span>
      
      {hasRestrictions && (
        <span className="restriction-count px-1.5 py-0.5 bg-white rounded-md text-xs">
          ({restrictionsCount})
        </span>
      )}
    </div>
  );
};

export default HealthStatusBadge;
