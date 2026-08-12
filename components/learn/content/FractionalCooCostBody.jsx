import Link from "next/link";
import Button from "@/components/ui/Button";
import CooComparisonTable from "@/components/learn/CooComparisonTable";
import CostAtAGlance from "@/components/learn/CostAtAGlance";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

// Verbatim transcription of the approved source copy. Internal links are added
// by wrapping exact existing phrases in <Link>, so not a word of the copy
// changes. The two CTAs are rendered here, at their source positions, because
// this page has two (scorecard mid-page, book at the foot); the shell skips its
// single default card via the entry's inlineCtas flag.
export default function FractionalCooCostBody() {
  return (
    <>
      <p>
        A{" "}
        <Link href="/learn/fractional-coo" className="text-navy underline">
          fractional COO
        </Link>{" "}
        costs between $3,000 and $20,000 a month, most commonly $5,000 to $15,000
        for ten to twenty hours a week. Hourly, the range runs $150 to $500, with
        most experienced operators charging $200 to $350. That is the number you
        came for.
      </p>
      <p>
        Here is the number the other cost guides skip past. At the common range,
        that is $60,000 to $180,000 a year, every year you keep the engagement
        running, for someone who does the work and then takes what they learned
        with them when the retainer ends.
      </p>
      <p>
        Before you spend that, I want to give you a better question than
        &ldquo;what does a fractional COO cost.&rdquo; The better question is
        which of four options actually fixes your problem. For a lot of
        founder-led companies between $3M and $50M, a fractional COO is not the
        cheapest or the most durable answer, and the other places writing about
        this cost will not tell you that, because they are selling the fractional
        COO. I am not, so I can give you the straight version.
      </p>

      <h2 className={h2}>The four ways to fix operations, compared</h2>
      <p>
        There are really four ways to get senior operational help into a growing
        business. Here is what each one costs, what you get, and what happens when
        it ends.
      </p>

      <CooComparisonTable />

      <p>
        Read that bottom row again, because it is the one that decides whether the
        money you spend compounds or evaporates. Three of these four options leave
        your company the day the invoice stops. One of them leaves your company
        stronger.
      </p>

      <h2 className={h2}>When a fractional COO is genuinely the right call</h2>
      <p>
        I am not going to pretend a fractional COO is never worth it. Sometimes it
        clearly is.
      </p>
      <p>
        Hire one when you need senior operational leadership immediately and you
        do not have anyone internal worth promoting into it. When the need is real
        but temporary, a turnaround, a systems overhaul, or a leadership gap
        between full-time hires. When you are heading into a fundraise or a sale
        on a clock and you need an experienced operator in the room now, not in
        four months. When the complexity is genuinely executive-level and no
        amount of coaching a junior person will close the gap fast enough.
      </p>
      <p>
        In those situations, the retainer is not the expensive option. It is the
        fast one, and speed is what you are buying.
      </p>

      <h2 className={h2}>When a full-time COO is genuinely the right call</h2>
      <p>
        Hire a full-time COO when the operational load is permanent and large
        enough that it needs a senior person every day, not ten hours a week. When
        you need someone on-site, owning the room, making decisions in real time.
        When the company is big enough and complex enough that the role pays for
        itself several times over.
      </p>
      <p>
        If you are running a $30M or $40M business with real operational depth and
        a leadership team that needs a peer, the $400,000 all-in cost is not the
        point. The point is whether the role is a permanent fixture of how the
        company runs. If it is, hire for it properly.
      </p>

      <h2 className={h2}>When a project consultant is genuinely the right call</h2>
      <p>
        Bring in a project consultant when you have one specific, bounded problem
        with a clear finish line. A CRM migration. A single process overhaul. A
        systems integration that needs an expert for a defined stretch and then
        does not need them anymore.
      </p>
      <p>
        The fixed fee is honest for honest work. The risk is only when a one-time
        project quietly becomes an open-ended dependency, or when the deliverable
        is a document your team never actually adopts.
      </p>

      <h2 className={h2}>
        The option the other cost guides leave out: promote and coach
      </h2>
      <p>
        Here is the fourth option, and it is the one you will not find on the
        other pages about fractional COO cost, because it argues against the thing
        they are selling.
      </p>
      <p>
        For a large share of founder-led companies in this range, the honest
        answer is not to rent an executive at all. It is to take someone capable
        you already have, or hire one good operator, and coach them to build the
        operational systems your business needs. This is{" "}
        <Link
          href="/revenue-operations-consulting"
          className="text-navy underline"
        >
          the model I built Modern BizOps around
        </Link>
        , and it exists because it is the right answer more often than the market
        admits.
      </p>
      <p>
        The math works differently. The coaching engagement runs $5,000 to $15,000
        a month, depending on its length and the impact on your business, and it
        runs for the length of the engagement, not forever. On top of that you
        carry the salary of a person you are frequently already paying anyway. I
        am not going to tell you that is automatically cheaper month to month than
        a fractional COO, because it is not. What it is, is bounded. When the
        engagement ends, there is no cliff and no more invoices. The systems are
        built, the person who built them is still on your payroll running them, and
        they can coach the next hire on how they work. You spent to build an asset
        you keep, instead of renting one you give back.
      </p>
      <p>
        It is also often the better answer when the job is narrower than a whole
        COO. A COO owns everything operational. But if what you actually need is
        someone to build the systems in one place,{" "}
        <Link
          href="/learn/marketing-and-sales-alignment"
          className="text-navy underline"
        >
          your marketing engine
        </Link>
        , your sales process, or your customer success motion, that is not a
        COO-sized problem. That is a focused, buildable piece of systems work, and
        it is exactly the kind of thing an internal owner can be coached through
        without you ever hiring an executive.
      </p>
      <p>
        I am not going to pretend this is the right answer for every company,
        because if I did, this would be a sales page instead of a straight
        comparison. It does not work when you have no internal candidate worth
        developing and no budget to hire even one good operator. It does not work
        when the need is truly interim and executive-level and you need it solved
        this quarter. And it is slower than dropping in a seasoned fractional COO,
        because your person is learning as they build.
      </p>
      <p>
        But when you do have someone worth developing, and what you actually need
        is durable systems rather than a temporary set of executive hands,
        promoting and coaching is the only one of these four options where the
        capability stays in the building after the money stops.
      </p>

      <CostAtAGlance />

      <h2 className={h2}>Not sure which one you need?</h2>
      <p>
        Most founders reach for a fractional COO because operations feel out of
        control, not because they have diagnosed exactly what is broken. And here
        is the honest caveat: a COO&rsquo;s job is broader than revenue
        operations, so no revenue-focused tool can tell you the whole picture.
        What it can tell you is whether the thing driving that out-of-control
        feeling is your revenue engine, which is what it is for most founder-led
        companies in this range.
      </p>
      <p>
        The AI Revenue Scan is a free diagnostic that scores your revenue
        operations against the{" "}
        <Link
          href="/predictable-revenue-engine"
          className="text-navy underline"
        >
          Revenue Operations Maturity Model
        </Link>
        , a method I built for measuring the revenue competencies of a business
        across four stages. If it surfaces the real problem, you likely do not
        need a COO at all, you need an internal owner coached to fix it. If your
        revenue operations come back healthy and the pain is somewhere else
        entirely, that is a useful signal too, because then you may genuinely need
        broader operational leadership.
      </p>
      <div className="mt-6">
        <Button href="/scorecard" ctaLocation="learn_mid_page">
          Get the Free Scan
        </Button>
      </div>

      <h2 className={h2}>Want a straight answer for your situation?</h2>
      <p>
        If you would rather talk it through, book a call. I will give you my honest
        read on which of these four options fits your business, including when the
        answer is a fractional COO or a full-time hire and not me. That candor is
        the whole point.
      </p>
      <div className="mt-6">
        <Button href="/book" ctaLocation="learn_foot">
          Book a call
        </Button>
      </div>
    </>
  );
}
