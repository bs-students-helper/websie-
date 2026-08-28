import { Problem } from '../../types/problem';
import { javaOPPE1RealProblems } from './java/May-2026-Java_1.1_OPPE1';

// Real Java OPPE 1 Exam Question Papers (May 2026 / 2nd Aug 2024 Set)
const rawProblems: Problem[] = [
  ...javaOPPE1RealProblems,
];

// Export all available OPPE problems
export const ALL_PROBLEMS: Problem[] = rawProblems.map((p, idx) => {
  // If problem already defines set metadata (like javaOPPE1RealProblems), preserve it
  if (p.oppeType && p.year && p.setName && p.setProblemNumber) {
    return p;
  }

  const setGroupIndex = Math.floor(idx / 4);
  const setProblemNumber = (idx % 4) + 1;

  const oppeType: 'oppe1' | 'oppe2' = setGroupIndex % 2 === 0 ? 'oppe1' : 'oppe2';
  const year = (2024 - (Math.floor(setGroupIndex / 2) % 3)).toString();
  const term = setGroupIndex % 2 === 0 ? 'Term 1' : 'Term 2';
  const setName = `Set ${(setGroupIndex % 2) + 1}`;

  return {
    ...p,
    oppeType: p.oppeType || oppeType,
    year: p.year || year,
    term: p.term || term,
    setName: p.setName || setName,
    setProblemNumber: p.setProblemNumber || setProblemNumber,
  };
});

export function getAllProblems(): Problem[] {
  return ALL_PROBLEMS;
}

export function getProblemById(id: string): Problem | undefined {
  return ALL_PROBLEMS.find((p) => p.id === id);
}

export function getProblemsBySubject(subjectId: string): Problem[] {
  return ALL_PROBLEMS.filter((p) => p.subjectId === subjectId);
}

export function filterProblems({
  subjectId,
  topic,
  difficulty,
  searchQuery,
  oppeType,
  year,
  setName,
}: {
  subjectId?: string;
  topic?: string;
  difficulty?: string;
  searchQuery?: string;
  oppeType?: 'oppe1' | 'oppe2';
  year?: string;
  setName?: string;
}): Problem[] {
  return ALL_PROBLEMS.filter((p) => {
    if (subjectId && p.subjectId !== subjectId) return false;
    if (oppeType && p.oppeType !== oppeType) return false;
    if (year && year !== 'All' && p.year !== year) return false;
    if (setName && setName !== 'All' && p.setName !== setName) return false;
    if (topic && topic !== 'All' && p.topic !== topic) return false;
    if (difficulty && difficulty !== 'All' && p.difficulty !== difficulty) return false;
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchTopic = p.topic.toLowerCase().includes(q);
      const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchTopic && !matchTag) return false;
    }
    return true;
  });
}
