import { useState } from 'react';
import { Calendar, addMonthsToMonth, getMonth, getToday } from 'calendar-kit';
import { useAvailability } from '../shared/availability.tr';
import './LoadingIndicator.css';

// renderLoading, varsayılan gün iskeletinin üstüne görünür bir gösterge ekler:
// verisi yüklenen bir ay için "month" kapsamı, sürekli modda yeni eklenen aylar
// için "load-more", takvim genelindeki `loading` prop’u için "initial".
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
