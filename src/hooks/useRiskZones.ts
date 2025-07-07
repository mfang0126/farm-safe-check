import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { RiskService } from '@/lib/database/services/risk';
import { Tables, Json } from '@/integrations/supabase/types';
import { ActionPlan } from '@/types/farmMap';

type RiskZoneData = Tables<'risk_zones'>;
type FarmMapData = Tables<'farm_maps'> & { risk_zones: RiskZoneData[] };

interface ExtendedGeometry {
  id?: string;
  name?: string;
  type?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  rotation?: number;
  actionPlan?: ActionPlan;
}

interface RiskZoneFormData {
  name: string;
  category: string;
  risk_level: string;
  location: string;
  description: string;
}

export const useRiskZones = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [farmMapData, setFarmMapData] = useState<FarmMapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const riskService = useMemo(() => new RiskService(), []);
  
  const riskZones = farmMapData?.risk_zones || [];
  
  const mapBounds = useMemo(() => {
    if (farmMapData?.bounds && typeof farmMapData.bounds === 'object' && farmMapData.bounds !== null) {
      return farmMapData.bounds as { width: number; height: number; scale: number };
    }
    return { width: 800, height: 600, scale: 1 };
  }, [farmMapData]);

  // Initialize farm map
  useEffect(() => {
    if (user) {
      const loadMap = async () => {
        setLoading(true);
        try {
          const { data: map, error } = await riskService.getOrCreateFarmMap(user.id);
          if (error) {
            setError("Could not load or create farm map.");
            toast({ title: "Error", description: "Could not load or create farm map.", variant: "destructive" });
          } else if (map) {
            await fetchFarmMap(map.id);
          }
        } catch (err) {
          setError("Failed to initialize farm map");
          toast({ title: "Error", description: "Failed to initialize farm map", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      };
      loadMap();
    }
  }, [user, riskService, toast]);

  const fetchFarmMap = async (farmMapId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await riskService.getFarmMapWithRiskZones(farmMapId, user.id);
      if (error) {
        setError(error.message);
        toast({
          title: 'Error fetching farm map data',
          description: error.message,
          variant: 'destructive',
        });
      } else if (data) {
        setFarmMapData(data);
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch farm map");
      toast({
        title: 'Error',
        description: "Failed to fetch farm map",
        variant: 'destructive',
      });
    }
  };

  const createZone = async (formData: RiskZoneFormData): Promise<boolean> => {
    if (!farmMapData || !user) return false;

    try {
      setLoading(true);
      const newZoneData = {
        farm_map_id: farmMapData.id,
        user_id: user.id,
        name: formData.name,
        category: formData.category,
        risk_level: formData.risk_level as 'Low' | 'Medium' | 'High' | 'Critical',
        location: formData.location,
        description: formData.description,
        last_review: new Date().toISOString(),
        incidents_this_year: 0,
        is_active: true,
        geometry: {
          id: `geo-${Date.now()}`,
          name: formData.name,
          type: 'rectangle',
          x: (mapBounds.width / 2) - 50,
          y: (mapBounds.height / 2) - 40,
          width: 100,
          height: 80,
          rotation: 0
        }
      };

      const { data: newZone, error } = await riskService.createRiskZone(newZoneData);

      if (error || !newZone) {
        throw new Error(error?.message || "Failed to create risk zone.");
      }
      
      setFarmMapData(prev => prev ? { ...prev, risk_zones: [...prev.risk_zones, newZone] } : null);

      toast({
        title: "Risk Zone Added",
        description: `"${formData.name}" has been added to the center of the map.`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add risk zone. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateZone = async (zone: RiskZoneData, formData: RiskZoneFormData): Promise<boolean> => {
    if (!farmMapData || !user) return false;

    try {
      setLoading(true);
      const updatedZoneData = {
        name: formData.name,
        category: formData.category,
        risk_level: formData.risk_level as 'Low' | 'Medium' | 'High' | 'Critical',
        location: formData.location,
        description: formData.description,
        updated_at: new Date().toISOString(),
      };

      const { data: updatedZone, error } = await riskService.updateRiskZone(
        zone.id,
        user.id,
        updatedZoneData
      );

      if (error || !updatedZone) {
        throw new Error(error?.message || "Failed to update risk zone.");
      }

      setFarmMapData(prev => prev ? {
        ...prev,
        risk_zones: prev.risk_zones.map(z =>
          z.id === zone.id ? updatedZone : z
        )
      } : null);

      toast({
        title: "Risk Zone Updated",
        description: `"${formData.name}" has been updated successfully.`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update risk zone. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteZone = async (zoneId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);
      const { error } = await riskService.deleteRiskZone(zoneId, user.id);

      if (error) {
        throw new Error(error.message);
      }

      setFarmMapData(prev => prev ? {
        ...prev,
        risk_zones: prev.risk_zones.filter(zone => zone.id !== zoneId)
      } : null);

      toast({
        title: "Risk Zone Deleted",
        description: "The risk zone has been removed successfully.",
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete risk zone. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateZonePosition = async (zoneId: string, newPosition: { x: number; y: number }): Promise<boolean> => {
    if (!farmMapData || !user) return false;

    const zone = riskZones.find(z => z.id === zoneId);
    if (!zone) return false;

    try {
      const currentGeometry = zone.geometry as ExtendedGeometry;
      const updatedGeometry: ExtendedGeometry = {
        ...currentGeometry,
        x: newPosition.x,
        y: newPosition.y
      };

      const { data: updatedZone, error } = await riskService.updateRiskZone(
        zoneId,
        user.id,
        { geometry: updatedGeometry as unknown as Json }
      );

      if (error || !updatedZone) {
        throw new Error(error?.message || "Failed to update zone position.");
      }

      setFarmMapData(prev => prev ? {
        ...prev,
        risk_zones: prev.risk_zones.map(z =>
          z.id === zoneId ? updatedZone : z
        )
      } : null);

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update zone position. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateZoneGeometry = async (zoneId: string, newGeometry: { x: number; y: number; width?: number; height?: number; radius?: number }): Promise<boolean> => {
    if (!farmMapData || !user) return false;

    const zone = riskZones.find(z => z.id === zoneId);
    if (!zone) return false;

    try {
      const currentGeometry = zone.geometry as ExtendedGeometry;
      const updatedGeometry: ExtendedGeometry = {
        ...currentGeometry,
        x: newGeometry.x,
        y: newGeometry.y,
        ...(newGeometry.width !== undefined && { width: newGeometry.width }),
        ...(newGeometry.height !== undefined && { height: newGeometry.height }),
        ...(newGeometry.radius !== undefined && { radius: newGeometry.radius })
      };

      const { data: updatedZone, error } = await riskService.updateRiskZone(
        zoneId,
        user.id,
        { geometry: updatedGeometry as unknown as Json }
      );

      if (error || !updatedZone) {
        throw new Error(error?.message || "Failed to update zone geometry.");
      }

      setFarmMapData(prev => prev ? {
        ...prev,
        risk_zones: prev.risk_zones.map(z =>
          z.id === zoneId ? updatedZone : z
        )
      } : null);

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update zone size. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const saveActionPlan = async (zone: RiskZoneData, plan: ActionPlan): Promise<boolean> => {
    if (!farmMapData || !user) return false;

    try {
      const currentGeometry = zone.geometry as ExtendedGeometry;
      const updatedGeometry: ExtendedGeometry = {
        ...currentGeometry,
        actionPlan: plan
      };

      const { data: updatedZone, error } = await riskService.updateRiskZone(
        zone.id,
        user.id,
        { geometry: updatedGeometry as unknown as Json }
      );

      if (error || !updatedZone) {
        throw new Error(error?.message || "Failed to save action plan.");
      }

      setFarmMapData(prev => prev ? {
        ...prev,
        risk_zones: prev.risk_zones.map(z =>
          z.id === zone.id ? updatedZone : z
        )
      } : null);

      toast({
        title: "Action Plan Saved",
        description: `Action plan for "${zone.name}" has been updated.`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save action plan. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const refreshData = async () => {
    if (farmMapData) {
      await fetchFarmMap(farmMapData.id);
    }
  };

  return {
    // Data
    riskZones,
    farmMapData,
    mapBounds,
    loading,
    error,
    
    // Actions
    createZone,
    updateZone,
    deleteZone,
    updateZonePosition,
    updateZoneGeometry,
    saveActionPlan,
    refreshData,
  };
}; 