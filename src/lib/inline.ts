// Inline markup used inside lesson text:  **bold**  *italic*  `code`  [label](https://url)
// Pure TypeScript (no React) so the website and the PDF generator share one parser.
export type Inline =
  | { k: 'text'; s: string }
  | { k: 'b'; s: string }
  | { k: 'i'; s: string }
  | { k: 'code'; s: string }
  | { k: 'link'; s: string; href: string };

const RE = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*\s][^*]*?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(text))) {
    if (m.index > last) out.push({ k: 'text', s: text.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ k: 'code', s: m[1] });
    else if (m[2] !== undefined) out.push({ k: 'b', s: m[2] });
    else if (m[3] !== undefined) out.push({ k: 'i', s: m[3] });
    else out.push({ k: 'link', s: m[4], href: m[5] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ k: 'text', s: text.slice(last) });
  return out;
}

export function stripInline(text: string): string {
  return parseInline(text)
    .map((i) => i.s)
    .join('');
}
