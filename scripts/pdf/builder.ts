/**
 * A small typesetting layer on top of pdfkit, written for this project:
 *  - rich inline text (**bold**, *italic*, `code`, [links](url)) with greedy word wrapping
 *  - per-character font fallback (Inter → Arial Unicode → Apple Symbols → STIX), so ≤ √ → φ Θ always render
 *  - syntax-highlighted code blocks that are kept on one page whenever they fit, with line numbers,
 *    walkthrough markers and soft wrapping of over-long lines
 *  - tables with repeating header rows, callouts, trace diagrams
 *  - table of contents with real page numbers and clickable entries, PDF outline (bookmarks),
 *    running headers and "page n of N" footers
 */
import PDFDocument from 'pdfkit';
import * as fontkit from 'fontkit';
import { existsSync, createWriteStream } from 'node:fs';
import { join } from 'node:path';
import { parseInline, stripInline } from '../../src/lib/inline';
import { tokenizeLines, type TokType } from '../../src/lib/highlight';

// ───────────────────────── fonts ─────────────────────────
const ROOT = join(import.meta.dirname, '..', '..');
const FS = join(ROOT, 'node_modules', '@fontsource');
const SYS = '/System/Library/Fonts';

interface FontDef {
  name: string;
  path: string;
  /** postscript name inside a .ttc */
  ps?: string;
}
const first = (...c: (FontDef | undefined)[]) => c.find((x) => x && existsSync(x.path));

const FONT_SPECS: Record<string, (FontDef | undefined)[]> = {
  sans: [{ name: 'sans', path: join(FS, 'inter/files/inter-latin-400-normal.woff') }],
  bold: [{ name: 'bold', path: join(FS, 'inter/files/inter-latin-700-normal.woff') }],
  italic: [{ name: 'italic', path: join(FS, 'inter/files/inter-latin-400-italic.woff') }],
  bolditalic: [{ name: 'bolditalic', path: join(FS, 'inter/files/inter-latin-700-italic.woff') }],
  mono: [
    { name: 'mono', path: `${SYS}/Menlo.ttc`, ps: 'Menlo-Regular' },
    { name: 'mono', path: '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf' },
    { name: 'mono', path: join(FS, 'jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff') },
  ],
  monobold: [
    { name: 'monobold', path: `${SYS}/Menlo.ttc`, ps: 'Menlo-Bold' },
    { name: 'monobold', path: '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf' },
    { name: 'monobold', path: join(FS, 'jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff') },
  ],
  // fallbacks, tried in this order for characters the main font lacks
  fb1: [
    { name: 'fb1', path: `${SYS}/Supplemental/Arial Unicode.ttf` },
    { name: 'fb1', path: '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf' },
  ],
  fb2: [{ name: 'fb2', path: `${SYS}/Apple Symbols.ttf` }, { name: 'fb2', path: '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf' }],
  fb3: [{ name: 'fb3', path: `${SYS}/Supplemental/STIXGeneral.otf` }],
  fb4: [{ name: 'fb4', path: `${SYS}/Menlo.ttc`, ps: 'Menlo-Regular' }],
};

/** Rare modifier letters few fonts carry → readable ASCII. */
const SUBST: Record<string, string> = {
  'ᵢ': '_i', 'ⱼ': '_j', 'ᵏ': '^k', 'ᵈ': '^d', 'ⁱ': '^i', 'ᵒ': '^o', 'ᵇ': '^b', 'ᵖ': '^p', 'ᵗ': '^t', 'ˢ': '^s', 'ʳ': '^r',
  '⟺': '⇔', '⟹': '⇒', '≪': '<<', ' ': ' ', '​': '', '\t': '    ',
};
export function normalize(s: string): string {
  // emoji (in YouTube titles) have no glyphs in the print fonts: drop them and their joiners/selectors
  s = s.replace(/[\u{1F000}-\u{1FAFF}\uFE0F\u20E3\u200D]/gu, '').replace(/ {2,}/g, ' ');
  let out = '';
  for (const ch of s) out += SUBST[ch] ?? ch;
  return out;
}

// ───────────────────────── theme ─────────────────────────
export const C = {
  ink: '#1e293b',
  muted: '#64748b',
  faint: '#94a3b8',
  rule: '#cbd5e1',
  brand: '#4338ca',
  brandSoft: '#eef2ff',
  codeBg: '#f8fafc',
  codeBorder: '#e2e8f0',
  tip: '#0f766e',
  tipBg: '#f0fdfa',
  warn: '#b45309',
  warnBg: '#fffbeb',
  note: '#1d4ed8',
  noteBg: '#eff6ff',
  why: '#6d28d9',
  whyBg: '#f5f3ff',
  example: '#475569',
  exampleBg: '#f1f5f9',
  source: '#9d174d',
  sourceBg: '#fdf2f8',
  good: '#15803d',
  bad: '#b91c1c',
};
const TOK_COLOR: Record<TokType, string> = {
  keyword: '#7c3aed',
  type: '#0e7490',
  string: '#b45309',
  number: '#be185d',
  comment: '#16a34a',
  annotation: '#9333ea',
  method: '#1d4ed8',
  plain: '#1e293b',
};
const CALLOUT: Record<string, { fg: string; bg: string; label: string }> = {
  tip: { fg: C.tip, bg: C.tipBg, label: 'Tip' },
  warning: { fg: C.warn, bg: C.warnBg, label: 'Watch out' },
  note: { fg: C.note, bg: C.noteBg, label: 'Note' },
  why: { fg: C.why, bg: C.whyBg, label: 'Why this works' },
  example: { fg: C.example, bg: C.exampleBg, label: 'Example' },
  source: { fg: C.source, bg: C.sourceBg, label: 'Source note' },
};

