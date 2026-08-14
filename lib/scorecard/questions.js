/**
 * The 16-question AI Revenue Scan structure. Pure data, no UI.
 * Instrument spec: `Business Design/AI Pivot 2026/15 AI Revenue Scan
 * Instrument Design.md` (APPROVED-BY-BRADLEY 2026-08-14). Questions and
 * options are transcribed verbatim from Part 4.
 *
 * Sections (UI sections; the quiz shows three):
 *   1 (q1..q3): segmentation. Revenue band, business model, team size.
 *     UNCHANGED from the pre-rebuild instrument, including the six /book-aligned
 *     revenue bands and their midpoints.
 *   2 (q4..q13): the diagnostic. q4 is the belief probe (scored, NOT in the
 *     composite). q5..q13 are the nine dimension questions, three per askable
 *     AI Readiness dimension, scored 1..5 (Absent, Informal, Functional,
 *     Managed, Optimized).
 *   3 (q14..q16): financial inputs. Deal value, sales cycle, churn.
 *     q16 (churn) is hidden for business models where churn is not the
 *     operative metric.
 *
 * VOICE EXEMPTION, deliberate and load-bearing: answer option labels are the
 * respondent's voice ("Me, on top of everything else"), so they are exempt from
 * sanitizeVoice() and must never be run through it. The prompts are ours and
 * stay plural-clean.
 */

export const BUSINESS_MODEL_OPTIONS = [
  { value: 'B2B_SAAS',              label: 'B2B SaaS', description: 'recurring subscription software sold to other businesses' },
  { value: 'PROFESSIONAL_SERVICES', label: 'Professional services', description: 'consulting, agency, or done-for-you work for other businesses' },
  { value: 'B2B_PRODUCT',           label: 'B2B product', description: 'physical product or non-subscription software sold to other businesses' },
  { value: 'ECOMMERCE',             label: 'E-commerce', description: 'direct-to-consumer product sales' },
  { value: 'B2C_SERVICES',          label: 'B2C services', description: 'services sold to consumers' },
  { value: 'B2C_SUBSCRIPTION',      label: 'B2C subscription', description: 'recurring subscription product sold to consumers' },
  { value: 'MARKETPLACE',           label: 'Marketplace', description: 'connecting two sides of a transaction' },
  { value: 'OTHER',                 label: 'Other or mixed', description: 'something else, or a mix' },
];

/**
 * Revenue bands, deliberately the same six the /book form asks for, down to the
 * internal values (see REVENUE_OPTIONS in app/api/submit-form/route.js). One
 * revenue vocabulary across both lead-capture surfaces means a contact who does
 * both cannot be filed in two different bands. Labels read "to" rather than a
 * dash because this copy reaches the PDF and the email path.
 *
 * `midpoint` feeds the ROI math, so these are not cosmetic. The convention:
 * a closed band takes its arithmetic midpoint; the open top band takes 1.3x its
 * floor, which is what the retired "Over $15M" band used (20M over 15M) and is
 * the conservative direction, since a smaller assumed revenue produces a
 * smaller claimed dollar gap. "Under $1M" keeps its long-standing 750K rather
 * than 500K.
 */
const Q1_REVENUE_OPTIONS = [
  { value: 'under_1m',  label: 'Under $1M', midpoint: 750_000 },
  { value: '1m_3m',     label: '$1M to $3M', midpoint: 2_000_000 },
  { value: '3m_5m',     label: '$3M to $5M', midpoint: 4_000_000 },
  { value: '5m_15m',    label: '$5M to $15M', midpoint: 10_000_000 },
  { value: '15m_50m',   label: '$15M to $50M', midpoint: 32_500_000 },
  { value: '50m_plus',  label: 'Over $50M', midpoint: 65_000_000 },
];

