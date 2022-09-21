const THREE_DAYS = (3 * 24 * 3600 * 1000).toString(10);
const SEVEN_DAYS = (7 * 24 * 3600 * 1000).toString(10);

export class CollectorConfig {
  readonly worldRetention = process.env.WORLD_RETENTION || THREE_DAYS;
  readonly baseZoneRetention = process.env.BASE_ZONE_RETENTION || THREE_DAYS;
  readonly battleZoneRetention =
    process.env.BATTLE_ZONE_RETENTION || SEVEN_DAYS;
}
