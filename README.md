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
| `npm run rebuild` | Clear caches and build from scratch |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run check` | Type-check content frontmatter and components |
| `npm run strip-metadata` | Strip EXIF/XMP metadata from `public/` — **run before committing any image or PDF** |
| `./scripts/check-todos.sh` | Fail if `TODO` placeholders remain in the built output |
| `./scripts/check-confidential.sh` | Scan for confidential-looking patterns |
| `npm run check:contrast` | Audit the palette against WCAG 2.2 AA — run after any colour change |
| `npm run verify` | Everything above, as one pre-deploy gate |

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

## Adding a project

Create one Markdown file in `src/content/projects/`. The filename becomes the
URL: `spt-blow-count-pipeline.md` is published at `/projects/spt-blow-count-pipeline`.

Everything lives in the frontmatter — the block between the `---` lines. There
is no body text to write; the template arranges these fields into the case study
layout, in the same order on every project, so two projects can be compared
without re-reading the page structure.

Copy this and fill it in:

```yaml
---
title: Geotechnical report production and drawing QC
weight: 10                  # lower numbers appear first. You control the order.
featured: true              # true for the three shown on the home page
draft: false                # true keeps it out of the published site entirely

category: Internship Work   # Internship Work | Academic | Competition | Technical

# The three facts in the title block at the top of the page
projectType: Geotechnical investigation and reporting
timeframe: March 2026 – present
role: Engineering Intern

summary: One line, under 200 characters. This is what shows on the cards.

objective: |
  Two to three sentences on what the work needed to accomplish.

myRole: |
  What you personally did, stated precisely. Distinguish your own contribution
  from what the team produced. Where work was supervised, say so — "drafted
  under the review of a licensed professional engineer" is accurate, and it
  reads as honesty rather than as a weakness.

approach:                   # three to six items
  - The first step, and why you took it.
  - The second step.
  - The third step.

tools:                      # name software specifically — recruiters scan this
  - AutoCAD
  - Excel

standards:                  # codes, manuals, specs. Omit the list if none apply.
  - ASTM D1586

deliverables:
  - What was actually produced.

outcome: |
  What happened as a result. If there is no measurable outcome, state the
  qualitative one plainly. Never invent a number.

learned: |
  Two to four sentences. Interviewers ask about this section directly.

images: []                  # optional; see the confidentiality rules below
---
```

The build fails with a plain-English message if a required field is missing, so
you cannot accidentally publish a half-finished case study. Set `draft: true`
while you work on one.

### Adding images to a project

Only redacted crops or redrawn abstractions, and only once Subsurface
Engineering has approved that specific image in writing. Then:

1. Put the file in `public/img/`.
2. Run `npm run strip-metadata`.
3. Add it to the `images` list:

```yaml
images:
  - src: /img/boring-log-excerpt.webp
    alt: Excerpt of a boring log showing blow counts by depth
    caption: Redacted excerpt. Client identifiers removed.
