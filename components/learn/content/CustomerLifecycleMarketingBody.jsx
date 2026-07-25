import Link from "next/link";
import StatCards from "@/components/learn/StatCards";
import StageList from "@/components/learn/StageList";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

const STATS = [
  {
    big: "$2.00 to make $1.00",
    desc: "What the median B2B SaaS company now spends to generate a dollar of new ARR.",
    source: "Data-Mania, 2026",
  },
  {
    big: "40%–50%",
    desc: "Share of new ARR that now comes from expansion, the customers you already acquired.",
    source: "Data-Mania, 2026",
  },
];

const STAGES = [
  {
    name: "Awareness and acquisition",
    desc: "Your top of funnel: for B2B, fewer, higher-intent buyers reached through content, referral, and a real sales conversation, not paid social pushing impulse buys.",
  },
  {
    name: "Conversion",
    desc: "The deal: in B2B a considered purchase with multiple people involved, which is why the handoff from marketing to sales has to be clean.",
  },
  {
    name: "Onboarding",
    desc: "The gap between the signed deal and the customer's first real result, where a hard-won account starts drifting toward churn before it has ever renewed.",
  },
  {
    name: "Growth",
    desc: "Expansion: the natural next thing you can do for an account that is already succeeding, the cheapest revenue in the business.",
  },
  {
    name: "Retention and advocacy",
    desc: "Renewal plus the referrals and case studies a successful account produces, which feed back into the awareness stage and lower your cost to acquire the next one.",
  },
];

