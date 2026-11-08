# Katasphere Master Project & Dev Context

> **Last Updated**: November 2026  
> **Git Repository**: [https://github.com/hrishu22/Katasphere.git](https://github.com/hrishu22/Katasphere.git)  
> **Branch**: `main`  
> **Primary Workspace Directory**: `/Users/hrishii/Desktop/katasphere`

---

## 1. Quick Resume: How to Continue in a New Session

When starting a new conversation or session with an AI coding assistant, paste or say:
```text
Please read KATASPHERE_CONTEXT.md at the root of the project to understand the full architecture, completed features, running servers, and active conventions.
```

### Dev Server Commands to Start
1. **Backend (Spring Boot 3.3.4 / Java 21)**:
   ```bash
   cd /Users/hrishii/Desktop/katasphere/backend
   SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run
   # Runs on http://localhost:8080 (Health check: http://localhost:8080/actuator/health)
   ```
2. **Frontend (Next.js 14 / TypeScript / Tailwind CSS)**:
   ```bash
   cd /Users/hrishii/Desktop/katasphere/frontend
   npm run dev
   # Runs on http://localhost:3000
   ```
3. **Database (PostgreSQL)**:
   - Port `5432`, Database: `katasphere`, User: `postgres`.

---

## 2. Project Architecture & Tech Stack

### Frontend (`/frontend`)
- **Framework**: Next.js 14.2 (App Router), React 18, TypeScript, Tailwind CSS, Lucide icons.
- **Editor**: Monaco Editor (`@monaco-editor/react`) with dynamic fallback textarea.
- **Routing & Rendering**:
  - Problem Workspace: `/problems/[slug]` pre-rendered via SSG Edge (`problem-catalog-data.ts`) with zero-latency instant loading.
  - Problems Catalog: `/problems` with tag/difficulty/status filters (platform filters like LeetCode/GFG removed).
  - Auth: `/login`, `/register`, Supabase Auth context + Bearer JWT synchronization.

### Backend (`/backend`)
- **Framework**: Spring Boot 3.3.4, Spring Security 6.3.3, Spring Data JPA, Hibernate, Jackson 2.17.
- **Runtime**: Java 21.
- **Execution Engine**:
  - `LocalExecutionEngine.java`: Sandboxed compile-once Java / Python / C++ / JS runner.
  - Dedicated daemon thread readers consuming `stdout` and `stderr` concurrently to avoid buffer deadlocks.
  - Captures `System.out.println(...)` output and formats into `TestCaseResult.stdout`.
- **Security & Cross-Domain Auth**:
  - `TokenProvider.java`: Generates signed Bearer JWT tokens.
  - `TokenAuthenticationFilter.java`: Inspects `Authorization: Bearer <token>` headers as well as cookies to bridge cross-domain Vercel (`.vercel.app`) to Render (`.onrender.com`) requests without cookie drops.

---

## 3. Core Features Completed & Active Conventions

### A. Default Language Configuration
- **Default Language**: **Java 21** (`Solution.java`) across the entire problem workspace, starter codes, and visualizer.
- Python 3, C++ 20, and JavaScript remain available in the language switcher.

### B. Interactive Algorithm & Code Execution Visualizer
- **Files**:
  - [`AlgorithmVisualizer.tsx`](frontend/src/components/visualizer/AlgorithmVisualizer.tsx)
  - [`algorithm-tracer.ts`](frontend/src/components/visualizer/algorithm-tracer.ts)
- **Features**:
  - Step-by-step playback: Play, Pause, Speed (`0.5x`, `1x`, `1.5x`, `2x`), Next Step, Prev Step, Reset, and Scrub slider.
  - Array canvas with animated pointer arrows (`i`, `left`, `right`, `mid`, etc.).
  - Hash Map / Frequency Table monitor with O(1) query/insertion highlights.
  - LIFO Stack / Queue canvas with top-of-stack pointers.
  - Live scalar variables monitor (`target`, `diff`, `minPrice`, `maxProfit`, etc.).
  - Big-O Complexity cards: Time Complexity ($O(n)$, $O(\log n)$, etc.) and Space Complexity ($O(n)$, $O(1)$) with detailed narrative breakdowns.
  - Test case selector (Example 1, Example 2, or custom input simulation).
- **Authentication**: Requires the user to be signed in. Unauthenticated clicks trigger the *"Sign in to Use Visualizer"* modal.

### C. 4-Step Progressive Hints System
- **Files**:
  - [`ProblemHintsModal.tsx`](frontend/src/components/hints/ProblemHintsModal.tsx)
  - [`problem-hints-data.ts`](frontend/src/lib/problem-hints-data.ts)
- **4-Step Progressive Disclosure**:
  1. **Hint 1** *(Initial Direction)*: Gentle intuitive nudge without spoiling the solution.
  2. **Hint 2** *(Key Insight)*: Data structure selection (e.g. Hash Map complement lookup, two-pointer bounds).
  3. **Hint 3** *(Solution Blueprint)*: Detailed algorithm recipe, invariant phases, and code pattern snippet.
  4. **Hint 4** *(Visual Intuition)*: Mental model explanation with direct button to launch the interactive visualizer.
- **Buttons**: Located in Problem Statement header and top problem navigation toolbar.
- **Authentication**: Requires the user to be signed in. Unauthenticated clicks trigger the *"Sign in to View Hints"* modal.

### D. Post-Submission Celebration & Visualization Flow
- **Files**:
  - [`SubmissionSuccessModal.tsx`](frontend/src/components/submission/SubmissionSuccessModal.tsx)
  - [`SubmissionVisualizerModal.tsx`](frontend/src/components/submission/SubmissionVisualizerModal.tsx)
- **Behavior**:
  - When the user clicks **Submit** and all test cases pass (`verdict === "ACCEPTED"`):
    1. **Celebration Dialog** appears with passed count (`10/10`), runtime (ms), and memory (MB).
    2. Two Buttons: **Cancel** (returns to editor) and **Visualize**.
    3. Clicking **Visualize** opens a dedicated modal displaying the Big-O Time/Space complexity breakdown and the full interactive execution trace of the submitted code.

### E. Network & Error Handling Fixes
1. **Client Disconnects / Broken Pipe Fix**:
   - Fixed `ClientAbortException` in [`GlobalExceptionHandler.java`](backend/src/main/java/com/katasphere/common/GlobalExceptionHandler.java). When a client closes a connection or navigates away, the server no longer writes to the closed socket, eliminating `StandardServletAsyncWebRequest$LifecycleHttpServletResponse.obtainLockOrRaiseException`.
2. **Extended Client Timeouts**:
   - In [`api-client.ts`](frontend/src/lib/api-client.ts), increased default timeout from 15s to 30s.
   - Set 60s for Run Code (`/api/v1/submissions/run`) and 90s for Submissions (`/api/v1/submissions`) to accommodate Java compilation and multi-testcase grading.

---

## 4. Key File Map

| Path | Purpose |
|---|---|
| `docs/ENTERPRISE_ARCHITECTURE.md` | Master enterprise architecture, capacity planning, security cage, and AWS Option C deployment topology. |
| `docs/CAPACITY_PLANNING.md` | Mathematical back-of-the-envelope calculations (100k DAU, Little's Law, compute/RAM sizing, 5-year storage). |
| `docs/SCALABILITY_ANALYSIS.md` | Scalability stress-test across 5 tiers (10k to 10M DAU), breaking points, and contest surge simulations. |
| `frontend/src/app/problems/[slug]/ProblemWorkspace.tsx` | Main split workspace (problem, Monaco editor, visualizer split, testcases, modals). |
| `frontend/src/components/visualizer/AlgorithmVisualizer.tsx` | Interactive step-by-step code and memory visualizer component. |
| `frontend/src/components/visualizer/algorithm-tracer.ts` | Execution simulation engine, pointer tracking, Big-O complexity analyzer. |
| `frontend/src/components/hints/ProblemHintsModal.tsx` | 4-step progressive hints modal. |
| `frontend/src/lib/problem-hints-data.ts` | Problem-specific and generic 4-step hint generator. |
| `frontend/src/components/submission/SubmissionSuccessModal.tsx` | All-testcases-passed celebration modal. |
| `frontend/src/components/submission/SubmissionVisualizerModal.tsx` | Post-submission visualizer & Big-O modal dialog. |
| `backend/src/main/java/com/katasphere/execution/LocalExecutionEngine.java` | Java/Python/C++ execution engine with async stream drains. |
| `backend/src/main/java/com/katasphere/common/GlobalExceptionHandler.java` | Exception handling with graceful `ClientAbortException` interception. |
| `backend/src/main/java/com/katasphere/auth/TokenProvider.java` | JWT token generation and validation. |
| `frontend/src/lib/api-client.ts` | Frontend API client with Bearer auth injection and timeouts. |

---

## 5. Summary of Recent Commits (Git Log)
- `77aceec`: Add capacity planning and back-of-the-envelope calculations.
- `0258785`: Add enterprise architecture, security, and scalability blueprint.
- `87ffb38`: Add master KATASPHERE_CONTEXT.md for cross-session continuity.
- `20dd22b`: Handle ClientAbortException gracefully and extend client execution timeout.
- `6b11f13`: Require authentication for hints and execution visualizer.
- `689bbb1`: Default language set to Java 21; updated hint naming to clean 'Hint 1 (Initial Direction)'.
- `d7f14fe`: Add 4-step progressive hints and post-submission success dialog with code visualization.
- `018a9c8`: Add interactive step-by-step code and algorithm execution visualizer with Big-O complexity analysis.
