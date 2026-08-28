# Build Specification: vincataldo.com

## Portfolio site for a Construction Management Engineering Technology student

**How to use this document:** Paste this entire file into Claude Code at the start of a new project session, or save it as `SPEC.md` in the project root and instruct Claude Code to read it. Work through the phases in order. Do not skip Phase 0.

---

## 1. Bottom line

Build a fast, static, mobile-first portfolio site that presents construction management coursework, an engineering internship, and professional accomplishments as evidence rather than as claims. The audience is a construction recruiter or hiring manager who will spend under two minutes on the site, most likely on a phone, most likely between other tasks.

The site must be:

- Static, with near-zero client-side JavaScript
- Readable and complete in under two minutes of scanning
- Free of any confidential client information
- Free of any fabricated project detail, metric, or credential
- Easy for the owner to update by editing a Markdown file, without touching code

---

## 2. Owner and audience

**Owner:** Vincent (Vin) Cataldo. Construction Management Engineering Technology (BS), Farmingdale State College (SUNY). Anticipated graduation Spring 2028. GPA 3.81.

**Current roles:**
- Intern, Subsurface Engineering, Melville, NY. AutoCAD site plan drafting, geotechnical engineering report preparation, QC review of drawing packages.
- Office Administrator, Golden Touch Blasting, Brookhaven, NY.

**Target audience, in priority order:**
1. Construction management internship and co-op recruiters at general contractors and construction managers on Long Island and in the New York metropolitan area
2. Scholarship committees (AGC Education and Research Foundation, CMAA, IIBEC)
3. Professional contacts made at CMAA, CREDA, ULI, NAIOP, and LIREG events
4. Faculty and competition organizers (Associated Schools of Construction Region 1)

**Target roles the site should position for:** Project Engineer Intern, Field Engineer Intern, Assistant Project Manager, with a long-term direction toward commercial construction project management and real estate development.

---

## 3. Non-negotiable rules

These are hard constraints. If following any other instruction in this document would require breaking one of these, stop and ask the owner.

### 3.1 No fabrication

Claude Code must never invent, estimate, or embellish:

- Project values, square footage, schedule durations, or cost figures
- Percentages, efficiency gains, or savings
- Job titles, responsibilities, or scope of authority
- Certifications, memberships, awards, or GPA
- Testimonials or quotes

If a content field has no supplied value, leave a visible `TODO` placeholder in the Markdown source and list it in the build report. Do not fill it with plausible-sounding text. Lorem ipsum is acceptable only for layout testing and must be removed before the final build.

### 3.2 No confidential client information

The owner's internship work involves real client projects, addresses, and municipal case numbers. None of the following may appear anywhere in the site source, in image files, in image metadata, in PDF metadata, or in commit history:

- Client names or company names of clients
- Street addresses of client properties
- Municipal case numbers, permit numbers, or docket numbers
- Internal project numbers
- Title blocks, letterhead, professional engineer seals, or firm logos on drawings
- Names, phone numbers, or email addresses of any person other than the owner

Instead, describe work generically. The pattern to follow:

> **Note on this table.** The left-hand examples in the source specification
> contained what appear to be real client addresses, a real municipal case
> number, and a real internal project number. Because §3.2 forbids those
> anywhere in the source or in commit history, they have been replaced here with
> fictional placeholders. The pattern being taught is unchanged. Do not restore
> the originals.

| Do not write | Write instead |
| --- | --- |
| "Sanitary design for 123 Example St, Village Name" | "Sanitary system site plan for a residential parcel on Long Island's North Shore" |
| "Bulkhead replacement in Named Bay" | "Bulkhead replacement drawings for a waterfront residential property" |
| "Facade restoration, project NN-NNN" | "Facade restoration package for a multi-story commercial building" |
| "Zoning variance, Town of Municipality BZA Case #NNNNN" | "Zoning variance compliance support for a Suffolk County municipal board application" |
| "Seismic site classification for 99 Example Hill Drive" | "Seismic site classification analysis for a North Shore residential site" |

Any drawing image used on the site must be a redacted crop or a redrawn abstraction. Before any drawing appears in the repository, the owner must confirm in writing that his supervisors at Subsurface Engineering have approved its public use. Build the image slots and leave them empty until that confirmation exists.

### 3.3 Strip metadata

All images and PDFs committed to the repository must have EXIF, XMP, and document metadata stripped. Include a script at `scripts/strip-metadata.sh` that runs `exiftool -all= ` over `public/` and add it as a pre-commit step in the README instructions.

