"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HubSpotMeetingRedirect({ source }) {
  const router = useRouter();

  useEffect(() => {
    const handler = (event) => {
      if (
        event.origin.includes("hubspot") &&
        event.data?.meetingBookSucceeded
      ) {
        router.push(`/thank-you?source=${source}`);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [source, router]);

  return null;
}
