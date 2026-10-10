import { useRef } from 'react';

/** Plain textarea editor with Tab → 4 spaces, auto-indent on Enter and a line-number gutter. */
export function CodeEditor({ value, onChange, fontSize = 14, minRows = 14 }: { value: string; onChange: (v: string) => void; fontSize?: number; minRows?: number }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const lines = Math.max(minRows, value.split('\n').length + 1);
  return (
    <div className="flex overflow-hidden rounded-xl border border-slate-300 bg-white font-mono dark:border-slate-700 dark:bg-slate-950" style={{ fontSize }}>
      <div aria-hidden className="select-none border-r border-slate-200 bg-slate-50 px-2 py-3 text-right text-slate-400 dark:border-slate-800 dark:bg-slate-900" style={{ lineHeight: 1.6 }}>
        {Array.from({ length: lines }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={ref}
        value={value}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-label="Java code editor"
        className="min-w-0 flex-1 resize-none bg-transparent py-3 pl-3 pr-3 outline-none"
        style={{ lineHeight: 1.6, minHeight: `${lines * 1.6}em`, overflow: 'hidden', whiteSpace: 'pre', tabSize: 4 }}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          const t = e.currentTarget;
          if (e.key === 'Tab') {
            e.preventDefault();
            const s = t.selectionStart;
            onChange(value.slice(0, s) + '    ' + value.slice(t.selectionEnd));
            requestAnimationFrame(() => t.setSelectionRange(s + 4, s + 4));
          } else if (e.key === 'Enter') {
            const s = t.selectionStart;
            const lineStart = value.lastIndexOf('\n', s - 1) + 1;
            const indent = value.slice(lineStart, s).match(/^\s*/)?.[0] ?? '';
            const extra = value[s - 1] === '{' ? '    ' : '';
            e.preventDefault();
            const ins = '\n' + indent + extra;
            onChange(value.slice(0, s) + ins + value.slice(t.selectionEnd));
            requestAnimationFrame(() => t.setSelectionRange(s + ins.length, s + ins.length));
          }
        }}
      />
    </div>
  );
}
