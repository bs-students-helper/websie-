import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Code2,
  ChevronDown,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  Settings,
  Bookmark,
  Award,
  CheckCircle2,
  Save,
  BookOpen,
  LayoutDashboard,
  Home,
} from 'lucide-react';
import { Subject, Problem } from '../../types/problem';
import { SUBJECTS } from '../../data/subjects';
import { ALL_PROBLEMS } from '../../data/problems';

interface HeaderProps {
  currentSubject?: Subject;
  currentProblem?: Problem;
  onSelectSubject: (subjectId: string) => void;
  onSelectProblem: (problemId: string) => void;
  fontSize: number;
  onFontSizeChange: (delta: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isSaved?: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSubject = SUBJECTS[0],
  currentProblem,
  onSelectSubject,
  onSelectProblem,
  fontSize,
  onFontSizeChange,
  isFullscreen,
  onToggleFullscreen,
  isSaved = true,
  theme,
  onToggleTheme,
  onOpenSettings,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const navigate = useNavigate();
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isProblemDropdownOpen, setIsProblemDropdownOpen] = useState(false);

  const subjectProblems = ALL_PROBLEMS.filter(
    (p) => p.subjectId === currentSubject.id
  );

  return (
    <header className="h-14 bg-[#FFF9F5] dark:bg-[#17141E] border-b border-[#EADACD] dark:border-white/10 px-4 flex items-center justify-between shadow-sm z-30 select-none transition-colors">
      {/* Left section: Logo & Subtitle */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/assets/images/logo.png"
            alt="BSH Logo"
            className="h-8 w-auto object-contain dark:filter dark:brightness-110 group-hover:scale-105 transition-transform"
            onError={(e) => {
              // fallback if loaded directly without root asset context
              e.currentTarget.onerror = null;
              e.currentTarget.src = '../assets/images/logo.png';
            }}
          />
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5 font-bold text-[#231815] dark:text-[#F7F5F8] leading-tight text-sm tracking-tight">
              OPPE Practice Lab
            </div>
            <div className="text-[10px] font-bold tracking-wider text-[#E65527] dark:text-[#FF7E54] uppercase">
              IITM BS Data Science
            </div>
          </div>
        </Link>

        <div className="h-5 w-px bg-[#EADACD] dark:bg-white/10 mx-1 hidden md:block" />

        {/* Navigation shortcut links */}
        <div className="hidden lg:flex items-center gap-1">
          <a
            href="/"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#D84C1E] dark:text-[#FF7E54] bg-[#E65527]/10 hover:bg-[#E65527]/20 dark:bg-[#FF6B3B]/15 rounded-md transition-colors border border-[#E65527]/30 mr-1"
            title="Return to BSH Main Website"
          >
            <Home className="w-3.5 h-3.5" />
            BSH Portal
          </a>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#685952] dark:text-[#BBB3C5] hover:bg-[#F3EAE1] dark:hover:bg-[#252033] rounded-md transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
        </div>
      </div>

      {/* Center section: Subject & Problem Selectors */}
      <div className="flex items-center gap-2">
        {/* Subject dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-semibold border border-slate-200/80 dark:border-slate-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span className="max-w-[130px] sm:max-w-[180px] truncate">
              {currentSubject.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isSubjectDropdownOpen && (
            <div
              className="absolute left-0 mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs animate-fade-in"
              onMouseLeave={() => setIsSubjectDropdownOpen(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Subject
              </div>
              {SUBJECTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectSubject(s.id);
                    setIsSubjectDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors ${
                    s.id === currentSubject.id
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-[10px] text-slate-400">{s.code}</div>
                  </div>
                  {s.id === currentSubject.id && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Problem selector dropdown */}
        {currentProblem && (
          <div className="relative">
            <button
              onClick={() => setIsProblemDropdownOpen(!isProblemDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-semibold border border-slate-200/80 dark:border-slate-700 transition-colors"
            >
              <span className="max-w-[140px] sm:max-w-[200px] truncate">
                {currentProblem.title}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProblemDropdownOpen && (
              <div
                className="absolute left-0 mt-1.5 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs max-h-80 overflow-y-auto animate-fade-in"
                onMouseLeave={() => setIsProblemDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Problem ({subjectProblems.length})
                </div>
                {subjectProblems.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProblem(p.id);
                      setIsProblemDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors ${
                      p.id === currentProblem.id
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] font-bold text-slate-400">
                        P{idx + 1}
                      </span>
                      <span className="truncate">{p.title}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {p.difficulty}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right section: Controls */}
      <div className="flex items-center gap-2">
        {/* Language Badge */}
        {currentProblem && (
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
            {currentProblem.language}
          </span>
        )}

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          title="IDE Settings"
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
