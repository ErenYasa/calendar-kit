import { useState } from 'react';
import { Calendar } from 'calendar-kit';

// overflow="reduce-months": fewer months are shown when they do not fit;
// onLayoutChange reports the effective number (here as text).
// The box is 520px wide: two months need about 2 × (7 × 40px + 16px) + 32px.
export default function OverflowReduce() {
  const [shown, setShown] = useState<number | null>(null);
  return (
    <div style={{ width: 520, maxWidth: '100%' }}>
      <Calendar mode="range" numberOfMonths={2} overflow="reduce-months" onLayoutChange={(e) => setShown(e.current.effectiveMonths)} />
      <p>Requested 2 months, showing {shown ?? '…'}.</p>
    </div>
  );
}
