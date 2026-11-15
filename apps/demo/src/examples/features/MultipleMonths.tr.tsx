import { Calendar } from 'calendar-kit';

// Yan yana üç ay; `stepMonths` her tıklamada bütün bir sayfa ilerletir.
export default function MultipleMonths() {
  return <Calendar mode="range" numberOfMonths={3} stepMonths={3} />;
}
