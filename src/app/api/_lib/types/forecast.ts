import { z } from 'zod';
export type { ForecastPageResponse as ForecastResponse } from '@/core/application-services/forecast-application-service';

export const coordNumber = (name: string, min: number, max: number) =>
  z.preprocess(
    (v) => (v === null ? undefined : v),
    z
      .string({ required_error: `${name} is required` })
      .transform((v, ctx) => {
        const n = Number(v);
        if (isNaN(n)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${name} must be a number`,
          });
          return z.NEVER;
        }
        return n;
      })
      .pipe(
        z
          .number()
          .min(min, `${name} must be >= ${min}`)
          .max(max, `${name} must be <= ${max}`),
      ),
  );

export const forecastQuerySchema = z.object({
  latitude: coordNumber('latitude', -90, 90),
  longitude: coordNumber('longitude', -180, 180),
});
