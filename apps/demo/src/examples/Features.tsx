import { useState } from 'react';
import {
  Calendar,
  type CalendarDate,
  type DataStatus,
  type DateRange,
  type TooltipBoundary,
  type TooltipPlacement,
  countDays,
  dayRangeRules,
  getToday,
  messagesTr,
} from 'calendar-kit';

const TODAY = getToday();

/** `highlightToday`: thin circle + "Bugün" tooltip, can be turned off. */
export function TodayExample() {
  const [show, setShow] = useState(true);
  return (
    <Calendar
      mode="single"
      locale="tr-TR"
      messages={messagesTr}
      highlightToday={show}
      renderFooter={() => (
        <div className="row">
          <label>
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> <code>highlightToday</code>
          </label>
          <span className="note">
            {show ? (
              <>
                <span className="swatch" style={{ border: '1.5px solid #9aa0a6' }} /> İnce çember = bugün ({TODAY}). Üzerine gelince “Bugün” yazar.
              </>
            ) : (
              'Bugün işareti kapalı (ekran okuyucu yine “bugün” okur).'
            )}
          </span>
        </div>
      )}
    />
  );
}

/** Start/end look (outer half-ring) and `singleDayFirst`. */
export function EndpointsExample() {
  const [singleDayFirst, setSingleDayFirst] = useState(true);
  const [value, setValue] = useState<DateRange>({ start: null, end: null });
  const days = countDays(value);
  return (
    <Calendar
      mode="range"
      locale="tr-TR"
      messages={messagesTr}
      numberOfMonths={2}
      disablePast
      value={value}
      onChange={setValue}
      rules={dayRangeRules({ singleDayFirst })}
      renderFooter={(ctx) => (
        <div className="row">
          <label>
            <input
              type="checkbox"
              checked={singleDayFirst}
              onChange={(e) => {
                setSingleDayFirst(e.target.checked);
                ctx.actions.clear();
              }}
            />{' '}
            <code>singleDayFirst</code>
          </label>
          <span className="note">
            {days === 1 ? `Tek gün: ${value.start}` : days ? `${value.start} → ${value.end} (${days} gün)` : singleDayFirst ? 'İlk tıklama tek günü seçer; ikinci tıklama aralığa genişletir.' : 'Başlangıç, sonra bitiş seçin (tek gün için aynı güne iki kez).'}
          </span>
        </div>
      )}
    />
  );
}

/** `tooltip.boundary` + `placement` in a narrow container. */
export function TooltipExample() {
  const [boundary, setBoundary] = useState<TooltipBoundary>('calendar');
  const [placement, setPlacement] = useState<TooltipPlacement>('top');
  const [value, setValue] = useState<CalendarDate | null>(null);
  return (
    <div>
      <div className="row controls">
        <label>
          boundary{' '}
          <select value={boundary} onChange={(e) => setBoundary(e.target.value as TooltipBoundary)}>
            <option value="calendar">calendar (takvim içinde kalır)</option>
            <option value="viewport">viewport (dışarı taşabilir)</option>
          </select>
        </label>
        <label>
          placement{' '}
          <select value={placement} onChange={(e) => setPlacement(e.target.value as TooltipPlacement)}>
            <option>top</option>
            <option>bottom</option>
            <option>left</option>
            <option>right</option>
          </select>
        </label>
        <span className="note">Bir güne tıklayın (özellikle sağ kenar veya üst satır): uzun metin satır kırar, kesilmez.</span>
      </div>
      <div className="narrow">
        <Calendar
          mode="single"
          locale="tr-TR"
          messages={messagesTr}
          value={value}
          onChange={setValue}
          maxBlockSize={300}
          tooltip={{ boundary, placement }}
          getDayTooltip={({ day }) =>
            day.selected ? { content: 'Bu uzun bir açıklama metni: sınıra göre satır kırar ve hiçbir zaman kesilmez.', persistent: true } : null
          }
        />
      </div>
    </div>
  );
}

/** Four ways to present "more dates" controls. */
export function LoadMoreExample() {
  const common = {
    mode: 'single' as const,
    locale: 'tr-TR',
    messages: messagesTr,
    navigation: 'continuous' as const,
    orientation: 'vertical' as const,
    numberOfMonths: 1,
    monthsPerLoad: 1,
    loadDirections: 'both' as const,
    maxBlockSize: 340,
    minDaySize: 34,
  };
  return (
    <div className="grid-auto">
      <div className="card">
        <h4>Varsayılan</h4>
        <Calendar {...common} />
      </div>
      <div className="card">
        <h4>
          <code>loadMoreLabels</code> (ReactNode)
        </h4>
        <Calendar
          {...common}
          loadMoreLabels={{
            previous: <span>↑ Önceki ay</span>,
            next: (
              <span>
                ↓ Daha fazla tarih göster <small className="muted">(+1 ay)</small>
              </span>
            ),
          }}
        />
      </div>
      <div className="card">
        <h4>
          <code>renderLoadMore</code>
        </h4>
        <Calendar
          {...common}
          renderLoadMore={({ direction, loadMore }) => (
            <button type="button" className="link" onClick={loadMore}>
              {direction === 'next' ? 'Sonraki ayı ekle →' : '← Önceki ayı ekle'}
            </button>
          )}
        />
      </div>
      <div className="card">
        <h4>
          <code>loadMore="manual"</code> + footer
        </h4>
        <Calendar
          {...common}
          loadMore="manual"
          renderFooter={(ctx) => (
            <div className="row">
              <button type="button" className="pill" onClick={() => ctx.actions.loadMore('previous')}>
                Önceki
              </button>
              <button type="button" className="pill" onClick={() => ctx.actions.loadMore('next')}>
                Sonraki
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
}

/** Default loading = equal skeleton pills, no visible "Yükleniyor" text. */
export function SkeletonExample() {
  const [loading, setLoading] = useState(true);
  const [custom, setCustom] = useState(false);
  return (
    <Calendar
      mode="single"
      locale="tr-TR"
      messages={messagesTr}
      numberOfMonths={2}
      getDataStatus={(): DataStatus => (loading ? 'loading' : 'loaded')}
      renderLoading={custom ? ({ scope, months }) => (scope === 'month' ? <span className="badge-loading">{months[0]} yükleniyor</span> : null) : undefined}
      renderFooter={() => (
        <div className="row">
          <label>
            <input type="checkbox" checked={loading} onChange={(e) => setLoading(e.target.checked)} /> Ay verisi yükleniyor
          </label>
          <label>
            <input type="checkbox" checked={custom} onChange={(e) => setCustom(e.target.checked)} /> Ek gösterge (<code>renderLoading</code>)
          </label>
          <span className="note">Varsayılan: yalnızca eşit boyutlu iskelet; ekran okuyucu “yükleniyor” duyurusu alır.</span>
        </div>
      )}
    />
  );
}
