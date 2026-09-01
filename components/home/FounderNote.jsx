import Image from "next/image";
import Link from "next/link";
import Section from "../ui/Section";

// Section 7: the founder, named and faced.
//
// A boutique has one proof asset a logo wall cannot fake, and it is the person
// doing the work.
//
// 2026-09-01, the second paragraph. It said six months "turned an idea into the
// obvious thing to build", which is a claim with nothing checkable in it. The
// checkable version was sitting on /about the whole time: he built the audit
// tool itself, with AI coding tools, and it connects to more than twenty
// systems. That is the same fact the rest of the page depends on, so it belongs
// where a reader meets him. Every number here is cleared by the
// bradley-career-history memory; "over a decade" is the decided figure. The January rule is Bradley's, not the company's, so this
// section names him and speaks about him in the third person. It was written in
// his first-person singular until 2026-08-12, when he retired that as a brand
// voice; the facts and the rule are unchanged.
export default function FounderNote() {
  return (
    <Section bg="white" narrow={false}>
      <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start max-w-[980px]">
        {/* The photograph was cropped to a 224px square, which is a thumbnail on
            a page whose only proof asset is the person in it. The source file is
            600x800, so the portrait now runs at its native 3:4 with no crop, and
            an amber block sits behind the corner to stop it reading as a stock
            headshot dropped into a text column. The accent is md and up only,
            because at 375px it would have to bleed through the gutter. */}
        <div className="w-full max-w-[300px] shrink-0 md:w-[300px]">
          <div className="relative isolate">
            <div
              aria-hidden="true"
              className="hidden md:block absolute -bottom-6 -left-6 w-2/3 h-2/3 rounded-[14px] bg-amber-pale"
            />
            <Image
              src="/images/bradley-desk.jpg"
              alt="Bradley de Wet, founder of Modern BizOps"
              width={600}
              height={800}
              sizes="(max-width: 768px) 300px, 300px"
              className="relative w-full h-auto rounded-[14px]"
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
              Over the six months that followed he built the diagnostic that
              runs these audits, himself, with AI coding tools, and it reads from
              more than twenty systems. Over a decade in the executor seat had already
              shown him where good tools land on bad data. Six months of
              building proved the tools were finally the easy part.
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
