import { type ReactNode, useEffect, useRef } from 'react';

// Set by the router when the user navigated: the next page to mount moves
// focus to its heading (pages load lazily, so the router cannot do it).
let focusOnMount = false;
export const requestPageFocus = () => {
  focusOnMount = true;
};

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: ReactNode;
}

/** Props / options table: name, type, default, required, description. */
export function PropsTable({ rows, caption }: { rows: readonly PropRow[]; caption?: string }) {
  return (
    <div className="docs-table-wrap" tabIndex={0} role="region" aria-label={caption ?? 'Props'}>
      <table className="docs-table">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <th scope="row">
                <code>{r.name}</code>
                {r.required && <span className="docs-required"> required</span>}
              </th>
              <td>
                <code className="docs-type">{r.type}</code>
              </td>
              <td>{r.default ? <code>{r.default}</code> : <span className="docs-muted">—</span>}</td>
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
              {r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}
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
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return (
    <section className="docs-section" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  );
}
