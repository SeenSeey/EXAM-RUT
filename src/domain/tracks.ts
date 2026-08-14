import type { QuestionKind, TrackDefinition } from './types';

export const TRACKS: TrackDefinition[] = [
  { id: 'mixed-all', title: 'Случайный смешанный', shortTitle: 'Микс', description: 'Тестовые и открытые задания из всех дисциплин и тем.', allowedQuestionTypes: ['mcq', 'open'], topicMode: 'all', icon: 'shuffle' },
  { id: 'mixed-topic', title: 'Смешанный по дисциплине', shortTitle: 'Микс по дисциплине', description: 'Оба типа заданий из одной выбранной дисциплины.', allowedQuestionTypes: ['mcq', 'open'], topicMode: 'selected', icon: 'layers' },
  { id: 'mcq-all', title: 'Случайный тестовый', shortTitle: 'Тесты', description: 'Только вопросы с вариантами ответа по всем темам.', allowedQuestionTypes: ['mcq'], topicMode: 'all', icon: 'check' },
  { id: 'mcq-topic', title: 'Тестовый по дисциплине', shortTitle: 'Тест по дисциплине', description: 'Тестовые вопросы из одной выбранной дисциплины.', allowedQuestionTypes: ['mcq'], topicMode: 'selected', icon: 'list' },
  { id: 'open-all', title: 'Случайный открытый', shortTitle: 'Открытые', description: 'Открытые вопросы для тренировки развёрнутого ответа.', allowedQuestionTypes: ['open'], topicMode: 'all', icon: 'pen' },
  { id: 'open-topic', title: 'Открытый по дисциплине', shortTitle: 'Ответ по дисциплине', description: 'Открытые вопросы из одной выбранной дисциплины.', allowedQuestionTypes: ['open'], topicMode: 'selected', icon: 'book' },
  { id: 'mai', title: 'МАИ', shortTitle: 'МАИ', description: 'Полная программа вступительного экзамена МАИ: 10 дисциплин, тестовые и открытые задания.', allowedQuestionTypes: ['mcq', 'open'], topicMode: 'all', icon: 'graduation', categories: ['mai-discrete', 'mai-graphs', 'mai-informatics', 'mai-architecture', 'mai-os', 'mai-programming', 'mai-networks', 'mai-security', 'mai-databases', 'mai-probability'] },
  { id: 'stankin-090401', title: 'СТАНКИН 09.04.01', shortTitle: 'СТАНКИН', description: 'Все 4 блока вступительного испытания: цифровые технологии, анализ данных, программная инженерия и математика.', allowedQuestionTypes: ['mcq', 'open'], topicMode: 'all', icon: 'graduation', categories: ['stankin'] },
  { id: 'mephi', title: 'МИФИ', shortTitle: 'МИФИ', description: '40 тем вступительного экзамена: общая информатика, алгоритмы, типы данных и программирование.', allowedQuestionTypes: ['mcq', 'open'], topicMode: 'all', icon: 'graduation', categories: ['mephi'], mcqRatio: .5 }
];
export const getTrack = (id: string | undefined) => TRACKS.find((track) => track.id === id);
export const typeLabel = (types: QuestionKind[]) => types.length === 2 ? 'Тесты + открытые' : types[0] === 'mcq' ? 'Только тесты' : 'Только открытые';
