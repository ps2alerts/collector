import { Injectable } from '@nestjs/common';
import { ZoneConfig } from '../models/zone-config.model';

@Injectable()
export class ZoneContainer {
  private readonly zoneMap = new Map<string, ZoneConfig>();

  register(zone: ZoneConfig): this {
    this.zoneMap.set(zone.definitionId, zone);

    return this;
  }

  getZoneByDefinitionId(definitionId: string): ZoneConfig | null {
    return this.zoneMap.get(definitionId) ?? null;
  }
}
