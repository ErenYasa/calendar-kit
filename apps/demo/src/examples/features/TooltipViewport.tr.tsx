import { useState } from 'react';
import { Calendar, type DateRange, stayRules } from 'calendar-kit';

const rules = stayRules({ minNights: 3, disablePast: true });

// boundary="viewport": araç ipucu takvimin dışına taşabilir (pencerenin içinde
// kalır) ve takvimin üst bilgisini örtebilir. Önce placement="right" denenir;
// sığmazsa sırasıyla sol, sonra üst ve alt denenir.
export default function TooltipViewport() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div style={{ maxWidth: 360 }}>
      <Calendar
        mode="range"
        rules={rules}
        value={range}
        onChange={setRange}
        tooltip={{ boundary: 'viewport', placement: 'right', offset: 12 }}
        getDayTooltip={({ day }) => (day.disabled && !day.past ? day.reasonText : day.past ? null : `${day.label}: müsait`)}
      />
    </div>
  );
}
