import { Calendar } from 'calendar-kit';
import './PastFuture.css';

// disablePast: bugünden önceki günler seçilemez (rezervasyonlar).
// disableFuture: bugünden sonraki günler seçilemez (ör. doğum tarihi veya rapor).
export default function PastFuture() {
  return (
    <div className="past-future">
      <Calendar mode="single" disablePast aria-label="Rezervasyon tarihi" />
      <Calendar mode="single" disableFuture aria-label="Rapor tarihi" />
    </div>
  );
}
