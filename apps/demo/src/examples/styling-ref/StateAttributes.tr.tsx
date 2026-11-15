import { useState } from 'react';
import { Calendar, addDays, getToday, type DayState } from 'calendar-kit';
import './StateAttributes.tr.css';

// Her durumun kendi rengi var. Takvim durumu gün hücresine ve gün düğmesine
// data-* nitelikleri olarak koyar; `classNames` bunların yanına kendi sınıf
// adlarımızı ekler, CSS dosyası da `sınıf + data-*` seçer.
const modifiers = {
  // Özel bir modifier: true → hücrede ve düğmede `data-mod-weekend`.
  weekend: (day: DayState) => day.weekday === 0 || day.weekday === 6,
};

const legend = [
  ['today', 'data-today'],
  ['start', 'data-range-start'],
  ['end', 'data-range-end'],
  ['band', 'data-band'],
  ['preview', 'data-band-preview'],
  ['weekend', 'data-mod-weekend'],
  ['off', 'data-unavailable'],
] as const;

export default function StateAttributes() {
  const [today] = useState(() => getToday());
  return (
    <div className="sr-demo">
      <Calendar
        mode="range"
        numberOfMonths={2}
        today={today}
        disablePast
        maxDate={addDays(today, 40)}
        defaultValue={{ start: addDays(today, 2), end: addDays(today, 6) }}
        modifiers={modifiers}
        className="sr-states"
        classNames={{ dayCell: 'sr-cell', dayButton: 'sr-btn' }}
      />
      <ul className="sr-legend">
        {legend.map(([key, attr]) => (
          <li key={key} className="sr-key" data-key={key}>
            {attr}
          </li>
        ))}
      </ul>
    </div>
  );
}
