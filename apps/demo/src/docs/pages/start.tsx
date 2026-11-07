import install from '../../snippets/install.sh?code';
import nextLayout from '../../snippets/next/layout.tsx?code';
import nextPage from '../../snippets/next/page.tsx?code';
import ssr from '../../snippets/ssr.tsx?code';
import { Example, Snippet } from '../Code';
import { Note, Page, PropsTable, Section } from '../ui';

export function Introduction() {
  return (
    <Page
      title="Introduction"
      lead="calendar-kit is a React + TypeScript date selection component: single dates, ranges, multiple dates and read-only availability, with a headless rules engine underneath."
    >
      <Section title="What it does">
        <ul>
          <li>Selects dates: <code>single</code>, <code>range</code>, <code>multiple</code> and <code>readonly</code> modes.</li>
          <li>Validates selections with composable rules: bounds, past/future, minimum/maximum/fixed length, start and end weekdays, per-day availability and your own validators.</li>
          <li>Lays itself out from its container (not the window): several months, horizontal or vertical, paged or continuous with “show more dates”.</li>
          <li>Shows your data on days (labels, badges, icons, markers, tooltips) and lets you replace any part through slots, render props or CSS.</li>
          <li>Is keyboard and screen-reader accessible, localised through <code>Intl</code> and works with SSR.</li>
        </ul>
      </Section>
      <Section title="What stays in your app">
        <p>
          The package is selection-focused. Prices, totals, check-in/check-out times, guest counts and reservation logic are not part of it: your app owns
          that state, computes it and shows it through slots such as <code>renderFooter</code>. Business rules reach the calendar only as selectability (for
          example “this day can only be a check-out”). The calendar never fetches data: you report each month&apos;s loading status.
        </p>
      </Section>
      <Section title="Dates">
        <p>
          Dates are plain strings in <code>YYYY-MM-DD</code> form (type <code>CalendarDate</code>), months are <code>YYYY-MM</code> (<code>CalendarMonth</code>).
          There are no <code>Date</code> objects or time zones in the selection, so a value means the same calendar day on the server and in every browser.
        </p>
      </Section>
      <Section title="Supported environments">
        <ul>
          <li>React 18.2+ and 19 (peer dependencies); ESM only; no runtime dependencies.</li>
          <li>Next.js App Router through the <code>calendar-kit/client</code> and <code>calendar-kit/core</code> entry points (see React &amp; Next.js).</li>
          <li>
            Browsers: verified automatically in Google Chrome only. Safari, Firefox, real mobile devices and screen readers have not been tested yet — see{' '}
            <a href="#/testing">Testing &amp; Compatibility</a>.
          </li>
        </ul>
      </Section>
    </Page>
  );
}

export function Installation() {
  return (
    <Page title="Installation & Quick Start" lead="Install the package, import its stylesheet once and render a calendar.">
      <Section title="Install">
        <Note>
          <p>
            calendar-kit is <strong>not published to npm</strong> yet: its <code>package.json</code> is <code>&quot;private&quot;: true</code>, so{' '}
            <code>npm install calendar-kit</code> does not work. Install a tarball built from the repository:
          </p>
        </Note>
        <Snippet files={install} label="Install from a tarball" />
      </Section>
      <Section title="Styles">
        <p>
          The JavaScript never imports CSS. Import the default theme once, for example in your app entry or root layout:{' '}
          <code>import &apos;calendar-kit/styles.css&apos;</code>. It ships with type declarations, so TypeScript projects need no extra <code>*.css</code>{' '}
          declaration.
        </p>
      </Section>
      <Section title="First calendar">
        <p>A controlled range picker: the app keeps the value and derives the number of nights from it.</p>
        <Example src="start/QuickStart" title="Quick start" />
      </Section>
    </Page>
  );
}

export function ReactNext() {
  return (
    <Page title="React & Next.js" lead="One component, three import paths: pick the one that matches where your code runs.">
      <Section title="Entry points">
        <PropsTable
          caption="Import paths"
          rows={[
            { name: 'calendar-kit', type: <>everything</>, description: <>Calendar, helpers and types. No <code>&apos;use client&apos;</code> directive. Use it in plain React apps and inside your own Client Components.</> },
            { name: 'calendar-kit/client', type: "'use client'", description: <>The <code>Calendar</code> component and React types, marked as a Client Component boundary: a Server Component can render it directly.</> },
            { name: 'calendar-kit/core', type: <>no React</>, description: 'Date model, selection engine, rules, adapters and messages. Never loads React; safe in Server Components and non-React code.' },
            { name: 'calendar-kit/styles.css', type: 'CSS', description: 'The default theme (with a type declaration).' },
          ]}
        />
      </Section>
      <Section title="Plain React (Vite, CRA, …)">
        <p>
          Import from <code>calendar-kit</code> as in the <a href="#/installation">quick start</a>. Rendering on the client needs nothing else.
        </p>
      </Section>
      <Section title="Next.js App Router">
        <p>
          Import the stylesheet in <code>app/layout.tsx</code>. In a Server Component, render <code>Calendar</code> from <code>calendar-kit/client</code> and call
          helpers from <code>calendar-kit/core</code>. Props that are functions (rules, <code>onChange</code>, render props) cannot be passed from a server
          component; put that calendar in your own <code>&apos;use client&apos;</code> component.
        </p>
        <Snippet files={[...nextPage, ...nextLayout]} label="Next.js App Router" />
        <Note>
          <p>
            Rendering <code>Calendar</code> imported from <code>calendar-kit</code> (not <code>/client</code>) directly in a Server Component fails at build
            time with <code>useSyncExternalStore is not a function</code>. The root entry has no directive on purpose: with one, its pure helpers would become
            client references and could not be called on the server.
          </p>
        </Note>
      </Section>
      <Section title="SSR and hydration">
        <ul>
          <li>Importing the package changes no globals; rendering does not read <code>window</code> or <code>document</code>.</li>
          <li>
            Pass <code>today</code> (or <code>value</code>/<code>defaultVisibleMonth</code>) when rendering on the server: the server cannot know the user&apos;s
            date. With it, server HTML and hydration match. Without it, a placeholder is rendered and the client fills in the months.
          </li>
          <li>Locale defaults (week start, direction) come from static tables, so server and browser agree.</li>
          <li>Layout depends on the container width, which is only known in the browser; the first client render may change the number of columns.</li>
        </ul>
        <Snippet files={ssr} label="Server rendering" />
      </Section>
    </Page>
  );
}
