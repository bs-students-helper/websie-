import { UserProgressState, UserProblemProgress } from '../types/problem';

const CODE_KEY_PREFIX = 'oppe-code-';
const PROGRESS_KEY = 'oppe-progress';
const BOOKMARKS_KEY = 'oppe-bookmarks';
const PREFERENCES_KEY = 'oppe-preferences';

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  fontSize: number;
  selectedSubjectId?: string;
  selectedProblemId?: string;
  editorTheme?: 'vs-dark' | 'light';
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  fontSize: 14,
  editorTheme: 'vs-dark',
};

// --- CODE STORAGE ---
export function saveProblemCode(problemId: string, code: string): void {
  try {
    localStorage.setItem(`${CODE_KEY_PREFIX}${problemId}`, code);
  } catch (err) {
    console.error('Failed to save code to localStorage', err);
  }
}

export function getProblemCode(problemId: string): string | null {
  try {
    return localStorage.getItem(`${CODE_KEY_PREFIX}${problemId}`);
  } catch (err) {
    console.error('Failed to retrieve code from localStorage', err);
    return null;
  }
}

export function removeProblemCode(problemId: string): void {
  try {
    localStorage.removeItem(`${CODE_KEY_PREFIX}${problemId}`);
  } catch (err) {
    console.error('Failed to remove code from localStorage', err);
  }
}

// --- PROGRESS STORAGE ---
export function getProgress(): UserProgressState {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to read progress from localStorage', err);
    return {};
  }
}

export function updateProblemProgress(
  problemId: string,
  update: Partial<UserProblemProgress>
): UserProgressState {
  const current = getProgress();
  const existing = current[problemId] || {
    solved: false,
    attempts: 0,
    bestScore: 0,
  };

  const updated: UserProblemProgress = {
    ...existing,
    ...update,
    attempts: (existing.attempts || 0) + (update.attempts !== undefined ? 0 : 1),
    bestScore: Math.max(existing.bestScore || 0, update.bestScore || 0),
    solved: existing.solved || (update.solved ?? false),
    lastAttemptAt: new Date().toISOString(),
  };

  const nextState = {
    ...current,
    [problemId]: updated,
  };

  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(nextState));
  } catch (err) {
    console.error('Failed to save progress to localStorage', err);
  }

  return nextState;
}

// --- BOOKMARKS ---
export function getBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read bookmarks from localStorage', err);
    return [];
  }
}

export function toggleBookmarkStorage(problemId: string): string[] {
  const current = getBookmarks();
  const index = current.indexOf(problemId);
  let next: string[];
  if (index >= 0) {
    next = current.filter((id) => id !== problemId);
  } else {
    next = [...current, problemId];
  }
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  } catch (err) {
    console.error('Failed to save bookmarks to localStorage', err);
  }
  return next;
}

// --- PREFERENCES ---
export function getPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES;
  } catch (err) {
    console.error('Failed to read preferences from localStorage', err);
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const current = getPreferences();
  const next = { ...current, ...prefs };
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next));
  } catch (err) {
    console.error('Failed to save preferences to localStorage', err);
  }
  return next;
}
