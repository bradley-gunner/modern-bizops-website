import { NextResponse } from "next/server";
import {
  assertHubSpotConfigured,
  ensureCustomContactProperties,
  submitHubSpotForm,
  markContactForReview,
  findContactByEmail,
  createContactTask,
  pickUtmProperties,
  UTM_CUSTOM_PROPERTIES,
  LEAD_MAGNET_PROPERTY,
} from "@/lib/hubspot";

let propertiesEnsured = false;

export async function POST(request) {
  try {
    assertHubSpotConfigured();

    const data = await request.json();

    if (!data.email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const nameParts = (data.name || "").trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    if (!propertiesEnsured) {
      await ensureCustomContactProperties([
        ...UTM_CUSTOM_PROPERTIES,
        LEAD_MAGNET_PROPERTY,
      ]);
      propertiesEnsured = true;
    }

    // Submit through the HubSpot form so the hutk cookie attaches the visitor
    // session for Original Source attribution. No deal is created.
    const submission = await submitHubSpotForm({
      properties: {
        email: data.email,
        firstname: firstName,
        lastname: lastName,
        company: data.company || "",
        lead_magnet: "playbook",
        ...pickUtmProperties(data.utms),
      },
      context: { hutk: data.hutk, pageUri: data.pageUri, pageName: data.pageName },
    });

    if (!submission.ok) {
      return NextResponse.json(
        { error: "Failed to process your request. Please try again." },
        { status: 502 }
      );
    }

    const contactId = await findContactByEmail(data.email);

    if (contactId) {
      await markContactForReview(contactId);
      createContactTask({
        contactId,
        subject: `New lead to qualify: ${data.name || data.email} (Playbook)`,
        body: [
          `${data.name || data.email} downloaded the Revenue Maturity Playbook.`,
          data.company ? `Company: ${data.company}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
        priority: "MEDIUM",
      });
    }

    return NextResponse.json({ success: true, contactId });
  } catch (error) {
    console.error("Playbook form submit error:", error);
    return NextResponse.json(
      { error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
