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

## Ordinary backlog

- **More case studies.** `SPEC.md` §12 phase 4. One of the planned set is
  published. Each new one goes through `.claude/skills/case-study/SKILL.md`
  start to finish, including its own approval packet.
- **LinkedIn URL.** A TODO marker until supplied. `npm run verify` fails while
  it is outstanding, which is the intended behaviour.
- **Club and competition dates**, and any remaining scholarships.

---

## Done, recorded so it is not redone

- Case study text published 11 September 2026, PR #14, merged as `9201bbe`.
  All twelve fields were diffed against the approval packet before publishing
  and match verbatim.
- Gate block genericised so it names a role rather than a person (`8949e62`).
- Both proposed images verified corner to corner against the confidentiality
  list. Findings are above; neither file entered the repository.
