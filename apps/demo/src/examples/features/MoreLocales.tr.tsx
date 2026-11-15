import { Calendar, messagesEs, messagesFr, messagesIt, messagesNl } from 'calendar-kit';
import './MoreLocales.css';

// Aynı sayfada birbirinden bağımsız dört takvim; her birinin kendi yerel ayarı,
// mesaj paketi ve (yerel ayardan gelen) hafta başlangıcı var. Hiçbir şey global
// değildir: örnekler dili, yönü veya stilleri paylaşmaz.
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
