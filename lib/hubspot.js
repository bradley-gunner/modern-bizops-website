/**
 * Shared HubSpot helpers.
 * The HubSpot Private App token is stored in .env.local as HUBSPOT_API_KEY.
 */

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
export const HUBSPOT_BASE = "https://api.hubapi.com";

// Forms API config for at-source attribution. The non-secure integration
// submit endpoint accepts the visitor's hubspotutk cookie in context, which is
// what lets HubSpot set a real Original Source instead of INTEGRATION. Both
// values come from scripts/setup-hubspot-forms.mjs and live in .env.local.
export const HUBSPOT_PORTAL_ID = process.env.HUBSPOT_PORTAL_ID;
export const HUBSPOT_LEAD_FORM_GUID = process.env.HUBSPOT_LEAD_FORM_GUID;

// RevOps Coaching pipeline IDs (already configured in HubSpot)
export const REVOPS_PIPELINE_ID = "2172760768";
export const NEW_LEAD_STAGE = "3477396169";
export const DISCOVERY_CALL_BOOKED_STAGE = "3477396170";

// Bradley's HubSpot owner ID (for task assignment)
export const BRADLEY_OWNER_ID = "85826069";

// Custom contact properties for inbound UTM attribution. Created on demand by
// any form route via ensureCustomContactProperties().
export const UTM_CUSTOM_PROPERTIES = [
  {
    name: "utm_source",
    label: "UTM Source",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
  },
  {
    name: "utm_medium",
    label: "UTM Medium",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
  },
  {
    name: "utm_campaign",
    label: "UTM Campaign",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
  },
  {
    name: "utm_content",
    label: "UTM Content",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
  },
  {
    name: "utm_term",
    label: "UTM Term",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
  },
];

// Distinguishes which lead magnet created/last-touched the contact. Both magnets
// create contacts server-side via the API, so HubSpot's native form-conversion
// fields stay blank; we set this explicitly instead. Created on demand by the
// scorecard and playbook routes via ensureCustomContactProperties(), which
// reconciles the option set if the property already exists. NOTE: distinct from
// utm_content, which carries the asset-variant value.
export const LEAD_MAGNET_PROPERTY = {
  name: "lead_magnet",
  label: "Lead Magnet",
  type: "enumeration",
  fieldType: "select",
  groupName: "contactinformation",
  options: [
    { label: "Scorecard", value: "scorecard", displayOrder: 0 },
    { label: "Playbook", value: "playbook", displayOrder: 1 },
  ],
};

// Property group that holds the computed scorecard result properties, so they
// group together in the HubSpot contact record UI instead of scattering into
// Contact Information. Created via ensureScorecardResultProperties() (which
// creates the group first, then the properties inside it).
export const SCORECARD_PROPERTY_GROUP = {
  name: "scorecard",
  label: "Scorecard",
  displayOrder: -1,
};

// Enum options for scorecard_readiness_band: the four AI Readiness bands from
// the 2026-08 Scan rebuild (doc 15; provisional by design). Label === value so
// the stored value reads cleanly in reports and the email loop. A drift test
// asserts this set stays in lockstep with lib/scorecard/scoring.js.
const READINESS_BAND_OPTIONS = [
  "Not Ready Yet",
  "Foundations First",
  "Ready in Parts",
  "Ready to Build",
].map((name, i) => ({ label: name, value: name, displayOrder: i }));

// Options for a booleancheckbox property. HubSpot's own bool properties carry
// this exact shape (verified against hs_email_optout, 2026-08-14), and the
// property-create call is not reliably accepted without it. This matters more
// than it looks: writeScorecardResultProperties sends every scorecard property
// in ONE PATCH, so a property that failed to create takes the whole write down
// with it, silently, including the band and the result JSON.
const BOOL_OPTIONS = [
  { label: "True", value: "true", displayOrder: 0 },
  { label: "False", value: "false", displayOrder: 1 },
];

