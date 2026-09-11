# Audit log

Standing record of the confidentiality and privacy reviews of this repository.
Spec §3.2 forbids confidential client information anywhere in the source, in
image files, in image metadata, in PDF metadata, or in commit history. This file
is where the evidence that someone actually looked lives, so the next review
starts from what was already established rather than from nothing.

Newest entry first. Add a new entry per review; do not edit old ones.

**To re-run the automated half:**

```bash
./scripts/check-confidential.sh             # text, working tree
./scripts/check-confidential.sh --history   # text, full git history
npm run check:assets                        # images and PDFs, including metadata
```

The first two and `check:assets` all run as part of `npm run verify`. The
`--history` scan is deliberately not in `verify`: see finding 1 below for why it
currently reports a hit that cannot be cleared without rewriting public history.

---

## 2026-09-11 — Confidentiality and metadata audit

**Scope.** Whole repository: working tree, all 13 reachable commits, both
committed binaries, and the deployment config. Prompted by the question "does
the repo for the boring tool have any confidential info".

**Verdict: no confidential client information.** No client names, no property
addresses, no municipal case or permit or docket numbers, no internal project
numbers, no drawings, no title blocks, no PE seals. Two findings below need a
decision from Vin; neither is client-confidential.

### What was checked

| Area | Method | Result |
| --- | --- | --- |
| Text, working tree | `check-confidential.sh` | Clean |
| Text, full history | `check-confidential.sh --history` | One hit — finding 1 |
| Secrets and keys | Searched for AWS, GitHub, OpenAI, Slack, JWT, and PEM shapes; for `apiKey`/`password`/`token` assignments; and for tracked `.env` files | None. `.gitignore` covers `.env` and `.env.production` |
| Resume PDF | Decoded every page through the font's ToUnicode CMap and read the full text; checked the document-info dictionary | Clean. Metadata already stripped — only `/Producer (pypdf)` remains |
| Headshot PNG | Walked every PNG chunk | No EXIF, no GPS, no text chunks. One provenance block — finding 2 |
| Content files | Read every file in `src/content/` | Names only Vin's own employers and organisations. No clients |
| Deleted files | Diffed every commit for added-then-removed paths | `public/favicon.svg` and a renamed club credential. Neither sensitive |
| Commit messages | Searched all subjects for client, address, permit, and case wording | Clean |

### Finding 1 — a third party's full name in the About page

`src/content/pages/about.md` named a former boss by **first name and surname**.
The full name is not repeated in this file, for the same reason it was removed
from the page; `git log -p -- src/content/pages/about.md` has it. Spec §3.2
forbids the name of "any person other than the owner", so this was a real
violation, and none of the existing patterns could see it: a person's name has
no distinctive shape, and a rule broad enough to catch it would have flagged
every organisation on the site.

**Done:** the surname is removed. The sentence now reads "my boss at the time
Brian", which matches how the same sentence already refers to "my best friend
George". A bare first name inside an autobiographical sentence identifies
nobody; a full name does. If you want the strict reading of §3.2 instead, drop
both first names — the sentence reads fine as "my boss at the time, and my best
friend".

**Done:** `check-confidential.sh` gained a `PERSON NAME` rule covering the three
cases that actually occur in a portfolio — someone introduced by their
relationship to the author, someone with an honorific, and a name followed by
professional credentials, which is the form that appears on a PE seal.

**Open — your decision.** The name is still in 13 commits of history, and this
repository is public. Clearing it means rewriting history and force-pushing,
which breaks every existing clone and every commit hash. The exposure is a
former boss's name in a sentence praising him, in a repo nobody is mining. Doing
nothing is a defensible answer. If you do want it gone:

```bash
# Replace <Firstname Surname> with the name as it appears in the old commits.
git filter-repo --replace-text <(echo '<Firstname Surname>==><Firstname>')
git push --force-with-lease origin main
```

Until that is settled, `./scripts/check-confidential.sh --history` exits
non-zero on this one known hit. That is why it is not part of `npm run verify`.

