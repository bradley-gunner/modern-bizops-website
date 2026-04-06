import { NextResponse } from "next/server";

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const HUBSPOT_BASE = "https://api.hubapi.com";

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

    // Create or update the contact
    const result = await upsertContact(formData);

    return NextResponse.json({
      success: true,
      contactId: result.id,
      action: result.action,
    });
  } catch (error) {
    console.error("HubSpot submit error:", error);
    return NextResponse.json(
      { error: "Failed to save contact data" },
      { status: 500 }
    );
  }
}
