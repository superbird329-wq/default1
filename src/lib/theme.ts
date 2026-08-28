/**
 * Astro-facing view of the palette.
 *
 * The colours are defined once, in src/styles/tokens.css. This module reads
 * that file at build time so that non-CSS consumers — the generated favicon and
 * the theme-color meta tag — use exactly the same values, with no second list
 * to keep in sync.
 */
import tokensCss from '../styles/tokens.css?raw';
import { parsePalette } from './palette.js';

/** Every `--c-*` colour from tokens.css, keyed camelCase (`accentInk`). */
export const PALETTE = parsePalette(tokensCss);
