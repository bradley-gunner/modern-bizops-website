import Image from "next/image";
import Section from "../ui/Section";
import BrowserFrame from "../ui/BrowserFrame";

const steps = [
  {
    title: "Onboarding & Assessment",
    description: "My custom-built Revenue Intelligence Platform scores your business across the Revenue Operations Maturity Model: 40+ competencies, organized by stage. Connect your tools, complete the assessment, and get a heat map of exactly where you stand.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: "Scope",
    description: "I identify the competencies holding you back from the next maturity stage and provide specific recommendations that form your roadmap. You and your team execute against it, all tracked inside the app.",
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
    title: "Weekly Coaching",
    description: "Your team builds the system with my coaching on weekly calls. Each session targets specific competencies from the roadmap.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    title: "Measurement & ROI",
    description: "The Revenue Intelligence Platform watches the data in your connected tools, the transcripts from our calls, and self-reported improvement to measure your progress and the ROI of the coaching you are implementing.",
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
          style={{ left: "calc(100% / 8)", right: "calc(100% / 8)" }}
        />

        <div className="grid grid-cols-4 gap-8">
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

              <p className="font-body text-sm text-text-mid leading-relaxed">
                {step.description}
              </p>
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

              <p className="font-body text-sm text-text-mid leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Two-column block 1: text left (40%), radar chart right (60%) ── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-12 lg:gap-16 items-center mb-16 md:mb-24">
        <div className="md:col-span-2 space-y-4 font-body text-text-primary text-base md:text-lg leading-relaxed">
          <h3 className="font-display text-[24px] md:text-[28px] font-semibold text-navy leading-tight">
            A maturity assessment built on your actual data
          </h3>
          <p>
            You get access to the Revenue Intelligence Platform, which connects to the tools your team already uses. It assesses your business across 40+ operational competencies, scores each one 1 to 5, and produces a heat map showing where you are and where the highest-leverage gaps are.
          </p>
          <p>
            If your data is messy (and for most businesses at your stage, it is), the diagnostic does not give you bad readings. It shows you where the gaps are and makes fixing them part of the work.
          </p>
        </div>

        <div className="md:col-span-3">
          <BrowserFrame
            url="app.modernbizops.com/dashboard"
            aspectRatio="999/783"
          >
            <Image
              src="/images/mockups/dashboard-overview.png"
              alt="Client dashboard in the Revenue Intelligence Platform showing maturity assessment progress, engagement status, next coaching step, and key revenue metrics including deals, contacts, average deal size, and overall data quality grade"
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
            Your stage, your roadmap, your progress in real time
          </h3>
          <p>
            The platform runs the engagement. Your baseline heat map shows exactly which competencies are your highest-leverage gaps. Your custom roadmap sequences the work based on that heat map and your stated business outcome. Your KPIs track in real time as we work through the targeted competencies on weekly coaching calls.
          </p>
          <p className="font-semibold text-navy">
            By the time we are done, you have a before-and-after scorecard that proves exactly what advanced and what it produced.
          </p>
        </div>

        <div className="md:col-span-3 md:order-1">
          <BrowserFrame
            url="app.modernbizops.com/dashboard"
            aspectRatio="991/650"
          >
            <Image
              src="/images/mockups/scorecard-radar.png"
              alt="Revenue Maturity Scorecard inside the Revenue Intelligence Platform, showing a client's heat map of operational competency scores across the four maturity stages, with strengths and highest-leverage gaps highlighted"
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
