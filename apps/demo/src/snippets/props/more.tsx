// Props and controller methods that change formatting, layout and identity.
// Each one is shown in use; see the props table for defaults and limits.
import { useRef, useState } from 'react';
import { Calendar, type CalendarController, type DateRange, type SelectionRules, stayRules } from 'calendar-kit';

// Whole weeks only: one click selects 7 nights.
const weekRules = stayRules({ fixedNights: 7 });
// Free length, at least 2 days. stayRules turns requireReachableEnd on by itself;
// with plain rules you add it, so starts that can never reach a valid end are disabled.
const flexibleRules: SelectionRules = { minLength: 2, requireReachableEnd: true };

export function FormattingAndLayout({ weeksOnly = false }: { weeksOnly?: boolean }) {
  const calendar = useRef<CalendarController>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div>
      <Calendar
        ref={calendar}
        id="week-picker" // root id; the tooltip id is derived from it ("week-picker-tooltip")
        style={{ ['--cal-accent' as string]: '#0b6e4f' }} // CSS variables on the root
        mode="range"
        rules={weeksOnly ? weekRules : flexibleRules}
        value={range}
        onChange={setRange}
        defaultActiveEndpoint="start" // uncontrolled: the end the first click sets ('start' is also the default for an empty range)
        direction="ltr" // force a direction regardless of the locale
        monthTitleFormat={{ month: 'short', year: '2-digit' }} // Intl options for the month titles; used only without formatMonthTitle
        formatMonthTitle={(month, locale) => new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(`${month}-15T12:00:00Z`))} // returns the title text itself ("November"), so monthTitleFormat above is ignored
        formatWeekday={(weekday) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][weekday]} // visible weekday header (ReactNode); screen readers still hear the full name
        formatDayLabel={(date, locale) => new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`))} // date part of each day's screen reader label
        numberOfMonths={2}
        monthGap={16} // px between months
        maxDaySize={48} // cap the cell height on wide screens
        fixedWeeks // every month has 6 week rows, so the height does not change between months
        navigation="continuous"
        maxRenderedMonths={12} // continuous: at most 12 months in the page at once
      />
      {/* In continuous mode previous()/next() scroll to the previous/next month. */}
      <button type="button" onClick={() => calendar.current?.previous()}>
        Previous
      </button>
      <button type="button" onClick={() => calendar.current?.next()}>
        Next
      </button>
      {/* The next click moves the end of the range. No effect with weeksOnly: a fixed-length click always sets both ends. */}
      <button type="button" onClick={() => calendar.current?.setActiveEndpoint('end')}>
        Change the check-out
      </button>
    </div>
  );
}