---

## 4. Technical stack

**Framework:** Astro (latest stable). Astro is the correct choice here because it renders to static HTML with zero JavaScript by default, which is exactly what a content-first portfolio needs. Do not use Next.js, React SPA scaffolding, or a headless CMS. Do not add a JavaScript framework for interactivity unless a specific requirement in this document demands it.

**Styling:** Plain CSS with custom properties for the design tokens. Do not install Tailwind. The site is small enough that hand-written CSS in a single well-organized stylesheet plus per-component scoped styles is simpler to maintain and produces smaller output.

**Content:** Astro Content Collections with Zod schemas. Every project, experience entry, and credential lives in Markdown or MDX with typed frontmatter, so the owner can add a project by creating one file.

**Fonts:** Self-host font files in `public/fonts/`. Do not use Google Fonts CDN links, for privacy and for load performance.

**Dependencies:** Keep the dependency list minimal. Astro plus `@astrojs/sitemap` plus `sharp` for image optimization is sufficient. Justify any additional dependency in the build report.

**Node version:** Pin in `.nvmrc` and in `package.json` `engines`.

---

## 5. Information architecture

Five pages. Do not add more without the owner's approval.

```
/                    Home
/experience          Experience and credentials
/projects            Project index
/projects/[slug]     Individual project case study
/about               About and background
/resume              Resume (inline HTML plus PDF download)
```

Contact information appears in the site footer on every page and in a dedicated block on the home page. There is no separate contact page and no contact form. A form adds a backend dependency and a spam surface for no benefit. Use a `mailto:` link and a `tel:` link.

**Navigation:** A single persistent header with the owner's name on the left and four links on the right: Experience, Projects, Resume, About. On viewports under 640 pixels, the navigation collapses to a horizontal scroll-free row of short labels, not a hamburger menu. A hamburger menu hides the site's structure from someone scanning quickly, which is the opposite of what this site needs.

---

## 6. Page specifications

### 6.1 Home

The home page has one job: establish in five seconds who this person is, what they are training for, and that there is real work to look at.

**Above the fold, on a 375 pixel wide viewport:**

1. Name
2. One line of positioning: degree program, institution, anticipated graduation
3. One sentence of direction, written in the owner's voice, stating the target role and geography
4. Two buttons: "View projects" and "Download resume"

**Below the fold, in this order:**

5. **Current roles block.** Two entries, employer and title and dates, each linking to the corresponding section on `/experience`.
6. **Selected work.** Three project cards, pulled from the content collection where `featured: true`. Each card shows title, one-line summary, the tools used, and the owner's role. Cards link to the full case study.
7. **Credentials strip.** A compact horizontal list: GPA, professional memberships, certifications, scholarships received. Facts only, no adjectives.
8. **Contact block.** Email, phone, LinkedIn, and a plain statement of what he is currently seeking.

**What must not be on the home page:** A rotating hero image carousel. A "my journey" narrative paragraph. Skill percentage bars or star ratings. Animated counters. A testimonial slider. Any stock photography of construction sites he did not work on.

### 6.2 Projects index

A single-column list on mobile, two columns above 900 pixels. Each entry is a card with:

- Project title (generic, per section 3.2)
- Category tag: one of `Internship Work`, `Academic`, `Competition`, `Technical`
- One-line summary
- Tools used, as small text labels
- The owner's role in one short phrase

Provide a category filter as plain anchor links to `#` fragments or as separate static routes. Do not build a JavaScript filter widget. Static links are faster, are shareable, and work without JavaScript.

Order projects by a `weight` field in frontmatter so the owner controls sequence manually. Do not sort by date automatically.

### 6.3 Project case study template

Every project page uses the identical structure. Consistency is what lets a recruiter compare projects quickly, and it is what makes the site feel professionally assembled rather than assembled ad hoc.

The section order, which must not vary:

1. **Title and context strip.** Project type, timeframe, and the owner's role, as three short labeled facts in a row.
2. **Objective.** What the work needed to accomplish. Two to three sentences.
3. **My role.** What the owner personally did, stated precisely. This section must distinguish individual contribution from team output. For any collaborative or supervised work, state the supervision honestly: "drafted under the review of a licensed professional engineer" is accurate and is not a weakness.
4. **Approach.** The steps taken and the reasoning behind them. This is where technical judgment shows. Bullet list, three to six items.
5. **Tools and standards.** Software used and any codes, manuals, or standards applied. Name them specifically. This section is heavily scanned by recruiters looking for keyword matches.
6. **Deliverables.** What was actually produced. Drawing sets, reports, spreadsheets, models, presentations.
7. **Outcome.** What happened as a result. If there is no measurable outcome, state the qualitative one plainly. Do not manufacture a metric.
8. **What I learned.** Two to four sentences. This section is what separates a portfolio from a resume, and interviewers ask about it directly.
9. **Images or documents.** Redacted excerpts only, with captions. Optional; the page must render correctly with zero images.

