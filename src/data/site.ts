/**
 * Single source of truth for site-wide facts.
 *
 * To change contact information, the seeking statement, or education details,
 * edit this file and nothing else. See README.md.
 *
 * FABRICATION RULE: every value here must come from Vin. Anything not yet
 * supplied is marked with the TODO() helper so it renders as a visible
 * placeholder rather than as plausible-sounding invented text.
 */

/** Marks a value that Vin still needs to supply. Renders visibly on the page. */
export const TODO = (what: string): string => `TODO: ${what}`;

/** True when a string is an unfilled placeholder. */
export const isTodo = (value: string | null | undefined): boolean =>
  typeof value === 'string' && value.startsWith('TODO:');

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
  indexable: false,

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
    'I am looking for a project engineer or field engineer internship with a general contractor or construction manager on Long Island or in the New York metro area.',

  /** Shown in the home page contact block. */
  seeking:
    'Currently seeking a Summer 2026 internship in construction management. Available for Project Engineer Intern, Field Engineer Intern, and Assistant Project Manager roles.',

  contact: {
    email: TODO('public email address'),
    /** Set to null to publish no phone number at all. */
    phone: TODO('phone number to publish, or null to omit'),
    linkedin: TODO('LinkedIn profile URL'),
  },

  /**
   * Open Graph / Twitter preview image at public/og-default.png.
   * The tag is omitted entirely while this is false, so the site never
   * advertises an image that 404s.
   */
  ogImageAvailable: false,

  resume: {
    /** PDF is committed to public/resume/ and served from this path. */
    pdfPath: '/resume/vin-cataldo-resume.pdf',
    /** Set true once the real PDF has been committed. */
    pdfAvailable: false,
  },

  education: {
    institution: 'Farmingdale State College (SUNY)',
    degree: 'BS, Construction Management Engineering Technology',
    location: 'Farmingdale, NY',
    expectedGraduation: 'Spring 2028',
    gpa: '3.81',
    /** Course titles exactly as they appear on the transcript. */
    coursework: [] as string[],
  },

  /**
   * §6.4: the certifications block is omitted entirely rather than shown
   * empty. Set to true and populate src/content/credentials/ once a
   * certification (e.g. OSHA 10) is actually held.
   */
  showCertifications: false,
} as const;

export type Site = typeof SITE;
