import migration from '../../snippets/migration.tsx?code';
import { Snippet } from '../Code';
import { DataTable, Note, Page, PropsTable, Section } from '../ui';

export function Testing() {
  return (
    <Page title="Testing & compatibility" lead="What is checked, where it runs, and what has not been verified yet.">
      <Section title="Commands">
        <PropsTable
          rows={[
            { name: 'npm run check', type: <>all</>, description: 'Typecheck, package build, package + demo tests, SSR smoke test of the built package.' },
            { name: 'npm run typecheck', type: <>types</>, description: 'Library source without ambient types, package tests/config with Node types, demo (including every docs example) and its Vite config.' },
            { name: 'npm test', type: <>unit</>, description: 'Vitest + jsdom for the package and the demo.' },
            { name: 'npm run test:browser', type: <>browser</>, description: 'Regression checks on the docs site: CSS cascade, layout, tooltip position, loading states, dialogs and popovers. Runs in the installed Google Chrome by default; BROWSER_CHANNEL=msedge uses Microsoft Edge, BROWSER_ENGINE=firefox or webkit uses the Playwright Firefox or WebKit build.' },
            { name: 'npm run smoke:ssr -w calendar-kit', type: 'SSR', description: 'Imports the built package (dist) through its exports field, the way an app does, and renders a calendar on the server.' },
            { name: 'npm run size', type: <>bundle</>, description: 'Bundle sizes: minified, gzip and brotli.' },
            { name: 'npm run perf', type: <>timing</>, description: 'Interaction timings in Chrome, optionally with a slowed-down CPU (CPU throttling).' },
          ]}
        />
      </Section>
      <Section title="Test groups">
        <ul>
          <li>Date model and arithmetic (time-zone and DST safe), selection engine and rules.</li>
          <li>Calendar behaviour in jsdom: modes, keyboard, focus, events and their order, loading, tooltips, layout decisions, render counts.</li>
          <li>Regression tests for every fixed verification finding (see <code>docs/verification-findings.md</code>).</li>
          <li>Stylesheet cascade (specificity of focus, today, loading placeholder and reduced-motion rules) on the compiled CSS.</li>
          <li>Package: export targets present in <code>npm pack</code>, build output (<code>&apos;use client&apos;</code> kept, core without React), declarations under node16/nodenext/bundler.</li>
          <li>Docs: every example uses only the public entry points and only shows files that exist.</li>
        </ul>
      </Section>
      <Section title="Continuous integration">
        <p>
          GitHub Actions runs on pull requests and on pushes to <code>development</code> and <code>master</code> (Node 22, <code>npm ci</code>): typecheck, builds,
          tests and the SSR smoke test. Separate jobs run the browser checks in Google Chrome installed by the workflow and in the Playwright Firefox and WebKit
          builds on Linux. These Playwright builds are not the Firefox and Safari apps.
        </p>
      </Section>
      <Section title="Verified only locally">
        <ul>
          <li>The packed tarball in clean consumer apps: Vite + React 19, Vite + React 18, Next.js App Router (server page with <code>calendar-kit/client</code>, core helpers on the server), plain TypeScript (bundler, node16, nodenext).</li>
          <li>Interaction performance measurements (macOS, Chrome).</li>
          <li>
            <strong>Real Safari 26.6.2</strong> on macOS 26.6.2 (2026-11-24): 9 of 9 usage checks passed in a one-off run with real mouse and keyboard
            events (safaridriver): single and range selection, tooltip by mouse and keyboard, closing the modal and popover examples with focus back on
            their trigger, loading earlier and later months, and the <code>maxRenderedMonths</code> bound with focus kept on a shown day.
          </li>
          <li>Screen reader: VoiceOver with Safari 26.6.2 on macOS 26.6.2 (see <a href="#/accessibility">Keyboard &amp; accessibility</a>).</li>
          <li>
            <strong>Playwright WebKit 27.2</strong> and Playwright Firefox 157 builds on macOS: browser checks 21 of 21 (and in CI on Linux). This is a
            separate result from the Safari one above: a Playwright WebKit build is not Safari.
          </li>
          <li>Microsoft Edge 157 on macOS: browser checks 21 of 21.</li>
        </ul>
      </Section>
      <Section title="Not verified yet">
        <Note>
          <p>
            Real iPhone Safari and other real mobile devices (touch) have not been tested yet; neither Playwright WebKit nor touch emulation in Chrome
            counts as a device result. The Firefox app (as opposed to the Playwright build) and Safari versions other than 26.6.2 have not been tested.
            Screen readers: iOS VoiceOver, NVDA, JAWS and TalkBack have not been tested (see <a href="#/accessibility">Keyboard &amp; accessibility</a>).
            The stylesheet needs container query units and <code>color-mix()</code>, so browsers older than roughly Chrome/Edge 111, Safari 16.2 and
            Firefox 113 are not expected to work.
          </p>
        </Note>
      </Section>
    </Page>
  );
}

