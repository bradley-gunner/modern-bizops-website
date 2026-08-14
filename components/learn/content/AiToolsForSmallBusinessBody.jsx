import Link from "next/link";
import CtaCallout from "@/components/learn/CtaCallout";
import PullQuote from "@/components/learn/PullQuote";
import MaturityStrip from "@/components/learn/MaturityStrip";
import FiveJobsTable from "@/components/learn/FiveJobsTable";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";
const link = "text-navy underline";

// Verbatim transcription of the approved 4.2 source copy. The only changes are
// JSX entity escaping (react/no-unescaped-entities), the internal/outbound links
// from the build spec, and the visual blocks interleaved at their source spots:
// the governing line lifted into a pull-quote, the maturity strip under the model
// intro, and the five-job table as the page's skimmable spine. This page owns two
// CTAs (scorecard mid-page, playbook at the foot), so the registry sets inlineCtas
// and the shell skips its default card.
export default function AiToolsForSmallBusinessBody() {
  return (
    <>
      <p>
        Most advice you will find on this topic is a ranked list. Twenty tools,
        sorted by department, each with a price and a star rating. I am not going to
        give you that, because the list is the wrong question. The tools on those
        lists are mostly fine. The reason they do not stick is that they get pointed
        at an operation that is not ready for them.
      </p>
      <p>
        Here is the line I want you to keep in your head the whole way down this
        page.
      </p>
      <PullQuote>
        AI amplifies the operational state it is applied to. Automating a broken
        process just produces broken outcomes faster.
      </PullQuote>
      <p>
        If your pipeline stages mean different things to different reps, an AI that
        reads your pipeline will report confident nonsense. If your CRM is
        half-empty, an enrichment agent will fill it with plausible garbage at
        scale. The tool is not the problem. The fundamental underneath it is.
      </p>
      <p>
        So I have organized this by the job your revenue engine needs done, not by
        the vendor. For each job you get three things: the fundamental that has to
        exist first, the move you can make today with an AI assistant you almost
        certainly already pay for, and the named tool that automates the job at
        Level 4-5 maturity, with an honest note on cost and on what it does not do.
      </p>
      <p>
        There is a name for the mess these jobs clean up. I call it RevOps debt: the
        accumulated cost of a revenue operation run without fundamentals. Dirty
        data, pipeline stages nobody defined, an ICP that was never written down,
        handoffs that drop leads between teams. It compounds quietly, the way
        financial debt does, until it is the reason your forecast is wrong. Here is
        the good news and the catch in one breath. AI can help you pay down RevOps
        debt faster than ever, and because AI amplifies the state it is applied to,
        you either pay it down before you point AI at scaling, or you scale the
        mess. Each of the five jobs below is a specific debt to retire. Every DIY
        move is a way to pay one down fast with an assistant you already have, and
        the named tool is what keeps it paid.
      </p>
      <p>
        I score this order of operations with the GTM Maturity Framework,
        a method I built for measuring the revenue competencies of a business across
        four stages: Reactive, Repeatable, Predictable, and Compounding. The tools
        below live at Predictable and Compounding. You cannot skip to them. If you
        want to see which stage each of your competencies is actually at before you
        spend a dollar, the{" "}
        <Link href="/scorecard" className={link}>
          AI Revenue Scan
        </Link>{" "}
        is free.
      </p>

      <MaturityStrip
        title="The tools live at the top two stages. You cannot skip to them."
        notes={[
          "Undefined process. Point a tool at it and it scales the mess.",
          "Fundamentals written down. The groundwork for automation.",
          "The named tools in this guide live here.",
          "And here. This is where automation compounds.",
        ]}
        highlightFrom={3}
        footnote="You cannot skip to them."
      />

      <p>
        Before you buy anything on this page, do one thing. Check what you already
        pay for. HubSpot, Salesforce, your PSA, your assistant subscription: most of
        them shipped AI in the last year and you are already funding it. New line
        items should be the last resort, not the first.
      </p>

      <FiveJobsTable />

      <h2 className={h2}>Job one: know your best-fit customer</h2>
      <p>
        <strong>The fundamental first.</strong> You cannot automate targeting you
        have not defined. If your ideal customer profile lives in your head and
        three reps would each describe it differently, no tool fixes that. It just
        scales the disagreement. Get the definition written down first. My{" "}
        <Link href="/learn/ideal-customer-profile" className={link}>
          ideal customer profile
        </Link>{" "}
        competency page walks the whole thing.
      </p>
      <p>
        <strong>The DIY move, with an assistant you already have.</strong> This one
        is genuinely free and it is the highest-leverage hour you will spend. Export
        your closed-won deals from the last two years, and your closed-lost, as two
        CSVs. Hand both to Claude, ChatGPT Enterprise, or Grok and ask it to find
        what your best customers had in common that your lost deals did not: size,
        industry, the trigger that made them buy, who signed. You are not asking the
        assistant to invent an ICP. You are asking it to read your own history back
        to you, which it is very good at. What comes out is a first draft of a
        firmographic profile you can test.
      </p>
      <p>
        <strong>The tool that automates it at Level 4-5.</strong> Sybill runs
        conversation intelligence across your calls and surfaces the patterns in how
        your best-fit buyers actually talk, which is signal your CRM never captures.
        This matters more than it sounds. Gartner found in 2026 that AI-driven ICP
        work correlates with 34% higher win rates. Not because the AI is magic, but
        because a sharp, evidence-based profile stops you wasting cycles on deals
        that were never going to close. The fundamental is the written profile.
        Sybill keeps it honest against what buyers say on the phone.
      </p>

      <h2 className={h2}>Job two: keep the CRM clean</h2>
      <p>
        <strong>The fundamental first.</strong> A clean CRM is not a tooling
        problem, it is a governance problem. If nobody owns what a field means or
        when a stage advances, the data rots no matter what software sits on top.
        Decide the rules first. My{" "}
        <Link href="/learn/crm-architecture-and-governance" className={link}>
          CRM architecture and governance
        </Link>{" "}
        page is the spec for that.
      </p>
      <p>
        <strong>The DIY move, with an assistant you already have.</strong> Export
        your contacts or deals to a spreadsheet. Ask your assistant to flag
        duplicates, standardize inconsistent fields (every variant of{" "}
        &ldquo;N/A,&rdquo; &ldquo;n/a,&rdquo; and blank in one column), and list
        records missing
        anything required. Fix them, then re-import. It is unglamorous and it works.
        Do it once a quarter and your data quality problem stays small. My{" "}
        <Link href="/learn/data-quality-management" className={link}>
          data quality management
        </Link>{" "}
        page has the checklist.
      </p>
      <p>
        Then go one step further than export and re-import. Look for an MCP server or
        an API for your CRM that your AI assistant of choice can connect to, and
        point the assistant at it directly. Instead of shuffling CSVs, the assistant
        makes the mass changes inside the system in a single working session:
        merging duplicates, standardizing fields, filling the gaps. That pays down
        data debt fast using an assistant you likely already pay for, without buying
        a new tool. HubSpot&rsquo;s MCP server, below, is the concrete example, but
        the general move is the same on any platform: find the MCP server or the API
        and point your assistant at it.
      </p>
      <p>
        One more move belongs here, because it retires a different debt. Anytime you
        need to create a fundamental definition you never wrote down, your ICP, your
        pipeline-stage definitions, your qualification criteria, hand an AI tool like
        Claude or ChatGPT real data about your existing business and ask it to
        recommend a first draft of those definitions in minutes. That is the fastest
        way to pay down &ldquo;we never wrote it down&rdquo; debt. You still own the
        judgment, but you start from a draft instead of a blank page.
      </p>
      <p>
        <strong>
          The tool that automates it, and this is where &ldquo;ai agent for small
          business&rdquo; gets real.
        </strong>{" "}
        HubSpot shipped its MCP server to general availability on April 13, 2026
        (OAuth 2.1 with PKCE, at{" "}
        <a
          href="https://developers.hubspot.com/ai-tools/mcp"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          mcp.hubspot.com
        </a>
        ). In plain terms: a rep can move a deal to the next stage or update a field
        by typing a sentence, and the agent reads and writes the CRM directly. That
        is an actual agent doing actual CRM work, not a chatbot. But notice the trap.
        If your stages are not clearly defined, an agent that updates stages by
        sentence just moves deals into stages that mean nothing, faster. The MCP
        server is only as good as the{" "}
        <Link href="/learn/pipeline-stage-design" className={link}>
          pipeline stage design
        </Link>{" "}
        underneath it. Build the definitions, then hand them to the agent.
      </p>
      <p>
        Whatever platform you run, HubSpot, Salesforce, or your industry&rsquo;s
        PSA, check whether it already ships a native AI layer or an API you can point
        an assistant at before you buy anything new.
      </p>

      <h2 className={h2}>Job three: enrich and de-dupe every new record</h2>
      <p>
        <strong>The fundamental first.</strong> Enrichment multiplies whatever it
        touches. Point it at a clean, well-defined record and you get a richer clean
        record. Point it at a mess and you get an enriched mess. The de-dupe and
        field rules from job two have to come first. This is the sharpest example of
        the governing line on the whole page.
      </p>
      <p>
        <strong>The DIY move, with an assistant you already have.</strong> For a
        small list, you do not need an enrichment platform. Paste a batch of company
        names into your assistant and ask it to pull public firmographics, flag
        likely duplicates, and match them to your ICP tiers. It is manual and it caps
        out around a few hundred records, but for a lean pipeline it is free and it
        is enough.
      </p>
      <p>
        <strong>
          The tool that automates it as real &ldquo;ai automation for small
          business.&rdquo;
        </strong>{" "}
        This is where automation earns its name: enrichment and cleanup that fires on
        every new record, without a human touching it.{" "}
        <a
          href="https://www.clay.com/blog/crm-data-enrichment"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          Clay
        </a>{" "}
        overhauled its pricing on March 11, 2026. Launch is $185 per month for
        15,000 actions; Growth is $495 per month for 40,000 actions and is the
        cheapest tier with native CRM integration, which is the one that matters if
        you want this running automatically against HubSpot or Salesforce. Underlying
        data costs came down 50 to 90%, and the Claygent research agent is now
        included on paid plans. If you are already in HubSpot, check Breeze
        Intelligence first (the former Clearbit, now 400M-plus contacts and 50M-plus
        companies): you may already be paying for enrichment you are not using. Check
        before you buy Clay on top of it.
      </p>

      <h2 className={h2}>
        Job four: qualify leads without a human in the loop for the first pass
      </h2>
      <p>
        <strong>The fundamental first.</strong> An AI qualifies against your
        criteria. If your criteria are vague, it qualifies vaguely and hands your
        reps confident junk. Write the qualification framework before you automate
        it. My{" "}
        <Link href="/learn/lead-qualification-framework" className={link}>
          lead qualification framework
        </Link>{" "}
        page is the definition step.
      </p>
      <p>
        <strong>The DIY move, with an assistant you already have.</strong> Give your
        assistant your qualification rules and a batch of raw inbound leads, and have
        it score and rank them, with a one-line reason each. You read the reasons for
        a week. When the reasons stop surprising you, your rules are tight enough to
        automate. That week of reading is the cheapest quality check you will ever
        run.
      </p>
      <p>
        <strong>The tools that automate it, agents included.</strong> Good AI lead
        scoring lifts qualification accuracy from roughly 60% to somewhere in the 75
        to 90% range,{" "}
        <a
          href="https://houseofmartech.com/blog/lead-qualification-framework-for-2026-combining-behavioral-signals-firmographics-and-ai-scoring"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          per House of Martech&rsquo;s 2026 framework
        </a>
        . On the inbound side, AI qualifying agents now respond within seconds of a
        form fill: 11x runs an agent called Julian, Artisan runs one called Aaron.
        Speed like that is a real edge, but only if what the agent qualifies against
        is correct. Point a seconds-fast agent at a broken definition and it
        disqualifies your best lead before a human ever sees it. Fundamental first,
        every time.
      </p>

      <h2 className={h2}>Job five: read pipeline health honestly</h2>
      <p>
        <strong>The fundamental first.</strong> Forecasting AI reads your pipeline
        stages and your exit criteria. If a deal can sit in &ldquo;negotiation&rdquo;
        for four months with no rule that says what &ldquo;negotiation&rdquo;
        requires, the AI inherits that fiction and forecasts on it. Stage discipline
        is the prerequisite. This ties straight into your{" "}
        <Link href="/predictable-revenue-engine" className={link}>
          predictable revenue engine
        </Link>
        : the forecast is only as trustworthy as the stages feeding it.
      </p>
      <p>
        <strong>The DIY move, with an assistant you already have.</strong> Export
        your open pipeline. Ask your assistant to flag deals with no activity in 30
        days, deals sitting in one stage longer than your average, and deals missing
        a close date or next step. That is a manual deal-health review, and it will
        surface the stuck deals your gut already suspected but your CRM never
        flagged.
      </p>
      <p>
        <strong>The tools that automate it.</strong> Gong shipped &ldquo;Mission Big
        Dipper&rdquo; on June 24, 2026 (agentic execution with governance and
        human-in-the-loop built in). Clari and Salesloft shipped a live signal layer
        on July 14, 2026 that triggers next-best-action and updates the forecast as
        things move. Here is the detail I want you to notice. Both vendors put
        governance in the headline. The market learned the same lesson the hard way:
        AI turned loose on undefined exit criteria just executes on nonsense faster.
        When the tools that sell pipeline AI are the ones now leading with
        governance, that is the whole thesis of this page, confirmed by the people
        with the most to gain from pretending otherwise.
      </p>

      <CtaCallout
        eyebrow="Before you buy a tool"
        heading="Which of your competencies are actually ready?"
        body="Every job above rests on a competency in the GTM Maturity Framework. The free AI Revenue Scan measures where each of yours stands today, so you know which fundamentals are solid enough for a tool to accelerate and which would just scale the mess. A few minutes, sixteen questions."
        buttonLabel="Get the Free Scan"
        href="/scorecard"
        ctaLocation="learn_ai_tools_scorecard"
      />

      <h2 className={h2}>
        The honest part: where the tools stop and the coaching starts
      </h2>
      <p>
        Read back over the five jobs. Every DIY move above is real. You could do all
        of it yourself with an assistant you already pay for. So let me be straight
        about what I actually sell, because it is not the tools.
      </p>
      <p>
        The gap is not &ldquo;can I technically do this.&rdquo; You can. The gap is
        between &ldquo;I could do this myself&rdquo; and &ldquo;I actually will,
        correctly, every month, with a system my team runs without me when I am not
        looking.&rdquo; That gap is where deals leak and where good intentions die.
        Closing it is the job.
      </p>
      <p>
        Here is a bonus move that closes part of that gap yourself. When you find a
        cleanup or a review you repeat, package it as a reusable skill or a saved
        prompt, then schedule it as a recurring task for your AI assistant. A
        one-time cleanup becomes an accountable monthly habit that runs whether or
        not you remember to run it. That does not close the whole gap, the judgment
        and the accountability are still yours, but it turns &ldquo;I could do this
        once&rdquo; into &ldquo;this happens every month&rdquo; for the mechanical
        parts.
      </p>
      <p>
        Most consultants close it by building the system for you and leaving. Then
        the capability leaves with them, and you are renting understanding of your
        own revenue engine. I work differently. I coach one of your own employees to
        build these systems inside your business, so the capability stays in-house
        after I am gone. You end up with a person on your payroll who owns it, not a
        dependency on me.
      </p>
      <p>
        I did not just decide AI belongs on top of clean fundamentals. I built a tool
        around it. My audit engine is software I had built that connects to a
        business&rsquo;s real systems through their APIs, pulls the actual data
        instead of asking anyone to fill out a survey, and uses AI to score where the
        revenue operation truly stands against the maturity framework. It drafts the
        findings. I review and approve every one before it reaches a client, because
        AI reading real data is powerful and AI left unchecked is a liability. That
        is the same order I am teaching you here: connect to the real data, let AI do
        the heavy reading, keep a human on the judgment. The tool only works because
        the method underneath it was defined first.
      </p>
      <p>
        If you are earlier in the journey and still deciding where AI fits at all,
        start with{" "}
        <Link href="/learn/ai-for-small-business" className={link}>
          AI for small business
        </Link>
        , which covers the strategy before the stack. If you already know you want a
        hand building this and want to talk about the coaching model directly,{" "}
        <Link href="/ai-consulting-for-small-business" className={link}>
          AI consulting for small business
        </Link>{" "}
        is the page for that.
      </p>
      <p>
        The{" "}
        <Link href="/playbook" className={link}>
          Revenue Growth Playbook
        </Link>{" "}
        lays out the whole sequence: which fundamental to fix first, and which tool
        to point at it once it holds. Start there, and build in the order that
        actually compounds.
      </p>

      <CtaCallout
        eyebrow="Your next step"
        heading="Build the stack in the order that compounds"
        body="A free, stage-by-stage guide that sequences the work, so every tool you add lands on a fundamental strong enough to hold it."
        buttonLabel="Get the Revenue Growth Playbook"
        href="/playbook"
        ctaLocation="learn_ai_tools_closing"
      />
    </>
  );
}
