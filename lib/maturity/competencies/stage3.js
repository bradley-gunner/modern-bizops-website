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
export const STAGE_3 = [
  {
    id: 24,
    slug: "deal-health-scoring",
    stage: 3,
    name: "Deal Health Scoring",
    appliesTo: "ALL",
    shortDef:
      "A deal health score built from engagement signals, stage velocity, and qualification data, so at-risk deals surface before they miss.",
    definition:
      "The ability to assess the probability and risk profile of individual pipeline deals using engagement signals, stage velocity, and qualification data, producing a health score that enables targeted coaching, earlier risk detection, and more accurate forecasting.",
    data: {
      tools: ["HubSpot", "Salesforce", "Pipedrive", "Close"],
      points: [
        "Deals with no CRM activity in 14 or more days.",
        "Single-contact deals with no multi-threading.",
        "Deals with a close date but no documented next step.",
        "Stage velocity compared to my average.",
      ],
    },
    questions: {
      ask: [
        "How do I identify deals that are at risk of not closing before I lose them?",
        "Does my CRM surface at-risk deals automatically, or do I rely on my team to flag them?",
        "In my last quarter, how many deals I expected to close slipped into the next period unexpectedly?",
        "Which three deals am I most concerned about right now?",
        "How did I identify those three deals, from data or from instinct?",
      ],
      listenFor:
        "Whether I found those deals through a score or a report, or whether I can only name them because I happen to remember them.",
    },
  },
  {
    id: 25,
    slug: "win-loss-analysis",
    stage: 3,
    name: "Win/Loss Analysis",
    appliesTo: "ALL",
    shortDef:
      "A systematic process for capturing why deals are won and lost, and using that pattern to improve qualification, positioning, and coaching.",
    definition:
      "The ability to systematically capture and analyze the reasons deals are won and lost, by competitor, by segment, by deal size, by rep, and to use that analysis to improve qualification criteria, competitive positioning, and sales coaching.",
    data: {
      tools: ["HubSpot", "Salesforce", "Pipedrive", "Close"],
      points: [
        "My closed-lost reason field completion rate.",
        "The distribution of closed-lost reasons. Everything landing on one reason usually means the data is low quality, not that the cause is uniform.",
        "Win rate by deal size and by rep.",
      ],
    },
    questions: {
      ask: [
        "What percentage of my deals do I lose to a specific competitor?",
        "When I lose a deal, how do I find out why?",
        "When did I last change my sales process or messaging based on win/loss data?",
        "What is the most common reason I lose deals?",
        "How do I know that is the real reason?",
      ],
      listenFor:
        "The gap between the reason I state and the evidence I actually have for it. That gap is the real signal.",
    },
  },
  {
    id: 26,
    slug: "sales-cycle-velocity-management",
    stage: 3,
    name: "Sales Cycle Velocity Management",
    appliesTo: "ALL",
    shortDef:
      "Measuring time-in-stage to find the specific bottleneck stage, then running an intervention that compresses cycle time without hurting deal quality.",
    definition:
      "The ability to measure and improve the time deals spend at each pipeline stage, identify stage-specific bottlenecks, and implement interventions that compress cycle time without sacrificing deal quality.",
    data: {
      tools: ["HubSpot", "Salesforce", "Pipedrive", "Close"],
      points: [
        "Average time-in-stage by stage.",
        "Variance in time-in-stage. High variance usually means the exit criteria are poorly defined or inconsistently applied.",
        "Percentage of deals closed within my projected timeline.",
      ],
    },
    questions: {
      ask: [
        "Where in my sales process do deals most commonly stall?",
        "What is my average time from first meeting to close?",
        "When a deal goes quiet, what do I do?",
        "Think of a deal that took twice as long as expected to close. What stage did it get stuck in, and why?",
      ],
      listenFor:
        "Whether I can name the specific stage and the specific cause, or whether the slow deal is a one-off story with no pattern behind it.",
    },
  },
  {
    id: 27,
    slug: "customer-health-scoring",
    stage: 3,
    name: "Customer Health Scoring",
    appliesTo: "ALL",
    shortDef:
      "A quantitative health score per active account, built from engagement, usage, and support signals, used to prioritize CS attention and predict renewal.",
    definition:
      "The ability to assign a quantitative health score to each active customer account based on engagement signals, product or service usage, support patterns, and relationship indicators, and to use those scores to prioritize CS team attention and predict renewal probability.",
    data: {
      tools: ["HubSpot Service", "Zendesk", "Intercom"],
      points: [
        "My CS platform or CRM health score field.",
        "The last-contact date distribution across active accounts.",
        "Support ticket frequency by account.",
        "Renewal rate.",
      ],
    },
    questions: {
      ask: [
        "How do I decide which client accounts to prioritize this week?",
        "How do I know when a client is unhappy before they tell me?",
        "In the last year, how many client losses surprised me?",
        "Walk through the last client who churned. When did I first know they were at risk?",
      ],
      listenFor:
        "How early I actually knew, versus how early I could have known if I had been looking at the right signal.",
    },
  },
  {
    id: 28,
    slug: "churn-prediction-and-risk-management",
    stage: 3,
    name: "Churn Prediction and Risk Management",
    appliesTo: "ALL",
    shortDef:
      "Identifying accounts likely to churn before they give notice, using health score signals, and activating a defined intervention play at each risk tier.",
    definition:
      "The ability to identify accounts likely to churn before they give notice, using health score signals and behavioral patterns, and to activate proactive intervention plays that reduce churn probability at each risk tier.",
    data: {
      tools: ["HubSpot Service", "Zendesk", "Intercom"],
      points: [
        "Renewal rate.",
        "Average time between last contact and churn notice.",
        "Health score distribution across accounts up for renewal in the next 90 days.",
      ],
    },
    questions: {
      ask: [
        "How far in advance do I typically know a client is considering leaving?",
        "What do I do when a client's engagement drops significantly?",
        "What percentage of clients who say they are leaving do I successfully retain?",
        "Think of the last two clients who churned. Was I surprised by either of them? What did I know in advance and when?",
      ],
      listenFor:
        "Whether the surprise was real, or whether the warning signs were sitting in the data the whole time and nobody was watching for them.",
    },
  },
  {
    id: 29,
    slug: "renewal-and-expansion-playbook",
    stage: 3,
    name: "Renewal and Expansion Playbook",
    appliesTo: "ALL",
    shortDef:
      "Managing renewals and expansion as a proactive motion, with timing triggers, stakeholder sequences, and a commercial conversation framework for each risk tier.",
    definition:
      "The ability to manage the renewal and expansion revenue cycle as a proactive, structured motion, covering routine renewals, at-risk renewals, upsell, and cross-sell, with defined timing triggers, stakeholder engagement sequences, and commercial conversation frameworks.",
    data: {
      tools: ["HubSpot Service", "Zendesk", "Intercom"],
      points: [
        "Renewal rate.",
        "Average time between contract end and when the renewal conversation actually starts.",
        "Expansion revenue as a percentage of total revenue.",
        "Upsell win rate.",
      ],
    },
    questions: {
      ask: [
        "How far in advance do I start a renewal conversation?",
        "What triggers an upsell conversation with an existing client?",
        "What percentage of my revenue growth last year came from expanding existing clients versus winning new ones?",
        "Tell me about the last time I expanded a client relationship. What triggered the conversation, them or me?",
      ],
      listenFor:
        "Whether expansion is something I initiate on a trigger, or something that only happens when the client happens to ask.",
    },
  },
  {
    id: 30,
    slug: "net-revenue-retention-management",
    stage: 3,
    name: "Net Revenue Retention Management",
    appliesTo: "ALL",
    shortDef:
      "Tracking and decomposing net revenue retention, the share of existing customer revenue kept after churn and expansion, as a primary health metric.",
    definition:
      "The ability to track, decompose, and actively manage net revenue retention, the percentage of revenue from existing customers retained after accounting for churn and expansion, as a primary business health metric.",
    data: {
      tools: ["HubSpot Service", "Zendesk", "QuickBooks", "Xero"],
      points: [
        "Revenue by customer cohort from my billing data.",
        "Churn revenue versus expansion revenue, broken out separately.",
        "Contract value changes over time by customer.",
      ],
    },
    questions: {
      ask: [
        "Do I calculate my net revenue retention? What is it?",
        "Of the revenue growth I've seen in the last 12 months, how much came from expanding existing clients?",
        "What is my gross revenue churn rate?",
        "If I stopped acquiring new clients today, what would happen to my revenue over the next 12 months?",
      ],
      listenFor:
        "Whether I can answer that last question at all. The answer, and my ability to give one, reveals how closely I actually track this number.",
    },
  },
  {
    id: 31,
    slug: "multi-touch-attribution",
    stage: 3,
    name: "Multi-Touch Attribution",
    appliesTo: "ALL",
    shortDef:
      "Assigning revenue credit to the marketing touches that contributed to a closed deal, then using that data to guide channel investment.",
    definition:
      "The ability to assign revenue credit to the marketing touches and channels that contributed to a closed deal, using a defined attribution model, and to use that attribution data to make channel investment decisions grounded in actual revenue contribution.",
    data: {
      tools: ["HubSpot Marketing", "HubSpot", "Marketo", "Mailchimp"],
      points: [
        "Lead source field completion and consistency in my CRM.",
        "Revenue tagged by original source on closed-won deals.",
        "UTM parameter implementation across marketing assets.",
      ],
    },
    questions: {
      ask: [
        "How do I measure the ROI of my marketing spend?",
        "What attribution model do I use?",
        "What is the most cost-effective marketing channel for driving closed revenue, and how do I know?",
        "If I asked which marketing activity closed my last three deals, could I answer that? How?",
      ],
      listenFor:
        "Whether I can trace a specific closed deal back to a specific channel, or whether channel performance is really a guess dressed up as an answer.",
    },
  },
  {
    id: 32,
    slug: "competitive-intelligence-operations",
    stage: 3,
    name: "Competitive Intelligence Operations",
    appliesTo: "ALL",
    shortDef:
      "Systematically gathering and distributing intelligence on competitor positioning and win/loss patterns, feeding it into enablement and pipeline decisions.",
    definition:
      "The ability to systematically gather, analyze, and distribute intelligence about competitor positioning, win/loss patterns by competitor, and market messaging shifts, and to feed that intelligence into sales enablement, product positioning, and pipeline management.",
    data: {
      tools: ["HubSpot", "Salesforce", "Pipedrive", "Close"],
      points: [
        "Closed-lost reason coded by competitor.",
        "Win rate variation by deal size, which often correlates with where a competitor was present.",
        "Deal cycle length on competitive deals versus non-competitive deals.",
      ],
    },
    questions: {
      ask: [
        "Who are my top three competitors, and what is my win rate against each of them?",
        "When a prospect is evaluating me alongside a specific competitor, what do I say?",
        "When did I last update my competitive messaging?",
        "Tell me about a deal I lost to a specific competitor last quarter. What happened, and what could I have done differently?",
      ],
      listenFor:
        "Whether my answer is a specific, evidenced account, or a general impression I have carried without checking it against real deals.",
    },
  },
  {
    id: 33,
    slug: "quota-and-territory-design",
    stage: 3,
    name: "Quota and Territory Design",
    appliesTo: "ALL",
    shortDef:
      "Setting quotas and territories calibrated to actual opportunity rather than history, distributed fairly across capacity, and reviewed on a regular schedule.",
    definition:
      "The ability to set revenue quotas and account territories that are calibrated to opportunity rather than history, distributed equitably across sales capacity, and reviewed regularly to reflect changes in the market and the team.",
    data: {
      tools: ["HubSpot", "Salesforce", "your CRM dashboards"],
      points: [
        "Quota attainment distribution by rep.",
        "Variance in pipeline creation by territory.",
        "Average deal size by territory. High variance points to an unbalanced territory design.",
      ],
    },
    questions: {
      ask: [
        "How are quotas set in my organization?",
        "When did I last redesign my sales territories?",
        "What percentage of my sales team hits quota in a typical quarter?",
        "Would a frontline rep say their quota is fair, and could they explain how it was set?",
      ],
      listenFor:
        "Whether the process is transparent enough that a rep could explain it back to me, or whether it feels arbitrary from where they sit.",
    },
  },
  {
    id: 34,
    slug: "sales-enablement-program",
    stage: 3,
    name: "Sales Enablement Program",
    appliesTo: "ALL",
    shortDef:
      "A systematic program that gives reps the product, market, competitive, and skills knowledge they need at each stage, not just an annual kickoff.",
    definition:
      "The ability to develop, maintain, and deliver a systematic program ensuring sales reps have the knowledge, skills, and content required to execute the sales process effectively at each stage, covering product knowledge, market knowledge, competitive positioning, and selling skills.",
    data: {
      tools: ["HubSpot", "Salesforce", "your CRM dashboards"],
      points: [
        "Win rate variance by rep.",
        "Deal size variance by rep.",
        "Time to first deal for new hires.",
        "Content usage data from my sales enablement platform, if I have one.",
      ],
    },
    questions: {
      ask: [
        "When my sales team needs to handle a competitive objection they haven't seen before, where do they go?",
        "How do I ensure my team is up to date on product changes?",
        "What does my sales training look like beyond initial onboarding?",
        "If my top rep left tomorrow, how much of their approach is replicable by someone else on my team?",
      ],
      listenFor:
        "Whether that last answer names documented content and process, or whether it comes down to one irreplaceable person.",
    },
  },
  {
    id: 35,
    slug: "coaching-cadence-and-performance-management",
    stage: 3,
    name: "Coaching Cadence and Performance Management",
    appliesTo: "ALL",
    shortDef:
      "Structured, data-informed coaching on a consistent cadence, tied to observable skill gaps rather than outcomes alone, connected to measurable improvement.",
    definition:
      "The ability to deliver structured, data-informed coaching to individual sales team members on a consistent cadence, with content tied to observable skill gaps, not just outcomes, and to connect coaching to measurable performance improvement.",
    data: {
      tools: ["HubSpot", "Salesforce", "your CRM dashboards"],
      points: [
        "Conversation intelligence data, if I have it connected.",
        "Pipeline review frequency in the CRM, and whether deals actually get touched after a manager review.",
        "Rep performance distribution over time.",
      ],
    },
    questions: {
      ask: [
        "How often do I do structured one-on-ones with each salesperson?",
        "What does a pipeline review meeting with a sales manager look like?",
        "What is the last thing I changed in my selling approach based on manager feedback?",
        "Walk through the last coaching session with my lowest-performing rep. What did we discuss, and what was the outcome?",
      ],
      listenFor:
        "Whether that session produced a specific next action tied to a specific skill, or whether it was a status update dressed up as coaching.",
    },
  },
  {
    id: 36,
    slug: "channel-level-roi-analysis",
    stage: 3,
    name: "Channel-Level ROI Analysis",
    appliesTo: "ALL",
    shortDef:
      "Calculating the fully-loaded cost of acquiring a customer through each channel and comparing it against the revenue those customers generate.",
    definition:
      "The ability to calculate the fully-loaded cost of acquiring a customer through each demand generation channel, including direct and allocated costs, and to compare that against the revenue those customers generate, enabling data-driven channel investment decisions.",
    data: {
      tools: ["HubSpot Marketing", "QuickBooks", "Xero", "your CRM dashboards"],
      points: [
        "Marketing and sales expense data by channel.",
        "Closed-won revenue tagged by source channel in my CRM.",
        "Customer lifetime value by acquisition source.",
      ],
    },
    questions: {
      ask: [
        "What does it cost me to acquire a client through a specific channel?",
        "Which of my marketing channels produces clients with the highest lifetime value?",
        "Have I ever cut a channel that was generating leads but not generating profitable revenue?",
        "If I had to cut my marketing budget in half tomorrow, what would I keep and what would I cut, and why?",
      ],
      listenFor:
        "Whether that last answer is backed by a number I can point to, or whether it is a preference I have never actually tested.",
    },
  },
  {
    id: 37,
    slug: "revenue-per-employee-and-efficiency",
    stage: 3,
    name: "Revenue Per Employee and Efficiency",
    appliesTo: "ALL",
    shortDef:
      "Tracking revenue generated per team member across revenue-generating functions to understand where headcount investment produces the best return.",
    definition:
      "The ability to track and improve revenue generated per team member across revenue-generating functions, understand the cost structure of the go-to-market team relative to the revenue it produces, and identify where headcount investment generates the highest incremental return.",
    data: {
      tools: ["QuickBooks", "Xero", "your CRM dashboards"],
      points: [
        "Total revenue divided by total revenue team headcount, calculable from my P&L and team data.",
        "Revenue per salesperson compared to an industry benchmark.",
      ],
    },
    questions: {
      ask: [
        "What is my revenue per employee today compared to 12 months ago?",
        "Have I grown revenue without growing headcount in the last year? By how much?",
        "What does it take to add the next $1M in revenue to my business?",
        "If my revenue doubled in the next 18 months, how much would my team size change, and what would I automate to make that possible?",
      ],
      listenFor:
        "Whether I have a specific plan for scaling revenue faster than headcount, or whether more revenue just means more hires by default.",
    },
  },
  {
    id: 38,
    slug: "lead-scoring-and-automated-routing",
    stage: 3,
    name: "Lead Scoring and Automated Routing",
    appliesTo: "ALL",
    shortDef:
      "Scoring leads on fit and intent, then automatically routing them to the right person, sequence, or nurture track instead of assigning them manually.",
    definition:
      "The ability to score leads on ICP fit and behavioral intent, and to automatically route them to the appropriate person, sequence, or nurture track based on those scores, replacing manual assignment with a rules-based or AI-powered system that ensures consistent, fast response.",
    data: {
      tools: ["HubSpot", "HubSpot Marketing", "Marketo", "Salesforce"],
      points: [
        "Lead response time, from lead creation to first contact.",
        "Lead-to-opportunity conversion rate by source.",
        "Whether a lead score field exists in my CRM, and how consistently it is populated.",
      ],
    },
    questions: {
      ask: [
        "How do I decide which new leads my sales team should prioritize?",
        "Is my lead assignment automated or manual?",
        "How long does it typically take for a new inbound lead to get contacted?",
        "Walk through what happens in the first 30 minutes after a new lead fills out a form on my website.",
      ],
      listenFor:
        "How many manual handoffs sit in that first 30 minutes. Each one is a place a hot lead can go cold before anyone notices.",
    },
  },
];
