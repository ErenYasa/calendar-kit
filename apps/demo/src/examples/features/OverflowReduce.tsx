import { useState } from 'react';
import { Calendar } from 'calendar-kit';

// overflow="reduce-months": fewer months are shown while they do not fit, and
// the requested number comes back when there is room again. onLayoutChange
// reports the effective number (here as text). The box starts at full width
// (two months fit) and can be resized: drag its bottom-right corner below about
// 650px (2 × (7 × 40px + 16px) plus gaps) to see one month; the reference month
// stays the one shown.
export default function OverflowReduce() {
  const [shown, setShown] = useState<number | null>(null);
  return (
    <div style={{ width: '100%', minWidth: 240, maxWidth: '100%', resize: 'horizontal', overflow: 'auto', boxSizing: 'border-box', border: '1px dashed #c4c8cf', padding: 8 }}>
      <Calendar mode="range" numberOfMonths={2} overflow="reduce-months" onLayoutChange={(e) => setShown(e.current.effectiveMonths)} />
      <p>Requested 2 months, showing {shown ?? '…'}. Drag the bottom-right corner to make the box narrower.</p>
    </div>
  );
}
