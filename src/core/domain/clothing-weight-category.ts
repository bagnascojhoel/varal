export const CLOTHING_WEIGHT_CATEGORIES = [
  'EXTRA_LIGHT',
  'LIGHT',
  'MEDIUM',
  'HEAVY',
  'EXTRA_HEAVY',
] as const;

export type ClothingWeightCategory =
  (typeof CLOTHING_WEIGHT_CATEGORIES)[number];

export const isValidCategory = (
  value: unknown,
): value is ClothingWeightCategory => {
  return (
    typeof value === 'string' &&
    CLOTHING_WEIGHT_CATEGORIES.includes(value as any)
  );
};
