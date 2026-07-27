import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { McqCard } from './McqCard';
import { OpenCard } from './OpenCard';
import { mcq, open } from '../test/fixtures';
describe('карточки заданий', () => {
  it('MCQ до ответа скрывает объяснение', () => { render(<McqCard question={mcq('m')} onAnswer={vi.fn()}/>); expect(screen.getByRole('button', { name: /проверить/i })).toBeDisabled(); expect(screen.queryByText('Объяснение')).not.toBeInTheDocument(); });
  it('MCQ после правильного ответа сообщает результат', () => { render(<McqCard question={mcq('m')} answer={{ kind:'mcq', selectedIndex:0, correct:true, answeredAt:'' }} onAnswer={vi.fn()}/>); expect(screen.getByRole('heading', { name: 'Верно' })).toBeInTheDocument(); });
  it('MCQ после ошибки показывает верный вариант', () => { render(<McqCard question={mcq('m')} answer={{ kind:'mcq', selectedIndex:1, correct:false, answeredAt:'' }} onAnswer={vi.fn()}/>); expect(screen.getByRole('heading', { name: 'Неверно' })).toBeInTheDocument(); expect(screen.getByLabelText('Правильный ответ')).toBeInTheDocument(); });
  it('open до проверки скрывает эталон', () => { render(<OpenCard question={open('o')} draft="" onDraft={vi.fn()} onAnswer={vi.fn()} onRate={vi.fn()}/>); expect(screen.queryByText('Эталон')).not.toBeInTheDocument(); expect(screen.getByRole('button', { name:/сверить/i })).toBeDisabled(); });
  it('open после проверки показывает эталон', () => { render(<OpenCard question={open('o')} draft="" answer={{kind:'open',text:'Ответ',skipped:false,answeredAt:''}} onDraft={vi.fn()} onAnswer={vi.fn()} onRate={vi.fn()}/>); expect(screen.getByText('Эталон')).toBeInTheDocument(); });
  it('позволяет выбрать ответ с клавиатуры', async () => { const fn=vi.fn(); render(<McqCard question={mcq('m')} onAnswer={fn}/>); await userEvent.click(screen.getByLabelText(/Да/)); await userEvent.click(screen.getByRole('button',{name:/проверить/i})); expect(fn).toHaveBeenCalled(); });
});
