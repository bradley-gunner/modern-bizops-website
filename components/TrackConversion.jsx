"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trackLeadGenerated } from "@/lib/analytics";

export default function TrackConversion() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Read the internal page-context param (`from`), with a legacy `source`
    // fallback for redirects already in flight. `method` is a non-reserved
    // GA4 param, so this never relabels the session's traffic source.
    const from = searchParams.get("from") || searchParams.get("source");
    const method = from === "watch" ? "watch_funnel" : "book_call_funnel";
    trackLeadGenerated(method);
  }, [searchParams]);

  return null;
}
