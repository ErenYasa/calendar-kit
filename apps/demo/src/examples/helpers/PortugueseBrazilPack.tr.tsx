import { useState } from 'react';
import { Calendar, type CalendarDate, type DateRange, getDateParts, stayRules } from 'calendar-kit';
import { messagesPtBr } from './messagesPtBr.tr';

// Her ayın 9., 18. ve 27. gecesi dolu; konaklamalar en az 2 gece olmalı.
const rules = stayRules({
  minNights: 2,
  disablePast: true,
  getDayStatus: (date: CalendarDate) => (getDateParts(date).day % 9 === 0 ? 'booked' : 'available'),
});

// locale="pt-BR": ay ve gün adları, tarih biçimleri ve hafta başlangıcı
// (Brezilya’da pazar) Intl’den gelir. messagesPtBr: takvimin bütün metinleri.
export default function PortugueseBrazilPack() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [rejected, setRejected] = useState('');

  return (
    <div>
      <Calendar
        mode="range"
        locale="pt-BR"
        messages={messagesPtBr}
        rules={rules}
        value={range}
        onChange={setRange}
        onInvalidSelection={(e) => setRejected(e.message)}
      />
      <p>Son reddedilen tıklama: {rejected || 'yok'} (dolu bir günü ya da başlangıçtan bir gece sonrasını bitiş olarak deneyin).</p>
    </div>
  );
}
