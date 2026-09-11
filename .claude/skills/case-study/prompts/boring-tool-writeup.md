# Intake prompt: SPT blow-count extraction pipeline (the boring tool)

Paste the fenced block below into the Claude Code session that has the boring
tool's repository open. That session knows the code, this one does not, and the
facts have to come out of the code rather than out of anyone's memory.

What comes back is a draft Markdown file plus a list of TODOs. Save the file to
`src/content/projects/spt-blow-count-extraction.md`, then work it through
`SKILL.md` step 3 (validate) and step 4 (approval packet). Read what comes back
against the confidentiality rules yourself before committing any of it: the
other session has never seen SPEC 3.2, so this prompt carries the rules with it
and that is the only protection there is.

Why this project, and why these front matter values: SPEC 11 lists it as
candidate project 3, and Appendix A records it as one of the three
`featured: true` projects once it exists. It stays `featured: false` and
`draft: true` until it is finished, because a draft should never be one of the
three cards on the home page. `weight: 20` just places it after the septic
study; reorder freely.

The style block quoted inside the prompt is a snapshot of
`src/content/projects/septic-system-design-support.md` taken September 2026. If
that file has changed materially since, re-copy it into the block before
sending, since it is the only thing telling the other session what the house
style is.

---

```
I need a case study write-up of the tool in this repository (the SPT blow-count
extraction pipeline: it pulls standard penetration test data off scanned boring
logs, computes N-values, and applies the Caltrans Falsework Manual bearing
capacity formula). It is going on my portfolio site, vincataldo.com, as a
Markdown file in `src/content/projects/`. That site is a different repository,
so do not try to find it and do not commit anything there. Your job is to
produce the file's contents and hand them back to me as text I can paste.

You know this codebase and I do not want it described from memory or guesswork,
so read the code before you write, and cite the file paths you drew each
technical claim from in a short notes section after the draft.

## The style to match

Here is the last write-up on that site, verbatim. Match it: the field
structure, the section order, the first-person voice, the level of specificity,
the length of each field. Do not redesign the format.

---
# =============================================================================
# PUBLICATION GATE: DO NOT set draft: false until the supervisor's written
# approval, naming the specifics being approved for public posting, has been
# pasted in full immediately below this block. No approval text below = not
# approved. This gate is not optional and does not expire on a deadline.
#
# APPROVAL (paste verbatim below this line, then flip draft: false):
# TODO: not yet pasted.
# =============================================================================
title: Residential On-Site Wastewater System Design
weight: 10
featured: false
draft: true
category: Internship Work
projectType: On-site wastewater (septic) system design and sizing
timeframe: Summer 2026
role: Engineering Intern, sanitary design & drafting
summary: Sized and drafted a complete on-site wastewater (I/A OWTS) system layout in AutoCAD for a residential parcel, under the review of a licensed professional engineer.
objective: >-
  The parcel required a compliant on-site wastewater system, including an
  Innovative/Alternative Onsite Wastewater Treatment System (I/A OWTS, a
  higher-performance treatment system required for certain properties under
  Suffolk County's wastewater regulations), sized, laid out, and detailed
  for the engineer's review and eventual permitting submission.
myRole: >-
  Produced the full sanitary design and drawing set for this parcel. I
  calculated the required design flow from the bedroom count per SCDHS
  standards, selected an I/A OWTS unit (a Fujiclean CEN7 fiberglass unit)
  rated to meet that flow, and sized the leaching pool system (including
  the required future-expansion pool) to the minimum leaching area SCDHS
  requires for a residence of this size, specifying traffic-bearing
  structures where the layout placed them under paved areas. I drafted the
  entire site layout in AutoCAD myself. The system's slanted orientation,
  needed to fit the site's required setback offsets, was a design decision
  I worked out together with my supervising engineer. Supervising engineers
  reviewed the design at each stage and returned markups in Bluebeam, which
  I incorporated across successive drawing rounds. All work was reviewed
  and approved by a licensed professional engineer before issuance.
approach:
  - Calculated the required design flow from the bedroom count, per SCDHS's 110-gallons-per-bedroom-per-day standard.
  - Selected an I/A OWTS treatment unit (a Fujiclean CEN7 fiberglass unit) rated to meet or exceed that required flow.
  - Sized the leaching pool system, including the required future-expansion pool, to the minimum leaching area SCDHS requires, specifying traffic-bearing structures where the layout placed them under paved areas.
  - Drafted the complete site layout in AutoCAD, working with my supervising engineer to angle the system to fit the site's required setback offsets.
  - Incorporated revision markups from supervising engineers, received in Bluebeam, across successive drawing rounds.
  - Prepared plan and profile sheets, including cross-section details and design notes.
tools:
  - AutoCAD
  - Bluebeam Revu
standards:
  - Suffolk County Department of Health Services (SCDHS) Standards for Approval of Plans and Construction for Sewage Disposal Systems for Single-Family Residences (April 19, 2022 edition)
deliverables:
  - Sanitary system sizing calculations (design flow, I/A OWTS selection, leaching pool area)
  - Septic system layout drawing (plan view)
  - Plan and profile sheets with cross-section details
outcome: The revised layout was reviewed favorably by the project's architect and submitted for municipal permitting review.
learned: >-
  Because I did both the sizing calculations and the drafting, I learned
  firsthand how quickly a mistake in my own math could become a real
  problem: a miscalculated design flow or leaching area wouldn't get
  caught by someone else double-checking the numbers, only by the
  engineer's review at the end, or worse, in the field. It taught me to
  verify my own calculations as rigorously as I'd check someone else's
  work, and to treat the engineer's markups as the safety net they're meant
  to be rather than a correction of failure.
images: []
---

## The schema you must fill

Every field above is required and validated, in that exact order. For this one:

- `category: Technical`
- `weight: 20`
- `featured: false`
- `draft: true`
- `images: []`
- `summary` is one line, hard maximum 200 characters
- `approach` is three to six bullets
- `tools` at least one, `deliverables` at least one
- `objective` two to three sentences, `learned` two to four sentences
- Keep the publication gate comment block at the very top of the front matter,
  with the approval line left as `# TODO: not yet pasted.`

