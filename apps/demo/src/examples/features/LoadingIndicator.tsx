import { useState } from 'react';
import { Calendar, addMonthsToMonth, getMonth, getToday } from 'calendar-kit';
import { useAvailability } from '../shared/availability';
import './LoadingIndicator.css';

// renderLoading adds a visible indicator on top of the default day skeleton:
// scope "month" for a month whose data is loading, "load-more" for months just
// added in continuous mode, "initial" for the calendar-wide `loading` prop.
export default function LoadingIndicator() {
  const [failMonth] = useState(() => addMonthsToMonth(getMonth(getToday()), 6));
  const { getDataStatus, ensure, retry } = useAvailability({ failMonth });
  return (
    <Calendar
      mode="single"
      numberOfMonths={2}
      getDataStatus={getDataStatus}
      onRenderedMonthsChange={(e) => ensure(e.months)}
      onRetry={retry}
      renderLoading={({ scope, months, messages }) =>
        scope === 'month' ? (
          <span className="month-loading">
            {messages.loading} {months[0]}
          </span>
        ) : null
      }
    />
  );
}
