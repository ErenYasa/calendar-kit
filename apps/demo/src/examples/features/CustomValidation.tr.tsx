import { useState } from 'react';
import { Calendar, type DateRange, type SelectionRules, eachDay, getWeekday } from 'calendar-kit';

// Paketin bilmediği bir kural: bir aralık en fazla bir hafta sonu içerebilir.
// `validateSelection` önerilen her seçim için çalışır; bir sorun döndürmek
// seçimi reddeder ve sorunun `message` metni duyurulur, araç ipucunda gösterilir.
const rules: SelectionRules = {
  disablePast: true,
  validateSelection: (selection) => {
    if (selection.mode !== 'range' || !selection.value.start || !selection.value.end) return null;
    const saturdays = eachDay(selection.value.start, selection.value.end).filter((d) => getWeekday(d) === 6);
    return saturdays.length > 1 ? { code: 'custom', message: 'Rezervasyon başına en fazla bir hafta sonu' } : null;
  },
};

export default function CustomValidation() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return <Calendar mode="range" numberOfMonths={2} rules={rules} value={range} onChange={setRange} />;
}
