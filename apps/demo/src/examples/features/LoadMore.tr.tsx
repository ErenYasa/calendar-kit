import { useState } from 'react';
import { Calendar, addDays, addMonthsToMonth, getMonth, getToday } from 'calendar-kit';

// `loadMoreLabels` yalnızca varsayılan düğmelerin içeriğini değiştirir; davranışları
// ve erişilebilirlikleri aynı kalır. Liste, içinde bulunulan aydan iki ay sonra
// başlar (örnek mount edildiğinde bir kez hesaplanır: ocakta açılırsa mart,
// kasımda açılırsa sonraki ocak gösterilir); böylece her iki yönde de yükleme
// yapılabilir: geriye bugüne kadar, ileriye bir yıl sonrasına kadar.
export default function LoadMore() {
  const [today] = useState(() => getToday());
  return (
    <div style={{ maxWidth: 380 }}>
      <Calendar
        mode="range"
        orientation="vertical"
        navigation="continuous"
        loadDirections="both"
        numberOfMonths={2}
        monthsPerLoad={2}
        defaultVisibleMonth={addMonthsToMonth(getMonth(today), 2)}
        minDate={today}
        maxDate={addDays(today, 365)}
        maxBlockSize={480}
        loadMoreLabels={{
          previous: <span>↑ Önceki tarihleri göster</span>,
          next: <span>Daha fazla tarih göster ↓</span>,
        }}
      />
    </div>
  );
}
