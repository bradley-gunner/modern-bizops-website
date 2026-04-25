import Image from "next/image";
import Section from "../ui/Section";
import Button from "../ui/Button";
import BrowserFrame from "../ui/BrowserFrame";

export default function ScorecardCTA() {
  return (
    <Section bg="navy" narrow={false}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-12 lg:gap-16 items-center">
        {/* Text column (60%) */}
        <div className="md:col-span-3 space-y-5 text-left">
          <p className="font-body text-sm font-semibold text-amber uppercase tracking-widest">
            Free Tool
          </p>
          <h2 className="font-display text-[28px] md:text-[34px] font-semibold text-white leading-tight">
            Not Ready for a Call Yet?
          </h2>
          <p className="font-body text-white/90 text-base md:text-lg leading-relaxed">
            Get your free Revenue Engine Health Score. Answer 17 questions and
            see exactly where your growth is leaking. Instant results. No call
            required.
          </p>
          <div className="pt-2">
            <Button href="/scorecard" size="large">
              Get My Free Score
            </Button>
          </div>
        </div>

        {/* Image column (40%) */}
        <div className="md:col-span-2">
          <BrowserFrame
            url="modernbizops.com/scorecard"
            variant="dark"
            aspectRatio="1187/804"
          >
            <Image
              src="/images/mockups/scorecard-results.png"
              alt="Revenue Engine Health Score results page showing an 80 out of 100 Grade A score for Sarah at ClearPath Solutions, with a 7-dimension breakdown including GTM Strategy and Market Positioning, Sales and Marketing Alignment, Sales Process and Pipeline Health, and Tech Stack and Data Governance"
              fill
              sizes="(max-width: 768px) 100vw, 460px"
              className="object-cover"
            />
          </BrowserFrame>
        </div>
      </div>
    </Section>
  );
}
