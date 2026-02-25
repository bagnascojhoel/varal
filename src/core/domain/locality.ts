import { DateTime } from 'luxon';
import { Coordinates } from './coordinates';
import { Timezone } from './time-zone';

export class Locality {
  private readonly USABILITY_HOUR_THRESHOLD = 17;

  constructor(
    readonly coordinates: Coordinates,
    readonly cityName: string,
    readonly countryCode: string,
    readonly timezone: Timezone,
  ) {}

  zonedHour(): number {
    return this.zonedNow().hour;
  }

  isStillUsable(dateTime: DateTime<boolean>): boolean {
    const zonedNow = this.zonedNow();
    return zonedNow.toISODate() === dateTime.toISODate()
      ? zonedNow.hour <= this.USABILITY_HOUR_THRESHOLD
      : zonedNow.day < dateTime.day;
  }

  zonedNow(): DateTime {
    return DateTime.now().setZone(this.timezone);
  }
}
