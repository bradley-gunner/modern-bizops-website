import Link from "next/link";
import StatCards from "@/components/learn/StatCards";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

// The two Recurly benchmarks this page already cites, pulled together to frame
// the thesis: involuntary churn is a large slice of churn, and most of it is
// recoverable fast. Both numbers stay in the prose too; the cards are an
// additive pull-out.
const STATS = [
  {
    big: "20 to 40%",
    desc: "Of total churn for subscription businesses is involuntary: satisfied customers you already won, lost to administrative failure rather than a decision to leave.",
    source: "Recurly network data, 2026",
  },
  {
    big: "90%",
    desc: "Of recovered payments are recovered within the first 10 days of the failure. The money is recoverable because the customer never meant to leave, but the window is short.",
    source: "Recurly network data, 2026",
  },
];

export default function InvoluntaryChurnBody() {
  return (
    <>
      <p>
        Involuntary churn is revenue you lose when a customer&rsquo;s payment fails and
        nobody fixes it, rather than when a customer decides to leave. A card expires. A
        bank flags a routine charge. A renewal invoice sits unpaid in someone&rsquo;s
        inbox. The customer never chose to cancel, often does not know they have, and the
        subscription or retainer quietly ends anyway.
      </p>
      <p>
        That mechanism is what makes it the strangest line item in your churn number:
        these are satisfied customers you already won, lost to administrative failure.
        Payment-industry data consistently puts involuntary churn at an estimated 20% to
        40% of total churn for subscription businesses (
        <a
          href="https://recurly.com/blog/failed-payment-recovery-data-based-strategy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Recurly network data, 2026
        </a>
        ). If your business runs on recurring revenue and you have never measured this
        separately, some meaningful slice of what you have been calling a retention
        problem is actually a billing problem, and billing problems are far cheaper to
        fix.
      </p>
      <p>
        One scoping note: this page is for recurring-revenue models. SaaS, subscriptions,
        memberships, and retainer businesses all have involuntary churn; a pure project
        business does not, because there is no recurring payment to fail.
      </p>

      <StatCards
        label="What the payment data says"
        title="A big slice of churn, and most of it recoverable"
        stats={STATS}
      />

      <h2 className={h2}>Where the money actually leaks</h2>
      <p>
        For card-billed businesses, the causes are mundane and mechanical. Cards expire
        and customers forget to update them. Banks decline legitimate charges on fraud
        suspicion or insufficient funds. Processors and gateways occasionally just fail.
        Stripe&rsquo;s own documentation on the topic catalogs the pattern: the customer
        intended to keep paying, and the machinery between their bank and your business
        dropped the handoff (
        <a
          href="https://stripe.com/resources/more/involuntary-churn-101-what-it-is-why-it-happens-and-seven-ways-to-reduce-it"
          target="_blank"
          rel="noopener noreferrer"
        >
          Stripe, involuntary churn resource
        </a>
        ).
      </p>
      <p>
        If you run an invoiced retainer business, you have the same disease with a
        different symptom: the invoice that does not get paid until someone chases it,
        and the client relationship that lapses because the chasing stopped. I lived this
        one directly. As the COO of an agency, I personally followed up with clients
        month after month to get invoices paid on time, and I can tell you the cost is
        only partly cash flow. It is a recurring source of friction and dread for whoever
        runs the company, and it puts a small awkward strain on the client relationship
        every single month. To be precise about what that experience was: billing
        operations, not a dunning-recovery program. But the fix I would give any retainer
        business follows from it. Move recurring fees to automatic card or ACH billing,
        accept the setup and exceptions work it takes, and the entire category of
        chase-the-invoice churn risk disappears along with the monthly dread.
      </p>

      <h2 className={h2}>Fix it in this order</h2>
      <p>
        <strong>First, measure it separately.</strong> Split your churn into voluntary
        (customer decided) and involuntary (payment failed) before touching anything
        else. Most founder-led businesses have never made this split; churn is churn,
        calculated from whoever stopped paying. The two numbers demand opposite
        responses: voluntary churn is a product, service, or fit problem, while
        involuntary churn is an operations problem. Fixing your onboarding because failed
        payments inflated your churn rate means spending real money on the wrong disease.
      </p>
      <p>
        <strong>Second, prevent the preventable.</strong> Notify customers before a card
        on file expires. Use your billing platform&rsquo;s card-updater feature so
        expired cards refresh automatically. For retainers, that is the auto-charge move
        above.
      </p>
      <p>
        <strong>Third, recover the rest, fast.</strong> Failed payments are recoverable
        precisely because the customer never meant to leave, but the window is short: 90%
        of recovered payments are recovered within the first 10 days of the failure (
        <a
          href="https://recurly.com/blog/failed-payment-recovery-data-based-strategy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Recurly network data, 2026
        </a>
        ). A retry schedule plus a short, human sequence of payment-update emails, and a
        pause option offered before any hard cancellation, captures most of what can be
        captured.
      </p>
      <p>
        Before you buy anything to do this, check what you already pay for. Stripe,
        Chargebee, Recurly, and most billing platforms a founder-led business already
        runs include retry logic, dunning emails, and card updaters that are configurable
        rather than purchasable. The dedicated recovery vendors selling against this
        problem earn their fees at enterprise transaction volume; at $3M to $50M,
        configuration usually gets you most of the recovery those tools sell.
      </p>
      <p>
        In the Revenue Operations Maturity Model, a method I built for measuring RevOps
        competencies in a business, this whole progression lives inside the Subscription
        and MRR Operations competency: the bottom of the rubric is a business that does
        not measure involuntary churn separately and processes cancellations with no
        intervention, and the top is a business recovering a large share of at-risk
        payments with involuntary churn held under 1% a month. You do not need the top
        this quarter. You need the split, then the sequence.
      </p>
      <p>
        This is also one of the levers hiding inside your{" "}
        <Link href="/learn/net-revenue-retention" className="text-navy underline">
          net revenue retention
        </Link>{" "}
        number. NRR decomposes into churn, downgrades, and expansion, and involuntary
        churn is the piece of the churn driver that requires no product improvement, no
        save offers, and no difficult conversations to fix. It is usually the cheapest
        retention win available, which is exactly why it deserves to be measured on its
        own line. The place to start on the broader foundations is{" "}
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
