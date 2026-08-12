// Block 2 of the Revenue Operations Consulting page: the platform-plus-coaching
// flow. Four numbered steps, pulled from the page's "How it works: the platform
// plus the coaching" section. Reuses the homepage HowItWorks timeline treatment
// (amber numbered nodes, horizontal on desktop, vertical stack on mobile) so the
// page reads as part of the same system. All text is real HTML, never an image.
const steps = [
  {
    title: "Assess from three inputs",
    description:
      "The platform reads the data in your connected tools, you complete a structured questionnaire, and we do a working call together. The three inputs combine into a heat map of exactly where the revenue is leaking.",
  },
  {
    title: "Prioritized roadmap",
    description:
      "The assessment produces a prioritized roadmap: the specific competencies holding revenue back, in the order that actually compounds.",
  },
  {
    title: "Weekly coaching",
    description:
      "Every weekly coaching session targets a competency from that roadmap. Your team builds the system, one competency at a time, with our guidance.",
  },
  {
    title: "Continuous measurement",
    description:
      "The platform continuously measures improvement from your connected tool data and your call transcripts, so progress is something you can see in the numbers.",
  },
];

export default function EngagementFlow() {
  return (
    <div className="my-9 rounded-2xl border border-border bg-white px-6 py-9 shadow-sm md:px-9">
      <p className="mb-8 text-center text-[11.5px] font-semibold uppercase tracking-[0.14em] text-amber">
        The engagement, end to end
      </p>

      {/* Desktop: horizontal 4-step timeline */}
      <div className="relative hidden lg:block">
        <div
          className="absolute top-6 h-px bg-border"
          style={{ left: "calc(100% / 8)", right: "calc(100% / 8)" }}
        />
        <div className="grid grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center gap-3">
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber shadow-sm">
                <span className="font-display text-lg font-semibold leading-none text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold leading-tight text-navy">
                {step.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-text-mid">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile / tablet: vertical stack */}
      <div className="flex flex-col lg:hidden">
        {steps.map((step, i) => (
          <div key={step.title} className="relative flex gap-5">
            <div className="flex shrink-0 flex-col items-center">
              <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber shadow-sm">
                <span className="font-display text-lg font-semibold leading-none text-white">
                  {i + 1}
                </span>
              </div>
              {i < steps.length - 1 && <div className="my-1 w-px flex-1 bg-border" />}
            </div>
            <div className={i === steps.length - 1 ? "pb-0" : "pb-8"}>
              <h3 className="mb-1 font-display text-lg font-semibold text-navy">
                {step.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-text-mid">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