export function Performance() {
  return (
    <Page title="Performance" lead="Measured numbers from the repository's own scripts. Re-run them on your hardware; these are not guarantees.">
      <Section title="Bundle size">
        <p>
          <code>npm run size</code>, minified with rolldown, React excluded. Last recorded in the README (November 2026):
        </p>
        <DataTable
          caption="Bundle size"
          head={['Bundle', 'min', 'gzip', 'brotli']}
          rows={[
            ['Typical: Calendar + stayRules + messagesTr', '58.7 kB', '20.2 kB', '18.4 kB'],
            ['Everything (export *)', '68.7 kB', '23.6 kB', '21.0 kB'],
            ['Core only (engine + adapter + dates)', '8.5 kB', '3.1 kB', '2.9 kB'],
            ['styles.css', '9.4 kB', '2.6 kB', '2.2 kB'],
          ]}
        />
      </Section>
      <Section title="Interactions">
        <p>
          <code>npm run perf</code> builds a page that contains only the calendar inside a React Profiler (production profiling build) and drives the system
          Chrome with real mouse and keyboard input, optionally with CPU throttling. Measured on an Apple M5 Pro (macOS 26.6, Chrome 156); medians in ms.
          “render” is the calendar&apos;s React Profiler <code>actualDuration</code>, summed over all commits of one interaction; “processing” is from event dispatch until React has updated the DOM.
        </p>
        <DataTable
          caption="Median render · processing (ms)"
          head={['Months / days', 'CPU', 'Start click', 'Hover', 'End click', 'Arrow key', 'Next month']}
          rows={[
            ['2 / 61', '1×', '1.8 · 1.2', '0.9 · 2.0', '2.2 · 1.4', '0.7 · 2.0', '1.5 · 1.8'],
            ['2 / 61', '4× slower', '3.7 · 2.5', '1.6 · 3.0', '4.6 · 2.4', '1.0 · 2.9', '3.4 · 3.7'],
            ['2 / 61', '6× slower', '6.0 · 3.9', '2.1 · 4.4', '6.6 · 3.8', '2.0 · 4.3', '5.1 · 6.6'],
            ['12 / 365', '1×', '5.9 · 2.7', '2.5 · 4.1', '9.5 · 3.9', '1.8 · 2.8', '4.2 · 4.8'],
            ['12 / 365', '4× slower', '17.5 · 6.9', '5.1 · 8.1', '21.9 · 7.3', '4.2 · 7.1', '9.0 · 10.9'],
            ['12 / 365', '6× slower', '24.9 · 10.3', '7.3 · 12.3', '33.7 · 12.0', '7.3 · 10.9', '13.7 · 17.2'],
          ]}
        />
        <p>
          For 1–3 months, rendering and processing stay under one frame (16 ms) even with a 6× slower CPU. Twelve months (365 days) on a 4–6× slower CPU exceed a
          frame on clicks; for long lists prefer <code>navigation=&quot;continuous&quot;</code> with a small <code>maxRenderedMonths</code>.
        </p>
      </Section>
      <Section title="Limits">
        <ul>
          <li>Continuous mode bounds the DOM by dropping whole months; there is no virtualization (measurements did not call for it).</li>
          <li>The hover preview recomputes all day states of the rendered months; day cells are memoised, so only changed days re-render.</li>
          <li>The reachable-end search inspects at most 63 end candidates per start.</li>
          <li>This docs site loads each page and each example only when it is opened; code highlighting happens at build time.</li>
        </ul>
      </Section>
    </Page>
  );
}

