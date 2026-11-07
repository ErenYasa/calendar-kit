import { Calendar, stayRules } from 'calendar-kit';

// Tab ile ızgaraya girin, ardından aşağıda listelenen tuşları kullanın. Devre dışı
// günler, sebepleri okunabilsin diye odaklanabilir kalır.
export default function Keyboard() {
  return <Calendar mode="range" numberOfMonths={2} rules={stayRules({ minNights: 2, disablePast: true })} />;
}
