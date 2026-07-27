export type QuestionKind = 'mcq' | 'open';
export type TopicMode = 'all' | 'selected';
export type SessionSize = 10 | 20 | 50 | 'all' | 'infinite';
export type OpenRating = 'correct' | 'partial' | 'incorrect';

interface QuestionBase {
  id: string; type: QuestionKind; concept: string; difficulty: string; questionType?: string;
  question: string; sourceQuote?: string;
}
export interface McqQuestion extends QuestionBase {
  type: 'mcq'; options: string[]; correctIndex: number; rationales?: string[]; explanation: string;
}
export interface OpenQuestion extends QuestionBase {
  type: 'open'; keyPoints: string[]; answerPlan?: string[]; modelAnswer: string;
}
export type Question = McqQuestion | OpenQuestion;
export interface TopicFile { topicId: number; topicTitle: string; promptVersion?: string; conceptsIdentified?: string[]; questions: Question[] }
export interface Topic extends TopicFile { key: string; category: string; categoryTitle: string; sourcePath: string }
export interface QuestionRef { key: string; topicKey: string; questionId: string }

export interface TrackDefinition {
  id: string; title: string; shortTitle: string; description: string; allowedQuestionTypes: QuestionKind[];
  topicMode: TopicMode; icon: string; categories?: string[];
}
export interface McqAnswer { kind: 'mcq'; selectedIndex: number; correct: boolean; answeredAt: string }
export interface OpenAnswer { kind: 'open'; text: string; skipped: boolean; rating?: OpenRating; answeredAt: string }
export type SessionAnswer = McqAnswer | OpenAnswer;
export interface StudySession {
  schemaVersion: 1; id: string; trackId: string; topicKey?: string; requestedSize: SessionSize;
  queue: string[]; position: number; cycle: number; answers: Record<string, SessionAnswer>; draft: string;
  status: 'active' | 'completed'; startedAt: string; completedAt?: string;
}
export interface AggregateStats {
  sessions: number; answered: number; skipped: number; mcqCorrect: number; mcqTotal: number;
  open: Record<OpenRating, number>; streakDays: string[];
}
export interface AppSettings { theme: 'system' | 'light' | 'dark' }
export interface PersistedState { version: 1; session: StudySession | null; stats: AggregateStats; settings: AppSettings }
