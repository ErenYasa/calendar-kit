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
      <Section title="Features at a glance">
        <ul>
          <li>
            Four selection modes: one date (<code>single</code>), a start and end date (<code>range</code>), any number of separate dates (
            <code>multiple</code>), or no selection at all, only showing availability (<code>readonly</code>).
          </li>
          <li>
            Rules decide which days can be picked and which selections are valid: earliest and latest date, no past or no future days, minimum, maximum or
            fixed length, allowed start and end weekdays, per-day availability from your data and your own checks.
          </li>
          <li>
            The layout adapts to the width of its container, not of the window: several months side by side or stacked, either paged with arrows or as a
            continuous list that loads more months with a “show more dates” button.
          </li>
          <li>
            Days can show your data: labels such as prices, badges, icons, markers and tooltips (the small box that opens when a day is hovered or focused).
            Any part can be replaced through slots and render props (functions you pass that return the JSX for that part, for example{' '}
            <code>renderFooter</code>) or restyled with CSS.
          </li>
          <li>
            Works with the keyboard and screen readers, formats dates and texts for any locale through the browser&apos;s <code>Intl</code> API, and can be
            rendered on the server (SSR).
          </li>
        </ul>
      </Section>
      <Section title="What the calendar does and what your app does">
        <ul>
          <li>
            <strong>The calendar</strong> shows the months, lets the user pick dates and applies the rules your app gives it. For example, a day that your
            data marks with the <code>&apos;check-out-only&apos;</code> status in <code>stayRules</code> can be picked as a check-out date but not as a
            check-in date. The calendar never fetches data and never stores a booking.
          </li>
          <li>
            <strong>Your app</strong> fetches availability from its own API and passes it to the calendar as functions: a status per day through{' '}
            <code>getDayStatus</code> in <code>stayRules</code> or <code>dayRangeRules</code>, or <code>getDayAvailability</code> in your own rules (
            <a href="#/api-rules">Rules &amp; adapters</a>). <code>onRenderedMonthsChange</code> tells your app which months are on screen, so it knows what
            to fetch; <code>getDataStatus</code> tells the calendar which months are not ready yet (<code>&apos;loading&apos;</code>,{' '}
            <code>&apos;unknown&apos;</code> or <code>&apos;error&apos;</code>), and their days cannot be picked until the data arrives (
            <a href="#/loading">Loading &amp; errors</a>). Prices, check-in and check-out times, the guest count and creating the reservation are also your
            app&apos;s job. To show something your app calculated, such as a total price, under the calendar, use <code>renderFooter</code>.
          </li>
        </ul>
        <p>
          <strong>Example:</strong> in a home booking the user picks the dates in the calendar. The app calculates the total price for the selected range,
          shows it with <code>renderFooter</code> and creates the reservation when the user confirms (<a href="#/recipe-home-rental">Home rental example</a>).
        </p>
      </Section>
      <Section title="Dates">
        <p>
          Dates are plain strings in <code>YYYY-MM-DD</code> form (type <code>CalendarDate</code>), months are <code>YYYY-MM</code> (<code>CalendarMonth</code>).
          The selection contains no <code>Date</code> objects and no time zone, so <code>&quot;2026-11-13&quot;</code> is 13 November on the server and in
          every browser, whatever the user&apos;s time zone. See <a href="#/core-concepts">Core concepts</a> for creating and checking dates.
        </p>
      </Section>
      <Section title="Supported environments">
        <ul>
          <li>React 18.2+ and 19 (peer dependencies); ESM only; no runtime dependencies.</li>
          <li>
            Next.js App Router through the <code>calendar-kit/client</code> and <code>calendar-kit/core</code> entry points (see{' '}
            <a href="#/react-nextjs">React &amp; Next.js</a>).
          </li>
          <li>
            Browsers: the automated tests run in Google Chrome only. Safari, Firefox, real mobile devices and screen readers have not been tested yet — see{' '}
            <a href="#/testing">Testing &amp; compatibility</a>.
          </li>
        </ul>
      </Section>
    </Page>
  );
}

