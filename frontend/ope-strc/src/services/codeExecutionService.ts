import { Problem, TestCase } from '../types/problem';
import { RunSummary, TestCaseResult, ExecutionRawResponse } from '../types/execution';
import { executeWithPiston } from './pistonProvider';
import { compareOutput } from '../utils/outputComparator';
import { calculateScore } from '../utils/scoring';

const API_URL = import.meta.env.VITE_CODE_EXECUTION_API_URL || '/api/execute';

export async function executeCodeForProblem(
  problem: Problem,
  sourceCode: string,
  testCasesToRun: TestCase[] = problem.testCases
): Promise<RunSummary> {
  const executedAt = new Date().toISOString();
  const testResults: TestCaseResult[] = [];
  let compileOutput: string | undefined = undefined;
  let hasCompileError = false;
  let hasRuntimeError = false;
  let hasTimeout = false;
  let serviceError: string | undefined = undefined;

  for (const tc of testCasesToRun) {
    let rawResult: ExecutionRawResponse;

    try {
      rawResult = await executeWithPiston(
        {
          language: problem.language,
          sourceCode,
          stdin: tc.input,
          expectedOutput: tc.expectedOutput,
          fileName: problem.fileName,
        },
        API_URL
      );
    } catch (error: any) {
      serviceError =
        (error?.message ? String(error.message) : String(error)) ||
        'Unable to reach the code execution service. Please check your internet connection and try again.';
      testResults.push({
        testCaseId: tc.id,
        isPublic: tc.isPublic,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: '',
        passed: false,
        stderr: serviceError,
        errorType: 'wrong_answer',
        errorMessage: serviceError,
        weight: tc.weight,
      });
      continue;
    }

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
      break;
    }

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

  const totalTests = testCasesToRun.length;
  const passedTests = testResults.filter((r) => r.passed).length;
  const score = calculateScore(testResults);

  let status: RunSummary['status'] = 'ACCEPTED';
  if (serviceError && testResults.every((r) => r.stderr === serviceError)) {
    status = 'SERVICE_UNAVAILABLE';
  } else if (hasCompileError) {
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
    provider: 'Piston API (Real Execution)',
    isDemoMode: false,
    pistonError: serviceError,
  };
}
