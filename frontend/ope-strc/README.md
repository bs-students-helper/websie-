# OPPE Practice Lab — IIT Madras BS Data Science

"OPPE Practice Lab" is a high-performance, modern online practice platform built specifically for **IIT Madras BS in Data Science and Applications** students. It offers an authentic OPPE-style examination and coding environment with real code execution, automated output diffing, solution unlocked rules, custom exception handling tests, and a responsive three-panel IDE interface.

---

## 🌟 Features

- **Three-Panel IDE Workspace**:
  - Resizable desktop panels for **Question Statement**, **Test Case Results**, and **Monaco Code Editor**.
  - Adaptive mobile and tablet layout (`[Question] [Tests] [Code Editor]`).
- **Real Code Execution Engine**:
  - Uses **Piston API** (`https://emkc.org/api/v2/piston`) as default zero-config execution engine for Java 15+ and Python 3.10+.
  - Built-in graceful fallback to **Demo Mode** if offline or rate-limited.
- **Reference Problem Included**:
  - Includes the exact reference problem **"Indexed Integer List"** with Java custom checked exception (`InvalidInputEx`), array boundary validation, and exception chaining.
- **Rich Question Bank (12 Initial Problems)**:
  - **Java (6)**: Exception Handling (Chaining & Custom Exceptions), Inheritance, Collections, Generics, Streams, Concurrency.
  - **Python (4)**: Matrix Transpose & Diagonals, Dictionaries, OOP Class Hierarchy, Custom Exceptions.
  - **SQL (2)**: Multi-table INNER JOINs, GROUP BY & HAVING aggregations.
- **Output Comparator & Visual Diffs**:
  - Automatically normalizes line endings (`\r\n` vs `\n`), trims trailing whitespace per line, and provides exact diff highlighting on failed test cases.
- **Solution Visibility Rules**:
  - Configurable solution access (`always`, `afterRun`, `afterAllTestsPass`, `manual`).
- **Learning Hints & Pitfalls**:
  - Displays non-spoiler hints on test failures highlighting common indexing, exception, and formatting mistakes.
- **Local Persistence & Autosave**:
  - Code is automatically saved per problem (`oppe-code-{problemId}`) in `localStorage`.
  - Solved statuses, score history, bookmarks, and font preferences persist locally.
- **Timed Mock Exam Mode**:
  - 90-minute timed exam simulator with question navigator, real-time timer countdown, and score analysis.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Code Editor**: `@monaco-editor/react` (Monaco Editor)
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS, Lucide React Icons
- **Code Execution API**: Piston Execution Engine / Judge0 Compatible Abstraction

---

## 🚀 Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 2. Run Development Server

Start the local dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build

```bash
npm run build
npm run preview
```

---

## ⚙️ Environment Variables & API Setup

Create a `.env` file in the root directory (refer to `.env.example`):

```env
# External Code Execution API Configuration
VITE_CODE_EXECUTION_API_URL=https://emkc.org/api/v2/piston/execute
```

> ⚠️ **SECURITY DIRECTIVE**:
> Never place private API secret keys inside `VITE_*` environment variables! Any credentials exposed in `VITE_*` will be visible in public browser bundles. If using a paid execution service requiring credentials, deploy a lightweight serverless proxy function.

---

## 📚 How Questions & Test Cases Are Added

Questions are structured declaratively in `src/data/problems/`.

Example problem definition (`src/data/problems/java/exceptions.ts`):

```typescript
export const javaExceptionProblems: Problem[] = [
  {
    id: "java-exception-001",
    title: "Indexed Integer List",
    subject: "Programming in Java",
    subjectId: "java",
    week: "Week 8",
    topic: "Exception Handling",
    difficulty: "Medium",
    language: "java",
    fileName: "FClass.java",
    description: "Write a Java program...",
    starterCode: `import java.util.*; ...`,
    testCases: [
      {
        id: 1,
        isPublic: true,
        input: `0 10\n3 20\n4 50\n2 60\n1 30`,
        expectedOutput: `10 30 60 20 50`,
        weight: 50,
      },
    ],
    solution: `...`,
    tags: ["Exception Handling", "Custom Exception"],
  },
];
```

---

## 🔒 Security Limitations & Future Backend Architecture

### Current MVP Architecture (Frontend Only)
```
React Frontend (Vite + Monaco)
    ↓
Local TypeScript Problems & localStorage
    ↓
External Execution API (Piston / Judge0)
```

### Future Production Backend Roadmap
When adding a dedicated backend in later versions, the frontend architecture remains untouched by swapping `codeExecutionService.ts` to communicate with a FastAPI/Node backend:

```
React (Frontend)
    ↓
FastAPI / Express Gateway (Auth & Rate Limit)
    ↓
PostgreSQL DB (Problems & Student Submissions)
    ↓
Redis Queue → Worker Containers (Docker Isolated Runtimes)
```

---

## 📄 License

Built for **IIT Madras BS in Data Science and Applications** student practice.
