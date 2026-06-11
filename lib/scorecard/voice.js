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

export function metricCitation(metric) {
  const year = metric?.asOf ? ` (${metric.asOf})` : '';
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
      sanitizeVoice('Expansion is a proactive motion with defined triggers, not a reaction to inbound asks.'),
      sanitizeVoice('Leading indicators alert you to revenue problems before they show up in the lagging numbers.'),
      sanitizeVoice('Win and loss analysis updates qualification criteria and positioning on a defined cadence.'),
    ],
  },
};

export const FIX_PARAGRAPHS = {
  revenuePerEmployee: sanitizeVoice('The lever here is not more hires. It is a tighter operating system around the team you already have. Document the two or three handoffs that today require your personal involvement, encode them as stage exit criteria in the CRM, and protect one half day a week for the work only you can do. That gap closes from the inside out, not the outside in.'),
  salesCycle: sanitizeVoice('Cycle time compresses when stage transitions stop being judgment calls. Rewrite your stage exit criteria as buyer-verified facts (not sales activities), make them required fields in the CRM, and review a sample of stuck deals against those criteria every two weeks. The deals you should not be working become visible, and the deals that are real move faster.'),
  retention: sanitizeVoice('Retention gaps are not customer-success problems. They are usually qualification or onboarding problems wearing a renewal mask. Look at the last ten lost accounts and code the real reason against the qualification criteria they passed at the front door. Update the criteria, change the first thirty days of the customer experience, and the renewal math improves on a delay you can predict.'),
  leadResponse: sanitizeVoice('Speed-to-lead is the easiest lift in your funnel and the one founders most often delegate away. Instrument the time from form submit to first human contact, set a service-level target the team is accountable to, and route the worst offenders to an automated first touch within fifteen minutes. The conversion lift is published, repeatable, and largely free.'),
};

export const NO_GAP_HEADLINE = {
  lead: sanitizeVoice('Your numbers hold up against {model_label} peers. The gap I can see is operational, not financial.'),
  subline: sanitizeVoice('No defensible dollar gap from your inputs. Below is the read on where you sit operationally and the one boundary I would close next.'),
};

export function NO_GAP_BINDING(binding) {
  if (!binding || binding.questions.length === 0) return '';
  const [first, second] = binding.questions;
  const labels = second
    ? `your ${first.competencyLabel} and your ${second.competencyLabel}`
    : `your ${first.competencyLabel}`;
  return sanitizeVoice(
    `What you told me about ${labels} is the boundary you need to cross next. The dollars do not show it yet; the operating system does.`
  );
}

export function CTA_FOCUS_TEMPLATE(focusLabel) {
  return sanitizeVoice(
    `Book 30 minutes. I will have read your results before the call. I will walk you through your ${focusLabel} gap and what the first 90 days of fixing it looks like.`
  );
}
