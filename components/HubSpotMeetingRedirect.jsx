"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { getUtms } from "@/lib/utm";

/**
 * Listens for HubSpot Meetings' `meetingBookSucceeded` postMessage event.
 *
 * /book path:  email and firstName are passed as props (from the qualifying
 *              form state). The contact is already handled by /api/submit-form
 *              before this component fires, so we just redirect.
 *
 * /watch path: No qualifying form, so email/firstName come from the HubSpot
 *              Meetings payload. We fire /api/capture-watch-lead to flag the
 *              Meetings-created contact for the qualification queue (no deal),
 *              then redirect.
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

      // Fire a GA4 event at the exact moment HubSpot confirms the booking.
      // This sits upstream of the thank-you page `generate_lead` event so we
      // can measure drop-off between meeting-booked and thank-you-loaded if
      // there's ever a redirect issue.
      //
      // The page name ("watch" / "book") is reported as `booking_page`, NOT
      // `source`. GA4 reserves `source`/`medium`/`campaign` as traffic-source
      // parameters, so sending `source: "watch"` would relabel the session to a
      // phantom `watch` acquisition source and corrupt the conversion's real
      // channel attribution.
      trackEvent("book_call_succeeded", {
        booking_page: source,
        has_email: Boolean(bookerEmail),
      });

      // For /watch bookings, flag the Meetings-created contact for the
      // qualification queue. No deal is created here. Forward utm_content from
      // the landing URL so the booked call carries content-level attribution
      // (HubSpot Meetings records source/medium/campaign but not utm_content).
      if (source === "watch" && bookerEmail) {
        try {
          await fetch("/api/capture-watch-lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: bookerEmail,
              firstName: bookerFirstName,
              lastName: bookerLastName,
              utm_content: getUtms().utm_content,
            }),
          });
          // Fire-and-forget: don't block the redirect. If it fails, the contact
          // still exists and Bradley can flag it manually from HubSpot.
        } catch (err) {
          console.error("[HubSpotMeetingRedirect] Lead capture failed:", err);
        }
      }

      // Redirect to thank-you page with available params. The page context is
      // passed as `from` (internal-only), never `source`: a `source` query param
      // can be read as a campaign/utm source, which is the bug this avoids.
      const params = new URLSearchParams({ from: source });
      if (bookerEmail) params.set("email", bookerEmail);
      if (bookerFirstName) params.set("firstName", bookerFirstName);
      router.push(`/thank-you?${params.toString()}`);
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [source, email, firstName, router]);

  return null;
}
