// The controller from outside (a ref) and from inside (ctx.actions in slots).
import { useRef, useState } from 'react';
import { Calendar, type CalendarController, type DateRange, addDays, getToday, stayRules } from 'calendar-kit';

// Your app's own function.
declare function submitBooking(dates: DateRange): void;

const rules = stayRules({ minNights: 2, disablePast: true });

export function QuickPicks() {
  const calendar = useRef<CalendarController>(null);
  const [message, setMessage] = useState('');

  const pick = (nights: number) => {
    const start = addDays(getToday(), 1);
    // Validated like a click: an invalid value is not applied and
    // onInvalidSelection receives the localised message.
    const result = calendar.current?.select({ start, end: addDays(start, nights) });
    if (!result?.valid) return;
    setMessage('');
    // select() does not navigate: show the new start.
    calendar.current?.goToMonth(start);
  };

  const book = () => {
    const snapshot = calendar.current?.getSnapshot();
    if (snapshot?.selection.mode === 'range' && snapshot.phase === 'complete' && snapshot.validation.valid) submitBooking(snapshot.selection.value);
  };

  return (
    <div>
      <button type="button" onClick={() => pick(1)}>
        1 night
      </button>
      <button type="button" onClick={() => pick(3)}>
        3 nights
      </button>
      <Calendar
        ref={calendar}
        mode="range"
        rules={rules}
        onInvalidSelection={(e) => setMessage(e.message)}
        // The same controller inside slots, as ctx.actions.
        renderFooter={(ctx) => (
          <button type="button" onClick={() => ctx.actions.reset()}>
            Start over
          </button>
        )}
      />
      <p role="status">{message}</p>
      <button type="button" onClick={book}>
        Book
      </button>
    </div>
  );
}
