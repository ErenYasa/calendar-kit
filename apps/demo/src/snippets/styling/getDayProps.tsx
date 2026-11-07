import { Calendar } from 'calendar-kit';

// getDayProps(yours) returns props for your element:
// - the day's data-* state attributes, then your props (a data-* of the
//   same name replaces the calendar's), then the calendar's own, which win:
//   ref (merged with yours), type, id, tabIndex, aria-label, aria-disabled,
//   aria-pressed, aria-current, className (cal-day-button +
//   classNames.dayButton + yours) and aria-describedby (merged with yours).
// - your handlers run before the calendar's; call event.preventDefault()
//   to skip the calendar's handling of that event.
export function GuardedDays() {
  return (
    <Calendar
      mode="single"
      renderDay={({ day, getDayProps, defaultContent }) => (
        <div
          {...getDayProps({
            role: 'button',
            className: 'my-day',
            'data-weekday': day.weekday,
            onClick: (e) => {
              // Ctrl/Cmd+click: do something else and keep the selection.
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
