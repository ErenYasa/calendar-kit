import { useRef, useState } from 'react';
import { Calendar, type DateRange } from 'calendar-kit';
import './Modal.css';

// Yerel <dialog> öğesi odak hapsini ve Escape tuşunu üstlenir; odak onClose içinde
// tetikleyiciye geri verilir (aşağıya bakın).
// Üst katmanda (top layer) render edildiği için tooltip portalı diyaloğun içine konur.
export default function Modal() {
  const dialog = useRef<HTMLDialogElement>(null);
  // Safari bir düğmeye tıklanınca ona odaklanmaz; <dialog> kapanırken odağı
  // geri verecek öğe olmaz. Bu yüzden odak kapanışta tetikleyiciye açıkça döner.
  const trigger = useRef<HTMLButtonElement>(null);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  return (
    <div>
      <button ref={trigger} type="button" onClick={() => dialog.current?.showModal()}>
        {range.end ? `${range.start} → ${range.end}` : 'Tarih seçin'}
      </button>
      <dialog ref={dialog} onClose={() => trigger.current?.focus({ preventScroll: true })} className="modal" aria-label="Tarih seçin">
        <div ref={setHost}>
          <Calendar mode="range" numberOfMonths={2} value={range} onChange={setRange} tooltip={{ container: host }} />
          <form method="dialog" className="modal-actions">
            <button type="submit">Tamam</button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
