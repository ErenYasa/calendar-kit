import { useState } from 'react';
import { Calendar } from 'calendar-kit';

// overflow="reduce-months": aylar sığmadığında daha az ay gösterilir;
// onLayoutChange gerçekte gösterilen ay sayısını bildirir (burada metin olarak).
// Kutu 520px genişliğinde: iki ay yaklaşık 2 × (7 × 40px + 16px) + 32px gerektirir.
export default function OverflowReduce() {
  const [shown, setShown] = useState<number | null>(null);
  return (
    <div style={{ width: 520, maxWidth: '100%' }}>
      <Calendar mode="range" numberOfMonths={2} overflow="reduce-months" onLayoutChange={(e) => setShown(e.current.effectiveMonths)} />
      <p>2 ay istendi, {shown ?? '…'} ay gösteriliyor.</p>
    </div>
  );
}
