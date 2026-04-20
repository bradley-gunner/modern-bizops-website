import Section from "../ui/Section";

export default function Solution() {
  return (
    <Section bg="white">
      <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-8">
        There&apos;s a Better Way to Grow
      </h2>
      <div className="space-y-6 font-body text-text-primary text-base md:text-lg leading-relaxed">
        <p>
          Revenue Operations is how the best companies in the world grow revenue
          faster than they grow costs. It&apos;s the system that aligns your
          sales, marketing, and client delivery teams around one goal: efficient,
          predictable growth.
        </p>
        <p>
          The problem? This used to be something only companies with $50M+ in
          revenue and a dedicated RevOps team could build.
        </p>
        <p className="font-semibold text-navy">Not anymore.</p>
        <p>
          I take everything I&apos;ve learned from building revenue operations
          inside 15+ high-growth, VC-backed startups. I personally cut sales
          cycles in half, doubled conversion rates, and saved over $1M in
          annual recurring revenue. I bring that experience to companies like
          yours.
        </p>
        <p>
          This isn&apos;t consulting where someone drops in, builds a binder,
          and leaves. This is done-with-you coaching where we build your revenue
          engine together, your team learns the skills, and you own the system
          when we&apos;re done.
        </p>
      </div>

      {/* Diagnostic platform callout */}
      <div className="mt-10 bg-cream rounded-[14px] p-6 md:p-8 space-y-4 font-body text-text-primary text-base leading-relaxed">
        <p>
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
    </Section>
  );
}
