// Props and controller methods that change formatting, layout and identity.
// Each one is shown in use; see the props table for defaults and limits.
import { useRef, useState } from 'react';
import { Calendar, type CalendarController, type DateRange, type SelectionRules, stayRules } from 'calendar-kit';

const rules: SelectionRules[] = [
  stayRules({ fixedNights: 7 }), // one click selects a whole week
  // stayRules already turns this on; with plain rules, enable it to reject
  // starts that provably cannot reach a valid end:
  { requireReachableEnd: true },
];

export function FormattingAndLayout() {
  const calendar = useRef<CalendarController>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div>
      <Calendar
        ref={calendar}
        id="week-picker" // root id; the tooltip id is derived from it ("week-picker-tooltip")
        style={{ ['--cal-accent' as string]: '#0b6e4f' }} // CSS variables on the root
        mode="range"
        rules={rules}
        value={range}
        onChange={setRange}
        defaultActiveEndpoint="start" // uncontrolled endpoint: which end the first click sets
        direction="ltr" // force a direction regardless of the locale
        monthTitleFormat={{ month: 'short', year: '2-digit' }} // Intl options for month titles
        formatMonthTitle={(month, locale) => new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(`${month}-15T12:00:00Z`))}
        formatWeekday={(weekday) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][weekday]} // header text (ReactNode)
        formatDayLabel={(date, locale) => new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`))} // accessible label
        numberOfMonths={2}
        monthGap={16} // px between months
        maxDaySize={48} // cap the cell height on wide screens
        fixedWeeks // always six week rows: the height does not jump between months
        navigation="continuous"
        maxRenderedMonths={12} // continuous: at most 12 months in the DOM
      />
      <button type="button" onClick={() => calendar.current?.previous()}>
        Previous
      </button>
      <button type="button" onClick={() => calendar.current?.next()}>
        Next
      </button>
      <button type="button" onClick={() => calendar.current?.setActiveEndpoint('end')}>
        Change the check-out
      </button>
    </div>
  );
}
