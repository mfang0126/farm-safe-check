
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SafetyIncident } from '@/types/incidents';
import { format } from 'date-fns';
import { MapPin, User, Users, AlertTriangle, Calendar, FileText, Camera, CheckCircle2 } from 'lucide-react';

interface IncidentDetailsProps {
  incident: SafetyIncident;
  isOpen: boolean;
  onClose: () => void;
}

const getSeverityConfig = (severity: string) => {
  const configs = {
    'low': { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: null },
    'medium': { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: null },
    'high': { color: 'bg-orange-50 text-orange-700 border-orange-200', icon: AlertTriangle },
    'critical': { color: 'bg-red-50 text-red-700 border-red-200', icon: AlertTriangle }
  };
  return configs[severity as keyof typeof configs] || configs.medium;
};

const getStatusConfig = (status: string) => {
  const configs = {
    'reported': { color: 'bg-blue-100 text-blue-800' },
    'investigating': { color: 'bg-yellow-100 text-yellow-800' },
    'mitigated': { color: 'bg-green-100 text-green-800' },
    'resolved': { color: 'bg-gray-100 text-gray-800' }
  };
  return configs[status as keyof typeof configs] || configs.reported;
};

const IncidentDetails = ({ incident, isOpen, onClose }: IncidentDetailsProps) => {
  const severityConfig = getSeverityConfig(incident.severity);
  const statusConfig = getStatusConfig(incident.status);
  const SeverityIcon = severityConfig.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">Incident Report</DialogTitle>
            <Badge className={statusConfig.color}>
              {incident.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="investigation">Investigation</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-semibold">{incident.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Calendar className="mr-1 h-4 w-4" />
                {format(new Date(incident.date), 'PPP p')}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Type</div>
                <div className="font-medium capitalize">{incident.type.replace('-', ' ')}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Severity</div>
                <div className="font-medium">
                  <Badge variant="outline" className={`${severityConfig.color} border`}>
                    {SeverityIcon && <SeverityIcon className="mr-1 h-3 w-3" />}
                    {incident.severity} severity
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="flex items-center font-medium">
                  <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                  {incident.location}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Reported by</div>
                <div className="flex items-center font-medium">
                  <User className="mr-1 h-4 w-4 text-muted-foreground" />
                  {incident.reportedBy}
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Description</div>
              <p className="mt-1 text-gray-800">{incident.description}</p>
            </div>
            
            {/* Evidence section - in a real app, these would be actual files */}
            <div className="space-y-3">
              <h4 className="text-md font-medium">Evidence</h4>
              
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Camera className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  No evidence has been added yet.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="investigation" className="pt-4">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Investigation not started</h3>
              <p className="text-muted-foreground mb-4">
                The investigation phase has not been started for this incident.
              </p>
              <Button variant="outline" disabled>
                Start Investigation
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="actions" className="pt-4">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No actions assigned</h3>
              <p className="text-muted-foreground mb-4">
                There are no corrective actions assigned for this incident yet.
              </p>
              <Button variant="outline" disabled>
                Add Action
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentDetails;
