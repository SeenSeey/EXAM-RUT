import { describe, expect, it } from 'vitest';
import { topicRepository } from './topicRepository';
describe('TopicRepository с реальными данными', () => {
  it('загружает каталог и пример topic-6.json', () => {
    expect(topicRepository.topics.length).toBeGreaterThan(150);
    expect(topicRepository.topics.find((topic) => topic.key === 'algos:6')?.topicTitle).toContain('неустойчивой сортировки');
  });
  it('не содержит диагностических ошибок', () => expect(topicRepository.errors).toEqual([]));
  it('загружает СТАНКИН как четыре экзаменационных блока', () => {
    const stankin = topicRepository.topics.filter((topic) => topic.category === 'stankin');
    const questions = stankin.flatMap((topic) => topic.questions);
    expect(stankin).toHaveLength(4);
    expect(questions).toHaveLength(120);
    expect(questions.filter((question) => question.type === 'mcq')).toHaveLength(96);
    expect(questions.filter((question) => question.type === 'open')).toHaveLength(24);
  });
  it('загружает все 40 тем МИФИ с двумя заданиями каждого типа', () => {
    const mephi = topicRepository.topics.filter((topic) => topic.category === 'mephi');
    const questions = mephi.flatMap((topic) => topic.questions);
    expect(mephi).toHaveLength(2);
    expect(new Set(questions.map((question) => question.concept))).toHaveLength(40);
    expect(questions).toHaveLength(160);
    expect(questions.filter((question) => question.type === 'mcq')).toHaveLength(80);
    expect(questions.filter((question) => question.type === 'open')).toHaveLength(80);
  });
});
