import { supabase } from '../client';
import type {
  DatabaseResponse,
  DatabaseListResponse,
} from '../types';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type FarmMap = Tables<'farm_maps'>;
type RiskZone = Tables<'risk_zones'>;
type RiskZoneInsert = TablesInsert<'risk_zones'>;
type RiskZoneUpdate = TablesUpdate<'risk_zones'>;

export class RiskRepository {
  async getFarmMapWithRiskZones(farmMapId: string, userId: string): Promise<DatabaseResponse<FarmMap & { risk_zones: RiskZone[] }>> {
    try {
      const { data, error } = await supabase
        .from('farm_maps')
        .select(`
          *,
          risk_zones (*)
        `)
        .eq('id', farmMapId)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching farm map with risk zones:', error);
        return { data: null, error };
      }

      return { data: data as FarmMap & { risk_zones: RiskZone[] }, error: null };
    } catch (error) {
      console.error('Error in getFarmMapWithRiskZones:', error);
      return { data: null, error: error as Error };
    }
  }

  async getOrCreateFarmMap(userId: string): Promise<DatabaseResponse<FarmMap>> {
    try {
      // 1. Try to find an existing map
      const { data: farmMap, error: fetchError } = await supabase
        .from('farm_maps')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: no rows found
        console.error('Error fetching farm map:', fetchError);
        return { data: null, error: fetchError };
      }

      // 2. If found, return it
      if (farmMap) {
        return { data: farmMap, error: null };
      }

      // 3. If not found, create a new one with default values
      const defaultFarmMap: TablesInsert<'farm_maps'> = {
        user_id: userId,
        name: 'My Farm',
        description: 'Default farm map',
        bounds: { width: 800, height: 600, scale: 1 },
        config: {
          showGrid: true,
          gridSize: 20,
          snapToGrid: false,
          showLabels: true,
          showLegend: true,
          allowEditing: true
        }
      };
      
      const { data: newFarmMap, error: createError } = await supabase
        .from('farm_maps')
        .insert(defaultFarmMap)
        .select()
        .single();

      if (createError) {
        console.error('Error creating farm map:', createError);
        return { data: null, error: createError };
      }

      return { data: newFarmMap, error: null };

    } catch (error) {
      console.error('Error in getOrCreateFarmMap:', error);
      return { data: null, error: error as Error };
    }
  }

  async createRiskZone(data: RiskZoneInsert): Promise<DatabaseResponse<RiskZone>> {
    try {
      const { data: zone, error } = await supabase
        .from('risk_zones')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Error creating risk zone:', error);
        return { data: null, error };
      }

      return { data: zone, error: null };
    } catch (error) {
      console.error('Error in createRiskZone:', error);
      return { data: null, error: error as Error };
    }
  }

  async updateRiskZone(id: string, userId: string, data: RiskZoneUpdate): Promise<DatabaseResponse<RiskZone>> {
    try {
      const { data: zone, error } = await supabase
        .from('risk_zones')
        .update(data)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating risk zone:', error);
        return { data: null, error };
      }

      return { data: zone, error: null };
    } catch (error) {
      console.error('Error in updateRiskZone:', error);
      return { data: null, error: error as Error };
    }
  }

  async deleteRiskZone(id: string, userId: string): Promise<DatabaseResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('risk_zones')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting risk zone:', error);
        return { data: false, error };
      }

      return { data: true, error: null };
    } catch (error) {
      console.error('Error in deleteRiskZone:', error);
      return { data: false, error: error as Error };
    }
  }
} 