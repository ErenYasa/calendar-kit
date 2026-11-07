import { Calendar } from 'calendar-kit';

// A report date in the past: with monthPosition={2} the current month (the
// reference) is the second one, so the previous month and this month are
// shown. disableFuture only blocks days after today; it does not move the window.
export default function DisableFutureWindow() {
  return <Calendar mode="single" numberOfMonths={2} monthPosition={2} disableFuture />;
}
