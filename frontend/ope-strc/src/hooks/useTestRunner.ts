import { useState } from 'react';
import { Problem } from '../types/problem';
import { RunSummary } from '../types/execution';
import { executeCodeForProblem } from '../services/codeExecutionService';
import { updateProblemProgress } from '../utils/storage';

export function useTestRunner(problem: Problem) {
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<RunSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCode = async (code: string) => {
    setIsRunning(true);
    setError(null);

    try {
      const result = await executeCodeForProblem(problem, code, problem.testCases);
      setSummary(result);

      if (result.status === 'SERVICE_UNAVAILABLE') {
        setError(
          result.pistonError ||
            'The code execution service is currently unreachable. Please check your internet connection and try again.'
        );
      } else {
        updateProblemProgress(problem.id, {
          solved: result.status === 'ACCEPTED',
          bestScore: result.score,
          savedCode: code,
        });
      }

      return result;
    } catch (err: any) {
      const errMsg =
        err?.message ||
        'Code execution service is currently unavailable. Please try again later.';
      setError(errMsg);
      return null;
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setSummary(null);
    setError(null);
  };

  return {
    isRunning,
    summary,
    error,
    runCode,
    clearResults,
  };
}
