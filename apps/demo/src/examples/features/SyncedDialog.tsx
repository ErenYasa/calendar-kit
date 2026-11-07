import { useRef, useState } from 'react';
import { Calendar, type DateRange, type RangeEndpoint } from 'calendar-kit';
import './SyncedDialog.css';

// The same selection inline and in a dialog: both calendars receive the shared
// state, so the dialog opens on the current range and a change in either is
// visible in the other. Closing the dialog unmounts nothing shared.
export default function SyncedDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [endpoint, setEndpoint] = useState<RangeEndpoint>('start');
  const shared = { value: range, onChange: setRange, activeEndpoint: endpoint, onActiveEndpointChange: setEndpoint };
  return (
    <div>
      <Calendar mode="range" {...shared} aria-label="Inline" />
      <p>
        <button type="button" onClick={() => dialog.current?.showModal()}>
          Edit in a dialog
        </button>
      </p>
      <dialog ref={dialog} className="synced-dialog" aria-label="Edit dates">
        <div ref={setHost}>
          <Calendar mode="range" {...shared} numberOfMonths={2} tooltip={{ container: host }} aria-label="In dialog" />
          <form method="dialog" className="synced-dialog-actions">
            <button type="submit">Done</button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
