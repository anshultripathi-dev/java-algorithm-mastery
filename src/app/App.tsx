import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Curriculum } from '@/pages/Curriculum';
import { LessonPage } from '@/pages/LessonPage';
import { Playground } from '@/pages/Playground';
import { Practice } from '@/pages/Practice';
import { Lab } from '@/pages/Lab';
import { Revision } from '@/pages/Revision';
import { VideoLibrary } from '@/pages/VideoLibrary';
import { Plan } from '@/pages/Plan';
import { SettingsPage } from '@/pages/SettingsPage';

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="plan" element={<Plan />} />
          <Route path="curriculum" element={<Curriculum />} />
          <Route path="lesson/:id" element={<LessonPage />} />
          <Route path="playground" element={<Playground />} />
          <Route path="practice" element={<Practice />} />
          <Route path="lab" element={<Lab />} />
          <Route path="revision" element={<Revision />} />
          <Route path="videos" element={<VideoLibrary />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
