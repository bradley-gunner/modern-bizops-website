"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trackLeadGenerated } from "@/lib/analytics";

export default function TrackConversion() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const source = searchParams.get("source");
    const method = source === "watch" ? "watch_funnel" : "book_call_funnel";
    trackLeadGenerated(method);
  }, [searchParams]);

  return null;
}
