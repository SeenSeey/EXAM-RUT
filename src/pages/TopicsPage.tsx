import { ArrowRight, BookOpen, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { topics } from '../app/AppContext';
import { getDisciplines } from '../domain/disciplines';

export function TopicsPage() {
  const [query, setQuery] = useState('');
  const disciplines = useMemo(() => getDisciplines(topics).filter((item) => item.title.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div className="page narrow">
    <div className="page-header"><span className="eyebrow">Каталог</span><h1>Дисциплины</h1><p>{disciplines.length} дисциплин · {topics.length} учебных тем</p></div>
    <label className="search"><Search/><span className="sr-only">Поиск дисциплины</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти дисциплину…"/></label>
    <div className="discipline-list">{disciplines.map((discipline) => <article className="discipline-card" key={discipline.key}>
      <span className="discipline-symbol"><BookOpen/></span>
      <div className="discipline-copy"><h2>{discipline.title}</h2><p>{discipline.topics.length} тем · {discipline.questionCount} заданий</p><div className="discipline-counts"><span>{discipline.mcqCount} тестовых</span><span>{discipline.openCount} открытых</span></div></div>
      <div className="discipline-actions"><Link className="button secondary" to={`/track/mcq-topic?topic=${encodeURIComponent(discipline.key)}`}>Тесты</Link><Link className="icon-button" aria-label={`Открыть смешанный трек: ${discipline.title}`} to={`/track/mixed-topic?topic=${encodeURIComponent(discipline.key)}`}><ArrowRight/></Link></div>
    </article>)}</div>
    {!disciplines.length && <div className="empty"><Search/><h2>Ничего не найдено</h2><p>Попробуйте изменить поисковый запрос.</p></div>}
  </div>;
}
