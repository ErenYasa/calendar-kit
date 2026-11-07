import { Calendar } from 'calendar-kit';

// overflow="wrap" (varsayılan): yan yana sığmayan aylar alt satıra geçer.
// İstenen ay sayısı her zaman gösterilir.
// Kutu 520px genişliğinde: iki ay yaklaşık 2 × (7 × 40px + 16px) + 32px gerektirir.
export default function OverflowWrap() {
  return (
    <div style={{ width: 520, maxWidth: '100%' }}>
      <Calendar mode="range" numberOfMonths={2} overflow="wrap" />
    </div>
  );
}
