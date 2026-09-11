# Open items

Last updated 2026-09-11. Nothing here is urgent or blocking the live site.

---

## 1. Send the approval packet to Heather and Dan

**Status: built, not sent. Waiting on you.**

The packet is a Word document containing the exact case study text, both
redacted images, a list of what was removed from each, and a confidentiality
checklist. It was delivered as a download; if you still have it, send that.

If you no longer have it, regenerate it:

```bash
npm install docx
node .claude/skills/case-study/build-approval-packet.cjs \
  --slug septic-system-design-support \
  --images-dir <folder with plan-view.png and calc-sheet.png> \
  --out ./Portfolio-Approval-Request.docx
```

The two images are in Google Drive under the SSE folder; the filenames and
Drive ids are recorded in `.claude/skills/case-study/packets/septic-system-design-support.json`.
Download them, rename them as the manifest says, and run `npm run strip-metadata`.

Before sending:

- [ ] Open the .docx in Word once and check the page breaks around the images.
      It has been validated for schema, content, and embedded images, but not
      for layout, because LibreOffice could not render it in the container.
- [ ] Reply on the existing email thread rather than starting a new one, so
      Heather's earlier instructions sit directly above the request.

Email body to go with it:

> Hi Dan and Heather,
>
> Thanks again for the guidance on this. Attached is the write-up I would like
> to put on my portfolio site, laid out so you can see exactly what would be
> published.
>
> The document has the full text word for word, both images I would use, and a
> list of what I removed from each. I also included a checklist of what is
> deliberately left out, so the confidentiality side is visible at a glance
> instead of something you have to hunt for.
>
> Nothing has been published and nothing will be until you tell me it is
> approved. If it is easier, replying with just "approved," "approved with
> these changes," or "leave it out" is plenty. Marking up the document directly
> works too.
>
> This is one project only for now. If this format works for you, I will run
> any future write-up through the same process before anything goes up.
>
> Thanks,
>
> Vincent Cataldo
> Intern

---

## 2. Publish the case study, once approved

**Status: blocked on item 1. Do not do this first.**

`src/content/projects/septic-system-design-support.md` is `draft: true`, so no
page is generated for it. To publish after Heather approves:

1. Paste her approval verbatim into the gate comment at the top of that file.
2. Change `draft: true` to `draft: false`.
3. Add the images: put them in `public/images/projects/septic-system-design-support/`,
   run `npm run strip-metadata`, and fill in the `images:` array (`src`, `alt`,
   `caption` per entry).
4. `npm run build`, then check `/projects/septic-system-design-support`.

If she approves the text but not the images, or the other way round, publish
only the part she approved.

The images must not enter the repository before that approval exists. SPEC 3.2
gates the repository, not the live site, because git history is effectively
permanent.

---

## 3. Dan's internal project list

**Status: not started. Requested before any of the website work.**

Dan asked for a list of every project worked on at Subsurface with the service
provided on each (drilling oversight, report preparation, design services, and
so on). Heather added that for internal review it can reference project numbers.

This is internal to the firm. It does not go in this repository, does not go on
the site, and should not reference project numbers anywhere near this codebase.

---

## 4. Optional, whenever

- **Case studies 2 and 3.** Nothing started. Run `/case-study` and it will ask
  for what it needs. Pick work you can explain the reasoning behind, not the
  most complex thing you touched.
- **Coursework samples.** The Documents section on `/resume` is built and
  empty. See README, "Adding a transcript or coursework document." A surveying
  field project or a drawing set would suit it.
- **Password-protecting the site.** Discussed, not built. Two options: a
  Cloudflare Access policy configured in the dashboard with no code changes, or
  HTTP Basic Auth via a Cloudflare Pages Function. Only worth doing if you want
  the site live but not publicly readable.
- **Em dashes in date ranges.** Prose em dashes are gone site-wide per your
  preference, but date ranges ("March 2026 — Present") and page titles still
  use them, since that is conventional typography rather than prose. Say the
  word if you want those converted too.

---

## Settled, do not redo

- **The transcript is deliberately not published.** It was read in full. It is
  clean of student ID and date of birth, so redaction was never the issue;
  publishing a transcript publishes every grade, which adds nothing beyond the
  GPA and coursework list already on the page. See the comment on `documents`
  in `src/data/site.ts`.
- **There is one degree, CMET.** The transcript carries a second degree-sought
  record for "Science/Technology & Society", a stale registrar record from the
  New Paltz transfer. Confirmed twice. Do not add it on the strength of the
  transcript.
- **The SCDHS citation names the April 19, 2022 edition** because that is the
  copy that was on the desk. The values used are identical in the June 10, 2026
  edition, so this is precision, not a correction.
