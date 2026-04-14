import { NextResponse } from "next/server";
import {
  assertHubSpotConfigured,
  ensureCustomContactProperties,
  upsertContactByEmail,
  createContactTask,
} from "@/lib/hubspot";

// ---------------------------------------------------------------------------
// Custom contact properties for the discovery call prep form
// ---------------------------------------------------------------------------
// These are created automatically on first form submission (idempotent).
// They complement the 5 properties already created by /api/submit-form.

const DECISION_MAKERS_OPTIONS = {
  "Just me": "just_me",
  "Me and a co-founder or business partner": "me_plus_cofounder",
  "Me and my leadership team": "me_plus_leadership",
  "Me and investors or board": "me_plus_board",
  "Me and my spouse or family": "me_plus_family",
  Other: "other",
};

// Grouped tech-stack options. One property per category keeps the data
// queryable; an "Other" bucket catches anything not listed.
const TECH_STACK_OPTIONS = {
  crm: [
    "Salesforce",
    "HubSpot",
    "Pipedrive",
    "Close",
    "Airtable",
    "Spreadsheets",
    "None",
    "Other",
  ],
  marketing: [
    "HubSpot",
    "ActiveCampaign",
    "Klaviyo",
    "Mailchimp",
    "Customer.io",
    "None",
    "Other",
  ],
  support: ["Intercom", "Zendesk", "Front", "Email inbox", "None", "Other"],
  analytics: ["GA4", "Mixpanel", "PostHog", "Heap", "None", "Other"],
  bi: ["Looker", "Metabase", "Tableau", "Spreadsheets", "None", "Other"],
};

// Acquisition channels are multi-select. HubSpot stores multi-checkbox as a
// semicolon-delimited string in an enumeration property.
const ACQUISITION_CHANNELS = [
  "Inbound (SEO, content, organic search)",
  "Paid ads (Google, Meta, LinkedIn)",
  "Outbound sales (cold email, cold calling, LinkedIn outreach)",
  "Partnerships or channel",
  "Referrals and word of mouth",
  "Events, trade shows, or conferences",
  "Other",
];

function toEnumOptions(values) {
  return values.map((v, i) => ({ label: v, value: v, displayOrder: i }));
}

const PREP_CUSTOM_PROPERTIES = [
  {
    name: "business_description",
    label: "Business Description (Prep)",
    type: "string",
    fieldType: "textarea",
    groupName: "contactinformation",
  },
  {
    name: "acquisition_channels",
    label: "Acquisition Channels",
    type: "enumeration",
    fieldType: "checkbox", // multi-checkbox → semicolon-delimited string
    groupName: "contactinformation",
    options: toEnumOptions(ACQUISITION_CHANNELS),
  },
  {
    name: "best_fit_channel",
    label: "Best-Fit Channel",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
  },
  {
    name: "avg_deal_size_usd",
    label: "Avg Deal Size (USD)",
    type: "number",
    fieldType: "number",
    groupName: "contactinformation",
  },
  {
    name: "sales_cycle_days",
    label: "Sales Cycle (Days)",
    type: "number",
    fieldType: "number",
    groupName: "contactinformation",
  },
  {
    name: "win_rate_pct",
    label: "Win Rate (%)",
    type: "number",
    fieldType: "number",
    groupName: "contactinformation",
  },
  {
    name: "new_customers_per_month",
    label: "New Customers / Month",
    type: "number",
    fieldType: "number",
    groupName: "contactinformation",
  },
  {
    name: "tech_stack_crm",
    label: "Tech Stack — CRM",
    type: "enumeration",
    fieldType: "select",
    groupName: "contactinformation",
    options: toEnumOptions(TECH_STACK_OPTIONS.crm),
  },
  {
    name: "tech_stack_marketing",
    label: "Tech Stack — Marketing",
    type: "enumeration",
    fieldType: "select",
    groupName: "contactinformation",
    options: toEnumOptions(TECH_STACK_OPTIONS.marketing),
  },
  {
    name: "tech_stack_support",
    label: "Tech Stack — Support",
    type: "enumeration",
    fieldType: "select",
    groupName: "contactinformation",
    options: toEnumOptions(TECH_STACK_OPTIONS.support),
  },
  {
    name: "tech_stack_analytics",
    label: "Tech Stack — Analytics",
    type: "enumeration",
    fieldType: "select",
    groupName: "contactinformation",
    options: toEnumOptions(TECH_STACK_OPTIONS.analytics),
  },
  {
    name: "tech_stack_bi",
    label: "Tech Stack — BI",
    type: "enumeration",
    fieldType: "select",
    groupName: "contactinformation",
    options: toEnumOptions(TECH_STACK_OPTIONS.bi),
  },
  {
    name: "revenue_team_structure",
    label: "Revenue Team Structure",
    type: "string",
    fieldType: "textarea",
    groupName: "contactinformation",
  },
  {
    name: "external_help_engaged",
    label: "External Help Engaged",
    type: "string",
    fieldType: "textarea",
    groupName: "contactinformation",
  },
  {
    name: "booking_trigger",
    label: "Booking Trigger / Why Now",
    type: "string",
    fieldType: "textarea",
    groupName: "contactinformation",
  },
  {
    name: "prior_consultant_detail",
    label: "Prior Consultant Detail (Prep)",
    type: "string",
    fieldType: "textarea",
    groupName: "contactinformation",
  },
  {
    name: "desired_outcome_90d",
    label: "Desired Outcome — 90 Day",
    type: "string",
    fieldType: "textarea",
    groupName: "contactinformation",
  },
  {
    name: "decision_makers",
    label: "Other Decision Makers",
    type: "enumeration",
    fieldType: "select",
    groupName: "contactinformation",
    options: Object.entries(DECISION_MAKERS_OPTIONS).map(
      ([label, value], i) => ({ label, value, displayOrder: i })
    ),
  },
  {
    name: "prep_other",
    label: "Prep — Anything Else",
    type: "string",
    fieldType: "textarea",
    groupName: "contactinformation",
  },
  {
    name: "prep_submitted_at",
    label: "Prep Submitted At",
    type: "datetime",
    fieldType: "date",
    groupName: "contactinformation",
  },
];

