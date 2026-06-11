/**
 * Voice and copy templates for the maturity scorecard.
 *
 * Voice rules (strict):
 *   - First-person Bradley ("I", "you"). No "we/our/us" in client-facing copy.
 *   - No em-dashes (this content reaches the email and PDF paths).
 *   - Loss framing on every dollar line. Source citation on every benchmark.
 *
 * sanitizeVoice() runs as a defense-in-depth check at template definition
 * time so a regression in this file fails the test suite immediately.
 */

export function sanitizeVoice(s) {
  if (typeof s !== 'string') return s;
  if (/—/.test(s)) {
    throw new Error(`Voice violation: em-dash in copy: ${s}`);
  }
  if (/\b(we|our|us)\b/i.test(s)) {
    throw new Error(`Voice violation: first-person plural in copy: ${s}`);
  }
  return s;
}

export const SECTION_LABELS = {
  1: 'About your business',
  2: 'Your operating system',
  3: 'Your numbers',
};

export const SECTION_SUBLINES = {
  1: sanitizeVoice('Three taps so I know who I am comparing you to.'),
  2: sanitizeVoice('Now the diagnostic. Nine questions about how your business actually runs.'),
  3: sanitizeVoice('Three numbers about your business so I can put dollars on the gap. Bands, not exact figures.'),
};

export const STAGE_NAMES = {
  1: 'Reactive',
  2: 'Repeatable',
  3: 'Predictable',
  4: 'Compounding',
};

export const STAGE_DESCRIPTORS = {
  1: sanitizeVoice('Revenue depends on your personal effort, relationships, and judgment. Nothing is consistent without you directly involved. Every new dollar requires personal attention. The team follows you, not a system. Growth means you working harder or longer.'),
  2: sanitizeVoice('A system exists that the team can follow without you managing every interaction. A CRM is the system of record. Core processes are documented. Basic revenue visibility exists. But data is not fully trusted, the forecast still relies on intuition, and growth still feels effortful.'),
  3: sanitizeVoice('The business runs on trusted data. Shared definitions, consistent operating cadences, and a reliable forecast mean you know what will happen before it happens. Growth no longer requires proportional headcount increase. Decisions are made from data, not around it.'),
  4: sanitizeVoice('The system improves itself. Leading indicators surface problems before they show up in revenue. Expansion grows without proportional new logo acquisition. Decisions are made from predictive signals, not just historical reports.'),
};

export const COMPARISON_COPY = {
  salesCycle:         { meets: 'at or faster than peer', partial: 'slower than peer median', fails: 'slower than peer' },
  nrr:                { meets: 'at or above peer',      partial: 'below peer median',         fails: 'below peer' },
  revenuePerEmployee: { meets: 'at or above peer',      partial: 'below peer median',         fails: 'below peer' },
  leadResponse:       { meets: 'at or faster than peer', partial: 'slower than peer median', fails: 'slower than peer' },
};

const ROI_TITLES = {
  revenuePerEmployee: 'Revenue per employee gap',
  salesCycle:         'Sales cycle compression',
  nrr:                'Retention gap',
  leadResponse:       'Lead response peer gap',
};

export function bandTitle(key) {
  return ROI_TITLES[key] || key;
}

export const DISCLOSURE = sanitizeVoice(
  'This is a directional read from sixteen questions. It tells you which stage of the maturity ladder you sit on, where you stack up against peer benchmarks on the three metrics I can compute from your inputs, and the boundary you need to cross next. It does not replace the full assessment, which connects to your CRM and revenue tools, scores all 44 competencies, and produces the specific roadmap from where you are to the business outcome you want. If the numbers above feel directionally right, that is the signal to take the next step.'
);

export const CTA_HEADING = 'The Modern BizOps Maturity Assessment';

export const CTA_LINES = [
  sanitizeVoice('Automated analysis of your CRM and revenue tools'),
  sanitizeVoice('All 44 competencies scored, not just nine'),
  sanitizeVoice('A 90-minute working session with me to walk you through it'),
  sanitizeVoice('A 12-week operational roadmap mapped to your stated business outcome'),
];

export function sourceCitation(modelLabel) {
  return `Source: businessModelBenchmarks v1.2, ${modelLabel} row.`;
}

export function formatUsd(n) {
  if (!Number.isFinite(n) || n < 0) return '$0';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}
