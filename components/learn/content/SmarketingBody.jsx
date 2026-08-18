import Link from "next/link";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

export default function SmarketingBody() {
  return (
    <>
      <p>
        Smarketing is the practice of running sales and marketing as one team with one
        goal, one definition of a qualified lead, and one scoreboard. The word is a
        portmanteau of &ldquo;sales&rdquo; and &ldquo;marketing,&rdquo; popularized by{" "}
        <a
          href="https://www.hubspot.com/web-guide/the-power-of-smarketing/introduction"
          target="_blank"
          rel="noopener noreferrer"
        >
          HubSpot
        </a>
        , and the concept is older than the word: revenue suffers when the team that
        generates demand and the team that closes it optimize for different numbers.
      </p>
      <p>
        Here is the version of the definition that actually explains the problem. In most
        companies, marketing grades its own homework and sales grades its own homework.
        Marketing reports leads generated, and hits its number. Sales reports deals
        closed, and misses its number. Both scoreboards are green and red at the same
        time, every quarterly meeting becomes a jurisdiction dispute, and the founder
        ends up as the referee. Smarketing, stripped of the cute name, means one
        scoreboard that neither team controls alone.
      </p>

      <h2 className={h2}>What one scoreboard changes</h2>
      <p>
        The middle of the funnel is where two scoreboards show up in the data. Marketing
        hands over leads it calls qualified; sales works the ones it agrees with and
        quietly ignores the rest. Across industries, the average business converts only
        around 13% of marketing qualified leads into sales qualified leads, based on
        First Page Sage&rsquo;s multi-year analysis of client data across 25+ industries
        (
        <a
          href="https://firstpagesage.com/seo-blog/mql-to-sql-conversion-rate-by-industry/"
          target="_blank"
          rel="noopener noreferrer"
        >
          First Page Sage, 2026 report
        </a>
        ). Read that number for what it implies: at a typical company, roughly seven out
        of eight leads marketing counted as wins never became something sales would
        count. Both teams hit their numbers. The company did not.
      </p>
      <p>
        That gap is not a personality conflict, and it does not respond to alignment
        offsites. It responds to infrastructure: a written definition of a qualified lead
        both teams sign, a handoff with a trigger and an acceptance step, and a service
        level agreement that binds both directions. That is a buildable system, and the
        full version, all three pieces, lives in the{" "}
        <Link
          href="/learn/marketing-and-sales-alignment"
          className="text-navy underline"
        >
          marketing and sales alignment
        </Link>{" "}
        guide. The specific mechanics of measuring the handoff are covered in the{" "}
        <Link
          href="/learn/mql-to-sql-conversion-rate"
          className="text-navy underline"
        >
          MQL to SQL conversion rate
        </Link>{" "}
        guide.
      </p>

      <h2 className={h2}>The founder-sized version</h2>
      <p>
        Almost everything written about smarketing assumes a marketing department, a
        sales floor, and a RevOps function refereeing them. You may have two marketers
        and a sales team you still lead personally. That does not exempt you; it means
        your version is cheaper and faster to build.
      </p>
      <p>
        At your scale, smarketing is three decisions you can make this month.
        Decide, in writing, what a qualified lead is, in observable criteria both teams
        helped define. Decide what happens at handoff: what triggers it, what data must
        be attached, and how sales formally accepts or returns a lead with a reason.
        Decide what number both teams answer to together, and make it revenue or
        qualified pipeline, never raw lead volume, because any team graded on volume
        alone will lower the bar to hit it. The{" "}
        <Link
          href="/learn/lead-qualification-framework"
          className="text-navy underline"
        >
          lead qualification framework
        </Link>{" "}
        is the shared-definition half of that work in detail.
      </p>
      <p>
        The test for whether you have smarketing or just meetings: when did marketing
        last change something specific because of what sales reported back? If the answer
        is never, the teams are cohabiting, not aligned.
      </p>
    </>
  );
}
