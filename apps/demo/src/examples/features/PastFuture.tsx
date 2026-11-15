import { Calendar } from 'calendar-kit';
import './PastFuture.css';

// disablePast: days before today cannot be picked (e.g. a booking date).
// disableFuture: days after today cannot be picked (e.g. a date of birth or a report).
// Unlike minDate/maxDate they do not limit navigation: both calendars can still
// move to any month, only the days on the blocked side of today stay disabled.
export default function PastFuture() {
  return (
    <div className="past-future">
      <div>
        <p className="past-future-label">disablePast · booking date</p>
        <Calendar mode="single" disablePast aria-label="Booking date" />
      </div>
      <div>
        <p className="past-future-label">disableFuture · report date</p>
        <Calendar mode="single" disableFuture aria-label="Report date" />
      </div>
    </div>
  );
}
