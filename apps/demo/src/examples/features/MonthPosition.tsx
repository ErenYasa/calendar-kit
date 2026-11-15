import { useState } from 'react';
import { Calendar, formatMonth, getMonth, getToday } from 'calendar-kit';
import './MonthPosition.css';

// Same reference month (this month), same three months, two positions.
// monthPosition={1}: the reference month comes first, then the next two.
// monthPosition={2}: one month before it, then the reference month, then one after.
// The reference month itself does not change; only its place in the window does.
export default function MonthPosition() {
  const [reference] = useState(() => getMonth(getToday()));
  const name = formatMonth(reference, 'en-US');
  return (
    <div className="month-position">
      {[1, 2].map((position) => (
        <section key={position} aria-label={`monthPosition=${position}`}>
          <p className="month-position-label">
            <code>monthPosition=&#123;{position}&#125;</code> · reference month: {name}
          </p>
          <Calendar mode="single" numberOfMonths={3} monthPosition={position} defaultVisibleMonth={reference} minDaySize={32} />
        </section>
      ))}
    </div>
  );
}
