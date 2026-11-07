'use client';
// app/BookingCalendar.tsx — your own Client Component for anything that needs
// functions: rules, callbacks, state.
import { useState } from 'react';
import { Calendar, type CalendarDate, type DateRange, stayRules } from 'calendar-kit';

const rules = stayRules({ minNights: 2, disablePast: true });

export function BookingCalendar({ today }: { today: CalendarDate }) {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return <Calendar mode="range" today={today} rules={rules} value={range} onChange={setRange} numberOfMonths={2} />;
}
