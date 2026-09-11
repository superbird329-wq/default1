---
name: case-study
description: Write, correct, or prepare a project case study for this portfolio site, including the supervisor approval packet. Use when adding a project to src/content/projects/, writing up internship or academic work, revising an existing case study, or preparing material for Subsurface Engineering to review before it can be published.
---

# Writing a project case study

The owner (Vin) is an engineering intern at a firm that does real client work.
Every case study describes work done for a real client under a real licensed
engineer. That makes two things true at once: the write-up has to be specific
enough to prove competence, and it can never disclose whose project it was.
This skill exists because both halves are easy to get wrong in ways that are
expensive to undo.

Read `SPEC.md` sections 3.1, 3.2, and 6.3 before writing. They are the
authority; this file is the working procedure.

## Hard rules

Break any of these and the work has to be thrown away, not edited.

**Confidentiality.** None of the following may appear in content, in an image,
in image or PDF metadata, in a commit message, or in git history: client or
company names, street addresses, municipal case or permit or application
numbers, internal project numbers, lot numbers, boundary survey data (bearings
and distances), site-specific elevations, title blocks, professional engineer
seals, firm logos, or the name of any person other than Vin.

A lot number plus a boundary bearing is enough to find a parcel in a public
county GIS lookup. Treat that combination as identifying even though neither
piece names anyone.

**Images may not enter the repository before written approval exists.** Not on
a draft branch, not with `draft: true`, not "temporarily." SPEC 3.2 gates the
repository, not the live site, because git history is effectively permanent.
Until an approval is pasted into the file's gate block, images stay out of the
repo entirely. Local working tree for a preview is fine if it is reverted
before any commit, and `git status` is checked before pushing.

**Never flip `draft: false`** until the supervisor's written approval is pasted
verbatim into the gate comment block at the top of the file.

**Never invent a fact.** Not a date, not an outcome, not a quantity, not a
standard that was probably applied. If it is unknown, write `TODO: <what is
needed>` in the field. `scripts/check-todos.sh` fails the build on any TODO
reaching `dist/`, so a placeholder cannot silently ship. A plausible guess can.

**No em dashes anywhere.** Use commas, parentheses, or a colon. This is a
standing style rule across the whole site (see commit 4e5ca52).

**Do not repeat confidential specifics back in conversation either.** If a
document or pasted email contains an address or a permit number, say that it
contains one and stop. Do not quote the value. This is a smaller exposure than
committing it, but it is still avoidable exposure.

## Step 1: intake

Do not write a single field before these are answered. Filling gaps with
reasonable-sounding text is the specific failure this step prevents.

Ask for the documents:

- The drawing or deliverable, cropped if he has already cropped it, raw if not
  (offer to specify the crop)
- Any calculation sheets
- The governing code or standard, so it can be cited by its exact published
  title rather than an approximation. Ask which edition was actually on the
  desk, not which one is current. Standards get reissued, offices do not
  switch the day a revision drops, and the write-up should name the edition
  the work was done to.
- Any markups or review comments received

Ask the questions, and map each answer to a schema field:

| Ask | Fills |
|---|---|
| What kind of project, described generically? | `projectType`, `title` |
| When, to the season and year? | `timeframe` |
| What did you personally do, start to finish? | `myRole`, `approach` |
| **What did anyone else do?** | `myRole` |
| What software did you use yourself? | `tools` |
| Which codes or standards did you apply, by name? | `standards` |
| What did you actually produce? | `deliverables` |
| What happened to it afterward? | `outcome` |
| What did the work teach you? | `learned` |

The attribution question is the one that goes wrong. Ask it directly and then
ask again from the other side: did anyone else touch the file, and were any of
the design decisions someone else's call or made jointly? A first answer of
"I did all of it" frequently becomes "well, my boss worked out the orientation
with me" when asked the second way. Get that before drafting, not after.

`learned` cannot be written for him. Offer an angle if he is stuck, but the
reflection has to be his or it reads like filler to the interviewer who asks
about it.

## Step 2: draft

Follow the section order in SPEC 6.3, which `ProjectLayout.astro` enforces and
`src/content.config.ts` validates. Do not restructure the page for one project.
Every case study shares a layout so a recruiter can compare them without
re-learning where things are.

