import type { McqQuestion, OpenQuestion, Topic } from '../domain/types';
export const mcq = (id: string, correctIndex = 0): McqQuestion => ({ id, type: 'mcq', concept: 'Концепция', difficulty: 'easy', question: `Вопрос ${id}`, options: ['Да', 'Нет'], correctIndex, rationales: ['Верно', 'Нет'], explanation: 'Объяснение' });
export const open = (id: string): OpenQuestion => ({ id, type: 'open', concept: 'Концепция', difficulty: 'medium', question: `Открытый ${id}`, keyPoints: ['Пункт'], modelAnswer: 'Эталон' });
export const topic = (key: string, questions = [mcq('m1'), open('o1')]): Topic => ({ key, category: 'algos', categoryTitle: 'Алгоритмы', sourcePath: 'test', topicId: Number(key.split(':')[1] ?? 1), topicTitle: `Тема ${key}`, questions });