// Enum options for scorecard_business_model: the scorecard's 8 benchmark keys
// (the q2 business-model values). Values are the canonical keys; labels mirror
// the quiz's BUSINESS_MODEL_OPTIONS (lib/scorecard/questions.js). Inlined here
// so lib/hubspot.js stays import-free (the setup .mjs imports it under raw Node
// ESM); a drift test (hubspot-scorecard-properties.test.js) asserts the value
// set stays in lockstep with the quiz.
const BUSINESS_MODEL_ENUM_OPTIONS = [
  { label: "B2B SaaS", value: "B2B_SAAS" },
  { label: "Professional services", value: "PROFESSIONAL_SERVICES" },
  { label: "B2B product", value: "B2B_PRODUCT" },
  { label: "E-commerce", value: "ECOMMERCE" },
  { label: "B2C services", value: "B2C_SERVICES" },
  { label: "B2C subscription", value: "B2C_SUBSCRIPTION" },
  { label: "Marketplace", value: "MARKETPLACE" },
  { label: "Other or mixed", value: "OTHER" },
].map((o, i) => ({ ...o, displayOrder: i }));

// The nine computed-result properties persisted per scorecard submission. See
// lib/scorecard/hubspotResultProperties.js for the value mapping and units.
export const SCORECARD_RESULT_PROPERTIES = [
  {
    name: "scorecard_dollar_gap_total",
    label: "Scorecard Dollar Gap (Total)",
    description:
      "Peer-median total annual dollars the operating system is leaving on the table (sum of surfaced ROI-line gaps). Whole USD. Equals scorecard_gap_high.",
    type: "number",
    fieldType: "number",
    groupName: SCORECARD_PROPERTY_GROUP.name,
  },
  {
    name: "scorecard_gap_low",
    label: "Scorecard Dollar Gap (Low)",
    description:
      "Conservative (floor) end of the dollar-gap range shown on screen. Whole USD.",
    type: "number",
    fieldType: "number",
    groupName: SCORECARD_PROPERTY_GROUP.name,
  },
  {
    name: "scorecard_gap_high",
    label: "Scorecard Dollar Gap (High)",
    description:
      "Peer-median (high) end of the dollar-gap range shown on screen. Whole USD.",
    type: "number",
    fieldType: "number",
    groupName: SCORECARD_PROPERTY_GROUP.name,
  },
  {
    name: "scorecard_rpe_gap",
    label: "Scorecard Gap: Revenue per Employee",
    description:
      "Peer-median annual dollar gap on revenue per employee, or 0 if that line did not surface. Whole USD.",
    type: "number",
    fieldType: "number",
    groupName: SCORECARD_PROPERTY_GROUP.name,
  },
  {
    name: "scorecard_sales_cycle_gap",
    label: "Scorecard Gap: Sales Cycle",
    description:
      "Peer-median annual dollar gap from a slower-than-peer sales cycle, or 0 if that line did not surface. Whole USD.",
    type: "number",
    fieldType: "number",
    groupName: SCORECARD_PROPERTY_GROUP.name,
  },
  {
    name: "scorecard_retention_gap",
    label: "Scorecard Gap: Retention",
    description:
      "Peer-median annual dollar gap from below-peer gross revenue retention, or 0 if that line did not surface. Whole USD.",
    type: "number",
    fieldType: "number",
    groupName: SCORECARD_PROPERTY_GROUP.name,
  },
  // scorecard_maturity_stage retired with the stage placement (2026-08-14
  // Scan rebuild): the stage is computed in the audit now. The property may
  // still exist in HubSpot on old contacts; we just stop defining or writing
  // it. Its enum options constant was removed with it.
  {
    name: "scorecard_readiness_band",
    label: "Scorecard Readiness Band",
    description:
      "AI Readiness band from the Scan composite (mean of the nine dimension questions, 1-5). Provisional bands by design.",
    type: "enumeration",
    fieldType: "select",
    groupName: SCORECARD_PROPERTY_GROUP.name,
    options: READINESS_BAND_OPTIONS,
  },
  {
    name: "scorecard_composite",
    label: "Scorecard Readiness Composite",
    description: "Mean of the nine dimension questions (q5-q13), 1-5, one decimal.",
    type: "number",
    fieldType: "number",
    groupName: SCORECARD_PROPERTY_GROUP.name,
  },
  {
    name: "scorecard_dim_strategy",
    label: "Scorecard Dimension: AI Strategy",
    description: "AI Strategy and Use-Case Alignment dimension mean (q5-q7), 1-5.",
    type: "number",
    fieldType: "number",
    groupName: SCORECARD_PROPERTY_GROUP.name,
  },
  {
    name: "scorecard_dim_people",
    label: "Scorecard Dimension: People and Adoption",
    description: "People and Adoption Readiness dimension mean (q8-q10), 1-5.",
    type: "number",
    fieldType: "number",
    groupName: SCORECARD_PROPERTY_GROUP.name,
  },
  {
    name: "scorecard_dim_governance",
    label: "Scorecard Dimension: Governance and Trust",
    description: "Governance and Trust dimension mean (q11-q13), 1-5.",
    type: "number",
    fieldType: "number",
    groupName: SCORECARD_PROPERTY_GROUP.name,
  },
  {
    name: "scorecard_belief_confidence",
    label: "Scorecard Belief Probe (q4)",
    description:
      "Self-reported CRM data confidence, 1-5. Scored but not in the composite; exists to be contrasted with the audit's computed Data Readiness.",
    type: "number",
    fieldType: "number",
    groupName: SCORECARD_PROPERTY_GROUP.name,
  },
  {
    name: "scorecard_connect_comfort",
    label: "Scorecard Connect Comfort (q13)",
    description:
      "How much customer/pipeline data they would connect to an AI system today, 1-5. A 4-5 is a warmer audit prospect than the composite alone suggests.",
    type: "number",
    fieldType: "number",
    groupName: SCORECARD_PROPERTY_GROUP.name,
  },
  {
    name: "scorecard_burned_attempt",
    label: "Scorecard Burned Attempt (q5 flag)",
    description:
      "True when q5 = 'We tried a tool or two, but they did not stick'. The priority segment: this contact was burned once and got the why-it-did-not-stick diagnosis. Highest-value property of the set.",
    type: "bool",
    fieldType: "booleancheckbox",
    groupName: SCORECARD_PROPERTY_GROUP.name,
    options: BOOL_OPTIONS,
  },
  {
    name: "scorecard_url_given",
    label: "Scorecard Website Given",
    description: "True when the prospect gave a company website URL on the email gate (observed pass ran).",
    type: "bool",
    fieldType: "booleancheckbox",
    groupName: SCORECARD_PROPERTY_GROUP.name,
    options: BOOL_OPTIONS,
  },
  {
    name: "scorecard_top_gap",
    label: "Scorecard Top Gap",
    description:
      "Human label of the largest-dollar ROI line, or 'None' when no dollar gap surfaced.",
    type: "string",
    fieldType: "text",
    groupName: SCORECARD_PROPERTY_GROUP.name,
  },
  {
    name: "scorecard_business_model",
    label: "Scorecard Business Model",
    description: "Business-model segment answered in the scorecard (q2).",
    type: "enumeration",
    fieldType: "select",
    groupName: SCORECARD_PROPERTY_GROUP.name,
    options: BUSINESS_MODEL_ENUM_OPTIONS,
  },
  {
    name: "scorecard_completed_at",
    label: "Scorecard Completed At",
    description: "Timestamp the scorecard result was generated.",
    type: "datetime",
    fieldType: "date",
    groupName: SCORECARD_PROPERTY_GROUP.name,
  },
  {
    name: "scorecard_result_json",
    label: "Scorecard Result (JSON)",
    description: "Full computed scorecard result payload as JSON, for the email loop and audit.",
    type: "string",
    fieldType: "textarea",
    groupName: SCORECARD_PROPERTY_GROUP.name,
  },
  {
    name: "scorecard_pdf_url",
    label: "Scorecard PDF (HubSpot File ID)",
    description:
      "HubSpot Files id of the prospect's private branded scorecard PDF (folder scorecard-results). Mint a short-lived download link with GET /files/v3/files/{id}/signed-url.",
    type: "string",
    fieldType: "text",
    groupName: SCORECARD_PROPERTY_GROUP.name,
  },
];

