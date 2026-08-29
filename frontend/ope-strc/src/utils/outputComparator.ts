/**
 * Output Comparator for OPPE Practice Lab
 * Normalizes output across different platforms and environments before comparison.
 * Supports floating-point tolerance for numeric values.
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
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/^\n+|\n+$/g, '');
}

function tokenize(line: string): string[] {
  return line.split(/(\s+|[^\w.+\-])/).filter((t) => t.length > 0);
}

function looksLikeNumber(token: string): boolean {
  return /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(token.trim());
}

function normalizeNumericToken(token: string): string {
  if (!looksLikeNumber(token)) return token;
  try {
    const num = parseFloat(token);
    if (!isFinite(num)) return token;
    if (Number.isInteger(num)) {
      const intStr = num.toFixed(1);
      return intStr;
    }
    const abs = Math.abs(num);
    let precision = 10;
    if (abs === 0) precision = 1;
    else if (abs < 1e-3 || abs >= 1e6) precision = 6;
    else if (abs < 0.01 || abs >= 10000) precision = 8;
    else precision = 10;
    let s = num.toFixed(precision);
    s = s.replace(/0+$/g, '');
    if (s.endsWith('.')) s += '0';
    if (s === '-0.0') s = '0.0';
    return s;
  } catch {
    return token;
  }
}

function linesMatchWithTolerance(expectedLine: string, actualLine: string): boolean {
  if (expectedLine === actualLine) return true;

  const expNorm = normalizeNumericToken(expectedLine.trim());
  const actNorm = normalizeNumericToken(actualLine.trim());
  if (expNorm === actNorm) return true;

  const expTokens = tokenize(expectedLine);
  const actTokens = tokenize(actualLine);

  if (expTokens.length !== actTokens.length) return false;

  const EPS = 1e-3;
  for (let i = 0; i < expTokens.length; i++) {
    const et = expTokens[i];
    const at = actTokens[i];
    if (et === at) continue;
    if (looksLikeNumber(et) && looksLikeNumber(at)) {
      const en = parseFloat(et);
      const an = parseFloat(at);
      if (!isFinite(en) || !isFinite(an)) return false;
      const diff = Math.abs(en - an);
      const tol = Math.max(EPS, EPS * Math.max(Math.abs(en), Math.abs(an)));
      if (diff <= tol) continue;
      return false;
    }
    return false;
  }
  return true;
}

export function compareOutput(expected: string, actual: string): ComparisonResult {
  const normExpected = normalizeOutput(expected);
  const normActual = normalizeOutput(actual);

  const expLines = normExpected.split('\n');
  const actLines = normActual.split('\n');

  let passed = true;
  const differences: { lineIndex: number; expectedLine: string; actualLine: string }[] = [];

  const maxLines = Math.max(expLines.length, actLines.length);
  for (let i = 0; i < maxLines; i++) {
    const el = expLines[i] ?? '';
    const al = actLines[i] ?? '';
    if (!linesMatchWithTolerance(el, al)) {
      passed = false;
      differences.push({
        lineIndex: i + 1,
        expectedLine: el,
        actualLine: al,
      });
    }
  }

  if (normExpected === normActual) passed = true;

  return {
    passed,
    normalizedExpected: normExpected,
    normalizedActual: normActual,
    differences: differences.length > 0 ? differences : undefined,
  };
}
