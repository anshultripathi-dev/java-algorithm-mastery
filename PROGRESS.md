# Build progress (state at last build)

| Phase | Status | Evidence |
|---|---|---|
| 1 Inspect archive (38 decks, images OCR'd) | done | `content/archive-topic-inventory.md` |
| 2 Curriculum map & coverage matrix | done | `content/curriculum-map.md`, `content/coverage-matrix.md` (`npm run audit`) |
| 3 Lesson content (83 lessons, A–O format) | done | `src/data/lessons/*`, `java/*` (374 programs) |
| 4 Application | done | `npm run build` passes (tsc + vite) |
| 5 PDFs | done | `generated/java-study-guide.pdf` + 7 supplementary guides (`npm run pdf`) |
| 6 Tests | done | `npm test` (172), `npm run test:java` (1058 runs), `npm run verify:quiz`, `npm run verify:videos` |
| 7 Audit | done | `npm run audit` passes; open items below |

## Verified counts
- 83 lessons · 374 Java files · 1058 compile+run checks (javac `--release 17`) · 242 exercises · 363 quiz questions · 38/38 deck coverage
- **every lesson has a Syntax section and an interactive step-by-step dry run** (83 lab algorithms, each unit-tested against hand-computed values; Karatsuba's trace is checked against the verified Java program's output)
- 149 inline code snippets in the lessons: 140 parse as Java with `javac`, 9 are terminal sessions / pseudo-code (`npm run verify:snippets`)
- phone-width layout (375 px) checked on 13 routes: no horizontal scrolling
- 166 video slots, all filled with real YouTube videos (id/title/channel/duration copied from YouTube; 165 re-confirmed through oEmbed, 1 has embedding disabled)
- 77 "predict the output" quiz questions: 55 verified by running the snippet, 22 hand-derivation questions checked by hand

## Open items / known limitations
- Video availability can change: run `npm run verify:videos` now and then.
- Slides that were only images were read with local OCR; every algorithm was re-derived and cross-checked by running code (see Appendix E of the master PDF for the corrections).
- The PDF generator relies on macOS system fonts (Menlo, Arial Unicode, Apple Symbols) for code and math glyphs.
- The playground runs code through the local JDK only (dev server / `npm start`); on static hosting it says so instead of pretending.