// ───────────────────────── types ─────────────────────────
interface Atom {
  text: string;
  font: string;
  size: number;
  color: string;
  w: number;
  link?: string;
  dest?: string;
  bg?: string;
  space?: boolean;
}
export interface TocEntry {
  level: number;
  title: string;
  dest: string;
  page: number;
}
export interface BuilderOptions {
  title: string;
  subtitle?: string;
  author: string;
  subject: string;
  keywords: string[];
  headerLeft: string;
}
export type MarkColor = 'cur' | 'done' | 'found' | 'dim' | 'swap' | 'bad';
const MARK_FILL: Record<MarkColor, string> = { cur: '#fde68a', done: '#bbf7d0', found: '#bfdbfe', dim: '#e2e8f0', swap: '#fecaca', bad: '#fca5a5' };

export class PdfBuilder {
  doc: PDFKit.PDFDocument;
  readonly pageW = 595.28;
  readonly pageH = 841.89;
  readonly mx = 54;
  readonly mTop = 66;
  readonly mBottom = 58;
  readonly width = 595.28 - 108;
  y = 0;
  /** pages (index) → running header text */
  private pageSection = new Map<number, string>();
  private section = '';
  private widthCache = new Map<string, number>();
  private covers = new Map<string, Set<number> | null>();
  private fkit: Record<string, any> = {};
  private outlineStack: any[] = [];
  toc: TocEntry[] = [];
  private destCount = 0;
  private fontOk: Record<string, boolean> = {};
  missingGlyphs = new Set<string>();
  private noHeaderPages = new Set<number>();
  private pageCount = 0;
  private stream: ReturnType<typeof createWriteStream>;

  constructor(private opts: BuilderOptions, outFile: string) {
    this.doc = new PDFDocument({
      size: 'A4',
      margins: { top: this.mTop, bottom: this.mBottom, left: this.mx, right: this.mx },
      bufferPages: true,
      autoFirstPage: false,
      pdfVersion: '1.7',
      displayTitle: true,
      lang: 'en-US',
      info: { Title: opts.title, Author: opts.author, Subject: opts.subject, Keywords: opts.keywords.join(', '), Creator: 'Java Foundations to Algorithm Mastery — build-pdf', Producer: 'pdfkit' },
    });
    this.stream = createWriteStream(outFile);
    this.doc.pipe(this.stream);
    this.loadFonts();
    this.outlineStack = [this.doc.outline];
  }

  private loadFonts() {
    for (const [key, specs] of Object.entries(FONT_SPECS)) {
      const def = first(...specs);
      if (!def) {
        this.fontOk[key] = false;
        continue;
      }
      if (key.startsWith('fb') || key === 'mono' || key === 'sans') {
        try {
          this.fkit[key] = def.ps ? fontkit.openSync(def.path, def.ps) : fontkit.openSync(def.path);
        } catch {
          /* coverage probing is best effort */
        }
      }
      this.doc.registerFont(key, def.path, def.ps);
      this.fontOk[key] = true;
    }
    if (!this.fontOk.sans || !this.fontOk.bold) throw new Error('Inter fonts not found: run `npm install` first.');
    for (const k of ['mono', 'monobold']) if (!this.fontOk[k]) throw new Error(`No monospace font available for ${k}`);
    // Inter has no italic fallback for fallback fonts; make sure missing optional fonts do not crash lookups.
    if (!this.fontOk.fb1) console.warn('! Arial Unicode not found: symbols such as ≤ → √ may be missing from the PDF.');
  }

  private has(font: string, cp: number): boolean {
    const key = font.startsWith('mono') ? 'mono' : font === 'sans' || font === 'bold' || font === 'italic' || font === 'bolditalic' ? 'sans' : font;
    const fk = this.fkit[key];
    if (!fk) return false;
    try {
      return fk.hasGlyphForCodePoint(cp);
    } catch {
      return false;
    }
  }

  /** Split text into runs that each render entirely in one available font. */
  private segments(text: string, font: string): { font: string; text: string }[] {
    const chain = [font, 'fb1', 'fb2', 'fb3', 'fb4'].filter((f) => this.fontOk[f.replace(/^(bold|italic|bolditalic)$/, 'sans') as string] !== false);
    const out: { font: string; text: string }[] = [];
    for (const ch of text) {
      const cp = ch.codePointAt(0)!;
      let f = chain[0];
      if (cp > 0x7e || cp < 0x20) {
        const hit = chain.find((c) => this.has(c, cp));
        if (hit) f = hit;
        else {
          this.missingGlyphs.add(ch);
          f = chain[0];
        }
      }
      const last = out[out.length - 1];
      if (last && last.font === f) last.text += ch;
      else out.push({ font: f, text: ch });
    }
    return out;
  }

  width_(font: string, size: number, text: string): number {
    const k = `${font}|${size}|${text}`;
    let v = this.widthCache.get(k);
    if (v === undefined) {
      v = this.doc.font(font).fontSize(size).widthOfString(text);
      this.widthCache.set(k, v);
    }
    return v;
  }
  private asc(font: string, size: number): number {
    this.doc.font(font).fontSize(size);
    return ((this.doc as any)._font.ascender / 1000) * size;
  }

