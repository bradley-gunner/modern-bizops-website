import Image from "next/image";
import Link from "next/link";
import Section from "../ui/Section";

// Section 7: the founder, named and faced.
//
// A boutique has one proof asset a logo wall cannot fake, and it is the person
// doing the work. The January rule is Bradley's, not the company's, so this
// section names him and speaks about him in the third person. It was written in
// his first-person singular until 2026-08-12, when he retired that as a brand
// voice; the facts and the rule are unchanged.
export default function FounderNote() {
  return (
    <Section bg="white" narrow={false}>
      <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-start max-w-[900px]">
        <div className="flex-shrink-0">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-[14px] overflow-hidden">
            <Image
              src="/images/bradley-desk.jpg"
              alt="Bradley de Wet, founder of Modern BizOps"
              width={224}
              height={224}
              sizes="(max-width: 768px) 192px, 224px"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-6">
            Who you are actually hiring
          </h2>
          <div className="space-y-5 font-body text-text-primary text-base md:text-lg leading-relaxed">
            <p>
              Our founder is Bradley de Wet. In January he left iExcel, the
              agency where he spent 4.5 years as COO, and gave himself one rule:
              build everything with AI, or do not build it at all.
            </p>
            <p>
              Six months of doing that turned an idea into the obvious thing to
              build. He had spent over a decade in the executor seat watching
              good tools land on bad data, and the rule made it plain that the
              tools were finally good enough for the foundation to be the only
              thing still in the way.
            </p>
          </div>
          <div className="mt-7">
            <Link
              href="/about"
              className="font-body text-base font-semibold text-navy underline underline-offset-4 hover:text-amber transition-colors"
            >
              More about Bradley and the record behind this
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
