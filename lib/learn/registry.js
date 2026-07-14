// Content registry for /learn/[slug] pages. Body copy lives in
// components/learn/content/*.jsx (hand-JSX, matching the site's existing
// convention). This file holds only the structured metadata: SEO fields,
// breadcrumb trail, FAQ, CTA, and the inputs to the JSON-LD schema builders
// in lib/learn/schema.js.

const BYLINE =
  "By Bradley de Wet, founder of Modern BizOps. 15 years in revenue operations, including building revenue systems at Contactually (VC-backed SaaS) before founding Modern BizOps.";

const HUB_URL = "https://modernbizops.com/learn/revenue-operations-maturity-stage-1-reactive";
const CRM_URL = "https://modernbizops.com/learn/crm-architecture-and-governance";
const PIPELINE_URL = "https://modernbizops.com/learn/pipeline-stage-design";
const MODEL_URL = "https://modernbizops.com/predictable-revenue-engine";

export const LEARN_PAGES = {
  "revenue-operations-maturity-stage-1-reactive": {
    slug: "revenue-operations-maturity-stage-1-reactive",
    pageType: "hub",
    title: "Stage 1: Reactive Revenue Operations, and How to Get Out of It",
    metaDescription:
      "If growth in your business depends entirely on you showing up, you are in the Reactive stage. Here is what that costs and the six things to fix first.",
    url: HUB_URL,
    ogImage: "https://modernbizops.com/og/og-learn-stage-1-reactive.png",
    lastUpdated: "2026-07-09",
    h1: "Stage 1: Reactive Revenue Operations",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      { name: "Revenue Maturity Model", url: MODEL_URL },
      { name: "Stage 1: Reactive", url: HUB_URL },
    ],
    faq: [
      {
        q: "Do I need to fix all six Stage 1 competencies before I am out of Reactive?",
        a: "No. Most businesses only need to fix two or three of the six to feel the shift. Start with whichever one is causing the most visible pain right now, usually the CRM nobody trusts or a sales cycle nobody can explain.",
      },
      {
        q: "Does company size determine what stage I am in?",
        a: "No. A $2M business with a real, working system is more mature than a $9M business running entirely on the founder's relationships and memory. Revenue size and operational maturity are two different measurements, and conflating them is one of the most common mistakes founders make when sizing up their own business.",
      },
      {
        q: "How long does it typically take to move out of Reactive?",
        a: "There is no fixed timeline. It depends on which two or three competencies are actually missing and how much of the business currently depends on you personally. What does not work is trying to fix all six at once. Pick the one costing you the most right now and start there.",
      },
    ],
    ctaText:
      "Want to know exactly which stage you are in and which two or three competencies are actually holding you back? Take the five-minute Revenue Maturity Playbook self-assessment.",
    ctaButtonLabel: "Take the Revenue Maturity Playbook",
    // Internal links carry no UTM params: an inbound utm_source on an internal
    // hop resets the GA4 session and steals conversion credit from the channel
    // that actually acquired the visitor. Per-page CTA attribution comes from
    // the cta_click event (cta_location + page path) instead.
    ctaUrl: "/playbook",
    definedTermSet: {
      name: "Stage 1: Reactive Revenue Operations Competencies",
      hasDefinedTerm: [CRM_URL, PIPELINE_URL],
    },
  },

  "crm-architecture-and-governance": {
    slug: "crm-architecture-and-governance",
    pageType: "competency",
    title: "CRM Not Working for Your Team? The Actual Fix",
    metaDescription:
      "A messy CRM is not a training problem. It is a design problem. Here is how to build a CRM your whole team actually trusts and uses.",
    url: CRM_URL,
    ogImage: "https://modernbizops.com/og/og-learn-crm-architecture.png",
    lastUpdated: "2026-07-09",
    h1: "CRM Architecture and Governance",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      { name: "Revenue Maturity Model", url: MODEL_URL },
      { name: "Stage 1: Reactive", url: HUB_URL },
      { name: "CRM Architecture and Governance", url: CRM_URL },
    ],
    faq: [
      {
        q: "What is the most common reason CRM initiatives fail?",
        a: "Not the software. It is a lack of a clear owner and a data model that never got redesigned around how the business actually sells. Generic advice blames training or picking the wrong tool. The real causes are structural: a data model mismatch, and an ownership vacuum where nobody is actually accountable for keeping the system accurate.",
      },
      {
        q: "What is the most common CRM mistake?",
        a: "Treating governance as a technical task and handing it to IT or a single administrator. The real problem is organizational, getting sales, marketing, and service to agree on what a field means and enforce it the same way, not a software configuration issue.",
      },
      {
        q: "Why do CRM programs fail even when the software itself works fine?",
        a: "Because the software was never the problem. You can migrate from HubSpot to Salesforce and back again and still have the same mess, because the mess is the architecture and the governance around it, not the tool.",
      },
    ],
    ctaText:
      "Not sure how your CRM actually scores? The five-minute Revenue Growth Scorecard will tell you.",
    ctaButtonLabel: "Get Your Revenue Growth Scorecard",
    ctaUrl: "/scorecard",
    definedTerm: {
      name: "CRM Architecture and Governance",
      description:
        "The ability to design a CRM data model that actually reflects how your business sells and serves, and to keep governance over that model so reporting stays trustworthy over time.",
      inDefinedTermSetUrl: HUB_URL,
    },
  },

  "pipeline-stage-design": {
    slug: "pipeline-stage-design",
    pageType: "competency",
    title: "Why Is Your Sales Cycle So Long? Probably Not the Reps",
    metaDescription:
      "A long sales cycle is usually a stage-design problem, not a talent problem. Here is how to define pipeline stages that actually predict revenue.",
    url: PIPELINE_URL,
    ogImage: "https://modernbizops.com/og/og-learn-pipeline-stage-design.png",
    lastUpdated: "2026-07-09",
    h1: "Pipeline Stage Design",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      { name: "Revenue Maturity Model", url: MODEL_URL },
      { name: "Stage 1: Reactive", url: HUB_URL },
      { name: "Pipeline Stage Design", url: PIPELINE_URL },
    ],
    faq: [
      {
        q: "What are the stages of a sales cycle?",
        a: "Most generic breakdowns list stages like prospecting, qualifying, proposing, and closing. Those describe what your team did. They do not tell you anything about whether a deal is actually going to close. The stages that matter are the ones defined by what the buyer decided or confirmed at each point, not what your rep activity log says happened.",
      },
      {
        q: "What is the difference between a sales cycle and a sales process?",
        a: "Your sales process is the system: the stages, the exit criteria, the tools. Your sales cycle is the outcome that system produces: how long deals actually take from first contact to close. A long sales cycle is almost always a symptom of a sales process problem, usually stages that track activity instead of buyer decisions, not a sign your reps are slow.",
      },
      {
        q: "How do I know if my sales cycle is too long?",
        a: "There is no single universal benchmark, it depends heavily on your business. Managed services contracts commonly run 30 to 180 days. What matters more than the number itself is the tell: ask your team to walk through the last deal they won, stage by stage, and listen to the verbs. If every stage advancement sounds like an activity your rep did rather than a decision the buyer made, your cycle is longer than it needs to be, regardless of what the number is.",
      },
    ],
    ctaText:
      "Want to know if your pipeline stages are actually predicting revenue or just tracking activity? Take the five-minute Revenue Growth Scorecard.",
    ctaButtonLabel: "Get Your Revenue Growth Scorecard",
    ctaUrl: "/scorecard",
    definedTerm: {
      name: "Pipeline Stage Design",
      description:
        "The ability to define pipeline stages as buyer decision milestones, not sales activities, with documented exit criteria for each stage that has to be verified before a deal moves forward.",
      inDefinedTermSetUrl: HUB_URL,
    },
  },
};
