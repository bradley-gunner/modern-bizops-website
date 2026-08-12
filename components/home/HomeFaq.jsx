import Section from "../ui/Section";
import MaturityFaq from "../maturity/MaturityFaq";
import { HOME_FAQ } from "@/lib/homeFaq";

// Section 8: the objection preempts, answered in the open rather than saved
// for the call. The items live in lib/homeFaq.js because app/schema.js emits
// the same strings as FAQPage JSON-LD, and structured data has to match what
// is on the page.
export default function HomeFaq() {
  return (
    <Section bg="cream" narrow={false} id="faq">
      <div className="max-w-[760px] mb-9">
        <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
          The questions you were going to ask on the call.
        </h2>
        <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
          Answered here so the call can be about your business instead.
        </p>
      </div>
      <div className="max-w-[820px]">
        <MaturityFaq items={HOME_FAQ} />
      </div>
    </Section>
  );
}
