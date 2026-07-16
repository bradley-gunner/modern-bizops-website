import Link from "next/link";
import MaturityLadder from "@/components/learn/MaturityLadder";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

// The page's own Level 1 to 5 rubric, moved out of prose. No stat cards here:
// this page cites two sources but no hard numbers, and the spec's bar for stat
// cards is two cited benchmarks.
const RUNGS = [
  {
    level: 1,
    desc: (
      <>
        There is no real system of record. Revenue data lives in someone&rsquo;s inbox,
        a spreadsheet, or <b>your head</b>.
      </>
    ),
  },
  {
    level: 2,
    desc: (
      <>
        A CRM exists, but gets used inconsistently. Fields are empty half the time, and
        the setup has not been touched since the day it was installed.
      </>
    ),
  },
  {
    level: 3,
    desc: (
      <>
        Everyone who touches a customer actually uses the CRM. The data model reflects
        your <b>real sales and service process</b>, not a generic template. Required
        fields force the data to get entered at the moments that matter. One person owns
        governance and approves changes, so the system does not quietly rot.
      </>
    ),
  },
  {
    level: 4,
    desc: (
      <>
        You have a governance charter, a change-request process, and an annual review of
        the data model against how the business actually works now, not how it worked
        when you set it up.
      </>
    ),
  },
  {
    level: 5,
    desc: (
      <>
        The CRM is genuinely the <b>single source of truth</b>. Integrations keep data
        consistent across your stack, and governance reviews happen on a schedule, data
        integrity measured, not assumed.
      </>
    ),
  },
];

