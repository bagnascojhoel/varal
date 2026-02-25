import { z } from 'zod';

export const washerBodySchema = z.union([
  z.object({
    cep: z.string().regex(/^\d{8}$/, 'cep must be exactly 8 digits'),
  }),
  z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
  }),
]);

export type WasherRequest = z.infer<typeof washerBodySchema>;

export interface WasherResponse {
  lat: number;
  lon: number;
  cityName: string;
  timezone: string;
  countryCode: string;
}