Implement this as an Astro layout so that the structure is enforced by the template rather than by the author remembering it. The frontmatter schema should require every field above except images.

### 6.4 Experience

Reverse-chronological. For each position:

- Employer, location, title, dates
- Two to four bullets describing scope of work, written as concrete deliverables rather than as duties
- Software and standards used

Below the positions, four grouped blocks:

- **Education.** Institution, degree, expected graduation, GPA, relevant coursework listed by course name.
- **Certifications.** Include OSHA 10 or OSHA 30 if held. If not currently held, this is worth flagging to the owner: OSHA 10 is one of the most consistently named requirements in construction management internship postings, and it is inexpensive and quick to obtain.
- **Professional memberships and leadership.** CMAA, CREDA, club officer roles, competition participation.
- **Scholarships and awards.** Name the awarding organization and the year.

### 6.5 Resume

Two elements on one page:

1. The resume content rendered as semantic HTML, so it is readable on a phone without downloading anything and so it is indexable by search engines.
2. A prominent download link to a PDF at `/resume/vin-cataldo-resume.pdf`.

Keep the HTML resume and the PDF in sync manually. Do not attempt to generate the PDF from the HTML at build time; the output quality is not worth the complexity.

### 6.6 About

Short. Three to five paragraphs maximum. Cover: how he came into construction, what he is working toward, what he does outside of coursework that is relevant (volunteer work, club leadership, prior event organization). Include one professional photograph.

Write this in first person. Everything else on the site is written in third person or in neutral document voice; the About page is the one place a reader should hear the person.

---

## 7. Design direction

### 7.1 The governing idea

The subject is construction documentation. Site plans, drawing sets, and geotechnical reports have their own visual language: precise, gridded, densely labeled, monochrome with selective color, and organized around a title block that tells you what you are looking at before you look at it.

Draw from that vernacular. Do not draw from generic "tech startup portfolio" or "creative agency" conventions.

### 7.2 Design tokens

Establish a token system before writing any component. Define it in `src/styles/tokens.css` as custom properties.

**Color.** Build a restrained palette of five to six values. Suggested direction, which the implementer may refine but should not abandon: a near-white paper base, a dark slate for text, a mid gray for rules and secondary text, and one saturated accent. For the accent, consider a color drawn from the construction context rather than a default: survey-marker orange, drafting blueprint cyan, or safety yellow used sparingly. Avoid warm terracotta on cream and avoid near-black with acid green; both are visual defaults that read as machine-generated.

The accent should appear in no more than three places per page.

**Typography.** Two faces, three roles.

- A display face for the name and page headings. Choose something with structure and confidence rather than decoration. A grotesque with tight apertures, or a condensed sans, both suit technical documentation.
- A body face optimized for reading at 16 to 18 pixels on a phone.
- A monospace face for data: dates, project numbers, tool names, dimensions, and the context strips on project pages. Monospace here is not decorative. It encodes the fact that these are values rather than prose, which is exactly how they function on a drawing.

Set an explicit type scale. Do not rely on browser defaults for heading sizes.

**Layout.** A visible structural grid is appropriate to this subject. Consider hairline rules that separate content blocks the way a drawing sheet is divided, and consider a persistent labeled strip at the top or bottom of project pages that functions like a title block: project name, type, role, date, in fixed positions on every project page.

**The signature element.** Choose one memorable device and execute it well. The title block treatment described above is a strong candidate because it is authentic to the subject, it is useful rather than decorative, and it reinforces the consistency of the case study format. Whatever is chosen, keep everything else quiet.

### 7.3 Motion

Minimal. Respect `prefers-reduced-motion`. Acceptable: a subtle fade or offset on scroll-triggered section reveals, and hover state transitions on links and cards. Not acceptable: parallax, animated counters, page transition wipes, typewriter effects, or anything that delays reading.

### 7.4 What to avoid

