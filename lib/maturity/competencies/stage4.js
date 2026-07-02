/**
 * @typedef {Object} Competency
 * @property {number} id            Display id (from maturity-model.html STAGES)
 * @property {string} slug          URL-safe, used for anchor deep-links
 * @property {number} stage         1..4
 * @property {string} name          Exact name from the source list
 * @property {string} appliesTo     "ALL" or a short model note for model-specific
 * @property {string} shortDef      One line for the grid card
 * @property {string} definition    Full lead, near-verbatim from the framework spec
 * @property {{tools: string[], points: string[]}} data   Named tools + what I read
 * @property {{ask: string[], listenFor: string}} questions  Merged Tier 2 + Tier 3
 *
 * NOTE: there is deliberately no `rubric` field. The 1-5 scoring key stays private.
 */
export const STAGE_4 = [
  {
    id: 39,
    slug: "scenario-modeling-sensitivity-analysis",
    stage: 4,
    name: "Scenario Modeling and Sensitivity Analysis",
    appliesTo: "ALL",
    shortDef:
      "Modeling multiple revenue scenarios with explicit assumptions, and presenting a range to leadership instead of a single-point forecast.",
    definition:
      "The ability to model multiple revenue scenarios for a planning period, test how sensitive my revenue outcomes are to changes in key drivers, and present a scenario range to leadership and finance with explicit assumptions, instead of a single-point forecast that hides how much uncertainty is actually in the number.",
    data: {
      tools: ["HubSpot", "Salesforce", "your CRM dashboards"],
      points: [
        "My historical forecast accuracy, since the quality of my input data sets the ceiling on the quality of the model.",
        "The variance between my initial forecast and what actually happened, by quarter.",
      ],
    },
    questions: {
      ask: [
        "What would happen to our revenue if our win rate dropped 10 percentage points?",
        "Do we plan to a range or to a single number?",
        "What assumptions would have to be wrong for us to miss our annual revenue target?",
        "Walk me through how we build our annual revenue plan.",
      ],
      listenFor:
        "Whether the plan-building answer describes a driver-based model or comes down to gut feel plus a growth rate. That distinction is the real score.",
    },
  },
  {
    id: 40,
    slug: "growth-scorecard",
    stage: 4,
    name: "Growth Scorecard",
    appliesTo: "ALL",
    shortDef:
      "One executive-level view of revenue system health that combines pipeline, win rate, expansion, churn, efficiency, and unit economics.",
    definition:
      "The ability to maintain a single executive-level view of my revenue system's health, combining new pipeline creation, win rates, expansion rates, churn, efficiency metrics, and unit economics, so I get early warning of trajectory changes and can speak to the board with confidence instead of assembling numbers the night before.",
    data: {
      tools: ["HubSpot", "your CRM dashboards", "Looker", "Power BI"],
      points: [
        "How complete and consistent the underlying metric data is across my systems.",
        "Whether a single dashboard tracks all my key metrics, or whether I need to pull from multiple tools to get the full picture.",
      ],
    },
    questions: {
      ask: [
        "If a board member asked me right now whether my revenue engine is healthy, how would I answer, and what data would I point to?",
        "What is the one number that tells me the most about the health of my business?",
        "What metrics do I actually present in my board deck?",
        "What is missing from that deck that would tell the real story of whether my revenue system is working?",
      ],
      listenFor:
        "What the board deck actually contains versus what would need to be there to tell the true story. The gap between the two is the score.",
    },
  },
  {
    id: 41,
    slug: "customer-lifecycle-marketing-automation",
    stage: 4,
    name: "Customer Lifecycle Marketing Automation",
    appliesTo: "Businesses that nurture leads over longer cycles",
    shortDef:
      "A behavior-triggered communication system that covers the full customer lifecycle without manual campaign management for every message.",
    definition:
      "The ability to design and operate a behavior-triggered communication system across the full customer lifecycle, from first acquisition through repeat engagement, lapse, and win-back, that delivers relevant and timely messages without requiring me to manually build and send every campaign.",
    data: {
      tools: ["HubSpot Marketing", "Marketo", "Customer.io"],
      points: [
        "How my email platform connects to the rest of my stack, and how many active lifecycle flows I actually have running.",
        "My email revenue attribution by flow, and how deep my list segmentation goes.",
      ],
    },
    questions: {
      ask: [
        "What automated emails does a new customer receive in their first 30 days?",
        "What happens when a customer has not engaged or purchased in 90 days?",
        "What percentage of my email revenue comes from automated flows versus manual campaigns?",
        "How often do I actually review and update these flows?",
      ],
      listenFor:
        "Whether the flows were set up once and forgotten, or whether they are reviewed and improved on a real cadence. A flow nobody has touched in a year is not a system, it is a relic.",
    },
  },
  {
    id: 42,
    slug: "subscription-mrr-operations",
    stage: 4,
    name: "Subscription and MRR Operations",
    appliesTo: "Subscription and recurring-revenue businesses",
    shortDef:
      "Managing the recurring-revenue mechanics, MRR tracking, dunning, and cancellation flow design, so revenue is not lost passively.",
    definition:
      "The ability to manage the recurring revenue mechanics of my subscription business, including MRR tracking, involuntary churn management through dunning, cancellation flow design, and subscription plan architecture, so revenue is not lost passively to billing failures or a frictionless cancel button.",
    data: {
      tools: ["Stripe", "Chargebee", "Recurly"],
      points: [
        "My billing platform connection and my MRR trend data over time.",
        "My failed payment recovery rate.",
        "The breakdown between voluntary and involuntary churn, since they call for different fixes.",
      ],
    },
    questions: {
      ask: [
        "What happens when a client's payment fails?",
        "What is my monthly churn rate, and do I track it separately for voluntary and involuntary churn?",
        "Do I offer a pause option for clients who want to cancel?",
        "How many steps does my dunning sequence actually run before I give up on a failed payment?",
      ],
      listenFor:
        "Whether failed payments trigger a real recovery sequence or just a single decline email. A single email is not dunning, it is a formality.",
    },
  },
  {
    id: 43,
    slug: "conversion-rate-optimization",
    stage: 4,
    name: "Conversion Rate Optimization",
    appliesTo: "High-traffic and e-commerce businesses",
    shortDef:
      "Systematically measuring, testing, and improving conversion at each step of the funnel, from landing page through checkout or activation.",
    definition:
      "The ability to systematically measure, test, and improve conversion rates at each stage of my digital acquisition funnel, from landing pages through lead forms, trial activation, and checkout, using structured A/B testing and user behavior analytics instead of redesigning the homepage every time growth slows.",
    data: {
      tools: ["Google Analytics", "Optimizely", "VWO"],
      points: [
        "My funnel step conversion data and where visitors actually drop off.",
        "My form submission rates and landing page bounce rates.",
      ],
    },
    questions: {
      ask: [
        "What percentage of visitors to my main landing page convert to a lead?",
        "Have I run A/B tests on my key acquisition pages, and did they run to statistical significance?",
        "What does a visitor have to do between arriving on my site and becoming a qualified lead?",
        "How do I decide which page or step to test next?",
      ],
      listenFor:
        "Whether tests are prioritized by expected revenue impact against a real roadmap, or run reactively whenever someone has a hunch.",
    },
  },
  {
    id: 44,
    slug: "product-usage-analytics",
    stage: 4,
    name: "Product Usage Analytics",
    appliesTo: "Software and product businesses with usage data",
    shortDef:
      "Instrumenting the product to capture usage and adoption, then routing that data into the CRM and CS platform to drive decisions.",
    definition:
      "The ability to instrument my product to capture feature usage, session frequency, and adoption milestones, and to route that data into my CRM and customer success platform so sales and CS can use real product signals in go-to-market and retention decisions, instead of managing activation and churn blind.",
    data: {
      tools: ["Amplitude", "Mixpanel", "PostHog"],
      points: [
        "My product analytics platform connection and how much of the product my event tracking actually covers.",
        "Whether usage data shows up on the account record in my CRM, or lives only in a separate analytics tool.",
      ],
    },
    questions: {
      ask: [
        "Do I know how often my average customer logs into the product each week?",
        "When a customer goes quiet and stops using the product, how do I find out?",
        "Are there specific features that correlate with customers staying long-term?",
        "Does my CS team reference usage data in renewal conversations, or work from memory?",
      ],
      listenFor:
        "Whether usage data actually reaches the people managing the account, or sits in a dashboard nobody but the product team opens.",
    },
  },
];
