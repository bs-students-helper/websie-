export interface ExecutionRequest {
  language: string;
  sourceCode: string;
  stdin?: string;
  expectedOutput?: string;
  fileName?: string;
}

export interface ExecutionRawResponse {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime?: number;
  memory?: number;
  error?: string;
  isTimeout?: boolean;
  isCompileError?: boolean;
}

export interface TestCaseResult {
  testCaseId: number | string;
  isPublic: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  stderr?: string;
  executionTime?: number;
  errorType?: 'none' | 'compile' | 'runtime' | 'timeout' | 'wrong_answer';
  errorMessage?: string;
  weight?: number;
}

export interface RunSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  score: number; // 0 - 100
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'COMPILATION_ERROR' | 'RUNTIME_ERROR' | 'TIME_LIMIT_EXCEEDED' | 'SERVICE_UNAVAILABLE';
  compileOutput?: string;
  testResults: TestCaseResult[];
  executedAt: string;
  provider: string;
  isDemoMode?: boolean;
  pistonError?: string;
}
