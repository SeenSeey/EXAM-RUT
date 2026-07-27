import type { Topic } from './types';

export interface Discipline {
  key: string;
  title: string;
  topics: Topic[];
  questionCount: number;
  mcqCount: number;
  openCount: number;
}

export function getDisciplines(topics: readonly Topic[]): Discipline[] {
  const grouped = new Map<string, Topic[]>();
  topics.forEach((topic) => grouped.set(topic.category, [...(grouped.get(topic.category) ?? []), topic]));
  return [...grouped.entries()].map(([key, items]) => {
    const questions = items.flatMap((topic) => topic.questions);
    const mcqCount = questions.filter((question) => question.type === 'mcq').length;
    return { key, title: items[0]?.categoryTitle ?? key, topics: items, questionCount: questions.length, mcqCount, openCount: questions.length - mcqCount };
  }).sort((a, b) => a.title.localeCompare(b.title, 'ru'));
}
