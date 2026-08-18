import Link from "next/link";
import CtaCallout from "@/components/learn/CtaCallout";
import PullQuote from "@/components/learn/PullQuote";
import StatCards from "@/components/learn/StatCards";
import MaturityStrip from "@/components/learn/MaturityStrip";
import ContrastTable from "@/components/learn/ContrastTable";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";
const link = "text-navy underline";

// Verbatim transcription of the approved 4.3 source copy. The only changes are
// JSX entity escaping (react/no-unescaped-entities), the internal/outbound links
// from the build spec, and the visual blocks interleaved at their source spots:
// the governing line as a pull-quote, the 45/24 stat pair, the fundamentals-first
// contrast, and the four-stage maturity strip. This is the root-level, off-nav
// BOFU page: the AI-accelerant framing of the /revenue-operations-consulting
// offer. It owns its own /book CTAs (hero, mid, and the page's closing card).
export default function AiConsultingBody() {
  return (
    <>
      <h2 className={h2}>What AI consulting for a small business actually is</h2>
      <p>Let us answer the question you came here with, plainly.</p>
      <p>
        AI consulting for a small business is a service that helps you decide where
        artificial intelligence belongs in your operation, then puts it there. Most
        providers run a readiness assessment, pick a few workflows, and deploy
        tools: a chatbot for intake, automation for lead follow-up, a forecasting
        model for inventory. Assessments run from about $2,500 to $10,000. Project
        builds run from roughly $10,000 to $50,000. Some sell a fractional AI
        officer on retainer.
      </p>
      <p>
        That is the standard version of the category, and for a specific kind of
        buyer it is the right one. If you already know exactly what you want built,
        and you only want the build, hire an implementation shop and move on. We
        will tell you when that is you.
      </p>
      <p>
        But if you run a B2B company, and you are
        asking who should own AI in your revenue operation, the standard version has
        a flaw worth understanding before you spend a dollar.
      </p>

      <h2 className={h2}>The flaw in &ldquo;just implement AI&rdquo;</h2>
      <p>Here is the governing idea behind everything we do:</p>
      <PullQuote>
        AI amplifies the operational state it is applied to. Automating a broken
        process just produces broken outcomes faster.
      </PullQuote>
      <p>
        Most AI consulting for small business skips past this. It sells you tools
        and implementation on top of what we call your RevOps debt: the accumulated
        mess in a revenue operation. Dirty CRM data, undefined pipeline stages, no
        written ICP, broken handoffs between sales and delivery. That debt is real,
        it compounds quietly, and most consultants never pay a cent of it down
        before they start bolting on automation. Then the automation scales the
        mess. Your bad lead routing now runs at machine speed. Your unclear handoff
        between sales and delivery now breaks in more places. You did not fix the
        problem. You funded it, and you scaled it.
      </p>
      <p>
        The numbers show how wide this gap already is. As of early 2026, 45% of B2B
        suppliers use AI in sales, but only 24% have deployed true agentic AI that
        actually runs work end to end (
        <a
          href="https://www.landbase.com/blog/agentic-ai-statistics"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          Deloitte, via Landbase
        </a>
        ). Most companies are in the 45% that bought something. Far fewer are in the
        24% that made it work. The difference is almost never the tool. It is
        whether the process underneath the tool was ready.
      </p>

      <StatCards
        label="The gap"
        title="Most companies bought AI. Far fewer made it work."
        stats={[
          {
            big: "45%",
            desc: "of B2B suppliers use AI in sales, as of early 2026.",
            source: "Deloitte, via Landbase",
          },
          {
            big: "24%",
            desc: "have deployed true agentic AI that actually runs work end to end. The difference is almost never the tool.",
            source: "Deloitte, via Landbase",
          },
        ]}
      />

      <h2 className={h2}>
        What we do instead: fix the fundamentals, then automate
      </h2>
      <p>
        We do build the system. What we do not do is walk out with the capability
        still on our laptops, which is the part that leaves you renting an
        understanding of your own revenue engine.
      </p>
      <p>
        We build one named system at a time, at a fixed price, and every build
        ships with a runbook and an internal owner we train to run it. The
        fundamentals come first: how leads get qualified, how deals move stage to
        stage, how sales hands off to delivery, how you forecast without guessing.
        Automate those while they are broken and you get faster mess. Your team
        keeps the system, and the person who owns it is on your payroll.
      </p>

      <ContrastTable
        leftTitle="Most AI consulting"
        rightTitle="How we work"
        rows={[
          {
            aspect: "The starting point",
            left: "Sells you tools and implementation on top of your RevOps debt, the accumulated mess in a revenue operation.",
            right:
              "Fixes the revenue fundamentals first, then applies AI only where it accelerates a competency you have made solid.",
          },
          {
            aspect: "Who owns it afterward",
            left: "The system sits on the consultant's laptop, and the capability leaves with them.",
            right:
              "It ships with a runbook and an internal owner we train, so the capability stays in-house, on your payroll.",
          },
          {
            aspect: "What AI ends up doing",
            left: "Automation scales the mess. You funded the problem and scaled it.",
            right: "AI pays the debt down fast, then scales a clean engine.",
          },
        ]}
      />

      <p>
        Here is the optimistic part worth saying plainly. Paying down RevOps debt
        used to be slow, manual work. It is not anymore. AI actually lets us pay
        that debt down faster than ever. An assistant hitting your CRM or email tool
        through an API can clean data in bulk. An AI tool handed your real data can
        draft your ICP or your stage definitions in minutes, ready for you to
        sharpen rather than write from scratch. So the offer is not only &ldquo;fix
        it first.&rdquo; It is &ldquo;we fix it fast, with AI, then AI scales the
        clean engine.&rdquo;
      </p>
      <p>
        That sequence matters. Once your lead qualification is clean, AI can score
        and route at scale. Once your handoff is defined, AI can draft the summary
        and update the record. The judgment about where AI belongs is the product
        here. The tools are just the last mile.
      </p>
      <p>
        This is the same model we detail on our{" "}
        <Link href="/revenue-operations-consulting" className={link}>
          revenue operations consulting
        </Link>{" "}
        page. This page is that offer framed for the buyer who arrived by searching
        for AI. The engine is identical: fundamentals first, then acceleration.
      </p>

      <CtaCallout
        eyebrow="See if it fits"
        heading="Not sure whether this is you?"
        body="Book a call and we will give you our honest read on whether fixing the fundamentals first is the right move for your business, including when the answer is an implementation shop and not us."
        buttonLabel="Book a call"
        href="/book"
        ctaLocation="ai_consulting_mid_page"
      />

      <h2 className={h2}>Where you actually are, measured</h2>
      <p>
        Before we talk about AI, we want to know how sound your revenue operation
        is today. Not by feel. By a score.
      </p>
      <p>
        We use the GTM Maturity Framework, a method we built for measuring
        the revenue competencies of a business across four stages: Reactive,
        Repeatable, Predictable, and Compounding. It tells you which competencies
        are solid enough to accelerate and which ones would just break faster under
        automation.
      </p>

      <MaturityStrip
        title="Which competencies are solid enough to accelerate"
        notes={[
          "Would break faster under automation.",
          "Getting solid. Accelerate with care.",
          "Solid enough for AI to accelerate.",
          "AI scales a clean engine here.",
        ]}
        highlightFrom={3}
        footnote="Foundations first. AI accelerates the stages that are already solid."
      />

      <p>
        You can get your free score in a few minutes with the{" "}
        <Link href="/scorecard" className={link}>
          AI Revenue Scan
        </Link>
        . Most founders are surprised by which parts of their operation are further
        along than they thought, and which parts are not ready for AI at all.
      </p>

      <h2 className={h2}>Do we run our own business this way</h2>
      <p>
        We hold ourselves to this. We run our own business on the same order we
        are describing to you. Before we let AI accelerate anything, the process
        underneath it is defined, and every AI output in our operation passes a
        human gate before it counts, whether that is a marketing post going out in
        our voice or a client deliverable our own audit software drafted from real
        data. That is not caution for its own sake. It is the whole point. AI
        amplifies the state it is applied to, so the state has to be right and the
        judgment has to stay human. We would not ask you to run your revenue engine
        on a principle we were not willing to run ours on.
      </p>

      <h2 className={h2}>When you should hire someone else instead</h2>
      <p>
        We would rather you find the right fit than hire us for the wrong reason.
      </p>
      <p>
        If you want a single, specific technical build, an AI phone system, a custom
        model, a one-off automation, and you do not want to change how your revenue
        operation runs, hire a pure AI-implementation shop. They are good at exactly
        that, and they are usually cheaper for a defined build.
      </p>
      <p>
        Come to us when the real question is not &ldquo;which tool&rdquo; but
        &ldquo;who owns revenue in my company, and how do we make it run without
        me.&rdquo; That is an operations problem. AI is one accelerant inside it,
        not the point of it.
      </p>
      <p>
        The teams that pulled ahead last year understood this. Sales teams using AI
        reported revenue growth at 83%, versus 66% of those that did not, a 17-point
        gap (
        <a
          href="https://www.landbase.com/blog/agentic-ai-statistics"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          via Landbase
        </a>
        ). The winners were not the ones who bought the most tools. They were the
        ones whose operation was ready to use them.
      </p>

      <h2 className={h2}>Where to go next</h2>
      <ul className="ml-5 list-disc space-y-2">
        <li>
          New to this and want the plain-English version first? Read{" "}
          <Link href="/learn/ai-for-small-business" className={link}>
            AI for small business
          </Link>
          .
        </li>
        <li>
          Trying to make sense of the tools before you commit? Read{" "}
          <Link href="/learn/ai-tools-for-small-business" className={link}>
            AI tools for small business
          </Link>
          .
        </li>
        <li>
          Want to see the destination the whole method builds toward? Read about the{" "}
          <Link href="/predictable-revenue-engine" className={link}>
            predictable revenue engine
          </Link>
          .
        </li>
      </ul>

      {/* Closing CTA, moved up into the body so it lands between the final text
          and the author byline (rendered by the page after this body) rather
          than after the FAQ. It replaces the "Ready to talk? Book a call" bullet
          that used to close the list. */}
      <CtaCallout
        eyebrow="Your next step"
        heading="Start with where your fundamentals actually stand"
        body="Book a call and we will start with an honest read on which parts of your revenue operation are ready for AI, and which are not yet."
        buttonLabel="Book a call"
        href="/book"
        ctaLocation="ai_consulting_foot"
      />
    </>
  );
}
