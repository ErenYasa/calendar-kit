import { Calendar, messagesAr } from 'calendar-kit';

// Arabic: right-to-left layout (from the locale; `direction` overrides it),
// Arabic-Indic digits and mirrored arrow keys.
export default function Rtl() {
  return <Calendar mode="range" locale="ar-EG" messages={messagesAr} numberOfMonths={2} />;
}
