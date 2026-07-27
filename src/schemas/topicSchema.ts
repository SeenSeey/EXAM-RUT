import { z } from 'zod';

const base = z.object({
  id: z.string().min(1), concept: z.string().min(1), difficulty: z.string().min(1),
  questionType: z.string().optional(), question: z.string().min(1), sourceQuote: z.string().optional()
});
const mcq = base.extend({
  type: z.literal('mcq'), options: z.array(z.string().min(1)).min(1), correctIndex: z.number().int().nonnegative(),
  rationales: z.array(z.string()).optional(), explanation: z.string().min(1)
}).superRefine((question, ctx) => {
  if (question.correctIndex >= question.options.length) ctx.addIssue({ code: 'custom', path: ['correctIndex'], message: 'correctIndex выходит за границы options' });
});
const open = base.extend({ type: z.literal('open'), keyPoints: z.array(z.string()), modelAnswer: z.string().min(1) });
export const topicFileSchema = z.object({
  topicId: z.number().int().nonnegative(), topicTitle: z.string().min(1), promptVersion: z.string().optional(),
  conceptsIdentified: z.array(z.string()).optional(), questions: z.array(z.union([mcq, open])).min(1)
}).superRefine((topic, ctx) => {
  const seen = new Set<string>();
  topic.questions.forEach((q, index) => {
    if (seen.has(q.id)) ctx.addIssue({ code: 'custom', path: ['questions', index, 'id'], message: `Дублирующийся id: ${q.id}` });
    seen.add(q.id);
  });
});
