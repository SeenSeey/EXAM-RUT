import { describe, expect, it } from 'vitest';
import { summarize } from './statistics';
import type { StudySession } from './types';
import { topic } from '../test/fixtures';
const base: StudySession = { schemaVersion: 1, id: 's', trackId: 'mixed-all', requestedSize: 10, queue: ['algos:1:m1','algos:1:o1'], position: 1, cycle: 1, draft: '', status: 'completed', startedAt: '', answers: { 'algos:1:m1': { kind: 'mcq', selectedIndex: 0, correct: true, answeredAt: '' }, 'algos:1:o1': { kind: 'open', text: 'x', skipped: false, rating: 'partial', answeredAt: '' } } };
describe('статистика', () => { it('считает результаты MCQ', () => expect(summarize(base, [topic('algos:1')]).mcqCorrect).toBe(1)); it('считает самооценки open', () => expect(summarize(base, [topic('algos:1')]).open.partial).toBe(1)); });
