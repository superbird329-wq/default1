import type { APIRoute } from 'astro';

/**
 * The favicon: a plain "V" monogram, white background with a black letter,
 * at 32px.
 */
export const GET: APIRoute = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#ffffff"/>
  <text x="16" y="21" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="17" fill="#000000">V</text>
</svg>
`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
