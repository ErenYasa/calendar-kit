import { useState } from 'react';
import { Calendar, type CalendarMonth, addMonthsToMonth, daysInMonth, firstDayOfMonth, getMonth, getMonthParts, getToday, getWeekday } from 'calendar-kit';
import './FixedWeeks.css';

const FIRST_DAY_OF_WEEK = 1; // Monday

// Week rows a month needs: leading empty days plus its days, in rows of seven.
function weekRows(month: CalendarMonth): number {
  const { year, month: m } = getMonthParts(month);
  const lead = (getWeekday(firstDayOfMonth(month)) - FIRST_DAY_OF_WEEK + 7) % 7;
  return Math.ceil((lead + daysInMonth(year, m)) / 7);
}

// The first month from this month on that fits in five week rows.
function firstFiveRowMonth(from: CalendarMonth): CalendarMonth {
  let month = from;
  while (weekRows(month) !== 5) month = addMonthsToMonth(month, 1);
  return month;
}

// The same five-row month twice. fixedWeeks={false}: five rows. fixedWeeks={true}:
// a sixth, empty row is added (outlined here), so every month has six week rows
// and the row count does not change when the user changes month.
// The number of months shown stays the same.
export default function FixedWeeks() {
  const [month] = useState(() => firstFiveRowMonth(getMonth(getToday())));
  return (
    <div className="fixed-weeks">
      <div>
        <p className="fixed-weeks-label">fixedWeeks=&#123;false&#125;</p>
        <Calendar mode="single" firstDayOfWeek={FIRST_DAY_OF_WEEK} defaultVisibleMonth={month} fixedWeeks={false} aria-label="fixedWeeks false" />
      </div>
      <div>
        <p className="fixed-weeks-label">fixedWeeks=&#123;true&#125;</p>
        <Calendar mode="single" firstDayOfWeek={FIRST_DAY_OF_WEEK} defaultVisibleMonth={month} fixedWeeks aria-label="fixedWeeks true" />
      </div>
    </div>
  );
}
