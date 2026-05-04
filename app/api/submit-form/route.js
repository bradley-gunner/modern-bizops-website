import { NextResponse } from "next/server";
import {
  UTM_CUSTOM_PROPERTIES,
  pickUtmProperties,
  ensureCustomContactProperties,
} from "@/lib/hubspot";

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const HUBSPOT_BASE = "https://api.hubapi.com";

// RevOps Coaching pipeline
const REVOPS_PIPELINE_ID = "2172760768";
const DISCOVERY_CALL_BOOKED_STAGE = "3477396170";

// Map revenue ranges to deal amounts (pricing tiers)
const REVENUE_TO_DEAL_AMOUNT = {
  "Under $1M": 8000,
  "$1M–$3M": 8000,
  "$3M–$5M": 8000,
  "$5M–$15M": 15000,
  "$15M+": 25000,
};

// Maps form field values to internal HubSpot enumeration values
const REVENUE_OPTIONS = {
  "Under $1M": "under_1m",
  "$1M–$3M": "1m_3m",
  "$3M–$5M": "3m_5m",
  "$5M–$15M": "5m_15m",
  "$15M+": "15m_plus",
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

/**
 * Ensures all custom properties exist in HubSpot.
 * Creates any that are missing. Runs once per cold start via module-level flag.
 */
let propertiesEnsured = false;

async function ensureCustomProperties() {
  if (propertiesEnsured) return;

  const headers = {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    "Content-Type": "application/json",
  };

  for (const prop of CUSTOM_PROPERTIES) {
    // Check if property exists
    const checkRes = await fetch(
      `${HUBSPOT_BASE}/crm/v3/properties/contacts/${prop.name}`,
      { headers }
    );

    if (checkRes.status === 404) {
      // Create the property
      const createRes = await fetch(
        `${HUBSPOT_BASE}/crm/v3/properties/contacts`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(prop),
        }
      );

      if (!createRes.ok) {
        const err = await createRes.text();
        console.error(`Failed to create property ${prop.name}:`, err);
      } else {
        console.log(`Created HubSpot property: ${prop.name}`);
      }
    }
  }

  propertiesEnsured = true;
}

/**
 * Search for an existing contact by email, return their ID if found.
 */
async function findContactByEmail(email) {
  const res = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HUBSPOT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            { propertyName: "email", operator: "EQ", value: email },
          ],
        },
      ],
      limit: 1,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.total > 0 ? data.results[0].id : null;
}

/**
 * Create or update a HubSpot contact with the qualifying form data.
 */
async function upsertContact(formData) {
  const headers = {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    "Content-Type": "application/json",
  };

  const properties = {
    company_annual_revenue:
      REVENUE_OPTIONS[formData.revenue] || formData.revenue,
    sales_marketing_team_size:
      TEAM_SIZE_OPTIONS[formData.teamSize] || formData.teamSize,
    growth_bottleneck: formData.bottleneck || "",
    previous_consultant: formData.previousConsultant || "",
    previous_consultant_details: formData.previousConsultantDetails || "",
    ...pickUtmProperties(formData.utms),
  };

  // Only set phone if provided
  if (formData.phone) {
    properties.phone = formData.phone;
  }

  // Only set email if provided
  if (formData.email) {
    properties.email = formData.email;
  }

  // If we have an email, try to find and update existing contact
  if (formData.email) {
    const existingId = await findContactByEmail(formData.email);

    if (existingId) {
      const updateRes = await fetch(
        `${HUBSPOT_BASE}/crm/v3/objects/contacts/${existingId}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ properties }),
        }
      );

      if (!updateRes.ok) {
        const err = await updateRes.text();
        throw new Error(`Failed to update contact: ${err}`);
      }

      return { id: existingId, action: "updated" };
    }
  }

  // Create new contact
  const createRes = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts`, {
    method: "POST",
    headers,
    body: JSON.stringify({ properties }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create contact: ${err}`);
  }

  const created = await createRes.json();
  return { id: created.id, action: "created" };
}

/**
 * Create a deal in the RevOps Coaching pipeline at "Discovery Call Booked" stage.
 * Associates the deal with the contact.
 */
async function createDeal(contactId, formData) {
  const headers = {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    "Content-Type": "application/json",
  };

  const dealAmount = REVENUE_TO_DEAL_AMOUNT[formData.revenue] || 15000;
  const contactName = [formData.firstName, formData.lastName]
    .filter(Boolean)
    .join(" ");

  const dealRes = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/deals`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      properties: {
        dealname: `RevOps Coaching — ${contactName}`,
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
              associationTypeId: 3, // deal-to-contact
            },
          ],
        },
      ],
    }),
  });

  if (!dealRes.ok) {
    const err = await dealRes.text();
    console.error("Failed to create deal:", err);
    return null;
  }

  const deal = await dealRes.json();
  return { id: deal.id, amount: dealAmount };
}

export async function POST(request) {
  // Validate API key is configured
  if (!HUBSPOT_API_KEY) {
    console.error("HUBSPOT_API_KEY environment variable is not set");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.json();

    // Ensure custom properties exist in HubSpot (idempotent, cached after first run)
    await ensureCustomProperties();
    await ensureCustomContactProperties(UTM_CUSTOM_PROPERTIES);

    // Create or update the contact
    const result = await upsertContact(formData);

    // Create a deal in the RevOps Coaching pipeline
    const deal = await createDeal(result.id, formData);

    return NextResponse.json({
      success: true,
      contactId: result.id,
      action: result.action,
      dealId: deal?.id || null,
    });
  } catch (error) {
    console.error("HubSpot submit error:", error);
    return NextResponse.json(
      { error: "Failed to save contact data" },
      { status: 500 }
    );
  }
}
