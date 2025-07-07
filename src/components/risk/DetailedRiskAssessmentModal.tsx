import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskZoneData } from '@/types/farmMap';
import { SafetyIncident } from '@/types/incidents';
import { ClipboardList, AlertCircle, Calendar, Tag, Info } from 'lucide-react';

interface DetailedRiskAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone: RiskZoneData | null;
  incidents: SafetyIncident[];
}

const DetailedRiskAssessmentModal = ({ isOpen, onClose, zone, incidents }: DetailedRiskAssessmentModalProps) => {
  if (!zone) return null;

  const getRiskLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const relatedIncidents = incidents.filter(inc => zone.relatedIncidentIds?.includes(inc.id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{zone.name}</span>
            <Badge className={`text-base ${getRiskLevelBadgeColor(zone.riskLevel)}`}>
              {zone.riskLevel} Risk
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Detailed risk assessment including zone properties, action plans, and incident history.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Left Column: Zone Details & Action Plan */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Info size={20} /> Zone Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><strong>Category:</strong> {zone.category}</p>
                <p><strong>Location:</strong> {zone.location}</p>
                <p><strong>Description:</strong> {zone.description}</p>
                <p className="text-xs text-muted-foreground pt-2">
                  Last reviewed: {new Date(zone.lastReview).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><ClipboardList size={20} /> Action Plan</CardTitle>
              </CardHeader>
              <CardContent>
                {zone.actionPlan ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p><strong>Status:</strong></p>
                      <Badge variant={
                        zone.actionPlan.status === 'Completed' ? 'default' : 
                        zone.actionPlan.status === 'In Progress' ? 'secondary' : 'outline'
                      }>
                        {zone.actionPlan.status}
                      </Badge>
                    </div>
                    <p className="text-sm bg-gray-50 p-3 rounded-md border">{zone.actionPlan.details}</p>
                    <p className="text-xs text-muted-foreground pt-2">
                      Last updated: {new Date(zone.actionPlan.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No action plan has been created for this zone yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Associated Incidents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><AlertCircle size={20} /> Associated Incidents ({relatedIncidents.length})</h3>
            {relatedIncidents.length > 0 ? (
              <div className="space-y-4">
                {relatedIncidents.map(incident => (
                  <Card key={incident.id} className="bg-gray-50/50">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-semibold">{incident.title}</h4>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(incident.date).toLocaleDateString()}</span>
                        <Badge variant="outline" className="capitalize flex items-center gap-1">
                          <Tag size={12} /> {incident.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No incidents have been linked to this risk zone.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedRiskAssessmentModal; 