// Pulls valid utm_* values from a request payload's `utms` field. Returns an
// object suitable for spreading into HubSpot contact properties. Empty/missing
// values are excluded so we never blank out an earlier first-touch attribution.
export function pickUtmProperties(utms) {
  if (!utms || typeof utms !== "object") return {};
  const allowed = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const out = {};
  for (const key of allowed) {
    const value = utms[key];
    if (typeof value === "string" && value.trim() !== "") {
      out[key] = value.trim().slice(0, 255);
    }
  }
  return out;
}

export function hsHeaders() {
  return {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    "Content-Type": "application/json",
  };
}

export function assertHubSpotConfigured() {
  if (!HUBSPOT_API_KEY) {
    throw new Error("HUBSPOT_API_KEY environment variable is not set");
  }
}

/**
 * Ensures the given set of custom properties exists on the contacts object.
 * Checks each, creates any that are missing. Idempotent and safe to call on every request;
 * caller passes a module-level flag to avoid re-running within the same cold start.
 */
export async function ensureCustomContactProperties(properties) {
  await Promise.all(
    properties.map(async (prop) => {
      const checkRes = await fetch(
        `${HUBSPOT_BASE}/crm/v3/properties/contacts/${prop.name}`,
        { headers: hsHeaders() }
      );

      if (checkRes.status === 404) {
        const createRes = await fetch(
          `${HUBSPOT_BASE}/crm/v3/properties/contacts`,
          {
            method: "POST",
            headers: hsHeaders(),
            body: JSON.stringify(prop),
          }
        );
        if (!createRes.ok) {
          const err = await createRes.text();
          console.error(`Failed to create property ${prop.name}:`, err);
        } else {
          console.log(`Created HubSpot contact property: ${prop.name}`);
        }
        return;
      }

      if (!checkRes.ok) return;

      // Property exists. For enumeration properties, reconcile options:
      // a pre-existing property may have a different option set (e.g. created
      // manually or by an older codepath), which causes form submissions to
      // fail with INVALID_OPTION. Union our options with the existing ones.
      if (prop.type !== "enumeration" || !Array.isArray(prop.options)) return;

      const existing = await checkRes.json();
      const existingValues = new Set(
        (existing.options || []).map((o) => o.value)
      );
      const missing = prop.options.filter((o) => !existingValues.has(o.value));
      if (missing.length === 0) return;

      const mergedOptions = [
        ...(existing.options || []),
        ...missing.map((o, i) => ({
          ...o,
          displayOrder: (existing.options?.length || 0) + i,
        })),
      ];

      const patchRes = await fetch(
        `${HUBSPOT_BASE}/crm/v3/properties/contacts/${prop.name}`,
        {
          method: "PATCH",
          headers: hsHeaders(),
          body: JSON.stringify({ options: mergedOptions }),
        }
      );
      if (!patchRes.ok) {
        const err = await patchRes.text();
        console.error(
          `Failed to merge options on property ${prop.name}:`,
          err
        );
      } else {
        console.log(
          `Merged ${missing.length} option(s) into HubSpot property: ${prop.name}`
        );
      }
    })
  );
}

