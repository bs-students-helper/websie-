import { Problem, TestCase } from '../types/problem';
import { RunSummary, TestCaseResult, ExecutionRawResponse } from '../types/execution';
import { executeWithPiston } from './pistonProvider';
import { executeWithMock } from './mockProvider';
import { compareOutput } from '../utils/outputComparator';
import { calculateScore } from '../utils/scoring';

const API_URL = import.meta.env.VITE_CODE_EXECUTION_API_URL || 'https://emkc.org/api/v2/piston/execute';

export async function executeCodeForProblem(
  problem: Problem,
  sourceCode: string,
  testCasesToRun: TestCase[] = problem.testCases,
  forceDemoMode = false
): Promise<RunSummary> {
  const executedAt = new Date().toISOString();
  const testResults: TestCaseResult[] = [];
  let compileOutput: string | undefined = undefined;
  let hasCompileError = false;
  let hasRuntimeError = false;
  let hasTimeout = false;
  let isDemoMode = forceDemoMode;
  let providerName = forceDemoMode ? 'Demo Provider' : 'Piston API';

  for (const tc of testCasesToRun) {
    let rawResult: ExecutionRawResponse;

    if (forceDemoMode) {
      rawResult = await executeWithMock({
        language: problem.language,
        sourceCode,
        stdin: tc.input,
        fileName: problem.fileName,
      });
    } else {
      try {
        rawResult = await executeWithPiston(
          {
            language: problem.language,
            sourceCode,
            stdin: tc.input,
            fileName: problem.fileName,
          },
          API_URL
        );
      } catch (error) {
        console.warn('Piston API execution failed, falling back to Demo Mode:', error);
        isDemoMode = true;
        providerName = 'Demo Provider (Offline Fallback)';
        rawResult = await executeWithMock({
          language: problem.language,
          sourceCode,
          stdin: tc.input,
          fileName: problem.fileName,
        });
      }
    }

    // Check for compilation errors
    if (rawResult.isCompileError) {
      hasCompileError = true;
      compileOutput = rawResult.stderr || rawResult.stdout;
      testResults.push({
        testCaseId: tc.id,
        isPublic: tc.isPublic,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: '',
        passed: false,
        stderr: rawResult.stderr,
        executionTime: rawResult.executionTime,
        errorType: 'compile',
        errorMessage: compileOutput,
        weight: tc.weight,
      });
      // Stop testing further cases if compilation fails
      break;
    }

    // Check for timeout
    if (rawResult.isTimeout) {
      hasTimeout = true;
      testResults.push({
        testCaseId: tc.id,
        isPublic: tc.isPublic,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: rawResult.stdout,
        passed: false,
        stderr: 'Time Limit Exceeded (Execution took too long)',
        executionTime: rawResult.executionTime,
        errorType: 'timeout',
        errorMessage: 'Time Limit Exceeded',
        weight: tc.weight,
      });
      continue;
    }

    // Check for runtime error (exitCode !== 0)
    if (rawResult.exitCode !== 0 && rawResult.stderr) {
      hasRuntimeError = true;
      testResults.push({
        testCaseId: tc.id,
        isPublic: tc.isPublic,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: rawResult.stdout,
        passed: false,
        stderr: rawResult.stderr,
        executionTime: rawResult.executionTime,
        errorType: 'runtime',
        errorMessage: rawResult.stderr,
        weight: tc.weight,
      });
      continue;
    }

    // Normal comparison
    const comp = compareOutput(tc.expectedOutput, rawResult.stdout);
    testResults.push({
      testCaseId: tc.id,
      isPublic: tc.isPublic,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: rawResult.stdout,
      passed: comp.passed,
      stderr: rawResult.stderr,
      executionTime: rawResult.executionTime,
      errorType: comp.passed ? 'none' : 'wrong_answer',
      weight: tc.weight,
    });
  }

  // Calculate status & score
  const totalTests = testCasesToRun.length;
  const passedTests = testResults.filter((r) => r.passed).length;
  const score = calculateScore(testResults);

  let status: RunSummary['status'] = 'ACCEPTED';
  if (hasCompileError) {
    status = 'COMPILATION_ERROR';
  } else if (hasTimeout) {
    status = 'TIME_LIMIT_EXCEEDED';
  } else if (hasRuntimeError && passedTests === 0) {
    status = 'RUNTIME_ERROR';
  } else if (passedTests < totalTests) {
    status = 'WRONG_ANSWER';
  }

  return {
    totalTests,
    passedTests,
    failedTests: totalTests - passedTests,
    score,
    status,
    compileOutput,
    testResults,
    executedAt,
    provider: providerName,
    isDemoMode,
  };
}
