// Minimal Java tokenizer shared by the website and the PDF generator.
export type TokType = 'comment' | 'string' | 'number' | 'keyword' | 'type' | 'annotation' | 'method' | 'plain';
export interface Tok {
  t: TokType;
  s: string;
}

const KEYWORDS = new Set(
  'abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while var record true false null'.split(' '),
);

/** Tokenise Java source into coloured spans; newlines are kept inside tokens' text. */
export function tokenizeJava(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  const n = src.length;
  const push = (t: TokType, s: string) => {
    if (!s) return;
    const prev = out[out.length - 1];
    if (prev && prev.t === t && t === 'plain') prev.s += s;
    else out.push({ t, s });
  };
  while (i < n) {
    const c = src[i];
    const two = src.slice(i, i + 2);
    if (two === '//') {
      let j = src.indexOf('\n', i);
      if (j < 0) j = n;
      push('comment', src.slice(i, j));
      i = j;
    } else if (two === '/*') {
      let j = src.indexOf('*/', i + 2);
      j = j < 0 ? n : j + 2;
      push('comment', src.slice(i, j));
      i = j;
    } else if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && src[j] !== c && src[j] !== '\n') {
        if (src[j] === '\\') j++;
        j++;
      }
      push('string', src.slice(i, Math.min(j + 1, n)));
      i = Math.min(j + 1, n);
    } else if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] ?? ''))) {
      let j = i + 1;
      while (j < n && /[0-9a-fA-FxXbB_.LlfFdD]/.test(src[j])) j++;
      push('number', src.slice(i, j));
      i = j;
    } else if (/[A-Za-z_$]/.test(c)) {
      let j = i + 1;
      while (j < n && /[A-Za-z0-9_$]/.test(src[j])) j++;
      const w = src.slice(i, j);
      if (KEYWORDS.has(w)) push('keyword', w);
      else if (src[j] === '(') push('method', w);
      else if (/^[A-Z]/.test(w)) push('type', w);
      else push('plain', w);
      i = j;
    } else if (c === '@') {
      let j = i + 1;
      while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
      push('annotation', src.slice(i, j));
      i = j;
    } else {
      push('plain', c);
      i++;
    }
  }
  return out;
}

/** Split tokens into lines (each line is a list of tokens) for line-numbered rendering. */
export function tokenizeLines(src: string): Tok[][] {
  const lines: Tok[][] = [[]];
  for (const tok of tokenizeJava(src)) {
    const parts = tok.s.split('\n');
    parts.forEach((part, idx) => {
      if (idx > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ t: tok.t, s: part });
    });
  }
  return lines;
}

/** Find the 1-based line range a walkthrough anchor refers to. Returns null when it can't be resolved. */
export function resolveAnchor(code: string, at: string): [number, number] | null {
  const lines = code.split('\n');
  const num = at.match(/^(\d+)(?:-(\d+))?$/);
  if (num) {
    const a = +num[1];
    const b = num[2] ? +num[2] : a;
    return a >= 1 && b <= lines.length && a <= b ? [a, b] : null;
  }
  const idx = lines.findIndex((l) => l.includes(at));
  return idx < 0 ? null : [idx + 1, idx + 1];
}
