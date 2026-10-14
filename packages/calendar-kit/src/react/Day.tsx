import { type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode, memo } from 'react';
import type { CalendarDate } from '../date/calendarDate';
import type { CalendarClassNames, DayProps, DayPropsInput, DayRenderContext, DayRenderProps, DayState, DefaultDayData } from './types';
import { PREFIX, composeHandlers, cx, mergeRefs, srOnlyStyle } from './utils';

/** Stable action bag created once per calendar instance. */
export interface DayActions {
  activate(date: CalendarDate, source: 'pointer' | 'keyboard', pointerType?: string): void;
  keyDown(e: KeyboardEvent<HTMLElement>, date: CalendarDate): void;
  hover(date: CalendarDate | null): void;
  focus(date: CalendarDate): void;
  blur(date: CalendarDate): void;
  pointerDown(date: CalendarDate, pointerType: string): void;
  registerRef(date: CalendarDate, el: HTMLElement | null): void;
}

export interface DayCellProps<TDayData> {
  day: DayState;
  stateKey: string;
  data: TDayData | undefined;
  instanceId: string;
  tabbable: boolean;
  tooltipId: string | null;
  actions: DayActions;
  classNames: CalendarClassNames | undefined;
  unstyled: boolean;
  description: string;
  ariaLabel: string;
  /** Position of this cell in the drawn band (selected range or hover preview). */
  band: 'start' | 'mid' | 'end' | null;
  bandPreview: boolean;
  renderDay?: (props: DayRenderProps<TDayData>) => ReactNode;
  renderDayContent?: (ctx: DayRenderContext<TDayData>) => ReactNode;
}

function resolve(value: CalendarClassNames['dayCell'], day: DayState): string | undefined {
  return typeof value === 'function' ? value(day) : value;
}

/** `data-*` attributes describing the visual state; the single styling contract. */
export function dayDataAttributes(day: DayState): Record<string, string | undefined> {
  const flag = (b: boolean) => (b ? '' : undefined);
  const attrs: Record<string, string | undefined> = {
    'data-date': day.date,
    'data-today': flag(day.today),
    'data-past': flag(day.past),
    'data-disabled': flag(day.disabled),
    'data-unavailable': flag(day.unavailable),
    'data-out-of-schedule': flag(day.outOfSchedule),
    'data-selected': flag(day.selected),
    'data-range-start': flag(day.selectedStart),
    'data-range-end': flag(day.selectedEnd),
    'data-in-range': flag(day.inRange),
    'data-included': flag(day.included),
    'data-preview': flag(day.inPreviewRange),
    'data-preview-start': flag(day.previewStart),
    'data-preview-end': flag(day.previewEnd),
    'data-focused': flag(day.focused),
    'data-hovered': flag(day.hovered),
    'data-loading': flag(day.loading),
    'data-status': day.dataStatus === 'loaded' ? undefined : day.dataStatus,
    'data-reason': day.reason?.code,
    'data-day-reason': day.reason?.dayReason,
    'data-week-start': flag(day.weekStart),
    'data-week-end': flag(day.weekEnd),
    'data-month-start': flag(day.monthStart),
    'data-month-end': flag(day.monthEnd),
  };
  for (const m in day.modifiers) if (day.modifiers[m]) attrs[`data-mod-${m}`] = '';
  return attrs;
}

function isDefaultDayData(data: unknown): data is DefaultDayData {
  return !!data && typeof data === 'object' && ('label' in data || 'badge' in data || 'icon' in data || 'markers' in data);
}

export function DefaultDayContent({ day, data, unstyled }: { day: DayState; data: unknown; unstyled: boolean }) {
  const p = (s: string) => (unstyled ? undefined : `${PREFIX}-${s}`);
  const number = <span className={p('day-number')}>{day.dayText}</span>;
  if (!isDefaultDayData(data)) return number;
  return (
    <>
      {data.icon != null && (
        <span className={p('day-icon')} aria-hidden="true">
          {data.icon}
        </span>
      )}
      {number}
      {data.badge != null && (
        <span className={p('day-badge')} aria-hidden="true">
          {data.badge}
        </span>
      )}
      {data.label != null && (
        <span className={p('day-label')} aria-hidden="true">
          {data.label}
        </span>
      )}
      {data.markers && data.markers.length > 0 && (
        <span className={p('day-markers')} aria-hidden="true">
          {data.markers.map((m, i) => (
            <span key={i} className={cx(p('day-marker'), m.className)} style={m.color ? { background: m.color } : undefined} />
          ))}
        </span>
      )}
    </>
  );
}

