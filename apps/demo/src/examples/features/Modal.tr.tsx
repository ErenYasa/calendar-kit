import { useRef, useState } from 'react';
import { Calendar, type DateRange } from 'calendar-kit';
import './Modal.css';

// Yerel <dialog> öğesi odak hapsini, Escape tuşunu ve odağın geri dönmesini üstlenir.
// Üst katmanda (top layer) render edildiği için araç ipucu portalı diyaloğun içine konur.
export default function Modal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  return (
    <div>
      <button type="button" onClick={() => dialog.current?.showModal()}>
        {range.end ? `${range.start} → ${range.end}` : 'Tarih seçin'}
      </button>
      <dialog ref={dialog} className="modal" aria-label="Tarih seçin">
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
