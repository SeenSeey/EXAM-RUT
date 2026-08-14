import type { Question, QuestionKind, SessionSize, StudySession, Topic, TrackDefinition } from './types';

export type Random = () => number;
export function seededRandom(seed: number): Random { let value = seed >>> 0; return () => ((value = (value * 1664525 + 1013904223) >>> 0) / 4294967296); }
export function shuffle<T>(items: readonly T[], random: Random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
export interface QuestionWithKey { key: string; topicKey: string; question: Question }
export function allQuestions(topics: readonly Topic[]): QuestionWithKey[] {
  return topics.flatMap((topic) => topic.questions.map((question) => ({ key: `${topic.key}:${question.id}`, topicKey: topic.key, question })));
}
export function filterPool(topics: readonly Topic[], track: TrackDefinition, topicKey?: string): QuestionWithKey[] {
  const inTrack = track.categories?.length ? topics.filter((topic) => track.categories?.includes(topic.category)) : topics;
  const selected = track.topicMode === 'selected' ? inTrack.filter((topic) => topic.category === topicKey || topic.key === topicKey) : inTrack;
  return allQuestions(selected).filter(({ question }) => track.allowedQuestionTypes.includes(question.type));
}
export function balancedShuffle(pool: readonly QuestionWithKey[], types: QuestionKind[], random: Random = Math.random): QuestionWithKey[] {
  if (types.length < 2) return shuffle(pool, random);
  const mcq = shuffle(pool.filter((item) => item.question.type === 'mcq'), random);
  const open = shuffle(pool.filter((item) => item.question.type === 'open'), random);
  const result: QuestionWithKey[] = [];
  let preferred: QuestionKind = random() < .5 ? 'mcq' : 'open';
  while (mcq.length || open.length) {
    const primary = preferred === 'mcq' ? mcq : open;
    const secondary = preferred === 'mcq' ? open : mcq;
    result.push((primary.length ? primary : secondary).pop()!);
    preferred = preferred === 'mcq' ? 'open' : 'mcq';
  }
  return result;
}
export function buildQueue(pool: readonly QuestionWithKey[], track: TrackDefinition, size: SessionSize | number, random: Random = Math.random): string[] {
  const count = resolveQueueSize(pool, track, size);
  if (track.allowedQuestionTypes.length < 2) return shuffle(pool, random).slice(0, count).map((item) => item.key);
  const mcq = shuffle(pool.filter((item) => item.question.type === 'mcq'), random);
  const open = shuffle(pool.filter((item) => item.question.type === 'open'), random);
  const desiredMcq = Math.round(count * (track.mcqRatio ?? .7));
  const selectedMcq = mcq.slice(0, Math.min(desiredMcq, mcq.length));
  const selectedOpen = open.slice(0, Math.min(count - selectedMcq.length, open.length));
  let missing = count - selectedMcq.length - selectedOpen.length;
  if (missing > 0) selectedMcq.push(...mcq.slice(selectedMcq.length, selectedMcq.length + missing));
  missing = count - selectedMcq.length - selectedOpen.length;
  if (missing > 0) selectedOpen.push(...open.slice(selectedOpen.length, selectedOpen.length + missing));
  return arrangeWeighted(selectedMcq, selectedOpen, random).map((item) => item.key);
}

export function resolveQueueSize(pool: readonly QuestionWithKey[], track: TrackDefinition, size: SessionSize | number): number {
  const limit = size === 'all' || size === 'infinite' ? pool.length : Math.min(size, pool.length);
  if (track.allowedQuestionTypes.length < 2 || limit < 10) return limit;
  const mcqCount = pool.filter((item) => item.question.type === 'mcq').length;
  const openCount = pool.length - mcqCount;
  const mcqPerBlock = Math.round(10 * (track.mcqRatio ?? .7));
  const openPerBlock = 10 - mcqPerBlock;
  const completeBlocks = Math.min(Math.floor(limit / 10), Math.floor(mcqCount / mcqPerBlock), Math.floor(openCount / openPerBlock));
  return completeBlocks > 0 ? completeBlocks * 10 : 0;
}

function arrangeWeighted(mcqItems: QuestionWithKey[], openItems: QuestionWithKey[], random: Random): QuestionWithKey[] {
  const mcq = [...mcqItems]; const open = [...openItems]; const result: QuestionWithKey[] = [];
  let sameType = 0; let previous: QuestionKind | undefined;
  while (mcq.length || open.length) {
    const forceOther = sameType >= 3;
    const total = mcq.length + open.length;
    let type: QuestionKind = random() < mcq.length / total ? 'mcq' : 'open';
    if (forceOther && type === previous && (previous === 'mcq' ? open.length : mcq.length)) type = previous === 'mcq' ? 'open' : 'mcq';
    if (type === 'mcq' && !mcq.length) type = 'open';
    if (type === 'open' && !open.length) type = 'mcq';
    result.push((type === 'mcq' ? mcq : open).pop()!);
    if (type === previous) sameType++; else { previous = type; sameType = 1; }
  }
  return result;
}
export function createSession(track: TrackDefinition, pool: readonly QuestionWithKey[], size: SessionSize, topicKey?: string, random: Random = Math.random): StudySession {
  return { schemaVersion: 1, id: crypto.randomUUID(), trackId: track.id, topicKey, requestedSize: size, queue: buildQueue(pool, track, size, random), position: 0, cycle: 1, answers: {}, draft: '', status: 'active', startedAt: new Date().toISOString() };
}
export function nextCycle(session: StudySession, pool: readonly QuestionWithKey[], track: TrackDefinition, random: Random = Math.random): StudySession {
  return { ...session, queue: buildQueue(pool, track, 'all', random), position: 0, cycle: session.cycle + 1, draft: '' };
}
