# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static site (no build step, no package manager) for KBD1100, a Cambrian College computer keyboarding course. Students log in, practice typing/dispatcher-style aptitude skills, and take a timed simulated "CritiCall" test; the instructor reviews results on a dashboard. Everything is plain HTML/CSS/vanilla JS served directly — open files in a browser or serve the directory with any static file server (e.g. `npx http-server` or the VS Code Live Server extension). There is no test suite, linter, or build/bundling process.

## Firebase backend

Auth + Firestore via the Firebase compat SDK (loaded from CDN, pinned to `10.12.4`), configured once in `firebase-config.js` (sets `window.auth` / `window.db`) and included via `<script>` tag at the top of every page.

- Every page except `index.html` gates access with `auth.onAuthStateChanged` and redirects to `index.html` if signed out.
- `index.html` is the login page. After sign-in it checks the user's UID against a hardcoded `TEACHER_UID` constant to route to `teacher.html` vs `typing.html`.
- Firestore collections in use: `users`, `attempts`, `progress`, `officeProgress`, `criticallScores`, `timedTests`, and `testSubmissions/{uid}/tests/{testId}` (used by the full CritiCall test engine). There's no shared data-access layer — each page/module writes to Firestore directly inline.
- `teacher.html` reads across students' data to build the instructor dashboard.

## Page structure

- `index.html` — login/auth gate and role-based redirect.
- `typing.html` — typing practice exercises for students.
- `teacher.html` — instructor dashboard (aggregates student results from Firestore).
- `criticall.html` — **CritiCall practice hub**: a large, mostly self-contained file (~4400 lines) with a grid of practice modules (data entry, call summarization, memory recall, map reading, reading comprehension, spelling, mathematics, cross reference, multitasking, decision making, etc.). Each practice module's UI and logic is implemented inline in this file's own `<script>` block (functions like `openModule()`, `showDataEntry()`, `showMemoryRecall()`, `showMapReading()`, ...) — it does **not** load `js/test-engine.js` or `js/modules/*`. Practice here is untimed/ungated and meant for repeated individual skill drilling.
- `criticalltest.html` — **CritiCall full simulated test**: the modular, timed, scored version. It loads the question banks, engine, and module scripts described below and drives the whole multi-module test end to end, then submits results to Firestore.

Because `criticall.html` (practice) and the `js/modules/*` scripts (full test) implement overlapping skills independently, a change to one does not automatically apply to the other — check both when fixing a bug in a shared skill (e.g. map reading logic exists both inline in `criticall.html` and in `js/modules/map-cross-multi.js`).

## CritiCall full-test architecture (`criticalltest.html` + `js/`)

Load order in `criticalltest.html` matters:
```
js/data/question-bank.js        → window.QuestionBank
js/data/question-bank-part2.js  → window.QuestionBankPart2, shuffleArray(), getRandomQuestions()
js/test-engine.js               → window.CritiCallTestEngine
js/modules/data-entry.js        → window.dataEntryModule
js/modules/decision-making.js   → window.decisionMakingModule
js/modules/spelling.js          → window.spellingModule
js/modules/mathematics.js       → window.mathematicsModule
js/modules/map-cross-multi.js   → window.mapReadingModule, window.crossReferenceModule
js/modules/multitasking.js      → window.multitaskingModule
js/modules/additional-modules.js→ window.readingComprehensionModule, window.memoryRecallModule
```

**`QuestionBank` vs `QuestionBankPart2`**: these are two independent globals (not merged into one object) — each module hardcodes which one it pulls from (e.g. `QuestionBank.dataEntry`, `QuestionBankPart2.mathematics`). When adding a new question type, check both files before assuming where it lives.

**Test engine (`js/test-engine.js`, `CritiCallTestEngine`)**: owns overall test flow — module sequencing (`config.modules`, in order), per-module timers, progress bar, scoring, and Firestore submission. It looks up the active module by naming convention: `window[`${moduleId}Module`]`. To add a new module to the full test, add an entry to `config.modules` (id, name, timeLimit, questionCount), add scoring weights/passing score entries, and expose `window.<moduleId>Module`.

**Module contract**: every `js/modules/*.js` file exports a plain object (`window.<name>Module`) implementing:
- `render(container, questionCount, onComplete)` — initializes state, selects randomized questions via `getRandomQuestions(bank, count)`, and renders into `container`.
- Internal `init()` / `show*()` / `submit*()` methods driving its own question-by-question flow.
- Calls `onComplete(results)` when finished, where `results` includes at least `accuracy` (0–100) and, for typing/KPM-based modules (`dataEntry`, `crossReference`, `multitasking`), `totalKeystrokes`/`totalWords` so the engine can derive `kpm`/`kph`/`wpm`.

**Scoring model** (`CritiCallTestEngine.calculateOverallScore`): overall score = 70% weighted accuracy across modules + 30% weighted speed bonus (faster completion relative to `timeLimit` scores higher, per `config.weights`). Each module also has its own `passingScores` threshold, and the overall test only passes if the weighted score clears `overallPassingScore` **and** every individual module passed.

## Styling

Single shared stylesheet `styles.css` linked from every page; `criticall.html`/`criticalltest.html` additionally define page-scoped styles in an inline `<style>` block for their practice/test-specific UI (module cards, timers, results tables, etc.).