export default function CustomerLifecycleMarketingBody() {
  return (
    <>
      <p>
        Customer lifecycle marketing means engaging a customer at every stage of their
        relationship with you, not just the one where you close the deal. Awareness,
        purchase, onboarding, growth, renewal, advocacy. The idea is simple and correct:
        the customer&rsquo;s life with you does not end at the sale, and most of the revenue
        is in the part after it.
      </p>
      <p>
        If you go looking for how to do this, you will find an ecommerce playbook.
        Cart-abandonment emails, loyalty points, birthday discounts, win-back flows for
        shoppers who have not bought in ninety days. That is a real discipline, and it is
        built for a direct-to-consumer brand with thousands of transactions. It is not
        built for you. A founder-led B2B company between $3M and $50M does not have a
        lifecycle of shoppers. It has a small number of high-value accounts, each one worth
        real money, each one moving through a longer and more human relationship than any
        email flow can carry. Lifecycle marketing absolutely applies to your business. The
        consumer version of it does not.
      </p>
      <p>
        Here is why the post-sale part is worth this much attention. In Data-Mania&rsquo;s
        2026 B2B SaaS benchmark report, the median B2B company now spends $2.00 to generate
        $1.00 of new ARR, while expansion revenue (growth from existing customers) accounts
        for 40% to 50% of new ARR (
        <a
          href="https://www.data-mania.com/blog/b2b-saas-benchmarks-2026-annual-report/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Data-Mania, 2026 B2B SaaS benchmarks
        </a>
        ). New-logo growth is expensive and getting more so. The customers you already paid
        to acquire are the cheapest revenue you have, and lifecycle marketing is how you
        actually collect it.
      </p>

      <StatCards
        label="Why the post-sale part matters most"
        title="New-logo growth is expensive; expansion is not"
        stats={STATS}
      />

      <h2 className={h2}>The five stages, in B2B</h2>
      <p>
        The standard model has five stages. They hold up for B2B, but each one means
        something different than it does for an ecommerce brand.
      </p>
      <p>
        Awareness and acquisition is your top of funnel, and for B2B it is fewer,
        higher-intent buyers reached through content, referral, and a real sales
        conversation, not paid social pushing impulse buys. Conversion is the deal, and in
        B2B it is a considered purchase with multiple people involved, which is why the
        handoff from marketing to sales has to be clean (that is{" "}
        <Link href="/learn/marketing-and-sales-alignment" className="text-navy underline">
          marketing and sales alignment
        </Link>
        , and it is where a lot of B2B lifecycle programs quietly break before the customer
        even arrives).
      </p>
      <p>
        Then comes the part that matters most and gets the least attention. Onboarding is
        the gap between the signed deal and the customer&rsquo;s first real result, and in
        B2B a slow, inconsistent onboarding is where a hard-won account starts drifting
        toward churn before it has ever renewed. Growth is expansion: the natural next
        thing you can do for an account that is already succeeding, which is the cheapest
        revenue in the business. Retention and advocacy is renewal plus the referrals and
        case studies that a genuinely successful B2B customer produces, which feed right
        back into the awareness stage and lower your cost to acquire the next one.
      </p>
      <p>
        Notice what the B2B version is not. It is not a set of automated email sequences
        firing at a list. It is a post-sale operating system, run mostly through your CRM
        and your account owners, with marketing supporting the relationship rather than
        replacing it.
      </p>

      <StageList
        label="The lifecycle, in B2B"
        title="Five stages, each different than the consumer version"
        stages={STAGES}
      />

      <h2 className={h2}>Design the journey first, then choose the tools</h2>
      <p>
        Here is the mistake I see most often, and it is worth stopping on. A company decides
        it wants to do better by its customers, so it buys a tool: a marketing automation
        platform, a customer-success app, a fancier CRM. Then the customer journey gets
        built around whatever that tool happens to do well. The software leads, and the
        experience the customer actually has becomes an accident of the tool&rsquo;s
        defaults.
      </p>
      <p>
        Do it the other way around. Design the journey first, on paper, before you touch a
        tool. Decide what you want the customer to experience at each stage. What do you
        want them to feel when they sign, when they get their first real result, when they
        hit a rough patch, when a renewal comes up? Where are the moments of delight you
        want to build in on purpose, the points where a customer thinks these people
        actually have it together? Map that experience deliberately, because the experience
        is what keeps customers, not the software.
      </p>
      <p>
        Only then do you ask the tools question, and it is a different question than the one
        most companies ask. Not &ldquo;what can this platform do,&rdquo; but &ldquo;what
        does the journey I designed need, and how do my tools have to change to deliver
        it?&rdquo; Sometimes the answer is a new tool. Just as often it is configuring the
        CRM you already own to support the experience you chose. The tools serve the
        journey. When it runs the other way, you end up with an expensive stack and a
        customer experience nobody actually decided on.
      </p>

      <h2 className={h2}>Build the post-sale engine, not the email flows</h2>
      <p>
        For a founder-led B2B company, the lifecycle work that pays off is operational, and
        it is a short list.
      </p>
      <p>
        Give the post-sale life an owner. In most companies this size, onboarding,
        expansion, and renewal belong to nobody in particular, which is why they happen
        inconsistently. One named owner per meaningful account, even if that owner is the
        founder for now, is the whole difference between a lifecycle and a series of
        accidents.
      </p>
      <p>
        Instrument the stages in your CRM. You cannot market to a lifecycle you cannot see.
        Know which stage each account is in, how long it has been there, and what the next
        action is. This is CRM lifecycle management, and it is the difference between a
        customer relationship management system and a customer contact list.
      </p>
      <p>
        Automate the reminders, not the relationship. There is a real role for marketing
        automation here: the renewal reminder, the onboarding-milestone check, the expansion
        nudge when an account hits a usage threshold. Run it through your CRM-native tools
        (HubSpot and the like), the systems that already hold your account data, not a
        consumer email platform built for shopping carts. The automation handles the timing.
        A human handles the account.
      </p>

      <h2 className={h2}>Where lifecycle marketing sits in revenue operations maturity</h2>
      <p>
        In the Revenue Operations Maturity Model, a method I built for measuring the RevOps
        competencies of a business, the customer lifecycle is a design problem before it is
        a marketing problem. At the bottom, there is no defined lifecycle: the sale happens,
        and what comes after is improvised per account. The first real step is mapping the
        stages and giving each account an owner and a next action. Next, the stages are
        instrumented in the CRM and the predictable moments (onboarding, expansion, renewal)
        get a light, automated assist. At the top, the whole post-sale engine runs as a
        system and expansion revenue compounds, which is what pushes{" "}
        <Link href="/learn/net-revenue-retention" className="text-navy underline">
          net revenue retention
        </Link>{" "}
        above 100%. You do not need the top this quarter. You need a defined lifecycle with
        owners, which most founder-led businesses have never actually drawn.
      </p>
      <p>
        A note on tools. The lifecycle-marketing software market is enormous and mostly
        aimed at consumer brands orchestrating email at scale. For a B2B company, the honest
        answer is that your CRM plus disciplined ownership does most of the job, and the
        fancy customer-data platform is a Stage 4 problem you do not have yet. Design the
        lifecycle first. The foundations start at{" "}
        <Link
          href="/learn/revenue-operations-maturity-stage-1-reactive"
          className="text-navy underline"
        >
          Stage 1 of the maturity model
        </Link>
        , and the retention system that lives inside the later stages is your{" "}
        <Link href="/learn/customer-retention-strategy" className="text-navy underline">
          customer retention strategy
        </Link>
        .
      </p>
    </>
  );
}
