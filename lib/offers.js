/**
 * The offer ladder, the Revenue Automation Builds menu, and the vertical
 * pipeline, in one place.
 *
 * Source of truth: `Business Design/AI Pivot 2026/10 Revenue Automation Builds
 * Menu - 12 Core Items.md` (v4, APPROVED-BY-BRADLEY 2026-08-11) for the items,
 * prices, clocks and vertical anchors; `07 Offer Naming and Pricing Memo.md`
 * for the ladder names and prices.
 *
 * The homepage, the Services page and the Pricing page all render from here so
 * a price can never disagree with itself across surfaces. Change a number here
 * and it changes everywhere, which is the point: published prices are the
 * differentiation, and a stale one on a second page undoes it.
 *
 * Register rules that bind every string in this file: no em dashes, no
 * contractions, plain words, no multiplier claims, no outcome promised as ours
 * until a client result exists.
 *
 * Voice (Bradley, 2026-08-11): Modern BizOps as a company is "we", so every
 * string here that describes what gets built or how the work runs is plural.
 * "I" is reserved for Bradley personally: the career record, the January rule,
 * and the iExcel attribution label. The scorecard surfaces are a separate,
 * guarded carve-out and stay first-person singular.
 */

/** The five rungs, in ladder order. `price` is display copy, not a number. */
export const LADDER = [
  {
    id: "scan",
    name: "AI Revenue Scan",
    price: "Free",
    href: "/scorecard",
    summary:
      "Fifteen questions, about five minutes, no call. You get a directional read on where your revenue engine actually stands.",
  },
  {
    id: "audit",
    name: "AI Revenue Audit",
    price: "$2,500",
    href: "/ai-readiness-assessment",
    summary:
      "We connect to your systems and compute the real picture: a maturity heat map, an AI readiness profile, and a ranked list of what to automate first. It credits 100 percent toward your first build.",
  },
  {
    id: "builds",
    name: "Revenue Automation Builds",
    price: "$2,500 to $6,500",
    href: "/ai-automation-services",
    summary:
      "One named system at a time, at a fixed price, with a clock and a runbook. Your team owns it when we leave.",
  },
  {
    id: "partner",
    name: "AI Revenue Partner",
    price: "$2,500 a month",
    href: "/pricing",
    summary:
      "Up to three systems kept running and improving, plus a monthly working session with your team.",
  },
  {
    id: "partner-plus",
    name: "AI Revenue Partner Plus",
    price: "$8,000 a month",
    href: "/pricing",
    summary:
      "The same partnership at a larger surface area, for companies automating across more than one function.",
  },
];

/** Team training sits beside the ladder rather than on it. */
export const TRAINING = {
  name: "AI Team Training",
  price: "$5,500",
  summary:
    "A working program that teaches your team to use the AI tools you already pay for, on your own processes and your own data.",
};

/** The recurring layer attached to every build. */
export const CARE_PLAN = {
  name: "Care Plan",
  price: "$300 to $500 a month per system",
  summary:
    "Monitoring, fixes, and one optimization pass a month. Optional on every build.",
};

/**
 * The 12 core builds, in menu order. Prices and clocks are exactly doc 10 v4.
 *
 * `honestScope` marks the two items whose scope language has to say the
 * unflattering part out loud: item 7 because a product commoditized the raw
 * capture, item 12 because the volume version of outbound has a documented
 * death story. Doc 10 requires both to reach the buyer.
 */
