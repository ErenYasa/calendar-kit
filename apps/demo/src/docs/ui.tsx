import { type ReactNode, useEffect, useRef } from 'react';
import { useUi } from './i18n';

// Set by the router when the user navigated: the next page to mount moves
// focus to its heading (pages load lazily, so the router cannot do it).
let focusOnMount = false;
export const requestPageFocus = () => {
  focusOnMount = true;
};

/**
 * A string `name`, `type` or `default` is an API value and is shown as code;
 * pass JSX (e.g. `<>from locale</>`) for prose, which is translated.
 */
export interface PropRow {
  name: ReactNode;
  type: ReactNode;
  default?: ReactNode;
  required?: boolean;
  description: ReactNode;
}

const codeOrProse = (v: ReactNode, className?: string) => (typeof v === 'string' ? <code className={className}>{v}</code> : v);

/** Props / options table: name, type, default, required, description. */
export function PropsTable({ rows, caption }: { rows: readonly PropRow[]; caption?: string }) {
  const ui = useUi();
  return (
    <div className="docs-table-wrap" tabIndex={0} role="region" aria-label={caption ?? ui.propsCaption}>
      <table className="docs-table">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            <th scope="col">{ui.colName}</th>
            <th scope="col">{ui.colType}</th>
            <th scope="col">{ui.colDefault}</th>
            <th scope="col">{ui.colDescription}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <th scope="row">
                <div className="docs-cell-limit">
                  {codeOrProse(r.name)}
                  {r.required && <span className="docs-required"> {ui.required}</span>}
                </div>
              </th>
              <td>
                <div className="docs-cell-limit">
                  {codeOrProse(r.type, 'docs-type')}
                </div>
              </td>
              <td>{r.default ? codeOrProse(r.default) : <span className="docs-muted">—</span>}</td>
              <td>{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A plain table with its own column headings (measurements, comparisons). */
export function DataTable({ head, rows, caption }: { head: readonly string[]; rows: readonly (readonly ReactNode[])[]; caption: string }) {
  return (
    <div className="docs-table-wrap" tabIndex={0} role="region" aria-label={caption}>
      <table className="docs-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) =>
                j === 0 ? (
                  <th key={j} scope="row">
                    <div className="docs-cell-limit">{c}</div>
                  </th>
                ) : (
                  <td key={j}>{c}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <div className="docs-note">{children}</div>;
}

/** Page shell: title, lead paragraph, content. */
export function Page({ title, lead, children }: { title: string; lead: ReactNode; children: ReactNode }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!focusOnMount) return;
    focusOnMount = false;
    heading.current?.focus({ preventScroll: true });
  }, []);
  return (
    <article className="docs-page">
      <h1 ref={heading} tabIndex={-1} id="page-title">
        {title}
      </h1>
      <p className="docs-lead">{lead}</p>
      {children}
    </article>
  );
}

/** One feature: name, purpose, live example(s), then props and behaviour notes. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  // Turkish titles: ı → i and accents dropped, so ids stay ASCII (e.g. "Seçim modları" → "secim-modlari").
  const id = title
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return (
    <section className="docs-section" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  );
}
