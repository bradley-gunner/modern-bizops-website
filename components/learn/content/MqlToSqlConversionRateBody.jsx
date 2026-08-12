import Link from "next/link";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

export default function MqlToSqlConversionRateBody() {
  return (
    <>
      <p>
        Your MQL to SQL conversion rate is the percentage of marketing qualified leads
        that sales accepts as sales qualified leads. Divide SQLs by MQLs for the same
        period and multiply by 100: fifty SQLs from two hundred MQLs is a 25% conversion
        rate.
      </p>
      <p>
        Most guides treat this as a scoreboard metric to benchmark and move on. That
        wastes it. This number sits exactly on the seam between marketing and sales,
        which means when it is low, it is telling you precisely where your revenue engine
        leaks, and the failure has one of three signatures you can read directly out of
        your CRM. This page covers the benchmark, then the diagnosis.
      </p>

      <h2 className={h2}>What a normal number looks like</h2>
      <p>
        The most useful published benchmark comes from First Page Sage, which analyzed
        its own client data from 2019 through 2025 across more than 25 industries: the
        average MQL to SQL conversion rate lands around 13%, ranging from about 10%
        (legal services, real estate) to 26% (business insurance, HVAC), with B2B SaaS
        and IT services both at 13% (
        <a
          href="https://firstpagesage.com/seo-blog/mql-to-sql-conversion-rate-by-industry/"
          target="_blank"
          rel="noopener noreferrer"
        >
          First Page Sage, 2026 report
        </a>
        ).
      </p>
      <p>
        One caveat before you grade yourself against that: published MQL-to-SQL
        benchmarks vary widely across sources, because companies define &ldquo;MQL&rdquo;
        with wildly different rigor. A company with a strict MQL definition converts a
        high percentage of a small number; a company that counts every ebook download
        converts a low percentage of a big one. Same funnel health, opposite-looking
        metrics. That is why your number is most useful as a trend and a diagnostic, not
        as a trophy.
      </p>
      <p>
        Sit with what the average implies, though. At 13%, roughly seven of every eight
        leads marketing counted as qualified never became something sales agreed was
        real. Whatever you spent generating those leads, about 87% of it produced
        pipeline nobody worked. That is the cost of a broken handoff, and it is usually
        invisible because each team&rsquo;s own scoreboard looks fine.
      </p>

      <h2 className={h2}>
        The three ways the handoff breaks, and the signature of each
      </h2>
      <p>
        <strong>Break one: the definition gap.</strong> Marketing and sales mean
        different things by &ldquo;qualified,&rdquo; so sales silently ignores what
        marketing sends. The signature: a low acceptance rate paired with
        disqualification reasons concentrated in fit problems (&ldquo;wrong
        industry,&rdquo; &ldquo;too small,&rdquo; &ldquo;not the buyer&rdquo;). The fix
        is not better leads, it is one written definition both teams build and sign,
        enforced as required CRM fields. That work is the{" "}
        <Link
          href="/learn/lead-qualification-framework"
          className="text-navy underline"
        >
          lead qualification framework
        </Link>
        , applied jointly per the{" "}
        <Link
          href="/learn/marketing-and-sales-alignment"
          className="text-navy underline"
        >
          marketing and sales alignment
        </Link>{" "}
        system.
      </p>
      <p>
        <strong>Break two: the speed gap.</strong> The definition is fine, but leads sit.
        Buyer intent decays in hours, not weeks, and a lead worked three days late
        converts like a cold call. The signature: time from handoff to first sales
        activity is long or unmeasured, and &ldquo;no response&rdquo; dominates your
        disqualification reasons. The fix is a written response-time commitment with
        visible violations, one half of the SLA the alignment guide covers.
      </p>
      <p>
        <strong>Break three: the targeting gap.</strong> Sales responds fast and the
        definition is shared, but the leads themselves are the wrong people, which means
        the problem is upstream of the handoff entirely. The signature: healthy response
        times, honest acceptance attempts, and losses concentrated early with fit-based
        reasons that trace back to specific campaigns or channels. The fix is feeding
        those reason codes back into targeting monthly, and checking the campaigns
        against a real{" "}
        <Link href="/learn/ideal-customer-profile" className="text-navy underline">
          ideal customer profile
        </Link>
        .
      </p>
      <p>
        Notice what all three signatures require: a handoff instrumented well enough to
        read. A defined trigger for when a lead moves to sales, required data attached at
        handoff, an explicit accept-or-return step with reason codes, and timestamps on
        first touch. In the GTM Maturity Framework, a method I built for
        measuring go-to-market competencies in a business, that instrumentation is Stage 2
        work, and this metric appears in the framework&rsquo;s own assessment signals
        precisely because a company that can produce it accurately has, by definition,
        built the handoff. If you cannot compute your MQL-to-SQL rate today, that fact is
        itself the diagnosis, and the place to start is the{" "}
        <Link
          href="/learn/revenue-operations-maturity-stage-1-reactive"
          className="text-navy underline"
        >
          Stage 1 foundations
        </Link>{" "}
        underneath it.
      </p>
      <p>
        A worked illustration: suppose a $6M B2B company generates 200 MQLs a quarter and
        converts 16, an 8% rate against a 13% industry average. Pulling the reason codes
        shows 90 leads returned as &ldquo;wrong industry,&rdquo; traceable to one paid
        channel. That is not a sales effort problem or a lead volume problem; it is one
        targeting fix with a name on it. The company that never instrumented the handoff
        would have answered the same quarter with &ldquo;we need more leads,&rdquo; and
        paid twice for the same leak.
      </p>
    </>
  );
}
