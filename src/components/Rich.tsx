import { useMemo, useState, type ReactNode } from 'react';
import { Check, Copy, Info, Lightbulb, AlertTriangle, HelpCircle, FlaskConical, FileText, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { parseInline } from '@/lib/inline';
import { tokenizeLines, resolveAnchor } from '@/lib/highlight';
import { getJavaSource, getJavaIO } from '@/lib/java-sources';
import type { Block, Program } from '@/lib/types';

export function Inline({ text }: { text: string }) {
  const parts = useMemo(() => parseInline(text), [text]);
  return (
    <>
      {parts.map((p, i) => {
        switch (p.k) {
          case 'b':
            return <strong key={i}>{p.s}</strong>;
          case 'i':
            return <em key={i}>{p.s}</em>;
          case 'code':
            return (
              <code key={i} className="inline">
                {p.s}
              </code>
            );
          case 'link':
            return (
              <a key={i} href={p.href} target="_blank" rel="noopener noreferrer">
                {p.s}
              </a>
            );
          default:
            return <span key={i}>{p.s}</span>;
        }
      })}
    </>
  );
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn-ghost btn-sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* clipboard blocked */
        }
      }}
    >
      {done ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? 'Copied' : label}
    </button>
  );
}

/** Syntax-highlighted code with line numbers; `highlight` lines get a coloured band. */
export function CodeView({ code, highlight, caption, title, actions, id }: { code: string; highlight?: [number, number] | null; caption?: string; title?: string; actions?: ReactNode; id?: string }) {
  const lines = useMemo(() => tokenizeLines(code), [code]);
  return (
    <figure className="my-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/70" id={id}>
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-100/70 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
        <span className="truncate font-mono text-xs text-slate-500">{title ?? 'Java'}</span>
        <div className="flex gap-1.5">
          {actions}
          <CopyButton text={code} />
        </div>
      </div>
      <pre className="overflow-x-auto py-2 font-mono text-[13px] leading-6" tabIndex={0}>
        <code>
          {lines.map((toks, i) => {
            const n = i + 1;
            const hl = highlight && n >= highlight[0] && n <= highlight[1];
            return (
              <div key={i} data-line={n} className={`flex px-0 ${hl ? 'code-line-hl' : ''}`}>
                <span className="w-10 shrink-0 select-none pr-3 text-right text-slate-400 dark:text-slate-600">{n}</span>
                <span className="whitespace-pre pr-4">
                  {toks.length === 0 ? ' ' : toks.map((t, j) => <span key={j} className={t.t === 'plain' ? undefined : `tok-${t.t}`}>{t.s}</span>)}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
      {caption && <figcaption className="border-t border-slate-200 px-3 py-1.5 text-xs text-slate-500 dark:border-slate-800">{caption}</figcaption>}
    </figure>
  );
}

const CALL: Record<string, { cls: string; icon: ReactNode; label: string }> = {
  tip: { cls: 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40', icon: <Lightbulb className="h-4 w-4 text-emerald-600" />, label: 'Tip' },
  warning: { cls: 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40', icon: <AlertTriangle className="h-4 w-4 text-amber-600" />, label: 'Watch out' },
  note: { cls: 'border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40', icon: <Info className="h-4 w-4 text-sky-600" />, label: 'Note' },
  why: { cls: 'border-indigo-300 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/40', icon: <HelpCircle className="h-4 w-4 text-indigo-600" />, label: 'Why' },
  example: { cls: 'border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/40', icon: <FlaskConical className="h-4 w-4 text-violet-600" />, label: 'Example' },
  source: { cls: 'border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-900', icon: <FileText className="h-4 w-4 text-slate-500" />, label: 'From the slides' },
};

export function Callout({ kind, title, text }: { kind: keyof typeof CALL; title?: string; text: string }) {
  const c = CALL[kind];
  return (
    <aside className={`my-4 rounded-xl border-l-4 border p-4 ${c.cls}`}>
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
        {c.icon}
        {title ?? c.label}
      </div>
      <div className="text-[15px] leading-7">
        <Inline text={text} />
      </div>
    </aside>
  );
}

export function DataTable({ headers, rows, caption }: { headers: string[]; rows: string[][]; caption?: string }) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="whitespace-nowrap px-3 py-2 font-semibold">
                <Inline text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-200 dark:border-slate-800">
              {r.map((c, j) => (
                <td key={j} className="px-3 py-2 align-top font-mono text-[13px]">
                  <Inline text={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <div className="border-t border-slate-200 px-3 py-1.5 text-xs text-slate-500 dark:border-slate-800">{caption}</div>}
    </div>
  );
}

export function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case 'p':
      return (
        <p>
          <Inline text={b.text} />
        </p>
      );
    case 'h':
      return (
        <h4 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <Inline text={b.text} />
        </h4>
      );
    case 'list': {
      const Tag = b.ordered ? 'ol' : 'ul';
      return (
        <Tag className={`my-3 space-y-1.5 pl-6 ${b.ordered ? 'list-decimal' : 'list-disc'} marker:text-slate-400`}>
          {b.items.map((it, i) => (
            <li key={i} className="leading-7">
              <Inline text={it} />
            </li>
          ))}
        </Tag>
      );
    }
    case 'callout':
      return <Callout kind={b.kind} title={b.title} text={b.text} />;
    case 'code':
      return <CodeView code={b.code} caption={b.caption} />;
    case 'program':
      return <ProgramInline file={b.file} caption={b.caption} />;
    case 'pre':
      return (
        <figure className="my-4">
          <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-[13px] leading-6 dark:border-slate-800 dark:bg-slate-900/70">{b.text}</pre>
          {b.caption && <figcaption className="mt-1 text-xs text-slate-500">{b.caption}</figcaption>}
        </figure>
      );
    case 'table':
      return <DataTable headers={b.headers} rows={b.rows} caption={b.caption} />;
    case 'math':
      return <div className="my-4 overflow-x-auto rounded-lg bg-slate-100 px-4 py-3 text-center font-mono text-[15px] dark:bg-slate-900">{b.text}</div>;
  }
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="lesson-prose">
      {blocks.map((b, i) => (
        <BlockView key={i} b={b} />
      ))}
    </div>
  );
}

function ProgramInline({ file, caption }: { file: string; caption?: string }) {
  let code = '';
  try {
    code = getJavaSource(file);
  } catch {
    return <Callout kind="warning" title="Missing program" text={`java/${file} was not found.`} />;
  }
  const io = getJavaIO(file);
  return (
    <div>
      <CodeView
        code={code}
        title={file.split('/').pop()}
        caption={caption}
        actions={
          <Link className="btn-primary btn-sm" to={`/playground?file=${encodeURIComponent(file)}`}>
            <Play className="h-3.5 w-3.5" />
            Run
          </Link>
        }
      />
      {io.out !== undefined && (
        <div className="-mt-2 mb-4 grid gap-3 sm:grid-cols-2">
          {io.in !== undefined && io.in.trim() && <IoBox title="Sample input" text={io.in} />}
          <IoBox title="Expected output" text={io.out} />
        </div>
      )}
    </div>
  );
}

export function IoBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800">
      <div className="border-b border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">{title}</div>
      <pre className="overflow-x-auto p-3 font-mono text-[13px] leading-5">{text.replace(/\n$/, '')}</pre>
    </div>
  );
}

/** A program with a walkthrough list whose items highlight the matching code lines. */
export function ProgramViewer({ program }: { program: Program }) {
  let code = '';
  try {
    code = getJavaSource(program.file);
  } catch {
    return <Callout kind="warning" title="Missing program" text={`java/${program.file} was not found.`} />;
  }
  const [active, setActive] = useState<number | null>(null);
  const io = getJavaIO(program.file);
  const anchors = useMemo(() => program.walkthrough.map((w) => resolveAnchor(code, w.at)), [program, code]);
  const hl = active !== null ? anchors[active] : null;
  const roleLabel = { tiny: 'Tiny example', simple: 'Simple solution', optimized: 'Optimized solution', demo: 'Demonstration', 'archive-original': 'Original from slides' }[program.role];
  return (
    <div className="my-6">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h4 className="text-base font-semibold">{program.title}</h4>
        <span className="chip bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{roleLabel}</span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">{program.description}</p>
      <CodeView
        code={code}
        highlight={hl}
        title={program.file.split('/').pop()}
        actions={
          <Link className="btn-primary btn-sm" to={`/playground?file=${encodeURIComponent(program.file)}`}>
            <Play className="h-3.5 w-3.5" />
            Open in playground
          </Link>
        }
      />
      {io.out !== undefined && (
        <div className="-mt-2 mb-4 grid gap-3 sm:grid-cols-2">
          {io.in !== undefined && io.in.trim() && <IoBox title="Sample input" text={io.in} />}
          <IoBox title="Expected output" text={io.out} />
        </div>
      )}
      {program.walkthrough.length > 0 && (
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Line-by-line walkthrough — click a note to highlight its line</div>
          <ol className="space-y-1.5">
            {program.walkthrough.map((w, i) => {
              const a = anchors[i];
              return (
                <li key={i}>
                  <button type="button" onClick={() => setActive(active === i ? null : i)} className={`w-full rounded-lg border px-3 py-2 text-left text-sm leading-6 transition-colors ${active === i ? 'border-brand-500 bg-brand-50 dark:bg-indigo-950/40' : 'border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900'}`}>
                    <span className="mr-2 rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[11px] dark:bg-slate-800">{a ? (a[0] === a[1] ? `line ${a[0]}` : `lines ${a[0]}–${a[1]}`) : 'line ?'}</span>
                    <Inline text={w.text} />
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
