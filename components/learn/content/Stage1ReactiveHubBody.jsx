import Link from "next/link";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

export default function Stage1ReactiveHubBody() {
  return (
    <>
      <p>
        You are in the Reactive stage if your business runs on you. Not on a system. On
        you, personally, showing up, making the calls, remembering what happened last
        time, and holding the whole thing together by memory and relationships.
      </p>
      <p>
        Here is the test I use with founders: if you stopped working your network for
        the next ninety days, would new deals still show up? If the honest answer is
        no, you are Reactive. It does not matter if you are doing $2M or $9M in revenue.
        Picture two founders: one runs a $2M business with a real, working revenue
        system. The other runs a $9M business with no system at all, just the
        founder&rsquo;s own effort and relationships. The $9M business cannot survive its founder taking
        a two-week vacation. Revenue would wobble. The bigger company is not the more
        mature one. It is just bigger, and more fragile.
      </p>

      <h2 className={h2}>What Reactive actually looks like</h2>
      <p>
        There is no CRM anyone actually trusts, or there is a CRM that half the team
        ignores. Leads come from your network, your calls, your relationships, not from
        a system that runs without you. Nobody can tell you, with a straight face, what
        makes a deal move from one stage to the next. It is a judgment call, and the
        judgment is usually yours. New hires take months to get productive because there
        is no documented process, just tribal knowledge that lives in your head and your
        best rep&rsquo;s head.
      </p>
      <p>
        The emotional version of this: you are exhausted, you are the bottleneck, and
        there is a quiet fear that the business is worth less every year, not more,
        because none of it works without you in it.
      </p>

      <h2 className={h2}>Why founders get stuck here</h2>
      <p>
        Most founders do not get stuck because they are bad at the work. They get stuck
        because they are too close to it to see it as a system. You built the thing. You
        have the instincts. But instincts do not scale, and they do not transfer to a
        new hire, and they definitely do not show up in a due diligence data room if you
        ever want to sell.
      </p>
      <p>
        Founders also get attached to the quality they can only guarantee by doing the
        work themselves, and worry that handing it off means the quality slips, so they
        default to &ldquo;if you want something done well, do it yourself.&rdquo;
        Another reason founders get stuck here is never building a marketing channel
        beyond their own network. It is reasonable to feel awkward handing someone else
        your relationships, having them reach out on your behalf, or pretend to be you.
        Most founders assume a rep will not have the context and will say the wrong
        thing, degrading a relationship that took years to build. So founders keep it to
        themselves and never build the other channels that do not require them
        personally: organic social, organic search, paid social, paid search.
      </p>
      <p>
        I have lived a version of this myself, on the other side of the table. After
        leaving a good role as an Enterprise Customer Success Manager at a scaled
        startup, I founded Tasting Club, a virtual tastings marketplace. I spent most of
        my time getting the product right and not enough time validating the demand side
        of that marketplace. I generated real supply, beta wineries and breweries,
        through my own network and relationships. What I did not have yet was the skill
        or experience to acquire B2C buyer demand at that point in my career.
      </p>
      <p>That is Reactive, no matter what size company you are running.</p>

      <h2 className={h2}>Why this matters more now, not less</h2>
      <p>
        Every one of the six competencies below now has an AI-accelerated version. That
        is exactly why getting the fundamentals right first matters more than it used
        to, not less. AI amplifies whatever state your business is already in. Point an
        AI tool at a CRM with no real data model behind it, and it will fill in
        clean-looking garbage faster than a person ever could.
      </p>
      <p>
        Most of the market has not caught up to this yet, which is the opening. Deloitte
        Digital&rsquo;s own 2026 research on B2B sales organizations found that 54% are
        still piloting AI, running isolated experiments and measuring time saved, 31%
        are scaling proven use cases across teams, and only 15% are actually realizing
        measurable gains, connecting AI investment to real revenue outcomes. That gap
        between piloting and realizing gains is where the fundamentals live. Fix them,
        and the AI acceleration is available to you immediately, often inside tools you
        are already paying for. Skip them, and you stay stuck in the 54% running
        isolated experiments while competitors who fixed the fundamentals first pull
        ahead. (
        <a
          href="https://www.deloittedigital.com/us/en/insights/perspective/accelerating-b2b-sales-agentic-ai.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          source
        </a>
        )
      </p>

      <h2 className={h2}>The six competencies that get you out</h2>
      <p>
        Stage 1 has six capabilities. You do not need to be great at all six
        simultaneously. You need to know which two or three are actually holding you
        back right now.
      </p>
      <ul className="list-disc pl-6 space-y-3">
        <li>
          <Link href="/learn/ideal-customer-profile" className="text-navy underline">
            Ideal Customer Profile
          </Link>
          : a precise, written definition of who you are for and who you are not for,
          used to actually filter and prioritize, not a slide nobody references.
          Increasingly built by mining your own closed-won and closed-lost deals with an
          AI tool, not a once-a-year workshop.
        </li>
        <li>
          <Link href="/learn/revenue-lifecycle-design" className="text-navy underline">
            Revenue Lifecycle Design
          </Link>
          : mapping the full customer journey, pre-sale and post-sale, as one connected
          system instead of two disconnected conversations. Today that map can update
          itself from real customer behavior instead of sitting as a diagram someone
          redraws twice a year.
        </li>
        <li>
          <Link href="/learn/crm-architecture-and-governance" className="text-navy underline">
            CRM Architecture and Governance
          </Link>
          : a CRM data model that actually reflects how your business sells and serves,
          with someone accountable for keeping it that way, increasingly an AI agent
          connected directly to the CRM, working under the same permissions a person
          would have.
        </li>
        <li>
          <Link href="/learn/data-quality-management" className="text-navy underline">
            Data Quality Management
          </Link>
          : the discipline of keeping your revenue data clean enough that leaders stop
          debating whether the numbers are even right. Often a standing AI enrichment
          workflow now, not a quarterly cleanup weekend.
        </li>
        <li>
          <Link href="/learn/pipeline-stage-design" className="text-navy underline">
            Pipeline Stage Design
          </Link>
          : pipeline stages defined by what the buyer actually did, not by what your rep
          feels like reporting, and increasingly verified by AI that listens to the
          actual call instead of trusting the rep&rsquo;s note that it happened.
        </li>
        <li>
          <Link href="/learn/lead-qualification-framework" className="text-navy underline">
            Lead Qualification Framework
          </Link>
          : a shared, written definition of a real lead that marketing and sales both
          actually use, applied automatically within seconds of a new lead arriving, for
          the teams that have built it right.
        </li>
      </ul>
      <p>
        All six now have full breakdowns live: start with{" "}
        <Link href="/learn/crm-architecture-and-governance" className="text-navy underline">
          CRM Architecture and Governance
        </Link>{" "}
        if your CRM is the thing everyone complains about, or{" "}
        <Link href="/learn/pipeline-stage-design" className="text-navy underline">
          Pipeline Stage Design
        </Link>{" "}
        if you cannot explain why your sales cycle is as long as it is.
      </p>

      <h2 className={h2}>What crossing into Stage 2 looks like</h2>
      <p>
        You are out of Reactive when the CRM is the thing everyone on the team actually
        uses (not tolerates), at least one core process is documented and followed
        without you personally enforcing it, and you have basic pipeline and revenue
        visibility without having to call a meeting to ask people what is actually going
        on.
      </p>
      <p>
        That is not a strategy deck. It is not a report. It is six specific, buildable
        capabilities, and most businesses only need to fix two or three of them to feel
        the shift.
      </p>
    </>
  );
}
