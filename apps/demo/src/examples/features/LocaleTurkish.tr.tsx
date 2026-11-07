import { Calendar, messagesTr } from 'calendar-kit';

// Ay ve hafta günü adları Intl’den gelir; tr-TR için hafta pazartesi başlar.
// `messages` takvimin kendi metinlerini (düğmeler, sebepler, duyurular) çevirir.
export default function LocaleTurkish() {
  return <Calendar mode="range" locale="tr-TR" messages={messagesTr} numberOfMonths={2} />;
}
