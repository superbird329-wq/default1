import type { APIRoute } from 'astro';
import { SITE } from '../data/site';

/*
  Generated rather than static so that SITE.indexable is the single switch that
  governs both robots.txt and the per-page robots meta tag.

  Phase 0 decision: the site stays unindexed until the content is complete, so
  that the first version Google caches under Vin's name is not one full of
  TODO placeholders.
*/
export const GET: APIRoute = ({ site }) => {
  const body = SITE.indexable
    ? `User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site).href}
`
    : `# Indexing is intentionally disabled until the site content is complete.
# Flip SITE.indexable to true in src/data/site.ts to allow crawlers.
User-agent: *
Disallow: /
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
