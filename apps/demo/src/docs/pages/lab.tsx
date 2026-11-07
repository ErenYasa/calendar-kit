import { Example } from '../Code';
import { DataTable, Note, Page, Section } from '../ui';

const c = (s: string) => <code>{s}</code>;

export function LayoutLab() {
  return (
    <Page
      title="Layout, events & measurement"
      lead={
        <>
          One calendar you can resize and reconfigure while watching which events it emits and how long React spends rendering it. Use it to see how the
          layout reacts to its container and props, which events fire for an interaction, and roughly what a render costs.
        </>
      }
    >
      <Section title="The lab">
        <p>
          The calendar sits in a box you can narrow by dragging its bottom corner. The layout follows that box, not the window, so you can try a phone width
          on a desktop screen. The side column shows the React Profiler measurements and the {c('onEvent')} stream; on narrow screens it moves below the
          calendar.
        </p>
        <Example src="lab/LayoutLab" title="Layout, events and measurement" />
        <Note>
          This page is a diagnostic tool, not a pattern to copy. The other examples in these docs each show one feature with the minimum code.
        </Note>
      </Section>

      <Section title="Controls">
        <DataTable
          caption="What each control changes"
          head={['Control', 'Prop', 'What to watch', 'Details']}
          rows={[
            ['orientation', c('orientation'), 'Months side by side or stacked.', <a href="#/orientation">Orientation &amp; months</a>],
            [
              'navigation',
              c('navigation'),
              <>
                {c('paged')} shows a fixed window with previous/next arrows; {c('continuous')} scrolls through months and loads more at the edges (the lab sets{' '}
                {c('maxBlockSize={480}')} and {c('loadDirections="both"')} so it scrolls inside the box).
              </>,
              <a href="#/load-more">Progressive months</a>,
            ],
            [
              'overflow',
              c('overflow'),
              <>
                What happens when the requested months do not fit the width: {c('wrap')} to a new row, {c('scroll')} inside the calendar, or{' '}
                {c('reduce-months')} to show fewer. Watch {c('layoutChange')} while you drag.
              </>,
              <a href="#/responsive">Responsive layout</a>,
            ],
            ['numberOfMonths', c('numberOfMonths'), 'How many months are requested (the layout may show fewer).', <a href="#/orientation">Orientation &amp; months</a>],
            ['monthPosition', c('monthPosition'), 'Which of the shown months holds the reference month.', <a href="#/month-position">Reference month position</a>],
            [
              'minDaySize',
              c('minDaySize'),
              'The smallest a day cell may get before the overflow strategy kicks in.',
              <a href="#/day-size">Day size &amp; inner scroll</a>,
            ],
            ['disableFuture', c('disableFuture'), 'Days after today become unavailable.', <a href="#/date-limits">Date limits</a>],
            [
              'RTL (ar-EG)',
              <>
                {c('locale')}, {c('messages')}
              </>,
              <>
                Arabic locale with {c('messagesAr')}: right-to-left layout, Arabic-Indic digits, mirrored arrows.
              </>,
              <a href="#/i18n">Locales, week start &amp; RTL</a>,
            ],
          ]}
        />
      </Section>

      <Section title="Measurements">
        <p>
          Only the {c('<Calendar>')} is wrapped in a React {c('<Profiler>')}; the side column is outside it, so its own renders are not counted. Each row is
          one React commit that rendered the calendar (the last 20 are kept).
        </p>
        <DataTable
          caption="Profiler columns"
          head={['Column', 'Meaning']}
          rows={[
            [
              'phase',
              <>
                {c('mount')} for the first render, {c('update')} for later ones, {c('nested-update')} when the update was scheduled from a layout effect of the
                same commit.
              </>,
            ],
            [
              'actual ms',
              <>
                {c('actualDuration')}: time React spent rendering the calendar subtree for that commit (the render phase: calling components and diffing).
                It does not include applying DOM changes, layout or paint, so it is not the commit time and not what the user waits for in total.
              </>,
            ],
            [
              'base ms',
              <>
                {c('baseDuration')}: the estimated time to render the whole subtree without any memoisation, i.e. a worst case. A large gap between base and
                actual means memoised parts were skipped.
              </>,
            ],
          ]}
        />
        <ul>
          <li>
            The Profiler reports only in development builds and in the {c('react-dom/profiling')} build. In a normal production build (such as the published
            docs site) it reports nothing; the lab then says so instead of showing zeros. Run the docs locally with {c('npm run dev')} to see numbers.
          </li>
          <li>
            Development React is considerably slower than production, and the numbers depend on the machine, the browser and what else is running. Use them to
            compare interactions with each other, not as absolute figures.
          </li>
          <li>
            For repeatable numbers, {c('npm run perf')} measures a production profiling build with real input and CPU throttling; see{' '}
            <a href="#/performance">Performance</a> for the method and the recorded results.
          </li>
        </ul>
      </Section>

      <Section title="Events">
        <p>
          The list shows every event delivered to {c('onEvent')}, newest first, with a short summary (a date, the visible months, the layout&apos;s columns
          and effective months, …); the last 30 rows are kept. Consecutive {c('resize')}, {c('scroll')}, {c('dayFocusChange')} and{' '}
          {c('tooltipOpenChange')} events are merged into one row with a counter, because a drag or a scroll emits many of them.
        </p>
        <ul>
          <li>
            Mounting emits {c('ready')} and the derived events ({c('layoutChange')}, {c('visibleMonthsChange')}, {c('validationChange')}, …). Under
            StrictMode in development some of them appear twice.
          </li>
          <li>
            Dragging the box emits {c('resize')}; {c('layoutChange')} follows only when the columns, effective months or overflow actually change.
          </li>
          <li>
            Clicking a day emits {c('dateClick')} (also for a rejected day), then {c('change')} and {c('activeEndpointChange')}; the click that completes
            the range adds {c('selectionComplete')}. Moving focus to another day emits {c('dayFocusChange')}; after React has rendered,{' '}
            {c('validationChange')} follows when the validation result changed.
          </li>
        </ul>
        <p>
          Every event type and its payload are listed in <a href="#/api-events">Callbacks &amp; events</a>.
        </p>
      </Section>
    </Page>
  );
}
