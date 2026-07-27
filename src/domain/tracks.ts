import type { QuestionKind, TrackDefinition } from './types';

export const TRACKS: TrackDefinition[] = [
  { id: 'mixed-all', title: 'Случайный смешанный', shortTitle: 'Микс', description: 'Тестовые и открытые задания из всех дисциплин и тем.', allowedQuestionTypes: ['mcq', 'open'], topicMode: 'all', icon: 'shuffle' },
  { id: 'mixed-topic', title: 'Смешанный по дисциплине', shortTitle: 'Микс по дисциплине', description: 'Оба типа заданий из одной выбранной дисциплины.', allowedQuestionTypes: ['mcq', 'open'], topicMode: 'selected', icon: 'layers' },
  { id: 'mcq-all', title: 'Случайный тестовый', shortTitle: 'Тесты', description: 'Только вопросы с вариантами ответа по всем темам.', allowedQuestionTypes: ['mcq'], topicMode: 'all', icon: 'check' },
  { id: 'mcq-topic', title: 'Тестовый по дисциплине', shortTitle: 'Тест по дисциплине', description: 'Тестовые вопросы из одной выбранной дисциплины.', allowedQuestionTypes: ['mcq'], topicMode: 'selected', icon: 'list' },
  { id: 'open-all', title: 'Случайный открытый', shortTitle: 'Открытые', description: 'Открытые вопросы для тренировки развёрнутого ответа.', allowedQuestionTypes: ['open'], topicMode: 'all', icon: 'pen' },
  { id: 'open-topic', title: 'Открытый по дисциплине', shortTitle: 'Ответ по дисциплине', description: 'Открытые вопросы из одной выбранной дисциплины.', allowedQuestionTypes: ['open'], topicMode: 'selected', icon: 'book' },
  { id: 'mai', title: 'МАИ', shortTitle: 'МАИ', description: 'Полная программа вступительного экзамена МАИ: 10 дисциплин, тестовые и открытые задания.', allowedQuestionTypes: ['mcq', 'open'], topicMode: 'all', icon: 'graduation', categories: ['mai-discrete', 'mai-graphs', 'mai-informatics', 'mai-architecture', 'mai-os', 'mai-programming', 'mai-networks', 'mai-security', 'mai-databases', 'mai-probability'] }
];
export const getTrack = (id: string | undefined) => TRACKS.find((track) => track.id === id);
export const typeLabel = (types: QuestionKind[]) => types.length === 2 ? 'Тесты + открытые' : types[0] === 'mcq' ? 'Только тесты' : 'Только открытые';
