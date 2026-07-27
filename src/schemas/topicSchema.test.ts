import { describe, expect, it } from 'vitest';
import { topicFileSchema } from './topicSchema';
import { mcq, open } from '../test/fixtures';
describe('topicFileSchema', () => {
  it('принимает корректный JSON обоих типов', () => expect(topicFileSchema.safeParse({ topicId: 1, topicTitle: 'Тема', questions: [mcq('m'), open('o')] }).success).toBe(true));
  it('отклоняет correctIndex за пределами options', () => expect(topicFileSchema.safeParse({ topicId: 1, topicTitle: 'Тема', questions: [mcq('m', 3)] }).success).toBe(false));
});
