import { Calendar, messagesEs, messagesFr, messagesIt, messagesNl } from 'calendar-kit';
import './MoreLocales.css';

// Four independent calendars on one page, each with its own locale, message
// pack and week start (from the locale). Nothing is global: instances do not
// share language, direction or styles.
const LOCALES = [
  { locale: 'fr-FR', messages: messagesFr },
  { locale: 'es-ES', messages: messagesEs },
  { locale: 'it-IT', messages: messagesIt },
  { locale: 'nl-NL', messages: messagesNl },
];

export default function MoreLocales() {
  return (
    <div className="locales">
      {LOCALES.map(({ locale, messages }) => (
        <Calendar key={locale} mode="single" locale={locale} messages={messages} minDaySize={34} aria-label={locale} />
      ))}
    </div>
  );
}
