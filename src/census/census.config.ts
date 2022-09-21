import { PS2Environment } from 'ps2census';

export class CensusConfig {
  readonly serviceId = process.env.CENSUS_SERVICE_ID;
  readonly environment = process.env.PS2_ENVIRONMENT as PS2Environment;
  readonly streamEndpoint = process.env.CENSUS_STREAM_ENDPOINT;
  readonly reconnectInterval =
    Number.parseInt(process.env.CENSUS_RECONNECT_INTERVAL, 10) || 5000;

  readonly subscriptionWorlds = process.env.SUBSCRIPTION_WORLDS?.split(',') || [
    'all',
  ];
}
