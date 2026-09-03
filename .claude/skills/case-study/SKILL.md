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
  title rather than an approximation
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
