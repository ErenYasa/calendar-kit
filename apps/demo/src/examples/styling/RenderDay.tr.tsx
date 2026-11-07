import { useState } from 'react';
import { Calendar, type DateRange } from 'calendar-kit';
import './RenderDay.tr.css';

// renderDay: öğeyi siz render edersiniz; getDayProps takvimin ref’ini,
// tabIndex’ini, ARIA niteliklerini, data-* durumunu ve işleyicilerini sizin
// prop’larınızla birleştirir. Varsayılan `cal-day-button` sınıfı korunur; bu
// yüzden varsayılan daire, aralık bandı, odak halkası ve devre dışı görünümü
// yine uygulanır, sizin içeriğiniz bunların üzerine çizilir.
// Sizin işleyicileriniz önce çalışır; takviminkini atlamak için event.preventDefault() çağırın.
export default function RenderDay() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      disablePast
      value={range}
      onChange={setRange}
      renderDay={({ day, getDayProps }) => (
        <button {...getDayProps({ className: 'rd-day' })}>
          <span>{day.dayText}</span>
          {day.weekEnd && !day.past && <span className="rd-tag">hf sonu</span>}
        </button>
      )}
    />
  );
}
