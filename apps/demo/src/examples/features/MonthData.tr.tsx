import { useState } from 'react';
import { Calendar, addMonthsToMonth, getMonth, getToday, stayRules } from 'calendar-kit';
import { useAvailability } from '../shared/availability.tr';

// Ay başına veri: uygulama takvimin render ettiği ayları yükler ve her ayın
// durumunu bildirir. Yüklenen/bilinmeyen aylar iskelet gösterir ve seçimi
// engeller; hata durumunda bir yeniden deneme düğmesi çıkar. Burada görünen iki
// aydan sonraki ay bir kez başarısız olur: hatayı görmek ve yeniden denemek için
// "sonraki" düğmesine basın.
export default function MonthData() {
  const [failMonth] = useState(() => addMonthsToMonth(getMonth(getToday()), 2));
  const { getDataStatus, dayInfo, ensure, retry } = useAvailability({ failMonth });
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      rules={stayRules({ disablePast: true, getDayStatus: (d) => dayInfo(d)?.status })}
      getDataStatus={getDataStatus}
      onRenderedMonthsChange={(e) => ensure(e.months)}
      onRetry={retry}
    />
  );
}