/**
 * Optional exact-figure entry (Bradley, 2026-08-14, "Both"): the five inputs
 * that feed the ROI math each accept an exact number after a band is picked.
 * The exact value replaces the band midpoint in the arithmetic; the band is
 * still what gets stored for segmentation. `kind` tells the input UI how to
 * parse ('percent' stores the ratio, i.e. 18 -> 0.18); `min`/`max` are sanity
 * bounds outside which an entry is ignored rather than computed from.
 */
const EXACT = {
  revenue: { kind: 'usd', label: 'Know the exact figure? Annual revenue', min: 10_000, max: 1_000_000_000 },
  team: { kind: 'count', label: 'Know the exact headcount?', min: 1, max: 10_000 },
  deal: { kind: 'usd', label: 'Know the exact figure? Average deal value', min: 100, max: 10_000_000 },
  cycle: { kind: 'days', label: 'Know the exact number of days?', min: 1, max: 1_000 },
  churn: { kind: 'percent', label: 'Know the exact percentage?', min: 0, max: 1 },
};

const Q3_TEAM_OPTIONS = [
  { value: 'just_me',  label: 'Just me', midpoint: 1 },
  { value: '2_10',     label: '2 to 10', midpoint: 6 },
  { value: '11_25',    label: '11 to 25', midpoint: 18 },
  { value: '26_50',    label: '26 to 50', midpoint: 38 },
  { value: '51_75',    label: '51 to 75', midpoint: 63 },
  { value: '75_plus',  label: 'Over 75', midpoint: 90 },
];

const Q14_DEAL_OPTIONS = [
  { value: 'under_5k',   label: 'Under $5K', midpoint: 2_500 },
  { value: '5k_25k',     label: '$5K to $25K', midpoint: 15_000 },
  { value: '25k_100k',   label: '$25K to $100K', midpoint: 62_500 },
  { value: 'over_100k',  label: 'Over $100K', midpoint: 200_000 },
];

const Q15_CYCLE_OPTIONS = [
  { value: 'not_tracked', label: 'Not sure, I do not track this', notTracked: true },
  { value: 'under_30',    label: 'Under 30 days', midpoint: 20 },
  { value: '30_90',       label: '30 to 90 days', midpoint: 60 },
  { value: '90_180',      label: '90 to 180 days', midpoint: 135 },
  { value: 'over_180',    label: 'Over 180 days', midpoint: 240 },
];

const Q16_CHURN_OPTIONS = [
  { value: 'not_tracked', label: 'Not sure, I do not track this', notTracked: true },
  { value: 'under_5',     label: 'Under 5 percent', midpoint: 0.025 },
  { value: '5_15',        label: '5 to 15 percent', midpoint: 0.10 },
  { value: '15_30',       label: '15 to 30 percent', midpoint: 0.225 },
  { value: 'over_30',     label: 'Over 30 percent', midpoint: 0.40 },
];

/**
 * The three askable AI Readiness dimensions and the question ids that score
 * them. scoring.js derives the composite (q5..q13) and per-dimension means
 * from this map, so a renumbering only has to happen here.
 */
export const DIMENSIONS = [
  { key: 'strategy',   label: 'AI Strategy and Use-Case Alignment', ids: ['q5', 'q6', 'q7'] },
  { key: 'people',     label: 'People and Adoption Readiness',      ids: ['q8', 'q9', 'q10'] },
  { key: 'governance', label: 'Governance and Trust',               ids: ['q11', 'q12', 'q13'] },
];

/**
 * q5 option 2 is the burned-attempt flag: "We tried a tool or two, but they
 * did not stick." It is the single highest-value answer in the instrument. It
 * switches on the why-it-did-not-stick result block and marks the respondent
 * as the priority segment, so it travels as a distinct signal (result payload,
 * HubSpot property), never just as a score of 2.
 */
export const BURNED_ATTEMPT_QUESTION = 'q5';
export const BURNED_ATTEMPT_VALUE = 'B';

