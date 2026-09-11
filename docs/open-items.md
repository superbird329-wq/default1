# Open items

The running list of what is unfinished on this site. Update it when something
lands so it stays the one place worth reading.

Last updated: 11 September 2026.

---

## Blocked on someone else

### Septic case study images

The write-up is **published** (`src/content/projects/septic-system-design-support.md`,
`draft: false`, live since 11 September 2026). Both images are **held back**, and
`images: []` must stay empty until the item below clears.

**Why they are held.** The approval email of 11 September approves "your write
up". Section 1 of the 3 September approval packet lists the write-up and the
"two redacted images" as separate items, so that wording is not read as covering
the images. More importantly, section 5 of that packet certified "Site
elevations: Removed from image" for the site plan, and that certification was
wrong. Still on the drawing:

- Rim and invert elevations in several structure callouts
- A top-of-wall and bottom-of-wall elevation pair
- A spot elevation on the fence line
- Several labelled contour lines

Section 4 of the same packet was narrower and accurate (it claimed only the
finished floor and basement floor elevations were removed). Sections 4 and 5
contradicted each other and section 5 was the one written as a certification.

Elevations are confidential under SPEC 3.2 in their own right, and a labelled
contour set plus the shape of the property line can match a parcel in the county
GIS viewer with no name, address, lot number or title block anywhere on the
sheet. So the approval was given against a description that was not true, and it
cannot carry that file.

**To clear it:**

1. Remove the elevations at the CAD source, not by painting over the export, so
   nothing is recoverable underneath. Re-export the crop.
2. Check the new crop corner to corner against the confidentiality list in
   `.claude/skills/case-study/SKILL.md`. The first crop of this drawing passed a
   casual look and still carried a lot number and a boundary bearing.
3. Open `docs/approvals/septic-images-addendum.md`, drop in the corrected image,
   send it. A .docx of the same document was generated on 11 September and sent
   to Vin directly; the markdown here is the source of record if that file is
   lost.
4. When the reply arrives, paste it into the gate block at the top of the case
   study following the rules already written there (body verbatim, approver as a
   role not a name, unredacted original kept outside the repo).
5. Only then add the images: `public/img/`, `npm run strip-metadata`, then fill
   the `images` list. See "Adding images to a project" in `README.md`.

Image 2 (the sizing calculations excerpt) was checked corner to corner and is
clean: no address, no client name, no permit or application number, no lot
number, no elevations, no title block or seal, no file metadata. It is held only
because it was submitted as half of a pair and the reply does not name it. The
addendum offers "calculations only" as one of its three options, so a one-line
answer can release it on its own.

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
  list. Findings are above; neither file entered the repository.
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
