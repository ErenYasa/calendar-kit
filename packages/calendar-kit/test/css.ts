/**
 * Tiny helpers to reason about the compiled default stylesheet in tests:
 * flattens rules (with their @media context and source order) and computes
 * selector specificity for the selector features this stylesheet uses.
 * jsdom does not apply the cascade to pseudo-elements, so cascade-dependent
 * behaviour is asserted on the compiled CSS (and checked in a real browser).
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { compileString } from 'sass';

export interface CssRule {
  selector: string;
  body: string;
  media: string | null;
  order: number;
}

export function compiledRules(): CssRule[] {
  const scss = readFileSync(resolve(__dirname, '../src/styles/index.scss'), 'utf8');
  const css = compileString(scss, { style: 'expanded' }).css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: CssRule[] = [];
  let order = 0;
  const walk = (text: string, media: string | null) => {
    let i = 0;
    while (i < text.length) {
      const open = text.indexOf('{', i);
      if (open < 0) break;
      const head = text.slice(i, open).trim();
      let depth = 1;
      let j = open + 1;
      while (j < text.length && depth) {
        if (text[j] === '{') depth++;
        else if (text[j] === '}') depth--;
        j++;
      }
      const body = text.slice(open + 1, j - 1);
      if (head.startsWith('@media')) walk(body, head);
      else if (!head.startsWith('@')) for (const sel of splitSelectors(head)) rules.push({ selector: sel, body, media, order: order++ });
      i = j;
    }
  };
  walk(css, null);
  return rules;
}

function splitSelectors(list: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of list) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** [ids, classes/attributes/pseudo-classes, types/pseudo-elements] */
export function specificity(selector: string): [number, number, number] {
  let s = selector;
  const total: [number, number, number] = [0, 0, 0];
  const add = (x: [number, number, number]) => {
    total[0] += x[0];
    total[1] += x[1];
    total[2] += x[2];
  };
  // :where() contributes nothing; :not()/:is() contribute their most specific argument.
  s = s.replace(/:where\((?:[^()]|\([^()]*\))*\)/g, '');
  s = s.replace(/:(not|is)\(((?:[^()]|\([^()]*\))*)\)/g, (_, __, inner: string) => {
    const best = splitSelectors(inner).map(specificity).sort((a, b) => b[0] - a[0] || b[1] - a[1] || b[2] - a[2])[0]!;
    add(best);
    return '';
  });
  total[2] += (s.match(/::[\w-]+/g) ?? []).length;
  s = s.replace(/::[\w-]+/g, '');
  total[0] += (s.match(/#[\w-]+/g) ?? []).length;
  total[1] += (s.match(/\.[\w-]+|\[[^\]]*\]|:[\w-]+/g) ?? []).length;
  s = s.replace(/\.[\w-]+|\[[^\]]*\]|:[\w-]+|#[\w-]+/g, ' ');
  total[2] += (s.match(/(^|[\s>+~])[a-zA-Z][\w-]*/g) ?? []).length;
  return total;
}

export const cmp = (a: [number, number, number], b: [number, number, number]) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

/** True when rule `a` overrides rule `b` for an element both match. */
export function wins(a: CssRule, b: CssRule): boolean {
  const c = cmp(specificity(a.selector), specificity(b.selector));
  return c > 0 || (c === 0 && a.order > b.order);
}
