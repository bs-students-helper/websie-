import { Problem } from '../../types/problem';
import { RunSummary } from '../../types/execution';
import { HelpCircle, Sparkles } from 'lucide-react';

interface LearningFeedbackProps {
  problem: Problem;
  summary: RunSummary;
}

export const LearningFeedback: React.FC<LearningFeedbackProps> = ({ problem, summary }) => {
  if (summary.status === 'ACCEPTED') return null;

  const reasonsMap: Record<string, string[]> = {
    'java-exception-001': [
      'Did you handle ArrayIndexOutOfBoundsException in set_value and wrap it in InvalidInputEx?',
      'Did you pass the original exception as the cause parameter to InvalidInputEx?',
      'Check output printing: ensure single line space-separated format when valid.',
    ],
    default: [
      'Double check array indices and loop boundary conditions.',
      'Ensure standard output matches expected line endings and spacing exactly.',
      'Verify exception handling blocks and constructor parameter order.',
    ],
  };

  const reasons = reasonsMap[problem.id] || reasonsMap.default;

  return (
    <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-xs uppercase tracking-wider">
        <Sparkles className="w-4 h-4 text-amber-600" />
        Learning Hints & Common Pitfalls
      </div>

      <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
        <div className="font-medium text-slate-900 dark:text-slate-100">Possible reasons for failure:</div>
        <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 dark:text-slate-400">
          {reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/60 flex items-center gap-2 text-xs">
        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
        <span className="font-medium text-slate-700 dark:text-slate-300">Related Concepts:</span>
        <div className="flex flex-wrap gap-1">
          {problem.tags.map((t, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[10px] font-semibold"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
