import Link from "next/link";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

export default function WhatIsRevOpsBody() {
  return (
    <>
      <p>
        If marketing and sales blame each other, nobody fully trusts the pipeline
        number, and every new dollar of revenue seems to require another hire, the thing
        you are missing has a name. Revenue operations (RevOps) is the discipline of
        running marketing, sales, and customer service as one connected revenue system
        instead of three separate departments. One set of definitions, one set of
        numbers, one process a customer moves through from first touch to renewal, and
        one owner accountable for how the whole machine runs.
      </p>
      <p>
        That is the answer to the question you typed. The more useful question sits
        underneath it: is the chaos in your business a RevOps problem, and if it is, do
        you need to hire someone or build something? This page answers both, written for
        the person who owns the P&amp;L, not for someone deciding whether RevOps is a
        good career move.
      </p>

      <h2 className={h2}>What revenue operations actually covers</h2>
      <p>Strip away the vendor language and RevOps does three jobs.</p>
      <p>
        First, it makes the three revenue functions share one definition of reality.
        What counts as a qualified lead. What each pipeline stage means. What a customer
        is worth and when they are at risk. When marketing, sales, and customer service
        each keep their own scoreboard, every leadership meeting starts with an argument
        about whose numbers are right. RevOps ends that argument by making the
        definitions shared, written, and enforced in the CRM rather than living in three
        separate heads.
      </p>
      <p>
        Second, it designs the process a customer actually moves through. Not a sales
        process bolted onto a marketing funnel bolted onto a support queue, but one
        lifecycle with defined handoffs: marketing to sales, sales to service, service
        back to expansion. Most revenue leaks live in the seams between departments,
        precisely where nobody owns the problem.
      </p>
      <p>
        Third, it makes decisions run on trusted data. Clean CRM records, a pipeline the
        founder believes without calling a meeting to verify it, and a forecast built on
        a documented method instead of the sales lead&rsquo;s gut. This is the part that
        compounds: a business that trusts its own numbers can find and fix its biggest
        leak, then the next one, without guessing.
      </p>
      <p>
        Notice what is missing from that list: a software purchase. RevOps uses a CRM the
        way accounting uses a ledger, but buying the ledger has never made anyone good at
        accounting.
      </p>

      <h2 className={h2}>A discipline before it is a hire</h2>
      <p>
        Large companies staff RevOps as a department. Forbes documented revenue
        operations as the fastest-growing job in America back in 2023, describing it as
        the consolidation of a dozen historically fragmented functions into one role (
        <a
          href="https://www.forbes.com/sites/stephendiorio/2023/03/20/revenue-operations-is-the-fastest-growing-job-in-america-so-what-is-revenue-operations/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Forbes, 2023
        </a>
        ). That is why most of what you will find when you search the term is written for
        people who want that job.
      </p>
      <p>
        You run a founder-led company. Your version of the question is different: at $3M
        to $50M in revenue, do you need a RevOps hire at all? The honest answer is that
        you need the discipline before you need the headcount. The definitions, the
        lifecycle, the data hygiene, and the operating cadence are buildable with the
        team you already have. Many companies in this band get there by promoting someone
        internal who already knows the business and giving that person the structure and
        guidance to build it, rather than adding a $150K+ specialist to interpret a
        system that does not exist yet. I have spent 15 years doing this work from the
        inside, carrying a number while architecting the systems that made the number
        easier to hit, at VC-backed startups and as the COO of an agency. The pattern I
        have seen repeatedly: the companies that hire the title before building the
        discipline end up paying a salary to document their chaos.
      </p>

      <h2 className={h2}>How to tell whether you have a RevOps problem</h2>
      <p>
        Ask yourself three questions. If I asked your marketing lead and your best
        salesperson to each write down what a qualified lead looks like, would the
        answers match? Can you produce your pipeline number right now, without calling
        anyone, and do you believe it? When a customer signs, does what happens next
        depend on a documented process or on who happens to handle it?
      </p>
      <p>
        Two or three misses means your revenue depends on your personal effort and
        judgment rather than on a system. In the Revenue Operations Maturity Model, a
        method I built for measuring the RevOps competencies of a business, that is
        called{" "}
        <Link
          href="/learn/revenue-operations-maturity-stage-1-reactive"
          className="text-navy underline"
        >
          Stage 1: Reactive
        </Link>
        , and it is where most founder-led companies honestly sit. The way out is not a
        reorganization. It is six specific competencies, built in order, starting with a
        written ideal customer profile and ending with a lead qualification framework
        both marketing and sales actually use. The full{" "}
        <Link href="/predictable-revenue-engine" className="text-navy underline">
          predictable revenue engine
        </Link>{" "}
        shows how those competencies stack across all four stages.
      </p>
      <p>
        The payoff for building the discipline shows up in one number:{" "}
        <Link href="/learn/revenue-per-employee" className="text-navy underline">
          revenue per employee
        </Link>
        . A business running as one machine grows revenue faster than headcount. A
        business running as three departments hires its way through every leak.
      </p>
      <p>
        One note on AI, since half the vendor content about RevOps now leads with it. AI
        genuinely accelerates this work: agents that keep CRM records current, scoring
        models built from your own closed deals, enrichment that fills gaps the moment a
        record is created. But AI amplifies the operational state it is applied to.
        Automating a process with no shared definitions produces confidently wrong
        numbers faster. Fundamentals first, then the acceleration.
      </p>
    </>
  );
}