export function Installation() {
  return (
    <Page title="Installation & quick start" lead="Install the package, import its stylesheet once and render a calendar.">
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
          The package&apos;s JavaScript does not import any CSS, so the calendar has no styles until you import the default theme. Import it once, for
          example in your app entry file or root layout: <code>import &apos;calendar-kit/styles.css&apos;</code>. The file ships with a type declaration, so
          TypeScript projects need no extra <code>*.css</code> declaration. To change colours and sizes, see <a href="#/styling">Styling &amp; customization</a>.
        </p>
      </Section>
      <Section title="First calendar">
        <p>
          A two-month calendar for picking a stay. It is <strong>controlled</strong>: your component keeps the selected range in its own state and passes it
          as <code>value</code>, and the calendar reports every new selection through <code>onChange</code>, which updates that state. Because the range is
          in your state, the text below the calendar can show the number of nights, calculated with <code>countNights</code>. <code>stayRules()</code>{' '}
          makes the end date the check-out day, so it is not counted as a night: click a start date, then an end date, and watch the text.
        </p>
        <Example src="start/QuickStart" title="Quick start" />
      </Section>
    </Page>
  );
}

export function ReactNext() {
  return (
    <Page title="React & Next.js" lead="One component, three import paths: pick the one that matches where your code runs.">
      <Section title="Which import path to use">
        <p>
          In a plain React app every file runs in the browser, so <code>calendar-kit</code> is all you need. The Next.js App Router has two kinds of
          components: a <strong>Server Component</strong> runs only on the server and cannot hold state or event handlers; a <strong>Client Component</strong>{' '}
          (a file that starts with <code>&apos;use client&apos;</code>) also runs in the browser. The other paths exist for that split.
        </p>
        <PropsTable
          caption="Import paths"
          rows={[
            { name: 'calendar-kit', type: <>everything</>, description: <>Calendar, helpers and types, without a <code>&apos;use client&apos;</code> directive. Use it in plain React apps and inside your own Client Components.</> },
            { name: 'calendar-kit/client', type: "'use client'", description: <>The <code>Calendar</code> component and React types, marked as a Client Component. A Server Component can render this calendar directly, as long as it passes no functions as props.</> },
            { name: 'calendar-kit/core', type: <>no React</>, description: 'Date helpers, selection engine, rules, adapters and messages, without React. Call them in Server Components, API routes and other non-React code.' },
            { name: 'calendar-kit/styles.css', type: 'CSS', description: 'The default theme (with a type declaration).' },
          ]}
        />
      </Section>
      <Section title="Plain React (Vite, CRA, …)">
        <p>
          Import everything from <code>calendar-kit</code>, as in the <a href="#/installation">quick start</a>. Nothing else is needed when the calendar is
          rendered only in the browser.
        </p>
      </Section>
      <Section title="Next.js App Router">
        <p>
          Import the stylesheet in <code>app/layout.tsx</code>. In a Server Component, render <code>Calendar</code> from <code>calendar-kit/client</code> and call
          helpers from <code>calendar-kit/core</code>. A Server Component cannot pass functions as props, so a calendar that needs rules,{' '}
          <code>onChange</code> or render props goes into your own <code>&apos;use client&apos;</code> component (<code>BookingCalendar</code> below), which
          the page renders.
        </p>
        <Snippet files={[...nextPage, ...nextLayout]} label="Next.js App Router" />
        <Note>
          <p>
            If a Server Component renders <code>Calendar</code> imported from <code>calendar-kit</code> (instead of <code>/client</code>), the build fails with{' '}
            <code>useSyncExternalStore is not a function</code>. The root entry has no <code>&apos;use client&apos;</code> directive on purpose: with it, its helpers
            such as <code>addDays</code> would become client references and could not be called on the server.
          </p>
        </Note>
      </Section>
      <Section title="SSR and hydration">
        <ul>
          <li>Importing the package changes no global objects, and rendering does not read <code>window</code> or <code>document</code>, so it runs on a server.</li>
          <li>
            The server does not know the user&apos;s date. Pass <code>today</code> (or a <code>value</code> or <code>defaultVisibleMonth</code>) so the server
            HTML already shows the right months and React can take it over in the browser without a mismatch (hydration). Without it, the server renders an
            empty placeholder and the months appear once the page runs in the browser.
          </li>
          <li>The locale defaults (first day of the week, text direction) come from built-in tables, not from the browser, so server and browser agree.</li>
          <li>
            The layout depends on the container width, which only the browser knows. After hydration the calendar may therefore switch to fewer or more
            columns of months.
          </li>
        </ul>
        <Snippet files={ssr} label="Server rendering" />
      </Section>
    </Page>
  );
}
