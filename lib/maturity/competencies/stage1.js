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
export const STAGE_1 = [
  {
    id: 5,
    slug: "pipeline-stage-design",
    stage: 1,
    name: "Pipeline Stage Design",
    appliesTo: "ALL",
    learnMoreUrl: "/learn/pipeline-stage-design",
    shortDef:
      "Pipeline stages defined as buyer decision milestones, not sales activities, each with a documented exit criterion before a deal advances.",
    definition:
      "The ability to define your pipeline stages as buyer decision milestones, the things the buyer actually did, rather than sales activities, with a documented exit criterion for each stage that must be verified before a deal moves forward.",
    data: {
      tools: ["HubSpot", "Salesforce", "Pipedrive", "Close"],
      points: [
        "Your pipeline stage configuration, and whether the stages are custom to your process or the CRM defaults.",
        "The time-in-stage distribution across open deals. A stage where everything piles up usually means the exit criteria are missing or vague.",
        "Stage-to-stage conversion rates.",
        "Whether exit-criteria fields exist on the deal record, and whether they actually get filled in.",
      ],
    },
    questions: {
      ask: [
        "What has to be true for a deal to move from your second-to-last stage to closed?",
        "What actually makes a deal qualified in your process?",
        "How do you handle a deal where the rep has done everything, but the buyer has not confirmed the next step?",
        "Walk me through the last deal you won, stage by stage.",
      ],
      listenFor:
        "Buyer actions versus sales activities. If every stage is I sent the proposal or I had the meeting, the stages are activity-based and the pipeline cannot forecast.",
    },
  },
  {
    id: 1,
    slug: "ideal-customer-profile",
    stage: 1,
    name: "Ideal Customer Profile",
    appliesTo: "ALL",
    shortDef:
      "A precise, documented description of your best-fit customer, including who you are not for, used to guide targeting and where you spend your time.",
    definition:
      "The ability to define, document, and operationalize a precise description of your best-fit customer, including who you are not for, and to use that definition to guide targeting, qualification, and where you spend your time.",
    data: {
      tools: ["HubSpot", "Salesforce", "Pipedrive", "Close"],
      points: [
        "Whether your CRM has a lead or account scoring or tiering field.",
        "Whether your closed-won accounts show consistent firmographic patterns.",
        "Whether deal size and win rate vary measurably by account type.",
      ],
    },
    questions: {
      ask: [
        "Describe your ideal customer in three specific criteria.",
        "What types of companies do you disqualify, and why?",
        "How recently did you review or update your ICP?",
        "Describe the last five clients you won and the last five you lost.",
      ],
      listenFor:
        "Whether you can say why each win and loss was or was not a fit, or whether it comes down to luck, referral source, and price.",
    },
  },
  {
    id: 2,
    slug: "revenue-lifecycle-design",
    stage: 1,
    name: "Revenue Lifecycle Design",
    appliesTo: "ALL",
    shortDef:
      "The full customer journey from first awareness through expansion mapped as one connected system, with defined stage transitions and clear ownership.",
    definition:
      "The ability to map the full customer journey from first awareness through expansion as one connected system, defining the stages a buyer moves through, what triggers each transition, and who owns each stage, on both the acquisition side and the post-sale side.",
    data: {
      tools: ["HubSpot", "Salesforce", "Pipedrive"],
      points: [
        "Whether your CRM has defined lifecycle stages with timestamps.",
        "Whether deals progress through those stages against consistent criteria.",
        "Whether post-sale stages like onboarding, active, at-risk, and expanding exist as distinct states.",
      ],
    },
    questions: {
      ask: [
        "Walk me through what happens from the moment someone first hears about you to the moment they become a client.",
        "What happens after a client signs?",
        "Where do you most commonly lose prospects?",
        "Describe the last deal that stalled, and where exactly it stalled.",
      ],
      listenFor:
        "Whether you describe the journey in buyer terms or only as sales activities, and whether the post-sale journey is designed at all.",
    },
  },
  {
    id: 3,
    slug: "crm-architecture-governance",
    stage: 1,
    name: "CRM Architecture and Governance",
    appliesTo: "ALL",
    learnMoreUrl: "/learn/crm-architecture-and-governance",
    shortDef:
      "A CRM data model that reflects how your revenue process actually works, kept trustworthy over time through clear ownership and governance.",
    definition:
      "The ability to design a CRM data model that accurately reflects your actual revenue process, and to maintain governance over that model so reporting stays consistent and trustworthy over time.",
    data: {
      tools: ["HubSpot", "Salesforce", "Pipedrive", "Close"],
      points: [
        "Your CRM completeness rate, the percentage of required fields that are populated.",
        "The number of duplicate records, and how consistent stage definitions are across deals.",
        "Whether timestamps exist for the key lifecycle events.",
      ],
    },
    questions: {
      ask: [
        "Who is responsible for maintaining your CRM?",
        "When was the last time you changed how your CRM is set up?",
        "How confident are you that what is in your CRM reflects your current pipeline?",
        "Can we pull up ten random deals live and look at them together?",
      ],
      listenFor:
        "How confident you are that the CRM reflects reality, and how you react when you actually look at the records.",
    },
  },
  {
    id: 4,
    slug: "data-quality-management",
    stage: 1,
    name: "Data Quality Management",
    appliesTo: "ALL",
    shortDef:
      "Measuring, monitoring, and actively improving the completeness and accuracy of your revenue data before it corrupts reporting and decisions.",
    definition:
      "The ability to measure, monitor, and actively improve the completeness, accuracy, and consistency of the data across your revenue tech stack, including a process for finding and fixing gaps before they corrupt reporting and decisions.",
    data: {
      tools: ["HubSpot", "Salesforce", "your CRM dashboards"],
      points: [
        "Field completeness rate on each required field.",
        "Your duplicate contact and company count.",
        "The last-activity date distribution across the pipeline, and whether close dates stay consistent as deals progress.",
      ],
    },
    questions: {
      ask: [
        "When your leadership team looks at a revenue report, how much time goes to debating whether the numbers are right?",
        "Do you have someone accountable for CRM data quality?",
        "How do you handle incomplete or inaccurate records?",
        "If I asked you to pull your average deal size right now, how confident would you be in the number?",
      ],
      listenFor:
        "How much time leadership spends arguing about whether the numbers are right, and how confident you are pulling a basic metric on the spot.",
    },
  },
  {
    id: 6,
    slug: "lead-qualification-framework",
    stage: 1,
    name: "Lead Qualification Framework",
    appliesTo: "ALL",
    shortDef:
      "Shared, documented criteria that separate a lead worth pursuing from one that is not, used by everyone who sources or evaluates leads.",
    definition:
      "The ability to define, document, and operationalize the criteria that separate a contact worth pursuing from one that is not, and to share those criteria across everyone who sources or evaluates leads.",
    data: {
      tools: ["HubSpot", "Salesforce", "Pipedrive"],
      points: [
        "Whether a disqualification-reason field exists in your CRM.",
        "Your lead-to-opportunity conversion rate. Very high can mean qualifying is too easy, very low can mean it is too hard or the handoff is broken.",
        "Whether a qualification score or tier field exists on contacts.",
      ],
    },
    questions: {
      ask: [
        "What are the three things that have to be true for a prospect to be worth your sales team's time?",
        "How do marketing and sales define qualified, and is it the same definition?",
        "What is the most common reason you disqualify a lead?",
        "Walk me through the last prospect you decided not to pursue, and what made you make that call.",
      ],
      listenFor:
        "The gap between how you make the call live and what is actually written down. That gap is the real score.",
    },
  },
];
