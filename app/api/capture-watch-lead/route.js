import { NextResponse } from "next/server";
import {
  assertHubSpotConfigured,
  findContactByEmail,
  markContactForReview,
  createContactTask,
} from "@/lib/hubspot";

/**
 * POST /api/capture-watch-lead
 *
 * Called client-side after a prospect books a discovery call via /watch.
 * HubSpot Meetings creates the contact (with native attribution). This route
 * flags that contact for the manual qualification queue (lifecycle Lead,
 * hs_lead_status NEW) and notifies Bradley with a task. It does NOT create a
 * deal: a booked call is not a qualified opportunity. Bradley creates the deal
 * manually after qualifying. Booked-call leads carry
 * engagements_last_meeting_booked_* so they are the hotter segment to triage.
 *
 * Expects JSON body: { email: string, firstName?: string, lastName?: string }
 */
export async function POST(request) {
  try {
    assertHubSpotConfigured();

    const { email, firstName, lastName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const contactId = await findContactByEmail(email);

    if (!contactId) {
      // Meetings may not have finished creating the contact. Don't block the
      // client redirect; Bradley can flag lifecycle from the queue.
      console.warn(
        `[capture-watch-lead] Contact not found for ${email}. ` +
          `HubSpot Meetings may not have finished creating the record yet.`
      );
      return NextResponse.json({
        success: false,
        reason: "contact_not_found",
        email,
      });
    }

    await markContactForReview(contactId);

    const contactName = [firstName, lastName].filter(Boolean).join(" ") || email;
    createContactTask({
      contactId,
      subject: `New lead to qualify: ${contactName} (Booked call)`,
      body: `${contactName} booked a discovery call via /watch. Review and qualify before creating a deal.`,
      priority: "HIGH",
      dueInHours: 24,
    });

    return NextResponse.json({ success: true, contactId });
  } catch (err) {
    console.error("[capture-watch-lead] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
