// Content registry for /learn/[slug] pages. Body copy lives in
// components/learn/content/*.jsx (hand-JSX, matching the site's existing
// convention). This file holds only the structured metadata: SEO fields,
// breadcrumb trail, FAQ, CTA, and the inputs to the JSON-LD schema builders
// in lib/learn/schema.js.

// Author byline, rendered as visible copy in the hero of every page in this
// registry and re-used by the two root-level pages that carry the same card.
//
// It said "15 years in revenue operations" until 2026-08-11. Both halves of
// that were wrong for the site as it now reads: the positioning number is
// "over a decade" and nothing new ever asserts fifteen (the live LinkedIn
// headline is the only place fifteen survives, until that profile is rewritten),
// and "revenue operations" is demoted vocabulary now that the company sells AI
// automation. The record it describes is unchanged; only the framing is.
export const BYLINE =
  "By Bradley de Wet, founder of Modern BizOps. Over a decade building revenue engines at high-growth startups as the person doing the work, including revenue systems at Contactually (VC-backed SaaS), founding Tasting Club, and serving as COO and leader of account management at a boutique digital marketing agency.";

const HUB_URL = "https://modernbizops.com/learn/revenue-operations-maturity-stage-1-reactive";
const CRM_URL = "https://modernbizops.com/learn/crm-architecture-and-governance";
const PIPELINE_URL = "https://modernbizops.com/learn/pipeline-stage-design";
const ICP_URL = "https://modernbizops.com/learn/ideal-customer-profile";
const LIFECYCLE_URL = "https://modernbizops.com/learn/revenue-lifecycle-design";
const DATA_QUALITY_URL = "https://modernbizops.com/learn/data-quality-management";
const LEAD_QUAL_URL = "https://modernbizops.com/learn/lead-qualification-framework";
const MODEL_URL = "https://modernbizops.com/predictable-revenue-engine";
const FRACTIONAL_COO_URL = "https://modernbizops.com/learn/fractional-coo";
const FRACTIONAL_COO_COST_URL =
  "https://modernbizops.com/learn/fractional-coo-cost";
const NRR_URL = "https://modernbizops.com/learn/net-revenue-retention";
const ALIGNMENT_URL = "https://modernbizops.com/learn/marketing-and-sales-alignment";
const WHAT_IS_REVOPS_URL = "https://modernbizops.com/learn/what-is-revops";
const RPE_URL = "https://modernbizops.com/learn/revenue-per-employee";
const SMARKETING_URL = "https://modernbizops.com/learn/smarketing";
const MQL_SQL_URL = "https://modernbizops.com/learn/mql-to-sql-conversion-rate";
const INVOLUNTARY_CHURN_URL = "https://modernbizops.com/learn/involuntary-churn";
const WIN_LOSS_URL = "https://modernbizops.com/learn/win-loss-analysis";
const CUSTOMER_RETENTION_STRATEGY_URL =
  "https://modernbizops.com/learn/customer-retention-strategy";
const REDUCE_CUSTOMER_CHURN_URL =
  "https://modernbizops.com/learn/reduce-customer-churn";
const PAYMENT_RECOVERY_URL = "https://modernbizops.com/learn/payment-recovery";
const CUSTOMER_LIFECYCLE_MARKETING_URL =
  "https://modernbizops.com/learn/customer-lifecycle-marketing";
const CONVERSION_RATE_OPTIMIZATION_URL =
  "https://modernbizops.com/learn/conversion-rate-optimization";

// Pillar-map pages (Wave 1 of the keyword-validated content plan) sit outside
// the maturity-stage hierarchy, so their breadcrumb is the flatter
// Home > Learn > <page>. The crumb carried noLink while /learn was a schema-only
// path with no route behind it; the index page shipped 2026-08-11, so the crumb
// is a real link again and the flag is gone.
const LEARN_CRUMB = {
  name: "Learn",
  url: "https://modernbizops.com/learn",
};

// Author-card credential. Drawn from BYLINE above rather than written fresh, so
// the card can never introduce a claim the approved byline does not make. It
// stops short of the full byline because the hero already carries that in full,
// a few hundred words up the page.
export const AUTHOR_CREDENTIAL =
  "Founder of Modern BizOps. Over a decade building revenue engines at high-growth startups as the person doing the work, including revenue systems at Contactually (VC-backed SaaS).";

// Hero configuration, one row per page, merged onto the entries at export.
//
// It lives in its own table rather than inside each entry so the navy/teal
// rotation is legible at a glance: the theme alternates strictly by publish
// order, top to bottom, so the library never reads as one dark-blue template
// repeated. Only the hero band rotates; the data blocks are navy everywhere.
//
// accentWord must be a substring of the entry's h1 (it renders italic amber in
// place); motif is a key from components/learn/motifs. Both are optional and
// degrade to a plain H1 and the four-stage chevron fallback.
const VISUALS = {
  // SEO pilot, pages 01-10.
  "revenue-operations-maturity-stage-1-reactive": {
    kicker: "Revenue Maturity Model · Stage 1",
    accentWord: "Reactive",
    motif: "stage1Chevrons",
    theme: "navy",
  },
  "crm-architecture-and-governance": {
    kicker: "Revenue Maturity Model · Stage 1",
    accentWord: "Governance",
    motif: "crmRecords",
    theme: "teal",
  },
  "pipeline-stage-design": {
    kicker: "Revenue Maturity Model · Stage 1",
    accentWord: "Stage Design",
    motif: "pipelineChevrons",
    theme: "navy",
  },
  "ideal-customer-profile": {
    kicker: "Revenue Maturity Model · Stage 1",
    accentWord: "Customer Profile",
    motif: "icpTarget",
    theme: "teal",
  },
  "revenue-lifecycle-design": {
    kicker: "Revenue Maturity Model · Stage 1",
    accentWord: "Lifecycle Design",
    motif: "lifecycleLoop",
    theme: "navy",
  },
  "data-quality-management": {
    kicker: "Revenue Maturity Model · Stage 1",
    accentWord: "Quality Management",
    motif: "dataIntegrityGrid",
    theme: "teal",
  },
  "lead-qualification-framework": {
    kicker: "Revenue Maturity Model · Stage 1",
    accentWord: "Qualification Framework",
    motif: "qualifyFunnel",
    theme: "navy",
  },
  "fractional-coo": {
    kicker: "Revenue Operations · Leadership",
    accentWord: "COO",
    motif: "leadershipMotif",
    theme: "teal",
  },
  "net-revenue-retention": {
    kicker: "Revenue Maturity Model · Stage 3",
    accentWord: "Retention",
    motif: "retentionExpansion",
    theme: "navy",
  },
  "marketing-and-sales-alignment": {
    kicker: "Revenue Operations · Alignment",
    accentWord: "Alignment",
    motif: "twoIntoOne",
    theme: "teal",
  },
  // Wave 1 pillar-map pages, 11-16. Hero only for now: their data blocks are a
  // fast follow-up pending a source-copy review.
  "what-is-revops": {
    kicker: "Revenue Operations · Fundamentals",
    accentWord: "RevOps",
    motif: "twoIntoOne",
    theme: "navy",
  },
  "revenue-per-employee": {
    kicker: "Revenue Operations · Benchmarks",
    accentWord: "Per Employee",
    motif: "retentionExpansion",
    theme: "teal",
  },
  smarketing: {
    kicker: "Revenue Operations · Alignment",
    accentWord: "Smarketing",
    motif: "twoIntoOne",
    theme: "navy",
  },
  "mql-to-sql-conversion-rate": {
    kicker: "Revenue Operations · Benchmarks",
    accentWord: "Conversion Rate",
    motif: "qualifyFunnel",
    theme: "teal",
  },
  "involuntary-churn": {
    kicker: "Revenue Operations · Retention",
    accentWord: "Churn",
    motif: "retentionExpansion",
    theme: "navy",
  },
  "win-loss-analysis": {
    kicker: "Revenue Maturity Model · Stage 3",
    accentWord: "Analysis",
    motif: "icpTarget",
    theme: "teal",
  },
  // Wave 2 fractional-COO cluster: the MOFU cost-comparison page. Its bespoke
  // motif renders the page's core argument (three paths leave, one stays).
  "fractional-coo-cost": {
    kicker: "Fractional COO · Cost",
    accentWord: "Cost",
    motif: "fourPaths",
    theme: "navy",
  },
  // Wave 2 AI cluster (4.1 TOFU, 4.2 MOFU). Both share the amplifier motif, the
  // single governing metaphor of the set; the navy/teal rotation keeps the two
  // adjacent pages visually distinct. 4.3 is a root-level page, not in this
  // registry, so it does not appear here.
  "ai-for-small-business": {
    kicker: "AI for Revenue Operations · Strategy",
    accentWord: "AI",
    motif: "amplifier",
    theme: "teal",
  },
  "ai-tools-for-small-business": {
    kicker: "AI for Revenue Operations · Tools",
    accentWord: "Tools",
    motif: "amplifier",
    theme: "navy",
  },
  // Wave 4: the retention (2.3, 2.4), subscription-recovery (5.2), lifecycle
  // (6.1), and conversion (7.1) cluster. Theme continues the strict navy/teal
  // rotation from ai-tools (navy): teal, navy, teal, navy, teal. Two new motifs
  // (interveneTimeline, recoveryLoop) join the reused retention/lifecycle/funnel
  // motifs; every data block stays navy regardless.
  "customer-retention-strategy": {
    kicker: "Revenue Maturity Model · Retention",
    accentWord: "Retention",
    motif: "retentionExpansion",
    theme: "teal",
  },
  "reduce-customer-churn": {
    kicker: "Revenue Maturity Model · Retention",
    accentWord: "Churn",
    motif: "interveneTimeline",
    theme: "navy",
  },
  "payment-recovery": {
    kicker: "Revenue Maturity Model · Subscription and MRR Operations",
    accentWord: "Recovery",
    motif: "recoveryLoop",
    theme: "teal",
  },
  "customer-lifecycle-marketing": {
    kicker: "Revenue Maturity Model · Revenue Lifecycle",
    accentWord: "Lifecycle",
    motif: "lifecycleLoop",
    theme: "navy",
  },
  "conversion-rate-optimization": {
    kicker: "Revenue Maturity Model · Pipeline and Conversion",
    accentWord: "Conversion",
    motif: "qualifyFunnel",
    theme: "teal",
  },
};

