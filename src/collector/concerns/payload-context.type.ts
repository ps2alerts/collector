import { ZoneConfig } from '../models/zone-config.model';

export interface PayloadContext {
  readonly zone?: {
    config?: ZoneConfig;
    definitionId: string;
    instanceId: string;
  };
  retention: string;
  topic: string;
}
