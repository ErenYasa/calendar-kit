import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, type DateRange, type RangeEndpoint, addDays, getToday, messagesTr, stayRules } from 'calendar-kit';

const TODAY = getToday();

/**
 * Three calendars (inline, modal, portal) driven by one controlled value,
 * one shared active endpoint and one rule set. Visible month, focus, hover
 * and tooltips stay per instance.
 *
 * Focus responsibilities: the app opens/closes the modal and the portal panel,
 * moves focus into them and restores it (here: native <dialog>.showModal()).
 * The calendar manages focus only inside its own grid.
 */
export function SyncExample() {
  const [value, setValue] = useState<DateRange>({ start: null, end: null });
  const [endpoint, setEndpoint] = useState<RangeEndpoint>('start');
  const [panelOpen, setPanelOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const booked = useMemo(() => new Set([addDays(TODAY, 5), addDays(TODAY, 6), addDays(TODAY, 18)]), []);
  const rules = useMemo(() => stayRules({ disablePast: true, minNights: 1, getDayStatus: (d) => (booked.has(d) ? 'booked' : undefined) }), [booked]);

  const shared = {
    mode: 'range' as const,
    locale: 'tr-TR',
    messages: messagesTr,
    value,
    onChange: setValue,
    activeEndpoint: endpoint,
    onActiveEndpointChange: setEndpoint,
    rules,
  };

  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = document.createElement('aside');
    el.className = 'portal-panel';
    document.body.appendChild(el);
    setHost(el);
    return () => el.remove();
  }, []);

  return (
    <div>
      <p>
        Seçim: <code>{JSON.stringify(value)}</code> · sonraki tıklama: <code>{endpoint}</code>
      </p>
      <div className="row">
        <button type="button" onClick={() => dialogRef.current?.showModal()}>
          Modalda aç
        </button>
        <button type="button" onClick={() => setPanelOpen((o) => !o)}>
          {panelOpen ? 'Portal paneli kapat' : 'Portal panelinde aç'}
        </button>
        <button type="button" onClick={() => setValue({ start: null, end: null })}>
          Dışarıdan temizle
        </button>
      </div>
      <div className="card">
        <Calendar {...shared} id="sync-inline" numberOfMonths={2} />
      </div>
      <dialog ref={dialogRef} className="modal" aria-label="Tarih seç">
        <Calendar {...shared} id="sync-modal" numberOfMonths={1} />
        <form method="dialog">
          <button>Kapat</button>
        </form>
      </dialog>
      {panelOpen &&
        host &&
        createPortal(
          <div role="dialog" aria-label="Portal takvim">
            <Calendar {...shared} id="sync-portal" orientation="vertical" numberOfMonths={2} locale="en-GB" messages={undefined} />
            <button type="button" onClick={() => setPanelOpen(false)}>
              Close
            </button>
          </div>,
          host,
        )}
    </div>
  );
}
