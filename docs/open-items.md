# Open items

The running list of what is unfinished on this site. Update it when something
lands so it stays the one place worth reading.

Last updated: 13 September 2026.

---

## Recently closed

### Septic case study images — CLOSED 13 September 2026

Both images are published. Nothing here is blocked any more; this entry is kept
as the record of a decision, not as an open item.

- `public/img/septic-site-plan-excerpt.png` — partial site plan, plan view
- `public/img/sanitary-calculations-excerpt.png` — sizing calculations excerpt

Released on a verbal approval relayed by Vin: a supervisor said by phone that
the images are good to go. That approval is verbal and relayed, not written.
A one-line written confirmation is still worth getting so the paper record
matches what is published; `docs/approvals/septic-images-addendum.md` is the
drafted request if it is wanted.

**The site plan is published with its site elevations still on it, by Vin's
explicit decision** — directed 12 September and restated 13 September, after
the specifics below were put to him in full.
Still drawn on the published sheet:

- `EL.83.8` on the stock fence line
- `RIM ±86.50` (leaching pool), `RIM ±87.00` (distribution box),
  `RIM = ±87.50` (treatment unit)
- `SAN C.O. RIM ±88.00 / INV ±85.17`
- `TW 89.5 / BW 87.0`
- Labelled contours at 84, 86, 87, 88 and 89

The accepted consequence: a labelled contour set plus the property-line shape
can match a parcel in the county GIS viewer even with no name, address, lot
number or title block on the sheet, so the published file can identify the
parcel. The 3 September packet certified these elevations as removed and that
certification was wrong; it is contradicted by the file itself, and that is
recorded in the gate block at the top of the case study rather than quietly
dropped.

What the earlier redaction round did remove, and is genuinely gone: the lot
number, the boundary bearing and distance, the title block, the firm name, the
seal, and all file metadata. `npm run strip-metadata` was run over `public/`
before committing.

**If this is reconsidered**, the fix is to strip the elevations and contour
linework at the CAD source and re-export, then replace the file. Editing the
raster is not the route: the contour *lines* identify the parcel, not only
their labels.

---

## Needs a decision

### A supervisor's name is in git history

`8949e62` removed the approving supervisor's name from the publication gate
block, where it had been sitting in the source. SPEC 3.2 forbids the name of any
person other than Vin anywhere in the source **or in commit history**, with no
exception for a YAML comment that never renders.

The name is still present in roughly ten earlier commits touching
`src/content/projects/septic-system-design-support.md`. Clearing it needs a
history rewrite (`git filter-repo` or equivalent) and a force-push to `main`.

That is destructive and rewrites published history, so it has not been done.
Decide one way or the other:

- **Rewrite.** Correct under SPEC 3.2. Invalidates every existing clone and
  changes every commit SHA from the first offending commit onward.
- **Leave it.** The repository is public, so the name stays findable in history
  by anyone who looks. Record the decision here so it is a choice rather than an
  oversight.

Check the current state with:

```bash
./scripts/check-confidential.sh --history
git log --all -S "<surname>" --oneline -- src/content/projects/
```

---

## Owed to the firm, not to the site

### Dan's internal project list

Asked for before any of the website work started and never delivered: a list of
every project worked on at Subsurface with the service provided on each
(drilling oversight, report preparation, design services, and so on). Heather
added that for internal review it may reference project numbers.

This is internal to the firm. It does not belong in this repository, does not go
on the site, and project numbers must not appear anywhere near this codebase.
Write it somewhere else.

---

## Ordinary backlog

- **More case studies.** `SPEC.md` §12 phase 4. One of the planned set is
  published. Each new one goes through `.claude/skills/case-study/SKILL.md`
  start to finish, including its own approval packet.
- **LinkedIn URL.** A TODO marker until supplied. `npm run verify` fails while
  it is outstanding, which is the intended behaviour.
- **Club and competition dates**, and any remaining scholarships.
- **Coursework samples.** The Documents section on `/resume` is built and empty.
  See "Adding a transcript or coursework document" in `README.md`. A surveying
  field project or a drawing set would suit it. Anything from internship work
  goes through the approval process first, like any other project material.
- **Password-protecting the site.** Discussed, never built. Either a Cloudflare
  Access policy set up in the dashboard with no code changes, or HTTP Basic Auth
  via a Cloudflare Pages Function. Only worth doing to keep the site live but
  not publicly readable. Note that access control does not loosen any
  confidentiality rule: SPEC 3.2 gates the repository, not the audience.
- **Em dashes in date ranges.** Prose em dashes are gone site-wide per Vin's
  standing preference, but date ranges ("March 2026 — Present") and page titles
  still use them, since that reads as typography rather than prose. Convert them
  only if he asks.

---

## Done, recorded so it is not redone

- Case study text published 11 September 2026, PR #14, merged as `9201bbe`.
  All twelve fields were diffed against the approval packet before publishing
  and match verbatim.
- Gate block genericised so it names a role rather than a person (`8949e62`).
- Both proposed images verified corner to corner against the confidentiality
  list, twice: once on 11 September and again on 12 September before publishing.
  Both are now in the repository. The site plan went in carrying its elevations,
  as a recorded decision rather than an oversight — see the closed entry above.
- **The transcript is deliberately not published.** It was read in full and is
  clean of student ID and date of birth, so redaction was never the issue.
  Publishing a transcript publishes every grade, which adds nothing beyond the
  GPA and the curated coursework list already on `/resume`. The reasoning is on
  the `documents` field in `src/data/site.ts`. A transcript is handed over on
  request. If this is ever revisited, read the file first: many schools' exports
  do carry a student ID even though this one does not.
- **There is one degree, CMET.** The unofficial transcript carries a second
  degree-sought record for "Science/Technology & Society", a stale registrar
  record from the New Paltz transfer. Confirmed twice. Do not add it to the site
  on the strength of the transcript, which is what reading the transcript cold
  would suggest.
- **The SCDHS citation names the April 19, 2022 edition** because that is the
  copy that was on the desk, confirmed by Vin. The values used are identical in
  the June 10, 2026 edition, so naming it is precision rather than a correction.
- **GPA is 3.83**, confirmed against the transcript totals. It lives once, in
  `src/data/site.ts`; the resume page's meta description interpolates it rather
  than carrying a second copy, which is how the two previously drifted.
- **PHY 135T is completed, not in progress.** The transcript's Fall 2026
  in-progress block lists five courses and PHY 135T is not among them; College
  Physics I finished in Summer 2026 with an A. Because `/resume` renders only
  completed courses, the wrong status had been hiding it.
