
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileCheck } from 'lucide-react';
import { mockWorkers } from './mock-data';
import CertificationCard from './CertificationCard';
import TrainingHistoryItem from './TrainingHistoryItem';
import { WorkerProfile } from './types';

interface WorkerDetailProps {
  workerId: string;
  onClose: () => void;
}

const WorkerDetail = ({ workerId, onClose }: WorkerDetailProps) => {
  const worker: WorkerProfile | undefined = mockWorkers.find(w => w.id === workerId);
  if (!worker) return null;
  
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <div>
          <CardTitle>{worker.personalInfo.firstName} {worker.personalInfo.lastName}</CardTitle>
          <p className="text-sm text-muted-foreground">ID: {worker.employeeId}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">Edit</Button>
          <Button size="sm" variant="outline">Print Card</Button>
          <Button size="sm" variant="outline">Export</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Active Certifications</h3>
            <div className="space-y-3">
              {worker.certifications.map(cert => (
                <CertificationCard key={cert.id} certification={cert} />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Overview</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="font-medium">Position</dt>
              <dd>{worker.employment.position}</dd>
              
              <dt className="font-medium">Department</dt>
              <dd>{worker.employment.department}</dd>
              
              <dt className="font-medium">Start Date</dt>
              <dd>{worker.employment.startDate.toLocaleDateString()}</dd>
              
              <dt className="font-medium">Email</dt>
              <dd>{worker.personalInfo.email}</dd>
              
              <dt className="font-medium">Phone</dt>
              <dd>{worker.personalInfo.phone}</dd>
            </dl>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Recent Training</h3>
            <div className="space-y-2">
              {worker.trainingHistory.slice(0, 3).map(training => (
                <TrainingHistoryItem key={training.id} training={training} />
              ))}
            </div>
            
            <div className="mt-4 space-y-2">
              <Button className="w-full">
                <Plus size={16} className="mr-2" />
                Enroll in Training
              </Button>
              <Button variant="outline" className="w-full">
                <FileCheck size={16} className="mr-2" />
                Update Certifications
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkerDetail;
