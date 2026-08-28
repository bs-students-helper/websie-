import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { SubjectOPPEPage } from './pages/SubjectOPPEPage';
import { PracticePage } from './pages/PracticePage';
import { ProblemsPage } from './pages/ProblemsPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { MockExamPage } from './pages/MockExamPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter basename="/oppe">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/subject/:subjectId" element={<SubjectOPPEPage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/practice" element={<Navigate to="/practice/java-exception-001" replace />} />
        <Route path="/practice/:problemId" element={<PracticePage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/mock-exam" element={<MockExamPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
