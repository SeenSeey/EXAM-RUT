import { describe, expect, it } from 'vitest';
import { topicRepository } from './topicRepository';
describe('TopicRepository с реальными данными', () => {
  it('загружает каталог и пример topic-6.json', () => {
    expect(topicRepository.topics.length).toBeGreaterThan(150);
    expect(topicRepository.topics.find((topic) => topic.key === 'algos:6')?.topicTitle).toContain('неустойчивой сортировки');
  });
  it('не содержит диагностических ошибок', () => expect(topicRepository.errors).toEqual([]));
});
