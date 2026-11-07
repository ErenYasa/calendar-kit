import { useRef, useState } from 'react';
import { Calendar, type DateRange, type RangeEndpoint } from 'calendar-kit';
import './SyncedDialog.css';

// Aynı seçim hem sayfa içinde hem bir diyalogda: iki takvim de paylaşılan
// durumu alır; bu yüzden diyalog mevcut aralıkla açılır ve birindeki değişiklik
// diğerinde de görünür. Diyaloğu kapatmak paylaşılan hiçbir şeyi kaldırmaz.
export default function SyncedDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [endpoint, setEndpoint] = useState<RangeEndpoint>('start');
  const shared = { value: range, onChange: setRange, activeEndpoint: endpoint, onActiveEndpointChange: setEndpoint };
  return (
    <div>
      <Calendar mode="range" {...shared} aria-label="Sayfa içi" />
      <p>
        <button type="button" onClick={() => dialog.current?.showModal()}>
          Diyalogda düzenle
        </button>
      </p>
      <dialog ref={dialog} className="synced-dialog" aria-label="Tarihleri düzenle">
        <div ref={setHost}>
          <Calendar mode="range" {...shared} numberOfMonths={2} tooltip={{ container: host }} aria-label="Diyalogda" />
          <form method="dialog" className="synced-dialog-actions">
            <button type="submit">Tamam</button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
