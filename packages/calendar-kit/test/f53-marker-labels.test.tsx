/**
 * F53: DefaultDayData.markers[].label was never exposed (docs/verification-findings.md).
 * The dots are aria-hidden; with the default day content their labels are now
 * part of the day's accessible description (aria-describedby).
 */
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Calendar, type CalendarDate, type DefaultDayData, toCalendarDate as d } from '../src';

const TODAY = d('2026-11-02');
const DAY = '2026-11-10';

function describe10(data: DefaultDayData, extra: Record<string, unknown> = {}) {
  const { container, unmount } = render(
    <Calendar<DefaultDayData> mode="single" today={TODAY} getDayData={(date: CalendarDate) => (date === DAY ? data : undefined)} {...extra} />,
  );
  const button = container.querySelector<HTMLElement>(`button[data-date="${DAY}"]`)!;
  const ids = (button.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);
  // Every referenced id must exist in the document (a dangling reference is read as nothing).
  const texts = ids.map((id) => document.getElementById(id)?.textContent ?? `<missing #${id}>`);
  const description = ids.filter((id) => id.includes('-desc-')).map((id) => document.getElementById(id)?.textContent);
  const markersHidden = container.querySelector(`[data-date="${DAY}"] .cal-day-markers`)?.getAttribute('aria-hidden');
  unmount();
  return { ids, texts, description: description[0] ?? null, markersHidden };
}

describe('F53 marker labels in the accessible description', () => {
  it('a single marker label is the description; the dots stay aria-hidden', () => {
    const r = describe10({ markers: [{ color: 'red', label: 'Partly booked' }] });
    expect(r.description).toBe('Partly booked');
    expect(r.texts.every((t) => !t.startsWith('<missing'))).toBe(true);
    expect(r.markersHidden).toBe('true');
  });
  it('several markers follow an existing description', () => {
    const r = describe10({ description: '20% discount', markers: [{ label: 'Partly booked' }, { label: 'Late check-out' }] });
    expect(r.description).toBe('20% discount, Partly booked, Late check-out');
  });
  it('the same text is never added twice (description or another marker, any case)', () => {
    const r = describe10({ description: '20% discount, partly booked', markers: [{ label: 'Partly booked' }, { label: 'Pool' }, { label: 'pool' }] });
    expect(r.description).toBe('20% discount, partly booked, Pool');
  });
  it('markers without a label add nothing; with nothing to say there is no description', () => {
    expect(describe10({ description: 'Deal', markers: [{ color: 'red' }, { label: '  ' }] }).description).toBe('Deal');
    const none = describe10({ markers: [{ color: 'red' }] });
    expect(none.description).toBeNull();
    expect(none.ids.some((id) => id.includes('-desc-'))).toBe(false);
  });
  it('with renderDayContent the labels are not added (the app draws the day itself)', () => {
    const r = describe10({ description: 'Deal', markers: [{ label: 'Partly booked' }] }, { renderDayContent: ({ day }: { day: { dayText: string } }) => day.dayText });
    expect(r.description).toBe('Deal');
  });
});
