import { NextResponse } from "next/server";
import {
  assertHubSpotConfigured,
  upsertContactByEmail,
  createContactTask,
  ensureCustomContactProperties,
  UTM_CUSTOM_PROPERTIES,
  pickUtmProperties,
} from "@/lib/hubspot";

let propertiesEnsured = false;

export async function POST(request) {
  try {
    assertHubSpotConfigured();

    const data = await request.json();

    if (!data.email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const nameParts = (data.name || "").trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    if (!propertiesEnsured) {
      await ensureCustomContactProperties(UTM_CUSTOM_PROPERTIES);
      propertiesEnsured = true;
    }

    const props = {};
    if (firstName) props.firstname = firstName;
    if (lastName) props.lastname = lastName;
    if (data.company) props.company = data.company;
    Object.assign(props, pickUtmProperties(data.utms));

    const result = await upsertContactByEmail(data.email, props);

    createContactTask({
      contactId: result.id,
      subject: `Playbook download — ${data.email}`,
      body: [
        `${data.name || data.email} downloaded the Headcount Optimizer Playbook.`,
        data.company ? `Company: ${data.company}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      priority: "MEDIUM",
    });

    return NextResponse.json({
      success: true,
      contactId: result.id,
      action: result.action,
    });
  } catch (error) {
    console.error("Playbook form submit error:", error);
    return NextResponse.json(
      { error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