const PAGES = {
  "revenue-operations-maturity-stage-1-reactive": {
    slug: "revenue-operations-maturity-stage-1-reactive",
    pageType: "hub",
    title: "Stage 1: Reactive Revenue Operations, and How to Escape It",
    // Dek override, approved by Bradley 2026-07-14: the full title would
    // repeat the H1 on this one page, so the on-page subhead carries only
    // the second half. Pages without a subhead use their title verbatim.
    subhead: "And How to Escape It",
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
    ctaButtonLabel: "Get the Revenue Maturity Playbook",
    // Internal links carry no UTM params: an inbound utm_source on an internal
    // hop resets the GA4 session and steals conversion credit from the channel
    // that actually acquired the visitor. Per-page CTA attribution comes from
    // the cta_click event (cta_location + page path) instead.
    ctaUrl: "/playbook",
    definedTermSet: {
      name: "Stage 1: Reactive Revenue Operations Competencies",
      hasDefinedTerm: [
        ICP_URL,
        LIFECYCLE_URL,
        CRM_URL,
        DATA_QUALITY_URL,
        PIPELINE_URL,
        LEAD_QUAL_URL,
      ],
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
      "Not sure how your CRM actually scores? The five-minute AI Revenue Scan will tell you.",
    ctaButtonLabel: "Get the Free Scan",
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
      "Want to know if your pipeline stages are actually predicting revenue or just tracking activity? Take the five-minute AI Revenue Scan.",
    ctaButtonLabel: "Get the Free Scan",
    ctaUrl: "/scorecard",
    definedTerm: {
      name: "Pipeline Stage Design",
      description:
        "The ability to define pipeline stages as buyer decision milestones, not sales activities, with documented exit criteria for each stage that has to be verified before a deal moves forward.",
      inDefinedTermSetUrl: HUB_URL,
    },
  },

  "ideal-customer-profile": {
    slug: "ideal-customer-profile",
    pageType: "competency",
    title: "Why You Keep Winning the Wrong Clients",
    metaDescription:
      "A messy client list is not bad luck. It is a missing definition. Here is how to build an ideal customer profile your whole team actually uses.",
    url: ICP_URL,
    ogImage: "https://modernbizops.com/og/og-learn-ideal-customer-profile.png",
    lastUpdated: "2026-07-14",
    h1: "Ideal Customer Profile",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      { name: "Revenue Maturity Model", url: MODEL_URL },
      { name: "Stage 1: Reactive", url: HUB_URL },
      { name: "Ideal Customer Profile", url: ICP_URL },
    ],
    faq: [
      {
        q: "Is an ideal customer profile the same thing as a buyer persona?",
        a: "No, and the difference matters more than it sounds. A buyer persona describes an individual, their role, their goals, how they like to be communicated with. An ideal customer profile describes the company: size, industry, situation, and crucially, the traits that predict whether they will actually succeed with you. You can have an accurate persona for someone at a company that is a terrible fit for your business.",
      },
      {
        q: "How often should you revisit your ideal customer profile?",
        a: "At minimum, whenever your offer changes materially, or once a quarter if it has not. The mistake is treating it as a one-time exercise from an old planning session. Markets shift, your own capability shifts, and the traits that predicted success two years ago are not guaranteed to still predict it now.",
      },
      {
        q: "What is the fastest way to build a real ICP if we have never written one down?",
        a: "Do not start with a workshop. Start with your CRM. Pull your closed-won and closed-lost deals from the last six months to a year and look for the pattern that actually separates them. That pattern, not a brainstorm, is your starting draft.",
      },
    ],
    ctaText:
      "Not sure if your team is actually chasing the right clients? The five-minute AI Revenue Scan will tell you.",
    ctaButtonLabel: "Get the Free Scan",
    ctaUrl: "/scorecard",
    definedTerm: {
      name: "Ideal Customer Profile",
      description:
        "The ability to define, document, and operationalize a precise description of your best-fit customer, including who you are not for, and to use that definition to guide targeting, qualification, and resource allocation decisions.",
      inDefinedTermSetUrl: HUB_URL,
    },
  },

  "revenue-lifecycle-design": {
    slug: "revenue-lifecycle-design",
    pageType: "competency",
    title: "Why Deals Stall After the Demo (It Is Not the Demo)",
    metaDescription:
      "A deal that stalls after a good demo is rarely a demo problem. It usually means nobody designed what happens next. Here is how to map the full customer journey.",
    url: LIFECYCLE_URL,
    ogImage: "https://modernbizops.com/og/og-learn-revenue-lifecycle-design.png",
    lastUpdated: "2026-07-14",
    h1: "Revenue Lifecycle Design",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      { name: "Revenue Maturity Model", url: MODEL_URL },
      { name: "Stage 1: Reactive", url: HUB_URL },
      { name: "Revenue Lifecycle Design", url: LIFECYCLE_URL },
    ],
    faq: [
      {
        q: "What are the biggest reasons deals stall after a demo?",
        a: "Most generic answers point at the demo itself: too long, too generic, showing the wrong feature. In practice, the more common cause is that nobody defined what specifically has to be true for the buyer to move forward, so the deal drifts on curiosity instead of advancing on a real decision. That is a lifecycle design gap, not a presentation problem.",
      },
      {
        q: "Is revenue lifecycle design the same thing as a sales funnel?",
        a: "No. A sales funnel maps only the acquisition side, awareness through close. Revenue lifecycle design maps the acquisition side and the post-sale side, onboarding, activation, expansion, renewal, as one connected system with shared ownership, not two separate conversations run by two separate teams.",
      },
      {
        q: "What happens to a customer right after they sign, in a well-designed system?",
        a: "There is a defined handoff with complete context, not a summary email. There is a specific first-value milestone the team is working toward, with a timeline. And there is a defined trigger for what happens if the client starts falling behind that pace, so an at-risk account gets caught early instead of discovered at renewal time.",
      },
    ],
    ctaText:
      "Want to know whether your customer journey is actually designed, or just happening? Take the five-minute AI Revenue Scan.",
    ctaButtonLabel: "Get the Free Scan",
    ctaUrl: "/scorecard",
    definedTerm: {
      name: "Revenue Lifecycle Design",
      description:
        "The ability to map the full customer journey from first awareness through expansion as one connected system, defining the stages a buyer moves through, what triggers each stage transition, and who owns each stage, on both the acquisition side and the post-sale side.",
      inDefinedTermSetUrl: HUB_URL,
    },
  },

  "data-quality-management": {
    slug: "data-quality-management",
    pageType: "competency",
    title: "Why Every Revenue Meeting Starts With an Argument About the Numbers",
    metaDescription:
      "If your team debates whose number is right before every meeting, that is not a reporting problem. It is a data quality problem, and it is fixable.",
    url: DATA_QUALITY_URL,
    ogImage: "https://modernbizops.com/og/og-learn-data-quality-management.png",
    lastUpdated: "2026-07-14",
    h1: "Data Quality Management",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      { name: "Revenue Maturity Model", url: MODEL_URL },
      { name: "Stage 1: Reactive", url: HUB_URL },
      { name: "Data Quality Management", url: DATA_QUALITY_URL },
    ],
    faq: [
      {
        q: "What is the most common cause of poor CRM data quality?",
        a: "Not carelessness. It is the absence of an owner. Required fields are not enforced at entry, nobody audits the data on a real schedule, and the same problems recur every time the last manual cleanup wears off. Data quality decays by default unless someone is specifically accountable for maintaining it.",
      },
      {
        q: "How often should you audit your CRM's data quality?",
        a: "Monthly at minimum once you are past Level 2, and continuously once you have reached Level 4 or 5. A once-a-year cleanup is better than nothing, but it guarantees your team spends most of the year making decisions on data that has already started to drift.",
      },
      {
        q: "Can AI actually fix a messy CRM, or does someone still need to do the work?",
        a: "AI accelerates the cleanup and can run it continuously instead of once a quarter, but it cannot substitute for the underlying accountability. Pointing an enrichment tool at a CRM with no owner and no enforced fields just produces clean-looking garbage faster. The ownership question has to be answered first.",
      },
    ],
    ctaText:
      "Not sure how trustworthy your own revenue data actually is? The five-minute AI Revenue Scan will tell you.",
    ctaButtonLabel: "Get the Free Scan",
    ctaUrl: "/scorecard",
    definedTerm: {
      name: "Data Quality Management",
      description:
        "The ability to measure, monitor, and actively improve the completeness, accuracy, and consistency of data across the revenue tech stack, including processes for identifying and resolving gaps before they corrupt reporting and decision-making.",
      inDefinedTermSetUrl: HUB_URL,
    },
  },

  "lead-qualification-framework": {
    slug: "lead-qualification-framework",
    pageType: "competency",
    title: "How to Tell a Real Lead From a Waste of Time",
    metaDescription:
      "Not every lead deserves a call. Here is how to build one shared definition of a qualified lead that marketing and sales both actually use.",
    url: LEAD_QUAL_URL,
    ogImage: "https://modernbizops.com/og/og-learn-lead-qualification-framework.png",
    lastUpdated: "2026-07-14",
    h1: "Lead Qualification Framework",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      { name: "Revenue Maturity Model", url: MODEL_URL },
      { name: "Stage 1: Reactive", url: HUB_URL },
      { name: "Lead Qualification Framework", url: LEAD_QUAL_URL },
    ],
    faq: [
      {
        q: "How do you determine if a lead is actually qualified?",
        a: "Two things have to both be true: your product or service can genuinely solve the problem this account has, and they can actually afford what solving it costs. Everything past that, specific frameworks like BANT, CHAMP, or MEDDIC, is a more detailed way of checking those same two things. The framework you pick matters less than actually writing one down and having both marketing and sales use the same one.",
      },
      {
        q: "What is the difference between BANT, CHAMP, and MEDDIC?",
        a: "BANT checks budget, authority, need, and timeline. CHAMP checks challenges, authority, money, and prioritization, putting the prospect's problem before the money question. MEDDIC is built for longer, more complex enterprise deals and adds metrics, decision process, and identifying a champion inside the account. None of the three is universally correct. The mistake is not picking one, it is having no shared one at all.",
      },
      {
        q: "Should marketing or sales own the qualification definition?",
        a: 'Neither one alone. The most common failure mode is exactly this: marketing defines "qualified" one way to hit a lead volume target, sales defines it another way to protect their time, and both sides are technically right by their own definition. The fix is a single definition both functions build and agree to together, not a definition one team owns and hands to the other.',
      },
    ],
    ctaText:
      "Not sure your team is actually working the right leads? The five-minute AI Revenue Scan will tell you.",
    ctaButtonLabel: "Get the Free Scan",
    ctaUrl: "/scorecard",
    definedTerm: {
      name: "Lead Qualification Framework",
      description:
        "The ability to define, document, and operationalize the criteria that distinguish a contact worth pursuing from one that is not, and to share those criteria across everyone who sources or evaluates leads.",
      inDefinedTermSetUrl: HUB_URL,
    },
  },

  // ---- Wave 1 pillar-map pages (keyword-validated content plan) -----------
  // These are pillar pages, not Maturity Framework competency pages. Pages
  // with pageType "article" carry Article schema instead of DefinedTerm and
  // never join the Stage 1 hub's DefinedTermSet.

  "fractional-coo": {
    slug: "fractional-coo",
    pageType: "article",
    title: "What a Fractional COO Actually Does (and When You Actually Need One)",
    metaDescription:
      "A fractional COO runs your operations part time, from the operator's seat. Here is what the job involves, what it costs, and when you do not need one at all.",
    url: FRACTIONAL_COO_URL,
    ogImage: "https://modernbizops.com/og/og-learn-fractional-coo.png",
    lastUpdated: "2026-07-14",
    h1: "Fractional COO",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      { name: "Fractional COO", url: FRACTIONAL_COO_URL },
    ],
    faq: [
      {
        q: "What is the average cost of a fractional COO?",
        a: "Around $205 per hour at the market average, with most engagements falling between $166 and $250 per hour, per Go Fractional's live 2026 benchmark data. On a typical two-day-a-week scope that works out to monthly retainers starting around $11,000, rising with scope and complexity. The honest comparison is not against zero, it is against the roughly $467,000 average salary of a full-time COO, against promoting someone internally and getting them coached, or against the cost of the founder continuing to be the operations department.",
      },
      {
        q: "What are the typical responsibilities of a fractional COO?",
        a: "Whatever operational work is currently stuck because nobody senior owns it. In my own engagements that has meant pricing strategy, billing and collections redesign, CRM and pipeline architecture, campaign execution, systems audits, and the financial model behind an acquisition decision. The common thread is ownership: a fractional COO takes responsibility for outcomes, not for recommendations.",
      },
      {
        q: "What types of companies hire a fractional COO?",
        a: "Most commonly founder-led companies roughly between $1M and $50M in revenue, at the stage where the founder is still the de facto head of operations and it has become the constraint on growth. The business model matters less than the situation: agencies, service firms, software companies, and gyms all hit the same wall, where every new dollar of growth requires more of the founder's personal attention.",
      },
      {
        q: "What is the difference between a fractional COO and a part-time COO?",
        a: 'In practice, very little. "Part-time COO" usually describes the same arrangement: a senior operator working a fixed slice of the week. "Fractional" emphasizes that the executive typically serves more than one company at a time and is engaged for a defined scope, not employed. If you are evaluating candidates, ignore the label and ask the question that actually separates operators from advisors: tell me about a system you personally built and what happened to it after you left.',
      },
    ],
    ctaText:
      "Not sure whether your bottleneck is operations or something upstream of it? The five-minute AI Revenue Scan will show you where your revenue engine actually stands.",
    ctaButtonLabel: "Get the Free Scan",
    ctaUrl: "/scorecard",
  },

  "net-revenue-retention": {
    slug: "net-revenue-retention",
    pageType: "competency",
    title: "Net Revenue Retention: The One Number That Shows Whether Growth Is Real",
    // Dek override (Rider B, approved by Bradley 2026-07-15): the on-page subhead
    // carries the title tag's hook clause only, never repeating the H1 term. The
    // title tag itself is unchanged. Same rule the Wave 1 remaining-six batch
    // applies to every new dek.
    subhead: "The One Number That Shows Whether Growth Is Real",
    metaDescription:
      "Net revenue retention tells you what your revenue would do if you never signed another client. Here is the formula, the benchmarks, and how to fix a leak.",
    url: NRR_URL,
    ogImage: "https://modernbizops.com/og/og-learn-net-revenue-retention.png",
    lastUpdated: "2026-07-14",
    h1: "Net Revenue Retention",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      { name: "Net Revenue Retention", url: NRR_URL },
    ],
    faq: [
      {
        q: "How do you calculate net revenue retention?",
        a: "Divide the current recurring revenue of the customers you had 12 months ago by their recurring revenue 12 months ago, then multiply by 100. Exclude every customer signed inside the window. A cohort you started with at $100,000 a month that now bills $103,000 a month, after all churn, downgrades, and expansion, is 103% NRR.",
      },
      {
        q: "What is the difference between gross revenue retention and net revenue retention?",
        a: "GRR excludes expansion; NRR includes it. GRR caps at 100% and measures pure keep-rate. NRR can exceed 100% and measures whether your base grows on its own. The gap between them tells you how dependent your growth is on upsells versus how much you are quietly losing underneath them.",
      },
      {
        q: "What does 120% net revenue retention mean?",
        a: "It means the customers you had a year ago now generate 20% more revenue than they did then, with churn already subtracted. Your business would have grown 20% this year without one new customer. Numbers like that are the domain of top-decile enterprise software companies; for a founder-led business, anything sustainably above 105% is excellent.",
      },
      {
        q: "What is a good net revenue retention rate?",
        a: "Around 100% is the private-company norm: SaaS Capital's 2025 survey shows a median of 102% for companies with mid-sized annual contracts, with the top quartile at 111%. Direction matters as much as level. An NRR that has moved from 92% to 97% over two years reflects a business fixing the right things; a 110% propped up by two whale accounts is riskier than it looks.",
      },
    ],
    ctaText:
      "Retention is one of the competencies the five-minute AI Revenue Scan measures. Find out whether your growth is compounding or leaking.",
    ctaButtonLabel: "Get the Free Scan",
    ctaUrl: "/scorecard",
    // Standalone DefinedTerm: this page covers competency #30 (Net Revenue
    // Retention Management, Stage 3), but no Stage 3 hub exists yet, so there
    // is no DefinedTermSet to join. Add inDefinedTermSetUrl (and re-point the
    // body's maturity-model link) if/when a Stage 3 hub ships.
    definedTerm: {
      name: "Net Revenue Retention",
      description:
        "The percentage of last year's revenue you kept from last year's customers, after churn, downgrades, and expansion are all counted.",
    },
  },

  "marketing-and-sales-alignment": {
    slug: "marketing-and-sales-alignment",
    pageType: "article",
    title: "Marketing and Sales Alignment: One Definition of a Real Opportunity",
    // Dek override (Rider B, approved by Bradley 2026-07-15): hook clause only,
    // no H1 repetition. Title tag unchanged.
    subhead: "One Definition of a Real Opportunity",
    metaDescription:
      "One written definition of a qualified lead, a handoff both sides honor, and an SLA with teeth. The founder-sized version of marketing and sales alignment.",
    url: ALIGNMENT_URL,
    ogImage: "https://modernbizops.com/og/og-learn-marketing-and-sales-alignment.png",
    lastUpdated: "2026-07-14",
    h1: "Marketing and Sales Alignment",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      { name: "Marketing and Sales Alignment", url: ALIGNMENT_URL },
    ],
    faq: [
      {
        q: "What is alignment in marketing?",
        a: 'For marketing specifically, alignment means being measured against outcomes sales actually values, qualified pipeline and closed revenue per the shared definition, instead of raw lead volume. A marketing team graded on volume alone is structurally incentivized to lower the qualification bar, which is how "we hit our number" and "the leads are junk" end up both being true in the same quarter.',
      },
      {
        q: "What are the four types of sales and marketing alignment?",
        a: "The common framing splits alignment into strategic (shared goals), process (handoffs and SLAs), data (one set of definitions and dashboards), and cultural (the teams actually talk). The framing is fine, but the order matters more than the taxonomy: data and process alignment are buildable this quarter and make the cultural part largely take care of itself. Culture-first alignment programs fail because goodwill cannot survive two scoreboards.",
      },
      {
        q: "What is a sales and marketing SLA?",
        a: "A written, mutual commitment: marketing delivers an agreed volume of leads meeting the shared qualification definition, and sales responds to every one inside an agreed window and returns the misses with reason codes. Both halves are tracked in the CRM where violations are visible. One-directional SLAs (all obligations on marketing, none on sales, or the reverse) are the most common failure mode; the mutuality is what makes it an agreement instead of a demand.",
      },
      {
        q: "How do you measure marketing and sales alignment?",
        a: "Three numbers, all from your CRM. Lead acceptance rate: what share of handed-off leads does sales formally accept? Lead response time: how long does an accepted lead wait for first contact, measured against the SLA? MQL-to-SQL conversion rate: what share of marketing-qualified leads become sales-qualified opportunities? If those three are healthy and trending up, the teams are aligned regardless of how the meetings feel.",
        // Rider A: the MQL-to-SQL mention becomes a live link now that
        // /learn/mql-to-sql-conversion-rate has shipped (pre-announced in that
        // page's own internal-links summary). aLinks linkifies the phrase in the
        // rendered accordion; the plain-string `a` above stays the source of
        // truth for the FAQPage JSON-LD.
        aLinks: [
          {
            text: "MQL-to-SQL conversion rate",
            href: "/learn/mql-to-sql-conversion-rate",
          },
        ],
      },
    ],
    ctaText:
      "Marketing-sales alignment is one of the competencies the five-minute AI Revenue Scan measures. Find out where your handoff actually leaks.",
    ctaButtonLabel: "Get the Free Scan",
    ctaUrl: "/scorecard",
  },

  // ---- Wave 1 remaining-six batch (keyword-validated content plan) ---------
  // Six more pillar-map pages closing out Wave 1. Pages with pageType "article"
  // carry Article schema; revenue-per-employee and win-loss-analysis cover
  // Stage 3 competencies with no Stage 3 hub yet, so they are standalone
  // DefinedTerm pages (no inDefinedTermSet), matching net-revenue-retention.

  "what-is-revops": {
    slug: "what-is-revops",
    pageType: "article",
    title: "What Is RevOps? Revenue Operations, Explained for Founders",
    // Dek carries the title tag's hook clause only, never repeating the H1
    // (Bradley's 2026-07-15 correction, applied to the whole batch).
    subhead: "Revenue Operations, Explained for Founders",
    metaDescription:
      "RevOps is the discipline of running marketing, sales, and service as one revenue machine. What it is, whether your business needs it, and where to start.",
    url: WHAT_IS_REVOPS_URL,
    ogImage: "https://modernbizops.com/og/og-learn-what-is-revops.png",
    lastUpdated: "2026-07-15",
    h1: "What Is RevOps?",
    byline: BYLINE,
    // Breadcrumb crumb is the question form "What Is RevOps?", matching the H1
    // (a first for the pilot; deliberate, per the draft note).
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      { name: "What Is RevOps?", url: WHAT_IS_REVOPS_URL },
    ],
    faq: [
      {
        q: "What is the difference between sales ops and RevOps?",
        a: "Sales operations serves one department: it manages the tools, reporting, and process for the sales team specifically. Revenue operations spans marketing, sales, and customer service as one system, because the expensive problems (leads dropped at handoff, churn nobody saw coming, marketing optimizing for a lead definition sales ignores) live between departments where a sales ops role has no mandate. In a founder-led company the distinction matters less than the principle: whoever owns this must be able to change how all three functions work, not just one.",
      },
      {
        q: "Who does RevOps usually report to?",
        a: "In larger companies, RevOps typically reports to a chief revenue officer or directly to the CEO, because it needs authority over marketing, sales, and service simultaneously. In a founder-led business the honest answer is that it reports to you, at least at first. The function needs the founder's authority to change cross-department behavior. Once the system is built and documented, ownership can move to an operator you trust, which is exactly why promoting and developing someone internal often beats hiring the title from outside.",
      },
      {
        q: "What is the difference between a CRM and RevOps?",
        a: "A CRM is a tool; RevOps is the discipline that makes the tool mean something. A CRM full of stale records, skipped fields, and stages nobody defined is the single most common symptom of missing revenue operations. Buying or re-implementing a CRM does not fix that, which is why so many companies have paid for two or three implementations and still do not trust their pipeline report. Fix the definitions and the process first; the CRM then records reality instead of decorating it.",
      },
    ],
    ctaText:
      "The fastest way to find out whether you have a RevOps problem is to measure it. The five-minute AI Revenue Scan benchmarks your revenue engine against businesses like yours and shows where the biggest leak is.",
    ctaButtonLabel: "Get the Free Scan",
    ctaUrl: "/scorecard",
  },

  "revenue-per-employee": {
    slug: "revenue-per-employee",
    pageType: "article",
    title: "Revenue Per Employee: The Number That Says Whether You Can Grow Without Hiring",
    subhead: "The Number That Says Whether You Can Grow Without Hiring",
    metaDescription:
      "Revenue per employee benchmarks by industry, the formula and its traps, and the part most guides skip: how to actually improve the number without cutting people.",
    url: RPE_URL,
    ogImage: "https://modernbizops.com/og/og-learn-revenue-per-employee.png",
    lastUpdated: "2026-07-15",
    h1: "Revenue Per Employee",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      { name: "Revenue Per Employee", url: RPE_URL },
    ],
    faq: [
      {
        q: "What is a good revenue per employee ratio?",
        a: "It depends almost entirely on your business model. Private B2B SaaS companies report a median around $130,000 per employee; professional services firms typically run $150,000 to $300,000; retail runs far lower. The cross-industry average of roughly $350,000 is skewed by capital-intensive sectors and is not a realistic target for a founder-led company. Benchmark against your own model and your own trend, not against a blended average.",
      },
      {
        q: "How do you calculate revenue per employee?",
        a: "Divide trailing twelve-month gross revenue by your current employee count. A $6M business with 30 employees runs $200,000 per employee. Use full-time equivalents if you carry meaningful part-time staff, decide explicitly whether contractors count, and then apply the same rules every period so the trend stays honest.",
      },
      {
        q: "How do you use revenue per employee?",
        a: "Three ways. As a trend: is the business getting more or less efficient as it grows? As a hiring test: before adding headcount, ask what the number says about how well the current team's capacity is being converted to revenue. And as a planning anchor: next year's revenue target divided by a realistic revenue-per-employee figure implies the team size needed to hit it, which turns the hiring plan into arithmetic finance can check.",
      },
      {
        q: "Is $300,000 revenue per employee good?",
        a: "For most founder-led B2B companies, yes, comfortably above typical. It is around the top of the professional services range and more than double the private SaaS median. Whether it is good for you depends on your model and your margins: $300,000 per employee with healthy gross margin is an efficient machine, while the same number achieved by running a skeleton crew at the edge of burnout is a risk, not an achievement.",
      },
    ],
    ctaText:
      "The AI Revenue Scan puts this exact number on your business, benchmarks it against named public data for your business model, and shows the dollar gap between you and peer efficiency. Five minutes, fifteen questions.",
    ctaButtonLabel: "Get the Free Scan",
    ctaUrl: "/scorecard",
    // Article, not DefinedTerm: this is an AEO/keyword pillar page (per the
    // keyword-research plan), not a glossary term in the maturity model. The
    // body still discusses revenue-per-employee efficiency as a Stage 3
    // competency in prose, which is a different thing from the page declaring
    // itself a DefinedTerm to crawlers.
  },

  "smarketing": {
    slug: "smarketing",
    pageType: "article",
    title: "Smarketing: When Marketing and Sales Stop Grading Their Own Homework",
    subhead: "When Marketing and Sales Stop Grading Their Own Homework",
    metaDescription:
      "Smarketing means sales and marketing run as one team with one scoreboard. What the term means, why the usual version fails, and the founder-sized way to build it.",
    url: SMARKETING_URL,
    ogImage: "https://modernbizops.com/og/og-learn-smarketing.png",
    lastUpdated: "2026-07-15",
    h1: "Smarketing",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      { name: "Smarketing", url: SMARKETING_URL },
    ],
    faq: [
      {
        q: "What is the meaning of smarketing?",
        a: 'Smarketing combines "sales" and "marketing" into one word to describe running the two functions as a single revenue team: shared goals, a shared definition of a qualified lead, and shared accountability for revenue rather than separate departmental metrics. The name is marketing-speak, but the underlying discipline is real and measurable.',
      },
      {
        q: "What is a smarketer?",
        a: "Informally, someone who works across both functions or is measured on both outcomes. In practice, founder-led companies rarely need a person with the title; they need both existing teams bound to one definition and one scoreboard. The role matters less than the rules.",
      },
      {
        q: "What is a marketing qualified lead?",
        a: "A marketing qualified lead (MQL) is a lead that meets the criteria marketing and sales agreed indicate real buying potential: typically a fit test (right industry, size, and role) plus an intent signal (a demo request, a pricing page visit, a downloaded diagnostic). The definition only works if it is written, observable, and shared. An MQL defined by marketing alone is a volume target wearing a qualification badge, which is exactly the failure smarketing exists to prevent.",
      },
    ],
    ctaText:
      "One shared scoreboard starts with knowing where the handoff leaks today. The five-minute AI Revenue Scan measures marketing-sales alignment as one of the competencies it scores.",
    ctaButtonLabel: "Get the Free Scan",
    ctaUrl: "/scorecard",
  },

  "mql-to-sql-conversion-rate": {
    slug: "mql-to-sql-conversion-rate",
    pageType: "article",
    title: "Your MQL to SQL Conversion Rate Shows Exactly Where the Handoff Breaks",
    // Dek is a deliberate light rephrase of the title (this title embeds the
    // term mid-sentence, so a clean suffix strip was not possible), per the
    // 2026-07-15 draft note. Still hook-only, still no H1 repetition.
    subhead: "Exactly Where the Marketing-to-Sales Handoff Breaks",
    metaDescription:
      "The MQL to SQL conversion rate averages around 13%. The formula, the benchmarks, and how to read your number as a diagnosis of where marketing-to-sales breaks.",
    url: MQL_SQL_URL,
    ogImage: "https://modernbizops.com/og/og-learn-mql-to-sql-conversion-rate.png",
    lastUpdated: "2026-07-15",
    h1: "MQL to SQL Conversion Rate",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      { name: "MQL to SQL Conversion Rate", url: MQL_SQL_URL },
    ],
    faq: [
      {
        q: "What is a good MQL to SQL conversion rate?",
        a: "Cross-industry averages land around 13%, with most industries falling between 10% and 26%. Above roughly 20% with a genuinely strict SQL definition is strong. But the number is only comparable against your own history: a rising rate on a stable MQL definition means the handoff is improving, while a high rate achieved by marketing sending only the most obvious leads may just mean you are under-generating.",
      },
      {
        q: "How do you calculate MQL to SQL conversion rate?",
        a: "Divide the number of SQLs by the number of MQLs from the same period and multiply by 100. If 200 marketing qualified leads produced 30 sales qualified leads, the conversion rate is 15%. The calculation is trivial; the work is having clean definitions of each stage and timestamps in the CRM so the two counts mean something.",
      },
      {
        q: "What is MQL to SQL conversion?",
        a: "It is the moment a lead stops being marketing's claim and becomes sales' commitment: a marketing qualified lead (fits the profile, showed intent) is reviewed by sales and either accepted as a sales qualified lead worth active pursuit or returned with a reason. Companies that make this an explicit step with reason codes turn their funnel's biggest leak into their best diagnostic data.",
      },
    ],
    ctaText:
      "The Revenue Maturity Playbook walks through building the shared definitions, handoff, and SLA this page describes, stage by stage, with a self-assessment to locate where your funnel stands today.",
    ctaButtonLabel: "Get the Revenue Maturity Playbook",
    ctaUrl: "/playbook",
  },

  "involuntary-churn": {
    slug: "involuntary-churn",
    pageType: "article",
    title: "Involuntary Churn: The Customers You Lose Without Anyone Deciding to Leave",
    subhead: "The Customers You Lose Without Anyone Deciding to Leave",
    metaDescription:
      "Involuntary churn is revenue lost to failed payments, not decisions. What causes it, why it is 20-40% of total churn, and how to recover it without new software.",
    url: INVOLUNTARY_CHURN_URL,
    ogImage: "https://modernbizops.com/og/og-learn-involuntary-churn.png",
    lastUpdated: "2026-07-15",
    h1: "Involuntary Churn",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      { name: "Involuntary Churn", url: INVOLUNTARY_CHURN_URL },
    ],
    faq: [
      {
        q: "What does involuntary churn mean?",
        a: "Involuntary churn, sometimes called passive or accidental churn, is the loss of a paying customer through payment failure rather than through a decision to cancel. An expired card, a bank decline, or an unpaid renewal invoice ends the relationship without the customer choosing to leave, and often without them noticing.",
      },
      {
        q: "What are the two types of churn?",
        a: "Voluntary churn is a customer deciding to leave, which signals a problem with product, service, pricing, or fit. Involuntary churn is a customer being dropped by a billing failure they never chose. The distinction matters because the fixes have nothing in common: one is a customer-experience project, the other is billing operations, and you cannot pick the right fix until you split your churn number into the two types.",
      },
      {
        q: "How do you reduce involuntary churn?",
        a: "In order: measure it separately from voluntary churn; prevent the preventable with pre-expiry notifications and automatic card updates (or auto-charge billing for retainers); then recover failed payments quickly with a retry schedule and a short payment-update email sequence, since 90% of what gets recovered is recovered within ten days. Most billing platforms already include these features; the work is turning them on and watching the recovery rate, not buying new software.",
      },
    ],
    ctaText:
      "Retention is one of the competencies the five-minute AI Revenue Scan measures. Find out whether your growth is compounding or quietly leaking through billing.",
    ctaButtonLabel: "Get the Free Scan",
    ctaUrl: "/scorecard",
  },

  "win-loss-analysis": {
    slug: "win-loss-analysis",
    pageType: "article",
    title: "Win/Loss Analysis: Find Out Why You Actually Win Deals (It Is Rarely Price)",
    subhead: "Find Out Why You Actually Win Deals (It Is Rarely Price)",
    metaDescription:
      "Win/loss analysis is asking buyers why deals were really won or lost. Why your CRM's closed-lost data lies, and the founder-sized version that needs no program.",
    url: WIN_LOSS_URL,
    ogImage: "https://modernbizops.com/og/og-learn-win-loss-analysis.png",
    lastUpdated: "2026-07-15",
    h1: "Win/Loss Analysis",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      { name: "Win/Loss Analysis", url: WIN_LOSS_URL },
    ],
    faq: [
      {
        q: "How do you do a win/loss analysis?",
        a: "Start with your own data: pull the last quarter's closed deals and code each with a specific reason, not an outcome. Then interview a balanced sample of the buyers themselves, five wins and five losses is plenty at founder-led volume, using open questions about the alternatives they weighed and where their confidence moved. Aggregate quarterly, look for themes rather than anecdotes, and change one concrete thing (a qualification criterion, a stage definition, a piece of positioning) per cycle.",
      },
      {
        q: "What is a good win loss ratio?",
        a: "For qualified B2B opportunities, win rates in the 20% to 40% range are common, but the blended number matters less than its segments and its trend. A 45% win rate on tiny deals with a 10% rate in your target segment is a worse business than the reverse. Fix the denominator first (only qualified opportunities count), track the number by competitor and segment, and judge yourself against your own trailing quarters.",
      },
      {
        q: "What is a good sales win rate?",
        a: "Same answer with the same caveat: the denominator defines the number. A team that qualifies hard will show a higher win rate on fewer deals; a team that logs every conversation as pipeline will show a low one. That is why comparing win rates across companies is mostly noise. Compare within: this quarter against last, this segment against that, with a stable definition of what counts as an opportunity.",
      },
    ],
    ctaText:
      "The Revenue Maturity Playbook covers the qualification, pipeline, and analysis competencies this page draws on, with a self-assessment to show which one is your bottleneck right now.",
    ctaButtonLabel: "Get the Revenue Maturity Playbook",
    ctaUrl: "/playbook",
    // Article, not DefinedTerm: this is an AEO/keyword pillar page (per the
    // keyword-research plan), not a glossary term in the maturity model. The
    // body still discusses win/loss analysis as a Stage 3 competency in prose,
    // which is a different thing from the page declaring itself a DefinedTerm
    // to crawlers.
  },

  // ---- Wave 2: fractional-COO cluster, MOFU cost-comparison page -----------
  // The deciding-stage companion to /learn/fractional-coo. Article schema, no
  // DefinedTerm (a comparison/pillar-map page, not a maturity competency).
  //
  // Two CTAs, not one, so this entry sets inlineCtas: the body renders the
  // scorecard CTA mid-page (learn_mid_page) and the book CTA at the foot
  // (learn_foot) at their source positions, and LearnPageShell skips its
  // default closing card. ctaButtonLabel/ctaUrl still record the primary
  // (scorecard) destination, plain and UTM-free.
  "fractional-coo-cost": {
    slug: "fractional-coo-cost",
    pageType: "article",
    title:
      "Fractional COO Cost: What You Pay, What You Get, and When You Do Not Need One",
    // Dek carries the title tag's hook clause only, never repeating the H1
    // (the standing dek rule for this library).
    subhead: "What you pay, what you get, and when you do not need one",
    metaDescription:
      "A fractional COO costs $3,000 to $20,000 a month. But the real question is whether you need one at all. A straight comparison of four ways to fix operations, including the one the other cost guides leave out.",
    url: FRACTIONAL_COO_COST_URL,
    ogImage: "https://modernbizops.com/og/og-learn-fractional-coo-cost.png",
    lastUpdated: "2026-07-22",
    h1: "Fractional COO Cost",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      { name: "Fractional COO Cost", url: FRACTIONAL_COO_COST_URL },
    ],
    faq: [
      {
        q: "What does a fractional COO charge?",
        a: "A fractional COO typically charges $3,000 to $20,000 a month, most commonly $5,000 to $15,000 for ten to twenty hours a week. Hourly rates run from $150 to $500, with most experienced operators between $200 and $350. Some structure engagements as fixed project fees instead, usually $10,000 to $50,000 for a defined piece of work. The wide range comes down to hours, seniority, and how much of the operation they are actually responsible for.",
      },
      {
        q: "How much does a fractional COO cost per month compared to a full-time COO?",
        a: "A fractional COO at the common range costs $60,000 to $180,000 a year. A full-time COO carries a base salary of roughly $150,000 to $255,000, total compensation that reaches $277,000 to $298,000, and an all-in first-year cost above $400,000 once you add recruiting, benefits, and equity. So a fractional COO is roughly a fifth to a third of the cost of a full-time hire, which is the entire pitch. The question the pitch skips is whether you need an executive at all, or an internal owner you can coach.",
      },
      {
        q: "How many hours does a fractional COO work, and how long do engagements last?",
        a: "Most fractional COOs work eight to twenty hours a week, and most engagements run from six months to two years. Some companies keep one indefinitely as a permanent part-time leadership arrangement. Others use one to build operational foundations before hiring full-time, or before handing the work to an internal person. The length matters for cost, because a fractional COO is a recurring monthly expense for as long as you keep them.",
      },
      {
        q: "When do you not need a fractional COO?",
        a: "You do not need a fractional COO when you have a capable person internally who could own operations with the right guidance, when what you actually need is durable systems rather than temporary executive leadership, or when the job is narrower than a whole COO, like building the systems in one function. In those cases, promoting someone and coaching them to build the systems leaves you with a capability that stays, instead of a retainer that has to keep running for the value to continue.",
      },
    ],
    // Body owns both CTAs (see comment above); the shell skips its default card.
    inlineCtas: true,
    ctaButtonLabel: "Get the Free Scan",
    ctaUrl: "/scorecard",
  },

  // ---- Wave 2: AI cluster (TOFU 4.1 + MOFU 4.2) ---------------------------
  // Two editorial how-to pages under /learn, Article schema (not maturity
  // competencies, so no DefinedTerm). 4.1 feeds 4.2 feeds the root-level BOFU
  // page /ai-consulting-for-small-business (built separately, off-nav). The
  // third page is deliberately NOT in this registry.
  "ai-for-small-business": {
    slug: "ai-for-small-business",
    pageType: "article",
    title:
      "AI for Small Business: What Actually Works When You Have Real Customers",
    // Dek carries the title tag's hook clause only, never repeating the H1.
    subhead: "What actually works when you have real customers",
    metaDescription:
      "AI for small business, minus the hype. What actually works once you have real customers and revenue, why fundamentals come first, and one move to run this week.",
    url: "https://modernbizops.com/learn/ai-for-small-business",
    ogImage: "https://modernbizops.com/og/og-learn-ai-for-small-business.png",
    lastUpdated: "2026-07-22",
    h1: "AI for Small Business",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      {
        name: "AI for Small Business",
        url: "https://modernbizops.com/learn/ai-for-small-business",
      },
    ],
    faq: [
      {
        q: "How can AI be used for small businesses?",
        a: "The most valuable use is not content generation. It is reading your own data. Export your closed deals and let an AI assistant find what your best customers have in common, so you can sell to more of them and stop selling to the ones who churn. AI is also strong at drafting, summarizing calls, and enrichment, but those are accelerators. Start with a decision, not a caption. And remember the rule: AI amplifies the operational state it is applied to. Apply it to a clean process and it helps. Apply it to a broken one and it scales the break.",
      },
      {
        q: "Which AI is best for small business owners?",
        a: "For most owners with real customers, the best first tool is a general AI assistant you probably already pay for, such as Claude, ChatGPT Enterprise, or Grok, paired with an export from your CRM. That combination reads your data and answers real business questions without a new subscription. Category-specific tools inside your CRM, like HubSpot's Breeze or Salesforce's AI features, are worth it once you have proven the process by hand and need to scale it. Buy the specialist tool second, not first.",
      },
      {
        q: "How do I use AI to run my small business?",
        a: "Run it on fundamentals you already have, in order. Pick one process that already works, such as lead follow-up or your ideal customer profile, and use AI to make it faster and more consistent. Do not start by automating something that is undefined or broken, because you will just get broken results faster. If a process only lives in someone's head, write it down before you point AI at it. AI runs a business well only when there is a real system underneath for it to run.",
      },
      {
        q: "Which AI tool is best for small business marketing and sales?",
        a: "There is no single answer, and anyone who gives you one is selling something. The right tool depends on what you already use and what fundamental you are trying to scale. For sales, a clear ideal customer profile drives results: research on AI-assisted ICP work links clear profiles to meaningfully higher win rates, which you can read about in Sybill's ICP guide. The tool matters far less than whether the profile it runs on is any good. Fix the input first.",
        // The Sybill citation is an outbound link. aLinks linkifies the exact
        // phrase in the rendered accordion (as a new-tab, rel=noopener anchor
        // because the href is http) while the plain-string `a` above stays the
        // source of truth for the FAQPage JSON-LD.
        aLinks: [
          {
            text: "Sybill's ICP guide",
            href: "https://www.sybill.ai/blogs/icp-guide",
          },
        ],
      },
    ],
    ctaText:
      "The first step is honest and free. Find out what stage you are at, so you know whether AI is your next move or a distraction from the fundamental you skipped.",
    ctaButtonLabel: "See your stage with the Free Scan",
    ctaUrl: "/scorecard",
  },

  "ai-tools-for-small-business": {
    slug: "ai-tools-for-small-business",
    pageType: "article",
    title: "AI Tools for Small Business: The Stack a Real Business Can Run",
    // Dek carries the title tag's hook clause only, never repeating the H1.
    subhead: "The stack a real business can run, once the fundamentals do",
    // Replaced 2026-08-12 with the string approved in the step-16 retarget
    // handoff (148 chars). The old one led on "revenue-ops", which the noun map
    // demoted; the title and H1 are untouched, as that handoff requires.
    metaDescription:
      "Not another tool list. An AI stack organized by the revenue job it does, with a DIY track for tools you already pay for and the honest cost of each.",
    url: "https://modernbizops.com/learn/ai-tools-for-small-business",
    ogImage:
      "https://modernbizops.com/og/og-learn-ai-tools-for-small-business.png",
    lastUpdated: "2026-07-22",
    h1: "AI Tools for Small Business",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      {
        name: "AI Tools for Small Business",
        url: "https://modernbizops.com/learn/ai-tools-for-small-business",
      },
    ],
    faq: [
      {
        q: "How can I use AI in my small business?",
        a: "Start with one job, not one tool. Pick the revenue task that is costing you the most right now (dirty CRM, slow lead follow-up, a forecast you do not trust) and fix the underlying process by hand first. Then run the free DIY version with an assistant you already pay for, using an export of your own data. Only once that works do you automate it with a named tool. Doing it in that order is the difference between AI that sticks and a subscription you cancel in three months. AI amplifies the state you point it at, so get the state right first.",
      },
      {
        q: "What is the 30% rule for AI?",
        a: 'You will see the "30% rule" used a few ways online, usually some version of "expect AI to handle about 30% of a task and keep a human on the rest." I would not anchor on a specific number. The useful principle underneath it is real: AI is an accelerator on top of a defined process, not a replacement for one. It handles the repetitive middle of a job well and the judgment at the edges poorly. Keep a human on the definition, the exit criteria, and the exceptions. Let the AI handle the volume in between.',
      },
      {
        q: "What are the 5 things AI cannot do?",
        a: "For a revenue operation, the honest list is: it cannot define your ideal customer for you, it cannot decide what your pipeline stages mean, it cannot set your qualification criteria, it cannot own accountability when a call is wrong, and it cannot build the discipline to run the system every month. Those are all human fundamentals. AI executes brilliantly on top of them and produces confident garbage without them. That is not a knock on AI. It is the reason the fundamentals come first.",
      },
      {
        q: "What are the most popular AI tools for a B2B revenue team?",
        a: "The names that keep coming up for founder-led B2B in 2026 are a general assistant (Claude, ChatGPT Enterprise, or Grok) for the DIY work, HubSpot's MCP server or Salesforce Agentforce for CRM actions, Clay or Breeze Intelligence for enrichment, Sybill for ICP and conversation intelligence, 11x or Artisan for inbound qualification, and Gong or Clari for pipeline and forecast. But \"most popular\" is the wrong filter. The right filter is which fundamental each one sits on top of, and whether that fundamental exists yet in your business. A popular tool on a broken process is still a broken process.",
      },
    ],
    // This page owns two CTAs (scorecard mid-body, playbook at the foot), so the
    // shell skips its default card. The primary fields record the playbook
    // destination, plain and UTM-free.
    inlineCtas: true,
    ctaButtonLabel: "Get the Revenue Growth Playbook",
    ctaUrl: "/playbook",
  },

  // ---- Wave 4: retention, subscription-recovery, lifecycle, conversion -----
  // Five editorial /learn pages, all Article schema (not maturity competencies,
  // so no DefinedTerm). 2.3 and 2.4 stack as strategy to execution and
  // cross-link; 6.1 links to 2.3. Each carries exactly one outbound citation and
  // one plain, UTM-free CTA tracked via cta_click (learn_mid_page) by the shell.
  "customer-retention-strategy": {
    slug: "customer-retention-strategy",
    pageType: "article",
    title: "Customer Retention Strategy: Keep the Revenue You Already Won",
    subhead: "Keep the Revenue You Already Won",
    metaDescription:
      "A customer retention strategy for founder-led B2B, built as a revenue system, not a loyalty program. How to measure it, where the leaks are, and what to fix first.",
    url: CUSTOMER_RETENTION_STRATEGY_URL,
    ogImage:
      "https://modernbizops.com/og/og-learn-customer-retention-strategy.png",
    lastUpdated: "2026-07-23",
    h1: "Customer Retention Strategy",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      { name: "Customer Retention Strategy", url: CUSTOMER_RETENTION_STRATEGY_URL },
    ],
    faq: [
      {
        q: "What is the 80/20 rule in customer retention?",
        a: "It is the observation that a minority of your customers, often around 20%, generate the majority of your revenue and nearly all of your profit. For retention, the rule is not trivia, it is where the strategy starts: segment your accounts by what they are actually worth, then put your real relationship effort, your named owners, and your scheduled reviews on the accounts that carry the company. Treating a $2,000 account and a $200,000 account with the same playbook is how founder-led businesses end up overserving customers who will never grow and underserving the ones who pay the bills.",
      },
      {
        q: "What are the three R's of customer retention?",
        a: "The common framing is retention, related sales, and referrals: keep the customer, grow what they buy, and turn them into a source of new customers. It traces back to Fred Reichheld's loyalty research, and the order matters. You cannot expand or earn referrals from a customer who is quietly unhappy, so the retention work (onboarding to real value, watching health signals, intervening early) comes first. The related sales and referrals are what a retained, successful customer produces on their own once the base is solid.",
      },
      {
        q: "What is the difference between a customer retention strategy and a customer retention marketing strategy?",
        a: "A retention marketing strategy is the communication layer: the emails, campaigns, and content you use to stay useful to existing customers and bring quiet ones back. It is one instrument in the larger system. A customer retention strategy is the whole operating model: how post-sale is owned, how you measure retention in dollars, how you spot and rescue at-risk accounts, and how expansion happens. For a founder-led B2B company, the marketing layer matters far less than the operating model. A great win-back email cannot save an account that never got to first value, and no campaign fixes a churn number nobody has decomposed.",
      },
      {
        q: "What are the 8 C's of customer retention?",
        a: "Various marketing lists frame retention as some number of C-words (communication, convenience, consistency, and so on). They are fine as reminders and useless as a plan, because they describe qualities, not a system with owners and numbers. For a founder-led B2B company, skip the acronym and build the three things that actually move retention: a fast, repeatable path to first value, a small set of account-health signals somebody watches, and a named owner on every account that would hurt to lose. That is the whole model, and none of it fits neatly under a letter.",
      },
    ],
    ctaText:
      "The Revenue Maturity Playbook goes deep on the retention stage, including the account-health signals and the post-sale operating rhythm. It is the next step if you are ready to build the system, not just read about it.",
    ctaButtonLabel: "Get the Revenue Maturity Playbook",
    ctaUrl: "/playbook",
  },

  "reduce-customer-churn": {
    slug: "reduce-customer-churn",
    pageType: "article",
    title: "Reduce Customer Churn Before It Shows Up in the Forecast",
    subhead: "Catch It While You Can Still Change the Outcome",
    metaDescription:
      "Most churn is decided months before the cancellation. How to reduce customer churn by catching at-risk accounts early, measuring it in revenue, and fixing the root cause.",
    url: REDUCE_CUSTOMER_CHURN_URL,
    ogImage: "https://modernbizops.com/og/og-learn-reduce-customer-churn.png",
    lastUpdated: "2026-07-23",
    h1: "Reduce Customer Churn",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      { name: "Reduce Customer Churn", url: REDUCE_CUSTOMER_CHURN_URL },
    ],
    faq: [
      {
        q: "How can customer churn be reduced?",
        a: "By moving your attention earlier in the account's life. Reducing churn is less about a great cancellation-day save and more about three habits: measure churn in revenue and split it into voluntary (a fit or value problem) and involuntary (a billing problem); watch a small set of account-health signals so someone reaches out before the renewal, not after; and log the real reason on every account you lose so you fix the root cause instead of running the same save play forever. For a founder-led company, the win is that this is a system one or two people can run, not a customer-success department you cannot afford yet.",
      },
      {
        q: "What does a 20% churn rate mean?",
        a: "It means that over the period you are measuring, you lost 20% of what you started with, either 20% of your customers or 20% of your revenue, depending on which you are counting. The distinction is not academic. Twenty percent logo churn concentrated in your smallest accounts is survivable; 20% revenue churn means one in every five dollars of your base walked out the door and every new deal you close spends its first stretch just refilling the hole. Always calculate churn in revenue before you decide how alarmed to be, because the customer count can look calm while the dollars are bleeding.",
      },
      {
        q: "How do you reduce churn in the first 30 days?",
        a: "The first 30 days is an onboarding problem, not a retention problem, and it is the highest-leverage window you have. The goal is time to first value: get the customer to the specific result they bought as fast as possible, because a customer who has felt the value has a reason to stay and a customer who has not does not. Map the exact path from purchase to first win, remove the steps where new customers stall, and do not let that path depend on which account manager happened to catch the account. Most churn that surfaces much later was actually set in motion in these first few weeks.",
      },
      {
        q: "Can customer churn be prevented?",
        a: "Some of it, entirely, and the rest can be reduced a lot. Involuntary churn from failed payments is largely preventable with better billing hygiene, since the customer never chose to leave. Voluntary churn cannot be driven to zero (some customers outgrow you, go out of business, or genuinely are a bad fit, and chasing those is wasted effort), but the share that comes from customers who never reached value, or who slipped away quietly while nobody was watching, is very reducible. The realistic goal is not zero churn. It is catching the preventable churn early enough to change the outcome, and being honest about the churn you should let go.",
      },
    ],
    ctaText:
      "If you want help building the early-warning system and fixing the root causes instead of reading about them, book a free discovery call. I coach your team to build it, so the system stays after I am gone.",
    ctaButtonLabel: "Book a Free Discovery Call",
    ctaUrl: "/book",
  },

  "payment-recovery": {
    slug: "payment-recovery",
    pageType: "article",
    title:
      "Payment Recovery: What to Fix in Your Billing Before You Buy Software for It",
    subhead: "What to Fix in Your Billing Before You Buy Software for It",
    metaDescription:
      "Payment recovery for founder-led B2B: the difference between dunning and debt collection, what your billing platform already does, and when recovery software is actually worth it.",
    url: PAYMENT_RECOVERY_URL,
    ogImage: "https://modernbizops.com/og/og-learn-payment-recovery.png",
    lastUpdated: "2026-07-23",
    h1: "Payment Recovery",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      { name: "Payment Recovery", url: PAYMENT_RECOVERY_URL },
    ],
    faq: [
      {
        q: "What is dunning management?",
        a: "Dunning management is the automated process of recovering a failed recurring payment: the sequence of retries and reminder emails that fire when a customer's card is declined or expires, so the subscription does not silently lapse. Good dunning also includes a card-updater that refreshes expiring cards before they fail. It is built into essentially every modern billing platform, which is why the first step in payment recovery is almost always to configure the dunning you already have, not to buy a separate tool.",
      },
      {
        q: "What is the difference between dunning and debt collection?",
        a: "Dunning recovers a payment that failed for a mechanical reason from a customer who still wants the service, an expired card, a bank decline, a routine glitch. It is fast, automated, and friendly, because the customer never chose to stop paying. Debt collection is the later, more formal, more adversarial process for money that has become genuinely delinquent, often after the relationship has broken down. Confusing the two leads founder-led businesses to buy heavyweight collections software for what is really a settings problem in their billing platform.",
      },
      {
        q: "Do I need payment recovery software?",
        a: "Usually not as a first step. Before you buy anything, measure your failed-payment and unpaid-invoice dollars, then configure the retry logic, dunning emails, and card-updater already included in your billing platform, and move any invoiced retainers to auto-charge. That recovers most of what is recoverable at your transaction volume. Dedicated recovery software earns its fee mainly when your card-billed volume is high enough that a few extra points of recovery is real money and nobody on your team will manage retries closely. Buy the tool to extend a working process, not to create one.",
      },
      {
        q: "How do you recover a failed payment?",
        a: "Fast, because the window is short: about 90% of recovered payments come back within the first ten days. Set a sensible retry schedule, send a short and human sequence of payment-update emails rather than one generic notice, refresh expired cards automatically with a card-updater, and offer a pause option before any hard cancellation so a temporary problem does not become a permanent loss. For invoiced clients, the better answer is prevention: move the recurring fee to automatic card or ACH billing so the payment does not fail in the first place.",
      },
    ],
    ctaText:
      "If you want the failed-payment leak measured and the whole billing-recovery system built the right way, book a free discovery call. I coach your team to set it up, so it keeps running without me.",
    ctaButtonLabel: "Book a Free Discovery Call",
    ctaUrl: "/book",
  },

  "customer-lifecycle-marketing": {
    slug: "customer-lifecycle-marketing",
    pageType: "article",
    title:
      "Customer Lifecycle Marketing for B2B: Revenue From Customers You Already Paid to Acquire",
    subhead: "Revenue From the Customers You Already Paid to Acquire",
    metaDescription:
      "Customer lifecycle marketing for founder-led B2B is not ecommerce email flows. It is the post-sale revenue engine: onboarding to value, expansion, renewal, and advocacy.",
    url: CUSTOMER_LIFECYCLE_MARKETING_URL,
    ogImage:
      "https://modernbizops.com/og/og-learn-customer-lifecycle-marketing.png",
    lastUpdated: "2026-07-23",
    h1: "Customer Lifecycle Marketing",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      {
        name: "Customer Lifecycle Marketing",
        url: CUSTOMER_LIFECYCLE_MARKETING_URL,
      },
    ],
    faq: [
      {
        q: "What are the 5 stages of the customer lifecycle?",
        a: "The common model is awareness, conversion, onboarding and growth, retention and loyalty, and advocacy. For a B2B company each stage is longer and more relationship-driven than the consumer version: acquisition is fewer high-intent buyers, conversion is a considered multi-person purchase, onboarding is the make-or-break gap to first value, growth is account expansion, and advocacy is the referrals and case studies a successful account produces. The stages transfer; the tactics do not. What works for a shopper (cart-abandonment emails, loyalty points) is not what moves a $50,000 account through its life.",
      },
      {
        q: "What is the difference between CRM and CLM?",
        a: "CRM (customer relationship management) is the system and the data: the record of every account, contact, and interaction. CLM (customer lifecycle management or marketing) is what you do with it: engaging each account appropriately for the stage it is in. Put simply, CRM is the map and CLM is the driving. For a founder-led B2B company the two are inseparable in practice, because a lifecycle you cannot see in your CRM is a lifecycle you cannot manage, which is why CRM hygiene comes before any lifecycle-marketing ambition.",
      },
      {
        q: "Does customer lifecycle marketing work for B2B, or is it just for ecommerce?",
        a: "It fully applies to B2B, but the execution is different. The concept (engage the customer across their whole life, not just at the sale) is arguably more valuable in B2B, because your customers are fewer and worth more, so keeping and growing each one matters enormously. What does not transfer is the ecommerce toolkit of automated email flows, loyalty points, and win-back discounts. B2B lifecycle marketing is a post-sale operating system run through your CRM and your account owners: onboarding to value, expansion, renewal, and advocacy, with automation handling reminders and humans handling relationships.",
      },
      {
        q: "Where should a B2B company start with lifecycle marketing?",
        a: "Not with software. Start by drawing your actual lifecycle stages and giving every meaningful account a named owner and a defined next action, which most founder-led businesses have never done. Then make those stages visible in your CRM so you can see where each account is and how long it has been there. Only after that does automation help, and even then it should assist the predictable moments (onboarding milestones, renewals, expansion nudges) rather than replace the human relationship. Design first, instrument second, automate third.",
      },
    ],
    ctaText:
      "Curious whether your post-sale engine is compounding revenue or leaking it? The five-minute AI Revenue Scan measures the lifecycle and retention competencies where founder-led businesses most often leave money on the table.",
    ctaButtonLabel: "Get the Free Scan",
    ctaUrl: "/scorecard",
  },

  "conversion-rate-optimization": {
    slug: "conversion-rate-optimization",
    pageType: "article",
    title: "Conversion Rate Optimization for B2B: Fix the Funnel, Not the Button",
    subhead: "Fix the Funnel, Not the Button",
    metaDescription:
      "Conversion rate optimization for founder-led B2B is a pipeline problem, not a landing-page problem. Where your real conversion leaks are, and how to fix them for good.",
    url: CONVERSION_RATE_OPTIMIZATION_URL,
    ogImage:
      "https://modernbizops.com/og/og-learn-conversion-rate-optimization.png",
    lastUpdated: "2026-07-23",
    h1: "Conversion Rate Optimization",
    byline: BYLINE,
    breadcrumb: [
      { name: "Home", url: "https://modernbizops.com" },
      LEARN_CRUMB,
      {
        name: "Conversion Rate Optimization",
        url: CONVERSION_RATE_OPTIMIZATION_URL,
      },
    ],
    faq: [
      {
        q: "How do you optimize conversion rates in a B2B business?",
        a: "Stop treating conversion as one number. Break your funnel into its separate rates: speed-to-lead, lead-to-opportunity, opportunity-to-proposal, proposal-to-close. Measure each, find the handoff losing the most interested buyers, and fix that one. For most founder-led B2B companies the biggest, cheapest win is speed to lead (contacting a new lead within an hour instead of a day), followed by getting marketing and sales onto one definition of a qualified lead. Landing-page testing comes last, not first, because it optimizes the smallest step while the large leaks sit upstream in the pipeline.",
      },
      {
        q: "What is the difference between SEO and CRO?",
        a: "SEO (search engine optimization) is about getting more of the right people to your site. CRO (conversion rate optimization) is about turning more of the people you already have into customers. They are complementary, and CRO is usually the better first investment for a B2B company with a sales motion, because it improves the revenue you get from traffic you already paid for rather than buying more traffic. The catch is that the standard version of CRO stops at the website, while a B2B company's real conversion leaks are downstream in the pipeline, so the highest-return \"CRO\" work is often operational, not on-page.",
      },
      {
        q: "What is a good sales conversion rate?",
        a: "There is no single benchmark, because it depends on your motion, your price, and where in the funnel you are measuring. Chasing an industry-average number is less useful than measuring your own funnel's separate conversion rates and improving them against your own baseline. A company that moves its lead-to-opportunity rate from 15% to 25% by defining \"qualified\" and responding faster has done something real; a company comparing its blended number to a stranger's has learned nothing it can act on. Measure each handoff, watch the trend, and fix the worst one.",
      },
      {
        q: "How much does conversion rate optimization cost?",
        a: "Website-focused CRO agencies typically run monthly retainers, and specialist consultants charge hourly or by project, all aimed at testing your pages. For a founder-led B2B company, that spend often optimizes the wrong end of the funnel. The higher-return path is usually not hiring someone to run tests on your behalf, it is fixing the pipeline handoffs where deals actually leak and building the process so it holds. That is coaching your team to own the fix, not paying an agency to rent you one. If that is the version you want, the cost conversation starts with a free discovery call.",
      },
    ],
    ctaText:
      "If your leads are converting worse than they should and you want to find the leak that is actually costing you, book a free discovery call. I coach your team to fix the funnel, so the improvement stays after I am gone.",
    ctaButtonLabel: "Book a Free Discovery Call",
    ctaUrl: "/book",
  },
};

