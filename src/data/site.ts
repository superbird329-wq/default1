/**
 * Single source of truth for site-wide facts.
 *
 * To change contact information, the seeking statement, or education details,
 * edit this file and nothing else. See README.md.
 *
 * FABRICATION RULE: every value here must come from Vin, his resume, or his
 * transcript. Anything not yet supplied is marked with the TODO() helper so it
 * renders as a visible placeholder rather than as plausible-sounding invented
 * text.
 */

import type { ImageMetadata } from 'astro';
import headshotImage from '../assets/vin-cataldo-headshot.png';

/** Marks a value that Vin still needs to supply. Renders visibly on the page. */
export const TODO = (what: string): string => `TODO: ${what}`;

/** True when a string is an unfilled placeholder. */
export const isTodo = (value: string | null | undefined): boolean =>
  typeof value === 'string' && value.startsWith('TODO:');

/** A course from the transcript. */
export interface Course {
  code: string;
  title: string;
  status: 'completed' | 'in-progress';
}

export const SITE = {
  url: 'https://vincataldo.com',

  /**
   * Search-engine indexing switch.
   *
   * false -> /robots.txt disallows all crawlers and every page emits
   *          <meta name="robots" content="noindex, nofollow">.
   * true  -> crawlers allowed, sitemap advertised, no noindex tag.
   *
   * Flip this to true once the content is complete and every TODO is gone.
   * It is the only change required to make the site indexable.
   */
  indexable: true,

  name: 'Vincent Cataldo',
  shortName: 'Vin Cataldo',

  /** Positioning line, shown under the name on the home page. */
  positioning:
    'Construction Management Engineering Technology (BS), Farmingdale State College (SUNY) — anticipated Spring 2028',

  /**
   * One sentence of direction, first person, shown on the home page.
   * Assembled from the target roles and geography Vin supplied. Edit freely —
   * this is the one line on the home page that should sound like him.
   */
  direction:
    "I'm building toward a career as a project engineer or field engineer with a general contractor or construction manager on Long Island and in the New York metro area.",

  /** Shown in the home page contact block. */
  seeking:
    'Reach out about Project Engineer Intern, Field Engineer Intern, and Assistant Project Manager roles on Long Island and in the New York metro area.',

  contact: {
    email: 'vincataldo329@gmail.com',
    /** Set to null to publish no phone number at all. */
    phone: '(516) 359-8864',
    /*
     * Canonical profile URL. The link Vin sent carried
     * ?utm_source=share_via&utm_content=profile&utm_medium=member_ios —
     * tracking parameters the iOS share sheet appends. They are stripped: they
     * would appear in the page source, in the JSON-LD sameAs, and in anything
     * that scraped the site, while saying nothing except that the link was once
     * shared from a phone.
     */
    linkedin: 'https://www.linkedin.com/in/vincataldo',
  },

  /**
   * LinkedIn placement.
   *
   * The footer title block always carries it, on every page. When this is true
   * it additionally appears in the home page contact block and in the resume
   * header next to the email address — the two places a recruiter looking to
   * connect will actually land. Set false for footer-only.
   */
  linkedinProminent: true,

  /**
   * Open Graph / Twitter preview image at public/og-default.png.
   * The tag is omitted entirely while this is false, so the site never
   * advertises an image that 404s.
   */
  ogImageAvailable: false,

  resume: {
    /**
     * Summary paragraph, verbatim from Vin's resume document so that the HTML
     * resume and the PDF say the same thing (spec §6.5).
     *
     * Vin confirmed project manager, not superintendent, as the goal, so the
     * word "superintendent" was dropped here. Make the same edit in the source
     * Word document before exporting the PDF, or the two will disagree.
     */
    summary:
      'Construction Management Engineering Technology (BS) student with hands-on experience in construction, field operations, and site coordination. Skilled in AutoCAD, soil sampling, safety compliance, and project documentation. Building toward a career as a project manager in construction management.',
    /** PDF is committed to public/resume/ and served from this path. */
    pdfPath: '/resume/vin-cataldo-resume.pdf',
    /** Set true once the real PDF has been committed. */
    pdfAvailable: true,
  },

  education: {
    institution: 'Farmingdale State College (SUNY)',
    degree: 'BS, Construction Management Engineering Technology',
    school: 'College of Engineering Technologies',
    location: 'Farmingdale, NY',
    expectedGraduation: 'Spring 2028',
    gpa: '3.81',
    /**
     * Relevant coursework by course title, from the transcript. Gen-ed courses
     * are deliberately omitted: this list exists for a recruiter scanning for
     * construction and technical subjects, not as a transcript reproduction.
     */
    coursework: [
      // Completed at Farmingdale
      { code: 'CON 161', title: 'Materials & Methods of Construction I', status: 'completed' },
      { code: 'ECO 321', title: 'Engineering Economics', status: 'completed' },
      { code: 'ARC 111', title: 'Graphics I', status: 'completed' },
      { code: 'BUS 102', title: 'Managerial Accounting', status: 'completed' },
      { code: 'EGL 310', title: 'Technical Writing', status: 'completed' },
      { code: 'SPE 330', title: 'Professional & Technical Speech', status: 'completed' },
      // Completed, transferred in
      { code: 'BUS 202', title: 'Business Law I', status: 'completed' },
      { code: 'BUS 101', title: 'Financial Accounting', status: 'completed' },
      { code: 'BUS 109', title: 'Management Theories & Practices', status: 'completed' },
      { code: 'ECO 157', title: 'Principles of Economics (Micro)', status: 'completed' },
      { code: 'ECO 156', title: 'Principles of Economics (Macro)', status: 'completed' },
      { code: 'MTH 150', title: 'Calculus I', status: 'completed' },
      // In progress, Fall 2026
      { code: 'CON 162', title: 'Materials & Methods of Construction II', status: 'in-progress' },
      { code: 'CON 103T', title: 'Surveying', status: 'in-progress' },
      { code: 'CIV 106', title: 'Statics', status: 'in-progress' },
      { code: 'ARC 121', title: 'Graphics II', status: 'in-progress' },
      { code: 'MTH 390', title: 'Methods in Operations Research', status: 'in-progress' },
      { code: 'PHY 135T', title: 'College Physics I', status: 'in-progress' },
    ] as Course[],
    /** Term the in-progress courses belong to. */
    inProgressTerm: 'Fall 2026',
  },

  /** §6.4. Vin confirmed all three resume certifications should show. */
  showCertifications: true,
} as const;

export type Site = typeof SITE;

/** A photograph with the alt text it needs to carry. */
export interface Photo {
  src: ImageMetadata;
  alt: string;
}

/**
 * The About page headshot.
 *
 * The source file lives in src/assets/ rather than public/, so Astro processes
 * it through sharp at build time: it is re-encoded to WebP, resized to the
 * widths the page actually requests, and served with explicit dimensions so
 * there is no layout shift. Re-encoding also discards EXIF, XMP, and IPTC,
 * which is why this path does not depend on remembering to run exiftool.
 *
 * To replace it: drop the new file in src/assets/ and change the import above.
 * Set this to null to go back to an empty slot.
 */
export const HEADSHOT: Photo | null = {
  src: headshotImage,
  alt: 'Vincent Cataldo',
};
