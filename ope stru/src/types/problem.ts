export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type SolutionVisibility = 'always' | 'afterRun' | 'afterAllTestsPass' | 'manual';

export interface TestCase {
  id: number | string;
  name?: string;
  input: string;
  expectedOutput: string;
  isPublic: boolean;
  weight?: number;
}

export interface Problem {
  id: string;
  title: string;
  subject: string;
  subjectId: string;
  week?: string;
  topic: string;
  difficulty: Difficulty;
  language: 'java' | 'python' | 'sql';
  fileName: string;
  description: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string[];
  requirements?: string[];
  starterCode: string;
  testCases: TestCase[];
  solution?: string;
  explanation?: string;
  tags: string[];
  solutionVisibility?: SolutionVisibility;
  oppeType?: 'oppe1' | 'oppe2';
  year?: string;
  term?: string;
  setName?: string;
  setProblemNumber?: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  iconName: string;
  description: string;
  topics: string[];
  defaultLanguage: 'java' | 'python' | 'sql';
}

export interface UserProblemProgress {
  solved: boolean;
  attempts: number;
  bestScore: number;
  lastAttemptAt?: string;
  savedCode?: string;
  bookmarked?: boolean;
}

export interface UserProgressState {
  [problemId: string]: UserProblemProgress;
}
