import { NextResponse } from "next/server";
import {
  HUBSPOT_BASE,
  REVOPS_PIPELINE_ID,
  hsHeaders,
  assertHubSpotConfigured,
  findContactByEmail,
  ensureCustomContactProperties,
} from "@/lib/hubspot";

const DISCOVERY_CALL_BOOKED_STAGE = "3477396170";

// Same tier map as /api/submit-form
const REVENUE_TO_DEAL_AMOUNT = {
  "Under $1M": 8000,
  "$1M\u20133M": 8000,
  "$3M\u20135M": 8000,
  "$5M\u201315M": 15000,
  "$15M+": 25000,
};

// Same enum maps as /api/submit-form
const REVENUE_OPTIONS = {
  "Under $1M": "under_1m",
  "$1M\u20133M": "1m_3m",
  "$3M\u20135M": "3m_5m",
  "$5M\u201315M": "5m_15m",
  "$15M+": "15m_plus",
};

const TEAM_SIZE_OPTIONS = {
  "1\u20135": "1_5",
  "6\u201315": "6_15",
  "16\u201330": "16_30",
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
 * Find deals associated with a contact in the RevOps Coaching pipeline.
 * Returns the most recent deal object, or null.
 */
async function findContactDeal(contactId) {
  const res = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/deals/search`, {
    method: "POST",
    headers: hsHeaders(),
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: "pipeline",
              operator: "EQ",
              value: REVOPS_PIPELINE_ID,
            },
          ],
        },
      ],
      sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
      limit: 100,
      properties: ["dealname", "pipeline", "dealstage", "amount"],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();

  // Filter to deals associated with this contact
  // The search API doesn't filter by association directly on Starter,
  // so we check associations for each candidate deal
  for (const deal of data.results || []) {
    const assocRes = await fetch(
      `${HUBSPOT_BASE}/crm/v3/objects/deals/${deal.id}/associations/contacts`,
      { headers: hsHeaders() }
    );
    if (!assocRes.ok) continue;
    const assocData = await assocRes.json();
    const linked = (assocData.results || []).some(
      (a) => String(a.id) === String(contactId)
    );
    if (linked) return deal;
  }

  return null;
}

/**
 * POST /api/qualify-watch-lead
 *
 * Called from the thank-you page when a /watch booker fills in the
 * qualifying form post-booking. Updates the contact with qualifying
 * properties and upgrades the deal from "New Lead" to "Discovery Call
 * Booked" with the tier-based amount.
 *
 * Expects JSON body matching the /book qualifying form fields:
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
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // 1. Find the contact
    const contactId = await findContactByEmail(email);
    if (!contactId) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    // 2. Update contact with qualifying properties
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

    // 3. Find and upgrade the deal
    const deal = await findContactDeal(contactId);
    const dealAmount = REVENUE_TO_DEAL_AMOUNT[formData.revenue] || 15000;
    const contactName = [formData.firstName, formData.lastName]
      .filter(Boolean)
      .join(" ");

    if (deal) {
      // Upgrade existing deal to Discovery Call Booked with amount
      const dealUpdateRes = await fetch(
        `${HUBSPOT_BASE}/crm/v3/objects/deals/${deal.id}`,
        {
          method: "PATCH",
          headers: hsHeaders(),
          body: JSON.stringify({
            properties: {
              dealstage: DISCOVERY_CALL_BOOKED_STAGE,
              amount: String(dealAmount),
              dealname: `RevOps Coaching \u2014 ${contactName}`,
            },
          }),
        }
      );

      if (!dealUpdateRes.ok) {
        const err = await dealUpdateRes.text();
        console.error("[qualify-watch-lead] Deal upgrade failed:", err);
      } else {
        console.log(
          `[qualify-watch-lead] Deal ${deal.id} upgraded to Discovery Call Booked ($${dealAmount}) for ${email}`
        );
      }

      return NextResponse.json({
        success: true,
        contactId,
        dealId: deal.id,
        dealUpgraded: true,
        amount: dealAmount,
      });
    }

    // No existing deal found (edge case). Create one at Discovery Call Booked.
    const createRes = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/deals`, {
      method: "POST",
      headers: hsHeaders(),
      body: JSON.stringify({
        properties: {
          dealname: `RevOps Coaching \u2014 ${contactName}`,
          pipeline: REVOPS_PIPELINE_ID,
          dealstage: DISCOVERY_CALL_BOOKED_STAGE,
          amount: String(dealAmount),
          dealtype: "newbusiness",
          engagement_type: "DWY Coaching",
          project_type: "RevOps Coaching",
        },
        associations: [
          {
            to: { id: contactId },
            types: [
              {
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 3,
              },
            ],
          },
        ],
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      console.error("[qualify-watch-lead] Deal creation failed:", err);
      return NextResponse.json({
        success: true,
        contactId,
        dealId: null,
        dealUpgraded: false,
      });
    }

    const newDeal = await createRes.json();
    console.log(
      `[qualify-watch-lead] New deal ${newDeal.id} created at Discovery Call Booked ($${dealAmount}) for ${email}`
    );

    return NextResponse.json({
      success: true,
      contactId,
      dealId: newDeal.id,
      dealUpgraded: true,
      amount: dealAmount,
    });
  } catch (err) {
    console.error("[qualify-watch-lead] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