export const BUILDS = [
  {
    id: "crm-cleanup",
    name: "CRM Cleanup and Architecture",
    price: "$2,500",
    clock: "1 to 2 weeks",
    scope:
      "We clean the data, rebuild the fields and stages around how you actually sell, and set the rules that keep it clean. Stale-deal monitoring ships with it.",
  },
  {
    id: "speed-to-lead",
    name: "Speed to Lead",
    price: "$3,500",
    clock: "2 weeks",
    scope:
      "Every new lead gets a reply in minutes and reaches the right person, instead of sitting in an inbox overnight.",
  },
  {
    id: "follow-up-engine",
    name: "Follow-Up Engine",
    price: "$3,000",
    clock: "2 weeks",
    scope:
      "The follow-up nobody has time for, run on a schedule, until the prospect answers or asks you to stop.",
  },
  {
    id: "dead-lead-reactivation",
    name: "Dead-Lead Reactivation",
    price: "$3,000",
    clock: "2 weeks",
    scope:
      "The leads you already paid for get worked again with a real offer and a real sequence. This is the one that tends to pay for itself first.",
  },
  {
    id: "lead-enrichment",
    name: "Lead Enrichment and Scoring",
    price: "$3,500",
    clock: "2 to 3 weeks",
    scope:
      "Every lead arrives with the detail filled in and a score that tells your team whether it is worth a call.",
  },
  {
    id: "lead-routing",
    name: "Lead Routing and Handoff",
    price: "$3,000",
    clock: "2 weeks",
    scope:
      "Leads reach the right person by the rules you set, and the handoff is logged so nothing gets dropped between teams.",
  },
  {
    id: "meeting-to-crm",
    name: "Meeting-to-CRM Capture",
    price: "$3,500",
    clock: "2 to 3 weeks",
    scope:
      "Call notes and the fields you care about land in the CRM without a rep retyping them.",
    honestScope:
      "Scoped honestly: the note-taking tools already do raw capture for about $18 a seat. What you are buying is the tool choice, the custom fields worth extracting, and the rollout that gets the team actually using it.",
  },
  {
    id: "proposal-quote",
    name: "Proposal and Quote Automation",
    price: "$3,500",
    clock: "2 to 3 weeks",
    scope:
      "Quotes and proposals build from the data already in your CRM, go out the same day, and chase their own signatures.",
  },
  {
    id: "invoice-collection",
    name: "Invoice Collection Engine",
    price: "$2,500",
    clock: "1 to 2 weeks",
    scope:
      "Won deals become invoices, and invoices get chased on a schedule instead of whenever somebody remembers.",
  },
  {
    id: "owners-revenue-report",
    name: "Owner's Revenue Report",
    price: "$3,500",
    clock: "2 weeks",
    scope:
      "The numbers that matter land in your inbox on a schedule. There is no dashboard to log into and no report to build.",
  },
  {
    id: "onboarding-kickoff",
    name: "Onboarding Kickoff",
    price: "$3,000",
    clock: "2 weeks",
    scope:
      "The handoff from signature to kickoff runs on rails, so a new client's first two weeks match what you sold them.",
    note: "Sold as a follow-on to an existing build, not as a first project.",
  },
  {
    id: "signal-based-outbound",
    name: "Signal-Based Outbound System",
    price: "$6,500",
    clock: "3 to 4 weeks",
    scope:
      "Outreach that fires on named buying signals, one prospect at a time, with a human in the loop.",
    honestScope:
      "Signal-only by design. This is not an AI SDR and it will never blast volume for you. The replacement version of this product has a documented history of clients leaving inside a year, and that is exactly why the scope stops where it does.",
  },
];

/**
 * The six items shown on the homepage. Chosen to span the full price band
 * ($2,500 to $6,500) and to lead with the highest buy-proof patterns, per the
 * CIENCE from-prices pattern in doc 14.
 */
export const HOMEPAGE_BUILD_IDS = [
  "crm-cleanup",
  "speed-to-lead",
  "follow-up-engine",
  "dead-lead-reactivation",
  "invoice-collection",
  "signal-based-outbound",
];

export const HOMEPAGE_BUILDS = HOMEPAGE_BUILD_IDS.map((id) =>
  BUILDS.find((build) => build.id === id)
);

/**
 * The vertical pipeline, in the approved case-study target order. A pack
 * publishes only after that vertical's first audit proves the need, which is
 * why this list is a pipeline on the page and not a product grid.
 */
export const VERTICALS = [
  {
    id: "field-services",
    name: "Commercial field services",
    detail: "Fire and life safety, commercial HVAC and mechanical, facilities.",
    anchor: "Deficiency-to-Quote Pipeline",
    anchorDetail:
      "An inspection finds a deficiency, the deficiency becomes a quote, and the quote gets followed up until it closes.",
  },
  {
    id: "cpa-firms",
    name: "Accounting and CPA firms",
    detail: "Client accounting and tax practices.",
    anchor: "Client Document Chase Engine",
    anchorDetail:
      "Document collection and client follow-up run themselves through busy season, which is capacity without adding a staff accountant.",
  },
  {
    id: "msps",
    name: "MSPs and IT services",
    detail: "Managed service providers running a PSA and RMM stack.",
    anchor: "Cross-Sell Signal Engine",
    anchorDetail:
      "The stack you already run gets mined for security and project signals, and the follow-up motion runs off them.",
  },
  {
    id: "law-firms",
    name: "Law firms",
    detail: "Practices running Clio or a comparable practice management system.",
    anchor: "Intake-to-Engagement Pipeline",
    anchorDetail:
      "Every inquiry is captured, qualified, conflict-checked, and followed up to a signed engagement letter.",
  },
  {
    id: "staffing",
    name: "Staffing and recruiting",
    detail: "Agencies running an ATS such as Bullhorn.",
    anchor: "Candidate Speed to Submit",
    anchorDetail:
      "The gap between a candidate landing and a candidate being submitted stops being where the placement is lost.",
  },
  {
    id: "insurance",
    name: "Insurance agencies",
    detail: "Mid-market commercial lines agencies on AMS360 or Epic.",
    anchor: "Renewal Review and Producer Follow-Up Engine",
    anchorDetail:
      "Renewal dates are mined from the agency management system, review packets get assembled, and producer follow-up is sequenced.",
  },
];

/** The signed founding-client incentive. One place, because it appears on
 *  three surfaces and the numbers are canonical (Bradley, 2026-08-11). */
export const FOUNDING_TERMS = {
  auditPrice: "$2,500",
  buildDiscount: "25 percent off your first build",
  carePlanIncluded: "the first two months of the Care Plan included",
  perVertical: "One founding client per industry.",
};
