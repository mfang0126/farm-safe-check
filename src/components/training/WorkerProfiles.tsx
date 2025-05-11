
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { mockWorkers } from './mock-data';
import WorkerSearchBar from './WorkerSearchBar';
import WorkerTableRow from './WorkerTableRow';
import WorkerDetail from './WorkerDetail';
import { WorkerProfile } from './types';

interface WorkerProfilesProps {
  onAddWorker: () => void;
}

const WorkerProfiles = ({ onAddWorker }: WorkerProfilesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  
  const filteredWorkers: WorkerProfile[] = mockWorkers.filter(worker => 
    worker.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.employment.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.employment.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelectWorker = (workerId: string) => {
    setSelectedWorker(workerId === selectedWorker ? null : workerId);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
        <WorkerSearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
        />
        <Button className="w-full md:w-auto" onClick={onAddWorker}>
          <Plus size={16} className="mr-2" />
          Add New Worker
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="px-6 py-4 bg-muted/50">
          <CardTitle className="text-lg">Worker Profiles</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiring</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.length > 0 ? (
                filteredWorkers.map(worker => (
                  <WorkerTableRow
                    key={worker.id}
                    worker={worker}
                    isSelected={selectedWorker === worker.id}
                    onSelect={handleSelectWorker}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No workers found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedWorker && (
        <WorkerDetail workerId={selectedWorker} onClose={() => setSelectedWorker(null)} />
      )}
    </div>
  );
};

export default WorkerProfiles;
