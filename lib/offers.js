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
 * Voice (Bradley, 2026-08-11, rewritten by him 2026-08-12): Modern BizOps is
 * "we" everywhere, so every string here that describes what gets built or how
 * the work runs is plural. The first-person singular is retired as a brand
 * voice; where Bradley has to be named, including the career record, the
 * January rule and the iExcel attribution label, he is named in the third
 * person. The scorecard surfaces are guarded to the same rule.
 */

/** Formats a whole-dollar amount the way every display price in this file is
 *  written, so a derived number can never be punctuated differently from a
 *  typed one. */
const usd = (amount) => `$${amount.toLocaleString("en-US")}`;

/**
 * The first dollar amount in a display price, as a plain number.
 *
 * Schema.org wants a numeric `price`, and a numeric copy of a price is exactly
 * the kind of second source that goes stale. This derives one from the display
 * string instead. "Free" and anything with no amount return 0 and null
 * respectively, which is what the Offer builder on the Pricing page expects.
 */
export function priceValue(display) {
  if (/^free$/i.test(String(display).trim())) return 0;
  const match = String(display).match(/\$([\d,]+)/);
  return match ? Number(match[1].replace(/,/g, "")) : null;
}

/**
 * Reads a display price into the parts that decide how to describe it: the
 * amounts, whether it is a band rather than a single number, whether it
 * recurs, and whether it is charged per system.
 */
export function priceSpec(display) {
  const text = String(display);
  const free = /^\s*free\s*$/i.test(text);
  const amounts = [...text.matchAll(/\$([\d,]+)/g)].map((m) =>
    Number(m[1].replace(/,/g, ""))
  );
  return {
    min: free ? 0 : amounts[0] ?? null,
    max: free ? 0 : amounts[amounts.length - 1] ?? null,
    isBand: amounts.length > 1,
    recurs: /\ba month\b/i.test(text),
    perSystem: /\bper system\b/i.test(text),
  };
}

/**
 * The price fields of a schema.org Offer, spread into the offer by the caller.
 *
 * A bare `price` says "this is what it costs, once", and that is false for
 * three of the published prices: a band ("$2,500 to $6,500") collapses to its
 * floor, a retainer ("$2,500 a month") reads as a single charge, and the Care
 * Plan is a band, monthly, AND per system. Crawlers do surface that number, and
 * published prices being right is the whole differentiation here, so anything
 * banded or recurring gets a priceSpecification instead. Only a single one-time
 * amount keeps the flat `price`.
 */
export function offerPriceFields(display) {
  const spec = priceSpec(display);
  if (spec.min === null) return {};
  if (!spec.isBand && !spec.recurs) {
    return { price: spec.min, priceCurrency: "USD" };
  }

  const priceSpecification = {
    "@type": spec.recurs ? "UnitPriceSpecification" : "PriceSpecification",
    priceCurrency: "USD",
  };
  if (spec.isBand) {
    priceSpecification.minPrice = spec.min;
    priceSpecification.maxPrice = spec.max;
  } else {
    priceSpecification.price = spec.min;
  }
  if (spec.recurs) {
    priceSpecification.unitText = "MONTH";
    priceSpecification.unitCode = "MON";
  }
  if (spec.perSystem) {
    priceSpecification.referenceQuantity = {
      "@type": "QuantitativeValue",
      value: 1,
      unitText: "system",
    };
  }
  return { priceCurrency: "USD", priceSpecification };
}

/**
 * The audit terms, in one place because they appear on the homepage, the
 * homepage FAQ, the audit page, the Pricing page, the Founding Clients page and
 * the Scan result, and a term that disagrees with itself is worse than no term
 * at all.
 *
 * Declared above LADDER because the audit rung's own summary interpolates the
 * credit out of it. A template literal in LADDER runs at module load, so a
 * constant it reads has to exist by then.
 */
export const AUDIT_TERMS = {
  creditPercent: "100 percent",
  creditWindow: "90 days",
  creditTarget: "your first build or your first Partner month",
  guarantee:
    "If we find nothing worth building, you get the fee back and you keep the findings.",
};

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
    summary: `We connect to your systems and compute the real picture: a maturity heat map, an AI readiness profile, and a ranked list of what to automate first. It credits ${AUDIT_TERMS.creditPercent} toward your first build.`,
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
      "The same partnership across more of the business, for companies automating in more than one function.",
  },
];

/** Team training sits beside the ladder rather than on it. */
export const TRAINING = {
  name: "AI Team Training",
  price: "$5,500",
  summary:
    "A working program that teaches your team to use the AI tools you already pay for, on your own processes and your own data.",
};

/** How many systems one AI Revenue Partner retainer covers. The Services page
 *  does the stacking arithmetic against this number. */
export const PARTNER_SYSTEM_LIMIT = 3;

/** The recurring layer attached to every build. `perSystem` is the source and
 *  `price` is derived from it, so the monthly arithmetic on the Services page
 *  cannot disagree with the number a buyer reads here. */
const CARE_PLAN_PER_SYSTEM = { low: 300, high: 500 };