  // ───────────────────────── page control ─────────────────────────
  get left() {
    return this.mx;
  }
  get right() {
    return this.mx + this.width;
  }
  get bottom() {
    return this.pageH - this.mBottom;
  }
  get remaining() {
    return this.bottom - this.y;
  }

  addPage(opts: { noHeader?: boolean } = {}) {
    this.doc.addPage();
    this.pageCount++;
    this.y = this.mTop;
    const idx = this.pageCount - 1;
    this.pageSection.set(idx, this.section);
    if (opts.noHeader) this.noHeaderPages.add(idx);
  }
  get pageIndex() {
    return this.pageCount - 1;
  }
  setSection(s: string) {
    this.section = s;
  }
  /** headings of level 3/4 are drawn lazily so they always stay on the same page as what follows. */
  private pending?: { level: 3 | 4; text: string; color: string };
  ensure(h: number) {
    if (this.pending) {
      const p = this.pending;
      const hh = (p.level === 3 ? 12.5 : 10.5) * 1.42 + (p.level === 3 ? 9 : 5);
      // keep the heading with at least ~110pt of what follows (an intro line alone is not enough)
      if (this.y + hh + Math.max(h, 110) > this.bottom) this.addPage();
      this.pending = undefined;
      this.y += p.level === 3 ? 5 : 2;
      this.paragraph(p.text, { size: p.level === 3 ? 12.5 : 10.5, bold: true, color: p.color, after: p.level === 3 ? 4 : 3 });
    }
    if (this.y + h > this.bottom) this.addPage();
  }
  space(h: number) {
    this.y += h;
  }

  // ───────────────────────── rich text ─────────────────────────
  private atomsFor(text: string, base: { font?: string; size: number; color?: string; bold?: boolean; italic?: boolean }): Atom[] {
    const atoms: Atom[] = [];
    const baseFont = base.font ?? (base.bold && base.italic ? 'bolditalic' : base.bold ? 'bold' : base.italic ? 'italic' : 'sans');
    for (const run of parseInline(text)) {
      let font = baseFont;
      let size = base.size;
      let color = base.color ?? C.ink;
      let bg: string | undefined;
      let link: string | undefined;
      if (run.k === 'b') font = baseFont === 'italic' || baseFont === 'bolditalic' ? 'bolditalic' : baseFont === 'mono' ? 'monobold' : 'bold';
      else if (run.k === 'i') font = baseFont === 'bold' || baseFont === 'bolditalic' ? 'bolditalic' : 'italic';
      else if (run.k === 'code') {
        font = 'mono';
        size = base.size * 0.88;
        color = '#9d174d';
        bg = '#f1f5f9';
      } else if (run.k === 'link') {
        color = C.brand;
        link = run.href;
      }
      const s = normalize(run.s);
      for (const tok of s.split(/(\s+)/)) {
        if (tok === '') continue;
        if (/^\s+$/.test(tok)) {
          atoms.push({ text: ' ', font, size, color, w: this.width_(font === 'mono' ? 'mono' : font, size, ' '), bg, space: true, link });
          continue;
        }
        for (const seg of this.segments(tok, font)) {
          atoms.push({ text: seg.text, font: seg.font, size, color, w: this.width_(seg.font, size, seg.text), bg, link });
        }
      }
    }
    return atoms;
  }

  /** Greedy wrap atoms into lines of at most `maxW` points. */
  private wrapAtoms(atoms: Atom[], maxW: number): Atom[][] {
    const lines: Atom[][] = [[]];
    let w = 0;
    // group into words (maximal runs of non-space atoms)
    const words: Atom[][] = [];
    let cur: Atom[] = [];
    const flush = () => {
      if (cur.length) words.push(cur);
      cur = [];
    };
    for (const a of atoms) {
      if (a.space) {
        flush();
        words.push([a]);
      } else cur.push(a);
    }
    flush();
    for (const word of words) {
      const isSpace = word.length === 1 && word[0].space;
      const ww = word.reduce((s, a) => s + a.w, 0);
      if (isSpace) {
        if (lines[lines.length - 1].length === 0) continue; // no leading space on a line
        if (w + ww > maxW) {
          lines.push([]);
          w = 0;
          continue;
        }
        lines[lines.length - 1].push(word[0]);
        w += ww;
        continue;
      }
      if (w + ww > maxW && lines[lines.length - 1].length) {
        // drop trailing space
        const l = lines[lines.length - 1];
        while (l.length && l[l.length - 1].space) l.pop();
        lines.push([]);
        w = 0;
      }
      if (ww > maxW) {
        // hard-break an over-long word (URLs, long identifiers)
        for (const a of word) {
          let rest = a.text;
          while (rest.length) {
            let n = rest.length;
            while (n > 1 && this.width_(a.font, a.size, rest.slice(0, n)) > maxW - w) n--;
            if (n === rest.length && this.width_(a.font, a.size, rest) <= maxW - w) {
              lines[lines.length - 1].push({ ...a, text: rest, w: this.width_(a.font, a.size, rest) });
              w += this.width_(a.font, a.size, rest);
              rest = '';
            } else {
              if (w > 0 && n <= 1) {
                lines.push([]);
                w = 0;
                continue;
              }
              const piece = rest.slice(0, n);
              lines[lines.length - 1].push({ ...a, text: piece, w: this.width_(a.font, a.size, piece) });
              rest = rest.slice(n);
              lines.push([]);
              w = 0;
            }
          }
        }
        continue;
      }
      for (const a of word) lines[lines.length - 1].push(a);
      w += ww;
    }
    while (lines.length > 1 && lines[lines.length - 1].length === 0) lines.pop();
    return lines;
  }

