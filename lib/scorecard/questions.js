/**
 * The 16-question maturity scorecard structure. Pure data, no UI.
 *
 * Sections:
 *   1 (q1..q3): segmentation. Revenue band, business model, team size.
 *   2 (q4..q12): nine maturity competencies probed at three stage boundaries.
 *   3 (q13..q15): financial inputs. Deal value, sales cycle, churn.
 *   3 (q16): reserved for a future lead-response-time question.
 *
 * Maturity options score 1..4 (Absent, Informal, Functional, Managed).
 * Score 5 (Optimized) is excluded from a free 16-question quiz by design.
 *
 * Q15 is hidden for business models where churn is not the operative metric.
 * Q16 is reserved (no options shipped in v1; ROI.leadResponse is documented
 * but unreachable until this question is wired).
 *
 * Peer-anchor templates use {model_label} resolved against
 * getBusinessModelBenchmark(q2).label.
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

const Q1_REVENUE_OPTIONS = [
  { value: 'under_1m',   label: 'Under $1M', midpoint: 750_000 },
  { value: '1m_3m',      label: '$1M to $3M', midpoint: 2_000_000 },
  { value: '3m_7m',      label: '$3M to $7M', midpoint: 5_000_000 },
  { value: '7m_15m',     label: '$7M to $15M', midpoint: 11_000_000 },
  { value: 'over_15m',   label: 'Over $15M', midpoint: 20_000_000 },
];

const Q3_TEAM_OPTIONS = [
  { value: 'just_me',  label: 'Just me', midpoint: 1 },
  { value: '2_10',     label: '2 to 10', midpoint: 6 },
  { value: '11_25',    label: '11 to 25', midpoint: 18 },
  { value: '26_50',    label: '26 to 50', midpoint: 38 },
  { value: '51_75',    label: '51 to 75', midpoint: 63 },
  { value: '75_plus',  label: 'Over 75', midpoint: 90 },
];

const Q13_DEAL_OPTIONS = [
  { value: 'under_5k',   label: 'Under $5K', midpoint: 2_500 },
  { value: '5k_25k',     label: '$5K to $25K', midpoint: 15_000 },
  { value: '25k_100k',   label: '$25K to $100K', midpoint: 62_500 },
  { value: 'over_100k',  label: 'Over $100K', midpoint: 200_000 },
];

const Q14_CYCLE_OPTIONS = [
  { value: 'not_tracked', label: 'Not sure, I do not track this', notTracked: true },
  { value: 'under_30',    label: 'Under 30 days', midpoint: 20 },
  { value: '30_90',       label: '30 to 90 days', midpoint: 60 },
  { value: '90_180',      label: '90 to 180 days', midpoint: 135 },
  { value: 'over_180',    label: 'Over 180 days', midpoint: 240 },
];

const Q15_CHURN_OPTIONS = [
  { value: 'not_tracked', label: 'Not sure, I do not track this', notTracked: true },
  { value: 'under_5',     label: 'Under 5 percent', midpoint: 0.025 },
  { value: '5_15',        label: '5 to 15 percent', midpoint: 0.10 },
  { value: '15_30',       label: '15 to 30 percent', midpoint: 0.225 },
  { value: 'over_30',     label: 'Over 30 percent', midpoint: 0.40 },
];

function maturity(prompt, peerAnchorTemplate, options) {
  return { kind: 'maturity', prompt, peerAnchorTemplate, options };
}

export const QUESTIONS = [
  { id: 'q1', section: 1, kind: 'segmentation', prompt: 'Annual revenue', options: Q1_REVENUE_OPTIONS },
  { id: 'q2', section: 1, kind: 'segmentation', prompt: 'Which best describes how your business sells?', options: BUSINESS_MODEL_OPTIONS },
  { id: 'q3', section: 1, kind: 'segmentation', prompt: 'Total team size', options: Q3_TEAM_OPTIONS },

  {
    id: 'q4', section: 2, competency: 3, competencyLabel: 'CRM architecture',
    ...maturity(
      'How do the people who touch customers in your business track deals right now?',
      'Most {model_label} founders at your revenue level run on a CRM. The question is whether the team actually uses it.',
      [
        { value: 'A', label: 'There is no CRM, or our deal information lives in email, spreadsheets, or my head.', score: 1 },
        { value: 'B', label: 'We have a CRM, but it gets used inconsistently and the data is patchy.', score: 2 },
        { value: 'C', label: 'Everyone who touches customers uses the CRM, and the basics are reliable.', score: 3 },
        { value: 'D', label: 'The CRM is governed. Required fields are enforced by stage, and the data model is reviewed against how the business actually runs.', score: 4 },
      ],
    ),
  },
  {
    id: 'q5', section: 2, competency: 6, competencyLabel: 'lead qualification',
    ...maturity(
      'When a new lead comes in, how does your team decide whether to pursue it?',
      'This one is about whether qualification lives in people or in a system.',
      [
        { value: 'A', label: 'Anyone willing to talk to us. We chase what is in front of us.', score: 1 },
        { value: 'B', label: 'We use sales judgment. Different people on the team would make different calls and we accept that.', score: 2 },
        { value: 'C', label: 'We have a documented ideal-customer profile and qualification criteria the team uses on every new lead.', score: 3 },
        { value: 'D', label: 'Those criteria are encoded in our CRM scoring and validated against close rates. We disqualify confidently.', score: 4 },
      ],
    ),
  },
  {
    id: 'q6', section: 2, competency: 5, competencyLabel: 'pipeline stage design',
    ...maturity(
      'What has to be true for a deal to move from one stage to the next in your pipeline?',
      'Most {model_label} pipelines I see fail here: stage names exist, exit criteria do not.',
      [
        { value: 'A', label: 'Whatever the rep working the deal feels is right.', score: 1 },
        { value: 'B', label: 'We have custom stage names that fit our process, but no documented criteria for advancement.', score: 2 },
        { value: 'C', label: 'Each stage has documented exit criteria written as buyer-verified facts, not sales activities. The team uses them.', score: 3 },
        { value: 'D', label: 'Those exit criteria are encoded as required CRM fields. A deal cannot advance without them.', score: 4 },
      ],
    ),
  },
  {
    id: 'q7', section: 2, competency: 7, competencyLabel: 'revenue forecasting',
    ...maturity(
      'When a quarter ends, how often does your actual revenue match what you expected at the start of the quarter?',
      'This question is about predictability, not the existence of a spreadsheet.',
      [
        { value: 'A', label: 'Honestly, I do not produce a forecast at the start of the quarter.', score: 1 },
        { value: 'B', label: 'The gap is usually large. We are off by more than thirty percent more often than not.', score: 2 },
        { value: 'C', label: 'We are usually within twenty percent. The methodology is documented.', score: 3 },
        { value: 'D', label: 'We consistently stay under fifteen percent variance, and we produce multiple views (best, commit, worst).', score: 4 },
      ],
    ),
  },
  {
    id: 'q8', section: 2, competency: 8, competencyLabel: 'operating cadence and reporting',
    ...maturity(
      'When your leadership team sits down to talk about revenue, what usually happens?',
      'I am listening for whether your numbers are trusted enough to argue from.',
      [
        { value: 'A', label: 'We do not have regular revenue reviews. We talk about revenue when something is wrong.', score: 1 },
        { value: 'B', label: 'We meet, but the agenda varies. Meetings often start by debating which numbers are right.', score: 2 },
        { value: 'C', label: 'We run a defined cadence with trusted dashboards. Meetings start with questions about what the data means, not whether it is right.', score: 3 },
        { value: 'D', label: 'Dashboards populate before each meeting. Anomalies are investigated and resolved within days. Decisions are tracked and followed up.', score: 4 },
      ],
    ),
  },
  {
    id: 'q9', section: 2, competency: 13, competencyLabel: 'shared revenue definitions',
    ...maturity(
      'If you asked your marketing lead and your top salesperson what a qualified lead is, would you get the same answer?',
      'This is the single most common alignment debate I see in {model_label} businesses.',
      [
        { value: 'A', label: 'Honestly, I am not sure either of them could give me a clean answer.', score: 1 },
        { value: 'B', label: 'Yes-ish, but they would debate it. The definition is verbal, not documented.', score: 2 },
        { value: 'C', label: 'Yes. The definition is documented, shared, and both functions use it.', score: 3 },
        { value: 'D', label: 'The definition is encoded in the CRM, the marketing-to-sales SLA is monitored weekly, and both functions are accountable to it.', score: 4 },
      ],
    ),
  },
  {
    id: 'q10', section: 2, competency: 25, competencyLabel: 'win and loss analysis',
    ...maturity(
      'When you lose a deal, how do you find out why?',
      'Most {model_label} businesses I work with believe they lose on price. The data usually says otherwise.',
      [
        { value: 'A', label: 'We assume it was price, fit, or timing. We move on.', score: 1 },
        { value: 'B', label: 'Reps fill in a CRM dropdown, but the entries are inconsistent and we rarely look at them.', score: 2 },
        { value: 'C', label: 'We run a quarterly win/loss review with coded reasons and use the findings to update the playbook.', score: 3 },
        { value: 'D', label: 'Someone other than the AE interviews lost prospects. The findings update qualification criteria, positioning, and enablement on a defined cadence.', score: 4 },
      ],
    ),
  },
  {
    id: 'q11', section: 2, competency: 29, competencyLabel: 'expansion and net revenue retention',
    ...maturity(
      'In the last twelve months, how much of your revenue growth came from expanding existing clients vs. winning new ones?',
      'For {model_label} businesses with retention dynamics, this is where compound growth comes from.',
      [
        { value: 'A', label: 'Not sure. I do not track that distinction.', score: 1 },
        { value: 'B', label: 'Almost all of it is new logos. Expansion happens when clients ask.', score: 2 },
        { value: 'C', label: 'We track new vs. expansion, and some expansion happens, but it is not a managed motion with defined plays.', score: 3 },
        { value: 'D', label: 'Expansion is a proactive motion with defined triggers. Net revenue retention is tracked monthly and is a primary business metric.', score: 4 },
      ],
    ),
  },
  {
    id: 'q12', section: 2, competency: 40, competencyLabel: 'leading indicators',
    ...maturity(
      'When something is about to break in your revenue engine, how do you usually find out?',
      'This is the difference between reacting to results and acting on signals.',
      [
        { value: 'A', label: 'When we miss the number.', score: 1 },
        { value: 'B', label: 'At the end-of-quarter review.', score: 2 },
        { value: 'C', label: 'Our pipeline review surfaces problems mid-quarter, sometimes earlier.', score: 3 },
        { value: 'D', label: 'Leading indicators alert us before the lagging metric moves. We act on signals, not surprises.', score: 4 },
      ],
    ),
  },

  { id: 'q13', section: 3, kind: 'financial', prompt: 'Average value of a new closed deal', options: Q13_DEAL_OPTIONS },
  { id: 'q14', section: 3, kind: 'financial', prompt: 'Average sales cycle (first qualified conversation to closed-won)', options: Q14_CYCLE_OPTIONS },
  { id: 'q15', section: 3, kind: 'financial', prompt: 'Annual gross revenue churn (what percentage of recurring revenue do you lose per year before any expansion?)', options: Q15_CHURN_OPTIONS, showIf: (answers) => {
    const q2 = answers?.q2?.value;
    return q2 !== 'B2B_PRODUCT' && q2 !== 'ECOMMERCE';
  } },

  { id: 'q16', section: 3, kind: 'reserved', prompt: '', options: [], shipped: false },
];

export function getQuestionsFor(answers) {
  return QUESTIONS.filter((q) => {
    if (q.id === 'q16') return false; // reserved, not shipped in v1
    if (typeof q.showIf === 'function') return q.showIf(answers);
    return true;
  });
}
