import Link from "next/link";
import BenchmarkTable from "@/components/learn/BenchmarkTable";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

// The page's own HRBench figures, moved out of the plain table into the dark
// block. Same numbers, verbatim; the SaaS row keeps its inline sub-source.
const BENCHMARKS = [
  {
    type: "Private B2B SaaS",
    value: "median $129,724",
    note: "SaaS Capital 2025 survey, 1,000+ companies",
  },
  { type: "Professional services", value: "$150,000 to $300,000" },
  { type: "Manufacturing / product", value: "$150,000 to $250,000" },
  { type: "Healthcare", value: "$150,000 to $250,000" },
  { type: "Retail", value: "$80,000 to $150,000" },
  { type: "Hospitality", value: "$50,000 to $100,000" },
];

export default function RevenuePerEmployeeBody() {
  return (
    <>
      <p>
        Revenue per employee is your total annual revenue divided by your headcount. It
        is the simplest available measure of whether your business turns people into
        revenue efficiently, and it answers a question every founder eventually asks the
        hard way: can we grow without hiring, or does every new dollar require another
        salary?
      </p>
      <p>
        Here is the question I would put to you on a discovery call: if your revenue
        doubled over the next 18 months, how much would your team have to grow? If your
        honest answer is &ldquo;it would roughly double too,&rdquo; your growth is really
        just payroll wearing a bigger number. This page covers the formula and the
        benchmarks, and then the part almost every guide skips: what actually moves the
        number.
      </p>

      <h2 className={h2}>The formula, and the two traps inside it</h2>
      <p>
        <strong>
          Revenue per employee = total revenue for the period ÷ number of employees
        </strong>
      </p>
      <p>
        Use trailing twelve-month revenue from your income statement, gross revenue
        before expenses. Count everyone on payroll, not just the revenue team; the whole
        point of the metric is that every salary is supposed to be in service of revenue
        somewhere.
      </p>
      <p>
        Two decisions will quietly distort your number if you do not make them
        deliberately. First, part-time staff: if a meaningful share of your team is
        part-time, count full-time equivalents (two half-time people equal one FTE) or
        you will understate your efficiency. Second, contractors: exclude them unless
        they are a sustained, core part of how you generate revenue, and whichever way
        you decide, apply it the same way every period. A business that measures itself
        one way in Q1 and another way in Q3 has manufactured a trend that does not exist.
      </p>
      <p>
        A worked illustration: suppose an $8M company runs with 40 people. Revenue per
        employee is $200,000. If it grows to $10M by adding 12 people, revenue grew 25%
        while the metric fell to about $192,000. The top line says growth; the ratio says
        the machine got less efficient and the margin is quietly paying for it.
      </p>

      <h2 className={h2}>Revenue per employee benchmarks by industry</h2>
      <p>
        The published cross-industry average is around $350,000, but that figure is
        skewed hard by capital-intensive sectors like energy and financial services, and
        it is nearly useless as a target for a B2B company. What matters is your
        business model&rsquo;s range. The most useful published figures (
        <a
          href="https://www.hrbench.com/resource/learn/revenue-per-employee"
          target="_blank"
          rel="noopener noreferrer"
        >
          HRBench, 2026 benchmarks
        </a>
        ):
      </p>

      <BenchmarkTable
        label="The benchmarks"
        title="Revenue per employee by business model"
        rows={BENCHMARKS}
      />

      <p>
        Read these as ranges, not report cards. Company stage matters: revenue typically
        grows faster than headcount at scale, so a $30M company should naturally run a
        higher number than a $4M company in the same industry. And because the metric
        measures revenue rather than profit, a high number with collapsing margins is not
        efficiency, it is a business outsourcing its costs somewhere the ratio cannot
        see.
      </p>
      <p>
        The single most useful discipline is the one the benchmark publishers themselves
        recommend: your own trend beats any external number. A business that moved from
        $180,000 to $230,000 over two years is getting structurally healthier regardless
        of where the industry median sits. A business drifting the other way has a
        question to answer, even if it still beats the benchmark.
      </p>

      <h2 className={h2}>How to actually improve the number</h2>
      <p>
        Almost every guide you find on revenue per employee stops at &ldquo;increase
        revenue or decrease headcount,&rdquo; which is arithmetic, not advice. There are
        three real levers, and the order matters.
      </p>
      <p>
        <strong>Lever one: stop leaking the revenue you already earn.</strong> Before any
        conversation about productivity, find where earned demand dies. Leads that go
        untouched for days. A pipeline where deals stall because no stage has real exit
        criteria. Customers who churn in the first 90 days because onboarding depends on
        who happens to run it. Fixing these raises the numerator with the exact team you
        already pay. This is the core argument of the{" "}
        <Link
          href="/learn/marketing-and-sales-alignment"
          className="text-navy underline"
        >
          marketing and sales alignment
        </Link>{" "}
        work: most companies do not have a demand problem, they have a leak problem.
      </p>
      <p>
        <strong>Lever two: systematize before you backfill.</strong> The default reflex
        when a team feels stretched is to hire. The cheaper question is what the current
        team spends its hours on. Manual CRM updates, re-keying data between tools,
        chasing internal status: this is work a documented process plus targeted
        automation removes, and it is where AI genuinely earns its keep in a business
        this size, applied to fundamentals that already work. When the reflex to hire
        meets a systematized operation, the hire often turns out to be unnecessary, and
        when it is necessary, the new person ramps into a system instead of into chaos.
      </p>
      <p>
        <strong>
          Lever three: hire against expected revenue, not against workload feel.
        </strong>{" "}
        Mature operators decide headcount by asking what revenue the next hire should
        produce and how they will know. In the GTM Maturity Framework, a
        method I built for measuring a business&rsquo;s go-to-market competencies, this is a
        Stage 3 competency: revenue per employee tracked monthly, reviewed by function,
        and used as the lens for every headcount decision. Most B2B companies are
        not there yet, and that is normal. The entry point is simply calculating the
        number quarterly and watching the trend, which costs nothing and changes the
        hiring conversation immediately. Where that foundation starts is{" "}
        <Link
          href="/learn/revenue-operations-maturity-stage-1-reactive"
          className="text-navy underline"
        >
          Stage 1
        </Link>{" "}
        work.
      </p>
      <p>
        The dollar version of this analysis is the one worth having. Your revenue per
        employee, against your business model&rsquo;s benchmark, converts to a dollar
        gap: the revenue your current team would produce at peer efficiency. Finding that
        gap is exactly what the AI Revenue Scan puts in front of you, against the named
        public benchmarks above, keyed to your business model rather than a generic
        average.
      </p>
    </>
  );
}
