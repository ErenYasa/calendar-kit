import { Calendar } from 'calendar-kit';

// overflow="scroll": the months stay in one row and the months area
// scrolls horizontally inside the calendar (the page never overflows).
// The box is 520px wide: two months need about 2 × (7 × 40px + 16px) + 32px.
export default function OverflowScroll() {
  return (
    <div style={{ width: 520, maxWidth: '100%' }}>
      <Calendar mode="range" numberOfMonths={2} overflow="scroll" />
    </div>
  );
}
