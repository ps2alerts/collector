import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Admin, Kafka, Producer } from 'kafkajs';
import { KafkaConfig } from './kafka.config';
import { KAFKA_ADMIN, KAFKA_PRODUCER } from './constants';

@Module({
  providers: [
    KafkaConfig,
    {
      provide: Kafka,
      useFactory: (config: KafkaConfig) =>
        new Kafka({
          clientId: config.clientId,
          brokers: config.brokers,
        }),
      inject: [KafkaConfig],
    },
    {
      provide: KAFKA_PRODUCER,
      useFactory: (kafka: Kafka) => kafka.producer(),
      inject: [Kafka],
    },
    {
      provide: KAFKA_ADMIN,
      useFactory: (kafka: Kafka) => kafka.admin(),
      inject: [Kafka],
    },
  ],
  exports: [KAFKA_PRODUCER, KAFKA_ADMIN],
})
export class KafkaModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(KAFKA_PRODUCER) private readonly producer: Producer,
    @Inject(KAFKA_ADMIN) private readonly admin: Admin,
  ) {
  }

  async onModuleInit() {
    await Promise.all([this.producer.connect(), this.admin.connect()]);
  }

  async onModuleDestroy() {
    await Promise.all([this.producer.disconnect(), this.admin.disconnect()]);
  }
}
