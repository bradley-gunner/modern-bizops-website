import Image from "next/image";
import Section from "../ui/Section";
import BrowserFrame from "../ui/BrowserFrame";

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
      <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-5 text-center">
        How It Works
      </h2>

      {/* Lead hook — sits above the timeline */}
      <p className="font-body text-navy text-lg md:text-xl font-medium text-center max-w-[720px] mx-auto mb-14">
        Most consultants hand you a binder and wish you luck. I built something different.
      </p>

      {/* ── Timeline: 6-step flow (moved up, right under the title) ── */}
      {/* Desktop horizontal */}
      <div className="hidden lg:block relative mb-20">
        <div
          className="absolute top-7 h-px bg-border"
          style={{ left: "calc(100% / 12)", right: "calc(100% / 12)" }}
        />

        <div className="grid grid-cols-6 gap-4">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center gap-3">
              <div className="relative z-10 w-14 h-14 rounded-full bg-amber flex items-center justify-center shrink-0 shadow-sm">
                <span className="font-display text-xl font-semibold text-white leading-none">
                  {i + 1}
                </span>
              </div>

              <div className="text-navy mt-1">{step.icon}</div>

              <h3 className="font-display text-lg font-semibold text-navy leading-tight">
                {step.title}
              </h3>

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

      {/* Mobile vertical stack */}
      <div className="lg:hidden flex flex-col mb-16">
        {steps.map((step, i) => (
          <div key={step.title} className="relative flex gap-5">
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

      {/* ── Two-column block 1: text left (40%), radar chart right (60%) ── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-12 lg:gap-16 items-center mb-16 md:mb-24">
        <div className="md:col-span-2 space-y-4 font-body text-text-primary text-base md:text-lg leading-relaxed">
          <h3 className="font-display text-[24px] md:text-[28px] font-semibold text-navy leading-tight">
            A diagnostic built on your real data
          </h3>
          <p>
            You get access to a custom platform that connects to the tools your team already uses and analyzes your real data. If that data is messy (and for most businesses at your stage, it is), the diagnostic does not give you bad readings.
          </p>
          <p>
            It shows you where your data has gaps and makes fixing that part of the work, not a prerequisite.
          </p>
        </div>

        <div className="md:col-span-3">
          <BrowserFrame
            url="app.modernbizops.com/dashboard"
            aspectRatio="999/783"
          >
            <Image
              src="/images/mockups/dashboard-overview.png"
              alt="ClearPath Solutions client dashboard showing RevOps Audit Progress at 2 of 7 phases complete with engagement status active, the next coaching step, and key revenue metrics: 86 deals, 4280 contacts, 38K average deal size, 42-day average sales cycle, 42800 sessions, with an Overall Data Quality grade of A"
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
            />
          </BrowserFrame>
        </div>
      </div>

      {/* ── Two-column block 2: dashboard left (60%), text right (40%) — alternated ── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-12 lg:gap-16 items-center">
        <div className="md:col-span-2 md:order-2 space-y-4 font-body text-text-primary text-base md:text-lg leading-relaxed">
          <h3 className="font-display text-[24px] md:text-[28px] font-semibold text-navy leading-tight">
            Your progress, tracked in real time
          </h3>
          <p>
            The platform guides the entire engagement: your baseline score, your custom roadmap, your KPIs tracked in real time. As we work through each phase on weekly coaching calls, you watch your numbers move in a live dashboard built around your business. Not a spreadsheet I email you.
          </p>
          <p className="font-semibold text-navy">
            By the time we&apos;re done, you have a before-and-after scorecard that proves exactly what changed.
          </p>
        </div>

        <div className="md:col-span-3 md:order-1">
          <BrowserFrame
            url="app.modernbizops.com/dashboard"
            aspectRatio="991/650"
          >
            <Image
              src="/images/mockups/scorecard-radar.png"
              alt="Revenue Engine Scorecard inside the diagnostic app, showing a 73 out of 100 score with 7 dimensions assessed: Go-to-Market Health, Sales-Marketing Alignment, Sales Process Maturity, Tech Stack Efficiency, Client Lifecycle, Resource Utilization, and Capital Efficiency"
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
            />
          </BrowserFrame>
        </div>
      </div>
    </Section>
  );
}
