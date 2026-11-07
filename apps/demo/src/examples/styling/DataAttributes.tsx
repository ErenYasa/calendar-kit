import { Calendar, type DayState } from 'calendar-kit';
import './DataAttributes.css';

// State is exposed as data-* attributes (data-selected, data-in-range,
// data-disabled, …). `modifiers` add your own: `holiday` → data-mod-holiday.
const holidays = new Set(['01-01', '05-01', '10-29', '12-25']);
const modifiers = { holiday: (day: DayState) => holidays.has(day.date.slice(5)) || day.dayOfMonth === 15 };

export default function DataAttributes() {
  return <Calendar mode="range" numberOfMonths={2} modifiers={modifiers} classNames={{ dayButton: 'marked-day', dayContent: 'marked-content' }} />;
}
