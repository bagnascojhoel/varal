export enum DayWindow {
  NIGHT = 'night',
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
}

const HOUR_MAP = {
  night: {
    inclusiveStart: 0,
    exclusiveEnd: 6,
  },
  morning: {
    inclusiveStart: 6,
    exclusiveEnd: 12,
  },
  afternoon: {
    inclusiveStart: 12,
    exclusiveEnd: 18,
  },
  evening: {
    inclusiveStart: 18,
    exclusiveEnd: 0,
  },
};

export function sliceWindow(dayWindow: DayWindow, values: any[]) {
  return values.slice(
    HOUR_MAP[dayWindow].inclusiveStart,
    HOUR_MAP[dayWindow].exclusiveEnd,
  );
}
