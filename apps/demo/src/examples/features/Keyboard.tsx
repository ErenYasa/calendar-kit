import { Calendar, stayRules } from 'calendar-kit';

// Tab into the grid, then use the keys listed below. Disabled days stay
// focusable so their reason can be read.
export default function Keyboard() {
  return <Calendar mode="range" numberOfMonths={2} rules={stayRules({ minNights: 2, disablePast: true })} />;
}