  private drawLine(atoms: Atom[], x: number, top: number, lineH: number, size: number) {
    const base = top + size * 0.95; // baseline for the line's nominal size
    let cx = x;
    for (const a of atoms) {
      if (a.bg) {
        this.doc.save();
        this.doc.roundedRect(cx - 1.2, base - a.size * 1.0, a.w + 2.4, a.size * 1.28, 2).fill(a.bg);
        this.doc.restore();
      }
      if (!a.space || a.link) {
        const y = base - this.asc(a.font, a.size);
        const internal = a.link?.startsWith('#') ? a.link.slice(1) : undefined;
        this.doc.font(a.font).fontSize(a.size).fillColor(a.color).text(a.text, cx, y, { lineBreak: false, link: internal ? undefined : a.link, underline: !!a.link });
        if (internal) this.doc.goTo(cx, top, a.w, lineH, internal);
      }
      cx += a.w;
    }
  }

  /** Height a paragraph would need at the given width (no drawing). */
  measure(text: string, size = 10, width = this.width, lineGap = 1.42, base: Partial<{ bold: boolean; italic: boolean; font: string }> = {}): { lines: Atom[][]; height: number; lineH: number } {
    const lineH = size * lineGap;
    const lines = this.wrapAtoms(this.atomsFor(text, { size, ...base }), width);
    return { lines, height: lines.length * lineH, lineH };
  }

  /** Draw a paragraph; splits across pages line by line (keeps ≥ 2 lines together where possible). */
  paragraph(text: string, o: { size?: number; x?: number; width?: number; color?: string; bold?: boolean; italic?: boolean; after?: number; align?: 'left' | 'center'; lineGap?: number } = {}) {
    const size = o.size ?? 10;
    const x = o.x ?? this.left;
    const width = o.width ?? this.width;
    const lineH = size * (o.lineGap ?? 1.42);
    const lines = this.wrapAtoms(this.atomsFor(text, { size, color: o.color, bold: o.bold, italic: o.italic }), width);
    if (lines.length >= 2) this.ensure(lineH * 2);
    for (const l of lines) {
      this.ensure(lineH);
      let ox = x;
      if (o.align === 'center') ox = x + (width - l.reduce((s, a) => s + a.w, 0)) / 2;
      this.drawLine(l, ox, this.y, lineH, size);
      this.y += lineH;
    }
    this.y += o.after ?? 5;
  }

  // ───────────────────────── headings / outline / toc ─────────────────────────
  private newDest(): string {
    return `d${++this.destCount}`;
  }

  /** level 1 = part, 2 = lesson / chapter, 3 = section. */
  heading(level: 1 | 2 | 3 | 4, text: string, o: { toc?: boolean; newPage?: boolean; id?: string; color?: string } = {}) {
    const size = level === 1 ? 24 : level === 2 ? 17 : level === 3 ? 12.5 : 10.5;
    const need = size * 3 + (level <= 2 ? 40 : 18);
    if (o.newPage || level === 1) {
      this.pending = undefined;
      this.addPage();
    } else if (level <= 2) this.ensure(need);
    else if (this.pending) this.ensure(0);
    if (level === 2) this.y += 4;
    const dest = o.id ?? this.newDest();
    this.doc.addNamedDestination(dest, 'XYZ', 0, this.pageH - this.y + 12, null);
    if (o.toc !== false && level <= 2) {
      const plain = stripInline(text);
      this.toc.push({ level, title: plain, dest, page: this.pageIndex + 1 });
      // outline: keep two levels (part → lesson); sections nest under lessons
      this.outlineStack.length = Math.min(this.outlineStack.length, level);
      const parent = this.outlineStack[this.outlineStack.length - 1];
      const item = parent.addItem(plain.length > 90 ? plain.slice(0, 87) + '…' : plain, { expanded: level === 1 });
      this.outlineStack[level] = item;
    }
    const color = o.color ?? (level === 1 ? C.brand : level === 2 ? C.ink : level === 3 ? C.brand : C.muted);
    if (level === 2) {
      const lines = this.wrapAtoms(this.atomsFor(text, { size, color, bold: true }), this.width);
      for (const l of lines) {
        this.drawLine(l, this.left, this.y, size * 1.25, size);
        this.y += size * 1.25;
      }
      this.y += 2;
      this.doc.moveTo(this.left, this.y).lineTo(this.right, this.y).lineWidth(1.4).strokeColor(C.brand).stroke();
      this.y += 9;
    } else if (level === 1) {
      const lines = this.wrapAtoms(this.atomsFor(text, { size, color, bold: true }), this.width);
      for (const l of lines) {
        this.drawLine(l, this.left, this.y, size * 1.3, size);
        this.y += size * 1.3;
      }
      this.y += 8;
    } else {
      this.pending = { level: level as 3 | 4, text, color };
    }
    return dest;
  }

  private tocLayout(levels: number[]): { page: number; y: number }[] {
    const top = this.mTop + 34;
    const out: { page: number; y: number }[] = [];
    let page = 0;
    let y = top;
    levels.forEach((lv, i) => {
      const h = lv === 1 ? 15.5 : 15;
      const gap = lv === 1 && i > 0 ? 7 : 0;
      if (y + gap + h > this.bottom - 6) {
        page++;
        y = top;
      } else y += gap;
      out.push({ page, y });
      y += h;
    });
    return out;
  }

