/**
 * Voice and copy templates for the AI Revenue Scan.
 *
 * Voice rules (strict):
 *   - First-person Bradley ("I", "you"). No "we/our/us" in client-facing copy.
 *     The rest of the site now says "we" for Modern BizOps; the Scan surfaces
 *     are the deliberate carve-out and stay singular.
 *   - No em-dashes (this content reaches the email and PDF paths).
 *   - Loss framing on every dollar line. Source citation on every benchmark.
 *
 * sanitizeVoice() runs as a defense-in-depth check at template definition
 * time so a regression in this file fails the test suite immediately. Note that
 * offer copy in lib/offers.js is written in the plural, so only the offer NAME
 * and PRICE are pulled from there; no offer prose passes through sanitizeVoice.
 */

import { LADDER, AUDIT_TERMS } from '../offers';

/** The paid next rung the results screen bridges to. Name and price come from
 *  the ladder so this copy can never quote a stale number. */
const AUDIT = LADDER.find((rung) => rung.id === 'audit');

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
  1: sanitizeVoice('Three questions so I know who I am comparing you to.'),
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
  1: sanitizeVoice('Revenue depends on your personal effort, relationships, and judgment. Nothing is consistent without you directly involved. Every new dollar requires personal attention. The team comes to you for the answer because there is nowhere else to get it. Growth means you working harder or longer.'),
  2: sanitizeVoice('A system exists that the team can follow without you managing every interaction. A CRM is the system of record. Core processes are documented. Basic revenue visibility exists. But data is not fully trusted, the forecast still relies on intuition, and growth still feels effortful.'),
  3: sanitizeVoice('The business runs on trusted data. Shared definitions, consistent operating cadences, and a reliable forecast mean you know what will happen before it happens. Growth no longer requires proportional headcount increase. Nobody has to check the dashboard against a spreadsheet before the meeting.'),
  4: sanitizeVoice('The system improves itself. Leading indicators surface problems before they show up in revenue. Expansion grows without proportional new logo acquisition. You plan the next quarter from what those indicators are already showing you.'),
};

export const COMPARISON_COPY = {
  salesCycle:         { meets: 'at or faster than peer', partial: 'slower than peer median', fails: 'slower than peer' },
  retention:          { meets: 'at or above peer',       partial: 'below peer median',        fails: 'below peer' },
  revenuePerEmployee: { meets: 'at or above peer',       partial: 'below peer median',        fails: 'below peer' },
  leadResponse:       { meets: 'at or faster than peer', partial: 'slower than peer median', fails: 'slower than peer' },
};

const ROI_TITLES = {
  revenuePerEmployee: 'Revenue per employee gap',
  salesCycle:         'Sales cycle compression',
  retention:          'Retention gap',
  leadResponse:       'Lead response peer gap',
};

export function bandTitle(key) {
  return ROI_TITLES[key] || key;
}

export const DISCLOSURE = sanitizeVoice(
  `This is a directional read from fifteen questions you answered about yourself. It tells you which stage of the maturity ladder you sit on, where you stack up against peer benchmarks on the three metrics I can compute from your inputs, and the boundary you need to cross next. It does not replace the ${AUDIT.name}, which connects to your CRM and revenue tools, scores more than forty competencies, and ranks what to automate first against the outcome you want. Where a number above looks wrong to you, that is because I asked for an estimate and you gave me one. The audit is how you replace the estimate with the real figure.`
);

export const CTA_HEADING = `The ${AUDIT.name}`;

