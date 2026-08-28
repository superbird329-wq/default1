# vincataldo.com

Portfolio site for Vincent Cataldo — Construction Management Engineering
Technology (BS), Farmingdale State College.

Static site built with [Astro](https://astro.build). No JavaScript ships to the
browser, no third-party requests, no analytics, no cookies.

Full build specification: [`SPEC.md`](./SPEC.md).

---

## Running it locally

Requires Node 22.12 or newer (`.nvmrc` pins the exact version used).

```bash
nvm use          # or install Node 22 however you prefer
npm install
npm run dev      # http://localhost:4321
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local preview with live reload |
| `npm run build` | Build the site into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run check` | Type-check content frontmatter and components |
| `npm run strip-metadata` | Strip EXIF/XMP metadata from `public/` — **run before committing any image or PDF** |
| `./scripts/check-todos.sh` | Fail if `TODO` placeholders remain in the built output |
| `./scripts/check-confidential.sh` | Scan for confidential-looking patterns |

---

## Confidentiality checklist

**Run through this every single time you add content.** These rules are not
optional and they are the reason the site can show internship work at all.

Before committing anything, confirm that none of the following appears in any
file, image, PDF, image metadata, or commit message:

- [ ] Client names, or the company names of clients
- [ ] Street addresses of client properties
- [ ] Municipal case numbers, permit numbers, or docket numbers
- [ ] Internal project numbers
- [ ] Title blocks, letterhead, PE seals, or firm logos on any drawing
- [ ] Names, phone numbers, or email addresses of anyone other than Vin

Describe work generically instead:

| Do not write | Write instead |
| --- | --- |
| "Sanitary design for 123 Example St, Village Name" | "Sanitary system site plan for a residential parcel on Long Island's North Shore" |
| "Bulkhead replacement in Named Bay" | "Bulkhead replacement drawings for a waterfront residential property" |
| "Facade restoration, project NN-NNN" | "Facade restoration package for a multi-story commercial building" |
| "Zoning variance, Town of Municipality BZA Case #NNNNN" | "Zoning variance compliance support for a Suffolk County municipal board application" |

**No drawing image may be committed** until Subsurface Engineering has approved
its public use in writing, and the image is a redacted crop or a redrawn
abstraction.

Two scripts help, but neither replaces reading what you wrote:

```bash
./scripts/check-confidential.sh             # working tree
./scripts/check-confidential.sh --history   # also scans git history
```

### Stripping metadata

Photos carry GPS coordinates. Exported PDFs and scans carry the author name, the
software used, and often the full original file path — which can contain a
client name or a project number.

```bash
npm run strip-metadata
```

Requires `exiftool`:

- macOS: `brew install exiftool`
- Debian/Ubuntu: `sudo apt-get install libimage-exiftool-perl`

---

## No invented content

Never fill a gap with something that sounds plausible. No invented project
values, square footage, durations, cost figures, percentages, efficiency gains,
job titles, certifications, memberships, awards, or quotes.

If you do not have a fact, write `TODO: what's missing` in the field. It renders
as a loud orange marker on the page, and `./scripts/check-todos.sh` refuses to
pass a build that still contains one. That is the intended workflow: placeholder
first, real content later, never a guess.

---

## Deploying

The site is a plain static build (`dist/`), so any static host works. Both
options below are free, issue TLS certificates automatically, and redeploy on
every push.

`public/_headers` and `public/_redirects` are honoured by **both** hosts, so the
security headers and the `www` → apex redirect work either way.

### Cloudflare Pages

1. Push this repository to GitHub.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**, and pick this repository.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: set the `NODE_VERSION` environment variable to `22.22.2`
4. Deploy, then **Custom domains** → add `vincataldo.com` and `www.vincataldo.com`.
5. SSL/TLS → **Edge Certificates** → turn on **Always Use HTTPS**.

### Netlify

1. Push this repository to GitHub.
2. Netlify → **Add new site** → **Import an existing project**.
3. Build command `npm run build`, publish directory `dist`.
4. **Domain management** → add `vincataldo.com`, set it as the primary domain.
5. **Domain management → HTTPS** → **Force HTTPS**.

### HSTS

`public/_headers` already sends
`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
Only submit the domain to <https://hstspreload.org> once you are certain every
subdomain will serve HTTPS permanently — preload entries are slow to reverse.

---

## Search engine indexing

The site is currently **not indexed**. `src/data/site.ts` has:

```ts
indexable: false,
```

That single flag drives both `/robots.txt` (which disallows all crawlers) and
the `<meta name="robots" content="noindex, nofollow">` tag on every page.

Flip it to `true` once the content is complete and `./scripts/check-todos.sh`
passes. Nothing else needs to change.

---

## Project layout

```
src/
  content.config.ts     Zod schemas — the required shape of every project,
                        role, and credential
  content/
    projects/           One Markdown file per project case study
    experience/         One Markdown file per position held
    credentials/        One Markdown file per membership, award, competition
  data/site.ts          Contact info, education, and the indexing switch
  layouts/              Page shells
  components/           Header, footer, and shared pieces
  pages/                One file per route
  styles/
    tokens.css          Every colour, size, and spacing value
    global.css          Base styles and utilities
public/
  fonts/                Self-hosted IBM Plex (OFL licensed)
  _headers              Security headers
  _redirects            www -> apex
scripts/                Metadata stripping and pre-publish checks
```

---

## Build status

Phase 1 (foundation) is complete. Phases 2–6 — the design pass, content pages,
case studies, quality pass, and the full authoring guide — are in progress. See
`SPEC.md` §12.
