import { useState } from 'react';
import { Calendar, type CalendarDate } from 'calendar-kit';
import './RenderDayDiv.tr.css';

// <button> olmayan bir gün: getDayProps({ type: null }) `type` niteliği yazmaz
// ve role="button" ekler (başka bir rol için kendi `role`’ünüzü verin).
// Takvim bu öğeye de roving tabIndex, ok tuşlarıyla gezinme, ARIA ve data-*
// durumunu verir; Enter ve Space tuşlarını da kendisi işler (gerçek bir düğme
// bunları zaten tıklamaya çevirirdi).
export default function RenderDayDiv() {
  const [date, setDate] = useState<CalendarDate | null>(null);
  return (
    <div>
      <Calendar
        mode="single"
        disablePast
        value={date}
        onChange={setDate}
        renderDay={({ getDayProps, defaultContent }) => (
          <div {...getDayProps({ type: null, className: 'rdd-day' })}>{defaultContent}</div>
        )}
      />
      <p role="status">Seçili: {date ?? 'yok'} (Tab ile bir güne gidin, sonra ok tuşlarını ve Enter ya da Space’i kullanın)</p>
    </div>
  );
}
