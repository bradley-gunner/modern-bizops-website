import Link from "next/link";
import StatCards from "@/components/learn/StatCards";
import ContrastColumns from "@/components/learn/ContrastColumns";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

const STATS = [
  {
    big: "25%–95%",
    desc: "Profit increase from a 5% increase in customer retention, because retained customers cost less to serve, buy more over time, and refer others.",
    source: "Bain and Company (Reichheld)",
  },
  {
    big: "3 leaks",
    desc: "Where founder-led B2B retention actually breaks: onboarding to value, silent at-risk accounts, and flat revenue.",
    source: "Modern BizOps",
  },
];

export default function CustomerRetentionStrategyBody() {
  return (
    <>
      <p>
        A customer retention strategy is the deliberate system you use to keep the
        customers you already won, and to grow what they are worth over time. Not a
        loyalty program. Not a discount you offer when someone threatens to leave. A
        system: who owns the relationship after the sale, what a healthy account looks
        like, how you spot a struggling one before it cancels, and what you do about it.
      </p>
      <p>
        Almost everything written about customer retention assumes you sell to consumers.
        The advice is loyalty points, birthday emails, punch cards, and omnichannel
        support desks. That is a real discipline, and it is not yours. If you run a
        founder-led B2B company, your retention problem is a
        revenue-operations problem: a handful of accounts that each represent real money,
        a post-sale process that lives in your head or your best account manager&rsquo;s,
        and a churn number nobody has actually decomposed. The strategy that fixes that
        looks nothing like a rewards app.
      </p>
      <p>
        And this is not only a software problem, which is where most of the writing on it
        lives. Any business built on recurring or repeat revenue has it: a field service
        company on annual maintenance contracts, a managed services provider, an agency on
        retainers, a subscription or membership business, as much as a SaaS product. If
        your customers pay you again and again, keeping them is a system worth building,
        and the system is the same regardless of what you sell.
      </p>
      <p>
        Here is why it is worth the work. Bain and Company&rsquo;s research, run by Fred
        Reichheld, found that increasing customer retention by 5% increased profits by 25%
        to 95%, because retained customers cost less to serve, buy more over time, and
        refer others (
        <a
          href="https://media.bain.com/Images/BB_Prescription_cutting_costs.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bain and Company, &ldquo;Prescription for Cutting Costs&rdquo;
        </a>
        ). That study is older, and the mechanism has not changed: the revenue you already
        won is the cheapest revenue you will ever have.
      </p>

      <StatCards
        label="Why retention is the cheapest revenue"
        title="Small retention gains, outsized profit"
        stats={STATS}
      />

      <h2 className={h2}>Measure retention as revenue, not logos</h2>
      <p>
        Most founder-led businesses count churn as a number of customers. Two clients left
        this quarter out of forty, so churn is 5%. That number hides the thing that
        matters, because your customers are not worth the same amount. Lose two small
        accounts and you have a rounding error. Lose one anchor account and you have a bad
        year, even though the logo count says the same 5%.
      </p>
      <p>
        Measure retention in dollars. Split it two ways. Gross revenue retention is how
        much of last year&rsquo;s recurring or repeat revenue you kept, with no credit for
        anyone spending more. Net revenue retention counts the expansion too, so it can
        climb above 100% when your existing customers grow with you. The gap between those
        two numbers is the first thing a retention strategy has to see, because a healthy
        net number can hide heavy churn that a few big expansions are papering over. The
        full mechanics live on the{" "}
        <Link href="/learn/net-revenue-retention" className="text-navy underline">
          net revenue retention
        </Link>{" "}
        page, and they are the measurement foundation for everything below.
      </p>
      <p>
        Once you measure in dollars, the strategy stops being generic. You are no longer
        trying to retain &ldquo;customers.&rdquo; You are protecting specific revenue, and
        you can rank it.
      </p>

      <h2 className={h2}>Start with the customers who are actually worth keeping</h2>
      <p>
        The eighty-twenty pattern is real in most B2B books: a large share of your revenue
        and nearly all of your profit sits in a minority of your accounts. A retention
        strategy that treats every customer the same is quietly underserving the accounts
        that pay for the company and overserving the ones that never will.
      </p>
      <p>
        So segment by value first. Which accounts, if they left, would you feel in the
        forecast? Those get a named owner, a real relationship, and a standing rhythm: a
        scheduled check-in that reviews the outcomes they hired you for, not a survey.
        Which accounts are small, high-effort, and never going to grow? Those get a
        lighter, more automated touch, and honestly, some of them are fine to let go.
        Deciding where the effort goes is the strategy. Spreading it evenly is the absence
        of one.
      </p>

      <h2 className={h2}>Fix the three places revenue actually leaks</h2>
      <p>
        For a founder-led B2B company, retention leaks in three predictable spots, and
        each one has a specific fix.
      </p>
      <p>
        The first is onboarding, the gap between when someone buys and when they get the
        result they bought. When I took over customer onboarding at a VC-backed startup,
        the whole job was closing that gap: getting a new customer to their first real win
        faster, because a customer who has not yet felt the value has no reason to stay.
        Most churn that looks like a year-two problem was actually decided in the first
        ninety days, when the customer never got off the ground. Map the path to first
        value and make it fast and repeatable, so it does not depend on which account
        manager happened to catch the account.
      </p>
      <p>
        The second is silence. Customers rarely announce that they are leaving. They get
        quiet, usage drops, the champion who bought from you changes jobs, and the renewal
        lapses without a conversation. The fix is a small set of health signals you
        actually watch (engagement, results delivered, whether your main contact still
        works there) and a rule that someone reaches out when a signal drops, before the
        renewal, not after the cancellation. This early-warning habit is the
        highest-leverage single move in the whole strategy, and it is big enough to have
        its own playbook:{" "}
        <Link href="/learn/reduce-customer-churn" className="text-navy underline">
          reducing customer churn
        </Link>{" "}
        covers how to build the signals and turn them into alerts. The strategy&rsquo;s job
        is to make sure that habit has an owner and actually happens.
      </p>
      <p>
        The third is flat revenue. An account that renews at the same number every year is
        not actually safe, it is stalled, and stalled accounts churn when a budget review
        comes. Expansion is part of retention, not a separate sales motion: the natural
        next thing you can do for a customer who is already getting value is the cheapest
        revenue in the business.
      </p>

      <ContrastColumns
        label="What ranks vs what works"
        title="A loyalty program is not a retention system"
        leftTitle="Loyalty program (what ranks today)"
        leftItems={[
          "Points and rewards",
          "Discounts offered when someone threatens to leave",
          "Birthday emails",
          "One playbook for every customer",
        ]}
        rightTitle="Retention system (founder-led B2B)"
        rightItems={[
          "Retention measured in dollars, not logos",
          "Accounts segmented by value",
          "Account-health signals someone watches",
          "A named owner on every account that would hurt to lose",
          "Expansion treated as part of retention",
        ]}
      />

      <h2 className={h2}>Where a retention strategy sits in revenue operations maturity</h2>
      <p>
        In the Revenue Operations Maturity Model, a method I built for measuring the RevOps
        competencies of a business, retention moves through predictable stages. At the
        bottom, retention is not managed at all: churn is a number someone reports after
        the fact, post-sale has no owner, and the founder finds out an account left when
        the payment stops. The first real step is measuring retention in revenue and giving
        the top accounts a named owner and a rhythm. Further up, you are watching health
        signals and intervening early. At the top, expansion runs as a system and net
        revenue retention sits above 100%, which means your existing customers grow the
        business before you sign anyone new.
      </p>
      <p>
        You do not need the top of that ladder this quarter. You need to know your dollar
        retention number, know which accounts carry it, and have one person responsible for
        each of the three leaks above.
      </p>
      <p>
        One honest note on tooling. There is good AI now for retention: models that flag
        at-risk accounts from usage patterns, and assistants that summarize account health
        from your CRM and call notes. They are useful once you have the fundamentals. Point
        churn-prediction software at a business that has not defined a healthy account or
        cleaned up its CRM, and it will confidently predict from garbage. Get the
        definition, the owner, and the rhythm first. The tools make a working system
        faster, they do not create one. The place to start on those foundations is{" "}
        <Link
          href="/learn/revenue-operations-maturity-stage-1-reactive"
          className="text-navy underline"
        >
          Stage 1 of the maturity model
        </Link>
        .
      </p>
    </>
  );
}