  /** Reserve pages for the table of contents (entry levels known up front); filled by `fillToc`. */
  reserveToc(levels: number[]): number[] {
    const lay = this.tocLayout(levels);
    const pages = (lay.length ? lay[lay.length - 1].page : 0) + 1;
    const idx: number[] = [];
    for (let i = 0; i < pages; i++) {
      this.setSection('Contents');
      this.addPage();
      idx.push(this.pageIndex);
    }
    return idx;
  }

  fillToc(pageIdx: number[], entries: TocEntry[] = this.toc) {
    const lay = this.tocLayout(entries.map((e) => e.level));
    entries.forEach((e, i) => {
      const { page, y } = lay[i];
      this.doc.switchToPage(pageIdx[Math.min(pageIdx.length - 1, page)]);
      const indent = e.level === 1 ? 0 : 16;
      const size = e.level === 1 ? 10.5 : 9;
      const font = e.level === 1 ? 'bold' : 'sans';
      const label = normalize(e.title);
      const pageStr = String(e.page);
      const pw = this.width_('sans', size, pageStr);
      const maxLabel = this.width - indent - pw - 18;
      let shown = label;
      while (shown.length > 4 && this.width_(font, size, shown) > maxLabel) shown = shown.slice(0, -2);
      if (shown !== label) shown = shown.trimEnd() + '…';
      const lw = this.width_(font, size, shown);
      const x0 = this.left + indent;
      this.doc.font(font).fontSize(size).fillColor(e.level === 1 ? C.brand : C.ink).text(shown, x0, y, { lineBreak: false });
      const dotsX = x0 + lw + 6;
      const dotsW = this.right - pw - 6 - dotsX;
      if (dotsW > 8) {
        const dw = this.width_('sans', size, '. ');
        this.doc.font('sans').fontSize(size).fillColor(C.faint).text('. '.repeat(Math.floor(dotsW / dw)), dotsX, y, { lineBreak: false });
      }
      this.doc.font('sans').fontSize(size).fillColor(C.ink).text(pageStr, this.right - pw, y, { lineBreak: false });
      this.doc.goTo(this.left, y - 1, this.width, 14, e.dest);
    });
    this.doc.switchToPage(pageIdx[0]);
    this.doc.font('bold').fontSize(20).fillColor(C.brand).text('Contents', this.left, this.mTop, { lineBreak: false });
  }

  // ───────────────────────── blocks ─────────────────────────
  bullets(items: string[], o: { ordered?: boolean; size?: number } = {}) {
    const size = o.size ?? 10;
    const lineH = size * 1.42;
    items.forEach((it, i) => {
      const marker = o.ordered ? `${i + 1}.` : '•';
      const indent = o.ordered ? 20 : 14;
      const lines = this.wrapAtoms(this.atomsFor(it, { size }), this.width - indent);
      this.ensure(lineH * Math.min(2, lines.length));
      this.doc.font('sans').fontSize(size).fillColor(C.brand).text(marker, this.left + 2, this.y + size * 0.95 - this.asc('sans', size), { lineBreak: false });
      for (const l of lines) {
        this.ensure(lineH);
        this.drawLine(l, this.left + indent, this.y, lineH, size);
        this.y += lineH;
      }
      this.y += 2.5;
    });
    this.y += 3;
  }

  callout(kind: string, title: string | undefined, text: string) {
    const st = CALLOUT[kind] ?? CALLOUT.note;
    const pad = 8;
    const size = 9.5;
    const innerW = this.width - pad * 2 - 4;
    const label = title ?? st.label;
    const m = this.measure(text, size, innerW);
    const total = m.height + 16 + pad * 2;
    this.ensure(Math.min(total, this.bottom - this.mTop - 10));
    const startY = this.y;
    // split across pages only if taller than the page
    if (total <= this.bottom - this.mTop) {
      this.doc.save();
      this.doc.roundedRect(this.left, this.y, this.width, total, 4).fill(st.bg);
      this.doc.rect(this.left, this.y, 3, total).fill(st.fg);
      this.doc.restore();
      this.doc.font('bold').fontSize(8.5).fillColor(st.fg).text(normalize(label).toUpperCase(), this.left + pad + 4, this.y + pad, { lineBreak: false, characterSpacing: 0.5 });
      let ty = this.y + pad + 14;
      for (const l of m.lines) {
        this.drawLine(l, this.left + pad + 4, ty, m.lineH, size);
        ty += m.lineH;
      }
      this.y = startY + total + 6;
    } else {
      this.paragraph(`**${label}.** ${text}`, { size });
    }
  }

  private codeLines(code: string) {
    return tokenizeLines(code);
  }

