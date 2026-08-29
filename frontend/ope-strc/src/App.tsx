import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { SubjectOPPEPage } from './pages/SubjectOPPEPage';
import { PracticePage } from './pages/PracticePage';
import { ProblemsPage } from './pages/ProblemsPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { MockExamPage } from './pages/MockExamPage';
import { ComingSoon } from './pages/ComingSoon';

const getBasename = () => {
  const path = window.location.pathname;
  if (path.includes('/frontend/oppe')) {
    return '/frontend/oppe';
  }
  if (path.includes('/oppe')) {
    return '/oppe';
  }
  return '/';
};

const MaintenanceGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const isDev = searchParams.get('dev') === 'true';
  if (isDev) {
    return <>{children}</>;
  }
  return <ComingSoon />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter basename={getBasename()}>
      <Routes>
        <Route path="/" element={<MaintenanceGuard><Dashboard /></MaintenanceGuard>} />
        <Route path="/subject/:subjectId" element={<MaintenanceGuard><SubjectOPPEPage /></MaintenanceGuard>} />
        <Route path="/problems" element={<MaintenanceGuard><ProblemsPage /></MaintenanceGuard>} />
        <Route path="/practice" element={<MaintenanceGuard><Navigate to="/practice/java-exception-001" replace /></MaintenanceGuard>} />
        <Route path="/practice/:problemId" element={<MaintenanceGuard><PracticePage /></MaintenanceGuard>} />
        <Route path="/bookmarks" element={<MaintenanceGuard><BookmarksPage /></MaintenanceGuard>} />
        <Route path="/mock-exam" element={<MaintenanceGuard><MockExamPage /></MaintenanceGuard>} />
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
