import { useMemo, useRef, useState } from 'react';
import { Calendar, type CalendarController, type SelectionRules, addMonthsToMonth, getMonth, getToday } from 'calendar-kit';

// Tarihler, örneğin açıldığı güne göredir (mount sırasında bir kez hesaplanır).
// Müsaitliğin nerede başladığını uygulama bilir (ör. kendi API’sinden); takvim
// bunu aramaz. Burada "bu ay + 3"ten önceki her şey dolu.
export default function GoToMonth() {
  const calendar = useRef<CalendarController>(null);
  const [thisMonth] = useState(() => getMonth(getToday()));
  const firstAvailableMonth = addMonthsToMonth(thisMonth, 3);
  const rules = useMemo<SelectionRules>(
    () => ({
      disablePast: true,
      getDayAvailability: (date) => (date.slice(0, 7) < firstAvailableMonth ? { closed: true, reason: 'booked', message: 'Tamamen dolu' } : undefined),
    }),
    [firstAvailableMonth],
  );
  return (
    <div>
      <p>
        <button type="button" onClick={() => calendar.current?.goToMonth(firstAvailableMonth, { focus: true })}>
          İlk müsait tarihe git
        </button>{' '}
        <button type="button" onClick={() => calendar.current?.goToMonth(thisMonth)}>
          Bu aya dön
        </button>
      </p>
      <Calendar ref={calendar} mode="range" numberOfMonths={2} rules={rules} />
    </div>
  );
}