  /**
   * Syntax-highlighted code block. Soft-wraps lines longer than the box, optional line numbers,
   * walkthrough markers, and `highlight` ranges (1-based, inclusive).
   */
  code(
    code: string,
    o: { caption?: string; lineNumbers?: boolean; markers?: { n: number; line: [number, number] }[]; fontSize?: number; plain?: boolean; title?: string } = {},
  ) {
    const size = o.fontSize ?? 8;
    const lh = size * 1.5;
    const cw = this.width_('mono', size, 'M');
    const gutter = o.lineNumbers ? 26 : 0;
    const padX = 8;
    const markerW = o.markers && o.markers.length ? 14 : 0;
    const textW = this.width - padX * 2 - gutter - markerW;
    const maxCols = Math.max(20, Math.floor(textW / cw));
    const lines = o.plain ? code.split('\n').map((s) => [{ t: 'plain' as TokType, s }]) : this.codeLines(code);
    // visual rows: each source line may wrap
    interface Row {
      src: number;
      first: boolean;
      toks: { t: TokType; s: string }[];
    }
    const rows: Row[] = [];
    lines.forEach((toks, si) => {
      const norm = toks.map((t) => ({ t: t.t, s: normalize(t.s) }));
      const chars: { c: string; t: TokType }[] = [];
      for (const t of norm) for (const c of t.s) chars.push({ c, t: t.t });
      if (chars.length <= maxCols) {
        rows.push({ src: si, first: true, toks: norm });
        return;
      }
      const lead = chars.findIndex((x) => x.c !== ' ');
      const indent = Math.min(24, (lead < 0 ? 0 : lead) + 4);
      const regroup = (cs: { c: string; t: TokType }[], pad: number) => {
        const out: { t: TokType; s: string }[] = pad ? [{ t: 'plain', s: ' '.repeat(pad) }] : [];
        for (const x of cs) {
          const last = out[out.length - 1];
          if (last && last.t === x.t) last.s += x.c;
          else out.push({ t: x.t, s: x.c });
        }
        return out;
      };
      let rest = chars;
      let first = true;
      while (rest.length > (first ? maxCols : maxCols - indent)) {
        const room = first ? maxCols : maxCols - indent;
        // prefer to break after a space / comma / operator that is not too far left
        let cut = -1;
        for (let k = room; k > room * 0.45; k--) {
          const ch = rest[k - 1].c;
          if (ch === ' ' || ch === ',' || ch === '+' || ch === ';' || ch === ')') {
            cut = k;
            break;
          }
        }
        if (cut < 0) cut = room;
        rows.push({ src: si, first, toks: regroup(rest.slice(0, cut), first ? 0 : indent) });
        rest = rest.slice(cut);
        while (rest.length && rest[0].c === ' ') rest = rest.slice(1);
        first = false;
      }
      rows.push({ src: si, first, toks: regroup(rest, first ? 0 : indent) });
    });
    const capH = o.caption || o.title ? 17 : 0;
    const total = rows.length * lh + 12 + capH;
    const pageRoom = this.bottom - this.mTop - 8;
    const keep = total <= pageRoom;
    if (keep) this.ensure(total + 4);
    else this.ensure(capH + lh * 6 + 12);

    let idx = 0;
    let continued = false;
    while (idx < rows.length) {
      const avail = this.bottom - this.y;
      const head = (idx === 0 ? capH : 14) + 12;
      let take = Math.min(rows.length - idx, Math.floor((avail - head) / lh));
      if (take < 4 && rows.length - idx > take) {
        this.addPage();
        continue;
      }
      take = Math.max(1, take);
      const boxH = take * lh + 10;
      // caption
      if (idx === 0 && (o.caption || o.title)) {
        const cap = normalize((o.title ? `${o.title}` : '') + (o.title && o.caption ? ' — ' : '') + (o.caption ?? ''));
        const m = this.measure(cap, 8.5, this.width, 1.3, { bold: !!o.title });
        this.paragraphAtomsInline(cap, 8.5, C.muted, true);
      } else if (continued) {
        this.doc.font('italic').fontSize(7.5).fillColor(C.faint).text('(code continued)', this.left, this.y, { lineBreak: false });
        this.y += 11;
      }
      const top = this.y;
      this.doc.save();
      this.doc.roundedRect(this.left, top, this.width, boxH, 3).fillAndStroke(C.codeBg, C.codeBorder);
      this.doc.restore();
      let ty = top + 5;
      for (let r = idx; r < idx + take; r++) {
        const row = rows[r];
        let x = this.left + padX;
        if (o.lineNumbers && row.first) {
          this.doc.font('mono').fontSize(size - 1).fillColor(C.faint).text(String(row.src + 1).padStart(3, ' '), x - 2, ty + size * 0.95 - this.asc('mono', size - 1), { lineBreak: false });
        }
        x += gutter;
        for (const tok of row.toks) {
          if (!tok.s) continue;
          const font = tok.t === 'keyword' ? 'monobold' : 'mono';
          // fallback for glyphs the mono font lacks
          for (const seg of this.segments(tok.s, font)) {
            const w = seg.font === font || seg.font === 'mono' || seg.font === 'monobold' ? cw * [...seg.text].length : this.width_(seg.font, size, seg.text);
            if (seg.text.trim() !== '' || true) {
              this.doc.font(seg.font).fontSize(size).fillColor(TOK_COLOR[tok.t] ?? C.ink).text(seg.text, x, ty + size * 0.95 - this.asc(seg.font, size), { lineBreak: false, characterSpacing: 0 });
            }
            x += w;
          }
        }
        if (o.markers) {
          for (const m of o.markers) {
            if (row.first && m.line[0] === row.src + 1) this.marker(this.right - padX - 6, ty + lh / 2 - 1, m.n);
          }
        }
        ty += lh;
      }
      this.y = top + boxH + 5;
      idx += take;
      if (idx < rows.length) {
        continued = true;
        this.addPage();
      }
    }
    this.y += 3;
  }

  private marker(cx: number, cy: number, n: number) {
    this.doc.save();
    this.doc.circle(cx, cy, 5.2).fill(C.brand);
    this.doc.restore();
    const s = String(n);
    const w = this.width_('bold', 6.5, s);
    this.doc.font('bold').fontSize(6.5).fillColor('#ffffff').text(s, cx - w / 2, cy - 3.2, { lineBreak: false });
  }