/**
 * CARD BLURBS: the /learn index grid only. Optional, and unrelated to SEO.
 *
 * WHY THIS FIELD EXISTS (2026-08-12). The index used to print each page's
 * `metaDescription` on its card. Nine of the twenty-four are built on the same
 * negation shape ("A messy CRM is not a training problem. It is a design
 * problem."), and another handful open "Here is how to". In a search result one
 * such sentence reads as a position and earns the click, which is exactly what
 * those strings are tuned for. Rendered as a grid, a reader meets the same
 * construction nine times without scrolling and the whole library reads as one
 * template. That was the /learn index's entire de-slop score.
 *
 * So the SERP-facing `metaDescription` strings are untouched, and the index
 * renders `cardBlurb ?? metaDescription` instead. A blurb here is flat on
 * purpose: no negation pivot, no "Here is how to", no crescendo third item, and
 * deliberately uneven in length and shape from its neighbours in the grid.
 *
 * Adding a row here changes nothing a search engine sees. Editing a
 * `metaDescription` does, so do that only with the snippet in mind.
 */
const CARD_BLURBS = {
  "revenue-operations-maturity-stage-1-reactive":
    "The stage where growth still runs through you personally. What it costs you, and the six competencies that get a business out of it.",
  "crm-architecture-and-governance":
    "How to lay out objects, fields and required data so your team stops working around the CRM. Retraining is what most people try first, and it is why the mess comes back.",
  "pipeline-stage-design":
    "Stages named after what the buyer has done, with exit criteria a rep cannot argue with. This is the fix for a forecast nobody trusts.",
  "ideal-customer-profile":
    "The criteria that let your team disqualify a bad fit before the first call, written down once so everybody applies the same ones.",
  "revenue-lifecycle-design":
    "What happens between a good demo and a signed contract, mapped end to end. That stretch is where a deal that looked good goes quiet.",
  "data-quality-management":
    "Whose number is right, settled once. Field ownership, required data, and a cleanup cadence that keeps it settled.",
  "lead-qualification-framework":
    "The bar a lead has to clear before a rep picks up the phone, agreed by both teams, plus what happens to the ones that do not clear it.",
  "fractional-coo":
    "What the job actually involves day to day, and what it costs. Also the case for not hiring one at all.",
  "net-revenue-retention":
    "One number that tells you what your revenue would do if you never signed another client. Under 100 percent means the base is shrinking under you.",
  "revenue-per-employee":
    "Benchmarks by industry, and the ways this formula gets computed wrong. Then how to move the number without cutting people.",
  "involuntary-churn":
    "Customers who wanted to stay and lost a card. What causes it, how big a share of your churn it is, and how to win it back with the billing tool you already pay for.",
  "fractional-coo-cost":
    "Four ways to fix operations, compared at what each one actually costs a month. A fractional COO is only one of them.",
  "ai-tools-for-small-business":
    "An AI stack organized by the revenue job each tool does, with the honest monthly cost of each and a DIY track built on software you already pay for.",
  "customer-retention-strategy":
    "Measure retention in dollars and the picture changes. Where the leaks sit, and which one to close first.",
  "customer-lifecycle-marketing":
    "What to build after the sale closes: onboarding to first value, expansion, renewal and advocacy, and which one to build first.",
  "conversion-rate-optimization":
    "Where a founder-led pipeline actually leaks, and why testing the landing page rarely moves the number.",
};

// Every page carries a hero, so a missing VISUALS row is a bug rather than an
// opt-out. Fall back to the neutral chevron motif and the navy anchor theme so
// a new page still renders while the omission gets caught by the registry test.
//
// A missing CARD_BLURBS row IS an opt-out: those entries' meta descriptions
// already read as plain prose, so the index prints them unchanged.
export const LEARN_PAGES = Object.fromEntries(
  Object.entries(PAGES).map(([slug, entry]) => [
    slug,
    {
      ...entry,
      visual: VISUALS[slug] ?? { theme: "navy" },
      ...(CARD_BLURBS[slug] ? { cardBlurb: CARD_BLURBS[slug] } : {}),
    },
  ])
);
