import { useState } from 'react';
import { Calendar, type CalendarDate, type CalendarMessagesInput, type DateRange, addMonths, formatDate, getToday, mergeMessages, messagesTr, stayRules } from 'calendar-kit';

// Stays need at least 2 nights; past days are disabled.
const rules = stayRules({ minNights: 2, disablePast: true });

// The three Turkish texts we change. They are Turkish because the calendar is
// Turkish; the docs language does not matter here.
const overrides: CalendarMessagesInput = {
  // (a) The visible button under the months (continuous navigation).
  loadNext: 'Sonraki ayı göster',
  // (b) The text shown when a stay is too short.
  reasons: { 'min-length': (p) => `Konaklama en az ${p.min} gece olmalı` },
  // (c) What a screen reader hears when a range is complete.
  announceRange: (start, end) => `Konaklamanız seçildi: giriş ${start}, çıkış ${end}.`,
};

// Merge over messagesTr: every other text stays Turkish. Passing `overrides`
// alone would fill the missing keys from English.
const messages = mergeMessages(messagesTr, overrides);

// The same date format the Calendar uses inside announcements.
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
      <p>Last rejected click: {rejected || 'none'} (choose a start, then the next day as the end).</p>
      {/* The live region the Calendar announces into is visually hidden. We
          cannot show what the screen reader actually said, so we build the same
          text again with the same messages and the same date format. */}
      <p>
        Announcement after a complete range:{' '}
        {range.start && range.end ? messages.announceRange(announceDate(range.start), announceDate(range.end)) : 'choose a start and an end'}
      </p>
    </div>
  );
}