  /** Small caption line (rich text, single paragraph, no wrapping below minimum). */
  private paragraphAtomsInline(text: string, size: number, color: string, bold = false) {
    this.paragraph(text, { size, color, bold, after: 3, lineGap: 1.3 });
  }

  pre(text: string, caption?: string) {
    this.code(text, { caption, plain: true, fontSize: 8 });
  }

  math(text: string) {
    const size = 10.5;
    const atoms = this.atomsFor(normalize(text), { size, font: 'mono' });
    const lines = this.wrapAtoms(atoms, this.width - 24);
    const h = lines.length * size * 1.5 + 12;
    this.ensure(h + 4);
    this.doc.save();
    this.doc.roundedRect(this.left, this.y, this.width, h, 4).fill(C.brandSoft);
    this.doc.restore();
    let ty = this.y + 6;
    for (const l of lines) {
      const w = l.reduce((s, a) => s + a.w, 0);
      this.drawLine(l, this.left + (this.width - w) / 2, ty, size * 1.5, size);
      ty += size * 1.5;
    }
    this.y += h + 6;
  }

  /** Table with automatic column widths, wrapping cells, repeating header and page splits between rows. */
  table(headers: string[], rows: string[][], o: { caption?: string; size?: number; widths?: number[]; mono?: boolean[] } = {}) {
    const size = o.size ?? 8.5;
    const cols = headers.length;
    const pad = 4.5;
    // column widths: proportional to the longest cell, clamped
    let widths = o.widths;
    if (!widths) {
      const weights = headers.map((h, c) => {
        const longest = Math.max(h.length, ...rows.map((r) => (r[c] ?? '').replace(/[*`]/g, '').length));
        const avg = rows.length ? rows.reduce((s, r) => s + (r[c] ?? '').length, 0) / rows.length : 4;
        return Math.min(48, Math.max(5, 0.45 * longest + 0.55 * avg)) + 3;
      });
      const sum = weights.reduce((a, b) => a + b, 0);
      widths = weights.map((w) => (w / sum) * this.width);
    }
    const lh = size * 1.38;
    const cell = (text: string, c: number, bold = false) => this.measure(text, size, widths![c] - pad * 2, 1.38, { bold, font: o.mono?.[c] ? 'mono' : undefined });
    const headerM = headers.map((h, c) => cell(h, c, true));
    const headerH = Math.max(...headerM.map((m) => m.height)) + pad * 2;
    if (o.caption) {
      this.ensure(30);
      this.paragraph(o.caption, { size: 8.5, color: C.muted, italic: true, after: 3 });
    }
    const drawHeader = () => {
      this.doc.save();
      this.doc.rect(this.left, this.y, this.width, headerH).fill(C.brandSoft);
      this.doc.restore();
      let x = this.left;
      headerM.forEach((m, c) => {
        let ty = this.y + pad;
        for (const l of m.lines) {
          this.drawLine(l.map((a) => ({ ...a, color: C.brand })), x + pad, ty, lh, size);
          ty += lh;
        }
        x += widths![c];
      });
      this.y += headerH;
    };
    this.ensure(headerH + lh * 2 + pad * 2);
    drawHeader();
    rows.forEach((row, ri) => {
      const ms = row.map((t, c) => cell(t ?? '', c));
      const h = Math.max(...ms.map((m) => m.height)) + pad * 2;
      if (this.y + h > this.bottom) {
        this.addPage();
        drawHeader();
      }
      if (ri % 2 === 1) {
        this.doc.save();
        this.doc.rect(this.left, this.y, this.width, h).fill('#f8fafc');
        this.doc.restore();
      }
      let x = this.left;
      ms.forEach((m, c) => {
        let ty = this.y + pad;
        for (const l of m.lines) {
          this.drawLine(l, x + pad, ty, lh, size);
          ty += lh;
        }
        x += widths![c];
      });
      this.doc.moveTo(this.left, this.y + h).lineTo(this.right, this.y + h).lineWidth(0.4).strokeColor(C.rule).stroke();
      this.y += h;
    });
    this.y += 8;
  }

  /** Row of small cells (an array) with highlight colours and pointer labels. */
  arrayRow(name: string, values: (string | number)[], marks: Record<number, MarkColor> = {}, pointers: Record<number, string> = {}, indexStart = 0) {
    const size = 8;
    const cellW = Math.min(34, Math.max(20, ...values.map((v) => this.width_('mono', size, String(v)) + 8)));
    const cellH = 16;
    const labelW = Math.min(120, this.width_('bold', 8, name) + 10);
    const perRow = Math.max(1, Math.floor((this.width - labelW) / cellW));
    for (let start = 0; start < values.length; start += perRow) {
      const slice = values.slice(start, start + perRow);
      this.ensure(cellH + 24);
      if (start === 0) this.doc.font('bold').fontSize(8).fillColor(C.muted).text(normalize(name), this.left, this.y + 4, { lineBreak: false, width: labelW, ellipsis: true });
      let x = this.left + labelW;
      slice.forEach((v, k) => {
        const i = start + k;
        const m = marks[i];
        this.doc.save();
        this.doc.rect(x, this.y, cellW, cellH).fillAndStroke(m ? MARK_FILL[m] : '#ffffff', C.rule);
        this.doc.restore();
        const s = normalize(String(v));
        const w = this.width_('mono', size, s);
        this.doc.font('mono').fontSize(size).fillColor(m === 'dim' ? C.faint : C.ink).text(s, x + Math.max(1, (cellW - w) / 2), this.y + 4, { lineBreak: false });
        const idxS = String(i + indexStart);
        this.doc.font('sans').fontSize(6).fillColor(C.faint).text(idxS, x + (cellW - this.width_('sans', 6, idxS)) / 2, this.y + cellH + 1, { lineBreak: false });
        if (pointers[i]) {
          const p = normalize(pointers[i]);
          this.doc.font('bold').fontSize(6.5).fillColor(C.brand).text(p, x + Math.max(0, (cellW - this.width_('bold', 6.5, p)) / 2), this.y + cellH + 8, { lineBreak: false });
        }
        x += cellW;
      });
      this.y += cellH + (Object.keys(pointers).length ? 19 : 11);
    }
    this.y += 2;
  }

  grid(cells: string[][], marks: Record<string, MarkColor> = {}) {
    const size = 8;
    const rows = cells.length;
    const cols = Math.max(...cells.map((r) => r.length));
    const cw = Math.min(30, Math.max(18, ...cells.flat().map((s) => this.width_('mono', size, normalize(s)) + 8)));
    const ch = 15;
    this.ensure(rows * ch + 6);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const m = marks[`${r},${c}`];
        const x = this.left + 6 + c * cw;
        const y = this.y + r * ch;
        this.doc.save();
        this.doc.rect(x, y, cw, ch).fillAndStroke(m ? MARK_FILL[m] : '#ffffff', C.rule);
        this.doc.restore();
        const s = normalize(cells[r][c] ?? '');
        const w = this.width_('mono', size, s);
        this.doc.font('mono').fontSize(size).fillColor(C.ink).text(s, x + Math.max(1, (cw - w) / 2), y + 3.5, { lineBreak: false });
      }
    }
    this.y += rows * ch + 6;
  }

  rule() {
    this.doc.moveTo(this.left, this.y).lineTo(this.right, this.y).lineWidth(0.6).strokeColor(C.rule).stroke();
    this.y += 8;
  }

  /** Coloured box with a title and wrapped rich text (used for revision cards, summaries). */
  box(title: string, lines: string[], o: { color?: string; bg?: string; bullets?: boolean } = {}) {
    const fg = o.color ?? C.brand;
    const bg = o.bg ?? C.brandSoft;
    const pad = 9;
    const size = 9.5;
    const innerW = this.width - pad * 2;
    const ms = lines.map((l) => this.measure((o.bullets === false ? '' : '• ') + l, size, innerW, 1.4));
    const h = ms.reduce((s, m) => s + m.height + 2, 0) + 22 + pad;
    this.ensure(Math.min(h, this.bottom - this.mTop));
    this.doc.save();
    this.doc.roundedRect(this.left, this.y, this.width, h, 5).fill(bg);
    this.doc.roundedRect(this.left, this.y, this.width, h, 5).lineWidth(0.8).stroke(fg);
    this.doc.restore();
    this.doc.font('bold').fontSize(9).fillColor(fg).text(normalize(title).toUpperCase(), this.left + pad, this.y + pad, { lineBreak: false, characterSpacing: 0.6 });
    let ty = this.y + pad + 14;
    for (const m of ms) {
      for (const l of m.lines) {
        this.drawLine(l, this.left + pad, ty, m.lineH, size);
        ty += m.lineH;
      }
      ty += 2;
    }
    this.y += h + 8;
  }

  // ───────────────────────── finishing ─────────────────────────
  decorate(opts: { skipPages?: number[] } = {}) {
    const range = this.doc.bufferedPageRange();
    const total = range.count;
    for (let i = 0; i < total; i++) {
      this.doc.switchToPage(i);
      if (this.noHeaderPages.has(i) || opts.skipPages?.includes(i)) continue;
      const d = this.doc;
      const savedBottom = d.page.margins.bottom;
      d.page.margins.bottom = 0;
      // header
      d.font('sans').fontSize(7.5).fillColor(C.faint).text(normalize(this.opts.headerLeft), this.left, 34, { lineBreak: false });
      const sec = normalize(this.pageSection.get(i) ?? '');
      if (sec) {
        let s = sec;
        while (s.length > 8 && this.width_('sans', 7.5, s) > this.width * 0.55) s = s.slice(0, -2);
        if (s !== sec) s = s.trimEnd() + '…';
        const w = this.width_('sans', 7.5, s);
        d.font('sans').fontSize(7.5).fillColor(C.muted).text(s, this.right - w, 34, { lineBreak: false });
      }
      d.moveTo(this.left, 46).lineTo(this.right, 46).lineWidth(0.4).strokeColor(C.rule).stroke();
      // footer
      d.moveTo(this.left, this.pageH - 42).lineTo(this.right, this.pageH - 42).lineWidth(0.4).strokeColor(C.rule).stroke();
      const label = `Page ${i + 1} of ${total}`;
      const w = this.width_('sans', 8, label);
      d.font('sans').fontSize(8).fillColor(C.muted).text(label, this.left + (this.width - w) / 2, this.pageH - 34, { lineBreak: false });
      d.font('sans').fontSize(7).fillColor(C.faint).text(normalize(this.opts.subtitle ?? ''), this.left, this.pageH - 33, { lineBreak: false });
      d.page.margins.bottom = savedBottom;
    }
  }

  /** Finish the document; resolves when the file has been fully written. */
  end(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stream.on('finish', () => resolve());
      this.stream.on('error', reject);
      this.doc.flushPages();
      this.doc.end();
    });
  }
}
