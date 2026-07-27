import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, Layers3, ListChecks, PenLine, Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TrackDefinition } from '../domain/types';
const icons = { shuffle: Shuffle, layers: Layers3, check: CheckCircle2, list: ListChecks, pen: PenLine, book: BookOpen, graduation: GraduationCap };
export function TrackCard({ track, index }: { track: TrackDefinition; index: number }) { const Icon = icons[track.icon as keyof typeof icons] ?? Shuffle; return <Link className="track-card" to={`/track/${track.id}`}><span className={`track-icon tone-${index % 3}`}><Icon/></span><span className="track-copy"><strong>{track.title}</strong><small>{track.description}</small></span><ArrowRight className="track-arrow" aria-hidden="true"/></Link>; }
