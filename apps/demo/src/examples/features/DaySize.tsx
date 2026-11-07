import { Calendar } from 'calendar-kit';

// Larger touch targets (48 px). When a month no longer fits its container,
// the months area scrolls horizontally inside the calendar (the page never
// overflows); `maxBlockSize` adds vertical scrolling.
export default function DaySize() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Calendar mode="single" minDaySize={48} maxBlockSize={300} orientation="vertical" numberOfMonths={2} />
    </div>
  );
}
