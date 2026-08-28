import React, { useState } from 'react';
import {
  FileText,
  CheckSquare,
  Lock,
  BookOpen,
  AlertCircle,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { Problem } from '../../types/problem';
import { RunSummary } from '../../types/execution';
import { Badge } from '../common/Badge';
import { SolutionTab } from './SolutionTab';

interface QuestionPanelProps {
  problem: Problem;
  setProblems?: Problem[];
  onSelectSetProblem?: (problemId: string) => void;
  activeTab: 'question' | 'testcases' | 'solution';
  onTabChange: (tab: 'question' | 'testcases' | 'solution') => void;
  lastSummary: RunSummary | null;
  testCasePanel?: React.ReactNode;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  problem,
  setProblems = [],
  onSelectSetProblem,
  activeTab,
  onTabChange,
  lastSummary,
  testCasePanel,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-full flex bg-[#FFF9F5] dark:bg-[#17141E] border-r border-[#EADACD] dark:border-white/10 overflow-hidden">
      {/* Question Set Navigator Sidebar (1, 2, 3, 4) with smooth slide transition */}
      {setProblems && setProblems.length > 0 && (
        <div
          className={`bg-[#F3EAE1] dark:bg-[#252033] border-r border-[#EADACD] dark:border-white/10 flex flex-col items-center py-2.5 gap-2 flex-shrink-0 select-none transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-14 px-1' : 'w-7 px-0'
          }`}
        >
          {/* Sidebar Expand / Collapse Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-lg text-[#685952] dark:text-[#BBB3C5] hover:text-[#231815] dark:hover:text-white hover:bg-[#EADACD] dark:hover:bg-[#302A42] transition-colors"
            title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-4 h-4 text-[#E65527] dark:text-[#FF7E54]" />
            ) : (
              <PanelLeftOpen className="w-4 h-4 text-[#E65527] dark:text-[#FF7E54]" />
            )}
          </button>

          {isSidebarOpen && (
            <div className="text-[9px] font-black uppercase text-[#685952] dark:text-[#BBB3C5] tracking-wider mb-1">
              Q Set
            </div>
          )}

          {/* Question buttons 1, 2, 3, 4 */}
          {setProblems.map((p, idx) => {
            const qNum = p.setProblemNumber || idx + 1;
            const currentQNum = problem.setProblemNumber || 1;

            const isCurrent = p.id === problem.id;

            return (
              <button
                key={p.id}
                onClick={() => onSelectSetProblem && onSelectSetProblem(p.id)}
                title={`Question ${qNum}: ${p.title}`}
                className={`rounded-xl flex items-center justify-center font-black transition-all ${
                  isSidebarOpen ? 'w-9 h-9 text-xs' : 'w-5 h-7 text-[10px]'
                } ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#E65527] to-[#C43B0E] dark:from-[#FF6B3B] dark:to-[#E04E1F] text-white shadow-md scale-105'
                    : 'bg-[#FFF9F5] dark:bg-[#1E1A28] text-[#685952] dark:text-[#BBB3C5] hover:text-[#231815] dark:hover:text-white border border-[#EADACD] dark:border-white/10'
                }`}
              >
                {qNum}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Question Panel Body */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Panel Header Tabs */}
      <div className="h-10 bg-[#F3EAE1]/80 dark:bg-[#252033]/80 border-b border-[#EADACD] dark:border-white/10 px-3 flex items-center gap-1 select-none flex-shrink-0">
        <button
          onClick={() => onTabChange('question')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'question'
              ? 'bg-[#FFF9F5] dark:bg-[#1E1A28] text-[#E65527] dark:text-[#FF7E54] shadow-sm'
              : 'text-[#685952] dark:text-[#BBB3C5] hover:text-[#231815] dark:hover:text-[#F7F5F8]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Question</span>
        </button>

        <button
          onClick={() => onTabChange('testcases')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'testcases'
              ? 'bg-[#FFF9F5] dark:bg-[#1E1A28] text-[#E65527] dark:text-[#FF7E54] shadow-sm'
              : 'text-[#685952] dark:text-[#BBB3C5] hover:text-[#231815] dark:hover:text-[#F7F5F8]'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Test Cases</span>
          {problem.testCases.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#EADACD] dark:bg-[#302A42] text-[10px]">
              {problem.testCases.length}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('solution')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'solution'
              ? 'bg-[#FFF9F5] dark:bg-[#1E1A28] text-[#E65527] dark:text-[#FF7E54] shadow-sm'
              : 'text-[#685952] dark:text-[#BBB3C5] hover:text-[#231815] dark:hover:text-[#F7F5F8]'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Solution</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'question' && (
          <div className="p-6 space-y-6 text-slate-800 dark:text-slate-200 text-sm">
            {/* Title & Header Badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {problem.week && (
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border border-slate-200 dark:border-slate-700">
                    {problem.week}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                  {problem.topic}
                </span>
                <Badge variant="difficulty" difficulty={problem.difficulty}>
                  {problem.difficulty}
                </Badge>
              </div>

              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {problem.title}
              </h1>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Description
              </h3>
              <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed font-normal bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {problem.description}
              </div>
            </div>

            {/* Requirements list */}
            {problem.requirements && problem.requirements.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Requirements
                </h3>
                <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-indigo-50/40 dark:bg-indigo-950/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                  {problem.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Input & Output Format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {problem.inputFormat && (
                <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Input Format
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-normal">
                    {problem.inputFormat}
                  </div>
                </div>
              )}

              {problem.outputFormat && (
                <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Output Format
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-normal">
                    {problem.outputFormat}
                  </div>
                </div>
              )}
            </div>

            {/* Constraints */}
            {problem.constraints && problem.constraints.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Constraints
                </h3>
                <div className="flex flex-wrap gap-2">
                  {problem.constraints.map((c, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs rounded-md border border-slate-200 dark:border-slate-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Example Test Cases preview */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Sample Test Cases
              </h3>
              {problem.testCases
                .filter((tc) => tc.isPublic)
                .slice(0, 2)
                .map((tc, idx) => (
                  <div
                    key={tc.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2"
                  >
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Sample Case {idx + 1}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 mb-1">INPUT</div>
                        <pre className="p-2 bg-white dark:bg-slate-900 rounded font-mono text-[11px] border border-slate-200 dark:border-slate-800 overflow-x-auto">
                          {tc.input}
                        </pre>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 mb-1">
                          EXPECTED OUTPUT
                        </div>
                        <pre className="p-2 bg-white dark:bg-slate-900 rounded font-mono text-[11px] border border-slate-200 dark:border-slate-800 overflow-x-auto">
                          {tc.expectedOutput}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Testcases tab contents */}
        {activeTab === 'testcases' && (
          <div className="h-full overflow-hidden">
            {testCasePanel}
          </div>
        )}

        {/* Solution tab contents */}
        {activeTab === 'solution' && (
          <SolutionTab problem={problem} lastSummary={lastSummary} />
        )}
      </div>
    </div>
  </div>
);
};
