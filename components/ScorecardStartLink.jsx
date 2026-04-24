"use client";

import { trackCTAClick, trackEvent } from "@/lib/analytics";

/**
 * Outbound link from the /scorecard marketing page to the scorecard app on
 * app.modernbizops.com. Fires a GA4 `scorecard_start` event (proxy for
 * scorecard completion intent, since the scorecard itself lives on a
 * subdomain and we can't observe its completion from here).
 *
 * Also fires `cta_click` so the button shows up in the standard CTA report.
 */
export default function ScorecardStartLink({
  href,
  className = "",
  label,
  children,
}) {
  const ctaLabel = label || (typeof children === "string" ? children : "scorecard_start");

  const handleClick = () => {
    trackCTAClick("scorecard_app", ctaLabel);
    trackEvent("scorecard_start", {
      destination: href,
      cta_label: ctaLabel,
    });
  };

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
