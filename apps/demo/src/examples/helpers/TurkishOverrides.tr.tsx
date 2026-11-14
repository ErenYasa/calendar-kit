import { useState } from 'react';
import { Calendar, type CalendarDate, type CalendarMessagesInput, type DateRange, addMonths, formatDate, getToday, mergeMessages, messagesTr, stayRules } from 'calendar-kit';

// Konaklamalar en az 2 gece olmalı; geçmiş günler devre dışı.
const rules = stayRules({ minNights: 2, disablePast: true });

// Değiştirdiğimiz üç Türkçe metin. Takvim Türkçe olduğu için metinler de
// Türkçedir; dokümantasyonun dili burada bir şey değiştirmez.
const overrides: CalendarMessagesInput = {
  // (a) Ayların altındaki görünür düğme (sürekli gezinme).
  loadNext: 'Sonraki ayı göster',
  // (b) Konaklama çok kısa olduğunda gösterilen metin.
  reasons: { 'min-length': (p) => `Konaklama en az ${p.min} gece olmalı` },
  // (c) Aralık tamamlandığında ekran okuyucunun okuduğu metin.
  announceRange: (start, end) => `Konaklamanız seçildi: giriş ${start}, çıkış ${end}.`,
};

// messagesTr’nin üzerine birleştirin: diğer bütün metinler Türkçe kalır.
// Yalnızca `overrides` verilseydi eksik anahtarlar İngilizceden doldurulurdu.
const messages = mergeMessages(messagesTr, overrides);

// Calendar’ın duyurularda kullandığı tarih biçiminin aynısı.
const announceDate = (date: CalendarDate) => formatDate(date, 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

export default function TurkishOverrides() {
  const [today] = useState(() => getToday());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [rejected, setRejected] = useState('');

  return (
    <div style={{ maxWidth: 380 }}>
      <Calendar
        mode="range"
        locale="tr-TR"
        messages={messages}
        rules={rules}
        navigation="continuous"
        orientation="vertical"
        numberOfMonths={1}
        maxDate={addMonths(today, 6)}
        value={range}
        onChange={(next) => {
          setRange(next);
          setRejected('');
        }}
        onInvalidSelection={(e) => setRejected(e.message)}
      />
      <p>Son reddedilen tıklama: {rejected || 'yok'} (bir başlangıç, ardından bitiş olarak ertesi günü seçin).</p>
      {/* Calendar’ın duyuru yaptığı canlı bölge (live region) görünmezdir.
          Ekran okuyucunun gerçekte ne okuduğunu gösteremeyiz; bu yüzden aynı
          metni aynı mesajlar ve aynı tarih biçimiyle burada yeniden üretiyoruz. */}
      <p>
        Aralık tamamlandığında yapılan duyuru:{' '}
        {range.start && range.end ? messages.announceRange(announceDate(range.start), announceDate(range.end)) : 'bir başlangıç ve bir bitiş seçin'}
      </p>
    </div>
  );
}
