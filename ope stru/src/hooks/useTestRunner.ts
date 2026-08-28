import { useState } from 'react';
import { Problem } from '../types/problem';
import { RunSummary } from '../types/execution';
import { executeCodeForProblem } from '../services/codeExecutionService';
import { updateProblemProgress } from '../utils/storage';

export function useTestRunner(problem: Problem) {
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<RunSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCode = async (code: string, forceDemo = false) => {
    setIsRunning(true);
    setError(null);

    try {
      const result = await executeCodeForProblem(problem, code, problem.testCases, forceDemo);
      setSummary(result);

      // Save progress to local storage
      updateProblemProgress(problem.id, {
        solved: result.status === 'ACCEPTED',
        bestScore: result.score,
        savedCode: code,
      });

      return result;
    } catch (err: any) {
      const errMsg = err?.message || 'Code execution service is currently unavailable. Please try again.';
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
