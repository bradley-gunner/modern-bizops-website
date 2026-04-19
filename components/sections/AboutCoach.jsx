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
              alt="Bradley de Wet at work"
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
        </div>
      </div>
    </Section>
  );
}
