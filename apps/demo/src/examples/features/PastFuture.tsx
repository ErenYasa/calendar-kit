import { Calendar } from 'calendar-kit';
import './PastFuture.css';

// disablePast: days before today cannot be picked (bookings).
// disableFuture: days after today cannot be picked (e.g. a date of birth or a report).
export default function PastFuture() {
  return (
    <div className="past-future">
      <Calendar mode="single" disablePast aria-label="Booking date" />
      <Calendar mode="single" disableFuture aria-label="Report date" />
    </div>
  );
}
