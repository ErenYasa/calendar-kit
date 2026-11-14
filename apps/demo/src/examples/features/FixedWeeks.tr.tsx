import { useState } from 'react';
import { Calendar, type CalendarMonth, addMonthsToMonth, daysInMonth, firstDayOfMonth, getMonth, getMonthParts, getToday, getWeekday } from 'calendar-kit';
import './FixedWeeks.css';

const FIRST_DAY_OF_WEEK = 1; // Pazartesi

// Bir ayın kaç hafta satırı gerektirdiği: baştaki boş günler artı ayın günleri, yedişerli satırlarda.
function weekRows(month: CalendarMonth): number {
  const { year, month: m } = getMonthParts(month);
  const lead = (getWeekday(firstDayOfMonth(month)) - FIRST_DAY_OF_WEEK + 7) % 7;
  return Math.ceil((lead + daysInMonth(year, m)) / 7);
}

// Bu aydan itibaren beş hafta satırına sığan ilk ay.
function firstFiveRowMonth(from: CalendarMonth): CalendarMonth {
  let month = from;
  while (weekRows(month) !== 5) month = addMonthsToMonth(month, 1);
  return month;
}

// Beş satıra sığan aynı ay iki kez. fixedWeeks={false}: beş satır. fixedWeeks={true}:
// altıncı, boş bir satır eklenir (burada çerçeveli), böylece her ayın altı hafta
// satırı olur ve kullanıcı ay değiştirdiğinde satır sayısı değişmez.
// Gösterilen ay sayısı değişmez.
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
