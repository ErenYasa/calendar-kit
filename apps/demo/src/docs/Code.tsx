import { type ComponentType, Suspense, lazy, useEffect, useId, useRef, useState } from 'react';
import type files from '*?code';
import { useLang, useUi } from './i18n';

type CodeFiles = typeof files;

/** Code with file tabs, horizontal scroll and an accessible copy button. */
export function CodeTabs({ files, label }: { files: CodeFiles; label: string }) {
  const ui = useUi();
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const file = files[active] ?? files[0]!;

  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(null), 2000);
    return () => clearTimeout(t);
  }, [status]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(file.code);
      setStatus({ ok: true, text: ui.copiedStatus(file.name) });
    } catch {
      setStatus({ ok: false, text: ui.copyFailedStatus });
    }
  };

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? files.length - 1 : null;
    if (next == null) return;
    e.preventDefault();
    const n = (next + files.length) % files.length;
    setActive(n);
    tabs.current[n]?.focus();
  };

  return (
    <div className="docs-code">
      <div className="docs-code-bar">
        {files.length > 1 ? (
          <div role="tablist" aria-label={ui.filesLabel(label)} className="docs-code-tabs">
            {files.map((f, i) => (
              <button
                key={f.name}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`${id}-panel`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                {f.name}
              </button>
            ))}
          </div>
        ) : (
          <span className="docs-code-file">{file.name}</span>
        )}
        <button type="button" className="docs-button docs-copy" onClick={copy}>
          {ui.copy}
        </button>
        <span role="status" className="docs-sr-only">
          {status?.text}
        </span>
        {status && (
          <span className="docs-copy-status" aria-hidden="true">
            {status.ok ? ui.copied : ui.copyFailed}
          </span>
        )}
      </div>
      <pre
        id={`${id}-panel`}
        role={files.length > 1 ? 'tabpanel' : undefined}
        aria-labelledby={files.length > 1 ? `${id}-tab-${active}` : undefined}
        aria-label={files.length > 1 ? undefined : ui.sourceLabel(file.name)}
        tabIndex={0}
        className="docs-pre"
      >
        <code dangerouslySetInnerHTML={{ __html: file.html }} />
      </pre>
    </div>
  );
}

const components = import.meta.glob<{ default: ComponentType }>('../examples/**/*.tsx');
const sources = import.meta.glob<CodeFiles>('../examples/**/*.tsx', { query: '?code', import: 'default' });
const cache = new Map<string, ComponentType>();

/** The example file for the docs language: `Name.tr.tsx` in Turkish, `Name.tsx` otherwise. */
function exampleKey(src: string, lang: string) {
  const key = `../examples/${src}.tsx`;
  const localized = `../examples/${src}.${lang}.tsx`;
  return lang !== 'en' && components[localized] ? localized : key;
}

function exampleComponent(key: string) {
  if (!components[key]) throw new Error(`Unknown example ${key}`);
  if (!cache.has(key)) cache.set(key, lazy(components[key] as () => Promise<{ default: ComponentType }>));
  return cache.get(key)!;
}

/**
 * A live example and its source. `src` is the file under src/examples
 * (without `.tsx`); the component is its default export and the code shown is
 * that same file plus the local files it imports. Both load only when the
 * example is rendered; the code only when "View code" is opened.
 */
export function Example({ src, title }: { src: string; title: string }) {
  const lang = useLang();
  const ui = useUi();
  const key = exampleKey(src, lang);
  const Component = exampleComponent(key);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<CodeFiles | null>(null);
  const id = `ex-${src.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;

  useEffect(() => {
    if (!open || files) return;
    let live = true;
    void sources[key]!().then((f) => live && setFiles(f));
    return () => {
      live = false;
    };
  }, [open, files, key]);

  return (
    <figure className="docs-example" id={id} aria-label={title}>
      <div className="docs-preview">
        <Suspense fallback={<p className="docs-muted">{ui.loadingExample}</p>}>
          <Component />
        </Suspense>
      </div>
      <div className="docs-example-bar">
        {lang !== 'en' && key === `../examples/${src}.tsx` && <span className="docs-untranslated">{ui.untranslatedExample}</span>}
        <button type="button" className="docs-button" aria-expanded={open} aria-controls={`${id}-code`} onClick={() => setOpen((o) => !o)}>
          {open ? ui.hideCode : ui.viewCode}
        </button>
      </div>
      <div id={`${id}-code`} hidden={!open}>
        {open && (files ? <CodeTabs files={files} label={title} /> : <p className="docs-muted docs-pad">{ui.loadingCode}</p>)}
      </div>
    </figure>
  );
}

/** A code block that is not a live example (install commands, framework files). */
export function Snippet({ files, label }: { files: CodeFiles; label: string }) {
  return <CodeTabs files={files} label={label} />;
}