```

`alt` is required and must describe what the image shows.

---

## Updating the resume

The resume exists in two places and they are kept in sync **by hand**:

- **The web version** at `/resume` is generated from the same content as the
  rest of the site — `src/data/site.ts` and the files in `src/content/`.
- **The PDF** at `public/resume/vin-cataldo-resume.pdf` is exported from your
  own resume document.

So when the resume changes:

1. Update your Word document and export a fresh PDF.
2. Save it to `public/resume/vin-cataldo-resume.pdf`.
3. Run `npm run strip-metadata` — an exported PDF carries your name, the
   software used, and often the full original file path.
4. Set `pdfAvailable: true` in `src/data/site.ts` if it is not already.
5. Make the matching edit to the content files so the web version agrees.

Step 5 is the one that gets forgotten. A recruiter who reads both will notice.

---

## Other common edits

| To change | Edit |
| --- | --- |
| Email, phone, LinkedIn | `src/data/site.ts` → `contact` |
| The sentence under your name | `src/data/site.ts` → `direction` |
| What you are seeking | `src/data/site.ts` → `seeking` |
| GPA, graduation date, coursework | `src/data/site.ts` → `education` |
| About page text | `src/content/pages/about.md` |
| A job or internship | `src/content/experience/*.md` |
| A club, award, or competition | `src/content/credentials/*.md` |
| Colours | `src/styles/tokens.css` (then `npm run check:contrast`) |

### If a deleted item still appears on the site

Astro caches content in `node_modules/.astro`, and a deleted Markdown file can
survive an ordinary rebuild. If you delete a project and it is still there:

```bash
npm run rebuild
```

That clears the cache and builds from scratch. `npm run verify` already does it.

---

## Changing the colours

Every colour on the site is defined in **one file**: `src/styles/tokens.css`.
Nothing else anywhere hard-codes a colour value. Change a hex there and it
propagates automatically to:

- every page and component
- the browser-tab favicon (generated at build time from the palette)
- the `theme-color` browser chrome tint on mobile
- the print stylesheet

There are seven values to know:

| Token | What it is |
| --- | --- |
| `--c-paper` | The page background |
| `--c-surface` | Cards and title-block cells (currently white) |
| `--c-ink` | Body text and the primary button fill |
| `--c-graphite` | Labels and secondary text |
| `--c-rule` | Hairlines between blocks |
| `--c-accent` | The one accent, used for marks and rules only |
| `--c-accent-ink` | A darker tone of the accent, for when it must carry text |
| `--c-on-accent` | The text colour that sits *on* the accent fill |

### After changing any colour, run this

```bash
npm run check:contrast
```

It prints every colour pairing the site actually uses with its measured
contrast ratio, and fails if any drops below WCAG 2.2 Level AA. It is also part
of `npm run verify`, so a palette change that breaks accessibility fails the
build instead of shipping quietly.

Two rules the audit exists to enforce, because they are easy to get wrong:

- **`--c-accent` must never carry body text.** A saturated accent bright enough
  to work as a mark is almost never dark enough to read at 16px. That is what
  `--c-accent-ink` is for. Darken it until the audit passes.
- **If you switch to a dark accent, flip `--c-on-accent`.** With the current
  orange it holds the ink value, because black-on-orange both meets AA and is
  what construction signage does. With a dark blue or green accent you want the
  paper value instead — the audit will tell you.

A full swap is about four lines. Colours must be plain hex (`#rrggbb`), not
`color-mix()` or `var()`, so the favicon generator and the audit can read them;
you will get a clear error rather than a broken build if you use one.

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

The site is a plain static build (`dist/`). It deploys to **Cloudflare
Workers** via Cloudflare's Git integration (the successor to classic
Cloudflare Pages — the dashboard still calls the section "Workers & Pages").

`public/_headers` (security headers) is read automatically — there is nothing
to configure for it. `www` → apex is **not** handled by `public/_redirects`:
this deploy target only accepts relative-path redirect rules, so a
cross-host rule there fails the deploy outright. Instead it's a Cloudflare
Redirect Rule set up once the domain is connected (see below).

### Before the first deploy

The repository is already on GitHub and already public, so there is nothing to
push. Two things are worth doing first:

- **Rename the default branch.** It is currently
  `claude/vincataldo-portfolio-build-w0x0a0`, which works but is an odd name to
  see on a production site's repository. On GitHub: **Settings → Branches →**
  rename it to `main`. Cloudflare follows the default branch, so do this before
  connecting, not after.
- **Decide whether the repository should stay public.** It contains your email,
  phone number, resume content, and coursework — all of it intended for
  publication. It does not contain your transcript. Public is fine; private
  works identically with Cloudflare. Your call.

### Connect Cloudflare

1. Sign in at <https://dash.cloudflare.com>, then **Compute → Workers &
   Pages** → **Create application** → **Connect to Git** (or **Import an
   existing Git repository**, depending on what the dashboard offers when you
   land there).
2. Authorise GitHub and pick `superbird329-wq/default1`.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Production branch: `main`
4. Node is picked up automatically from `.nvmrc` (`22.22.2`) — no environment
   variable needed.
5. **Save and Deploy.** The first build takes two to three minutes.

You now have a live URL like `default1.<account>.workers.dev`. Check it works
before going near DNS.

### Point vincataldo.com at it

Cloudflare needs to own DNS for `vincataldo.com` for the steps below (custom
domains and Redirect Rules are zone-level features):

1. **Domains → Add a domain** → `vincataldo.com`. Cloudflare gives you two
   nameservers.
2. At the registrar, replace the existing nameservers with Cloudflare's two.
   Propagation is usually well under an hour; Cloudflare emails you once the
   zone is active.
3. In the Worker's project: **Domains** tab → add `vincataldo.com` and
   `www.vincataldo.com` as custom domains. Certificates issue automatically.
4. **Rules → Redirect Rules** (zone level, not the Worker) → create a rule:
   when hostname equals `www.vincataldo.com`, redirect to
   `https://vincataldo.com/${1}` (or the dashboard's equivalent dynamic
   redirect using the incoming path), status 301. This replaces the old
   `public/_redirects` cross-host rule, which this deploy target no longer
   accepts.
5. **SSL/TLS → Edge Certificates → Always Use HTTPS: on.**

`vincataldo.com` is canonical and `www` redirects to it. That choice lives in
`public/_redirects`; if you ever reverse it, change it there too or the two
will disagree.

### Every deploy after that

Push to the default branch. Cloudflare rebuilds automatically. Pull requests
get their own preview URL.

Before pushing, run:

```bash
npm run verify
```

It type-checks, audits colour contrast, builds from scratch, and fails if any
`TODO` placeholder or confidential-looking pattern survives into the output.

### HSTS

`public/_headers` already sends
`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
Only submit the domain to <https://hstspreload.org> once you are certain every
subdomain will serve HTTPS permanently — preload entries are slow to reverse.

> Netlify would work unchanged (it reads the same `_headers` and `_redirects`
> files) if you ever want to move.

---

## Search engine indexing

The site is currently **not indexed**. `src/data/site.ts` has:

```ts
indexable: false,
```

That single flag drives both `/robots.txt` (which disallows all crawlers) and
the `<meta name="robots" content="noindex, nofollow">` tag on every page.

Flip it to `true` once the content is complete and `npm run verify` passes.
Nothing else needs to change.

**Deploying and indexing are separate.** You can deploy today and the site will
be live at a URL that works for anyone you send it to — it simply will not turn
up in Google. That is the right order: prove the deploy, finish the content,
then open it to search.

One caveat while `TODO` markers remain: they render as loud orange blocks on the
live site. The site being unindexed stops Google finding it, but anyone you send
the link to will see them. Do not put the URL on an application or hand it to a
recruiter until `npm run verify` passes.

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
    tokens.css          THE source for every colour, size, and spacing value
    global.css          Base styles and utilities
  lib/
    palette.js          Reads tokens.css; shared by the site and the audit
    theme.ts            Exposes the palette to Astro (favicon, theme-color)
  pages/favicon.svg.ts  Favicon, generated from the palette
public/
  fonts/                Self-hosted IBM Plex (OFL licensed)
  _headers              Security headers
  _redirects            www -> apex
scripts/                Metadata stripping and pre-publish checks
```

---

## Build status

Phases 1–3 are complete: the foundation, the design pass, and all five content
pages built from Vin's real resume and transcript.

Outstanding:

- **Project case studies** (`SPEC.md` §12 phase 4). None written yet. The
  projects index and the case study template are built and waiting.
- **LinkedIn URL** — a TODO marker on every page until supplied.
- **Resume PDF** — export from the source document, see above.
- **Headshot** for the About page, and the two narrative paragraphs in
  `src/content/pages/about.md`.
- **Club and competition dates**, and any scholarships.
- **Quality pass and deployment** (§12 phases 5–6).

`npm run verify` currently fails on the remaining TODO markers. That is
intentional: it is the gate that stops a half-finished site from going live.
