// Imports the built package exactly as a consumer would (package exports, no
// `source` condition) and renders it on the server.
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Calendar, stayRules, toCalendarDate } from 'calendar-kit';

const html = renderToString(
  createElement(Calendar, { mode: 'range', today: toCalendarDate('2026-10-12'), numberOfMonths: 2, rules: stayRules({ minNights: 2 }), locale: 'tr-TR' }),
);
if (!html.includes('Ekim 2026') || !html.includes('Kasım 2026')) throw new Error('SSR output missing months');
console.log(`SSR ok: ${html.length} chars, ${(html.match(/data-date=/g) || []).length / 2} day cells`);
