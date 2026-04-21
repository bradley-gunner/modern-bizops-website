import Image from "next/image";
import Section from "../ui/Section";

function BrowserFrame({ src, alt }) {
  return (
    <div className="mt-5 rounded-xl overflow-hidden border border-border shadow-md">
      <div className="bg-navy px-3 py-2 flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-white/20" aria-hidden="true" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/20" aria-hidden="true" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/20" aria-hidden="true" />
        <div className="flex-1 mx-2 bg-white/10 rounded h-4 flex items-center px-2">
          <span className="text-[9px] text-white/40 font-mono">app.modernbizops.com</span>
        </div>
      </div>
      <Image src={src} alt={alt} width={600} height={400} className="w-full block" />
    </div>
  );
}

const steps = [
  {
    title: "Connect",
    description: "You connect your existing tools — CRM, marketing platform, accounting software — so the diagnostic can work with your real data, not a survey.",
    screenshot: { src: "/images/app/integration-connect.png", alt: "Integration connection screen showing HubSpot, Salesforce, QuickBooks and other tools" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    title: "Diagnose",
    description: "The platform analyzes your data across 7 revenue health dimensions and produces a scored baseline. This is your before picture.",
    screenshot: { src: "/images/app/radar-scorecard.png", alt: "Radar scorecard showing Revenue Operations score across 7 dimensions" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: "Discover",
    description: "We run structured interviews with your team to understand the human side — where the friction is, what's working, and what nobody wants to say in a meeting.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Plan",
    description: "I deliver a prioritized roadmap built around what your diagnostic found. Every recommendation is specific to your data — no generic playbooks.",
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
    description: "Weekly coaching calls work through each phase with your team. You build the skills in-house. I track KPIs in real time so we always know what's moving.",
    screenshot: { src: "/images/app/kpi-dashboard.png", alt: "KPI dashboard showing live metrics including sales cycle, close rate, and churn" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    title: "Measure",
    description: "When we close out, you get a before-and-after scorecard that shows exactly what changed and by how much. Proof you can take to the board.",
    screenshot: { src: "/images/app/scorecard-comparison.png", alt: "Scorecard comparison showing baseline vs current score with a +22 point gain" },
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
      <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-12 text-center">
        How It Works
      </h2>

      <div className="grid lg:grid-cols-2 gap-5">
        {steps.map((step, i) => {
          const rowIndex = Math.floor(i / 2);
          const bg = rowIndex % 2 === 0
            ? "bg-white border border-border"
            : "bg-cream border border-border/60";
          return (
            <div
              key={step.title}
              className={`${bg} rounded-[18px] p-7 md:p-8 flex flex-col`}
            >
              {/* Step number + icon row */}
              <div className="flex items-start justify-between mb-2">
                <span className="font-display text-[64px] leading-none font-semibold text-amber select-none">
                  {i + 1}
                </span>
                <div className="text-navy mt-3">{step.icon}</div>
              </div>

              {/* Title */}
              <h3 className="font-display text-[22px] md:text-[26px] font-semibold text-navy mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="font-body text-base text-text-mid leading-relaxed">
                {step.description}
              </p>

              {/* App screenshot */}
              {step.screenshot && (
                <BrowserFrame src={step.screenshot.src} alt={step.screenshot.alt} />
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
