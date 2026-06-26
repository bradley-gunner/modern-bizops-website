"use client";

import { useEffect } from "react";
import { captureUtms } from "@/lib/utm";
import { setClarityTrafficTags } from "@/lib/analytics";

// Mounts once at the root of the app and captures inbound UTM params on first
// visit. Stored in sessionStorage and forwarded to HubSpot on form submit, and
// mirrored to Clarity as session tags so recordings are filterable by source.
export default function UtmCapture() {
  useEffect(() => {
    captureUtms();
    setClarityTrafficTags();
  }, []);
  return null;
}
