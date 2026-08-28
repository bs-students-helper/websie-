/**
 * Output Comparator for OPPE Practice Lab
 * Normalizes output across different platforms and environments before comparison.
 */

export interface ComparisonResult {
  passed: boolean;
  normalizedExpected: string;
  normalizedActual: string;
  differences?: {
    lineIndex: number;
    expectedLine: string;
    actualLine: string;
  }[];
}

export function normalizeOutput(output: string): string {
  if (output === null || output === undefined) return '';

  return output
    .replace(/\r\n/g, '\n') // Normalize Windows CRLF to LF
    .replace(/\r/g, '\n')   // Normalize CR to LF
    .split('\n')
    .map((line) => line.trimEnd()) // Remove trailing whitespace from each line
    .join('\n')
    .trim(); // Trim leading/trailing empty space/newlines
}

export function compareOutput(expected: string, actual: string): ComparisonResult {
  const normExpected = normalizeOutput(expected);
  const normActual = normalizeOutput(actual);

  const passed = normExpected === normActual;

  const expLines = normExpected.split('\n');
  const actLines = normActual.split('\n');

  const differences: { lineIndex: number; expectedLine: string; actualLine: string }[] = [];

  const maxLines = Math.max(expLines.length, actLines.length);
  for (let i = 0; i < maxLines; i++) {
    const el = expLines[i] ?? '';
    const al = actLines[i] ?? '';
    if (el !== al) {
      differences.push({
        lineIndex: i + 1,
        expectedLine: el,
        actualLine: al,
      });
    }
  }

  return {
    passed,
    normalizedExpected: normExpected,
    normalizedActual: normActual,
    differences,
  };
}
