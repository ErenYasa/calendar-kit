import { useState } from 'react';
import { Calendar, addMonthsToMonth, getMonth, getToday, stayRules } from 'calendar-kit';
import { useAvailability } from '../shared/availability';

// Data per month: the app loads the months the calendar renders and reports
// each month's status. Loading/unknown months show a skeleton and block
// selection; an error shows a retry button. Here the month after the two
// visible ones fails once: press "next" to see the error and retry it.
export default function MonthData() {
  const [failMonth] = useState(() => addMonthsToMonth(getMonth(getToday()), 2));
  const { getDataStatus, dayInfo, ensure, retry } = useAvailability({ failMonth });
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      rules={stayRules({ disablePast: true, getDayStatus: (d) => dayInfo(d)?.status })}
      getDataStatus={getDataStatus}
      onRenderedMonthsChange={(e) => ensure(e.months)}
      onRetry={retry}
    />
  );
}
