import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AggregateStats, AppSettings, PersistedState, StudySession } from '../domain/types';
import { readState, writeState, DEFAULT_STATE, STORAGE_KEY } from '../storage/storage';
import { topicRepository } from '../repositories/topicRepository';

interface AppContextValue {
  state: PersistedState; setSession: (session: StudySession | null) => void; setStats: (stats: AggregateStats) => void;
  setSettings: (settings: AppSettings) => void; reset: () => void;
}
const AppContext = createContext<AppContextValue | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(readState);
  useEffect(() => { writeState(state); }, [state]);
  useEffect(() => {
    const root = document.documentElement; const dark = state.settings.theme === 'dark' || (state.settings.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    root.dataset.theme = dark ? 'dark' : 'light';
  }, [state.settings.theme]);
  const setSession = useCallback((session: StudySession | null) => setState((s) => ({ ...s, session })), []);
  const setStats = useCallback((stats: AggregateStats) => setState((s) => ({ ...s, stats })), []);
  const setSettings = useCallback((settings: AppSettings) => setState((s) => ({ ...s, settings })), []);
  const reset = useCallback(() => { localStorage.removeItem(STORAGE_KEY); setState(DEFAULT_STATE); }, []);
  const value = useMemo(() => ({ state, setSession, setStats, setSettings, reset }), [state, setSession, setStats, setSettings, reset]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() { const value = useContext(AppContext); if (!value) throw new Error('useApp должен использоваться внутри AppProvider'); return value; }
export const topics = topicRepository.topics;
