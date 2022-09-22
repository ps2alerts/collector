import { Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { StreamClient } from 'ps2census/dist/stream/stream.client';
import { CensusConfig } from './census.config';

@Module({
  providers: [
    CensusConfig,
    {
      provide: StreamClient,
      useFactory: (config: CensusConfig) =>
        new StreamClient(config.serviceId, config.environment, {
          endpoint: config.streamEndpoint,
        }),
      inject: [CensusConfig],
    },
  ],
})
export class CensusModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('StreamClient');

  private isConnected = false;

  private connectionTimeout?: NodeJS.Timeout;

  constructor(
    private readonly stream: StreamClient,
    private readonly config: CensusConfig,
  ) {
    this.stream.on('ready', () => {
      void this.stream.send({
        service: 'event',
        action: 'subscribe',
        eventNames: ['all'],
        worlds: config.subscriptionWorlds,
        characters: ['all'],
        logicalAndCharactersWithWorlds: true,
      });
    });

    this.stream.on('close', () => {
      if (!this.isConnected) return;

      this.connectionTimeout = setTimeout(() => {
        this.logger.debug('Reconnecting');

        void this.stream.connect();
      }, this.config.reconnectInterval);
    });
  }

  async onModuleInit() {
    if (this.isConnected) return;
    this.isConnected = true;

    await this.stream.connect();
  }

  onModuleDestroy() {
    if (!this.isConnected) return;
    this.isConnected = false;

    clearTimeout(this.connectionTimeout);

    this.stream.destroy();
  }
}
