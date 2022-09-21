import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { KAFKA_ADMIN, KAFKA_PRODUCER } from '../../kafka/constants';
import { Admin, Producer } from 'kafkajs';
import { StreamClient } from 'ps2census/dist/stream/stream.client';
import { Stream } from 'ps2census';
import { PayloadContext } from '../concerns/payload-context.type';
import { CollectorConfig } from '../collector.config';
import { ZoneContainer } from './zone.container';

@Injectable()
export class CollectorService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_PRODUCER) private readonly producer: Producer,
    @Inject(KAFKA_ADMIN) private readonly admin: Admin,
    private readonly stream: StreamClient,
    private readonly zoneConfigs: ZoneContainer,
    private readonly config: CollectorConfig,
  ) {
  }

  onModuleInit() {
    this.stream.on('message', async (message) => {
      if (
        message.service == 'event' &&
        message.type == 'serviceMessage' &&
        'event_name' in message.payload
      ) {
        const { payload } = message;
        const context = this.createContext(payload);

        if (!this.filterPayload(context, payload)) return;

        await this.allocateTopic(context);
        await this.publishPayload(context, payload);
      }
    });
  }

  private createContext(payload: Stream.PS2Event): PayloadContext {
    const { event_name, world_id } = payload;
    const hasZone = 'zone_id' in payload;

    const topic = hasZone
      ? `${event_name}.${world_id}.${payload.zone_id}`
      : `${event_name}.${world_id}`;

    const zone = hasZone ? this.parseZoneId(payload.zone_id) : undefined;

    const retention = zone ? zone.config.retention : this.config.worldRetention;

    return {
      topic,
      zone,
      retention,
    };
  }

  private parseZoneId(zoneId: string): PayloadContext['zone'] {
    const zoneInt = Number.parseInt(zoneId, 10);

    const definitionId = (zoneInt & 0xffff).toString(10);

    return {
      config: this.zoneConfigs.getZoneByDefinitionId(definitionId),
      definitionId,
      instanceId: ((zoneInt >>> 16) & 0xffff).toString(),
    };
  }

  private filterPayload(
    context: PayloadContext,
    payload: Stream.PS2Event,
  ): boolean {
    if (!context.zone) return true;

    return Boolean(context.zone.config);
  }

  private async allocateTopic(context: PayloadContext): Promise<void> {
    const { topic, retention } = context;

    await this.admin.createTopics({
      topics: [
        {
          topic,
          numPartitions: 1,
          configEntries: [
            {
              name: 'retention.ms',
              value: retention,
            },
          ],
        },
      ],
    });
  }

  private async publishPayload(
    context: PayloadContext,
    payload: Stream.PS2Event,
  ): Promise<void> {
    const { topic } = context;

    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify({
            payload,
          }),
          timestamp: `${payload.timestamp}000`,
        },
      ],
    });
  }
}
