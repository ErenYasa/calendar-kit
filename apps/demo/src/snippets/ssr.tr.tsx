// Next.js olmadan sunucuda render etme. Sunucu ile ilk istemci render'ı aynı
// sonucu versin (hydration uyuşmazlığı olmasın) diye `today` verin; verilmezse
// sunucu kullanıcının tarihini bilemez ve istemci devralana kadar boş bir
// yer tutucu render eder.
import { renderToString } from 'react-dom/server';
import { Calendar, getToday } from 'calendar-kit';

export function renderCalendar(timeZone: string) {
  const today = getToday({ timeZone }); // kullanıcının saat dilimi, ör. bir çerezden
  return renderToString(<Calendar mode="single" today={today} />);
}
