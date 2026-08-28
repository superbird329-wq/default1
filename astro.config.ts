// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { SITE } from './src/data/site';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  trailingSlash: 'never',
  // 'file' emits /experience.html, served at /experience with no trailing-slash
  // redirect on either Cloudflare Pages or Netlify.
  build: {
    format: 'file',
    // Keep every stylesheet external so the Content-Security-Policy in
    // public/_headers can use style-src 'self' with no 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
  integrations: [
    // The sitemap is always generated. Whether crawlers may read it is governed
    // by SITE.indexable, which drives /robots.txt and the per-page robots meta
    // tag. See src/data/site.ts.
    sitemap({ filter: (page) => !page.includes('/404') }),
  ],
});
