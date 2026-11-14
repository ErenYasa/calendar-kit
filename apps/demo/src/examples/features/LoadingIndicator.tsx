import { useState } from 'react';
import { Calendar, addMonthsToMonth, getMonth, getToday } from 'calendar-kit';
import { useAvailability } from '../shared/availability';
import './LoadingIndicator.css';

// renderLoading adds a visible indicator on top of the default
// placeholders shown while dates load:
// scope "month" for a month whose data is loading, "load-more" for months just
// added in continuous mode, "initial" for the calendar-wide `loading` prop.
// Here only "month" is shown: press next to see "Loading…" with the month under
// each month that is loading. The sixth month from now fails once, so the
// default error and its retry button can be seen too.
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
