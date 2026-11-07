import { Calendar } from 'calendar-kit';

// overflow="wrap" (default): months that do not fit side by side move to
// the next row. The requested number of months is always shown.
// The box is 520px wide: two months need about 2 × (7 × 40px + 16px) + 32px.
export default function OverflowWrap() {
  return (
    <div style={{ width: 520, maxWidth: '100%' }}>
      <Calendar mode="range" numberOfMonths={2} overflow="wrap" />
    </div>
  );
}
