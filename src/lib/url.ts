/**
 * Normalise a pathname to its canonical, extension-free form.
 *
 * astro.config.ts uses build.format: 'file', so at build time Astro.url.pathname
 * is "/index.html" or "/experience.html" even though those pages are served at
 * "/" and "/experience". Every canonical URL, og:url, and nav active-state
 * comparison has to go through this.
 */
export function canonicalPath(pathname: string): string {
  const stripped = pathname
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '')
    .replace(/(.)\/$/, '$1');

  return stripped === '' ? '/' : stripped;
}
