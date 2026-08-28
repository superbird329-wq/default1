import type { APIRoute } from 'astro';
import { PALETTE } from '../lib/theme';

/**
 * The favicon, generated from the palette in src/styles/tokens.css rather than
 * kept as a static file with its own hard-coded hex values.
 *
 * The mark is the title block itself: a sheet border, a division rule, and the
 * title-block field picked out in the accent — the same device the site is
 * built around, at 32px.
 */
export const GET: APIRoute = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${PALETTE.paper}"/>
  <rect x="2.5" y="2.5" width="27" height="27" fill="none" stroke="${PALETTE.ink}" stroke-width="2"/>
  <path d="M3.5 21.5h25" stroke="${PALETTE.ink}" stroke-width="1"/>
  <rect x="18" y="21.5" width="10.5" height="7" fill="${PALETTE.accent}"/>
</svg>
`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
