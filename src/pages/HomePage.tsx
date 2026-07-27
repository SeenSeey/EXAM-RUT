import { ArrowRight, BookOpen, Flame, Play, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp, topics } from '../app/AppContext';
import { TrackCard } from '../components/TrackCard';
import { TRACKS } from '../domain/tracks';
import { allQuestions } from '../domain/sessionEngine';
export function HomePage() { const { state } = useApp(); const questionCount = allQuestions(topics).length; return <div className="page home-page"><section className="hero"><div><span className="eyebrow">Подготовка к магистратуре</span><h1>Учитесь в своём темпе.<br/><em>Поступайте уверенно.</em></h1><p>Тренируйтесь на тестах и открытых вопросах по ключевым дисциплинам. Прогресс сохраняется на устройстве.</p><div className="hero-actions"><Link className="button primary" to="/track/mixed-all"><Play/> Начать тренировку</Link><Link className="button ghost" to="/topics">Выбрать дисциплину <ArrowRight/></Link></div></div><div className="hero-visual" aria-hidden="true"><div className="float-card one"><Target/><span><strong>{questionCount}</strong> заданий</span></div><div className="float-card two"><BookOpen/><span><strong>{topics.length}</strong> тем</span></div><div className="hero-orb">М</div></div></section>
    {state.session?.status === 'active' && <Link className="resume-banner" to="/session"><span className="resume-icon"><Play/></span><span><strong>Продолжить незавершённую сессию</strong><small>Задание {state.session.position + 1} из {state.session.queue.length}</small></span><ArrowRight/></Link>}
    <section className="section"><div className="section-heading"><div><span className="eyebrow">Режимы обучения</span><h2>Выберите формат</h2></div></div><div className="tracks-grid">{TRACKS.map((track, i) => <TrackCard key={track.id} track={track} index={i}/>)}</div></section>
    <section className="stats-strip"><div><Target/><span><strong>{state.stats.answered}</strong><small>заданий решено</small></span></div><div><Flame/><span><strong>{state.stats.streakDays.length}</strong><small>активных дней</small></span></div><div><BookOpen/><span><strong>{state.stats.sessions}</strong><small>сессий завершено</small></span></div></section>
  </div>; }
