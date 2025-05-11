
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { WorkerProfile } from './types';
import WorkerStatusBadge from './WorkerStatusBadge';
import WorkerCertificationsStatus from './WorkerCertificationsStatus';

interface WorkerTableRowProps {
  worker: WorkerProfile;
  isSelected: boolean;
  onSelect: (workerId: string) => void;
}

const WorkerTableRow = ({ worker, isSelected, onSelect }: WorkerTableRowProps) => {
  return (
    <TableRow 
      key={worker.id} 
      className={`cursor-pointer hover:bg-muted/50 ${isSelected ? 'bg-muted/50' : ''}`}
      onClick={() => onSelect(worker.id)}
    >
      <TableCell className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {worker.personalInfo.photo ? (
            <img 
              src={worker.personalInfo.photo} 
              alt={`${worker.personalInfo.firstName} ${worker.personalInfo.lastName}`}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <User className="h-4 w-4 text-primary" />
          )}
        </div>
        <span>
          {worker.personalInfo.firstName} {worker.personalInfo.lastName}
        </span>
      </TableCell>
      <TableCell>{worker.employeeId}</TableCell>
      <TableCell>{worker.employment.position}</TableCell>
      <TableCell>{worker.employment.department}</TableCell>
      <TableCell>
        <WorkerStatusBadge status={worker.employment.status} />
      </TableCell>
      <TableCell>
        <WorkerCertificationsStatus worker={worker} />
      </TableCell>
      <TableCell className="text-right">
        <Button size="sm" variant="outline">
          View
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default WorkerTableRow;