### Finding 2 — the headshot is AI-generated and the file says so

`src/assets/vin-cataldo-headshot.png` carries a 21,824-byte `caBX` chunk: a
C2PA "content credentials" manifest, cryptographically signed, asserting

- software agent `gpt-image` version 2.0,
- claim generator `OpenAI Media Service API`,
- digital source type `trainedAlgorithmicMedia` — the IPTC code for AI-generated
  media,
- an invisible watermark action,
- signed 2026-08-26 by OpenAI OpCo, LLC through the Trufo CA.

This is not confidential information and it is not a §3.2 problem. It is a
disclosure, and it is worth knowing it is there, because the page presents this
image as Vin's professional headshot on a site whose entire argument is that
every word on it is true. Spec §3.1 forbids invented content; an invented face
is the same claim in a different medium.

**Not done, deliberately.** The block was left in place. Stripping it would
remove the one machine-readable signal that the photo is synthetic and leave an
AI-generated image presented as a photograph of a real person, which is a
different and worse thing than an undisclosed one. That is a call for Vin, not
for a build script, which is why `check:assets` reports provenance blocks as a
non-blocking `NOTICE`.

**Recommended:** replace it with a real photograph. A phone camera against a
plain wall clears the bar for an intern portfolio. Then this finding closes
itself, and the published page is true in the same way the rest of the site is.

If you would rather keep it, the honest options are to caption it as
AI-generated, or to set `HEADSHOT` to `null` in `src/data/site.ts` and run
without a photo — the About page already handles the empty slot and reserves the
space so there is no layout shift.

Note that the published build is not the issue either way. Astro re-encodes the
image through sharp to WebP and AVIF, which drops the manifest, so the block
lives in the repository source rather than on the deployed page.

### Finding 3 — the scanners could not see inside binaries

Spec §3.2 covers image files, image metadata, and PDF metadata, but
`check-confidential.sh` is grep over text: it cannot read a PNG chunk or a
Flate-compressed PDF stream, so that clause was never actually enforced. The
resume PDF and the headshot had never been machine-checked by anything.

**Done:** `scripts/check-assets.mjs` (`npm run check:assets`, wired into
`npm run verify`) now opens every committed image and PDF and reads it properly
— PNG chunks, JPEG segments, WebP chunks, PDF document-info keys, embedded
original file paths, and the actual page text of every PDF run against the same
§3.2 patterns. It uses only Node's own zlib, so unlike `strip-metadata.sh` it
does not need exiftool and cannot be skipped for want of a tool.

### Finding 4 — there is no "boring tool" repository

The SPT blow-count extraction pipeline described in `SPEC.md` §11 is a candidate
project, not a codebase. No repository for it exists on the account, this
repository does not contain it, there are no submodules, and
`src/content/projects/` is still empty. Nothing to audit yet.

**Worth flagging before it is written.** That tool is the one planned project
whose inputs are inherently confidential: scanned boring logs normally carry the
client name, the site address, an internal project number, and a PE seal in the
title block. If it is built here, its test fixtures and sample files are the
most likely route for confidential material to enter this repository — and
`check-assets.mjs` reads PDF text but cannot read a *scanned* log, which is an
image of text. Redact fixtures at the source, before they are committed.

### Finding 5 — Vin's own contact details are public, by design

`src/data/site.ts` holds a personal email address and mobile number; the resume
PDF repeats both, plus a GPA. That is the intended behaviour of a portfolio site
and not a finding against §3.2, which protects everyone other than the owner.
Noting it only so it is a decision on the record rather than an oversight: the
repository is public, so both are in history permanently. `README.md` §"Before
the first deploy" already raises whether the repository should stay public.

### What no script can check

Unchanged, and worth repeating every time:

- **A client's company name.** No pattern recognises it. Read what you wrote.
- **What is visible inside an image.** A title block, a street sign, a site
  placard, or a legible drawing in a photograph is invisible to every check
  here. Look at your own images.
- **Whether a generic description is generic enough.** "A waterfront property in
  a small North Shore village" is one search away from being an address.
