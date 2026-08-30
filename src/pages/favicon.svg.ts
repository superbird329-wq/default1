import type { APIRoute } from 'astro';
import { PALETTE } from '../lib/theme';

/**
 * The favicon, generated from the palette in src/styles/tokens.css rather than
 * kept as a static file with its own hard-coded hex values.
 *
 * The mark is a plain "V" monogram: an ink square with the letter picked out
 * in the accent colour, at 32px.
 */
export const GET: APIRoute = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${PALETTE.ink}"/>
  <text x="16" y="17" text-anchor="middle" dominant-baseline="central" font-family="system-ui, sans-serif" font-weight="700" font-size="20" fill="${PALETTE.accent}">V</text>
</svg>
`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
