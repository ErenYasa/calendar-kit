// Controller dışarıdan (bir ref) ve içeriden (slotlarda ctx.actions).
import { useRef, useState } from 'react';
import { Calendar, type CalendarController, type DateRange, addDays, getToday, stayRules } from 'calendar-kit';

// Uygulamanızın kendi fonksiyonu.
declare function submitBooking(dates: DateRange): void;

const rules = stayRules({ minNights: 2, disablePast: true });

export function QuickPicks() {
  const calendar = useRef<CalendarController>(null);
  const [message, setMessage] = useState('');

  const pick = (nights: number) => {
    const start = addDays(getToday(), 1);
    // Bir tıklama gibi doğrulanır: geçersiz değer uygulanmaz ve
    // onInvalidSelection yerelleştirilmiş mesajı alır.
    const result = calendar.current?.select({ start, end: addDays(start, nights) });
    if (!result?.valid) return;
    setMessage('');
    // select() gezinmez: yeni başlangıcı kendiniz gösterin.
    calendar.current?.goToMonth(start);
  };

  const book = () => {
    const snapshot = calendar.current?.getSnapshot();
    if (snapshot?.selection.mode === 'range' && snapshot.phase === 'complete' && snapshot.validation.valid) submitBooking(snapshot.selection.value);
  };

  return (
    <div>
      <button type="button" onClick={() => pick(1)}>
        1 gece
      </button>
      <button type="button" onClick={() => pick(3)}>
        3 gece
      </button>
      <Calendar
        ref={calendar}
        mode="range"
        rules={rules}
        onInvalidSelection={(e) => setMessage(e.message)}
        // Slotların içinde aynı controller, ctx.actions olarak.
        renderFooter={(ctx) => (
          <button type="button" onClick={() => ctx.actions.reset()}>
            Baştan başla
          </button>
        )}
      />
      <p role="status">{message}</p>
      <button type="button" onClick={book}>
        Rezervasyon yap
      </button>
    </div>
  );
}