/**
 * Builds a 1..5 diagnostic question. Options are written one per line as
 * `{ label: '...' }` rather than as bare strings on purpose: the voice-split
 * CI guard exempts respondent-voice copy by reading an option KEY at the start
 * of the line, so labels like "Me, on top of everything else." stay exempt
 * without the whole file being exempted. Values (A..E) and scores (1..5) are
 * derived from position.
 */
function diagnostic(prompt, options) {
  return {
    kind: 'diagnostic',
    prompt,
    options: options.map((opt, i) => ({ value: 'ABCDE'[i], label: opt.label, score: i + 1 })),
  };
}

export const QUESTIONS = [
  { id: 'q1', section: 1, kind: 'segmentation', prompt: 'Annual revenue', options: Q1_REVENUE_OPTIONS, exact: EXACT.revenue },
  { id: 'q2', section: 1, kind: 'segmentation', prompt: 'Which best describes how your business sells?', options: BUSINESS_MODEL_OPTIONS },
  { id: 'q3', section: 1, kind: 'segmentation', prompt: 'Total team size', options: Q3_TEAM_OPTIONS, exact: EXACT.team },

  // The belief probe opens the diagnostic. Scored but NOT counted in the
  // composite: it exists to be contrasted with what the audit computes, and as
  // the opener it frames the instrument as "can AI run on your business",
  // not a quiz about AI opinions.
  {
    id: 'q4', section: 2, belief: true,
    ...diagnostic(
      'How confident are you that your CRM data is clean and complete enough for an AI tool to make decisions from it?',
      [
        { label: 'Not at all.' },
        { label: 'Not very.' },
        { label: 'Somewhat.' },
        { label: 'Fairly confident.' },
        { label: 'Very confident.' },
      ],
    ),
  },

  // Dimension 1: AI Strategy and Use-Case Alignment
  {
    id: 'q5', section: 2, dimension: 'strategy',
    ...diagnostic(
      'Where is AI actually being used in your go-to-market today?',
      [
        { label: 'Nowhere, and we have not tried.' },
        { label: 'We tried a tool or two, but they did not stick.' },
        { label: 'A few people use ChatGPT on their own, unofficially.' },
        { label: 'Several workflows use it, each with someone responsible.' },
        { label: 'It runs in named workflows and we measure what it changed.' },
      ],
    ),
  },
  {
    id: 'q6', section: 2, dimension: 'strategy',
    ...diagnostic(
      'Someone on your team wants to buy a new AI tool. What happens?',
      [
        { label: 'Nothing written down, we just decide.' },
        { label: 'Whoever pushes hardest usually wins.' },
        { label: 'One person decides, case by case.' },
        { label: 'We check it against what we are trying to improve.' },
        { label: 'We have a written rule for evaluating it, and for killing it if it does not work.' },
      ],
    ),
  },
  {
    id: 'q7', section: 2, dimension: 'strategy',
    ...diagnostic(
      'Can you name the business number your AI effort is supposed to move?',
      [
        { label: 'We have not framed it that way.' },
        { label: 'Generally, save time.' },
        { label: 'A specific area, like lead response.' },
        { label: 'A named metric, but we are not tracking it against the effort.' },
        { label: 'A named metric with a before number written down.' },
      ],
    ),
  },

  // Dimension 2: People and Adoption Readiness
  {
    id: 'q8', section: 2, dimension: 'people',
    ...diagnostic(
      'Who owns AI and automation in your business?',
      [
        { label: 'Nobody.' },
        { label: 'Me, on top of everything else.' },
        { label: 'Someone part time, alongside their real job.' },
        { label: 'A named person with protected time.' },
        { label: 'A named owner with time, budget and a roadmap.' },
      ],
    ),
  },
  {
    id: 'q9', section: 2, dimension: 'people',
    ...diagnostic(
      'Think about the last new system or process you rolled out. Where is it now?',
      [
        { label: 'It never really landed.' },
        { label: 'A few people use it, most went back to the old way.' },
        { label: 'Most people use it, with reminders.' },
        { label: 'It stuck.' },
        { label: 'It stuck and we improved it since.' },
      ],
    ),
  },
  {
    id: 'q10', section: 2, dimension: 'people',
    ...diagnostic(
      'If your team had to use an AI tool in their daily work starting tomorrow, what happens?',
      [
        { label: 'Real resistance.' },
        { label: 'A couple of enthusiasts, everyone else ignores it.' },
        { label: 'Most would try it if we showed them.' },
        { label: 'Most already use AI in some form.' },
        { label: 'They would ask why it took us this long.' },
      ],
    ),
  },

  // Dimension 3: Governance and Trust
  {
    id: 'q11', section: 2, dimension: 'governance',
    ...diagnostic(
      'Who decides what customer data an AI tool is allowed to touch?',
      [
        { label: 'Nobody has thought about it.' },
        { label: 'Me, case by case.' },
        { label: 'We have informal rules.' },
        { label: 'It is written down.' },
        { label: 'Written down and enforced by actual access controls.' },
      ],
    ),
  },
  {
    id: 'q12', section: 2, dimension: 'governance',
    ...diagnostic(
      'If an AI tool sent a customer something wrong, how would you find out?',
      [
        { label: 'We would not.' },
        { label: 'The customer would tell us.' },
        { label: 'Someone would probably spot it.' },
        { label: 'A person reviews anything customer-facing before it sends.' },
        { label: 'It is logged and monitored, and we know who is accountable.' },
      ],
    ),
  },
  {
    id: 'q13', section: 2, dimension: 'governance',
    ...diagnostic(
      'How much of your customer and pipeline data would you be comfortable connecting to an AI system today?',
      [
        { label: 'None, that makes me nervous.' },
        { label: 'Only anonymized or sample data.' },
        { label: 'Some of it, with limits.' },
        { label: 'Most of it, with a written agreement.' },
        { label: 'All of it, we already do.' },
      ],
    ),
  },

  { id: 'q14', section: 3, kind: 'financial', prompt: 'Average value of a new closed deal', options: Q14_DEAL_OPTIONS, exact: EXACT.deal },
  { id: 'q15', section: 3, kind: 'financial', prompt: 'Average sales cycle (first qualified conversation to closed-won)', options: Q15_CYCLE_OPTIONS, exact: EXACT.cycle },
  { id: 'q16', section: 3, kind: 'financial', prompt: 'Annual gross revenue churn (what percentage of recurring revenue do you lose per year before any expansion?)', options: Q16_CHURN_OPTIONS, exact: EXACT.churn, showIf: (answers) => {
    const q2 = answers?.q2?.value;
    return q2 !== 'B2B_PRODUCT' && q2 !== 'ECOMMERCE';
  } },
];

/**
 * The number an ROI computation should use for a banded input: the exact
 * figure when one was given and passes the question's sanity bounds, the
 * band midpoint otherwise. Returns { value, exact } so the shown-arithmetic
 * line can say which one it used.
 */
export function resolveInput(qid, answers) {
  const q = QUESTIONS.find((x) => x.id === qid);
  const a = answers?.[qid];
  const opt = q?.options.find((o) => o.value === a?.value);
  const exact = a?.exact;
  if (
    q?.exact &&
    typeof exact === 'number' &&
    Number.isFinite(exact) &&
    exact >= q.exact.min &&
    exact <= q.exact.max
  ) {
    return { value: exact, exact: true, notTracked: false };
  }
  return {
    value: opt?.midpoint,
    exact: false,
    notTracked: Boolean(opt?.notTracked),
  };
}

export function getQuestionsFor(answers) {
  return QUESTIONS.filter((q) => {
    if (typeof q.showIf === 'function') return q.showIf(answers);
    return true;
  });
}

export function isBurnedAttempt(answers) {
  return answers?.[BURNED_ATTEMPT_QUESTION]?.value === BURNED_ATTEMPT_VALUE;
}
