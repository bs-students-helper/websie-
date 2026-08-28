import { ExecutionRequest, ExecutionRawResponse } from '../types/execution';

const PISTON_LANGUAGE_MAP: Record<string, { language: string; version: string; defaultFile: string }> = {
  java: { language: 'java', version: '15.0.2', defaultFile: 'FClass.java' },
  python: { language: 'python', version: '3.10.0', defaultFile: 'main.py' },
  sql: { language: 'sqlite3', version: '3.36.0', defaultFile: 'query.sql' },
};

export async function executeWithPiston(
  request: ExecutionRequest,
  apiUrl = 'https://emkc.org/api/v2/piston/execute'
): Promise<ExecutionRawResponse> {
  const langConfig = PISTON_LANGUAGE_MAP[request.language.toLowerCase()] || {
    language: request.language.toLowerCase(),
    version: '*',
    defaultFile: request.fileName || 'main',
  };

  const fileName = request.fileName || langConfig.defaultFile;

  const payload = {
    language: langConfig.language,
    version: langConfig.version,
    files: [
      {
        name: fileName,
        content: request.sourceCode,
      },
    ],
    stdin: request.stdin || '',
  };

  const startTime = performance.now();

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const endTime = performance.now();
  const executionTimeMs = Math.round(endTime - startTime) / 1000;

  if (!response.ok) {
    throw new Error(`Piston API HTTP Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Handle compilation error if present
  if (data.compile && data.compile.code !== 0) {
    return {
      stdout: data.compile.stdout || '',
      stderr: data.compile.stderr || data.compile.output || 'Compilation failed',
      exitCode: data.compile.code || 1,
      executionTime: executionTimeMs,
      isCompileError: true,
    };
  }

  const runOutput = data.run || {};

  return {
    stdout: runOutput.stdout || '',
    stderr: runOutput.stderr || '',
    exitCode: runOutput.code ?? 0,
    executionTime: executionTimeMs,
    isTimeout: runOutput.signal === 'SIGKILL' || runOutput.code === 124,
  };
}
