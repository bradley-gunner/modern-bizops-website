import Link from "next/link";
import StatCards from "@/components/learn/StatCards";
import MaturityLadder from "@/components/learn/MaturityLadder";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

// The page hedges this figure in its own prose directly above the block (vendor
// blog synthesizing broader research, not the primary report), so the cards sit
// under that hedge rather than restating it. The source line names both hops.
const STATS = [
  {
    big: "34%",
    desc: "Higher win rates from AI-driven ICP work than from static, manually built ICPs.",
    source: "Gartner, via Sybill",
  },
  {
    big: "68%",
    desc: "Higher account win rates associated with clearly defined ICPs overall, alongside 36 percent higher retention.",
    source: "Gartner, via Sybill",
  },
];

const RUNGS = [
  {
    level: 1,
    desc: (
      <>
        The company sells to <b>anyone willing to pay</b>. &ldquo;Our customers are
        businesses&rdquo; is the effective ICP. Different people on the team would give
        different answers about who the ideal customer actually is.
      </>
    ),
  },
  {
    level: 2,
    desc: (
      <>
        An ICP exists as a slide or a document, but it is not operationalized. It is not
        encoded anywhere leads actually get scored or routed. New leads are evaluated ad
        hoc, and the document is rarely the thing anyone actually consults.
      </>
    ),
  },
  {
    level: 3,
    desc: (
      <>
        A written ICP exists with specific criteria: size or revenue range, and{" "}
        <b>explicit disqualification criteria</b>, not just who to target but who to turn
        away. Sales uses it to evaluate inbound leads. Marketing references it in content
        and targeting decisions. Most of the team could describe it accurately without
        looking it up.
      </>
    ),
  },
  {
    level: 4,
    desc: (
      <>
        The ICP is encoded in CRM scoring and used to prioritize leads and accounts. It
        gets reviewed against closed-won and closed-lost data on a real cadence, not just
        when someone remembers to. Win rates and lifetime value are tracked by ICP fit
        tier, and resource allocation decisions reference that tier explicitly.
      </>
    ),
  },
  {
    level: 5,
    desc: (
      <>
        The ICP is a <b>tiered model validated against real cohort data</b>, not
        intuition. Disqualifying non-ICP leads is systematic and the data backs it up.
        The company can say, specifically, what a Tier 1 client is worth compared to a
        Tier 2 one.
      </>
    ),
  },
];

