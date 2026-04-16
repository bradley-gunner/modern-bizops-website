"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Listens for HubSpot Meetings' `meetingBookSucceeded` postMessage event.
 *
 * /book path:  email and firstName are passed as props (from the qualifying
 *              form state). Deal is already created by /api/submit-form before
 *              this component fires, so we just redirect.
 *
 * /watch path: No qualifying form, so email/firstName come from the HubSpot
 *              Meetings payload. We fire /api/create-watch-deal to create a
 *              deal at the "New Lead" stage, then redirect.
 */
export default function HubSpotMeetingRedirect({ source, email, firstName }) {
  const router = useRouter();

  useEffect(() => {
    const handler = async (event) => {
      if (
        !event.origin.includes("hubspot") ||
        !event.data?.meetingBookSucceeded
      ) {
        return;
      }

      // Extract contact info from the HubSpot Meetings payload
      const payload = event.data?.meetingsPayload;
      const postResponse = payload?.bookingResponse?.postResponse;
      const contactData = postResponse?.contact;

      // Use props if available (from /book form), otherwise pull from payload
      const bookerEmail =
        email || contactData?.email || contactData?.properties?.email;
      const bookerFirstName =
        firstName ||
        contactData?.firstname ||
        contactData?.properties?.firstname;
      const bookerLastName =
        contactData?.lastname || contactData?.properties?.lastname;

      // For /watch bookings, create the deal that HubSpot Meetings can't
      if (source === "watch" && bookerEmail) {
        try {
          await fetch("/api/create-watch-deal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: bookerEmail,
              firstName: bookerFirstName,
              lastName: bookerLastName,
            }),
          });
          // Fire-and-forget: don't block the redirect on deal creation.
          // If it fails, the contact still exists and Bradley can create
          // the deal manually from HubSpot.
        } catch (err) {
          console.error("[HubSpotMeetingRedirect] Deal creation failed:", err);
        }
      }

      // Redirect to thank-you page with available params
      const params = new URLSearchParams({ source });
      if (bookerEmail) params.set("email", bookerEmail);
      if (bookerFirstName) params.set("firstName", bookerFirstName);
      router.push(`/thank-you?${params.toString()}`);
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [source, email, firstName, router]);

  return null;
}
