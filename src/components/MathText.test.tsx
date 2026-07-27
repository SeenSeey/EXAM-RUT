import katex from 'katex';
import { describe, expect, it } from 'vitest';
import { topicRepository } from '../repositories/topicRepository';

const formulaPattern = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;

function stringsIn(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === 'object') return Object.values(value).flatMap(stringsIn);
  return [];
}

describe('математический текст МАИ', () => {
  it('содержит только парные и валидные LaTeX-формулы', () => {
    const maiTopics = topicRepository.topics.filter((topic) => topic.category.startsWith('mai-'));
    const formulas = stringsIn(maiTopics).flatMap((text) => [...text.matchAll(formulaPattern)].map((match) => match[1] ?? match[2]));
    expect(formulas.length).toBeGreaterThan(50);
    formulas.forEach((formula) => expect(() => katex.renderToString(formula, { throwOnError: true, strict: 'ignore' })).not.toThrow());
  });
});
