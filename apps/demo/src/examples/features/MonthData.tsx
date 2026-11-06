import { Calendar, addMonthsToMonth, getMonth, getToday, stayRules } from 'calendar-kit';
import { useAvailability } from '../shared/availability';

const failMonth = addMonthsToMonth(getMonth(getToday()), 1);

// Data per month: the app loads the months the calendar renders and reports
// each month's status. Loading/unknown months show a skeleton and block
// selection; an error shows a retry button (next month fails once here).
export default function MonthData() {
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
