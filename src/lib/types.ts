// Canonical content schema. The website AND the PDF generator both consume these types,
// so lesson text, code and video links can never drift apart.

export type Level = 'beginner' | 'intermediate' | 'advanced';

/** The four knowledge categories the learner asked to keep distinct. */
export type Track =
  | 'syntax' //     Essential Java syntax
  | 'core' //       Core programming & data structures
  | 'archive' //    Archive-specific algorithm knowledge
  | 'enrichment'; // Optional advanced Java enrichment

export type ModuleId = 'm0' | 'm1' | 'm2' | 'm3' | 'm4' | 'm5';

export interface ModuleInfo {
  id: ModuleId;
  title: string;
  tagline: string;
  description: string;
}

// ───────────────────────── rich content blocks ─────────────────────────
// Inline markup inside `text`: **bold**, *italic*, `code`, [label](https://url)
export type Block =
  | { t: 'p'; text: string }
  | { t: 'h'; text: string } //                              small sub-heading inside a section
  | { t: 'list'; items: string[]; ordered?: boolean }
  | { t: 'callout'; kind: 'tip' | 'warning' | 'note' | 'why' | 'example' | 'source'; title?: string; text: string }
  | { t: 'code'; code: string; caption?: string } //         inline snippet (illustrative; may be a fragment)
  | { t: 'program'; file: string; caption?: string } //      complete program from java/<file> (verified by `npm run test:java`)
  | { t: 'pre'; text: string; caption?: string } //          ASCII diagram / plain output
  | { t: 'table'; headers: string[]; rows: string[][]; caption?: string }
  | { t: 'math'; text: string };

// ───────────────────────── code & walkthrough ─────────────────────────
export interface WalkthroughNote {
  /** Which line(s) the note explains: a substring that identifies the first matching line
   *  (e.g. "while (b != 0)"), or explicit numbers such as "7" / "9-12". Substring anchors
   *  survive edits to the program; the verifier checks that every anchor resolves. */
  at: string;
  text: string;
}

export interface Program {
  /** path under java/, e.g. "euclid-gcd/EuclidGcd.java" */
  file: string;
  title: string;
  role: 'tiny' | 'simple' | 'optimized' | 'demo' | 'archive-original';
  description: string;
  walkthrough: WalkthroughNote[];
}

// ───────────────────────── practice & assessment ─────────────────────────
export interface TestCase {
  stdin: string;
  stdout: string;
  note?: string;
}

export interface Exercise {
  id: string;
  level: 'beginner' | 'intermediate' | 'challenge';
  title: string;
  statement: string;
  constraints?: string[];
  examples?: { input: string; output: string; explain?: string }[];
  hints: string[];
  /** starter code (complete, compilable skeleton). Inline string. */
  starter?: string;
  /** reference solution file under java/ ; tests are verified against it */
  solutionFile: string;
  solutionExplain: string;
  tests: TestCase[];
}

export type QuizQuestion =
  | { type: 'mcq'; q: string; code?: string; options: string[]; answer: number; explain: string; kind?: 'concept' | 'choose-algorithm' | 'complexity' }
  | { type: 'output'; q: string; code: string; answer: string; accept?: string[]; explain: string }
  | { type: 'bug'; q: string; code: string; answerLine: number; explain: string }
  | { type: 'fill'; q: string; template: string; blanks: string[][]; explain: string }
  | { type: 'match'; q: string; pairs: [string, string][]; explain: string }
  | { type: 'trace'; q: string; code: string; items: { prompt: string; answer: string }[]; explain: string };

// ───────────────────────── lesson ─────────────────────────
export interface DryRunRef {
  /** key into the dry-run lab algorithm registry */
  algo: string;
  /** default input for the canonical walkthrough shown in lesson and PDF */
  input: Record<string, string>;
  caption: string;
}

export interface Mistake {
  title: string;
  wrong: string;
  why: string;
  fix: string;
}

export interface Lesson {
  id: string;
  module: ModuleId;
  title: string;
  summary: string;
  level: Level;
  track: Track;
  minutes: number;
  /** ids of lessons that should be understood first */
  prerequisites: string[];
  /** archive deck base-names this lesson is derived from ([] for lessons that fill foundations) */
  sources: string[];
  /** part of the minimum-viable path? */
  essential: boolean;

  objectives: string[]; //            A
  intuition: Block[]; //              C
  syntax?: Block[]; //                D
  tiny: Block[]; //                   E
  guided: Block[]; //                 F
  dryRun?: DryRunRef; //              G
  programs: Program[]; //             H + I
  complexity: Block[]; //             J
  mistakes: Mistake[]; //             K
  practice: Exercise[]; //            L + M
  quiz: QuizQuestion[]; //            quizzes after every lesson
  interview?: string[]; //            interview / exam style questions
  videos: string[]; //                keys into video-resources
  revision: string[]; //              O  (30-60 second card)
  /** things the original slides got wrong / left implicit, and honest assumptions */
  sourceNotes?: { discrepancies?: string[]; assumptions?: string[] };
}

// ───────────────────────── videos ─────────────────────────
export interface VideoResource {
  key: string;
  /** 'video' = a specific YouTube video whose id/title/channel were retrieved from YouTube;
   *  'search' = targeted YouTube search link (NOT a verified video). */
  kind: 'video' | 'search';
  title: string;
  channel?: string;
  videoId?: string;
  /** duration as shown by YouTube, e.g. "11:51" */
  duration?: string;
  /** what part of the topic the video covers */
  covers: string;
  /** search query for kind === 'search' */
  query?: string;
  verifiedOn?: string;
}

// ───────────────────────── flashcards & problems ─────────────────────────
export interface Flashcard {
  id: string;
  lesson?: string;
  front: string;
  back: string;
}

export interface CheatSheet {
  id: string;
  title: string;
  sections: { heading: string; rows: [string, string][] }[];
}

export interface StandaloneProblem extends Omit<Exercise, 'level'> {
  level: 'beginner' | 'intermediate' | 'challenge';
  topic: string;
  lesson?: string;
}
