import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { TopicsPage } from './pages/TopicsPage';
import { TrackSetupPage } from './pages/TrackSetupPage';
import { SessionPage } from './pages/SessionPage';
import { ResultsPage } from './pages/ResultsPage';
import { SettingsPage } from './pages/SettingsPage';
const router = createHashRouter([{ path: '/', element: <Layout/>, children: [{ index: true, element: <HomePage/> }, { path: 'topics', element: <TopicsPage/> }, { path: 'track/:trackId', element: <TrackSetupPage/> }, { path: 'session', element: <SessionPage/> }, { path: 'results', element: <ResultsPage/> }, { path: 'settings', element: <SettingsPage/> }, { path: '*', element: <HomePage/> }] }]);
export function App() { return <RouterProvider router={router}/>; }
