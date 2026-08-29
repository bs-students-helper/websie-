import React, { useState } from 'react';
import { Lock, Check, Copy, Key, Lightbulb } from 'lucide-react';
import { Problem } from '../../types/problem';
import { RunSummary } from '../../types/execution';

interface SolutionTabProps {
  problem: Problem;
  lastSummary: RunSummary | null;
}

export const SolutionTab: React.FC<SolutionTabProps> = ({ problem, lastSummary }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [unlockedManually, setUnlockedManually] = useState(false);

  const visibility = problem.solutionVisibility || 'afterRun';

  let isUnlocked = false;
  if (unlockedManually) isUnlocked = true;
  else if (visibility === 'always') isUnlocked = true;
  else if (visibility === 'afterRun' && lastSummary !== null) isUnlocked = true;
  else if (visibility === 'afterAllTestsPass' && lastSummary?.status === 'ACCEPTED') isUnlocked = true;

  const handleCopySolution = () => {
    if (problem.solution) {
      navigator.clipboard.writeText(problem.solution);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center h-full">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Solution Locked
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
          {visibility === 'afterRun'
            ? 'Run your code at least once to unlock the solution approach and sample code.'
            : 'Pass all test cases to unlock the reference solution.'}
        </p>

        <button
          onClick={() => setUnlockedManually(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
        >
          <Key className="w-3.5 h-3.5" />
          Reveal Solution Anyway
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 text-slate-800 dark:text-slate-200 text-sm overflow-y-auto max-h-full">
      {/* Explanation Banner */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-xl p-4 flex gap-3">
        <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-1">
            Solution Approach & Explanation
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {problem.explanation || 'Review the reference implementation and key concept breakdown.'}
          </p>
        </div>
      </div>

      {/* Solution Code Block */}
      {problem.solution && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Reference Solution Code ({problem.fileName})
            </span>
            <button
              onClick={handleCopySolution}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto font-mono text-xs leading-relaxed border border-slate-800">
            <code>{problem.solution}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