// Module-level cache — HubSpot property creation only needs to happen once
// per cold start of the serverless function.
let propertiesEnsured = false;

// ---------------------------------------------------------------------------
// Request handler
// ---------------------------------------------------------------------------

export async function POST(request) {
  try {
    assertHubSpotConfigured();
    const data = await request.json();

    if (!data.email) {
      return NextResponse.json(
        { error: "Email is required to link prep responses to your booking." },
        { status: 400 }
      );
    }

    if (!propertiesEnsured) {
      await ensureCustomContactProperties(PREP_CUSTOM_PROPERTIES);
      propertiesEnsured = true;
    }

    // Build contact property payload — only include fields that were filled,
    // so we never blank out existing data.
    const props = {};
    const set = (k, v) => {
      if (v !== undefined && v !== null && v !== "") props[k] = v;
    };

    set("business_description", data.businessDescription);
    set(
      "acquisition_channels",
      Array.isArray(data.acquisitionChannels)
        ? data.acquisitionChannels.join(";")
        : data.acquisitionChannels
    );
    set("best_fit_channel", data.bestFitChannel);

    // Numeric fields — coerce from string to number where possible
    const num = (v) => {
      if (v === undefined || v === null || v === "") return undefined;
      const n = Number(String(v).replace(/[^0-9.]/g, ""));
      return Number.isFinite(n) ? n : undefined;
    };
    set("avg_deal_size_usd", num(data.avgDealSize));
    set("sales_cycle_days", num(data.salesCycleDays));
    set("win_rate_pct", num(data.winRatePct));
    set("new_customers_per_month", num(data.newCustomersPerMonth));

    set("tech_stack_crm", data.techStackCrm);
    set("tech_stack_marketing", data.techStackMarketing);
    set("tech_stack_support", data.techStackSupport);
    set("tech_stack_analytics", data.techStackAnalytics);
    set("tech_stack_bi", data.techStackBi);

    set("revenue_team_structure", data.revenueTeamStructure);
    set("external_help_engaged", data.externalHelpEngaged);
    set("booking_trigger", data.bookingTrigger);
    set("prior_consultant_detail", data.priorConsultantDetail);
    set("desired_outcome_90d", data.desiredOutcome);
    set(
      "decision_makers",
      DECISION_MAKERS_OPTIONS[data.decisionMakers] || data.decisionMakers
    );
    set("prep_other", data.prepOther);
    set("prep_submitted_at", new Date().toISOString());

    const result = await upsertContactByEmail(data.email, props);

    // Fire-and-forget task creation so notification delay doesn't block the
    // user's response. Errors are logged inside createContactTask.
    const triggerExcerpt = (data.bookingTrigger || "").slice(0, 240);
    const outcomeExcerpt = (data.desiredOutcome || "").slice(0, 180);
    const stackSummary = [
      data.techStackCrm && `CRM: ${data.techStackCrm}`,
      data.techStackMarketing && `Marketing: ${data.techStackMarketing}`,
      data.techStackBi && `BI: ${data.techStackBi}`,
    ]
      .filter(Boolean)
      .join(" · ");

    const taskBody = [
      `Prep responses received for ${data.email}.`,
      "",
      "TRIGGER / WHY NOW:",
      triggerExcerpt || "(not provided)",
      "",
      "90-DAY OUTCOME:",
      outcomeExcerpt || "(not provided)",
      "",
      stackSummary && `STACK: ${stackSummary}`,
      "",
      "Review full responses on the contact record before the discovery call.",
    ]
      .filter(Boolean)
      .join("\n");

    await createContactTask({
      contactId: result.id,
      subject: `Prep responses submitted — ${data.email}`,
      body: taskBody,
      priority: "HIGH",
    });

    return NextResponse.json({
      success: true,
      contactId: result.id,
      action: result.action,
    });
  } catch (error) {
    console.error("Prep form submit error:", error);
    return NextResponse.json(
      { error: "Failed to save prep responses. Please try again." },
      { status: 500 }
    );
  }
}
