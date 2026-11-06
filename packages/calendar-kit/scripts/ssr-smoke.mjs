// Imports the built package exactly as a consumer would (package exports, no
// `source` condition) and renders it on the server.
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Calendar, stayRules, toCalendarDate } from 'calendar-kit';
import * as client from 'calendar-kit/client';
import * as core from 'calendar-kit/core';

// Subpath entries resolve through the exports map and share the same component.
if (client.Calendar !== Calendar || core.stayRules !== stayRules || 'Calendar' in core) throw new Error('entry points disagree');

const html = renderToString(
  createElement(Calendar, { mode: 'range', today: toCalendarDate('2026-10-12'), numberOfMonths: 2, rules: stayRules({ minNights: 2 }), locale: 'tr-TR' }),
);
if (!html.includes('Ekim 2026') || !html.includes('Kasım 2026')) throw new Error('SSR output missing months');
console.log(`SSR ok: ${html.length} chars, ${(html.match(/data-date=/g) || []).length / 2} day cells`);