/**
 * Ensures the "scorecard" contact property group exists, then ensures the nine
 * scorecard result properties exist inside it. The group must exist before the
 * properties (a property create with a missing groupName fails), so this is the
 * ordered wrapper the submit route calls. Idempotent and safe to call on every
 * request; the caller gates it behind a module-level flag per cold start.
 */
export async function ensureScorecardResultProperties() {
  await ensureContactPropertyGroup(SCORECARD_PROPERTY_GROUP);
  await ensureCustomContactProperties(SCORECARD_RESULT_PROPERTIES);
}

/**
 * Creates a contact property group if it does not already exist. A 409 (group
 * already exists) is treated as success. Non-fatal on other errors: logs and
 * returns so property creation can still be attempted.
 */
export async function ensureContactPropertyGroup(group) {
  const checkRes = await fetch(
    `${HUBSPOT_BASE}/crm/v3/properties/contacts/groups/${group.name}`,
    { headers: hsHeaders() }
  );
  if (checkRes.ok) return;

  const createRes = await fetch(
    `${HUBSPOT_BASE}/crm/v3/properties/contacts/groups`,
    { method: "POST", headers: hsHeaders(), body: JSON.stringify(group) }
  );
  if (!createRes.ok && createRes.status !== 409) {
    console.error(
      `Failed to create property group ${group.name}:`,
      await createRes.text()
    );
  } else if (createRes.ok) {
    console.log(`Created HubSpot contact property group: ${group.name}`);
  }
}

