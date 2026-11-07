import { useState } from 'react';
import { Calendar, type CalendarDate, type CalendarMessagesInput, type DateRange, getDateParts, mergeMessages, messagesDe, messagesEn, stayRules } from 'calendar-kit';

// Her ayın 9., 18. ve 27. gecesi dolu; konaklamalar en az 2 gece olmalı.
const rules = stayRules({
  minNights: 2,
  disablePast: true,
  getDayStatus: (date: CalendarDate) => (getDateParts(date).day % 9 === 0 ? 'booked' : 'available'),
});

// Yalnızca değiştirmek istediğimiz metinler. Geri kalan her şey temel paketten gelir.
// (Bu örnek İngilizce ve Almanca paketleri özelleştirmeyi gösterdiği için metinler bu dillerde kalır.)
const overrides: Record<'en' | 'de', CalendarMessagesInput> = {
  en: {
    todayLabel: 'You are here',
    announceRange: (start, end) => `Stay from ${start} to ${end}.`,
    reasons: { 'min-length': (p) => `Stays are at least ${p.min} nights` },
    dayReasons: { booked: 'Sold out' },
  },
  de: {
    reasons: { 'min-length': (p) => `Mindestaufenthalt ${p.min} Nächte` },
    dayReasons: { booked: 'Ausgebucht' },
  },
};

export default function CustomMessages() {
  const [language, setLanguage] = useState<'en' | 'de'>('en');
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [rejected, setRejected] = useState('');
  // Calendar, `messages`’ı İngilizcenin üzerine kendisi birleştirir; İngilizce
  // olmayan tam bir paket ile geçersiz kılmalar mergeMessages ile birleştirilir.
  const messages = language === 'en' ? overrides.en : mergeMessages(messagesDe, overrides.de);

  return (
    <div>
      <label>
        Dil{' '}
        <select value={language} onChange={(e) => setLanguage(e.target.value as 'en' | 'de')}>
          <option value="en">İngilizce (messagesEn + geçersiz kılmalar)</option>
          <option value="de">Almanca (messagesDe + geçersiz kılmalar)</option>
        </select>
      </label>
      <Calendar
        mode="range"
        locale={language === 'en' ? 'en-US' : 'de-DE'}
        messages={messages}
        rules={rules}
        value={range}
        onChange={setRange}
        onInvalidSelection={(e) => setRejected(e.message)}
      />
      <p>
        Temel paket: {language === 'en' ? messagesEn.calendar : messagesDe.calendar}. Son reddedilen tıklama: {rejected || 'yok'} (dolu bir günü ya da
        başlangıçtan bir gece sonrasını bitiş olarak deneyin).
      </p>
    </div>
  );
}
