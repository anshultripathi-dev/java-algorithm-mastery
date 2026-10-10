import type { Block, Lesson } from '@/lib/types';

// Tiny constructors that keep lesson files readable.
export const p = (text: string): Block => ({ t: 'p', text });
export const h = (text: string): Block => ({ t: 'h', text });
export const ul = (...items: string[]): Block => ({ t: 'list', items });
export const ol = (...items: string[]): Block => ({ t: 'list', items, ordered: true });
export const tip = (text: string, title?: string): Block => ({ t: 'callout', kind: 'tip', title, text });
export const warn = (text: string, title?: string): Block => ({ t: 'callout', kind: 'warning', title, text });
export const note = (text: string, title?: string): Block => ({ t: 'callout', kind: 'note', title, text });
export const why = (text: string, title?: string): Block => ({ t: 'callout', kind: 'why', title: title ?? 'Why this works', text });
export const ex = (text: string, title?: string): Block => ({ t: 'callout', kind: 'example', title, text });
export const code = (c: string, caption?: string): Block => ({ t: 'code', code: c.replace(/^\n/, '').replace(/\s+$/, ''), caption });
export const prog = (file: string, caption?: string): Block => ({ t: 'program', file, caption });
export const pre = (text: string, caption?: string): Block => ({ t: 'pre', text: text.replace(/^\n/, '').replace(/\s+$/, ''), caption });
export const table = (headers: string[], rows: string[][], caption?: string): Block => ({ t: 'table', headers, rows, caption });
export const math = (text: string): Block => ({ t: 'math', text });

/** Fill in sensible defaults so a lesson file only states what is specific to it. */
export function lesson(l: Partial<Lesson> & Pick<Lesson, 'id' | 'module' | 'title' | 'summary' | 'level' | 'track' | 'minutes' | 'objectives' | 'intuition' | 'videos' | 'revision'>): Lesson {
  return {
    prerequisites: [],
    sources: [],
    essential: false,
    tiny: [],
    guided: [],
    programs: [],
    complexity: [],
    mistakes: [],
    practice: [],
    quiz: [],
    ...l,
  } as Lesson;
}
