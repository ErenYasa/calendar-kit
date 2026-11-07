import { useRef, useState } from 'react';
import { Calendar, type DateRange } from 'calendar-kit';
import './Modal.css';

// A native <dialog> handles focus trapping, Escape and returning focus.
// It renders in the top layer, so the tooltip portal goes into the dialog.
export default function Modal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  return (
    <div>
      <button type="button" onClick={() => dialog.current?.showModal()}>
        {range.end ? `${range.start} → ${range.end}` : 'Choose dates'}
      </button>
      <dialog ref={dialog} className="modal" aria-label="Choose dates">
        <div ref={setHost}>
          <Calendar mode="range" numberOfMonths={2} value={range} onChange={setRange} tooltip={{ container: host }} />
          <form method="dialog" className="modal-actions">
            <button type="submit">Done</button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
