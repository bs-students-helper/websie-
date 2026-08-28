import { TestCaseResult } from '../types/execution';

export function calculateScore(results: TestCaseResult[]): number {
  if (!results || results.length === 0) return 0;

  const hasCustomWeights = results.some((r) => typeof r.weight === 'number' && r.weight > 0);

  if (hasCustomWeights) {
    const totalWeight = results.reduce((acc, r) => acc + (r.weight || 0), 0);
    if (totalWeight === 0) return 0;
    const passedWeight = results.reduce((acc, r) => acc + (r.passed ? (r.weight || 0) : 0), 0);
    return Math.round((passedWeight / totalWeight) * 100);
  }

  const passedCount = results.filter((r) => r.passed).length;
  return Math.round((passedCount / results.length) * 100);
}