export default function IdealCustomerProfileBody() {
  return (
    <>
      <p>
        Ask yourself a simple question: what does your best client have in common with
        your worst one, and what actually separates them? If you cannot answer that in
        one sentence, you do not have an ideal customer profile problem. You have a
        definition problem, and everything downstream of it, your marketing, your
        qualification, your sales cycle, is guessing.
      </p>

      <h2 className={h2}>What &ldquo;winning the wrong clients&rdquo; actually means</h2>
      <p>
        Here is the tell. Ask three people on your team to describe your ideal customer.
        If you get three different answers, that is not a minor inconsistency. It means
        every lead evaluation, every piece of content, every disqualification decision
        is being made against a private, unwritten standard that changes depending on
        who is in the room that day.
      </p>
      <p>
        Most businesses that say &ldquo;we sell to anyone who needs what we sell&rdquo;
        are not being humble. They are describing the absence of a filter. Leads get
        evaluated ad hoc. Marketing writes content for a broad audience because there is
        no sharper target to aim at. Sales takes whatever comes in, including the
        accounts everyone quietly dreads working with six months later.
      </p>
      <p>
        You can see this pattern most clearly in hindsight. Pull your last ten closed
        deals. Some of them were probably a joy: fast to close, easy to serve, quick to
        renew. Others were a slog: they haggled on price, needed constant hand-holding,
        and either churned early or never expanded. If you cannot explain, in specific
        terms, why the good ones were good and the bad ones were bad, your business is
        not choosing its clients. It is accepting whoever shows up.
      </p>

      <h2 className={h2}>Why this happens even in businesses doing real revenue</h2>
      <p>Two structural reasons cause this, and neither one is about effort.</p>
      <p>
        The first is timing. Early on, a business takes whoever will pay, because
        survival matters more than fit. That is a reasonable decision at $200K in
        revenue. It becomes an expensive habit at $3M, $10M, or $30M, because the
        accounts you took out of necessity are still in your client base, still
        consuming service capacity, and still shaping who your team thinks a
        &ldquo;normal&rdquo; client looks like.
      </p>
      <p>
        The second is that an ICP, when it exists at all, usually lives as a slide from
        an old planning offsite rather than something operationalized in how the
        business actually runs. It is not encoded in how leads get scored. It is not
        referenced when marketing decides what to write about. It is not checked
        against closed-won and closed-lost data on any kind of schedule. A document
        nobody consults is not a working definition. It is an artifact.
      </p>
      <p>
        This is also where AI has quietly changed what &ldquo;good&rdquo; looks like,
        without changing what the fundamental actually is. You do not need a workshop
        and a whiteboard to find your real pattern anymore. Export your last fifty or so
        closed-won and closed-lost deals from your CRM, company size, industry, deal
        size, sales cycle length, whether they renewed, and ask a general-purpose AI
        tool you likely already have access to, Claude, ChatGPT Enterprise, or Grok, to
        tell you directly what the winners had in common that the losers did not. You
        will often get an uncomfortable answer, because the real pattern is frequently
        different from what is on the sales deck. What still takes real judgment is
        knowing which fields to pull, asking the follow-up questions that separate a
        genuine pattern from a coincidence, and turning that one-time analysis into
        something your team actually uses every time a new lead comes in, not a report
        that sits in a folder.
      </p>
      <p>
        Gartner&rsquo;s research on AI-driven ICP work found it produces 34 percent
        higher win rates than static, manually built ICPs, and clearly defined ICPs
        overall are associated with up to 68 percent higher account win rates and 36
        percent higher retention (
        <a
          href="https://www.sybill.ai/blogs/icp-guide"
          target="_blank"
          rel="noopener noreferrer"
        >
          source
        </a>
        ). Worth being direct about the sourcing here: this figure comes from a vendor
        blog synthesizing broader research rather than the original primary report, so
        treat it as directionally strong rather than an exact figure to quote in a
        client conversation.
      </p>

      <StatCards
        label="What the research says"
        title="What a defined ICP is worth"
        stats={STATS}
      />

      <h2 className={h2}>What good looks like, one step at a time</h2>

      <MaturityLadder
        label="The 1 to 5 scale"
        title="Ideal customer profile, Level 1 to Level 5"
        rungs={RUNGS}
      />

      <p>
        At Level 5, increasingly, the review that used to happen once a year in a
        workshop now happens continuously, because an AI tool is mining the closed-deal
        pattern every quarter instead of waiting for someone to schedule the meeting.
      </p>
      <p>
        You do not need a dedicated ICP platform to move from Level 3 toward Level 4
        yourself. The export-and-ask approach described above is a real, if rougher,
        version of what a purpose-built AI ICP tool does automatically. The gap between
        doing that once and having it inform every lead decision automatically is close
        to the actual gap between Functional and Managed.
      </p>

      <h2 className={h2}>The fastest way to tell where you stand</h2>
      <p>Two questions, answered honestly, will place you.</p>
      <p>
        Describe your last five closed-won clients and your last five closed-lost or
        churned ones. Can you say, specifically, why each one landed where it did? Or
        does the explanation come down to luck, referral source, or price, none of
        which is actually about fit?
      </p>
      <p>
        When did you last look at that pattern on purpose, not as a retrospective
        exercise after a bad quarter, but as a standing habit? If the honest answer is
        &ldquo;I have not,&rdquo; the gap is not effort. It is that nobody built the
        habit of checking.
      </p>

      <h2 className={h2}>Where this competency sits</h2>
      <p>
        Ideal Customer Profile is the one Stage 1 competency with no dependency. Every
        other Stage 1 capability builds on top of it.{" "}
        <Link href="/learn/revenue-lifecycle-design" className="text-navy underline">
          Revenue Lifecycle Design
        </Link>{" "}
        assumes you know who you are mapping the journey for.{" "}
        <Link href="/learn/lead-qualification-framework" className="text-navy underline">
          Lead Qualification Framework
        </Link>{" "}
        assumes you know what &ldquo;fit&rdquo; actually means before you can decide
        what &ldquo;qualified&rdquo; means. Get this one wrong, and every competency
        built on top of it inherits the same blurry target.
      </p>
    </>
  );
}
