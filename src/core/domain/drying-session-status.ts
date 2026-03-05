export const DRYING_SESSION_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
} as const;

export type DryingSessionStatus =
  (typeof DRYING_SESSION_STATUS)[keyof typeof DRYING_SESSION_STATUS];
