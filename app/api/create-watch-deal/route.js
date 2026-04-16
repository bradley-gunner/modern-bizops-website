import { NextResponse } from "next/server";
import {
  HUBSPOT_BASE,
  REVOPS_PIPELINE_ID,
  BRADLEY_OWNER_ID,
  hsHeaders,
  assertHubSpotConfigured,
  findContactByEmail,
} from "@/lib/hubspot";

const NEW_LEAD_STAGE = "3477396169";

/**
 * POST /api/create-watch-deal
 *
 * Called client-side after a prospect books a discovery call via the /watch
 * page (VSSL funnel). HubSpot Meetings auto-creates the contact, but the
 * Starter plan cannot auto-create deals. This route closes that gap.
 *
 * Expects JSON body: { email: string, firstName?: string, lastName?: string }
 *
 * Creates a deal in the RevOps Coaching pipeline at the "New Lead" stage
 * with no amount (we don't have revenue data from the /watch path).
 */
export async function POST(request) {
  try {
    assertHubSpotConfigured();

    const body = await request.json();
    const { email, firstName, lastName } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find the contact HubSpot Meetings just created.
    // findContactByEmail returns the contact ID string, or null.
    const contactId = await findContactByEmail(email);

    if (!contactId) {
      // HubSpot Meetings may take a moment to create the contact.
      // Return success anyway so the client-side redirect isn't blocked.
      // The deal can be created manually or via a retry mechanism later.
      console.warn(
        `[create-watch-deal] Contact not found for ${email}. ` +
          `HubSpot Meetings may not have finished creating the record yet.`
      );
      return NextResponse.json({
        success: false,
        reason: "contact_not_found",
        email,
      });
    }

    const contactName =
      [firstName, lastName].filter(Boolean).join(" ") || email;

    // Create the deal
    const dealRes = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/deals`, {
      method: "POST",
      headers: hsHeaders(),
      body: JSON.stringify({
        properties: {
          dealname: `RevOps Coaching \u2014 ${contactName}`,
          pipeline: REVOPS_PIPELINE_ID,
          dealstage: NEW_LEAD_STAGE,
          dealtype: "newbusiness",
          engagement_type: "DWY Coaching",
          project_type: "RevOps Coaching",
          hubspot_owner_id: BRADLEY_OWNER_ID,
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
      const errBody = await dealRes.text();
      console.error("[create-watch-deal] HubSpot deal creation failed:", errBody);
      return NextResponse.json(
        { error: "Failed to create deal", details: errBody },
        { status: 502 }
      );
    }

    const deal = await dealRes.json();
    console.log(
      `[create-watch-deal] Deal ${deal.id} created for ${email} (contact ${contactId})`
    );

    return NextResponse.json({
      success: true,
      dealId: deal.id,
      contactId,
    });
  } catch (err) {
    console.error("[create-watch-deal] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
