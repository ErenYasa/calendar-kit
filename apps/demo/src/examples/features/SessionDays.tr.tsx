import { useState } from 'react';
import { Calendar, type CalendarDate } from 'calendar-kit';

// Kurs oturumları: yalnızca salı ve perşembe günlerinden en fazla 4 tarih seçin.
// Çoklu modda hangi hafta günlerinin seçilebileceğini `startWeekdays` belirler;
// iki reddin metinleri `messages.reasons` ile değiştirilir. (Takvimin dili
// İngilizce kaldığı için bu metinler de İngilizce bırakıldı.)
export default function SessionDays() {
  const [dates, setDates] = useState<readonly CalendarDate[]>([]);
  return (
    <div>
      <Calendar
        mode="multiple"
        numberOfMonths={2}
        rules={{ disablePast: true, startWeekdays: [2, 4], maxSelections: 4 }}
        messages={{
          reasons: {
            'weekday-start': () => 'Sessions run on Tuesdays and Thursdays',
            'max-selections': (p) => `You can book ${p.max} sessions`,
          },
        }}
        value={dates}
        onChange={setDates}
      />
      <p>{dates.length ? `Oturumlar: ${[...dates].sort().join(', ')}` : 'Henüz oturum yok.'}</p>
    </div>
  );
}