export default function CrmArchitectureGovernanceBody() {
  return (
    <>
      <p>
        If you have ever said some version of &ldquo;CRM not working for my
        team,&rdquo; the CRM probably is not the problem. What is actually broken is one
        of two things: the data model does not match how your business actually sells,
        or nobody owns keeping it that way. Software does not fix either one. You can
        migrate from HubSpot to Salesforce and back again and still have the same mess,
        because the mess is not the tool. It is the architecture and the governance
        around it.
      </p>

      <h2 className={h2}>What &ldquo;not working&rdquo; actually means</h2>
      <p>
        Ask yourself: who is responsible for maintaining your CRM? If the honest answer
        is &ldquo;nobody, really,&rdquo; that is the tell. A CRM without an owner
        drifts. Fields get added ad hoc. Duplicate records pile up. Reps stop trusting
        the pipeline view, so they stop updating it, which makes it less trustworthy,
        which makes them trust it even less. That is not a training issue you fix with a
        Lunch and Learn. It is a governance gap.
      </p>
      <p>
        Here is a fast gut check: pull up ten random deals in your CRM right now. What
        percentage have complete, accurate data? What percentage have a real next step
        logged? Most founders&rsquo; honest answer is somewhere between &ldquo;not
        great&rdquo; and &ldquo;I would rather not look.&rdquo; Your reaction to
        actually looking usually tells you more than the number does.
      </p>
      <p>
        Increasingly, part of fixing this is not asking a person to try harder. It is
        putting an AI agent to work on the routine entry and cleanup a rep never gets
        around to, connected directly to the CRM under the same governance rules a
        person would follow. That does not remove the need for an owner. It gives the
        owner something to actually manage, instead of chasing reps for updates that
        never come.
      </p>

      <h2 className={h2}>Why this happens even in decent-sized companies</h2>
      <p>Two structural patterns cause it, and neither one is really about the software.</p>
      <p>
        The data model mismatch usually starts with the CRM&rsquo;s default pipeline
        stages, Lead, Qualified, Proposal, Closed, never getting redesigned around how
        the business actually sells, so the data structure stays generic while the sale
        itself is not (
        <a
          href="https://demandzen.com/mapping-b2b-sales-cycle-stages-crm-forecasting/"
          target="_blank"
          rel="noopener noreferrer"
        >
          source
        </a>
        ). It gets worse in B2B specifically, because a real purchase usually runs
        through several people, procurement, legal, compliance, finance, each with their
        own approval cycle, while most CRMs are still set up to track one or two
        contacts on a deal. And marketing and sales frequently work from different
        definitions inside the same system, what counts as a qualified lead, when a deal
        actually gets created, so the record itself encodes a disagreement between two
        teams rather than one shared model of the business.
      </p>
      <p>
        The ownership gap has a separate cause. Sales owns contact data. Marketing owns
        campaign data. Whoever runs revenue operations owns &ldquo;the system.&rdquo;
        Nobody owns the actual record or the definitions behind it, so accountability
        falls into the space between roles. The most common version of this mistake is
        treating CRM governance as a technical task and handing it to IT or to a single
        CRM administrator, when the real problem is organizational: getting sales,
        marketing, and service to agree on what a field means and enforce it the same
        way. And when governance does get built, it often lives in one person&rsquo;s
        head. The moment that person leaves, so does the standard, and the CRM starts
        drifting again.
      </p>
      <p>
        Reps notice long before leadership does. When the data cannot be trusted, reps
        stop trusting the pipeline view, stop updating it, and quietly move their real
        tracking into a personal spreadsheet, which makes the CRM even less trustworthy
        for the next person who looks at it. That loop is why &ldquo;just tell the team
        to use the CRM properly&rdquo; never works. The system was never designed to
        hold together on its own, and nobody was ever actually responsible for keeping
        it that way.
      </p>

      <h2 className={h2}>What good looks like, one step at a time</h2>

      <MaturityLadder
        label="The 1 to 5 scale"
        title="CRM architecture and governance, Level 1 to Level 5"
        rungs={RUNGS}
      />

      <p>
        Level 5 is also where the CRM stops being something only people maintain. As of
        April 2026,
        HubSpot&rsquo;s own MCP Server lets an AI tool like Claude connect directly to a
        company&rsquo;s HubSpot account and read or update records under the same
        permission scopes a person would have, so an AI agent can log a call, correct a
        stale field, or flag a deal missing its next step without a rep opening the CRM
        at all (
        <a href="https://developers.hubspot.com/mcp" target="_blank" rel="noopener noreferrer">
          source
        </a>
        ). Salesforce has built a comparable capability into Agentforce. The specific
        vendor is not the point. The point is that &ldquo;someone has to manually keep
        the CRM clean&rdquo; is no longer strictly true for teams that have set this up,
        and the businesses that have not are increasingly the ones falling further
        behind, not just staying flat.
      </p>
      <p>
        If your CRM does not have this kind of connection available yet, or your
        provider is not one of the big two, you do not need to buy a new tool to get
        most of the benefit yourself. Export your open pipeline and recent activity to a
        CSV, drop it into Claude, ChatGPT Enterprise, or Grok, and ask it to flag every
        record missing a required field or sitting untouched past your stage&rsquo;s
        normal duration. That is a rough, manual version of what the AI-connected CRM
        does automatically, and it costs you nothing beyond a tool you may already be
        paying for. The gap between doing that once a month yourself and having it run
        continuously in the background is close to the gap between Stage 1 and the top
        of the maturity curve. The same pattern holds whether your system of record is
        HubSpot, Salesforce, ConnectWise, Bullhorn, or ServiceTitan. The architecture
        problem, and the AI-acceleration opportunity sitting on top of it, look almost
        identical across all of them.
      </p>

      <h2 className={h2}>The fastest way to tell where you stand</h2>
      <p>Three questions, answered honestly, will place you:</p>
      <p>
        Who owns your CRM&rsquo;s data quality, by name? Not &ldquo;the team.&rdquo; A
        person.
      </p>
      <p>
        When did you last deliberately review your CRM&rsquo;s field structure and
        change something on purpose, versus just letting it accumulate?
      </p>
      <p>
        If someone asked you right now for your average deal size, how confident would
        you be in the number, and why?
      </p>
      <p>
        If those answers are shaky, you are not alone, and it is a fixable, specific
        problem. It starts with{" "}
        <Link href="/learn/ideal-customer-profile" className="text-navy underline">
          Ideal Customer Profile
        </Link>{" "}
        and{" "}
        <Link href="/learn/revenue-lifecycle-design" className="text-navy underline">
          Revenue Lifecycle Design
        </Link>
        , both of which this competency depends on. If your CRM does not reflect a clear
        picture of who you are selling to and what the actual journey looks like, no
        amount of field cleanup, AI-assisted or not, will hold.
      </p>
    </>
  );
}
