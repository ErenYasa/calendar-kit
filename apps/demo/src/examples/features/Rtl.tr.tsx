import { Calendar, messagesAr } from 'calendar-kit';

// Arapça: sağdan sola (RTL) yerleşim (yerel ayardan gelir; `direction` bunu
// geçersiz kılar), Arap-Hint rakamları ve aynalanmış ok tuşları.
export default function Rtl() {
  return <Calendar mode="range" locale="ar-EG" messages={messagesAr} numberOfMonths={2} />;
}
