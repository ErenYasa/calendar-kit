import { Calendar } from 'calendar-kit';

// Months stacked vertically, independent of the device. `maxBlockSize` keeps
// the stack inside a scroll area.
export default function Vertical() {
  return <Calendar mode="range" orientation="vertical" numberOfMonths={3} maxBlockSize={420} />;
}
