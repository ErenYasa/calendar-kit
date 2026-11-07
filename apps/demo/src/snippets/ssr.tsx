// Server rendering without Next.js. Pass `today` so the server and the first
// client render agree (no hydration mismatch); without it the server cannot
// know the user's date and renders a placeholder until the client takes over.
import { renderToString } from 'react-dom/server';
import { Calendar, getToday } from 'calendar-kit';

export function renderCalendar(timeZone: string) {
  const today = getToday({ timeZone }); // the user's zone, e.g. from a cookie
  return renderToString(<Calendar mode="single" today={today} />);
}
