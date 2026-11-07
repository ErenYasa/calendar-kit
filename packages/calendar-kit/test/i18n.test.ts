import { describe, expect, it } from 'vitest';
import type { IssueParams, ReasonCode } from '../src/core/types';
import { messagesAr, messagesDe, messagesEs, messagesFr, messagesIt, messagesNl } from '../src/i18n/locales';
import { type CalendarMessages, type MessageFormatHelpers, messagesEn } from '../src/i18n/messages';

/**
 * Every bundled message pack must translate every key of `messagesEn`: a key
 * that is missing, or that renders exactly like the English text, means the UI
 * silently falls back to English in that language (finding F42).
 */

const packs: Record<string, CalendarMessages> = {
  de: messagesDe,
  fr: messagesFr,
  es: messagesEs,
  it: messagesIt,
  nl: messagesNl,
  ar: messagesAr,
};

/**
 * Texts that are legitimately identical to English. Keys are `<locale>:<path>`.
 * Keep this list empty unless a translation genuinely equals the English text.
 */
const SAME_AS_ENGLISH: ReadonlySet<string> = new Set<string>([]);

// Deterministic helper: the date formatting itself is Intl's job, not the pack's.
const helpers = (locale: string): MessageFormatHelpers => ({ locale, date: (v) => String(v) });

// Param shapes as produced by the engine (see src/core/engine.ts), for both units
// and for singular, dual and plural counts.
const paramSets: IssueParams[] = [1, 2, 3, 7, 11].flatMap((n) =>
  (['nights', 'days'] as const).map((unit) => ({ min: n, max: n, length: n, actual: n, value: 'x', unit }) as IssueParams),
);
const dateParams: IssueParams = { min: '2026-11-13', max: '2026-11-20', today: '2026-11-07', start: '2026-11-13', value: '2026-13-45' };

type Leaf = string | ((...args: never[]) => string);

/** Renders a message entry for comparison; function forms are called with representative args. */
function renderTop(value: Leaf): string[] {
  if (typeof value === 'string') return [value];
  // (date, count) for announceAdded/Removed, (start, end) / (date, reason) for the others.
  const fn = value as (a: unknown, b: unknown) => string;
  return [fn('2026-11-13', 3), fn('2026-11-13', 1), fn('2026-11-13', '2026-11-20')];
}

const topKeys = (Object.keys(messagesEn) as (keyof CalendarMessages)[]).filter((k) => k !== 'reasons' && k !== 'dayReasons');
const reasonCodes = Object.keys(messagesEn.reasons) as ReasonCode[];
const dayReasonTags = Object.keys(messagesEn.dayReasons);

describe.each(Object.entries(packs))('message pack %s', (locale, pack) => {
  const allowed = (path: string) => SAME_AS_ENGLISH.has(`${locale}:${path}`);

  it('translates every top-level UI string', () => {
    for (const key of topKeys) {
      expect(pack, `${locale} is missing ${key}`).toHaveProperty(key);
      const en = renderTop(messagesEn[key] as Leaf);
      const tr = renderTop(pack[key] as Leaf);
      expect(tr.length, key).toBe(en.length);
      if (allowed(key)) continue;
      tr.forEach((t, i) => {
        expect(t, `${locale}.${key} is still English`).not.toBe(en[i]);
        expect(t.trim(), `${locale}.${key} is empty`).not.toBe('');
      });
    }
  });

  it('translates every reason code for every param shape', () => {
    for (const code of reasonCodes) {
      expect(Object.hasOwn(pack.reasons, code), `${locale} is missing reasons.${code}`).toBe(true);
      if (allowed(`reasons.${code}`)) continue;
      for (const params of [...paramSets, dateParams]) {
        const en = messagesEn.reasons[code](params, helpers('en'));
        const tr = pack.reasons[code](params, helpers(locale));
        expect(tr, `${locale}.reasons.${code} is still English for ${JSON.stringify(params)}`).not.toBe(en);
        if (params !== dateParams) expect(tr).not.toMatch(/undefined|\bNaN\b/);
      }
    }
  });

  it('translates every built-in day-reason tag', () => {
    for (const tag of dayReasonTags) {
      expect(pack.dayReasons[tag], `${locale} is missing dayReasons.${tag}`).toBeTypeOf('string');
      if (allowed(`dayReasons.${tag}`)) continue;
      expect(pack.dayReasons[tag], `${locale}.dayReasons.${tag} is still English`).not.toBe(messagesEn.dayReasons[tag]);
    }
  });

  it('has no keys that English lacks', () => {
    expect(Object.keys(pack).sort()).toEqual(Object.keys(messagesEn).sort());
    expect(Object.keys(pack.reasons).sort()).toEqual([...reasonCodes].sort());
    expect(Object.keys(pack.dayReasons).sort()).toEqual([...dayReasonTags].sort());
  });
});

describe('length units', () => {
  const minLen = (m: CalendarMessages, min: number, unit: 'nights' | 'days') => m.reasons['min-length']({ min, unit }, helpers('x'));
  it('uses singular and plural forms', () => {
    expect(minLen(messagesDe, 1, 'nights')).toContain('1 Nacht');
    expect(minLen(messagesDe, 2, 'days')).toContain('2 Tage');
    expect(minLen(messagesFr, 1, 'nights')).toContain('1 nuit');
    expect(minLen(messagesFr, 3, 'nights')).toContain('3 nuits');
  });
  it('uses Arabic singular, dual, plural (3-10) and 11+ forms', () => {
    expect(minLen(messagesAr, 1, 'nights')).toContain('ليلة واحدة');
    expect(minLen(messagesAr, 2, 'nights')).toContain('ليلتان');
    expect(minLen(messagesAr, 3, 'nights')).toContain('3 ليالٍ');
    expect(minLen(messagesAr, 11, 'nights')).toContain('11 ليلة');
    expect(minLen(messagesAr, 1, 'days')).toContain('يوم واحد');
    expect(minLen(messagesAr, 2, 'days')).toContain('يومان');
    expect(minLen(messagesAr, 5, 'days')).toContain('5 أيام');
    expect(minLen(messagesAr, 14, 'days')).toContain('14 يومًا');
  });
});
