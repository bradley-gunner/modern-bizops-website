"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Listens for the HubSpot Meetings `meetingBookSucceeded` postMessage event
 * and redirects to /thank-you with context. When email/firstName are
 * available (e.g. from the /book two-step form), they're passed along so
 * /thank-you can pre-fill the prep-questionnaire deep link.
 */
export default function HubSpotMeetingRedirect({ source, email, firstName }) {
  const router = useRouter();

  useEffect(() => {
    const handler = (event) => {
      if (
        event.origin.includes("hubspot") &&
        event.data?.meetingBookSucceeded
      ) {
        const params = new URLSearchParams({ source });
        if (email) params.set("email", email);
        if (firstName) params.set("firstName", firstName);
        router.push(`/thank-you?${params.toString()}`);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [source, email, firstName, router]);

  return null;
}
