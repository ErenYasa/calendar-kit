import { useState } from 'react';
import { Calendar, type CalendarDate, type CalendarMessagesInput, type DateRange, getDateParts, mergeMessages, messagesDe, messagesEn, stayRules } from 'calendar-kit';

// Every 9th, 18th and 27th night is booked; stays need at least 2 nights.
const rules = stayRules({
  minNights: 2,
  disablePast: true,
  getDayStatus: (date: CalendarDate) => (getDateParts(date).day % 9 === 0 ? 'booked' : 'available'),
});

// Only the texts we want to change. Everything else comes from the base bundle.
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
  // The Calendar merges `messages` over English itself; a full non-English
  // bundle plus overrides is built with mergeMessages.
  const messages = language === 'en' ? overrides.en : mergeMessages(messagesDe, overrides.de);

  return (
    <div>
      <label>
        Language{' '}
        <select value={language} onChange={(e) => setLanguage(e.target.value as 'en' | 'de')}>
          <option value="en">English (messagesEn + overrides)</option>
          <option value="de">Deutsch (messagesDe + overrides)</option>
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
        Base bundle: {language === 'en' ? messagesEn.calendar : messagesDe.calendar}. Last rejected click: {rejected || 'none'} (try a booked day, or an
        end one night after the start).
      </p>
    </div>
  );
}
