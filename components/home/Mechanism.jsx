import Link from "next/link";
import Section from "../ui/Section";
import VSSLPlayer from "../VSSLPlayer";
import { LADDER, AUDIT_TERMS } from "@/lib/offers";

const audit = LADDER.find((rung) => rung.id === "audit");

// Section 6: proof, mechanism-first.
//
// Roughly 72% of AI buyers now fact-check the claims a vendor makes, and the
// two things they name most often before they will believe one are a measurable
// outcome and a plain account of what the software actually does. There is no
// client outcome to show yet, so this section spends its credibility budget on
// the second one. The 72% figure is the reason this section exists, not copy
// for it. House rule: a benchmark is supporting proof, never the hook.
//
// 2026-09-01. This section used to argue the mechanism in four cards, each with
// a purpose-built SVG, naming four separate counted things on the way: four
// steps, a four-stage model, 60 competencies, 44 computed, sixteen Scan
// questions. That was board item web-framework-overload in one component.
// David Ellis (Tugboat, slide 9, his highest-rated finding) counted the
// numbered constructs stacked on this one page (twelve builds, a five-rung
// ladder, a four-part audit, four stages) and made the point that mnemonics
// have to be used sparingly to be remembered at all. The homepage now carries
// exactly one named construct, the ladder, and this section carries none.
//
// The four steps were not deleted, they were RELOCATED. /ai-readiness-assessment
// is the page that argues the mechanism in full, and always was: the comment
// this one replaces already said "keep new detail on the audit page, not here."
// If this section starts growing steps back, that is the regression.
//
// The runtime under the video is read from the YouTube Data API for video
// M241NEC30D4 (PT14M13S, checked 2026-09-01), not estimated. A first draft of
// this line guessed "eight minutes", which is exactly the invented-quantity
// class the copy rules ban. Re-check it if the video is ever recut.
//
// The headline is Ellis's own note from slide 7. Reading the differentiator
// section he wrote down what he thought the intended point was, "reading your
// unique tech stack is critical for success, but no one else does it", and said
// to just say that. It is also true and checkable: no competitor in the doc 14
// teardown computes a readiness picture from connected systems at any price.
export default function Mechanism() {
  return (
    <Section bg="cream" narrow={false}>
      <div className="max-w-[760px] mb-8">
        <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
          How the audit works
        </p>
        <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-5">
          The audit reads your systems instead of asking you to grade yourself.
        </h2>
        <div className="space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
          <p>
            It connects to more than twenty tools, starting with whatever you
            use as a CRM. You authorize read access once. From there it reads
            what your records actually contain: field completeness, stage
            discipline, which deals stopped moving, what nobody ever fills in.
          </p>
          <p>
            Two things come back. A heat map showing where the revenue engine is
            thin, and a ranked list of what to automate first with the repairs
            that have to happen before the first build named at the top of it.
            Every other readiness assessment we have looked at asks you to
            score yourself.
          </p>
        </div>
      </div>

      <div className="max-w-[760px] border-l-2 border-amber pl-5 md:pl-6">
        <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
          The audit costs {audit.price}. {AUDIT_TERMS.creditPercent} of that
          credits forward into the first thing you build, and both maps are
          yours whether you build with us or not.
        </p>
      </div>

      <div className="mt-8 max-w-[760px]">
        <Link
          href="/ai-readiness-assessment"
          className="font-body text-base font-semibold text-navy underline underline-offset-4 hover:text-amber transition-colors"
        >
          See exactly what the audit computes, competency by competency
        </Link>
      </div>

      <div className="mt-14 pt-14 border-t border-border max-w-[900px] mx-auto">
        <div className="text-center mb-7">
          <h3 className="font-display text-2xl md:text-[28px] font-semibold text-navy mb-3">
            Bradley, on camera, on why the foundation is the whole job
          </h3>
          <p className="font-body text-text-mid text-base leading-relaxed max-w-[560px] mx-auto">
            Fourteen minutes, and there is no form in front of it.
          </p>
        </div>
        {/* The video is a proof asset here, not the funnel centerpiece. */}
        <VSSLPlayer ctaLocation="home_mid_page" />
      </div>
    </Section>
  );
}
