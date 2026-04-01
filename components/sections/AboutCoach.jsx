import Section from "../ui/Section";

export default function AboutCoach() {
  return (
    <Section bg="white">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Photo placeholder */}
        <div className="flex-shrink-0">
          <div className="w-48 h-48 md:w-56 md:h-56 bg-cream-dark rounded-[14px] border border-border flex items-center justify-center">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-text-light mb-2"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0"
                />
              </svg>
              <p className="font-body text-xs text-text-light">Photo</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-6">
            Meet Bradley
          </h2>
          <div className="space-y-5 font-body text-text-primary text-base leading-relaxed">
            <p>
              I&apos;ve spent 15+ years inside the machine — not advising from
              the outside, but in the seat, building the revenue operations that
              powered high-growth, VC-backed startups.
            </p>
            <p>
              I&apos;ve worked as an individual contributor in sales, marketing,
              and customer support. I know what it actually feels like to work
              these jobs — and to have processes that either help you or make
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
        </div>
      </div>
    </Section>
  );
}