On attribution, SPEC 6.3.3 requires distinguishing individual contribution from
team output, and states supervision plainly. "Drafted under the review of a
licensed professional engineer" is accurate and is a strength, not a hedge.
Vagueness is not the safe middle here. Precision is: name what he did alone,
name what was joint, name what was reviewed.

Be concrete where it costs nothing. A named product (a Fujiclean CEN7 unit) is
a catalog item, not confidential, and it reads as real knowledge where "a
treatment unit" reads as generic. A published county standard cited by its full
title does the same work. Neither identifies a client.

Set `draft: true` and leave `images: []`.

Add the gate block at the top of the front matter if the file is new:

```yaml
# =============================================================================
# PUBLICATION GATE: DO NOT set draft: false until the supervisor's written
# approval, naming the specifics being approved for public posting, has been
# pasted in full immediately below this block. No approval text below = not
# approved. This gate is not optional and does not expire on a deadline.
#
# APPROVAL (paste verbatim below this line, then flip draft: false):
# TODO: not yet pasted.
# =============================================================================
```

## Step 3: validate before committing

```bash
npm run build                  # schema validation
grep -rIn "TODO" dist/         # must be empty before anything goes live
npm run check:confidential
grep -n "—" src/content/projects/<file>.md    # must return nothing
rm -rf dist .astro             # do not commit build output
git status --short             # no stray images, no flipped draft flag
```

To preview the rendered page, temporarily set `draft: false` in the working
tree, run `npm run dev`, and screenshot with the global Playwright binary at
`/opt/node22/bin/playwright` (the project has no local Playwright dependency).
Revert the flag and delete any temporary image before committing. Verify with
`git status` rather than memory.

Metadata stripping needs exiftool, which is not present in a fresh container:
`apt-get install -y libimage-exiftool-perl`, then `npm run strip-metadata`.

## Step 4: the approval packet

The supervisors asked to review material before it is posted. Give them a
decision document, not a request that they do work. Assemble:

1. **What is being asked.** One short paragraph: permission to publish this
   description and these images on a personal portfolio site.
2. **The project in general terms.** Two lines, no identifiers, so they can
   tell which job it is without it being written down.
3. **The proposed text, verbatim,** exactly as it would appear publicly. Not a
   summary of it. They are approving specific words.
4. **Each proposed image,** with its caption and an explicit list of what was
   cropped or removed from it (lot number, boundary bearings, elevations, title
   block, seal, metadata).
5. **What is deliberately absent.** The confidentiality checklist, shown as
   satisfied: no client name, no address, no permit or application number, no
   project number, no third-party names, supervision stated.
6. **Three clear options for the reply:** approve as written, approve with the
   changes they mark, or exclude entirely.

Ask him how he wants it delivered before building it. A published artifact
gives a shareable link; a document he sends from his own email may suit a
supervisor better. It is his relationship, so it is his call.

### Building it

`build-approval-packet.cjs` in this directory emits the .docx. It reads the
case study text straight from `src/content/projects/<slug>.md`, so the packet
cannot drift from what would actually be published. Everything specific to the
request lives in `packets/<slug>.json`: recipients, what is being asked, the
images with what was redacted from each, and the confidentiality checklist.

```bash
npm install docx          # not a project dependency, install on demand
node .claude/skills/case-study/build-approval-packet.cjs \
  --slug septic-system-design-support \
  --images-dir /path/to/redacted/images \
  --out ./Portfolio-Approval-Request.docx
```

The `.cjs` extension is load-bearing: this package is `"type": "module"`, so a
`.js` file would be parsed as ESM and `require` would fail.

The images are not in the repository and must not be, per the gate above. The
manifest's `_comment` records where they live and under what names. Download
them, run `npm run strip-metadata`, then point `--images-dir` at them.

Verify before sending. LibreOffice is frequently missing from a fresh
container, so `soffice --convert-to pdf` may fail on any input, which says
nothing about the document. Check it the other way instead:

```bash
python3 <docx-skill>/scripts/office/validate.py <file>.docx   # schema
unzip -l <file>.docx | grep media                             # images embedded
unzip -p <file>.docx word/document.xml | grep -c "—"          # must be 0
```

