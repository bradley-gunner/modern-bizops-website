import Link from "next/link";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

export default function DataQualityManagementBody() {
  return (
    <>
      <p>
        If your leadership meeting spends its first ten minutes arguing about whose
        number is correct before anyone can actually discuss the business, you do not
        have a reporting problem. You have a data quality problem, and it is costing
        you more than the ten minutes.
      </p>

      <h2 className={h2}>What this actually looks like</h2>
      <p>
        Here is the tell. When your leadership team looks at a revenue report, how much
        of that meeting gets spent debating whether the numbers are even right? If the
        honest answer is &ldquo;most of it,&rdquo; the report has already failed at its
        one job before the discussion even starts.
      </p>
      <p>
        This is not usually one dramatic failure. It is small, ongoing decay. A field
        goes unpopulated because nobody enforced it at entry. A duplicate record splits
        a client&rsquo;s history across two profiles. A deal sits untouched for months
        with a close date that quietly drifted into the past. None of it looks like a
        crisis on any single day. All of it compounds into a dataset nobody trusts,
        which means nobody uses it to actually make a decision, which means the meeting
        exists to argue about the data instead of act on it.
      </p>
      <p>
        The team almost always knows the data is messy. What is usually missing is not
        awareness. It is accountability. Someone occasionally does a manual cleanup
        pass when it gets bad enough to notice. Nobody owns keeping it clean as an
        ongoing job, so the same problems recur every few months, and every recurrence
        resets the trust the team has in the numbers back to zero.
      </p>

      <h2 className={h2}>What this actually costs you</h2>
      <p>
        Gartner&rsquo;s own research puts the average cost of poor data quality at
        $12.9 million a year per organization (
        <a
          href="https://www.gartner.com/en/data-analytics/topics/data-quality"
          target="_blank"
          rel="noopener noreferrer"
        >
          source
        </a>
        ). That number sounds abstract until you trace where it actually comes from:
        decisions made on wrong information, deals mismanaged because the record did
        not reflect reality, hours spent reconciling numbers that should have agreed
        with each other from the start. None of that shows up as a single line item.
        All of it shows up as slower decisions, lower trust, and a leadership team that
        has quietly stopped believing its own dashboards.
      </p>
      <p>
        The revenue-specific version of this cost is sharper than the general figure
        suggests. If your pipeline data is unreliable, your forecast is unreliable, and
        a forecast nobody trusts does not just look bad in a board meeting. It changes
        real decisions: hiring plans, budget approvals, and how confidently you can
        commit to a number outside the building. The data problem does not stay
        contained to a dashboard. It quietly infects every decision built on top of it.
      </p>

      <h2 className={h2}>Why this happens even when everyone means well</h2>
      <p>
        Data quality rarely fails because people do not care. It fails because nobody
        is specifically accountable for it as an ongoing job, and because it is treated
        as a periodic cleanup project instead of a standing discipline. The team knows
        the CRM is messy. Someone occasionally spends a weekend fixing the worst of it.
        Then the same drift starts again immediately, because the underlying behavior
        that created the mess, no enforced fields, no monitoring, no owner, was never
        actually addressed.
      </p>
      <p>
        This is also the one Stage 1 competency where the AI-accelerated version
        genuinely changes the day-to-day work, not just the ceiling. HubSpot rebuilt
        its Clearbit acquisition into Breeze Intelligence, which draws on a database of
        more than 400 million contacts and 50 million companies to fill in gaps the
        moment a record is created, and Clay operates as a standalone enrichment layer
        doing similar work across whatever CRM you run. On HubSpot&rsquo;s Operations
        Hub, some teams now chain a single workflow that formats a phone number, fixes
        capitalization, enriches the record, and checks for duplicates in one automated
        pass. What used to be a manual weekend project can now run continuously in the
        background on every new record.
      </p>
      <p>
        You do not need to buy a dedicated enrichment tool to get a rough version of
        this yourself. Export a batch of contacts, companies, or deals, upload it to
        Claude, ChatGPT, or Grok, and ask it to flag duplicates, standardize
        formatting, and identify which required fields are missing. You can run that
        once a month with a tool you likely already pay for. What a dedicated
        enrichment platform buys you is automation, it happens on every new record the
        moment it is created, not a capability you cannot get any other way (
        <a
          href="https://www.clay.com/blog/crm-data-enrichment"
          target="_blank"
          rel="noopener noreferrer"
        >
          source
        </a>
        ).
      </p>

      <h2 className={h2}>What good looks like, one step at a time</h2>
      <p>
        <strong>Level 1:</strong> Data quality is not tracked or managed anywhere.
        Everyone knows the data is messy. No one is specifically accountable for fixing
        it. Reports get distrusted on sight, and every review meeting starts the same
        way, arguing about the numbers.
      </p>
      <p>
        <strong>Level 2:</strong> Data quality problems are known and occasionally
        addressed. Someone manually cleans the CRM when it gets bad enough to notice.
        There is no systematic monitoring, so the same problems keep recurring on their
        own schedule.
      </p>
      <p>
        <strong>Level 3 (Functional):</strong> Required fields at each pipeline stage
        are enforced, not just suggested. A data quality audit runs on a real schedule,
        monthly or quarterly. Someone specific is accountable for the outcome, and the
        most common recurring errors have already been identified and addressed at the
        source.
      </p>
      <p>
        <strong>Level 4:</strong> Data quality gets measured weekly with specific
        metrics, completeness rate, duplicate rate, field accuracy. Automated processes
        flag and fix common errors before a human ever has to. Enrichment tools fill
        key fields automatically. Data quality is a tracked team metric, not an
        afterthought someone mentions when it is bad.
      </p>
      <p>
        <strong>Level 5 (top):</strong> Data quality is treated as infrastructure, not
        a project. It is continuously monitored, automatically remediated wherever
        possible, and reported on the same way any other business metric is. Leaders
        trust the dashboards without the qualification they used to add out of habit.
        New data quality issues get caught and resolved within days, not the months it
        used to take before anyone noticed.
      </p>

      <h2 className={h2}>The dependency worth naming directly</h2>
      <p>
        Data quality management depends on CRM architecture and governance being solid
        first. Enrichment and cleanup fix missing or wrong fields. They do not invent a
        data model that was never designed to reflect how your business actually sells.
        If your{" "}
        <Link href="/learn/crm-architecture-and-governance" className="text-navy underline">
          CRM&rsquo;s data model does not match your real sales process yet
        </Link>
        , fixing the data quality on top of it is polishing a structure that is still
        the wrong shape.
      </p>
    </>
  );
}
