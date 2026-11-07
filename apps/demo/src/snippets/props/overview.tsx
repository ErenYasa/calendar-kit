// The props most calendars need: a controlled range with rules and limits,
// two months that adapt to their container, per-day data, a locale and a ref
// for controls outside the calendar.
import { useRef, useState } from 'react';
import { Calendar, type CalendarController, type CalendarDate, type DateRange, type DefaultDayData, addDays, getToday, getWeekday, stayRules } from 'calendar-kit';

// Defined once, outside the component: stable rules are not recombined on
// every render, and returning the same data object lets unchanged days skip
// re-rendering.
const rules = stayRules({ minNights: 2, maxNights: 14 });
const weekend: DefaultDayData = { label: '€140' };
const weekday: DefaultDayData = { label: '€110' };
const getDayData = (date: CalendarDate) => (getWeekday(date) >= 5 ? weekend : weekday);

export function StayPicker() {
  const ref = useRef<CalendarController>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [maxDate] = useState(() => addDays(getToday(), 365));

  return (
    <div>
      <Calendar
        ref={ref}
        mode="range"
        value={range}
        onChange={(next) => setRange(next)}
        rules={rules}
        disablePast
        maxDate={maxDate}
        numberOfMonths={2}
        overflow="reduce-months"
        getDayData={getDayData}
        locale="en-GB"
        aria-label="Stay dates"
        className="stay-calendar"
      />
      <button type="button" onClick={() => ref.current?.clear()}>
        Clear dates
      </button>
    </div>
  );
}
