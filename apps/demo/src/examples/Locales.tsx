import { useState } from 'react';
import {
  Calendar,
  type CalendarMessagesInput,
  type DateRange,
  messagesAr,
  messagesDe,
  messagesEn,
  messagesEs,
  messagesFr,
  messagesIt,
  messagesNl,
  messagesTr,
} from 'calendar-kit';

const LOCALES: { locale: string; messages: CalendarMessagesInput; theme?: string }[] = [
  { locale: 'tr-TR', messages: messagesTr },
  { locale: 'en-US', messages: messagesEn },
  { locale: 'de-DE', messages: messagesDe, theme: 'theme-green' },
  { locale: 'fr-FR', messages: messagesFr },
  { locale: 'es-ES', messages: messagesEs },
  { locale: 'it-IT', messages: messagesIt, theme: 'theme-green' },
  { locale: 'nl-NL', messages: messagesNl },
  { locale: 'ar-EG', messages: messagesAr, theme: 'theme-rose' },
];

/** Independent calendars: different locale, direction, first weekday, theme and mode on one page. */
export function LocalesExample() {
  const [value, setValue] = useState<DateRange>({ start: null, end: null });
  return (
    <div className="grid-auto">
      {LOCALES.map(({ locale, messages, theme }) => (
        <div key={locale} className="card">
          <h4>
            {locale} {locale.startsWith('ar') && '(RTL)'}
          </h4>
          {locale.startsWith('ar') ? (
            <Calendar mode="range" locale={locale} messages={messages} className={theme} value={value} onChange={setValue} disablePast />
          ) : (
            <Calendar mode="single" locale={locale} messages={messages} className={theme} weekdayFormat="narrow" disablePast />
          )}
        </div>
      ))}
    </div>
  );
}
