import { Calendar } from 'calendar-kit';

// Cihazdan bağımsız olarak alt alta dizilmiş aylar. `maxBlockSize` bu yığını
// bir kaydırma alanının içinde tutar.
export default function Vertical() {
  return <Calendar mode="range" orientation="vertical" numberOfMonths={3} maxBlockSize={420} />;
}