- Skill bars, percentage ratings, or star ratings for software proficiency. They are unverifiable and read as padding.
- Stock construction photography. If a photograph was not taken by the owner on work he did, it does not belong on the site.
- A dark mode toggle. The site is small and the added surface is not worth it. Pick one theme and execute it well.
- Emoji as section icons.
- The word "passionate."

---

## 8. Quality floor

These are acceptance criteria, not aspirations. Verify each before declaring the build complete.

**Performance**
- Lighthouse Performance score of 95 or higher on mobile emulation
- Total JavaScript shipped to the browser under 10 kilobytes on every page
- Largest Contentful Paint under 1.5 seconds on a simulated 4G connection
- All images served in modern formats with explicit width and height attributes to prevent layout shift
- Cumulative Layout Shift under 0.1

**Accessibility**
- WCAG 2.2 Level AA color contrast on all text
- Visible keyboard focus indicators on every interactive element, not the default outline removed
- Semantic HTML: one `h1` per page, headings in order, `nav` and `main` and `footer` landmarks
- Alt text on every image that conveys information; empty alt on decorative images
- The site must be fully navigable and readable with JavaScript disabled
- `prefers-reduced-motion` respected

**Responsive**
- Verified at 320, 375, 768, 1024, and 1440 pixels
- No horizontal scroll at any width
- Tap targets at least 44 by 44 pixels
- Text remains readable at 200 percent browser zoom

**Correctness**
- No broken internal links
- No `TODO` placeholders remaining in published output
- No console errors or warnings

---

## 9. SEO and metadata

- Unique `title` and `meta description` per page. The home page title should include the full name, the degree field, and the institution, because the primary search someone runs is the owner's name.
- Open Graph and Twitter card tags with a generated preview image.
- `JSON-LD` structured data of type `Person` on the home page, including `name`, `jobTitle`, `alumniOf`, `url`, and `sameAs` for LinkedIn.
- `sitemap.xml` via `@astrojs/sitemap`.
- `robots.txt` allowing all crawlers.
- A canonical URL on every page.
- No analytics by default. If the owner wants traffic data later, use a privacy-respecting option that does not require a cookie banner.

---

## 10. Deployment

- Repository on GitHub, private or public at the owner's discretion.
- Deploy to Cloudflare Pages or Netlify. Both offer free static hosting with automatic deploys on push and free TLS certificates.
- Custom domain `vincataldo.com` with `www` redirecting to the apex, or the reverse, chosen consistently.
- Enable HTTPS enforcement and HSTS.
- Set a security headers file: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive `Content-Security-Policy`. A static site with no third-party scripts can run a very tight policy.

---

## 11. Content inventory

Claude Code must not proceed past Phase 1 without these from the owner. Present this as a checklist and ask for the missing items.

| Item | Status |
| --- | --- |
| Professional headshot, high resolution | Required |
| Current resume PDF | Required |
| LinkedIn profile URL | Required |
| Professional email address for public display | Required |
| Confirmation of which phone number to publish | Required |
| Written approval from Subsurface Engineering for any drawing images | Required before any drawing is committed |
| Redacted drawing excerpts or screenshots, if approved | Optional |
| List of relevant coursework by course title | Required |
| Certifications currently held, with issuing body and date | Required |
| Scholarships received, with awarding organization and year | Required |
| Club and competition roles, with dates | Required |
| Written content for three to five project case studies | Required |

### Candidate projects

The owner should select three to five. Suggested composition: one signature project that most closely matches the target role, two or three supporting projects that show range, and one technical differentiator.

1. **Geotechnical report production and drawing QC (Internship Work).** The core internship work. Strongest candidate for the signature project because it is real professional work with real deliverables. Requires careful generic description per section 3.2.

2. **AutoCAD site plan drafting across multiple project types (Internship Work).** Site plans, bulkhead drawings, facade restoration packages. Shows range within drafting. Can be presented as one case study covering several project types rather than as separate entries.

3. **SPT blow-count extraction pipeline (Technical).** The Python tool that extracts standard penetration test data from scanned boring logs, computes N-values, and applies the Caltrans Falsework Manual bearing capacity formula. This is a genuine differentiator. Very few construction management undergraduates build tooling against a technical standard. Frame it around the engineering problem it solves, not around the code. Lead with the fact that refusal conditions must never receive computed N-values, because that detail demonstrates domain judgment rather than programming ability.

4. **ASC Region 1 Project Competition (Competition).** Write this after the November competition. Design-Build team, General Manager and Project Liaison role. Competition work is directly legible to construction recruiters and should be featured prominently once it exists.

