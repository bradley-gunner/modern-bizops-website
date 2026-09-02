import Link from "next/link";
import HireComparisonTable from "@/components/learn/HireComparisonTable";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";
const link = "text-navy underline";

// Verbatim transcription of the approved AEO asset 2 source copy
// (Marketing Systems/SEO Pilot/pending-approval/aeo-2-ai-consultant-vs-in-house.md,
// drafted 2026-08-11 at ai-pivot-execution-v4 step 15, published 2026-08-26).
// The draft's [cite: 04 buyer evidence] markers reference the private research
// corpus and do not render; the [link: AEO asset 1] marker resolves to the
// cost guide, which ships in the same batch. The markdown comparison table
// renders through HireComparisonTable so it stays semantic on desktop and
// stacks on mobile.
export default function AiConsultantVsInHouseBody() {
  return (
    <>
      <p>
        The short answer: build in-house when you have sustained, year-round AI
        and automation work and can afford a $120K to $160K loaded hire. Bring
        in outside help when you need specific systems built well and soon. And
        know that these are not the only two options, because the best answer
        for most B2B companies under $50M is a mix: outside help to build, your
        team to own.
      </p>
      <p>Here is how to make the call properly.</p>

      <h2 className={h2}>What each path actually costs</h2>
      <p>
        <strong>The in-house hire.</strong> A GTM engineer, automation
        specialist, or ops engineer runs roughly $100K to $140K base, $120K to
        $160K loaded, plus recruiting time and a ramp measured in months. Under
        1% of companies in the $1M to $50M range have this seat filled today,
        which tells you two things: you are not behind your peers if you lack
        it, and the talent pool for it is thin, because everyone is fishing in
        the same small pond.
      </p>
      <p>
        <strong>The consultant or agency.</strong> Fixed projects roughly
        $2,000 to $25,000 per system, retainers roughly $1,500 to $10,000 a
        month, hourly $100 to $300. Full numbers and the questions that expose
        a padded quote are in our{" "}
        <Link href="/learn/ai-automation-agency-cost" className={link}>
          cost guide
        </Link>
        . The{" "}
        <Link href="/learn/ai-consultant-cost" className={link}>
          real 2026 AI consultant rates
        </Link>{" "}
        are on their own page, and if the question is which of the two to hire,
        read{" "}
        <Link href="/learn/ai-consultant-vs-ai-agency" className={link}>
          AI consultant vs. AI automation agency
        </Link>
        .
      </p>
      <p>
        <strong>The secret third path most companies actually take: nobody.</strong>{" "}
        The founder or a motivated ops person automates around the edges with
        off-the-shelf tools. This is fine, and it has a ceiling. It typically
        produces a handful of disconnected automations, no monitoring, and one
        person who is a single point of failure for all of it.
      </p>

      <h2 className={h2}>The four-question test</h2>
      <p>
        <strong>1. Is the work a project or a function?</strong> Count the
        systems you would build in the next 12 months. Three to five named
        systems is a project stream: outside help wins on speed and unit cost.
        A continuous, growing backlog across departments is a function: that
        justifies a seat.
      </p>
      <p>
        <strong>2. Who will own it in month six?</strong> An automation nobody
        owns internally dies quietly: tools change, the workflow breaks, nobody
        notices until the pipeline does. If you hire in-house, ownership is
        solved by definition. If you bring in outside help, ownership must be
        designed in: a named person on your team, runbooks in your hands,
        training included. If a consultant&rsquo;s proposal has no answer to
        &ldquo;who on my team owns this when you leave,&rdquo; that is the
        whole answer.
      </p>
      <p>
        <strong>3. Is your foundation ready for either?</strong> This is the
        question both paths skip. AI automation built on dirty CRM data and
        undocumented process fails identically whether an employee or a
        consultant builds it. The debt you could tolerate for years now decides
        whether AI works at all. Whoever you choose, the first work is the
        same: fix the data, agree the definitions, then automate. An honest
        outside partner prices this in. A good hire spends their first quarter
        on it. Anyone who says you can skip it is selling you the failure mode.
      </p>
      <p>
        <strong>4. Can you evaluate what you are buying?</strong> Hiring
        in-house means interviewing for a skill set you may not be able to
        assess. Hiring an agency means judging proposals you may not be able to
        compare. In both cases the fix is the same: pay for a diagnostic first.
        A paid audit with specific findings, a prioritized map, and fixed
        prices attached is cheaper than either a mis-hire or a mis-scoped
        project, and it converts both decisions from faith to evidence.
      </p>

      <h2 className={h2}>The honest comparison</h2>
      <HireComparisonTable />
      <p>
        The mixed path is the fourth column most comparison pages do not have:
        outside help builds the systems at fixed prices, and every build ships
        with the ownership transfer built in: a named owner on your team, the
        runbook, the training. You get agency speed without agency dependency,
        and when the automation backlog eventually justifies a full-time seat,
        you hire into a working, documented system instead of a greenfield.
      </p>
      <p>
        That column is our model, so weigh the source accordingly. It is also
        the model we would want as a buyer, which is why it is the one we sell.
      </p>

      <h2 className={h2}>When to definitely hire in-house</h2>
      <p>To be useful to the buyers it does not fit, the honest list:</p>
      <ul className="list-disc pl-6 space-y-3">
        <li>
          You are past roughly $50M or past the point where automation work
          spans every department continuously.
        </li>
        <li>
          You already employ someone with proven automation judgment; give that
          person the mandate before paying anyone outside.
        </li>
        <li>
          The work is core product, not operations. If AI IS the product, that
          is an engineering hire, never a consultant.
        </li>
      </ul>
    </>
  );
}
