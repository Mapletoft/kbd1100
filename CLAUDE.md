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
- `teacher.html` — instructor dashboard (aggregates student results from Firestore; also hosts the Course Access panel - see Course settings below).
- `criticall.html` — **CritiCall practice hub**: a grid of module cards. `openModule(moduleName)` is a big switch that, for every module, just calls that module's shared `render(container, questionCount, onComplete)` (the exact same function the graded test calls) and routes its results through `handlePracticeModuleComplete(moduleId, label, results)` — a single shared function that renders the practice results screen and writes to the `criticallScores` collection. The file itself no longer contains per-module game logic; that all lives in `js/modules/*.js` now.
- `criticalltest.html` — **CritiCall full simulated test**: loads `js/test-engine.js` (`CritiCallTestEngine`), which drives the same modules through a timed, scored, sequential flow and submits results to Firestore.

Every CritiCall skill now has exactly one implementation in `js/modules/*.js`, used by both pages - fixing a bug in a shared module fixes it everywhere automatically. The one thing that differs per page is **`testMode`**: `test-engine.js` sets `window[moduleId + 'Module'].testMode = true` right before rendering a module for the graded test; `criticall.html` never sets it, so it stays `false`. Every module's feedback screens check this flag and withhold the correct-answer reveal only when `true` - untimed practice still gets instant feedback, but the live graded test can't leak answers to later questions. See `js/modules/audio-data-entry.js` for the fullest comment explaining this.

Not every module is wired into the graded test - two are intentionally practice-only (see the module table below).

## CritiCall module architecture (`js/`)

Load order in both `criticall.html` and `criticalltest.html` matters (banks and `js/audio-player.js` before any module that depends on them):
```
js/data/question-bank.js        → window.QuestionBank
js/data/question-bank-part2.js  → window.QuestionBankPart2, shuffleArray(), getRandomQuestions()
js/audio-player.js              → buildAudioPlayerUI(), pickRandomScenarios() (audio/TTS single-play widget)
js/test-engine.js               → window.CritiCallTestEngine (criticalltest.html only - practice has no timer/scoring engine)
js/modules/*.js                 → window.<name>Module, one per file (see table below)
```

**`QuestionBank` vs `QuestionBankPart2`**: two independent globals (not merged) — each module hardcodes which one it pulls from (e.g. `QuestionBank.dataEntry`, `QuestionBankPart2.mathematics`). A few modules (the audio-based ones, Sentence Clarity) keep their own scenario array local to the module file instead of either bank. Check all these places before assuming where a question type lives.

**Test engine (`js/test-engine.js`, `CritiCallTestEngine`)**: owns overall test flow for the graded test only — module sequencing (`config.modules`, in order), per-module timers, progress bar, scoring, and Firestore submission (`testSubmissions/{uid}/tests/{testId}`, plus aggregate stats in `classStats/KBD1100`). It looks up the active module by naming convention: `window[`${moduleId}Module`]`. To add a module to the graded test: add an entry to `config.modules` (id, name, timeLimit, questionCount), add `config.weights.accuracy`/`config.passingScores.accuracy` entries, and expose `window.<moduleId>Module`.

**Module contract**: every `js/modules/*.js` file exports a plain object (`window.<name>Module`) implementing:
- `render(container, questionCount, onComplete)` — initializes state and renders into `container`. `questionCount` is ignored by the handful of modules that are round/timer-structured rather than question-count-driven (`multitaskingModule`, `splitAttentionModule`) - each says so in its own top-of-file comment.
- `testMode` (boolean, default `false`) — see above.
- Internal `init()` / `show*()` / `submit*()` methods driving its own flow.
- Calls `onComplete(results)` when finished, where `results` includes at least `accuracy` (0-100), `correctAnswers`, `totalQuestions`, and for the one actually-typing module (`dataEntry`) `totalKeystrokes`/`totalWords` so the engine can derive `kpm`/`wpm`. A module must NOT render its own "final results" screen and then also call `onComplete` - `criticall.html`'s `handlePracticeModuleComplete` (practice) or the test engine's results screen (graded test) is the only place that happens; see `vinLicenseModule.showResults()` for how a module with multiple sub-exercises still follows this.

**The 14 modules**, one file each except `map-cross-multi.js` (map reading + cross reference) and `additional-modules.js` (reading comprehension + memory recall):

| Module file | `window.*Module` | In graded test? | Notes |
|---|---|---|---|
| `data-entry.js` | `dataEntryModule` | yes | No practice-hub card - graded-test only |
| `audio-data-entry.js` | `audioDataEntryModule` | yes | |
| `call-summarization.js` | `callSummarizationModule` | yes | |
| `listening-skills.js` | `listeningSkillsModule` | yes | |
| `decision-making.js` | `decisionMakingModule` | yes | 15s per-scenario countdown, zero credit on timeout |
| `spelling.js` | `spellingModule` | yes | Audio dictation (hear word, type it) - not multiple choice |
| `mathematics.js` | `mathematicsModule` | yes | No calculator, per real CritiCall rule |
| `map-cross-multi.js` | `mapReadingModule`, `crossReferenceModule` | yes (both) | Cross Reference: 20s per-scenario countdown |
| `multitasking.js` | `multitaskingModule` | yes | Live simulation, ignores `questionCount` |
| `additional-modules.js` | `readingComprehensionModule`, `memoryRecallModule` | yes (both) | Memory Recall takes a `difficulty` 4th arg to `render()` (easy/medium/hard) - practice hub's picker passes it, test engine omits it (defaults to easy) |
| `sentence-clarity.js` | `sentenceClarityModule` | yes | Pick the clearer of 2 statements |
| `split-attention.js` | `splitAttentionModule` | **no** | Not a real distinct CritiCall category (overlaps with Multitasking) - supplementary drill, practice-only, ignores `questionCount` |
| `vin-license.js` | `vinLicenseModule` | **no** | 3 sub-exercises behind one menu (VIN entry, license entry, DOB extraction) - doesn't fit the single-skill graded-test contract, practice-only |

**Scoring model** (`CritiCallTestEngine.calculateOverallScore`): pure accuracy-weighted average across whichever modules were completed, renormalized over just those (no credit for finishing early - real CritiCall doesn't give one either). `dataEntry` additionally has its own net-KPM speed minimum (`config.passingScores.speed`), checked independently of accuracy. A module passes only if every gate that applies to it is met; the overall test passes only if the weighted score clears `overallPassingScore` AND every individual module passed.

## Course settings / access control

`js/course-settings.js` defines `CRITICALL_MODULE_IDS` (all 14 module ids) and `DEFAULT_COURSE_SETTINGS`, read via `getCourseSettings()` (fails safe to fully locked on any error). `teacher.html`'s Course Access panel writes toggles to Firestore `courseSettings/KBD1100`, including one per-module flag under `criticallModules` - these gate which module cards are clickable in `criticall.html`, on top of the hub-level `criticallPracticeUnlocked` master switch.

## Known gaps

Several modules' feedback-screen CSS classes (`.primary-btn`, `.scenario-feedback`, `.feedback-header`, `.feedback-details`, `.feedback-section`, `.module-actions`, etc.) are not actually defined in `styles.css` - those screens render with no custom styling. Not a functional bug, just unfinished polish inherited from early module ports.

## Styling

Single shared stylesheet `styles.css` linked from every page; `criticall.html`/`criticalltest.html` additionally define page-scoped styles in an inline `<style>` block for their practice/test-specific UI (module cards, timers, results tables, etc.).