5. **Engineering Economics coursework application (Academic).** Only include if it can be framed around a specific analysis with a defensible conclusion, such as an equivalent uniform annual worth comparison or an incremental rate of return decision. A generic "took a course" entry does not belong in a project section.

6. **Zoning variance compliance support (Internship Work).** Include only if it can be described without identifying the municipality or the case. Regulatory and approvals experience is valuable to show, since permitting is a large part of assistant project manager work.

---

## 12. Build phases

Work through these in order. Stop at the end of each phase and report before continuing.

**Phase 0: Confirm before building.** Read this specification. Present the content inventory checklist from section 11. Ask the owner the open questions listed in section 13. Do not scaffold anything yet.

**Phase 1: Foundation.** Initialize the Astro project. Set up the content collection schemas with Zod. Build the design token file. Build the base layout, header, and footer. Deploy an empty but working site to the hosting provider and confirm the custom domain resolves. Ending this phase with a live URL, even a nearly empty one, removes deployment risk from the rest of the build.

**Phase 2: Design pass.** Before writing page components, produce a written design plan: the palette as named hex values, the typeface choices with reasoning, a layout concept, and the signature element. Review that plan against section 7 and revise anything that reads as a generic default. Present the plan to the owner. Then build the home page as a single complete reference implementation.

**Phase 3: Content pages.** Build Experience, Resume, About, the projects index, and the project case study layout. Populate with the owner's real content. Leave visible `TODO` markers wherever content is missing.

**Phase 4: Content entry.** Add each project case study as a Markdown file. Verify each conforms to the section 6.3 structure and to the confidentiality rules in section 3.2.

**Phase 5: Quality pass.** Run through every item in section 8. Test at all five breakpoints. Test with JavaScript disabled. Run an accessibility audit. Strip all metadata from assets. Verify no confidential information appears anywhere in the repository, including in commit history.

**Phase 6: Handoff.** Write a `README.md` that explains, for a reader who is not a full-time developer, how to add a project, how to update the resume, how to change contact information, and how to deploy. Include the confidentiality checklist as a section in that README so it is enforced on every future update.

---

## 13. Questions to ask before building

Claude Code should ask these in Phase 0 and wait for answers:

1. Which phone number and email address should be public?
2. Should the site be indexed by search engines immediately, or kept unindexed until content is complete?
3. Has Subsurface Engineering approved any drawing images for public display? If not, build all image slots as optional and leave them empty.
4. Is OSHA 10 or OSHA 30 currently held? If not, should the certifications section be omitted entirely rather than showing an empty block?
5. Which three projects should be marked `featured: true` for the home page?
6. Is there a LinkedIn profile to link, and should it be linked prominently or only in the footer?
7. Should the ASC competition appear now as an upcoming item, or be added after November?

---

## 14. Maintenance expectation

The site should be updated at the end of each semester and after each internship, competition, or award. The README must make a content update a ten-minute task: create one Markdown file, add one image, push. If updating the site requires touching a component file, the architecture is wrong and should be revised.

---

## Appendix A: Phase 0 answers (recorded 2026-08-28)

Answers supplied by the owner to the section 13 questions:

2. **Indexing** — Keep unindexed until the content is complete. Implemented as
   `SITE.indexable` in `src/data/site.ts`, which drives both `/robots.txt` and
   the per-page robots meta tag.
4. **OSHA** — Neither OSHA 10 nor OSHA 30 currently held. The certifications
   block is omitted entirely rather than shown empty (`SITE.showCertifications`).
5. **Featured projects** — Geotechnical report production and drawing QC; SPT
   blow-count extraction pipeline; AutoCAD site plan drafting.
7. **ASC competition** — Appears now as an upcoming item under memberships and
   leadership on `/experience`, not as a project case study. Becomes a full case
   study after the November competition.

**Host** — Cloudflare Pages. `public/_headers` and `public/_redirects` are
committed and work there without configuration. `vincataldo.com` is canonical;
`www` redirects to it.

**Accent colour** — Survey orange `#E2510E` was compared side by side against
blueprint cyan `#0E6FA8` in every role the accent occupies. Cyan measures better
(5.0:1 vs 3.6:1 as a mark) but reads as a default corporate blue, which §7.1
rules out. Orange kept. The accent never carries body text in either scheme;
`--c-accent-ink` exists for that and passes AA.

Still outstanding: questions 1, 3, and 6, and all required items in the
section 11 content inventory.
