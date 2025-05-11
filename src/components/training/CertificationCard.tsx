
import { FileCheck, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Certification } from './types';

interface CertificationCardProps {
  certification: Certification;
}

const CertificationCard = ({ certification }: CertificationCardProps) => {
  return (
    <div 
      className={`p-3 rounded-lg border ${
        certification.status === 'valid' ? 'border-green-200 bg-green-50' :
        certification.status === 'pending_renewal' ? 'border-amber-200 bg-amber-50' :
        'border-red-200 bg-red-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {certification.status === 'valid' ? (
            <FileCheck className="h-5 w-5 text-green-600 mr-2" />
          ) : certification.status === 'pending_renewal' ? (
            <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          )}
          <span className="font-medium">{certification.name}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 inline mr-1" />
          {certification.issueDate.toLocaleDateString()} - {certification.expiryDate.toLocaleDateString()}
        </div>
      </div>
      <p className="text-sm mt-1">Issued by: {certification.issuer}</p>
      <div className="mt-2 flex justify-end gap-2">
        <Button size="sm" variant="outline" className="h-7 text-xs">View</Button>
        <Button size="sm" className="h-7 text-xs">Renew</Button>
      </div>
    </div>
  );
};

export default CertificationCard;
