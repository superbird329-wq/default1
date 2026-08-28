/**
 * Palette parsing and contrast maths.
 *
 * Plain JavaScript with JSDoc types rather than TypeScript, because this module
 * is imported from two places that cannot share a build step:
 *
 *   - src/lib/theme.ts       (Astro / Vite, at build time)
 *   - scripts/check-contrast.mjs  (plain Node, run from npm scripts)
 *
 * One implementation, so the two can never disagree about what the palette is.
 *
 * The colours themselves live in src/styles/tokens.css. Nothing here defines a
 * colour; this file only reads them.
 */

/**
 * The custom properties every consumer relies on. Parsing fails loudly if one
 * is missing, rather than silently falling back — a favicon that quietly
 * disagreed with the site would be worse than a failed build.
 *
 * Keys are the camelCase form of the CSS name: `--c-accent-ink` -> `accentInk`.
 * @type {readonly string[]}
 */
export const REQUIRED_TOKENS = Object.freeze([
  'paper',
  'surface',
  'ink',
  'graphite',
  'rule',
  'accent',
  'accentInk',
  'onAccent',
  'printBg',
  'printFg',
]);

/**
 * @typedef {Record<string, string>} Palette
 * Maps a camelCase token name to its hex value, e.g. { paper: '#f5f6f7' }.
 */

/** @param {string} css @returns {string} */
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** `accent-ink` -> `accentInk` @param {string} name @returns {string} */
function toCamel(name) {
  return name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

/**
 * Read the `--c-*` custom properties out of a tokens stylesheet.
 *
 * Comments are stripped first, so the prose in tokens.css that mentions token
 * names (contrast tables and the like) can never be mistaken for a definition.
 *
 * @param {string} css Contents of src/styles/tokens.css.
 * @returns {Palette}
 * @throws {Error} if a required token is missing or is not a plain hex colour.
 */
export function parsePalette(css) {
  /** @type {Palette} */
  const palette = {};

  const declaration = /--c-([a-z0-9-]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = declaration.exec(stripComments(css))) !== null) {
    palette[toCamel(match[1])] = match[2].trim();
  }

  const missing = REQUIRED_TOKENS.filter((token) => !(token in palette));
  if (missing.length > 0) {
    throw new Error(
      `tokens.css is missing required colour token(s): ${missing
        .map((t) => `--c-${t.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`)
        .join(', ')}`,
    );
  }

  for (const token of REQUIRED_TOKENS) {
    const value = palette[token];
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
      throw new Error(
        `Colour token --c-${token} is "${value}". It must be a plain hex value ` +
          `(#rgb or #rrggbb) so that the favicon and contrast audit can read it. ` +
          `Functional colours such as color-mix() or var() are not supported here.`,
      );
    }
  }

  return palette;
}

/**
 * @param {string} hex
 * @returns {[number, number, number]} 0–255 channels
 */
export function hexToRgb(hex) {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ];
}

/**
 * WCAG 2.x relative luminance.
 * https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
 * @param {string} hex
 * @returns {number}
 */
export function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * WCAG 2.x contrast ratio between two colours, 1–21.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function contrastRatio(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [light, dark] = la > lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}
