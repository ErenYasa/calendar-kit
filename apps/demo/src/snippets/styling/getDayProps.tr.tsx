import { Calendar } from 'calendar-kit';

// getDayProps(sizinkiler) öğeniz için prop’ları döndürür:
// - önce günün data-* durum nitelikleri, sonra sizin prop’larınız (aynı adlı
//   bir data-* takviminkinin yerine geçer), en son da takvimin kendi
//   prop’ları; bunlar kazanır: ref (sizinkiyle birleştirilir), type="button"
//   (`type: null` ile yoktur; bu durumda siz bir role vermezseniz role="button"
//   eklenir), id, tabIndex, aria-label, aria-disabled, aria-pressed,
//   aria-current, className (cal-day-button + classNames.dayButton + sizinki)
//   ve aria-describedby (sizinkiyle birleştirilir).
// - sizin işleyicileriniz takviminkilerden önce çalışır; takvimin o olayı
//   işlemesini atlamak için event.preventDefault() çağırın.
export function GuardedDays() {
  return (
    <Calendar
      mode="single"
      renderDay={({ day, getDayProps, defaultContent }) => (
        <div
          {...getDayProps({
            // <button> değil: type niteliği yok, role="button"; Enter ve Space’i
            // takvim işler.
            type: null,
            className: 'my-day',
            'data-weekday': day.weekday,
            onClick: (e) => {
              // Ctrl/Cmd+tıklama: başka bir şey yapın ve seçimi koruyun.
              if (e.metaKey || e.ctrlKey) e.preventDefault();
            },
          })}
        >
          {defaultContent}
        </div>
      )}
    />
  );
}
