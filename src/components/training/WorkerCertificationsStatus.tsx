
import { FileCheck, AlertTriangle } from 'lucide-react';
import { WorkerProfile } from './types';

interface WorkerCertificationsStatusProps {
  worker: WorkerProfile;
}

const WorkerCertificationsStatus = ({ worker }: WorkerCertificationsStatusProps) => {
  const getExpiringCount = (worker: WorkerProfile) => {
    return worker.certifications.filter(cert => 
      cert.status === 'pending_renewal' || cert.status === 'expired'
    ).length;
  };

  const expiringCount = getExpiringCount(worker);

  return (
    <>
      {expiringCount > 0 ? (
        <span className="flex items-center text-amber-600">
          <AlertTriangle size={16} className="mr-1" />
          {expiringCount}
        </span>
      ) : (
        <span className="flex items-center text-green-600">
          <FileCheck size={16} className="mr-1" />
          None
        </span>
      )}
    </>
  );
};

export default WorkerCertificationsStatus;
