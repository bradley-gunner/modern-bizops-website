import Section from "../ui/Section";

const steps = [
  {
    title: "Connect",
    description: "You connect your existing tools (CRM, marketing platform, accounting software)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    title: "Diagnose",
    description: "My custom-built diagnostic app analyzes your real data across 7 dimensions",
    differentiator: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: "Discover",
    description: "We do in-depth interviews with your team to understand the human side",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Plan",
    description: "I deliver a custom roadmap to fix the specific problems we found",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
      </svg>
    ),
  },
  {
    title: "Coach",
    description: "I coach you and your team to implement the solutions on weekly calls",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    title: "Measure",
    description: "We track KPIs until you achieve the results you're looking for",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <Section bg="cream" id="how-it-works" narrow={false}>
      <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-6 text-center">
        How It Works
      </h2>

      {/* Diagnostic platform framing */}
      <div className="max-w-[720px] mx-auto mb-12 space-y-4 font-body text-text-primary text-base leading-relaxed">
        <p className="font-semibold text-navy text-lg">
          Most consultants hand you a binder and wish you luck. I built something different.
        </p>
        <p>
          You get access to a custom platform that connects to the tools your team already uses and analyzes your real data. If that data is messy (and for most businesses at your stage, it is), the diagnostic does not give you bad readings. It shows you where your data has gaps and makes fixing that part of the work, not a prerequisite.
        </p>
        <p>
          The platform guides the entire engagement: your baseline score, your custom roadmap, your KPIs tracked in real time. As we work through each phase on weekly coaching calls, you watch your numbers move in a live dashboard built around your business. Not a spreadsheet I email you.
        </p>
        <p className="font-medium text-navy">
          By the time we&apos;re done, you have a before-and-after scorecard that proves exactly what changed.
        </p>
      </div>

      {/* ── DESKTOP: 6-column horizontal flow ── */}
      <div className="hidden lg:block relative">
        {/* Horizontal connector line spanning circle centers */}
        <div
          className="absolute top-7 h-px bg-border"
          style={{ left: "calc(100% / 12)", right: "calc(100% / 12)" }}
        />

        <div className="grid grid-cols-6 gap-4">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center gap-3">
              {/* Amber number circle — sits on the connector line */}
              <div className="relative z-10 w-14 h-14 rounded-full bg-amber flex items-center justify-center shrink-0 shadow-sm">
                <span className="font-display text-xl font-semibold text-white leading-none">
                  {i + 1}
                </span>
              </div>

              {/* Icon */}
              <div className="text-navy mt-1">{step.icon}</div>

              {/* Title */}
              <h3 className="font-display text-lg font-semibold text-navy leading-tight">
                {step.title}
              </h3>

              {/* Description */}
              {step.differentiator ? (
                <p className="font-body text-sm text-text-mid leading-relaxed">
                  My{" "}
                  <span className="font-semibold text-amber">
                    custom-built diagnostic app
                  </span>{" "}
                  analyzes your real data across 7 dimensions
                </p>
              ) : (
                <p className="font-body text-sm text-text-mid leading-relaxed">
                  {step.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── MOBILE: vertical stack with connector line ── */}
      <div className="lg:hidden flex flex-col">
        {steps.map((step, i) => (
          <div key={step.title} className="relative flex gap-5">
            {/* Left column: circle + vertical line */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-14 h-14 rounded-full bg-amber flex items-center justify-center shrink-0 shadow-sm z-10">
                <span className="font-display text-xl font-semibold text-white leading-none">
                  {i + 1}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-px flex-1 bg-border my-1" />
              )}
            </div>

            {/* Right column: icon + title + description */}
            <div className={`pb-8 ${i === steps.length - 1 ? "pb-0" : ""}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-navy">{step.icon}</div>
                <h3 className="font-display text-lg font-semibold text-navy">
                  {step.title}
                </h3>
              </div>

              {step.differentiator ? (
                <p className="font-body text-sm text-text-mid leading-relaxed">
                  My{" "}
                  <span className="font-semibold text-amber">
                    custom-built diagnostic app
                  </span>{" "}
                  analyzes your real data across 7 dimensions
                </p>
              ) : (
                <p className="font-body text-sm text-text-mid leading-relaxed">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
