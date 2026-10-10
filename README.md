# Java Foundations to Algorithm Mastery

An offline-first learning platform (website + PDF study guides) that takes you from "I have never written Java" to implementing and analysing every algorithm in your course archive.

* **83 lessons** in six modules: Java setup → syntax → core skills → OOP & collections → data structures, searching, sorting, paradigms, Big-O → *all 38 archive slide decks* (Euclid, Euler φ, CRT, Karatsuba, Booth, sieves, bit tricks, Josephus, arrays/matrices, strings, N-Queens, maze, Hamiltonian cycle, Knight's tour, quick/selection sort, …).
* **374 Java programs**, each compiled with `--release 17` and run against expected output (`npm run test:java`).
* **242 exercises** with progressive hints, revealable solutions and automatic checking, **363 quiz questions** (multiple choice, predict-the-output, find-the-bug, fill-in, matching, trace), **a step-by-step dry-run trace for every lesson (83 interactive traces)**, flashcards, cheat sheets, spaced revision and a mixed assessment.
* **Real PDFs**: a 700-page master guide plus seven supplementary guides, generated from the *same* lesson data as the site.
* Everything works **offline**; progress is stored in your browser (`localStorage`) and can be exported/imported as JSON.

## Quick start (macOS)

Prerequisites: **Node.js 20.19+** and a **JDK 17 or newer** (only needed for running code in the playground and for the verification scripts).

```bash
# 1. one-time setup
brew install node          # if you do not have Node
brew install --cask temurin   # a JDK (17+), if `javac -version` fails

# 2. install and run
cd java-algorithm-mastery
npm install
npm run dev                # http://127.0.0.1:5173  (hot reload, local Java runner enabled)
```

Production-style build and server:

```bash
npm run build              # type-checks, then builds to dist/
npm start                  # builds, then serves dist/ + the Java runner on http://127.0.0.1:4173
```

## What is where

| Area | How to use it |
|---|---|
| **Dashboard** | Today's tasks from your N-day plan, recommended next lesson, revision due, weak topics, streak, mastery. |
| **Curriculum** | All modules and lessons, filter by track (essential syntax / core / archive / enrichment), level and status. |
| **Lesson** | The full format: objective → intuition → syntax → worked example → dry run → complete code with line-by-line walkthrough → complexity → common mistakes → practice → quiz → video → revision card. |
| **Playground** | Edit and *really run* Java on your machine (see limits below). Sample input box, expected-output check. |
| **Practice arena** | Every exercise with filters, hints, hidden solution, tests, attempts tracking. |
| **Dry-run lab** | Step through an algorithm with your own input; a complexity lab for loop counts. |
| **Revision** | Flashcards (Leitner boxes), quizzes, cheat sheets, mistakes, bookmarks, weak topics, mixed practice. |
| **Videos** | One or two resources per lesson, clearly marked *verified video* vs *search link*. |
| **Plan** | 7 / 14 / 21 / 30-day schedule on the minimum-viable or complete path. |
| **Settings** | Theme, study target, PDF downloads, export / import / reset progress. |

### The honest bits

* **Mastery** is computed from your actual quiz and exercise results (50 % best quiz, 35 % exercises solved, 15 % completion), never from "I read it".
* The study plans are a **focused revision schedule**. Nobody can promise mastery of this material in 14 days; the plan tells you what to do each day and the quizzes tell you what you actually know.
* The **playground runs Java locally**: the dev server (and `npm start`) shells out to your own `javac`/`java` with an 8 s time limit and a 64 KB output cap, bound to `127.0.0.1` only. On a static host (no Node process) the page says so and shows how to run the file yourself — it never pretends to execute code.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with the Java runner. |
| `npm run build` / `npm start` | Type-check + production build / serve it. |
| `npm test` | Unit tests: lab algorithms vs. hand-checked values, content integrity (prerequisites, anchors, quiz structure, deck coverage), progress / spaced-repetition / study-plan logic. |
| `npm run test:java` | Compile (`--release 17`) and run **every** Java file and exercise test; compares with `.out` files. |
| `npm run audit` | Regenerates `content/*.md` (inventory, curriculum map, coverage matrix) and fails if a lesson lacks a required part. |
| `npm run pdf` | Builds `generated/java-study-guide.pdf` and `generated/supplementary-guides/*.pdf`, and copies them to `public/downloads/` for the site's Download card. |
| `npm run verify:quiz` | Runs every "predict the output" quiz snippet and compares it with the stored answer. |
| `npm run verify:snippets` | Parse-checks every inline code block in the lessons with `javac` (terminal sessions and pseudo-code are skipped). |
| `npm run verify:videos` | Re-checks every verified video id against YouTube's oEmbed endpoint. |

## Project structure

```
README.md  package.json
java/                          real .java files (+ .in / .out samples) — the single source of truth for code
content/                       archive-topic-inventory.md · curriculum-map.md · coverage-matrix.md  (generated by `npm run audit`)
generated/                     java-study-guide.pdf · supplementary-guides/*.pdf
scripts/                       java-runner, verify-java, build-pdf (+ pdf/), find-videos, verify-videos, audit-coverage
src/
  app/                         router, layout, global search
  components/                  quiz, code view/editor, dry-run viewer, video card, exercise card …
  pages/                       Dashboard, Curriculum, LessonPage, Playground, Practice, Lab, Revision, VideoLibrary, Plan, Settings
  features/                    code-playground runner client, dry-run-lab algorithms
  data/
    lessons/                   canonical lesson content (TypeScript objects), m0–m4 foundations + a-* archive lessons
    curriculum/                modules, archive deck inventory
    video-resources/           central video metadata (one place to correct a link)
    revision/                  flashcards, cheat sheets
  lib/                         types, progress & mastery, spaced repetition, study plan, store, syntax highlighter
  styles/
tests/                         vitest suites
```

### How the content stays consistent

Lessons never contain pasted code. A lesson names a file under `java/…`; `scripts/gen-java-index.mjs` bundles those files into `src/data/generated/java-sources.ts`, and both the website and the PDF generator read them from there. `npm run test:java` compiles and runs every file, so a code listing in the site or the PDF can never differ from code that was actually executed. Walkthrough notes anchor to source lines by substring and are checked by the tests.

## Videos

`src/data/video-resources/videos.ts` is the only place video links live. An entry with `kind: 'video'` was retrieved from YouTube (id, title, channel, duration are YouTube's own); a `kind: 'search'` entry is a targeted YouTube search link and is *labelled* as such in the app and in the PDFs. Ids are never invented. `scripts/find-videos.mjs` + `scripts/video-queries.mjs` show exactly how candidates were found; `npm run verify:videos` re-validates them (links can rot).

## Known limitations

* The PDF generator uses the macOS system fonts *Menlo* (code) and *Arial Unicode* / *Apple Symbols* (math symbols) alongside the bundled Inter font. On other systems it falls back to DejaVu if present.
* The playground compiles with whatever JDK is installed (checked with `--release 17`). Programs that need extra libraries or files are not supported.
* Video availability can change; run `npm run verify:videos` occasionally.
* Browser storage is per-browser; use *Export progress* before clearing site data or switching machines.
* Slides that were image-only (Booth's algorithm, leaders, majority element, equilibrium sum) were read with local OCR and every algorithm was re-derived and cross-checked by running code; each place a slide was wrong or ambiguous is listed in `content/archive-topic-inventory.md` and in Appendix E of the master guide.
