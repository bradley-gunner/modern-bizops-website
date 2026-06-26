import { NextResponse } from "next/server";
import {
  HUBSPOT_BASE,
  hsHeaders,
  assertHubSpotConfigured,
  findContactByEmail,
  markContactForReview,
  ensureCustomContactProperties,
} from "@/lib/hubspot";

// Enum maps mirror the /book qualifying form. Kept here (not moved to the deal
// layer) because they translate the form's display labels into the contact
// property option values. The revenue-to-amount map was removed with the deal
// logic; amounts are set when Bradley creates the deal manually.
const REVENUE_OPTIONS = {
  "Under $1M": "under_1m",
  "$1M–3M": "1m_3m",
  "$3M–5M": "3m_5m",
  "$5M–15M": "5m_15m",
  "$15M–50M": "15m_50m",
  "$50M+": "50m_plus",
  "$15M+": "15m_plus", // legacy band, retained for historical/in-flight submissions
};

const TEAM_SIZE_OPTIONS = {
  "1–5": "1_5",
  "6–15": "6_15",
  "16–30": "16_30",
  "30+": "30_plus",
};

const CUSTOM_PROPERTIES = [
  {
    name: "company_annual_revenue",
    label: "Company Annual Revenue",
    type: "enumeration",
    fieldType: "select",
    groupName: "contactinformation",
    options: Object.entries(REVENUE_OPTIONS).map(([label, value], i) => ({
      label,
      value,
      displayOrder: i,
    })),
  },
  {
    name: "sales_marketing_team_size",
    label: "Sales & Marketing Team Size",
    type: "enumeration",
    fieldType: "select",
    groupName: "contactinformation",
    options: Object.entries(TEAM_SIZE_OPTIONS).map(([label, value], i) => ({
      label,
      value,
      displayOrder: i,
    })),
  },
  {
    name: "growth_bottleneck",
    label: "Growth Bottleneck",
    type: "string",
    fieldType: "textarea",
    groupName: "contactinformation",
  },
  {
    name: "previous_consultant",
    label: "Previous Consultant",
    type: "enumeration",
    fieldType: "select",
    groupName: "contactinformation",
    options: [
      { label: "Yes", value: "yes", displayOrder: 0 },
      { label: "No", value: "no", displayOrder: 1 },
    ],
  },
  {
    name: "previous_consultant_details",
    label: "Previous Consultant Details",
    type: "string",
    fieldType: "textarea",
    groupName: "contactinformation",
  },
];

let propertiesEnsured = false;

async function ensureProperties() {
  if (propertiesEnsured) return;
  await ensureCustomContactProperties(CUSTOM_PROPERTIES);
  propertiesEnsured = true;
}

/**
 * POST /api/qualify-watch-lead
 *
 * Called from the thank-you page when a /watch booker fills in the qualifying
 * form post-booking. Writes the qualifying answers onto the contact and keeps
 * it flagged for the manual qualification queue. It does NOT create or upgrade
 * a deal: a self-reported qualifying form is not a qualified opportunity.
 * Bradley creates the deal manually after qualifying.
 *
 * Expects JSON body matching the qualifying form fields:
 * { email, firstName, lastName, revenue, teamSize, bottleneck,
 *   previousConsultant, previousConsultantDetails, phone? }
 */
export async function POST(request) {
  try {
    assertHubSpotConfigured();
    await ensureProperties();

    const formData = await request.json();
    const { email } = formData;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const contactId = await findContactByEmail(email);
    if (!contactId) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const contactProps = {
      company_annual_revenue:
        REVENUE_OPTIONS[formData.revenue] || formData.revenue,
      sales_marketing_team_size:
        TEAM_SIZE_OPTIONS[formData.teamSize] || formData.teamSize,
      growth_bottleneck: formData.bottleneck || "",
      previous_consultant: formData.previousConsultant || "",
      previous_consultant_details: formData.previousConsultantDetails || "",
    };

    if (formData.firstName) contactProps.firstname = formData.firstName;
    if (formData.lastName) contactProps.lastname = formData.lastName;
    if (formData.phone) contactProps.phone = formData.phone;

    const updateRes = await fetch(
      `${HUBSPOT_BASE}/crm/v3/objects/contacts/${contactId}`,
      {
        method: "PATCH",
        headers: hsHeaders(),
        body: JSON.stringify({ properties: contactProps }),
      }
    );

    if (!updateRes.ok) {
      const err = await updateRes.text();
      console.error("[qualify-watch-lead] Contact update failed:", err);
      return NextResponse.json(
        { error: "Failed to update contact", details: err },
        { status: 502 }
      );
    }

    // Keep the contact in the manual qualification queue. It is likely already
    // Lead from booking; this is a safety net and sets hs_lead_status NEW.
    await markContactForReview(contactId);

    return NextResponse.json({ success: true, contactId });
  } catch (err) {
    console.error("[qualify-watch-lead] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
