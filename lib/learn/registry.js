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
const ICP_URL = "https://modernbizops.com/learn/ideal-customer-profile";
const LIFECYCLE_URL = "https://modernbizops.com/learn/revenue-lifecycle-design";
const DATA_QUALITY_URL = "https://modernbizops.com/learn/data-quality-management";
const LEAD_QUAL_URL = "https://modernbizops.com/learn/lead-qualification-framework";
const MODEL_URL = "https://modernbizops.com/predictable-revenue-engine";
const FRACTIONAL_COO_URL = "https://modernbizops.com/learn/fractional-coo";
const NRR_URL = "https://modernbizops.com/learn/net-revenue-retention";
const ALIGNMENT_URL = "https://modernbizops.com/learn/marketing-and-sales-alignment";

// Pillar-map pages (Wave 1 of the keyword-validated content plan) sit outside
// the maturity-stage hierarchy, so their breadcrumb is the flatter
// Home > Learn > <page>. No /learn index route exists yet, so the Learn crumb
// is marked noLink: the shell renders it as plain text instead of a dead link,
// while the BreadcrumbList schema keeps the specified path. If a /learn index
// page ever ships, drop the noLink flags.
const LEARN_CRUMB = {
  name: "Learn",
  url: "https://modernbizops.com/learn",
  noLink: true,
};

export const LEARN_PAGES = {
  "revenue-operations-maturity-stage-1-reactive": {
    slug: "revenue-operations-maturity-stage-1-reactive",
    pageType: "hub",
    title: "Stage 1: Reactive Revenue Operations, and How to Get Out of It",
    // Dek override, approved by Bradley 2026-07-14: the full title would
    // repeat the H1 on this one page, so the on-page subhead carries only
    // the second half. Pages without a subhead use their title verbatim.
    subhead: "And How to Get Out of It",
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
      "Not sure if your team is actually chasing the right clients? The five-minute Revenue Growth Scorecard will tell you.",
    ctaButtonLabel: "Get Your Revenue Growth Scorecard",
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
      "Want to know whether your customer journey is actually designed, or just happening? Take the five-minute Revenue Growth Scorecard.",
    ctaButtonLabel: "Get Your Revenue Growth Scorecard",
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
      "Not sure how trustworthy your own revenue data actually is? The five-minute Revenue Growth Scorecard will tell you.",
    ctaButtonLabel: "Get Your Revenue Growth Scorecard",
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
      "Not sure your team is actually working the right leads? The five-minute Revenue Growth Scorecard will tell you.",
    ctaButtonLabel: "Get Your Revenue Growth Scorecard",
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
      "Not sure whether your bottleneck is operations or something upstream of it? The five-minute Revenue Growth Scorecard will show you where your revenue engine actually stands.",
    ctaButtonLabel: "Get Your Revenue Growth Scorecard",
    ctaUrl: "/scorecard",
  },

  "net-revenue-retention": {
    slug: "net-revenue-retention",
    pageType: "competency",
    title: "Net Revenue Retention: The One Number That Shows Whether Growth Is Real",
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
      "Retention is one of the competencies the five-minute Revenue Growth Scorecard measures. Find out whether your growth is compounding or leaking.",
    ctaButtonLabel: "Get Your Revenue Growth Scorecard",
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
      },
    ],
    ctaText:
      "Marketing-sales alignment is one of the competencies the five-minute Revenue Growth Scorecard measures. Find out where your handoff actually leaks.",
    ctaButtonLabel: "Get Your Revenue Growth Scorecard",
    ctaUrl: "/scorecard",
  },
};
