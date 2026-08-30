import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * CONFIDENTIALITY (spec §3.2). Nothing in any content file may contain a client
 * name, a street address, a municipal case or permit number, an internal
 * project number, or any person's name other than Vin's. Describe work
 * generically: "sanitary system site plan for a residential parcel on Long
 * Island's North Shore", never the address.
 *
 * FABRICATION (spec §3.1). No invented values, durations, percentages, or
 * outcomes. If a fact is unknown, write "TODO: ..." in the field. The build
 * refuses to publish output containing TODO (see scripts/check-todos.sh).
 */

const CATEGORIES = ['Internship Work', 'Academic', 'Competition', 'Technical'] as const;

/** An optional redacted drawing excerpt or photograph. */
const imageSchema = z.object({
  src: z.string(),
  /** Required. Describe what the image shows, not that it is an image. */
  alt: z.string().min(1),
  caption: z.string().min(1),
});

/**
 * Project case study. The section order in §6.3 is fixed and enforced by
 * ProjectLayout.astro; this schema makes every section mandatory so a case
 * study cannot be published half-built. Only `images` is optional.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().min(1),

    /** Manual ordering. Lower numbers first. Never sorted by date. */
    weight: z.number().int(),
    /** Exactly three of these should be true (home page shows three cards). */
    featured: z.boolean().default(false),
    /** Excluded from production builds. Use while a case study is incomplete. */
    draft: z.boolean().default(false),

    category: z.enum(CATEGORIES),

    // --- Context strip: the three labelled facts in the title block ---
    projectType: z.string().min(1),
    /**
     * Display string, e.g. "Summer 2026" or "2026". Coerced because a bare year
     * in YAML parses as a number, and that should not be an error the author
     * has to decode.
     */
    timeframe: z.coerce.string().min(1),
    role: z.string().min(1),

    /** One line. Used on cards on the home page and the projects index. */
    summary: z.string().min(1).max(200),

    // --- §6.3 sections, in the order they render ---
    /** §6.3.2 What the work needed to accomplish. Two to three sentences. */
    objective: z.string().min(1),
    /**
     * §6.3.3 What Vin personally did. Must distinguish individual contribution
     * from team output, and must state supervision honestly where it applies.
     */
    myRole: z.string().min(1),
    /** §6.3.4 Steps taken and the reasoning behind them. Three to six items. */
    approach: z.array(z.string().min(1)).min(3).max(6),
    /** §6.3.5 Software. Named specifically — recruiters scan this. */
    tools: z.array(z.string().min(1)).min(1),
    /** §6.3.5 Codes, manuals, and standards applied. Named specifically. */
    standards: z.array(z.string().min(1)).default([]),
    /** §6.3.6 What was actually produced. */
    deliverables: z.array(z.string().min(1)).min(1),
    /** §6.3.7 What happened as a result. Qualitative is fine. Never invented. */
    outcome: z.string().min(1),
    /** §6.3.8 Two to four sentences. Interviewers ask about this directly. */
    learned: z.string().min(1),
    /** §6.3.9 Optional. Every page must render correctly with zero images. */
    images: z.array(imageSchema).default([]),
  }),
});

/** A position held. Rendered reverse-chronologically on /experience. */
const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    employer: z.string().min(1),
    title: z.string().min(1),
    location: z.string().min(1),
    /** Display strings, e.g. "Jun 2025". Kept human-readable on purpose. */
    startDate: z.coerce.string().min(1),
    /** Omit for a current role; renders as "Present". */
    endDate: z.coerce.string().optional(),
    /** Manual ordering. Lower numbers first (most recent role first). */
    weight: z.number().int(),
    /** Concrete deliverables, not duties. Two to four. */
    bullets: z.array(z.string().min(1)).min(2).max(4),
    tools: z.array(z.string().min(1)).default([]),
    standards: z.array(z.string().min(1)).default([]),
    /** Anchor target for home-page role links, e.g. "subsurface-engineering". */
    anchor: z.string().min(1),
  }),
});

/**
 * Memberships, awards, scholarships, competitions, and certifications.
 * One file each so adding one is a one-file change (spec §14).
 */
const credentials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/credentials' }),
  schema: z.object({
    kind: z.enum(['certification', 'membership', 'award', 'competition']),
    /** The credential, membership, or award name. */
    name: z.string().min(1),
    /** The awarding, certifying, or member organization. */
    organization: z.string().min(1),
    /**
     * Year or date range, e.g. "2025" or "2024–present". Coerced: a bare year
     * in YAML is a number. Optional: a certification with no confirmed date
     * renders without one rather than guessing.
     */
    date: z.coerce.string().min(1).optional(),
    /** Role held, for memberships and competitions. */
    role: z.string().optional(),
    /** Optional one-line detail. No adjectives — facts only (§6.1). */
    detail: z.string().optional(),
    /** Show in the compact home-page credentials strip. */
    featured: z.boolean().default(false),
    /** Not yet happened, e.g. an upcoming competition. Renders as "Upcoming". */
    upcoming: z.boolean().default(false),
    weight: z.number().int(),
  }),
});

/**
 * Standalone page prose, currently just the About text. A collection rather
 * than copy inside a component so that rewriting the About page means editing
 * one Markdown file and nothing else (spec §14).
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
});

export const collections = { projects, experience, credentials, pages };