/**
 * Additively persist the computed scorecard result onto an existing contact via
 * a single PATCH. A PATCH does not re-stamp Original Source, so attribution set
 * at contact-create survives. This never touches the raw-input/UTM writes, the
 * form submission, hutk handling, or the no-auto-deal behavior. `properties` is
 * the flat object from mapResultToHubSpotProperties(). Non-fatal: returns false
 * on failure so the user still gets their on-screen result.
 */
export async function writeScorecardResultProperties(contactId, properties) {
  if (!contactId || !properties) return false;
  const clean = {};
  for (const [key, value] of Object.entries(properties)) {
    if (value === undefined || value === null) continue;
    clean[key] = value;
  }
  if (Object.keys(clean).length === 0) return false;

  const res = await fetch(
    `${HUBSPOT_BASE}/crm/v3/objects/contacts/${contactId}`,
    {
      method: "PATCH",
      headers: hsHeaders(),
      body: JSON.stringify({ properties: clean }),
    }
  );
  if (!res.ok) {
    console.error(
      "[writeScorecardResultProperties] failed:",
      await res.text()
    );
    return false;
  }
  return true;
}

/**
 * Upload a file to HubSpot Files. Defaults to PRIVATE access (never public) and
 * the given folder path (created on demand). Returns { id, url } from HubSpot,
 * where `id` is the stable file id used to mint signed download URLs. Throws on
 * failure so callers can decide whether to continue.
 *
 * Note: the Authorization header is set explicitly WITHOUT Content-Type so fetch
 * can attach the multipart/form-data boundary from the FormData body.
 */
export async function uploadPrivateFileToHubSpot({ buffer, fileName, folderPath = "/scorecard-results", access = "PRIVATE" }) {
  const form = new FormData();
  form.append("file", new Blob([buffer], { type: "application/pdf" }), fileName);
  form.append("fileName", fileName);
  form.append("folderPath", folderPath);
  form.append(
    "options",
    JSON.stringify({
      access,
      overwrite: false,
      duplicateValidationStrategy: "NONE",
      duplicateValidationScope: "EXACT_FOLDER",
    })
  );

  const res = await fetch(`${HUBSPOT_BASE}/files/v3/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${HUBSPOT_API_KEY}` },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`HubSpot file upload failed: ${await res.text()}`);
  }
  const data = await res.json();
  return { id: data.id, url: data.url };
}

/**
 * Mint a short-lived signed download URL for a private HubSpot file. Returns the
 * URL string or null on failure. This is how the email loop turns a stored
 * scorecard_pdf_url (file id) into a link the prospect can open.
 */
export async function getFileSignedUrl(fileId) {
  if (!fileId) return null;
  const res = await fetch(
    `${HUBSPOT_BASE}/files/v3/files/${fileId}/signed-url`,
    { headers: hsHeaders() }
  );
  if (!res.ok) {
    console.error("[getFileSignedUrl] failed:", await res.text());
    return null;
  }
  return (await res.json()).url || null;
}

/**
 * Create a Note associated to a contact, optionally with file attachments
 * (semicolon-separated file ids in hs_attachment_ids) so the PDF shows on the
 * contact timeline. Non-fatal: returns the note id or null on failure.
 */
