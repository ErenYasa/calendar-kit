import { Calendar } from 'calendar-kit';
import './PastFuture.css';

// disablePast: bugünden önceki günler seçilemez (ör. bir rezervasyon tarihi).
// disableFuture: bugünden sonraki günler seçilemez (ör. doğum tarihi veya rapor).
// minDate/maxDate’ten farklı olarak gezinmeyi sınırlamazlar: iki takvim de her
// aya geçebilir; yalnızca bugünün engellenen tarafındaki günler devre dışı kalır.
export default function PastFuture() {
  return (
    <div className="past-future">
      <div>
        <p className="past-future-label">disablePast · rezervasyon tarihi</p>
        <Calendar mode="single" disablePast aria-label="Rezervasyon tarihi" />
      </div>
      <div>
        <p className="past-future-label">disableFuture · rapor tarihi</p>
        <Calendar mode="single" disableFuture aria-label="Rapor tarihi" />
      </div>
    </div>
  );
}