## Rules that override anything else in this prompt

**No fabrication.** Do not invent a date, a runtime, an accuracy percentage, a
page count, a number of logs processed, or an outcome. If a value is not in the
code, in the repo's history, or in an answer I give you, write
`TODO: <what is needed>` in the field and list it at the end. A TODO reaching
the built site fails that build on purpose, so a placeholder is safe and a
plausible guess is not.

**No confidential client information.** This is real work product territory.
None of the following may appear in the draft, in your notes, or in anything
you quote back to me: client or company names, street addresses, municipal case
or permit or application numbers, internal project numbers, lot numbers,
boundary survey data, site-specific elevations, title blocks, PE seals, firm
logos, or any person's name other than mine (Vincent Cataldo). If this repo
contains real scanned boring logs or PDFs as fixtures or test data, treat their
contents as confidential: you may say the pipeline was tested against real
field logs, and you may describe the format generically, but do not quote a
depth, a blow count, a boring designation, a site name, or a project number
from any of them. If you hit one, say the file contains one and stop, do not
repeat the value.

**No em dashes anywhere.** Standing style rule for the whole site. Use commas,
parentheses, or a colon.

**Attribution has to be exact, and this is the field that goes wrong.** The last
write-up had to be corrected twice, first for understating my role and then for
overstating it. This one has an extra wrinkle: the tool was built with AI
assistance, in Claude Code sessions with you. Do not let the write-up imply I
hand-wrote every line, and do not let it imply the tool is something an AI made
for me. Before you draft `myRole`, work out and then ask me to confirm:

- Which decisions were mine (what the tool had to do, which standard governs,
  what counts as a refusal condition, what a valid extraction looks like, what
  the output had to feed into)
- What I verified by hand against real logs and against the Caltrans formula
- What was generated and what I reviewed or corrected
- Anything anyone else contributed

State the AI assistance plainly in `myRole`. Stating it is a strength, the same
way "drafted under the review of a licensed professional engineer" was a
strength in the septic write-up. Hiding it and being caught is the risk.

## Framing

Frame this around the engineering problem it solves, not around the code. The
reader is a construction or geotechnical recruiter, possibly a PE, not a
software engineer. Very few construction management undergraduates build
tooling against a published technical standard, and that is the point of the
entry.

Lead the technical judgment on the refusal conditions: the cases where the tool
must not produce a computed N-value, and why emitting a number there would be
worse than emitting nothing. That detail demonstrates domain judgment rather
than programming ability, so it belongs in `objective` or the first `approach`
bullet, not buried at the bottom. Pull the actual refusal conditions out of the
code, do not describe them in the abstract.

Name the standard by its exact published title and the edition the tool was
actually written against, not whichever edition is current. If the code or its
comments do not pin an edition, that is a TODO for me, not a guess.

## Before you draft

Ask me, in one batch, the questions you cannot answer from the repository:

- Timeframe, to the season and year
- What happened to the tool afterward: is it used at work, was it shown to
  anyone, is it personal only (this is `outcome`, and a plain qualitative
  answer is fine, do not manufacture a metric)
- What it taught me (this is `learned`, and you cannot write it for me, offer
  an angle if I am stuck, but the words have to be mine or it reads like filler
  to the interviewer who asks about it)
- Anything else genuinely missing

Then draft.

## What to hand back

1. The complete Markdown file contents in one fenced block, front matter only,
   ready to paste, with a suggested filename slug.
2. A short list of every TODO left in it and what I need to supply.
3. Your notes: which repo file each technical claim came from, and any place
   you were unsure whether a detail is safe to publish.

Do not create the file in this repository and do not commit anything.
```
