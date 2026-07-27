import type { AggregateStats, OpenRating, StudySession, Topic } from './types';
import { allQuestions } from './sessionEngine';

export const EMPTY_STATS: AggregateStats = { sessions: 0, answered: 0, skipped: 0, mcqCorrect: 0, mcqTotal: 0, open: { correct: 0, partial: 0, incorrect: 0 }, streakDays: [] };
export interface SessionSummary { total: number; answered: number; skipped: number; mcqCorrect: number; mcqTotal: number; open: Record<OpenRating, number>; topicErrors: Record<string, number>; conceptErrors: Record<string, number> }
export function summarize(session: StudySession, topics: readonly Topic[]): SessionSummary {
  const byKey = new Map(allQuestions(topics).map((item) => [item.key, item]));
  const result: SessionSummary = { total: session.queue.length, answered: 0, skipped: 0, mcqCorrect: 0, mcqTotal: 0, open: { correct: 0, partial: 0, incorrect: 0 }, topicErrors: {}, conceptErrors: {} };
  Object.entries(session.answers).forEach(([key, answer]) => {
    const item = byKey.get(key); if (!item) return;
    const isError = answer.kind === 'mcq' ? !answer.correct : answer.skipped || answer.rating === 'incorrect';
    result.answered++; if (answer.kind === 'open' && answer.skipped) result.skipped++;
    if (answer.kind === 'mcq') { result.mcqTotal++; if (answer.correct) result.mcqCorrect++; }
    else if (answer.rating) result.open[answer.rating]++;
    if (isError) { const topic = topics.find((t) => t.key === item.topicKey); const title = topic?.topicTitle ?? item.topicKey; result.topicErrors[title] = (result.topicErrors[title] ?? 0) + 1; result.conceptErrors[item.question.concept] = (result.conceptErrors[item.question.concept] ?? 0) + 1; }
  });
  result.skipped += Math.max(0, result.total - result.answered);
  return result;
}
export function mergeStats(stats: AggregateStats, session: StudySession): AggregateStats {
  const answers = Object.values(session.answers); const day = new Date().toISOString().slice(0, 10);
  return { sessions: stats.sessions + 1, answered: stats.answered + answers.length, skipped: stats.skipped + answers.filter((a) => a.kind === 'open' && a.skipped).length,
    mcqCorrect: stats.mcqCorrect + answers.filter((a) => a.kind === 'mcq' && a.correct).length, mcqTotal: stats.mcqTotal + answers.filter((a) => a.kind === 'mcq').length,
    open: (['correct', 'partial', 'incorrect'] as OpenRating[]).reduce((acc, rating) => ({ ...acc, [rating]: stats.open[rating] + answers.filter((a) => a.kind === 'open' && a.rating === rating).length }), stats.open),
    streakDays: [...new Set([...stats.streakDays, day])].slice(-30) };
}
export function incorrectKeys(session: StudySession): string[] { return Object.entries(session.answers).filter(([, a]) => a.kind === 'mcq' ? !a.correct : a.skipped || a.rating === 'incorrect').map(([key]) => key); }
