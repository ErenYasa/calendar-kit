import { Suspense, useEffect, useRef, useState } from 'react';
import { NAV, PAGES } from './nav';
import { requestPageFocus } from './ui';

const slugFromHash = () => {
  const slug = location.hash.replace(/^#\/?/, '');
  return PAGES.some((p) => p.slug === slug) ? slug : PAGES[0]!.slug;
};

/** Hash routing (`#/tooltip`) keeps the static Vercel deployment free of rewrites. */
function useSlug() {
  const [slug, setSlug] = useState(slugFromHash);
  useEffect(() => {
    const onHash = () => {
      requestPageFocus(); // the user navigated: focus the new page's heading once it mounts
      setSlug(slugFromHash());
    };
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);
  return slug;
}

export function App() {
  const slug = useSlug();
  const page = PAGES.find((p) => p.slug === slug)!;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const first = useRef(true);
  const index = PAGES.indexOf(page);
  const prev = PAGES[index - 1];
  const next = PAGES[index + 1];

  useEffect(() => {
    document.title = `${page.title} — calendar-kit`;
    setMenuOpen(false);
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      menuButton.current?.focus();
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <div className="docs-app">
      <a className="docs-skip" href="#main" onClick={(e) => (e.preventDefault(), document.getElementById('page-title')?.focus())}>
        Skip to content
      </a>
      <header className="docs-header">
        <a className="docs-brand" href="#/introduction">
          calendar-kit
        </a>
        <span className="docs-muted docs-version">0.1.0 · not published</span>
        <button
          ref={menuButton}
          type="button"
          className="docs-button docs-menu-button"
          aria-expanded={menuOpen}
          aria-controls="docs-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? 'Close menu' : 'Menu'}
        </button>
      </header>
      <div className="docs-layout">
        <nav id="docs-nav" className="docs-nav" data-open={menuOpen || undefined} aria-label="Documentation">
          {NAV.map((group) => (
            <div key={group.title} className="docs-nav-group">
              <h2 className="docs-nav-title">{group.title}</h2>
              <ul>
                {group.pages.map((p) => (
                  <li key={p.slug}>
                    <a href={`#/${p.slug}`} aria-current={p.slug === slug ? 'page' : undefined}>
                      {p.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <main id="main" className="docs-main">
          <Suspense fallback={<p className="docs-muted">Loading…</p>}>
            <page.Component />
          </Suspense>
          <nav className="docs-pager" aria-label="Previous and next page">
            {prev ? <a href={`#/${prev.slug}`}>← {prev.title}</a> : <span />}
            {next ? <a href={`#/${next.slug}`}>{next.title} →</a> : <span />}
          </nav>
        </main>
      </div>
    </div>
  );
}
