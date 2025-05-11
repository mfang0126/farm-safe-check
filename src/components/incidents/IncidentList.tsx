
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SafetyIncident, IncidentSeverity, IncidentStatus } from '@/types/incidents';
import { CalendarClock, Search, AlertTriangle, Clipboard, FileText } from 'lucide-react';
import { format } from 'date-fns';
import IncidentDetails from './IncidentDetails';

const getSeverityConfig = (severity: IncidentSeverity) => {
  const configs = {
    'low': { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: null },
    'medium': { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: null },
    'high': { color: 'bg-orange-50 text-orange-700 border-orange-200', icon: AlertTriangle },
    'critical': { color: 'bg-red-50 text-red-700 border-red-200', icon: AlertTriangle }
  };
  return configs[severity] || configs.medium;
};

const getStatusConfig = (status: IncidentStatus) => {
  const configs = {
    'reported': { color: 'bg-blue-100 text-blue-800' },
    'investigating': { color: 'bg-yellow-100 text-yellow-800' },
    'mitigated': { color: 'bg-green-100 text-green-800' },
    'resolved': { color: 'bg-gray-100 text-gray-800' }
  };
  return configs[status] || configs.reported;
};

const IncidentList = () => {
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<SafetyIncident | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Load incidents from localStorage
  useEffect(() => {
    const savedIncidents = localStorage.getItem('safety-incidents');
    if (savedIncidents) {
      setIncidents(JSON.parse(savedIncidents));
    }
  }, []);

  // Filter incidents based on search
  const filteredIncidents = incidents.filter(incident => {
    const query = searchQuery.toLowerCase();
    return (
      incident.title.toLowerCase().includes(query) ||
      incident.description.toLowerCase().includes(query) ||
      incident.location.toLowerCase().includes(query)
    );
  });

  const viewIncidentDetails = (incident: SafetyIncident) => {
    setSelectedIncident(incident);
    setShowDetailsDialog(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search incidents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-12">
            <Clipboard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No incidents found</h3>
            {incidents.length > 0 ? (
              <p className="text-muted-foreground">Try adjusting your search query</p>
            ) : (
              <p className="text-muted-foreground">Report an incident to get started</p>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredIncidents.map((incident) => {
              const severityConfig = getSeverityConfig(incident.severity);
              const statusConfig = getStatusConfig(incident.status);
              const SeverityIcon = severityConfig.icon;
              
              return (
                <Card key={incident.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{incident.title}</CardTitle>
                      <Badge className={statusConfig.color}>
                        {incident.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <CalendarClock className="mr-1 h-4 w-4" />
                      {format(new Date(incident.date), 'PPP')}
                      <span className="mx-2">•</span>
                      <span>{incident.location}</span>
                    </div>
                    
                    <div className="line-clamp-2 text-sm">
                      {incident.description}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center">
                      <Badge variant="outline" className={`${severityConfig.color} border`}>
                        {SeverityIcon && <SeverityIcon className="mr-1 h-3 w-3" />}
                        {incident.severity} severity
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => viewIncidentDetails(incident)}
                      className="flex items-center"
                    >
                      <FileText className="mr-1 h-4 w-4" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Incident details dialog */}
      {selectedIncident && (
        <IncidentDetails 
          incident={selectedIncident}
          isOpen={showDetailsDialog}
          onClose={() => setShowDetailsDialog(false)} 
        />
      )}
    </>
  );
};

export default IncidentList;
