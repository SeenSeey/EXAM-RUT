import { BookOpen, GraduationCap, Home, Moon, Settings, Sun } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../app/AppContext';
import { useOnline } from '../hooks/useOnline';

export function Layout() {
  const { state, setSettings } = useApp(); const online = useOnline();
  const toggleTheme = () => setSettings({ theme: document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark' });
  return <div className="app-shell">
    <a className="skip-link" href="#main">Перейти к содержимому</a>
    <header className="topbar"><NavLink className="brand" to="/"><span className="brand-mark"><GraduationCap size={23}/></span><span>Магистр</span></NavLink>
      <nav className="desktop-nav" aria-label="Основная навигация"><NavItem to="/" icon={<Home/>}>Главная</NavItem><NavItem to="/topics" icon={<BookOpen/>}>Дисциплины</NavItem></nav>
      <div className="top-actions">{!online && <span className="offline" role="status">● Офлайн</span>}<NavLink className="icon-button mobile-catalog-link" to="/topics" aria-label="Каталог дисциплин"><BookOpen/></NavLink><NavLink className="icon-button" to="/settings" aria-label="Настройки"><Settings/></NavLink><button className="icon-button" onClick={toggleTheme} aria-label="Переключить цветовую тему">{state.settings.theme === 'dark' ? <Sun/> : <Moon/>}</button></div>
    </header>
    <main id="main"><Outlet/></main>
  </div>;
}
function NavItem({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) { return <NavLink to={to} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>{icon}<span>{children}</span></NavLink>; }