function DayCellImpl<TDayData>(props: DayCellProps<TDayData>) {
  const { day, data, actions, classNames, unstyled, instanceId } = props;
  const p = (s: string) => (unstyled ? undefined : `${PREFIX}-${s}`);
  const descId = props.description ? `${instanceId}-desc-${day.date}` : undefined;
  const ctx: DayRenderContext<TDayData> = { day, data };

  const getDayProps = (user: DayPropsInput = {}): DayProps => {
    const { ref: userRef, className, onClick, onKeyDown, onPointerEnter, onPointerLeave, onFocus, onBlur, onPointerDown, ...rest } = user;
    const describedBy = cx(descId, props.tooltipId ?? undefined, rest['aria-describedby']);
    return {
      ...dayDataAttributes(day),
      ...rest,
      ref: mergeRefs<HTMLElement>((el) => actions.registerRef(day.date, el), userRef),
      type: 'button',
      id: `${instanceId}-day-${day.date}`,
      tabIndex: props.tabbable ? 0 : -1,
      className: cx(p('day-button'), resolve(classNames?.dayButton, day), className),
      'aria-label': props.ariaLabel,
      'aria-describedby': describedBy || undefined,
      'aria-disabled': day.disabled || undefined,
      'aria-pressed': day.readOnly ? undefined : day.selected || day.selectedStart || day.selectedEnd,
      'aria-current': day.today ? 'date' : undefined,
      onClick: composeHandlers<MouseEvent<HTMLElement>>(onClick, (e) => {
        // `detail === 0` means keyboard-generated click (Enter/Space on a button).
        actions.activate(day.date, e.detail === 0 ? 'keyboard' : 'pointer');
      }),
      onKeyDown: composeHandlers<KeyboardEvent<HTMLElement>>(onKeyDown, (e) => actions.keyDown(e, day.date)),
      onPointerEnter: composeHandlers<PointerEvent<HTMLElement>>(onPointerEnter, (e) => {
        if (e.pointerType !== 'touch') actions.hover(day.date);
      }),
      onPointerLeave: composeHandlers<PointerEvent<HTMLElement>>(onPointerLeave, () => actions.hover(null)),
      onPointerDown: composeHandlers<PointerEvent<HTMLElement>>(onPointerDown, (e) => actions.pointerDown(day.date, e.pointerType)),
      onFocus: composeHandlers<FocusEvent<HTMLElement>>(onFocus, () => actions.focus(day.date)),
      onBlur: composeHandlers<FocusEvent<HTMLElement>>(onBlur, () => actions.blur(day.date)),
    } as DayProps;
  };

  const defaultContent = <DefaultDayContent day={day} data={data} unstyled={unstyled} />;

  return (
    <div
      role="gridcell"
      aria-selected={day.readOnly ? undefined : day.selected || day.inRange}
      className={cx(p('day'), resolve(classNames?.dayCell, day))}
      {...dayDataAttributes(day)}
      data-band={props.band ?? undefined}
      data-band-preview={props.band && props.bandPreview ? '' : undefined}
    >
      {props.band && <span className={cx(p('range-bg'), classNames?.rangeBackground)} aria-hidden="true" />}
      {props.renderDay ? (
        props.renderDay({ ...ctx, getDayProps, defaultContent })
      ) : (
        <button {...(getDayProps() as object)}>
          <span className={cx(p('day-content'), resolve(classNames?.dayContent, day))}>
            {props.renderDayContent ? props.renderDayContent(ctx) : defaultContent}
          </span>
        </button>
      )}
      {descId && (
        <span id={descId} style={srOnlyStyle}>
          {props.description}
        </span>
      )}
    </div>
  );
}

export const DayCell = memo(DayCellImpl, (a, b) => {
  return (
    a.stateKey === b.stateKey &&
    a.data === b.data &&
    a.tabbable === b.tabbable &&
    a.tooltipId === b.tooltipId &&
    a.description === b.description &&
    a.ariaLabel === b.ariaLabel &&
    a.band === b.band &&
    a.bandPreview === b.bandPreview &&
    a.renderDay === b.renderDay &&
    a.renderDayContent === b.renderDayContent &&
    a.classNames === b.classNames &&
    a.unstyled === b.unstyled &&
    a.actions === b.actions
  );
}) as typeof DayCellImpl;
