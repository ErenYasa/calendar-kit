import { useState } from 'react';
import { Calendar, formatMonth, getMonth, getToday } from 'calendar-kit';
import './MonthPosition.css';

// Aynı referans ay (bu ay), aynı üç ay, iki farklı konum.
// monthPosition={1}: referans ay başta gelir, ardından sonraki iki ay.
// monthPosition={2}: önce bir önceki ay, sonra referans ay, sonra bir sonraki ay.
// Referans ayın kendisi değişmez; yalnızca penceredeki yeri değişir.
export default function MonthPosition() {
  const [reference] = useState(() => getMonth(getToday()));
  const name = formatMonth(reference, 'en-US');
  return (
    <div className="month-position">
      {[1, 2].map((position) => (
        <section key={position} aria-label={`monthPosition=${position}`}>
          <p className="month-position-label">
            <code>monthPosition=&#123;{position}&#125;</code> · referans ay: {name}
          </p>
          <Calendar mode="single" numberOfMonths={3} monthPosition={position} defaultVisibleMonth={reference} minDaySize={32} />
        </section>
      ))}
    </div>
  );
}