export const CARE_PLAN = {
  name: "Care Plan",
  perSystem: CARE_PLAN_PER_SYSTEM,
  price: `${usd(CARE_PLAN_PER_SYSTEM.low)} to ${usd(
    CARE_PLAN_PER_SYSTEM.high
  )} a month per system`,
  summary:
    "Monitoring, fixes, and one optimization pass a month. Optional on every build.",
};

/** What Care Plans cost once they stack across `systems` systems. */
export function carePlanMonthly(systems) {
  return `${usd(CARE_PLAN_PER_SYSTEM.low * systems)} to ${usd(
    CARE_PLAN_PER_SYSTEM.high * systems
  )} a month`;
}

/**
 * The 12 core builds, in menu order. Prices and clocks are exactly doc 10 v4.
 *
 * `honestScope` marks the two items whose scope language has to say the
 * unflattering part out loud: item 7 because a product commoditized the raw
 * capture, item 12 because the buyer has to hear what this build refuses to do
 * before they pay for it. Doc 10 requires both to reach the buyer.
 *
 * Cadence is deliberate here and easy to lose. These twelve strings render
 * consecutively as the whole middle of /ai-automation-services, and six of them
 * render again on the homepage. On 2026-08-12 eleven of the twelve ran between
 * 16 and 22 words each, which reads as machine-generated however good any one
 * of them is. They now run from 5 words to 22, with fragments and two-sentence
 * pairs mixed in. Keep the lurch: when you add or edit an item, check its
 * length against its neighbours rather than against a house average.
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
      "Every new lead gets an answer in minutes. It routes to whoever can actually take the call.",
  },
  {
    id: "follow-up-engine",
    name: "Follow-Up Engine",
    price: "$3,000",
    clock: "2 weeks",
    scope:
      "The follow-up nobody has time for, run on a schedule until the prospect replies or asks you to stop.",
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
      "Detail filled in and a score attached, before anybody on your team opens the record.",
  },
  {
    id: "lead-routing",
    name: "Lead Routing and Handoff",
    price: "$3,000",
    clock: "2 weeks",
    scope:
      "Leads reach the right person by the rules you set. Every handoff is logged.",
  },
  {
    id: "meeting-to-crm",
    name: "Meeting-to-CRM Capture",
    price: "$3,500",
    clock: "2 to 3 weeks",
    scope:
      "Call notes and the fields you care about land in the CRM. No rep retypes anything.",
    honestScope:
      "Scoped honestly: the note-taking tools already do raw capture for about $18 a seat. What you are buying is the tool choice, the custom fields worth extracting, and the rollout that gets the team actually using it.",
  },
  {
    id: "proposal-quote",
    name: "Proposal and Quote Automation",
    price: "$3,500",
    clock: "2 to 3 weeks",
    scope:
      "Quotes build from the data already in your CRM. They go out the same day. Then they chase their own signatures.",
  },
  {
    id: "invoice-collection",
    name: "Invoice Collection Engine",
    price: "$2,500",
    clock: "1 to 2 weeks",
    scope:
      "Won deals become invoices. Those invoices then chase themselves on a schedule.",
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
      "Signature to kickoff runs on rails. A new client's first two weeks match what you sold them.",
    note: "Sold as a follow-on to an existing build, not as a first project.",
  },
  {
    id: "signal-based-outbound",
    name: "Signal-Based Outbound System",
    price: "$6,500",
    clock: "3 to 4 weeks",
    scope:
      "Outreach that fires on named buying signals, one prospect at a time, with a human approving each one.",
    honestScope:
      "Signal-only by design. This is not an AI SDR and it will never blast volume for you. If volume is what you are after, this is the wrong build, and we will say so before you buy it.",
  },
];

/** The published price band, derived from the menu itself so a new item at a
 *  new price moves the band everywhere it is quoted. */
const BUILD_PRICE_VALUES = BUILDS.map((build) => priceValue(build.price));
export const BUILD_PRICE_FLOOR = usd(Math.min(...BUILD_PRICE_VALUES));
export const BUILD_PRICE_CEILING = usd(Math.max(...BUILD_PRICE_VALUES));

/**
 * The one rule that moves a listed price, published rather than discovered on
 * a call. The listed number is the base pattern: one system of record, one
 * funnel. A second of either is more work, and the ceiling is the top of the
 * published band, so no scope conversation ever ends above the menu.
 */
export const UPLIFT_RULE = {
  addition: `${usd(1000)} to ${usd(2000)}`,
  cap: BUILD_PRICE_CEILING,
};

/**
 * The hire this is measured against. These two numbers are market context, not
 * our prices: a GTM engineer's going rate, and the first slice of automation
 * budget the audit ranks and prices. They live here so the comparison cannot
 * drift between the pages that make it.
 */
export const GTM_HIRE_COMPARISON = {
  role: "GTM engineer",
  salary: "$130K a year",
  firstAutomationBudget: "$30K",
};

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
 * publishes only after that vertical's first audit proves the need, so the
 * page presents this as build order and not as a catalogue.
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
      "Document requests go out, reminders chase themselves, and the partner sees which clients are holding up which returns, without anybody keeping a spreadsheet of it.",
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
      "A candidate lands, gets screened, and reaches a submittal without waiting in somebody's inbox for two days.",
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
