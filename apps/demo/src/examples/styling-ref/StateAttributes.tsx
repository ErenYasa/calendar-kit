import { useState } from 'react';
import { Calendar, addDays, getToday, type DayState } from 'calendar-kit';
import './StateAttributes.css';

// Every state gets its own colour. The calendar puts the state on the day
// cell and the day button as data-* attributes; `classNames` adds our own
// class names next to them, and the CSS file selects `class + data-*`.
const modifiers = {
  // A custom modifier: true → `data-mod-weekend` on the cell and the button.
  weekend: (day: DayState) => day.weekday === 0 || day.weekday === 6,
};

const legend = [
  ['today', 'data-today'],
  ['start', 'data-range-start'],
  ['end', 'data-range-end'],
  ['band', 'data-band'],
  ['preview', 'data-band-preview'],
  ['weekend', 'data-mod-weekend'],
  ['off', 'data-unavailable'],
] as const;

export default function StateAttributes() {
  const [today] = useState(() => getToday());
  return (
    <div className="sr-demo">
      <Calendar
        mode="range"
        numberOfMonths={2}
        today={today}
        disablePast
        maxDate={addDays(today, 40)}
        defaultValue={{ start: addDays(today, 2), end: addDays(today, 6) }}
        modifiers={modifiers}
        className="sr-states"
        classNames={{ dayCell: 'sr-cell', dayButton: 'sr-btn' }}
      />
      <ul className="sr-legend">
        {legend.map(([key, attr]) => (
          <li key={key} className="sr-key" data-key={key}>
            {attr}
          </li>
        ))}
      </ul>
    </div>
  );
}
