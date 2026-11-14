// Controller'a dışarıdan (bir ref ile) ve içeriden (slotlarda ctx.actions ile) erişin.
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
    // Bir tıklama gibi doğrulanır: geçersiz değer uygulanmaz, seçim değişmez ve
    // onInvalidSelection yerelleştirilmiş mesajı alır (burada "1 gece",
    // minNights: 2 kuralı yüzünden reddedilir).
    const result = calendar.current?.select({ start, end: addDays(start, nights) });
    if (!result?.valid) return;
    setMessage('');
    // select() takvimi o tarihe götürmez: yeni başlangıcın ayına kendiniz gidin.
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
        // Slotların içinde aynı controller ctx.actions olarak gelir.
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
