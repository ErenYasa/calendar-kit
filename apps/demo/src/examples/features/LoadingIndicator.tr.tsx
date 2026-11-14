import { useState } from 'react';
import { Calendar, addMonthsToMonth, getMonth, getToday } from 'calendar-kit';
import { useAvailability } from '../shared/availability.tr';
import './LoadingIndicator.css';

// renderLoading, tarihler yüklenirken gösterilen
// varsayılan boş yer tutuculara ek olarak görünür bir gösterge ekler:
// verisi yüklenen bir ay için "month" kapsamı, sürekli modda yeni eklenen aylar
// için "load-more", takvim genelindeki `loading` prop’u için "initial".
// Burada yalnızca "month" gösterilir: verisi yüklenen her ayın altında yükleme
// metnini ve ayı görmek için ileri düğmesine basın. Bugünden itibaren altıncı ay
// bir kez başarısız olur; böylece varsayılan hata görünümü ve yeniden deneme
// düğmesi de görülebilir.
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