Then tell him to open it in Word once, because none of that checks how the
pages break around the images.

## Failure modes seen before

**Understating the work.** The first draft of the septic case study said
"assisted in drafting." He had done the entire drawing set and all of the
sizing calculations himself. "Assisted" was written because the intake never
asked what he personally did versus what the engineer did.

**Then overstating it.** The correction went to "I drafted the entire site
layout in AutoCAD myself; no one else touched the CAD file." His supervising
engineer had worked out the system's slanted orientation with him. Both drafts
were wrong, in opposite directions, from the same root cause: not asking
precisely enough.

**Rebuilding a confidential detail from a supplied document.** An email pasted
in as context for the `outcome` field contained a project number, a site
address, and third-party names. The outcome line had to be written from what
happened, not from what the email said. Read source documents for the fact,
then write the fact generically.

**Assuming a redacted crop is clean.** The first crop still carried a lot
number and a boundary bearing. Check every crop against the confidentiality
list above, corner to corner, before treating it as usable.

**Certifying a redaction that was never made.** This is the worst one so far,
because it left the repository and reached the supervisors. The 3 September
2026 packet certified "Site elevations: Removed from image" for the site plan.
They were not removed. Rim and invert elevations in the structure callouts, a
top-of-wall and bottom-of-wall pair, a spot elevation on the fence line and
several labelled contour lines were all still on the drawing. What had actually
been checked, weeks earlier, was that the dwelling's finished floor and basement
floor elevations were cropped; that narrower and true claim was sitting in the
same document, in the per-image list, contradicting the checklist. The
supervisor then approved against a description that was false.

Two rules come out of it. The checklist in section 5 is a certification, so
verify every row against every image at the moment of sending, and never carry a
row forward because a previous packet had it. And when a per-image list and the
checklist say different things about the same image, stop: one of them is wrong,
and the broader claim is the one to distrust.

Note also what did and did not save this. The images had not entered the
repository, because that gate is absolute and does not depend on anyone's
judgement being right. The checklist depended on judgement and failed. Prefer
mechanical gates to careful ones.

**Certifying a redaction that was never done.** Section 5 of the septic
approval packet listed "Site elevations: Removed from image" for the site plan.
They had not been removed: rim and invert elevations, a top-of-wall and
bottom-of-wall pair, a spot elevation on the fence line, and several labelled
contour lines were all still on the drawing. Section 4 of the same packet was
narrower and accurate, claiming only that the finished floor and basement floor
elevations were gone. The two sections contradicted each other and the wrong one
was the one written as a certification.

This is worse than an unredacted crop, because the supervisor then approves
against a description rather than against the file, and the error is in Vin's
document rather than in their reply. An approval obtained that way cannot be
relied on, and the packet is the evidence that they were told wrong.

So: build section 5 by reading the image, not by reading section 4. Every line
of that checklist is a claim someone will rely on. If a line says "removed",
open the file and confirm it is removed.

**Reading an approval as broader than it is.** The reply to that packet said
"we are ok with your write up". It did not mention the images, and the reason it
gave (no personal client contact information) is not the test the images have to
pass. Section 1 of the packet itself had listed the write-up and the images as
separate items, so the narrow reading is the correct one. Publish exactly what
the words cover. When an approval is ambiguous, the cost of asking again is one
email; the cost of guessing wide is a client's drawing in permanent git history.

A useful shape for the re-ask is `docs/approvals/septic-images-addendum.md`:
own the error plainly, list what is actually on the file, and give three
one-line options to reply with.

**Asserting why a code requirement applies.** The objective said an I/A OWTS
is required "in certain groundwater management zones." What was actually
known is that one was required on this parcel. The trigger conditions in the
Suffolk County regulations are more involved than that, so the sentence
stated a mechanism that had not been verified. This is the no-fabrication
rule in a form that is easy to miss, because the invented part is an
explanation rather than a number. Describe what the standard required here.
Do not explain when it applies generally unless the source document has been
read and says so. A reviewer with a PE will notice, and the write-up is aimed
at exactly those readers.
