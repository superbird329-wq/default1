#!/usr/bin/env node
/*
 * Build a supervisor approval packet (.docx) for one project case study.
 *
 * The case study text is read from src/content/projects/<slug>.md, so the
 * packet cannot drift from what would actually be published. Everything that
 * is specific to the approval request rather than to the site (who it is
 * addressed to, what is being asked, and the images with what was redacted
 * from each) lives in a manifest under packets/<slug>.json.
 *
 * Images are NOT in this repository and must not be. SPEC 3.2 gates drawing
 * images at the repository, not the live site, until written approval exists.
 * Point --images-dir at wherever the approved-for-review copies actually live;
 * the manifest records the filenames and what was removed from each.
 *
 *   npm install docx            # not a project dependency, install on demand
 *   node .claude/skills/case-study/build-approval-packet.cjs \
 *     --slug septic-system-design-support \
 *     --images-dir /path/to/images \
 *     --out ./Portfolio-Approval-Request.docx
 *
 * Verify the result before sending it. LibreOffice is often absent in a
 * container, in which case check the schema and content instead:
 *   python3 <docx-skill>/scripts/office/validate.py <file>.docx
 *   unzip -l <file>.docx | grep media
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  ImageRun, LevelFormat, convertInchesToTwip,
} = require('docx');

// ---- arguments -------------------------------------------------------------

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith('--')) acc.push([cur.slice(2), arr[i + 1]]);
    return acc;
  }, []),
);

const REPO = path.resolve(__dirname, '../../..');
const slug = args.slug;
if (!slug) {
  console.error('error: --slug is required, e.g. --slug septic-system-design-support');
  process.exit(1);
}

const imagesDir = args['images-dir'];
const outPath = args.out || path.join(process.cwd(), `Portfolio-Approval-Request-${slug}.docx`);
const manifestPath = args.manifest || path.join(__dirname, 'packets', `${slug}.json`);

// ---- inputs ----------------------------------------------------------------

const mdPath = path.join(REPO, 'src/content/projects', `${slug}.md`);
if (!fs.existsSync(mdPath)) {
  console.error(`error: no case study at ${mdPath}`);
  process.exit(1);
}
const raw = fs.readFileSync(mdPath, 'utf8');
const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
if (!fm) {
  console.error(`error: no front matter in ${mdPath}`);
  process.exit(1);
}
const cs = yaml.load(fm[1]);

if (!fs.existsSync(manifestPath)) {
  console.error(`error: no manifest at ${manifestPath}`);
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

/* A published case study does not need an approval packet. Catching this here
   avoids sending a supervisor a request for something already live. */
if (cs.draft === false) {
  console.warn(`warning: ${slug} is draft: false, i.e. already publishable.`);
}

const today = new Date().toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/New_York',
});

// ---- styling helpers -------------------------------------------------------

const INK = '1A1A1A';
const GRAY = '5A5A5A';
const RULE = 'C8C8C8';

const h1 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 32, color: INK })],
  spacing: { after: 120 },
});

const h2 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 24, color: INK })],
  spacing: { before: 360, after: 140 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 6 } },
});

const h3 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 21, color: INK })],
  spacing: { before: 240, after: 100 },
});

const p = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, size: 21, color: opts.color || INK, italics: !!opts.italics })],
  spacing: { after: opts.after === undefined ? 140 : opts.after },
});

const bullet = (text) => new Paragraph({
  children: [new TextRun({ text, size: 21, color: INK })],
  numbering: { reference: 'packet-bullets', level: 0 },
  spacing: { after: 80 },
});

/* The exact words proposed for publication, set off by a rule so a reviewer
   can see at a glance where quoted content starts and stops. */
const quoted = (label, text) => new Paragraph({
  children: [
    ...(label ? [new TextRun({ text: label, bold: true, size: 21, color: INK }),
                 new TextRun({ text: '  ', size: 21 })] : []),
    new TextRun({ text, size: 21, color: INK }),
  ],
  spacing: { after: 140 },
  indent: { left: convertInchesToTwip(0.3) },
  border: { left: { style: BorderStyle.SINGLE, size: 12, color: RULE, space: 10 } },
});

const quotedItem = (text) => new Paragraph({
  children: [new TextRun({ text, size: 21, color: INK })],
  numbering: { reference: 'packet-numbers', level: 0 },
  spacing: { after: 70 },
  indent: { left: convertInchesToTwip(0.65) },
});

// ---- confidentiality checklist --------------------------------------------

const TABLE_W = 9360;
const COL = [6800, 2560];

const cell = (text, opts = {}) => new TableCell({
  width: { size: opts.w, type: WidthType.DXA },
  shading: opts.shade ? { type: ShadingType.CLEAR, fill: 'F2F2F2', color: 'auto' } : undefined,
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  children: [new Paragraph({
    children: [new TextRun({ text, size: 20, bold: !!opts.bold, color: INK })],
  })],
});

