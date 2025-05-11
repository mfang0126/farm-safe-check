
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileCheck, AlertTriangle, Search, User, Plus } from 'lucide-react';
import { mockWorkers } from './mock-data';

const WorkerProfiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  
  const filteredWorkers = mockWorkers.filter(worker => 
    worker.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.employment.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.employment.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getExpiringCount = (worker) => {
    return worker.certifications.filter(cert => 
      cert.status === 'pending_renewal' || cert.status === 'expired'
    ).length;
  };
  
  const getNextExpiry = (worker) => {
    const validCerts = worker.certifications
      .filter(cert => cert.status === 'pending_renewal')
      .sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());
    
    if (validCerts.length > 0) {
      const nextExpiry = validCerts[0];
      const daysToExpiry = Math.ceil(
        (nextExpiry.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return `${nextExpiry.name} - ${daysToExpiry} days`;
    }
    return 'None';
  };
  
  const handleSelectWorker = (workerId: string) => {
    setSelectedWorker(workerId === selectedWorker ? null : workerId);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search workers by name, ID, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="w-full md:w-auto">
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
                  <TableRow 
                    key={worker.id} 
                    className={`cursor-pointer hover:bg-muted/50 ${selectedWorker === worker.id ? 'bg-muted/50' : ''}`}
                    onClick={() => handleSelectWorker(worker.id)}
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        worker.employment.status === 'active' ? 'bg-green-100 text-green-800' : 
                        worker.employment.status === 'leave' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {worker.employment.status.charAt(0).toUpperCase() + worker.employment.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getExpiringCount(worker) > 0 ? (
                        <span className="flex items-center text-amber-600">
                          <AlertTriangle size={16} className="mr-1" />
                          {getExpiringCount(worker)}
                        </span>
                      ) : (
                        <span className="flex items-center text-green-600">
                          <FileCheck size={16} className="mr-1" />
                          None
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
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

const WorkerDetail = ({ workerId, onClose }) => {
  const worker = mockWorkers.find(w => w.id === workerId);
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
                <div 
                  key={cert.id} 
                  className={`p-3 rounded-lg border ${
                    cert.status === 'valid' ? 'border-green-200 bg-green-50' :
                    cert.status === 'pending_renewal' ? 'border-amber-200 bg-amber-50' :
                    'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {cert.status === 'valid' ? (
                        <FileCheck className="h-5 w-5 text-green-600 mr-2" />
                      ) : cert.status === 'pending_renewal' ? (
                        <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                      )}
                      <span className="font-medium">{cert.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {cert.issueDate.toLocaleDateString()} - {cert.expiryDate.toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm mt-1">Issued by: {cert.issuer}</p>
                  <div className="mt-2 flex justify-end gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs">View</Button>
                    <Button size="sm" className="h-7 text-xs">Renew</Button>
                  </div>
                </div>
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
                <div key={training.id} className="border rounded p-2">
                  <div className="font-medium">{training.training.title}</div>
                  <div className="text-sm text-muted-foreground flex justify-between">
                    <span>Completed: {training.completionDate.toLocaleDateString()}</span>
                    <span className={
                      training.status === 'completed' ? 'text-green-600' :
                      training.status === 'expired' ? 'text-red-600' :
                      'text-yellow-600'
                    }>
                      {training.status.charAt(0).toUpperCase() + training.status.slice(1)}
                    </span>
                  </div>
                </div>
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

export default WorkerProfiles;