export async function createContactNote({ contactId, body, attachmentIds }) {
  if (!contactId) return null;
  const properties = {
    hs_timestamp: String(Date.now()),
    hs_note_body: body || "",
  };
  if (attachmentIds) {
    properties.hs_attachment_ids = Array.isArray(attachmentIds)
      ? attachmentIds.join(";")
      : String(attachmentIds);
  }

  const res = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/notes`, {
    method: "POST",
    headers: hsHeaders(),
    body: JSON.stringify({
      properties,
      associations: [
        {
          to: { id: contactId },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 202, // note-to-contact
            },
          ],
        },
      ],
    }),
  });
  if (!res.ok) {
    console.error("[createContactNote] failed:", await res.text());
    return null;
  }
  return (await res.json()).id;
}

/**
 * Search for an existing contact by email, return their contact ID if found.
 */
export async function findContactByEmail(email) {
  const res = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers: hsHeaders(),
    body: JSON.stringify({
      filterGroups: [
        { filters: [{ propertyName: "email", operator: "EQ", value: email }] },
      ],
      limit: 1,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.total > 0 ? data.results[0].id : null;
}

/**
 * Look up whether a contact already has a deal in the RevOps Coaching pipeline.
 * Returns the existing deal id (string) or null.
 */
export async function findExistingRevopsDealForContact(contactId) {
  const assocRes = await fetch(
    `${HUBSPOT_BASE}/crm/v4/objects/contacts/${contactId}/associations/deals`,
    { method: "GET", headers: hsHeaders() }
  );
  if (!assocRes.ok) return null;
  const assoc = await assocRes.json();
  const dealIds = (assoc.results || []).map((r) => String(r.toObjectId));
  if (!dealIds.length) return null;

  const batchRes = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/deals/batch/read`, {
    method: "POST",
    headers: hsHeaders(),
    body: JSON.stringify({
      properties: ["pipeline", "dealstage"],
      inputs: dealIds.map((id) => ({ id })),
    }),
  });
  if (!batchRes.ok) return null;
  const batch = await batchRes.json();
  const match = (batch.results || []).find(
    (d) => d.properties?.pipeline === REVOPS_PIPELINE_ID
  );
  return match ? match.id : null;
}

/**
 * Upsert a contact by email. Updates if found, creates otherwise.
 * Returns { id, action: "created" | "updated" }.
 */
