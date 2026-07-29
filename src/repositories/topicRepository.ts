import { topicFileSchema } from '../schemas/topicSchema';
import type { Question, Topic, TopicFile } from '../domain/types';

const categoryNames: Record<string, string> = {
  algos: 'Алгоритмы и структуры данных', asnpar: 'Асинхронное и параллельное программирование', db: 'Базы данных',
  devops: 'DevOps', 'feat-prog-language': 'Особенности языков программирования', 'inform-tech': 'Информационные технологии',
  linux: 'Linux', os: 'Операционные системы', 'prog-languages': 'Языки программирования', seti: 'Компьютерные сети',
  soa: 'Сервис-ориентированное программирование', web: 'Веб-технологии',
  'mai-discrete': 'МАИ · Дискретная математика и теория алгоритмов',
  'mai-graphs': 'МАИ · Теория графов и комбинаторная оптимизация',
  'mai-informatics': 'МАИ · Информатика и системы счисления',
  'mai-architecture': 'МАИ · Архитектура ЭВМ',
  'mai-os': 'МАИ · Операционные системы',
  'mai-programming': 'МАИ · Технологии программирования',
  'mai-networks': 'МАИ · Компьютерные сети и телекоммуникации',
  'mai-security': 'МАИ · Информационная безопасность',
  'mai-databases': 'МАИ · Базы данных',
  'mai-probability': 'МАИ · Теория вероятностей и математическая статистика',
  stankin: 'СТАНКИН 09.04.01'
};
type JsonModule = { default: unknown };
const modules = import.meta.glob<JsonModule>('../../tasks/*/topic-*.json', { eager: true });

export interface RepositoryResult { topics: Topic[]; errors: string[] }
export function loadTopics(source: Record<string, JsonModule> = modules): RepositoryResult {
  const topics: Topic[] = []; const errors: string[] = []; const topicIds = new Set<string>(); const questionIds = new Set<string>();
  Object.entries(source).forEach(([path, module]) => {
    const parsed = topicFileSchema.safeParse(module.default);
    if (!parsed.success) { errors.push(`${path}: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`); return; }
    const category = path.match(/tasks\/([^/]+)\//)?.[1] ?? 'other'; const key = `${category}:${parsed.data.topicId}`;
    if (topicIds.has(key)) { errors.push(`${path}: повтор topicId ${parsed.data.topicId} в ${category}`); return; }
    const validQuestions: Question[] = [];
    parsed.data.questions.forEach((question) => { const questionKey = `${category}:${question.id}`; if (questionIds.has(questionKey)) errors.push(`${path}: повтор id вопроса ${question.id}`); else { questionIds.add(questionKey); validQuestions.push(question); } });
    topicIds.add(key); topics.push({ ...(parsed.data as TopicFile), questions: validQuestions, key, category, categoryTitle: categoryNames[category] ?? category, sourcePath: path });
  });
  topics.sort((a, b) => a.categoryTitle.localeCompare(b.categoryTitle, 'ru') || a.topicId - b.topicId);
  if (import.meta.env.DEV && errors.length) console.warn('[TopicRepository] Некоторые файлы пропущены:\n' + errors.join('\n'));
  return { topics, errors };
}
export const topicRepository = loadTopics();
