import { useState } from 'react';
import { Calendar, addDays, addMonths, getToday } from 'calendar-kit';
import './LoadMoreRender.css';

// renderLoadMore kontrolün tamamının yerini alır. `direction`, `canLoad`,
// `loading` (yeni eklenen aylar verilerini hâlâ yüklüyor), `loadMore()` ve
// varsayılan `label` size verilir. minDate/maxDate’e ulaşıldığında da
// `canLoad: false` ile çağrılır (o durumda loadMore() hiçbir şey yapmaz);
// böylece son durumu gösterebilir.
export default function LoadMoreRender() {
  const [today] = useState(() => getToday());
  return (
    <div style={{ maxWidth: 380 }}>
      <Calendar
        mode="single"
        orientation="vertical"
        navigation="continuous"
        loadDirections="both"
        numberOfMonths={1}
        minDate={addDays(today, -60)}
        maxDate={addMonths(today, 2)}
        maxBlockSize={420}
        renderLoadMore={({ direction, canLoad, loadMore }) =>
          canLoad ? (
            <button type="button" className="add-month" onClick={loadMore}>
              {direction === 'previous' ? '← Önceki ayı ekle' : 'Sonraki ayı ekle →'}
            </button>
          ) : (
            <p className="no-more">{direction === 'previous' ? 'Daha önceki tarih yok' : 'Daha sonraki tarih yok'}</p>
          )
        }
      />
    </div>
  );
}
