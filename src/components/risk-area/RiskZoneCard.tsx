import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardList,
  AlertCircle,
  FileText,
  Edit,
  Eye
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tables } from '@/integrations/supabase/types';
import { ActionPlan } from '@/types/farmMap';
import { mockIncidents } from '@/components/risk/mock-incidents';

type RiskZoneData = Tables<'risk_zones'>;

interface ExtendedGeometry {
  id?: string;
  name?: string;
  type?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  actionPlan?: ActionPlan;
}

interface RiskZoneCardProps {
  zone: RiskZoneData;
  onViewDetails: (zone: RiskZoneData) => void;
  onEdit: (zone: RiskZoneData) => void;
  onViewOnMap: (zone: RiskZoneData) => void;
  onManagePlan: (zone: RiskZoneData) => void;
}

export const RiskZoneCard = ({
  zone,
  onViewDetails,
  onEdit,
  onViewOnMap,
  onManagePlan
}: RiskZoneCardProps) => {
  const getRiskLevelBadgeColor = (level: string | null) => {
    switch (level) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100';
    }
  };

  const geometry = zone.geometry as ExtendedGeometry;
  
  // Create a normalized zone object to match the expected format
  const normalizedZone = {
    ...zone,
    riskLevel: zone.risk_level,
    lastReview: zone.last_review,
    incidentsThisYear: zone.incidents_this_year || 0,
    actionPlan: geometry.actionPlan,
    relatedIncidentIds: zone.incidents_this_year > 0 
      ? Array.from({ length: zone.incidents_this_year }, (_, i) => `incident-${zone.id}-${i}`) 
      : []
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{normalizedZone.name}</h3>
              <Badge className={getRiskLevelBadgeColor(normalizedZone.riskLevel)}>
                {normalizedZone.riskLevel}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{normalizedZone.category}</p>
            <p className="text-sm mb-2">{normalizedZone.description}</p>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Location:</strong> {normalizedZone.location}
            </p>
            
            {normalizedZone.actionPlan && (
              <div className="text-xs mt-2 p-2 bg-gray-50 rounded-md border">
                <p className="font-semibold flex items-center gap-1.5">
                  <ClipboardList size={14} />
                  Action Plan: <span className={`font-bold ${
                    normalizedZone.actionPlan.status === 'Completed' ? 'text-green-600' : 
                    normalizedZone.actionPlan.status === 'In Progress' ? 'text-blue-600' : ''
                  }`}>{normalizedZone.actionPlan.status}</span>
                </p>
                <p className="text-muted-foreground mt-1 truncate">
                  {normalizedZone.actionPlan.details}
                </p>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
              <span>
                Last review: {normalizedZone.lastReview ? new Date(normalizedZone.lastReview).toLocaleDateString() : 'Never'} | {normalizedZone.incidentsThisYear} incidents this year
              </span>
              {normalizedZone.relatedIncidentIds && normalizedZone.relatedIncidentIds.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1 font-semibold text-amber-600 cursor-pointer">
                        <AlertCircle size={14} />
                        {normalizedZone.relatedIncidentIds.length} Incident(s)
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="p-1">
                        <h4 className="font-bold mb-1">Recent Incidents</h4>
                        <ul className="list-disc list-inside">
                          {mockIncidents
                            .filter(inc => normalizedZone.relatedIncidentIds?.includes(inc.id))
                            .map(inc => <li key={inc.id}>{inc.title}</li>)
                          }
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-2 ml-4">
            <Button size="sm" variant="outline" onClick={() => onViewDetails(zone)}>
              <FileText className="mr-1" size={14} />
              View Details
            </Button>
            <Button size="sm" variant="outline" onClick={() => onEdit(zone)}>
              <Edit className="mr-1" size={14} />
              Edit Info
            </Button>
            <Button size="sm" variant="outline" onClick={() => onViewOnMap(zone)}>
              <Eye className="mr-1" size={14} />
              View on Map
            </Button>
            <Button size="sm" variant="outline" onClick={() => onManagePlan(zone)}>
              <ClipboardList className="mr-1" size={14} />
              Manage Plan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 