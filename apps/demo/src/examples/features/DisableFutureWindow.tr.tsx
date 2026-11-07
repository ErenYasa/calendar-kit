import { Calendar } from 'calendar-kit';

// Geçmişte bir rapor tarihi: monthPosition={2} ile içinde bulunulan ay (referans
// ay) ikinci sıradadır, böylece önceki ay ve bu ay gösterilir. disableFuture
// yalnızca bugünden sonraki günleri engeller; görünen pencereyi kaydırmaz.
export default function DisableFutureWindow() {
  return <Calendar mode="single" numberOfMonths={2} monthPosition={2} disableFuture />;
}
