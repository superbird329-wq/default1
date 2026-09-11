#!/usr/bin/env node
/**
 * Scan committed images and PDFs for metadata and for confidential text.
 *
 *   npm run check:assets
 *
 * Spec §3.2 forbids confidential information "in image files, in image
 * metadata, in PDF metadata, or in commit history". Spec §3.3 requires EXIF,
 * XMP, and document metadata to be stripped from everything committed.
 *
 * check-confidential.sh enforces §3.2 for text files, but grep cannot see
 * inside a PNG chunk or a Flate-compressed PDF content stream. This script is
 * the other half: it opens each binary and reads it properly.
 *
 * It deliberately does NOT depend on exiftool. exiftool is optional (README:
 * "Stripping metadata") and is not installed everywhere, so the one check that
 * must never be skipped is written against Node's own zlib and nothing else.
 *
 * Two severities:
 *
 *   FAIL   Something that must not ship: author or creator names, GPS
 *          coordinates, original file paths, or §3.2 text inside a PDF.
 *          Exits non-zero.
 *
 *   NOTICE Provenance records — C2PA / "content credentials" — that disclose
 *          how an asset was produced. These are not confidential and removing
 *          one is a judgement call for the owner, not something a build gate
 *          should force. Always printed, never fatal. See AUDIT.md.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, extname } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Only these two trees hold published assets. dist/ is generated; skip it. */
const SEARCH_PATHS = ['src', 'public'];
const SKIP_DIRS = new Set(['node_modules', 'dist', '.astro', '.git']);

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.tif', '.tiff', '.avif']);
const PDF_EXT = new Set(['.pdf']);

let failures = 0;
let notices = 0;

const fail = (file, what) => {
  failures += 1;
  console.log(`  [FAIL]   ${file}`);
  console.log(`           ${what}`);
};

const notice = (file, what) => {
  notices += 1;
  console.log(`  [NOTICE] ${file}`);
  console.log(`           ${what}`);
};

/* ------------------------------------------------------------------ *
 * §3.2 patterns for text recovered from inside a PDF.
 *
 * KEEP IN SYNC with scripts/check-confidential.sh, which applies the same
 * rules to text files. Written here in JavaScript regex rather than POSIX
 * ERE, so the two spellings differ even though the rules do not.
 * ------------------------------------------------------------------ */
const STREET =
  '(?:St|Street|Ave|Avenue|Rd|Road|Dr|Drive|Ln|Lane|Blvd|Boulevard|Ct|Court|Pl|Place|Hwy|Highway|Tpke|Turnpike)';

