import { RiskRepository } from '../repositories/risk';
import type { DatabaseResponse, DatabaseListResponse } from '../types';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type FarmMap = Tables<'farm_maps'>;
type RiskZone = Tables<'risk_zones'>;
type RiskZoneInsert = TablesInsert<'risk_zones'>;
type RiskZoneUpdate = TablesUpdate<'risk_zones'>;

export class RiskService {
  private riskRepository: RiskRepository;

  constructor() {
    this.riskRepository = new RiskRepository();
  }

  async getOrCreateFarmMap(userId: string): Promise<DatabaseResponse<FarmMap>> {
    return this.riskRepository.getOrCreateFarmMap(userId);
  }

  async getFarmMapWithRiskZones(farmMapId: string, userId: string): Promise<DatabaseResponse<FarmMap & { risk_zones: RiskZone[] }>> {
    return this.riskRepository.getFarmMapWithRiskZones(farmMapId, userId);
  }

  async createRiskZone(data: RiskZoneInsert): Promise<DatabaseResponse<RiskZone>> {
    return this.riskRepository.createRiskZone(data);
  }

  async updateRiskZone(id: string, userId: string, data: RiskZoneUpdate): Promise<DatabaseResponse<RiskZone>> {
    return this.riskRepository.updateRiskZone(id, userId, data);
  }

  async deleteRiskZone(id: string, userId: string): Promise<DatabaseResponse<boolean>> {
    return this.riskRepository.deleteRiskZone(id, userId);
  }
} 