export function Migration() {
  return (
    <Page title="Migration & troubleshooting" lead="Moving from react-dates and Moment, and fixes for common problems.">
      <Section title="From react-dates">
        <PropsTable
          rows={[
            { name: <><code>startDate</code> / <code>endDate</code> (moment)</>, type: "value={{ start, end }}", description: "'YYYY-MM-DD' strings." },
            { name: 'onDatesChange', type: 'onChange(value, e)', description: 'The second argument is an event object: why the value changed (e.reason), how far the selection is (e.phase) and the validation result (e.validation).' },
            { name: 'focusedInput / onFocusChange', type: 'activeEndpoint / onActiveEndpointChange', description: 'No “closed” (null) state: opening and closing belong to your app.' },
            { name: 'initialVisibleMonth', type: 'defaultVisibleMonth', description: 'Sets only the first month shown. To control the shown month yourself (controlled: you keep it in state), pass visibleMonth + onVisibleMonthChange.' },
            { name: <><code>numberOfMonths</code> (with mobile checks)</>, type: 'numberOfMonths + overflow', description: 'Layout follows the container; no window-width logic needed.' },
            { name: 'daySize', type: 'minDaySize / maxDaySize', description: 'Cells scale with the container.' },
            { name: 'isDayBlocked / isOutsideRange', type: 'rules', description: 'Rules you can use instead: getDayAvailability, closedDates, stayRules({ getDayStatus }), minDate/maxDate, disablePast.' },
            { name: 'minimumNights', type: 'stayRules({ minNights })', description: 'The equivalent of minimumNights={0} is allowSameDay: true.' },
            { name: 'firstDayOfWeek / weekDayFormat', type: 'firstDayOfWeek / weekdayFormat', description: 'Weekday names come from Intl; the default first day of the week comes from the locale.' },
            { name: 'navPrev / navNext', type: 'renderNavigation, renderMonthHeader', description: 'Or, on small screens, continuous navigation: months in a vertical list with a button that loads more months.' },
            { name: 'renderCalendarInfo', type: 'renderFooter / renderHeader', description: 'Both receive the current selection state and the actions (for example clearing the selection) as an argument.' },
            { name: 'renderDayContents', type: 'renderDayContent / renderDay', description: 'For text on hover, use getDayTooltip instead of building your own popups.' },
            { name: 'onOutsideClick', type: 'onOutsideClick', description: 'Uses the React tree, so clicks inside portals rendered by the calendar or its slots (its tooltip, a popover you render) do not count as outside.' },
            { name: 'keepOpenOnDateSelect', type: '—', description: 'Not needed: the calendar is shown inline on the page and never closes itself.' },
          ]}
        />
        <p>
          One deliberate difference: after a complete range, a click starts a new range (react-dates keeps the end when the start input is focused). To edit the
          end, set <code>activeEndpoint=&quot;end&quot;</code>.
        </p>
        <Snippet files={migration} label="Migration example" />
      </Section>
      <Section title="Troubleshooting">
        <PropsTable
          rows={[
            { name: <>The calendar has no styles</>, type: 'CSS', description: "Import 'calendar-kit/styles.css' once (JavaScript never imports CSS). In Next.js, in app/layout.tsx." },
            { name: <>My CSS does not override the theme</>, type: 'CSS', description: 'Set CSS variables on the calendar (className/style) and import your CSS after the theme; prefer classNames and data-* attributes over internal class names.' },
            { name: <>Hydration mismatch</>, type: 'SSR', description: 'Pass today (and a fixed defaultVisibleMonth if needed); the server cannot know the user’s date.' },
            { name: <>A React hooks error in a Next.js Server Component (for example <code>useSyncExternalStore is not a function</code>; the message depends on the version)</>, type: 'RSC', description: "Calendar from 'calendar-kit' was rendered in a Server Component: import it from 'calendar-kit/client' or wrap it in a 'use client' component." },
            { name: <>Functions cannot be passed to Client Components</>, type: 'RSC', description: 'Rules, callbacks and render props are functions: render the Calendar inside your own client component and define them there.' },
            { name: <>Tooltip hidden behind a modal</>, type: <>portal</>, description: 'Set tooltip.container to an element inside the dialog (modal dialogs sit in the top layer, above everything else).' },
            { name: <>Tooltip offset inside a transformed container</>, type: <>portal</>, description: 'Handled: the position is corrected for transformed portal containers.' },
            { name: <>Months overflow / page scrolls sideways</>, type: <>layout</>, description: 'The calendar never widens the page; check that its parent has a width (min-width: 0 in flex/grid parents).' },
            { name: <>Selection does not change when I set defaultValue</>, type: <>state</>, description: 'defaultValue is read only on the first render; to change the selection later, use value (controlled) or call ref.reset().' },
            { name: <>A day cannot be selected and shows no tooltip</>, type: <>data</>, description: 'Its month data is not loaded yet or still loading (unknownDataPolicy: block); the day shows a loading placeholder, and the reason is in its aria-label.' },
          ]}
        />
      </Section>
    </Page>
  );
}
