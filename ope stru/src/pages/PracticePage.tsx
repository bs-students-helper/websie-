import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ALL_PROBLEMS, getProblemById } from '../data/problems';
import { SUBJECTS } from '../data/subjects';
import { Header } from '../components/layout/Header';
import { ResizableLayout } from '../components/layout/ResizableLayout';
import { QuestionPanel } from '../components/question/QuestionPanel';
import { TestCasePanel } from '../components/tests/TestCasePanel';
import { MonacoEditorWrapper } from '../components/editor/MonacoEditorWrapper';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { ResetConfirmModal } from '../components/editor/ResetConfirmModal';
import { SettingsModal } from '../components/editor/SettingsModal';
import { useTestRunner } from '../hooks/useTestRunner';
import {
  saveProblemCode,
  getProblemCode,
  getPreferences,
  savePreferences,
  getBookmarks,
  toggleBookmarkStorage,
} from '../utils/storage';

export const PracticePage: React.FC = () => {
  const { problemId } = useParams<{ problemId?: string }>();
  const navigate = useNavigate();

  // Selected problem resolution
  const currentProblem = getProblemById(problemId || 'java-exception-001') || ALL_PROBLEMS[0];
  const currentSubject = SUBJECTS.find((s) => s.id === currentProblem.subjectId) || SUBJECTS[0];

  // Editor code state
  const [code, setCode] = useState<string>(() => {
    return getProblemCode(currentProblem.id) || currentProblem.starterCode;
  });

  // UI States
  const [questionTab, setQuestionTab] = useState<'question' | 'testcases' | 'solution'>('question');
  const [fontSize, setFontSize] = useState<number>(getPreferences().fontSize || 14);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>(getPreferences().editorTheme || 'vs-dark');
  const [theme, setTheme] = useState<'dark' | 'light'>(getPreferences().theme === 'dark' ? 'dark' : 'light');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  // Modals
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>(getBookmarks());
  const isBookmarked = bookmarks.includes(currentProblem.id);

  // Test Runner hook
  const { isRunning, summary, runCode, clearResults } = useTestRunner(currentProblem);

  // When problemId changes, reload saved code or starter code
  useEffect(() => {
    const saved = getProblemCode(currentProblem.id);
    setCode(saved || currentProblem.starterCode);
    clearResults();
    setIsSaved(true);
  }, [currentProblem.id]);

  // Code change auto-saver
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setIsSaved(false);

    // Debounce save
    const timeout = setTimeout(() => {
      saveProblemCode(currentProblem.id, newCode);
      setIsSaved(true);
    }, 600);

    return () => clearTimeout(timeout);
  };

  const handleRun = async () => {
    setQuestionTab('testcases');
    await runCode(code);
  };

  const handleSubmit = async () => {
    setQuestionTab('testcases');
    await runCode(code);
  };

  const handleResetConfirm = () => {
    setCode(currentProblem.starterCode);
    saveProblemCode(currentProblem.id, currentProblem.starterCode);
    setIsSaved(true);
    clearResults();
  };

  const handleToggleBookmark = () => {
    const updated = toggleBookmarkStorage(currentProblem.id);
    setBookmarks(updated);
  };

  const handleFontSizeChange = (delta: number) => {
    const nextSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(nextSize);
    savePreferences({ fontSize: nextSize });
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    savePreferences({ theme: nextTheme });
  };

  // Find all problems belonging to the current question paper set
  const setProblems = ALL_PROBLEMS.filter(
    (p) =>
      p.subjectId === currentProblem.subjectId &&
      p.oppeType === currentProblem.oppeType &&
      p.year === currentProblem.year &&
      p.setName === currentProblem.setName
  );
  const currentSetProblems = setProblems.length >= 2
    ? setProblems
    : ALL_PROBLEMS.filter((p) => p.subjectId === currentProblem.subjectId).slice(0, 4);

  return (
    <div className={`w-screen h-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'dark bg-[#0F0D13] text-[#F7F5F8]' : 'bg-[#F8EFE6] text-[#231815]'}`}>
      {/* Header */}
      <Header
        currentSubject={currentSubject}
        currentProblem={currentProblem}
        onSelectSubject={(subjId) => navigate(`/subject/${subjId}`)}
        onSelectProblem={(probId) => navigate(`/practice/${probId}`)}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        isSaved={isSaved}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isBookmarked={isBookmarked}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Main IDE Workspace */}
      <ResizableLayout
        questionPanel={
          <QuestionPanel
            problem={currentProblem}
            setProblems={currentSetProblems}
            onSelectSetProblem={(probId) => navigate(`/practice/${probId}`)}
            activeTab={questionTab}
            onTabChange={setQuestionTab}
            lastSummary={summary}
            testCasePanel={
              <TestCasePanel
                problem={currentProblem}
                summary={summary}
                isRunning={isRunning}
              />
            }
          />
        }
        editorPanel={
          <div className="w-full h-full flex flex-col overflow-hidden">
            <div className="flex-1">
              <MonacoEditorWrapper
                value={code}
                onChange={handleCodeChange}
                language={currentProblem.language}
                fileName={currentProblem.fileName}
                fontSize={fontSize}
                theme={editorTheme}
                onRun={handleRun}
                onSubmit={handleSubmit}
                onSave={() => {
                  saveProblemCode(currentProblem.id, code);
                  setIsSaved(true);
                }}
              />
            </div>
            <EditorToolbar
              onRun={handleRun}
              onSubmit={handleSubmit}
              onReset={() => setIsResetModalOpen(true)}
              isRunning={isRunning}
            />
          </div>
        }
      />

      {/* Reset confirmation modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetConfirm}
      />

      {/* Settings modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        fontSize={fontSize}
        onFontSizeChange={(size) => {
          setFontSize(size);
          savePreferences({ fontSize: size });
        }}
        editorTheme={editorTheme}
        onEditorThemeChange={(th) => {
          setEditorTheme(th);
          savePreferences({ editorTheme: th });
        }}
      />
    </div>
  );
};