export async function upsertContactByEmail(email, properties) {
  if (!email) throw new Error("upsertContactByEmail requires an email");

  const existingId = await findContactByEmail(email);
  const body = JSON.stringify({ properties: { email, ...properties } });

  if (existingId) {
    const res = await fetch(
      `${HUBSPOT_BASE}/crm/v3/objects/contacts/${existingId}`,
      { method: "PATCH", headers: hsHeaders(), body }
    );
    if (!res.ok) {
      throw new Error(`Failed to update contact: ${await res.text()}`);
    }
    return { id: existingId, action: "updated" };
  }

  const res = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts`, {
    method: "POST",
    headers: hsHeaders(),
    body,
  });
  if (!res.ok) {
    throw new Error(`Failed to create contact: ${await res.text()}`);
  }
  const created = await res.json();
  return { id: created.id, action: "created" };
}

/**
 * Create a HubSpot task associated with a contact, assigned to an owner.
 * Tasks generate native HubSpot email + in-app notifications to the assignee.
 * This is our Starter-tier alternative to workflow-based notifications.
 */
export async function createContactTask({
  contactId,
  subject,
  body,
  ownerId = BRADLEY_OWNER_ID,
  priority = "HIGH",
  dueInHours = 0,
}) {
  const timestamp = Date.now() + dueInHours * 60 * 60 * 1000;

  const res = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/tasks`, {
    method: "POST",
    headers: hsHeaders(),
    body: JSON.stringify({
      properties: {
        hs_task_subject: subject,
        hs_task_body: body,
        hs_task_status: "NOT_STARTED",
        hs_task_priority: priority,
        hs_task_type: "TODO",
        hs_timestamp: String(timestamp),
        hubspot_owner_id: ownerId,
      },
      associations: [
        {
          to: { id: contactId },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 204, // task-to-contact
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Failed to create task:", err);
    return null;
  }
  return (await res.json()).id;
}

/**
 * Submit a lead to the shared HubSpot form via the non-secure Forms
 * integration endpoint. The hubspotutk cookie passed in context.hutk attaches
 * the visitor's session so HubSpot attributes Original Source on contact
 * create. `properties` is a flat object; empty/non-string values are dropped.
 * Returns { ok } so callers can decide whether to continue.
 */
export async function submitHubSpotForm({ properties, context }) {
  if (!HUBSPOT_PORTAL_ID || !HUBSPOT_LEAD_FORM_GUID) {
    throw new Error(
      "HUBSPOT_PORTAL_ID and HUBSPOT_LEAD_FORM_GUID must be set (run scripts/setup-hubspot-forms.mjs)"
    );
  }

  const fields = Object.entries(properties || {})
    .filter(([, v]) => typeof v === "string" && v.trim() !== "")
    .map(([name, value]) => ({ name, value }));

  const ctx = {};
  if (context?.hutk) ctx.hutk = context.hutk;
  if (context?.pageUri) ctx.pageUri = context.pageUri;
  if (context?.pageName) ctx.pageName = context.pageName;

  const res = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_LEAD_FORM_GUID}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields, context: ctx }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("[submitHubSpotForm] submission failed:", err);
    return { ok: false, error: err };
  }
  return { ok: true };
}

/**
 * Write utm_content onto a contact only if it is currently empty (write-if-empty).
 *
 * The booking path (HubSpot Meetings on /watch and /book) creates the contact
 * with native source/medium/campaign attribution but never captures
 * content-level (asset-variant) attribution. This back-fills utm_content from
 * the landing URL so a booked call can be tied to the exact tagged effort that
 * produced it. First-touch wins: a contact that already carries a utm_content
 * from an earlier touch is never overwritten. A PATCH does not re-stamp Original
 * Source, so existing attribution survives. Returns true if a value was written.
 */
export async function writeUtmContentIfEmpty(contactId, utmContent) {
  if (!contactId) return false;
  const value =
    typeof utmContent === "string" ? utmContent.trim().slice(0, 255) : "";
  if (!value) return false; // untagged visitor: never write an empty/literal value

  const getRes = await fetch(
    `${HUBSPOT_BASE}/crm/v3/objects/contacts/${contactId}?properties=utm_content`,
    { headers: hsHeaders() }
  );
  if (!getRes.ok) {
    console.error("[writeUtmContentIfEmpty] read failed:", await getRes.text());
    return false;
  }
  const existing = (await getRes.json())?.properties?.utm_content;
  if (typeof existing === "string" && existing.trim() !== "") return false;

  const patchRes = await fetch(
    `${HUBSPOT_BASE}/crm/v3/objects/contacts/${contactId}`,
    {
      method: "PATCH",
      headers: hsHeaders(),
      body: JSON.stringify({ properties: { utm_content: value } }),
    }
  );
  if (!patchRes.ok) {
    console.error("[writeUtmContentIfEmpty] write failed:", await patchRes.text());
    return false;
  }
  return true;
}

/**
 * Mark a contact as a new lead awaiting manual qualification: lifecycle stage
 * Lead, hs_lead_status NEW. A PATCH does not re-stamp Original Source, so any
 * attribution set on create survives. Non-fatal: returns false on failure.
 */
export async function markContactForReview(contactId) {
  if (!contactId) return false;
  const res = await fetch(
    `${HUBSPOT_BASE}/crm/v3/objects/contacts/${contactId}`,
    {
      method: "PATCH",
      headers: hsHeaders(),
      body: JSON.stringify({
        properties: { lifecyclestage: "lead", hs_lead_status: "NEW" },
      }),
    }
  );
  if (!res.ok) {
    console.error("[markContactForReview] failed:", await res.text());
    return false;
  }
  return true;
}
