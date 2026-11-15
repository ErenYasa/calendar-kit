// app/page.tsx — bir Server Component.
// Calendar, client giriş noktasından ('use client' sınırı) gelir; bu yüzden
// burada serileştirilebilir prop'larla render edilebilir. Saf yardımcı fonksiyonlar
// React'i hiç yüklemeyen core giriş noktasından gelir ve sunucuda çalışır.
import { Calendar } from 'calendar-kit/client';
import { addDays, toCalendarDate } from 'calendar-kit/core';
import { BookingCalendar } from './BookingCalendar.tr';

export default function Page() {
  const today = toCalendarDate('2026-10-12'); // isteğe ve saat dilimi mantığınıza göre belirleyin
  return (
    <main>
      <Calendar mode="single" today={today} defaultValue={addDays(today, 2)} />
      {/* Fonksiyonlar (kurallar, onChange) sunucu/istemci sınırını geçemez: */}
      <BookingCalendar today={today} />
    </main>
  );
}
