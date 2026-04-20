import Image from "next/image";
import Section from "../ui/Section";

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
              I&apos;ve spent 15+ years inside the machine. Not advising from
              the outside, but in the seat, building the revenue operations that
              powered high-growth, VC-backed startups.
            </p>
            <p>
              I&apos;ve worked as an individual contributor in sales, marketing,
              and customer support. I know what it actually feels like to work
              these jobs, and to have processes that either help you or make
              your life harder.
            </p>
            <p>
              I&apos;ve seen firsthand how the right operational architecture
              turns a chaotic $5M company into a scalable $15M company without
              doubling the team. And I&apos;ve seen what happens when companies
              try to grow without it.
            </p>
            <p>
              I built Modern BizOps to bring startup-grade revenue operations to
              small and mid-size businesses. Because the playbooks that work
              shouldn&apos;t be locked behind a $200K executive hire or a
              six-figure agency retainer.
            </p>
          </div>

          {/* Brendan Troy quote */}
          <blockquote className="mt-8 pl-5 border-l-4 border-amber">
            <p className="font-display text-lg md:text-xl italic text-navy leading-snug mb-2">
              &ldquo;Bradley checks all the boxes. His greatest strengths fall outside the standard roles and responsibilities.&rdquo;
            </p>
            <footer className="font-body text-sm text-text-mid font-medium">
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
