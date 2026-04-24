import Image from "next/image";
import Section from "../ui/Section";

const credentialStats = [
  "15 Years in RevOps",
  "25 Businesses Served",
  "HubSpot Certified Partner",
];

export default function AboutCoach() {
  return (
    <Section bg="cream">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <div className="flex-shrink-0">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-[14px] overflow-hidden">
            <Image
              src="/images/bradley-desk.jpg"
              alt="Bradley de Wet, founder of Modern BizOps"
              width={224}
              height={224}
              sizes="(max-width: 768px) 192px, 224px"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-6">
            Meet Bradley
          </h2>

          <div className="space-y-5 font-body text-text-primary text-base leading-relaxed">
            <p>
              15 years in revenue operations, across 25 companies ranging from
              seed-stage startups to established mid-market businesses. I have
              built and scaled sales, marketing, and customer success teams from
              scratch, and worked in the seat in all three functions, not just as
              an outside advisor.
            </p>
            <p>
              I kept seeing the same thing: good companies with talented people,
              stalling out because their operations could not keep up with their
              ambition. Sales and marketing misaligned. Customer data siloed.
              Leaders making decisions on gut instead of numbers. I built a
              methodology and a custom diagnostic platform to fix these problems
              systematically, so the solutions stick and the results are
              measurable.
            </p>
          </div>

          {/* Credential stats */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {credentialStats.map((stat, i) => (
              <span key={stat} className="flex items-center gap-2 font-body text-sm text-text-mid">
                {i > 0 && <span className="text-border hidden sm:inline" aria-hidden="true">|</span>}
                <span className="font-semibold text-navy">{stat}</span>
              </span>
            ))}
          </div>

          {/* Brendan Troy quote */}
          <blockquote className="mt-8 pl-5 border-l-4 border-amber">
            <p className="font-display text-lg md:text-xl italic text-navy leading-snug mb-2">
              &ldquo;Bradley checks all the boxes. His greatest strengths fall outside the standard roles and responsibilities.&rdquo;
            </p>
            <footer className="flex items-center gap-3 font-body text-sm text-text-mid font-medium">
              <Image
                src="/images/brendan-troy.jpeg"
                alt="Brendan Troy"
                width={48}
                height={48}
                sizes="48px"
                className="w-12 h-12 rounded-full object-cover border-2 border-border shrink-0"
              />
              Brendan Troy, GTM Operator, 2 Successful Exits
            </footer>
          </blockquote>

          {/* HubSpot certifications */}
          <div className="mt-6 flex flex-wrap gap-2">
            {["HubSpot Revenue Operations Certified", "HubSpot Solutions Partner"].map((cert) => (
              <span
                key={cert}
                className="inline-flex items-center gap-1.5 font-body text-xs font-medium text-amber border border-amber/30 bg-amber-pale rounded-full px-3 py-1"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
