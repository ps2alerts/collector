import { Module, OnModuleInit } from '@nestjs/common';
import { KafkaModule } from '../kafka/kafka.module';
import { CensusModule } from '../census/census.module';
import { ZoneContainer } from './services/zone.container';
import { CollectorService } from './services/collector.service';
import { ZoneConfig } from './models/zone-config.model';
import { ZoneDefinition } from './concerns/zone.types';
import { CollectorConfig } from './collector.config';

@Module({
  imports: [KafkaModule, CensusModule],
  providers: [CollectorConfig, ZoneContainer, CollectorService],
})
export class CollectorModule implements OnModuleInit {
  constructor(
    private readonly container: ZoneContainer,
    private readonly config: CollectorConfig,
  ) {
  }

  onModuleInit(): void {
    const { baseZoneRetention, battleZoneRetention } = this.config;

    const baseZones = [
      ZoneDefinition.AMERISH,
      ZoneDefinition.ESAMIR,
      ZoneDefinition.HOSSIN,
      ZoneDefinition.INDAR,
      ZoneDefinition.OSHUR,
    ].map((id) => new ZoneConfig(id, baseZoneRetention));

    const battleZones = [ZoneDefinition.NEXUS].map(
      (id) => new ZoneConfig(id, battleZoneRetention),
    );

    for (const config of [...baseZones, ...battleZones])
      this.container.register(config);
  }
}
