import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MapPin } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { RiskZoneCard } from './RiskZoneCard';

type RiskZoneData = Tables<'risk_zones'>;

interface ZoneManagementTabProps {
  zones: RiskZoneData[];
  onAddZone: () => void;
  onViewDetails: (zone: RiskZoneData) => void;
  onEditZone: (zone: RiskZoneData) => void;
  onViewOnMap: (zone: RiskZoneData) => void;
  onManagePlan: (zone: RiskZoneData) => void;
}

export const ZoneManagementTab = ({
  zones,
  onAddZone,
  onViewDetails,
  onEditZone,
  onViewOnMap,
  onManagePlan
}: ZoneManagementTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Zone Information Management</h2>
          <p className="text-sm text-muted-foreground">Edit zone details and properties</p>
        </div>
        <Button onClick={onAddZone}>
          <Plus className="mr-2" size={16} />
          Add New Zone
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {zones.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Risk Zones Yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start by adding your first risk zone to monitor safety areas across your farm.
              </p>
              <Button onClick={onAddZone}>
                <Plus className="mr-2" size={16} />
                Add First Zone
              </Button>
            </CardContent>
          </Card>
        ) : (
          zones.map((zone) => (
            <RiskZoneCard
              key={zone.id}
              zone={zone}
              onViewDetails={onViewDetails}
              onEdit={onEditZone}
              onViewOnMap={onViewOnMap}
              onManagePlan={onManagePlan}
            />
          ))
        )}
      </div>
    </div>
  );
}; 