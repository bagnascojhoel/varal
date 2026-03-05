import { z } from 'zod';

// Request body validation
export const startSessionRequestSchema = z.object({
  categories: z
    .array(z.enum(['EXTRA_LIGHT', 'LIGHT', 'MEDIUM', 'HEAVY', 'EXTRA_HEAVY']))
    .min(1, 'At least one category must be selected'),
});

export type StartSessionRequest = z.infer<typeof startSessionRequestSchema>;

// Response body type (same for all status codes: 201, 206, 409)
export interface DryingSessionDTO {
  id: number;
  category: string;
  startedAt: string; // ISO 8601
  endedAt: string | null;
}

export interface StartSessionResponse {
  created: DryingSessionDTO[];
  conflicting: string[];
}
