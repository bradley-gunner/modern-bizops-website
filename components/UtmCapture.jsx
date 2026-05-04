"use client";

import { useEffect } from "react";
import { captureUtms } from "@/lib/utm";

// Mounts once at the root of the app and captures inbound UTM params on first
// visit. Stored in sessionStorage and forwarded to HubSpot on form submit.
export default function UtmCapture() {
  useEffect(() => {
    captureUtms();
  }, []);
  return null;
}