const checklist = new Table({
  columnWidths: COL,
  width: { size: TABLE_W, type: WidthType.DXA },
  borders: ['top', 'bottom', 'left', 'right', 'insideHorizontal', 'insideVertical']
    .reduce((b, k) => ({ ...b, [k]: { style: BorderStyle.SINGLE, size: 4, color: RULE } }), {}),
  rows: [
    new TableRow({
      tableHeader: true,
      children: [cell('Item', { w: COL[0], bold: true, shade: true }),
                 cell('Status', { w: COL[1], bold: true, shade: true })],
    }),
    ...manifest.checklist.map(([item, status]) => new TableRow({
      children: [cell(item, { w: COL[0] }), cell(status, { w: COL[1] })],
    })),
  ],
});

// ---- images ----------------------------------------------------------------

/* PNG dimensions straight from the IHDR chunk, so the aspect ratio is right
   without pulling in an image library for two numbers. */
const pngSize = (buf) => ({ w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) });

const imageBlocks = [];
for (const [i, img] of manifest.images.entries()) {
  if (!imagesDir) {
    console.error('error: --images-dir is required when the manifest lists images');
    process.exit(1);
  }
  const file = path.join(imagesDir, img.file);
  if (!fs.existsSync(file)) {
    console.error(`error: manifest lists ${img.file} but it is not in ${imagesDir}`);
    process.exit(1);
  }
  const data = fs.readFileSync(file);
  const { w, h } = pngSize(data);
  const width = img.width || 468;
  const height = Math.round(width * (h / w));

  imageBlocks.push(h3(`Image ${i + 1}: ${img.title}`));
  imageBlocks.push(p(`Proposed caption: "${img.caption}"`));
  imageBlocks.push(new Paragraph({
    children: [new ImageRun({ data, type: 'png', transformation: { width, height } })],
    spacing: { before: 100, after: 100 },
  }));
  if (img.removed && img.removed.length) {
    imageBlocks.push(p('Removed from this image before it was proposed:'));
    img.removed.forEach((r) => imageBlocks.push(bullet(r)));
  }
  if (img.note) imageBlocks.push(p(img.note));
}

// ---- document --------------------------------------------------------------

const level = (format, text, hang) => ({
  level: 0, format, text, alignment: AlignmentType.LEFT,
  style: { paragraph: { indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(hang) } } },
});

const doc = new Document({
  numbering: {
    config: [
      { reference: 'packet-bullets', levels: [level(LevelFormat.BULLET, '•', 0.18)] },
      { reference: 'packet-numbers', levels: [level(LevelFormat.DECIMAL, '%1.', 0.18)] },
      { reference: 'reply-options', levels: [level(LevelFormat.UPPER_LETTER, '%1.', 0.22)] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },          // US Letter
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children: [
      h1('Portfolio Content: Request for Approval'),
      p(manifest.from, { color: GRAY, after: 40 }),
      p(`To: ${manifest.to.join(', ')}`, { color: GRAY, after: 40 }),
      new Paragraph({
        children: [new TextRun({ text: today, size: 21, color: GRAY })],
        spacing: { after: 200 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: INK, space: 8 } },
      }),

      h2('1. What I am asking for'),
      ...manifest.asking.map((t) => p(t)),

      h2('2. The project, in general terms'),
      p(manifest.generalTerms),

      h2('3. The proposed text, exactly as it would appear'),
      p('This is the complete published text. There is no other copy about this project anywhere on the site.',
        { italics: true, color: GRAY }),

      h3('Title and heading information'),
      quoted('Title:', cs.title),
      quoted('Category:', cs.category),
      quoted('Type:', cs.projectType),
      quoted('Timeframe:', String(cs.timeframe)),
      quoted('Role:', cs.role),
      quoted('Summary:', cs.summary),

      h3('Objective'),
      quoted(null, cs.objective),

      h3('My role'),
      quoted(null, cs.myRole),

      h3('Approach'),
      ...cs.approach.map(quotedItem),

      h3('Tools and standards'),
      quoted('Software:', cs.tools.join(', ')),
      ...(cs.standards && cs.standards.length
        ? [quoted('Codes and standards:', cs.standards.join('; '))] : []),

      h3('Deliverables'),
      ...cs.deliverables.map(quotedItem),

      h3('Outcome'),
      quoted(null, cs.outcome),

      h3('What I learned'),
      quoted(null, cs.learned),

      new Paragraph({ children: [new TextRun({ text: '', size: 2 })], pageBreakBefore: true }),

      h2('4. The proposed images'),
      ...imageBlocks,

      h2('5. What is deliberately not included'),
      p('I checked the write-up and every image against the following, line by line:'),
      checklist,

      h2('6. What I need from you'),
      p('Whichever of these is easiest to reply with is fine:'),
      ...manifest.replyOptions.map((t) => new Paragraph({
        children: [new TextRun({ text: t, size: 21, color: INK })],
        numbering: { reference: 'reply-options', level: 0 },
        spacing: { after: 100 },
      })),
      ...manifest.closing.map((t) => p(t)),
      p(manifest.signature, { after: 20 }),
      p(manifest.signatureTitle, { color: GRAY }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outPath, buf);
  console.log(`written: ${outPath} (${buf.length} bytes, ${manifest.images.length} image(s))`);
});
