import { useRef, useState } from 'react';
import { Calendar, type DateRange } from 'calendar-kit';
import './Modal.css';

// A native <dialog> handles focus trapping and Escape; focus is returned to the
// trigger in onClose (see below).
// It renders in the top layer, so the tooltip portal goes into the dialog.
export default function Modal() {
  const dialog = useRef<HTMLDialogElement>(null);
  // Safari does not focus a button when it is clicked, so <dialog> would have
  // nothing to return focus to: on close, focus goes back to the trigger explicitly.
  const trigger = useRef<HTMLButtonElement>(null);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  return (
    <div>
      <button ref={trigger} type="button" onClick={() => dialog.current?.showModal()}>
        {range.end ? `${range.start} → ${range.end}` : 'Choose dates'}
      </button>
      <dialog ref={dialog} onClose={() => trigger.current?.focus({ preventScroll: true })} className="modal" aria-label="Choose dates">
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
