import { z } from 'zod';
import type { PersistedState } from '../domain/types';
import { EMPTY_STATS } from '../domain/statistics';

export const STORAGE_KEY = 'exam-rut-state';
export const DEFAULT_STATE: PersistedState = { version: 1, session: null, stats: EMPTY_STATS, settings: { theme: 'system' } };
const persistedSchema = z.object({
  version: z.literal(1), session: z.unknown().nullable(),
  stats: z.object({ sessions: z.number(), answered: z.number(), skipped: z.number(), mcqCorrect: z.number(), mcqTotal: z.number(), open: z.object({ correct: z.number(), partial: z.number(), incorrect: z.number() }), streakDays: z.array(z.string()) }),
  settings: z.object({ theme: z.enum(['system', 'light', 'dark']) })
});
export function serializeState(state: PersistedState): string { return JSON.stringify(state); }
export function restoreState(raw: string | null): PersistedState {
  if (!raw) return DEFAULT_STATE;
  try { const parsed = persistedSchema.safeParse(JSON.parse(raw)); return parsed.success ? parsed.data as PersistedState : DEFAULT_STATE; } catch { return DEFAULT_STATE; }
}
export function readState(): PersistedState { return typeof localStorage === 'undefined' ? DEFAULT_STATE : restoreState(localStorage.getItem(STORAGE_KEY)); }
export function writeState(state: PersistedState): void { localStorage.setItem(STORAGE_KEY, serializeState(state)); }
