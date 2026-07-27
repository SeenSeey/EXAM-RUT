import { describe, expect, it } from 'vitest';
import { TRACKS } from './tracks';
import { balancedShuffle, buildQueue, filterPool, resolveQueueSize, seededRandom } from './sessionEngine';
import { mcq, open, topic } from '../test/fixtures';
const topics = [topic('algos:1', [mcq('m1'), mcq('m2'), open('o1'), open('o2')]), topic('algos:2', [mcq('m3'), open('o3')])];
describe('движок сессии', () => {
  it('фильтрует вопросы по типу', () => expect(filterPool(topics, TRACKS[2]).every((x) => x.question.type === 'mcq')).toBe(true));
  it('фильтрует по выбранной теме', () => expect(filterPool(topics, TRACKS[1], 'algos:2')).toHaveLength(2));
  it('фильтрует по выбранной дисциплине', () => expect(filterPool(topics, TRACKS[1], 'algos')).toHaveLength(6));
  it.each(TRACKS)('строит трек $title', (track) => { const selected = track.topicMode === 'selected' ? 'algos:1' : undefined; expect(filterPool(topics, track, selected).length).toBeGreaterThan(0); });
  it('не повторяет вопросы до исчерпания пула', () => { const queue = buildQueue(filterPool(topics, TRACKS[0]), TRACKS[0], 'all', seededRandom(1)); expect(new Set(queue).size).toBe(queue.length); });
  it('ограничивает размер', () => expect(buildQueue(filterPool(topics, TRACKS[0]), TRACKS[0], 2, seededRandom(2))).toHaveLength(2));
  it('чередует типы при смешивании сбалансированного пула', () => { const pool = filterPool([topics[0]], TRACKS[0]); const result = balancedShuffle(pool, ['mcq','open'], seededRandom(3)); for (let i=1;i<result.length;i++) expect(result[i].question.type).not.toBe(result[i-1].question.type); });
  it('формирует смешанную сессию в пропорции 70/30', () => {
    const mixedTopic = topic('algos:3', [...Array.from({ length: 10 }, (_, index) => mcq(`m${index + 10}`)), ...Array.from({ length: 10 }, (_, index) => open(`o${index + 10}`))]);
    const pool = filterPool([mixedTopic], TRACKS[0]);
    const queue = buildQueue(pool, TRACKS[0], 10, seededRandom(7));
    const types = queue.map((key) => pool.find((item) => item.key === key)!.question.type);
    expect(types.filter((type) => type === 'mcq')).toHaveLength(7);
    expect(types.filter((type) => type === 'open')).toHaveLength(3);
  });
  it('уменьшает очередь, если для квоты 70/30 не хватает открытых вопросов', () => {
    const limited = topic('algos:4', [...Array.from({ length: 50 }, (_, index) => mcq(`lm${index}`)), ...Array.from({ length: 10 }, (_, index) => open(`lo${index}`))]);
    const pool = filterPool([limited], TRACKS[0]);
    expect(resolveQueueSize(pool, TRACKS[0], 50)).toBe(30);
    const queue = buildQueue(pool, TRACKS[0], 50, seededRandom(11));
    expect(queue.filter((key) => key.includes(':lm')).length).toBe(21);
    expect(queue.filter((key) => key.includes(':lo')).length).toBe(9);
  });
});
