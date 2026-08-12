import Link from "next/link";
import StatCards from "@/components/learn/StatCards";
import PaymentRecoveryTable from "@/components/learn/PaymentRecoveryTable";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

const STATS = [
  {
    big: "90% in 10 days",
    desc: "Share of recovered payments recovered within the first ten days of failure.",
    source: "Recurly network data, 2026",
  },
  {
    big: "2 failure modes",
    desc: "Failed card charges (dunning) and unpaid invoices (auto-charge fixes both).",
    source: "Modern BizOps",
  },
];

export default function PaymentRecoveryBody() {
  return (
    <>
      <p>
        Payment recovery is collecting money you already earned but have not been paid. Not
        a new sale, not an upsell. Revenue you already won, sitting uncollected because a
        charge failed or an invoice went unpaid. It is the cheapest revenue in your
        business to go get, and most founder-led companies leave a meaningful amount of it
        on the table because nobody owns the follow-up.
      </p>
      <p>
        There are two ways the money gets stuck, and they need different fixes. If you bill
        a card on a subscription or membership, the failure is a declined or expired card,
        and the fix is called dunning: the automatic retries and reminders that recover a
        failed charge. If you bill retainer clients by invoice, the failure is the invoice
        that sits unpaid until someone chases it. Both are payment recovery. Neither is
        debt collection, which is a separate, later, and more adversarial process for money
        that has gone truly delinquent. Getting those three straight is the first move,
        because the software markets for each are completely different, and buying the
        wrong category is how founder-led businesses waste money solving a problem they
        could have configured away.
      </p>
      <p>
        One scoping note: this page is for recurring-revenue businesses. SaaS,
        subscriptions, memberships, and retainer services all have a payment-recovery
        problem. A pure one-off project business mostly does not, because there is no
        recurring charge to fail.
      </p>

      <h2 className={h2}>
        The order of operations, and it is not &ldquo;buy software&rdquo;
      </h2>
      <p>
        The single most common mistake here is buying a recovery tool before configuring
        the recovery you already own. Before you evaluate anything, do these in order.
      </p>
      <p>
        First, measure the leak. Pull your failed charges and your unpaid or late invoices
        for the last few months and add up the dollars. Most founders have never looked at
        this number, and it is usually bigger than they expect and almost entirely
        recoverable, because the customer never chose to stop paying. If you have not
        separated this from your general churn, some of what you have been calling a
        retention problem is a billing problem, and the{" "}
        <Link href="/learn/involuntary-churn" className="text-navy underline">
          involuntary churn
        </Link>{" "}
        page covers exactly why that distinction changes what you should fix.
      </p>
      <p>
        Second, turn on what you already pay for. Stripe Billing, Chargebee, Recurly,
        Maxio, and essentially every modern billing platform already include retry logic,
        dunning emails, and a card-updater that refreshes expired cards automatically.
        These are usually switched off or left on a weak default. Configuring them well
        recovers most of what the dedicated tools sell, at your transaction volume, without
        a new contract.
      </p>
      <p>
        Third, recover fast, because the window is short. Recurly&rsquo;s network data shows
        that 90% of recovered payments are recovered within the first 10 days of the failure
        (
        <a
          href="https://recurly.com/blog/failed-payment-recovery-data-based-strategy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Recurly, failed-payment recovery data
        </a>
        ). A sensible retry schedule plus a short, human sequence of payment-update emails,
        and a pause option offered before any hard cancellation, captures the large majority
        of what is capturable. Speed is the whole game, and it is a settings problem before
        it is a software problem.
      </p>
      <p>
        For invoiced retainer businesses, the highest-leverage fix is different, and our
        founder lived it. As the COO of an agency, Bradley personally chased clients month
        after month to get invoices paid on time, and the cost is only partly cash flow. It
        is a recurring source of friction and dread for whoever runs the company. To be
        precise, that was billing operations, not a payment-recovery-rate program. But the
        fix that came out of it is the one we would give any retainer business: move
        recurring fees to automatic card or ACH billing, accept the setup and exceptions
        work, and the entire chase-the-invoice category mostly disappears. You do not
        recover those payments faster, you stop them from failing in the first place.
      </p>

      <StatCards
        label="What the payment data says"
        title="Recoverable, but only if you move fast"
        stats={STATS}
      />

      <h2 className={h2}>When recovery software is actually worth buying</h2>
      <p>
        Once the built-in tools are configured and the invoices are on auto-charge, most
        founder-led businesses have solved the problem. Software earns its fee in specific
        situations, not by default. Here is the honest comparison.
      </p>

      <PaymentRecoveryTable />

      <p>
        The pattern is the same one that runs through all of revenue operations: configure
        and fix the fundamentals before you buy a tool to paper over them. A recovery
        vendor pointed at a business that never turned on its billing platform&rsquo;s
        retries is selling you a result you already owned.
      </p>

      <h2 className={h2}>Where payment recovery sits in revenue operations maturity</h2>
      <p>
        In the GTM Maturity Framework, a method we built for measuring the go-to-market
        competencies of a business, this lives inside the Subscription and MRR Operations
        competency. At the bottom is a business that does not measure failed payments
        separately, processes a cancellation with no intervention, and chases invoices by
        hand when it remembers to. The top is a business recovering the large majority of
        at-risk payments automatically, with recurring fees on auto-charge and
        failed-payment loss held to a fraction of a percent a month. You do not need the top
        this quarter. You need the leak measured, the built-in tools configured, and
        retainers moved to auto-charge.
      </p>
      <p>
        This is also one of the cheapest levers hiding inside your{" "}
        <Link href="/learn/net-revenue-retention" className="text-navy underline">
          net revenue retention
        </Link>{" "}
        number, because recovered payments require no product improvement, no save offers,
        and no hard conversations. It is usually the least painful retention win available.
        Where the broader foundations start is{" "}
        <Link
          href="/learn/revenue-operations-maturity-stage-1-reactive"
          className="text-navy underline"
        >
          Stage 1 of the maturity framework
        </Link>
        .
      </p>
    </>
  );
}
