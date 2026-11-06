// app/page.tsx — a Server Component.
// Calendar comes from the client entry (a 'use client' boundary), so it can be
// rendered here with serializable props. Pure helpers come from the core
// entry, which never loads React, and run on the server.
import { Calendar } from 'calendar-kit/client';
import { addDays, toCalendarDate } from 'calendar-kit/core';
import { BookingCalendar } from './BookingCalendar';

export default function Page() {
  const today = toCalendarDate('2026-10-12'); // from your request/time zone logic
  return (
    <main>
      <Calendar mode="single" today={today} defaultValue={addDays(today, 2)} />
      {/* Functions (rules, onChange) cannot cross the server/client boundary: */}
      <BookingCalendar today={today} />
    </main>
  );
}