export const CTA_LINES = [
  sanitizeVoice('A connected read of your CRM and revenue tools, with every number computed from your own records'),
  sanitizeVoice('More than forty competencies scored, against the nine this Scan asked you about, plus an AI readiness profile'),
  sanitizeVoice('A ranked list of what to automate first, scored on what it is worth: more leads, more booked calls, more closed deals, less busywork'),
  sanitizeVoice(`${AUDIT.price}, and it credits ${AUDIT_TERMS.creditPercent} toward ${AUDIT_TERMS.creditTarget} inside ${AUDIT_TERMS.creditWindow}`),
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

export function metricCitation(metric) {
  if (!metric?.source) return '';
  const year = metric.asOf ? ` (${metric.asOf})` : '';
  return `Source: ${metric.source}${year}.`;
}

export const BLOCK_NAMES = {
  A: 'Foundations',
  B: 'Operating discipline',
  C: 'Compound growth',
};

export const LEVEL_WORDS = {
  1: 'Absent',
  2: 'Informal',
  3: 'Functional',
  4: 'Managed',
};

export const NEXT_STAGE_CRITERIA = {
  1: {
    name: 'Repeatable',
    criteria: [
      sanitizeVoice('Everyone who touches customers uses the same CRM, and the basics are reliable.'),
      sanitizeVoice('Each pipeline stage has documented exit criteria the team can apply without you in the room.'),
      sanitizeVoice('A documented ideal-customer profile means the team disqualifies as confidently as it pursues.'),
    ],
  },
  2: {
    name: 'Predictable',
    criteria: [
      sanitizeVoice('The leadership team runs a defined revenue cadence and trusts the dashboards before arguing about them.'),
      sanitizeVoice('Forecast variance lands under twenty percent quarter over quarter.'),
      sanitizeVoice('Marketing and sales share one written definition of a qualified lead, and both functions are accountable to it.'),
    ],
  },
  3: {
    name: 'Compounding',
    criteria: [
      sanitizeVoice('Expansion has defined triggers, so the upsell conversation starts before the customer thinks to ask.'),
      sanitizeVoice('Leading indicators alert you to revenue problems before they show up in the lagging numbers.'),
      sanitizeVoice('Win and loss analysis updates qualification criteria and positioning on a defined cadence.'),
    ],
  },
};

/**
 * THE FOUR PARAGRAPHS BELOW ARE DELIBERATELY UNEVEN. Until 2026-08-12 every one
 * of them was exactly four sentences in the same order (diagnosis, three-verb
 * imperative, payoff, epigram) and all four landed within eight words of each
 * other. Read one and you could predict the next three, which is the definition
 * of the AI-writing tell this rewrite removed. They now run 3, 5, 3 and 5
 * sentences and 81, 69, 46 and 70 words, and each closes on a mechanic or a
 * timeframe a reader could check.
 *
 * If a future pass is tempted to "tidy" these into a consistent shape: that IS
 * the bug. Keep them uneven.
 *
 * 2026-08-12: retention lost its opening line ("Retention gaps usually start at
 * the front door"). It read as a finding from experience with no artifact
 * behind it, which the honesty guardrails do not allow. The paragraph now opens
 * on the instruction, which is the part a reader can act on.
 */
export const FIX_PARAGRAPHS = {
  revenuePerEmployee: sanitizeVoice('Hiring is the expensive way to close this gap, and a new hire takes about two quarters to show up in the number at all. Pick the two or three handoffs that today wait on you personally, write them into the CRM as stage exit criteria your team can clear without asking you, and hold one half day a week for the work only you can do. Every handoff you give away moves the number with the same payroll underneath it.'),
  salesCycle: sanitizeVoice('Cycle time compresses when a stage change stops being a judgment call. Rewrite your stage exit criteria so every one of them is a fact the buyer confirmed. A demo that happened does not count. Make them required fields in the CRM, then walk a sample of stuck deals against them every two weeks. Inside a month you will be able to name the deals that were never real.'),
  retention: sanitizeVoice('Pull the last ten lost accounts and code the real reason against the qualification criteria each one passed on the way in. Fix the criteria, then fix the first thirty days. Renewal is a lagging number, so give it two quarters before you judge the change.'),
  leadResponse: sanitizeVoice('Start by timing it. Give every form submission two timestamps, one for when it landed and one for when a human first replied, and the gap between them is your number. Set a target the team is held to, and route anything that blows past it to an automated first touch inside fifteen minutes. None of that needs new software. Your CRM and your form tool already do both halves.'),
};

export const NO_GAP_HEADLINE = {
  lead: sanitizeVoice('Your numbers hold up against {model_label} peers. The gap I can see is an operational one.'),
  subline: sanitizeVoice('No defensible dollar gap from your inputs. Below is the read on where you sit operationally and the one boundary I would close next.'),
};

export function NO_GAP_BINDING(binding) {
  if (!binding || binding.questions.length === 0) return '';
  const [first, second] = binding.questions;
  if (!first?.competencyLabel) return '';
  const labels = second?.competencyLabel
    ? `your ${first.competencyLabel} and your ${second.competencyLabel}`
    : `your ${first.competencyLabel}`;
  return sanitizeVoice(
    `What you told me about ${labels} is the boundary you need to cross next. Your numbers will not show it until you try to grow through it.`
  );
}

export function CTA_FOCUS_TEMPLATE(focusLabel) {
  return sanitizeVoice(
    `The ${AUDIT.name} connects to your CRM and revenue tools and measures your ${focusLabel} gap from what those systems already hold. It comes back with what to automate first and what that build costs.`
  );
}

/** The same bridge with no competency to name, used when the Scan surfaced no
 *  single binding boundary. The two are worded differently on purpose: they were
 *  one sentence written twice until 2026-08-12, so whichever branch a taker
 *  landed on served the same manufactured line. */
export const CTA_GENERIC_LINE = sanitizeVoice(
  `The ${AUDIT.name} connects to your CRM and revenue tools and computes the picture this Scan estimated. It comes back with what to automate first and what that build costs.`
);
