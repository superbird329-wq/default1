#!/usr/bin/env node
/**
 * Verify the palette in src/styles/tokens.css meets WCAG 2.2 Level AA.
 *
 *   npm run check:contrast
 *
 * Spec §8 makes AA contrast an acceptance criterion. Since every colour now
 * lives in one editable place, this is the guard that stops a palette change
 * from quietly breaking it. It reads tokens.css directly — there is no second
 * copy of the colours to fall out of date.
 *
 * Thresholds:
 *   4.5:1  WCAG 1.4.3  normal-size text
 *   3.0:1  WCAG 1.4.11 non-text: UI components, graphical objects, focus rings
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { parsePalette, contrastRatio } from '../src/lib/palette.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS = join(ROOT, 'src/styles/tokens.css');

/**
 * A malformed palette is a content mistake, not a crash. Report it in words
 * rather than as a stack trace — the person editing tokens.css is not
 * necessarily a developer.
 */
let palette;
try {
  palette = parsePalette(readFileSync(TOKENS, 'utf8'));
} catch (error) {
  console.error(`\nCannot read the palette from src/styles/tokens.css:\n`);
  console.error(`  ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}

/**
 * Every pairing the design actually puts on screen. If you introduce a new
 * combination in a component, add it here too — an unlisted pairing is an
 * unverified one.
 */
const CHECKS = [
  { fg: 'ink', bg: 'paper', min: 4.5, what: 'Body text on the page ground' },
  { fg: 'ink', bg: 'surface', min: 4.5, what: 'Body text on cards / title block' },
  { fg: 'graphite', bg: 'paper', min: 4.5, what: 'Labels and secondary text' },
  { fg: 'graphite', bg: 'surface', min: 4.5, what: 'Labels on cards' },
  { fg: 'accentInk', bg: 'paper', min: 4.5, what: 'Accent-coloured link text' },
  { fg: 'accentInk', bg: 'surface', min: 4.5, what: 'Accent link text on cards' },
  { fg: 'accent', bg: 'paper', min: 3.0, what: 'Accent marks, rules, focus ring' },
  { fg: 'accent', bg: 'surface', min: 3.0, what: 'Accent marks on cards' },
  { fg: 'onAccent', bg: 'accent', min: 4.5, what: 'Text on the accent fill (button, TODO marker)' },
  { fg: 'paper', bg: 'ink', min: 4.5, what: 'Text on the primary button' },
  { fg: 'printFg', bg: 'printBg', min: 4.5, what: 'Printed page' },
];

/** Reported but never failed: hairlines are decorative and WCAG-exempt. */
const INFO = [{ fg: 'rule', bg: 'paper', what: 'Hairline rules (decorative)' }];

const pad = (s, n) => String(s).padEnd(n);
let failures = 0;

console.log('\nWCAG 2.2 AA contrast audit — src/styles/tokens.css\n');
console.log(
  `  ${pad('RESULT', 8)}${pad('RATIO', 9)}${pad('MIN', 7)}${pad('PAIRING', 26)}WHAT`,
);
console.log(`  ${'-'.repeat(96)}`);

for (const { fg, bg, min, what } of CHECKS) {
  const ratio = contrastRatio(palette[fg], palette[bg]);
  const ok = ratio >= min;
  if (!ok) failures++;
  console.log(
    `  ${pad(ok ? 'PASS' : 'FAIL', 8)}${pad(ratio.toFixed(2) + ':1', 9)}` +
      `${pad(min.toFixed(1), 7)}${pad(`${fg} on ${bg}`, 26)}${what}`,
  );
}

for (const { fg, bg, what } of INFO) {
  const ratio = contrastRatio(palette[fg], palette[bg]);
  console.log(
    `  ${pad('info', 8)}${pad(ratio.toFixed(2) + ':1', 9)}${pad('—', 7)}` +
      `${pad(`${fg} on ${bg}`, 26)}${what}`,
  );
}

console.log();

if (failures > 0) {
  console.error(
    `${failures} pairing(s) below WCAG 2.2 AA.\n\n` +
      `Fix this in src/styles/tokens.css. Usually the answer is to darken the\n` +
      `foreground colour rather than lighten the background. If the failure is\n` +
      `"accentInk on paper", darken --c-accent-ink further; it exists precisely\n` +
      `to be the tone dark enough to carry text.\n`,
  );
  process.exit(1);
}

console.log('All pairings meet WCAG 2.2 Level AA.\n');
