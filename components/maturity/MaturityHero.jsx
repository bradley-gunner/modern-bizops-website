"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";

export default function MaturityHero({ variant }) {
  useEffect(() => {
    trackEvent("pillar_hero_view", { hero_variant: variant.id });
  }, [variant.id]);

  return (
    <section className="bg-cream border-b border-border">
      <div className="mx-auto max-w-[880px] px-6 md:px-8 py-16 md:py-24 text-center">
        <h1 className="font-display font-semibold text-navy text-4xl md:text-5xl leading-tight">
          {variant.h1}
        </h1>
        <p className="mt-5 text-lg text-text-mid max-w-[60ch] mx-auto">
          {variant.sub}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/scorecard">Get your Revenue Maturity Score</Button>
          <Button href="#the-four-stages" variant="secondary">
            Explore the model
          </Button>
        </div>
      </div>
    </section>
  );
}
