"use client";

import Link from "next/link";
import { trackCTAClick } from "@/lib/analytics";

export default function Button({
  href,
  children,
  variant = "primary",
  size = "default",
  className = "",
  onClick,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-body font-semibold transition-colors duration-200 rounded-full";

  const variants = {
    primary: "bg-amber text-white hover:bg-amber-hover",
    secondary:
      "bg-white text-navy border border-border hover:border-navy-mid",
    ghost: "text-navy-mid hover:text-navy underline underline-offset-4",
  };

  const sizes = {
    default: "px-8 py-3.5 text-base",
    large: "px-10 py-4 text-lg",
    small: "px-6 py-2.5 text-sm",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  // Map internal funnel destinations to analytics labels. Extend this as new
  // funnel pages are added so every CTA shows up in GA4 without a one-off
  // onClick at every call site.
  const CTA_DESTINATIONS = {
    "/book": "book_call",
    "/watch": "watch",
    "/scorecard": "scorecard",
    "/playbook": "playbook",
  };

  const handleClick = (e) => {
    const destination = CTA_DESTINATIONS[href];
    if (destination) {
      const label = typeof children === "string" ? children : destination;
      trackCTAClick(destination, label);
    }
    if (onClick) onClick(e);
  };

  if (href) {
    return (
      <Link href={href} className={classes} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
