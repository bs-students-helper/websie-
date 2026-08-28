import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Problem, TestCase } from '../../types/problem';
import { RunSummary, TestCaseResult } from '../../types/execution';
import { LearningFeedback } from '../question/LearningFeedback';

interface TestCasePanelProps {
  problem: Problem;
  summary: RunSummary | null;
  isRunning: boolean;
}

export const TestCasePanel: React.FC<TestCasePanelProps> = ({
  problem,
  summary,
  isRunning,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<number | string>(
    problem.testCases[0]?.id || 1
  );

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const publicTestCases = problem.testCases.filter((tc) => tc.isPublic);
  const privateTestCases = problem.testCases.filter((tc) => !tc.isPublic);

  const testResults = summary?.testResults || [];
  const currentResult = testResults.find((r) => r.testCaseId === selectedCaseId);
  const currentTestCase = problem.testCases.find((tc) => tc.id === selectedCaseId);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getResultForCase = (caseId: number | string): TestCaseResult | undefined => {
    return testResults.find((r) => r.testCaseId === caseId);
  };

  return (
    <div className="h-full flex flex-col bg-[#FFF9F5] dark:bg-[#17141E] overflow-hidden">
      {/* Top Banner: Public Tests Summary */}
      <div className="p-4 border-b border-[#EADACD] dark:border-white/10 space-y-3 bg-[#F3EAE1]/50 dark:bg-[#252033]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-[#231815] dark:text-[#F7F5F8] uppercase tracking-wider">
            <GlobeIcon />
            <span>Public Test Cases</span>
          </div>

          {summary ? (
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                {summary.passedTests} Passed
              </span>
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                <XCircle className="w-4 h-4" />
                {summary.failedTests} Failed
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Ready to run</span>
          )}
        </div>

        {/* Demo Mode Notice if active */}
        {summary?.isDemoMode && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-lg border border-amber-200 dark:border-amber-800">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Demo Mode — Offline or mock execution active</span>
          </div>
        )}

        {/* Case pills navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {problem.testCases.map((tc, idx) => {
            const res = getResultForCase(tc.id);
            const isSelected = selectedCaseId === tc.id;

            let badgeColor = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
            if (res) {
              if (res.passed) {
                badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800';
              } else {
                badgeColor = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-300 dark:border-rose-800';
              }
            }

            return (
              <button
                key={tc.id}
                onClick={() => setSelectedCaseId(tc.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${badgeColor} ${
                  isSelected ? 'ring-2 ring-indigo-500/50 shadow-sm' : ''
                }`}
              >
                <span>Case {idx + 1}</span>
                {res && (
                  res.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  )
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content view */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Compilation Error Banner */}
        {summary?.status === 'COMPILATION_ERROR' && (
          <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Compilation Error
            </div>
            <pre className="p-3 bg-rose-900/10 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 rounded-lg font-mono text-[11px] whitespace-pre-wrap overflow-x-auto border border-rose-300 dark:border-rose-900">
              {summary.compileOutput || 'Java compilation failed.'}
            </pre>
          </div>
        )}

        {/* Runtime Error Banner */}
        {summary?.status === 'RUNTIME_ERROR' && (
          <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Runtime Exception
            </div>
            <pre className="p-3 bg-rose-900/10 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 rounded-lg font-mono text-[11px] whitespace-pre-wrap overflow-x-auto border border-rose-300 dark:border-rose-900">
              {currentResult?.stderr || 'Execution terminated unexpectedly.'}
            </pre>
          </div>
        )}

        {/* Time Limit Exceeded Banner */}
        {summary?.status === 'TIME_LIMIT_EXCEEDED' && (
          <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-600" />
              Time Limit Exceeded
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-200">
              Your program ran longer than the permissible time limit (2.0s). Check for infinite loops or inefficient algorithms.
            </p>
          </div>
        )}

        {/* Input Details Block */}
        {currentTestCase && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <span>INPUT</span>
              <button
                onClick={() => handleCopy(currentTestCase.input, 'input')}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {copiedField === 'input' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <pre className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 overflow-x-auto">
              {currentTestCase.input}
            </pre>
          </div>
        )}

        {/* Expected Output Block */}
        {currentTestCase && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <span>EXPECTED OUTPUT</span>
              <button
                onClick={() => handleCopy(currentTestCase.expectedOutput, 'expected')}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {copiedField === 'expected' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <pre className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 overflow-x-auto">
              {currentTestCase.expectedOutput}
            </pre>
          </div>
        )}

        {/* Actual Output Block */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 font-bold uppercase tracking-wider text-[11px]">
            <span>ACTUAL OUTPUT</span>
            {currentResult && (
              <button
                onClick={() => handleCopy(currentResult.actualOutput, 'actual')}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {copiedField === 'actual' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
          <pre
            className={`p-3 rounded-xl font-mono text-xs border overflow-x-auto transition-colors ${
              currentResult
                ? currentResult.passed
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800'
                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            {currentResult ? currentResult.actualOutput || '(No output produced)' : '(Run code to see actual output)'}
          </pre>
        </div>

        {/* Result Status Badge */}
        {currentResult && (
          <div
            className={`p-3 rounded-xl flex items-center justify-between font-semibold border ${
              currentResult.passed
                ? 'bg-emerald-100/60 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-100/60 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {currentResult.passed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>✓ Test Case Passed</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>✗ Test Case Failed</span>
                </>
              )}
            </div>

            {currentResult.executionTime && (
              <span className="text-[11px] font-mono text-slate-500">
                {currentResult.executionTime}s
              </span>
            )}
          </div>
        )}

        {/* Learning Feedback Component on Failure */}
        {summary && summary.status !== 'ACCEPTED' && (
          <LearningFeedback problem={problem} summary={summary} />
        )}
      </div>

      {/* Private Test Cases Summary Footer */}
      {privateTestCases.length > 0 && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>Private Test Cases ({privateTestCases.length})</span>
          </div>

          {summary ? (
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              {summary.testResults.filter((r) => !r.isPublic && r.passed).length} / {privateTestCases.length} Passed
            </div>
          ) : (
            <span className="text-slate-400">Locked until submission</span>
          )}
        </div>
      )}
    </div>
  );
};

const GlobeIcon = () => (
  <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  </svg>
);
