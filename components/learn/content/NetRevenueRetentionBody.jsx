import Link from "next/link";
import StatCards from "@/components/learn/StatCards";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

// Stat cards only. No ladder: despite NRR being a Stage 3 competency, this page
// has no Level 1 to 5 rubric to render. Its maturity section is a single prose
// paragraph describing four states, and turning that into five rungs would mean
// writing a rubric that the approved copy does not contain.
const STATS = [
  {
    big: "102%",
    desc: "Median net revenue retention for private B2B companies with annual contract values between $25,000 and $50,000, with the top quartile at 111% and the bottom quartile at 97%.",
    source: "SaaS Capital, 2025 retention benchmarks",
  },
  {
    big: "110%",
    desc: "Companies at or above this grew faster than the 24% median growth rate. Companies below 100% grew slower. Read as directional if you run an agency or MSP on retainers.",
    source: "SaaS Capital, 2025 retention benchmarks",
  },
];

export default function NetRevenueRetentionBody() {
  return (
    <>
      <p>
        Net revenue retention (NRR) is the percentage of last year&rsquo;s revenue you
        kept from last year&rsquo;s customers, after churn, downgrades, and expansion
        are all counted. At 100%, your existing customers are worth exactly what they
        were a year ago. Below 100%, your business leaks: some of every new deal you
        close goes to refilling a bucket with a hole in it. Above 100%, your existing
        customers grow your revenue on their own, before you sign anyone new.
      </p>
      <p>
        That is why it is the one number that shows whether growth is real. Top-line
        growth can come entirely from new logos papering over churn. NRR cannot be
        papered over. Here is the question I would ask you, the same one I ask on a
        discovery call: if you stopped acquiring new clients today, what would happen
        to your revenue over the next 12 months? If you cannot answer that with a
        number, this page is for you.
      </p>
      <p>
        One scoping note before the math. NRR is built for businesses with recurring or
        repeat revenue: agencies and MSPs on retainers, SaaS, subscription services,
        membership businesses. If your revenue is entirely one-off projects, track
        repeat purchase rate instead; the logic transfers, the formula does not.
      </p>

      <h2 className={h2}>The net revenue retention formula</h2>
      <p>
        Take a cohort of customers from 12 months ago and compare their revenue then
        and now:
      </p>
      <p>
        <strong>
          NRR = (current monthly recurring revenue from the customers you had 12 months
          ago) ÷ (their monthly recurring revenue 12 months ago)
        </strong>
      </p>
      <p>
        Only customers who existed at the start of the window count. New customers
        signed since then are excluded, which is the entire point: the metric isolates
        what your existing base did. Expansion, upsells, cross-sells, and price
        increases push the numerator up. Churn and downgrades pull it down.
      </p>
      <p>
        Suppose, as an illustration, an agency had $400,000 in monthly retainers a year
        ago. Since then, two clients worth a combined $30,000 a month left, one
        downgraded by $10,000, and expansions across the rest added $25,000. Those same
        clients now bill $385,000 a month. NRR is 385 ÷ 400, or 96%. The agency gave
        back 4% of its base before a single new deal counted toward growth. If it grew
        top-line revenue 15% that year, roughly a fifth of its new business went to
        refilling the bucket.
      </p>
      {/* The Revenue Leak Calculator (/calculators/revenue-leak, piece 2.2,
          not yet built) will embed at this sentence in a future change. The
          page stands alone until then; no link, per the internal-links summary. */}
      <p>
        You can run this on your own numbers in a spreadsheet in ten minutes. Pull the
        client list from 12 months ago, their billing then, their billing now, and
        divide.
      </p>

      <h2 className={h2}>Gross revenue retention, the honest floor</h2>
      <p>
        Gross revenue retention (GRR) is the same formula with expansion stripped out:
        for the calculation, no customer counts for more than they were worth a year
        ago. It can never exceed 100%. GRR answers a colder question: how much revenue
        do you keep when nobody upgrades?
      </p>
      <p>
        The two numbers matter together. A business at 105% NRR and 70% GRR is not
        healthy, it is churning heavily and masking the loss with big expansions from a
        few accounts, which is concentration risk wearing a growth costume. A business
        at 98% NRR and 95% GRR has a much sturdier base and one solvable problem. Track
        both, decompose the gap into its drivers (churn, downgrades, expansion), and
        assign each driver an owner. That decomposition, not the calculation itself, is
        where the operating leverage is.
      </p>

      <h2 className={h2}>What a good number looks like</h2>
      <p>
        The best available benchmark data for private companies comes from SaaS
        Capital&rsquo;s annual survey of private B2B businesses. In their 2025 study,
        companies with annual contract values between $25,000 and $50,000 showed a
        median NRR of 102%, with the top quartile at 111% and the bottom quartile at
        97%. Retention correlates with contract size: the bigger the annual contract,
        the higher the typical NRR. And the growth connection is direct: across their
        sample, companies with NRR of at least 110% grew faster than the 24% median
        growth rate, and companies below 100% grew slower (
        <a
          href="https://www.saas-capital.com/blog-posts/what-is-a-good-retention-rate-for-a-private-saas-company/"
          target="_blank"
          rel="noopener noreferrer"
        >
          SaaS Capital, 2025 retention benchmarks
        </a>
        ).
      </p>

      <StatCards
        label="What the benchmarks say"
        title="Private B2B retention, by the numbers"
        stats={STATS}
      />

      <p>
        Those benchmarks are drawn from SaaS companies, so read them as directional if
        you run an agency or MSP on retainers. The working thresholds I use: below 95%,
        retention is the growth problem, fix it before spending another dollar on
        acquisition. Between 95% and 105%, you are normal and have room to compound.
        Above 105%, your existing base is a growth engine and your acquisition spend is
        pure offense.
      </p>

      <h2 className={h2}>Where NRR sits in revenue operations maturity</h2>
      <p>
        In the GTM Maturity Framework, NRR management is a Stage 3
        competency, which tells you something in itself: most B2B businesses
        are not there yet, and that is normal. The progression looks like this. At the
        bottom, NRR is simply not calculated; existing-customer revenue is not even
        separated from new-logo revenue in reporting. The first real step is
        calculating it monthly and decomposing it into its drivers, each with an owner.
        Mature businesses treat it as a primary metric with improvement targets per
        driver. And at the top, NRR exceeds 100% and the customer base grows revenue
        year over year without a single new logo. You do not need the top today. You
        need to know your number and which driver is dragging it.
      </p>
      {/* This link points at the Stage 1 hub as the maturity framework's entry
          point: no Stage 3 hub exists yet. Re-point it if a Stage 3 hub ships,
          per the internal-links summary. */}
      <p>
        This is also a place where the fundamentals-first rule applies to AI and
        tooling. Churn-prediction software applied to a business that cannot yet
        compute its own NRR from clean billing data automates guesswork. Get the
        number, the decomposition, and the owners first. The{" "}
        <Link
          href="/learn/revenue-operations-maturity-stage-1-reactive"
          className="text-navy underline"
        >
          maturity framework overview
        </Link>{" "}
        shows where that foundation starts.
      </p>
    </>
  );
}
