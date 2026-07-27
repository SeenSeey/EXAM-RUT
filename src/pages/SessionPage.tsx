import { ArrowLeft, ArrowRight, Flag, RefreshCw } from 'lucide-react';
import { useMemo } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { topics, useApp } from '../app/AppContext';
import { QuestionMeta } from '../components/QuestionMeta';
import { McqCard } from '../features/McqCard';
import { OpenCard } from '../features/OpenCard';
import { allQuestions, filterPool, nextCycle } from '../domain/sessionEngine';
import { getTrack } from '../domain/tracks';
import { mergeStats } from '../domain/statistics';
import type { OpenRating, SessionAnswer } from '../domain/types';
export function SessionPage() { const { state, setSession, setStats } = useApp(); const navigate = useNavigate(); const session = state.session; const questionMap = useMemo(() => new Map(allQuestions(topics).map((x) => [x.key, x])), []);
  if (!session) return <Navigate to="/" replace/>; if (session.status === 'completed') return <Navigate to="/results" replace/>;
  const item = questionMap.get(session.queue[session.position]); const track = getTrack(session.trackId); if (!item || !track) return <div className="page narrow empty"><h1>Задание недоступно</h1><p>Возможно, файл темы был удалён после сохранения сессии.</p><button className="button primary" onClick={() => setSession(null)}>На главную</button></div>;
  const topic = topics.find((t) => t.key === item.topicKey)!; const answer = session.answers[item.key]; const canNext = answer?.kind === 'mcq' || (answer?.kind === 'open' && Boolean(answer.rating)); const atEnd = session.position === session.queue.length - 1;
  const updateAnswer = (value: SessionAnswer) => setSession({ ...session, answers: { ...session.answers, [item.key]: value }, draft: '' });
  const rate = (rating: OpenRating) => { const existing = session.answers[item.key]; if (existing?.kind === 'open') setSession({ ...session, answers: { ...session.answers, [item.key]: { ...existing, rating } } }); };
  const finish = () => { const completed = { ...session, status: 'completed' as const, completedAt: new Date().toISOString() }; setStats(mergeStats(state.stats, completed)); setSession(completed); navigate('/results'); };
  const next = () => { if (!canNext) return; if (!atEnd) setSession({ ...session, position: session.position + 1, draft: '' }); else if (session.requestedSize === 'infinite') { const pool = filterPool(topics, track, session.topicKey); setSession(nextCycle(session, pool, track)); } else finish(); };
  const askFinish = () => { if (confirm('Завершить сессию сейчас? Текущие результаты попадут в статистику.')) finish(); };
  return <div className="session-page"><div className="session-bar"><Link to="/" className="icon-button" aria-label="Вернуться на главную"><ArrowLeft/></Link><div className="progress-copy"><span>{track.shortTitle}{session.cycle > 1 ? ` · цикл ${session.cycle}` : ''}</span><strong>{session.position + 1} / {session.queue.length}</strong></div><button className="finish-button" onClick={askFinish}><Flag/> Завершить</button></div><div className="progress"><span style={{ width: `${((session.position + (answer ? 1 : 0)) / session.queue.length) * 100}%` }}/></div>
    <article className="question-card"><QuestionMeta question={item.question} topic={topic}/>{item.question.type === 'mcq' ? <McqCard question={item.question} answer={answer?.kind === 'mcq' ? answer : undefined} onAnswer={updateAnswer}/> : <OpenCard question={item.question} answer={answer?.kind === 'open' ? answer : undefined} draft={session.draft} onDraft={(draft) => setSession({ ...session, draft })} onAnswer={updateAnswer} onRate={rate}/>} {canNext && <button className="button primary full next" onClick={next}>{atEnd && session.requestedSize === 'infinite' ? <><RefreshCw/> Новый цикл</> : atEnd ? <>Завершить сессию <Flag/></> : <>Следующее задание <ArrowRight/></>}</button>}</article>
  </div>; }
