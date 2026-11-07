import { Calendar } from 'calendar-kit';

// Three months side by side; `stepMonths` moves a whole page per click.
export default function MultipleMonths() {
  return <Calendar mode="range" numberOfMonths={3} stepMonths={3} />;
}
