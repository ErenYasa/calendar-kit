import { useState } from 'react';
import { Calendar, type DateRange, countNights, stayRules } from 'calendar-kit';
import 'calendar-kit/styles.css';

// Konaklama: bitiş tarihi çıkış günüdür ve gece olarak sayılmaz.
const rules = stayRules();

// Controlled: aralık bu bileşenin state'inde durur (`value`); takvim her yeni
// seçimi `onChange` ile bildirir.
export default function QuickStart() {
  const [stay, setStay] = useState<DateRange>({ start: null, end: null });
  const nights = countNights(stay);

  return (
    <div>
      <Calendar mode="range" numberOfMonths={2} rules={rules} value={stay} onChange={setStay} />
      <p>{nights ? `${nights} gece: ${stay.start} → ${stay.end}` : 'Önce giriş, sonra çıkış tarihini seçin.'}</p>
    </div>
  );
}
