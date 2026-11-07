import { Calendar, messagesTr } from 'calendar-kit';

// Month and weekday names come from Intl; the week starts on Monday for tr-TR.
// `messages` translates the calendar's own texts (buttons, reasons, announcements).
export default function LocaleTurkish() {
  return <Calendar mode="range" locale="tr-TR" messages={messagesTr} numberOfMonths={2} />;
}