const TEXT_RULES = [
  ['ADDRESS', new RegExp(`\\b\\d{1,5}\\s+(?:[A-Z][a-zA-Z]+\\s+){1,3}${STREET}\\b`, 'g')],
  ['CASE/PERMIT NUMBER', /\b(?:Case|Docket|Permit|Application|Job|Project)[\s#:.-]*(?:No\.?|Number|#)?\s*\d{3,}/g],
  ['PROJECT NUMBER', /\b\d{2}-\d{3,4}\b/g],
  ['PHONE', /\(?\d{3}\)?[-. ]\d{3}[-. ]\d{4}/g],
];

/**
 * Vin's own phone number is published by design and appears on his resume.
 * Anyone else's is exactly what §3.2 forbids, so only this one value is
 * exempt — not the pattern.
 */
const OWN_PHONE = /\(?516\)?[-. ]?359[-. ]?8864/;

/* ------------------------------------------------------------------ *
 * PNG
 * ------------------------------------------------------------------ */

/**
 * PNG is a chunk container. Metadata rides in named chunks alongside the
 * pixels, so the file can carry a camera's GPS fix or a generator's signed
 * provenance manifest while looking like an ordinary image.
 */
const PNG_CHUNKS = {
  eXIf: ['fail', 'EXIF block (may carry GPS coordinates, camera serial, timestamps)'],
  tEXt: ['fail', 'uncompressed text chunk (author, software, comments)'],
  zTXt: ['fail', 'compressed text chunk (author, software, comments)'],
  iTXt: ['fail', 'XMP / international text chunk (author, software, original path)'],
  caBX: ['notice', 'C2PA content credentials (JUMBF) — signed record of how the image was produced'],
};

const readPng = (buf, file) => {
  let offset = 8; // 8-byte PNG signature
  while (offset + 8 <= buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString('latin1', offset + 4, offset + 8);
    if (type === 'IEND') break;

    const rule = PNG_CHUNKS[type];
    if (rule) {
      const [severity, description] = rule;
      const detail = `PNG "${type}" chunk, ${length} bytes — ${description}`;
      if (severity === 'fail') fail(file, detail);
      else notice(file, `${detail}${describeC2pa(buf.subarray(offset + 8, offset + 8 + length))}`);
    }
    offset += 12 + length; // length + type + data + CRC
  }
};

/**
 * Pull the human-readable claim out of a C2PA manifest so the notice says
 * what the provenance record actually asserts, not just that one exists.
 * The manifest is CBOR inside JUMBF; the fields worth reporting are short
 * ASCII strings, so scraping them is enough and avoids a CBOR dependency.
 */
const describeC2pa = (box) => {
  const text = box.toString('latin1');
  const bits = [];

  /*
   * Read the CBOR text string that follows a map key. CBOR length-prefixes
   * every string: major type 3 encodes a length under 24 in the header byte
   * itself, and 0x78 means "the next byte is the length". Reading the length
   * is the only way to know where the value ends — the bytes after it are the
   * next key, and they are ordinary letters too.
   */
  const cborTextAfter = (key) => {
    const at = text.indexOf(key);
    if (at === -1) return null;
    let p = at + key.length;
    const header = box[p];
    let length;
    if (header >= 0x60 && header < 0x78) length = header - 0x60;
    else if (header === 0x78) length = box[(p += 1)];
    else return null;
    return box.toString('utf8', p + 1, p + 1 + length) || null;
  };

  const agent = cborTextAfter('msoftwareAgent\xa2dname') ?? cborTextAfter('dname');
  const generator = cborTextAfter('tclaim_generator_info\xa2dname');
  const source = /digitalsourcetype\/([a-zA-Z]+)/.exec(text);

  if (agent) bits.push(`software "${agent}"`);
  if (generator) bits.push(`generator "${generator}"`);
  if (source) bits.push(`source type "${source[1]}"`);
  return bits.length ? `\n           asserts: ${bits.join(', ')}` : '';
};

/* ------------------------------------------------------------------ *
 * JPEG / WebP
 * ------------------------------------------------------------------ */

const readJpeg = (buf, file) => {
  let offset = 2; // SOI
  while (offset + 4 <= buf.length) {
    if (buf[offset] !== 0xff) break;
    const marker = buf[offset + 1];
    if (marker === 0xda || marker === 0xd9) break; // start of scan / end of image
    const length = buf.readUInt16BE(offset + 2);
    const body = buf.toString('latin1', offset + 4, offset + 4 + Math.min(length, 64));

    if (marker === 0xe1 && body.startsWith('Exif')) {
      fail(file, 'JPEG APP1 EXIF block (may carry GPS coordinates, camera serial, timestamps)');
    } else if (marker === 0xe1 && body.includes('ns.adobe.com/xap')) {
      fail(file, 'JPEG APP1 XMP block (author, software, original file path)');
    } else if (marker === 0xed) {
      fail(file, 'JPEG APP13 Photoshop/IPTC block (author, credit, caption)');
    } else if (marker === 0xfe) {
      fail(file, 'JPEG comment segment');
    } else if (marker === 0xeb) {
      notice(file, 'JPEG APP11 JUMBF box — C2PA content credentials');
    }
    offset += 2 + length;
  }
};

const readWebp = (buf, file) => {
  const text = buf.toString('latin1');
  if (text.includes('EXIF')) fail(file, 'WebP EXIF chunk (may carry GPS coordinates, camera serial)');
  if (text.includes('XMP ')) fail(file, 'WebP XMP chunk (author, software, original file path)');
  if (text.includes('c2pa')) notice(file, 'WebP C2PA content credentials');
};

/* ------------------------------------------------------------------ *
 * PDF
 * ------------------------------------------------------------------ */

/**
 * Document-info keys. /Producer alone is harmless and extremely common, so it
 * is reported only as part of a fuller set — a bare "pypdf" tells an attacker
 * nothing. The rest name a person, a machine, or an original path.
 */
const PDF_INFO_KEYS = ['Author', 'Creator', 'Title', 'Subject', 'Keywords'];

/**
 * Recover page text from a PDF without a parsing library.
 *
 * Modern exporters subset their fonts and write glyph IDs rather than
 * characters, so the bytes in the content stream are meaningless until they
 * are mapped back through the font's ToUnicode CMap. Both live in
 * Flate-compressed streams. Decompress everything, build the CMap, then
 * replay the text-showing operators through it.
 *
 * This is best-effort: an encrypted PDF, or one using an encoding with no
 * ToUnicode table, yields nothing. It never throws — a PDF it cannot read is
 * reported as unreadable rather than silently passing.
 */
const extractPdfText = (buf) => {
  const streams = [];
  const raw = buf.toString('latin1');
  const re = /stream\r?\n/g;
  let match;
  while ((match = re.exec(raw)) !== null) {
    const start = match.index + match[0].length;
    const end = raw.indexOf('endstream', start);
    if (end === -1) continue;
    try {
      streams.push(inflateSync(buf.subarray(start, end)).toString('latin1'));
    } catch {
      /* Not Flate-compressed, or not a stream we can read. Skip it. */
    }
  }

  const cmap = new Map();
  const fromHex = (hex) => {
    let out = '';
    for (let i = 0; i + 4 <= hex.length; i += 4) out += String.fromCharCode(parseInt(hex.slice(i, i + 4), 16));
    return out;
  };

  for (const stream of streams) {
    for (const [, block] of stream.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
      for (const [, src, dst] of block.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
        cmap.set(parseInt(src, 16), fromHex(dst));
      }
    }
    for (const [, block] of stream.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
      for (const [, lo, hi, dst] of block.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
        const [start, end, base] = [parseInt(lo, 16), parseInt(hi, 16), parseInt(dst, 16)];
        for (let c = start; c <= end; c += 1) cmap.set(c, String.fromCharCode(base + c - start));
      }
    }
  }

  const decode = (hex) => {
    let out = '';
    for (let i = 0; i + 4 <= hex.length; i += 4) out += cmap.get(parseInt(hex.slice(i, i + 4), 16)) ?? '';
    return out;
  };

  let text = '';
  for (const stream of streams) {
    if (!/\bTj\b|\bTJ\b/.test(stream)) continue;
    for (const m of stream.matchAll(/<([0-9A-Fa-f]+)>\s*Tj|\[([\s\S]*?)\]\s*TJ|\(((?:[^()\\]|\\.)*)\)\s*Tj/g)) {
      if (m[1] !== undefined) text += decode(m[1]);
      else if (m[2] !== undefined) for (const [, hex] of m[2].matchAll(/<([0-9A-Fa-f]+)>/g)) text += decode(hex);
      else if (m[3] !== undefined) text += m[3];
    }
    text += '\n';
  }
  return text;
};

const readPdf = (buf, file) => {
  const raw = buf.toString('latin1');

  const present = PDF_INFO_KEYS.filter((key) => new RegExp(`/${key}\\s*[(<]`).test(raw));
  if (present.length > 0) {
    fail(file, `PDF document-info keys present: ${present.map((k) => `/${k}`).join(', ')} — run npm run strip-metadata`);
  }
  for (const [, path] of raw.matchAll(/\/F\s*\((?:[A-Z]:\\|\/(?:Users|home))[^)]{3,120}\)/g)) {
    fail(file, `PDF embeds an original file path: ${path}`);
  }

  const text = extractPdfText(buf).replace(/\s+/g, ' ');
  if (text.trim().length === 0) {
    notice(file, 'PDF text could not be read (encrypted, scanned, or an unusual encoding) — review it by hand');
    return;
  }

  for (const [name, pattern] of TEXT_RULES) {
    for (const [hit] of text.matchAll(pattern)) {
      if (name === 'PHONE' && OWN_PHONE.test(hit)) continue;
      fail(file, `${name} inside the PDF text: "${hit.trim()}"`);
    }
  }
};

/* ------------------------------------------------------------------ *
 * Walk
 * ------------------------------------------------------------------ */

const walk = (dir, out = []) => {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
};

const assets = SEARCH_PATHS.flatMap((p) => walk(join(ROOT, p))).filter((f) => {
  const ext = extname(f).toLowerCase();
  return IMAGE_EXT.has(ext) || PDF_EXT.has(ext);
});

console.log('Scanning committed images and PDFs for metadata and confidential text...\n');

for (const path of assets) {
  const file = relative(ROOT, path);
  const buf = readFileSync(path);
  const ext = extname(path).toLowerCase();

  try {
    if (ext === '.png') readPng(buf, file);
    else if (ext === '.jpg' || ext === '.jpeg') readJpeg(buf, file);
    else if (ext === '.webp') readWebp(buf, file);
    else if (ext === '.pdf') readPdf(buf, file);
    else notice(file, `no reader for "${ext}" — check its metadata by hand before publishing`);
  } catch (error) {
    fail(file, `could not be read: ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log(`\n${assets.length} asset${assets.length === 1 ? '' : 's'} scanned.`);

if (notices > 0) {
  console.log(`\n${notices} notice${notices === 1 ? '' : 's'} above. Not confidential, not blocking — see AUDIT.md.`);
}

if (failures > 0) {
  console.error(`\nFAIL: ${failures} problem${failures === 1 ? '' : 's'} that must not be published.`);
  console.error('Run npm run strip-metadata, or remove the offending asset, before deploying.\n');
  process.exit(1);
}

console.log('\nPASS: no author, location, or confidential data found in committed assets.');
console.log('Remember: this cannot recognise a client name in a photograph. Look at your own images.');
