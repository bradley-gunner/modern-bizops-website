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

      {/* Feature highlight */}
      <div className="mt-10 bg-amber-pale border border-amber-light/30 rounded-[14px] p-6 md:p-8">
        <p className="font-body text-text-primary text-base leading-relaxed">
          <span className="font-semibold text-navy">
            Powered by proprietary diagnostic technology
          </span>{" "}
          that connects to your existing tools (CRM, marketing platform,
          support systems) and analyzes your real data to build a custom
          roadmap. No guesswork. No generic playbooks.
        </p>
      </div>
    </Section>
  );
}
