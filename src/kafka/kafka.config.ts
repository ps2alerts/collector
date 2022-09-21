export class KafkaConfig {
  readonly clientId = process.env.KAFKA_CLIENT_ID ?? 'ps2a-collector';
  readonly brokers = process.env.KAFKA_BROKERS?.split(',');
}
