import { Suspense, useEffect, useRef, useState } from 'react';
import { LangContext, type Lang, UI, readStoredLang, storeLang } from './i18n';
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
  // English on the first visit; the choice is stored. Switching keeps the page.
  const [lang, setLang] = useState<Lang>(readStoredLang);
  const ui = UI[lang];
  const PageComponent = page.Component[lang];
  const chooseLang = (l: Lang) => {
    setLang(l);
    storeLang(l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `${page.title[lang]} — ${ui.docTitleSuffix}`;
  }, [page, lang, ui]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [page]);

  // Navigation closes the menu synchronously with the hash change (a passive
  // effect after the render could run late and close a menu reopened meanwhile).
  useEffect(() => {
    const onHash = () => setMenuOpen(false);
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    menuButton.current?.focus({ preventScroll: true }); // keep the page where it was
  };

  // Open mobile menu: the page behind it does not scroll (its scroll position
  // is kept), focus moves into the menu, Escape closes it. The previous inline
  // overflow value is restored on close/unmount.
  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    // Focus the current page's link without scrolling the page; scroll only the menu.
    const nav = document.getElementById('docs-nav')!;
    const link = nav.querySelector<HTMLElement>('[aria-current="page"]') ?? nav.querySelector<HTMLElement>('a')!;
    link.focus({ preventScroll: true });
    nav.scrollTop = Math.max(0, link.offsetTop - nav.clientHeight / 2);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeMenu();
    addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previous;
      removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <LangContext.Provider value={lang}>
    <div className="docs-app">
      <a className="docs-skip" href="#main" onClick={(e) => (e.preventDefault(), document.getElementById('page-title')?.focus())}>
        {ui.skipToContent}
      </a>
      <header className="docs-header">
        <a className="docs-brand" href="#/introduction">
          calendar-kit
        </a>
        <span className="docs-muted docs-version">{ui.version}</span>
        <div className="docs-lang" role="group" aria-label={ui.languageLabel}>
          {(
            [
              ['en', 'EN', 'English'],
              ['tr', 'TR', 'Türkçe'],
            ] as const
          ).map(([l, short, name]) => (
            <button key={l} type="button" className="docs-lang-button" lang={l} aria-label={name} aria-pressed={lang === l} onClick={() => chooseLang(l)}>
              {short}
            </button>
          ))}
        </div>
        <button
          ref={menuButton}
          type="button"
          className="docs-button docs-menu-button"
          aria-expanded={menuOpen}
          aria-controls="docs-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? ui.closeMenu : ui.menu}
        </button>
      </header>
      <div className="docs-layout">
        <div className="docs-backdrop" data-open={menuOpen || undefined} onClick={closeMenu} aria-hidden="true" />
        <nav id="docs-nav" className="docs-nav" data-open={menuOpen || undefined} aria-label={ui.navLabel}>
          {NAV.map((group) => (
            <div key={group.title.en} className="docs-nav-group">
              <h2 className="docs-nav-title">{group.title[lang]}</h2>
              <ul>
                {group.pages.map((p) => (
                  <li key={p.slug}>
                    <a href={`#/${p.slug}`} aria-current={p.slug === slug ? 'page' : undefined}>
                      {p.title[lang]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <main id="main" className="docs-main">
          <div key={`${lang}:${slug}`} data-page={slug} data-lang={lang}>
            <Suspense fallback={<p className="docs-muted">{ui.loadingPage}</p>}>
              <PageComponent />
            </Suspense>
          </div>
          <nav className="docs-pager" aria-label={ui.pagerLabel}>
            {prev ? <a href={`#/${prev.slug}`}>← {prev.title[lang]}</a> : <span />}
            {next ? <a href={`#/${next.slug}`}>{next.title[lang]} →</a> : <span />}
          </nav>
        </main>
      </div>
    </div>
    </LangContext.Provider>
  );
}
