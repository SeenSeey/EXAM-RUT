import { describe, expect, it } from 'vitest';
import { getDisciplines } from './disciplines';
import { mcq, open, topic } from '../test/fixtures';

describe('каталог дисциплин', () => {
  it('объединяет темы одной дисциплины и считает типы вопросов', () => {
    const result = getDisciplines([
      topic('algos:1', [mcq('m1')]),
      topic('algos:2', [mcq('m2'), open('o1')])
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ key: 'algos', questionCount: 3, mcqCount: 2, openCount: 1 });
  });
});
