import Link from "next/link";
import PullQuote from "@/components/learn/PullQuote";
import StepFlow from "@/components/learn/StepFlow";
import MaturityStrip from "@/components/learn/MaturityStrip";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";
const link = "text-navy underline";

// Verbatim transcription of the approved 4.1 source copy. The only changes are
// JSX entity escaping (react/no-unescaped-entities), the internal/outbound links
// called for in the build spec, and three visual blocks interleaved at their
// source positions: the governing line lifted into a pull-quote, the "one move"
// steps, and the four-stage maturity strip. Not a word of the copy changes.
export default function AiForSmallBusinessBody() {
  return (
    <>
      <p>
        Most advice you will find on AI for small business is written for a
        business that does not exist yet. It assumes you are starting from zero,
        so it hands you a list of tools and tells you to pick one. That is fine if
        you have no customers. You are not that reader. You have real customers,
        real revenue, and a team that already runs on habits, whether those habits
        are written down or not.
      </p>
      <p>
        That changes the question completely. The question is not &ldquo;which AI
        tool should I buy.&rdquo; The question is &ldquo;where will AI actually
        help a business that is already working, and where will it quietly make
        things worse.&rdquo; Let me answer that honestly.
      </p>

      <h2 className={h2}>The one rule that decides whether AI helps you</h2>
      <p>Here is the sentence I want you to keep.</p>
      <PullQuote>
        AI amplifies the operational state it is applied to. Automating a broken
        process just produces broken outcomes faster.
      </PullQuote>
      <p>
        Read that again, because it is the whole thing. AI is a multiplier, not a
        fix. If your sales process is clean, AI makes it faster and more
        consistent. If your sales process is a mess of memory and gut feel, AI does
        not clean it up. It scales the mess. You get more of the wrong thing,
        sooner, with a confident tone.
      </p>
      <p>
        I see this constantly. A founder buys an AI tool to fix a problem that is
        not a tool problem. The lead follow-up is slow because nobody agreed on
        what a qualified lead is. The forecast is wrong because two people define a
        &ldquo;stage 3&rdquo; deal differently. AI cannot resolve a disagreement
        your team never had out loud. It will just automate both versions and hand
        you a cleaner-looking version of the same confusion.
      </p>
      <p>
        So the rule for a business with real customers is simple. Fundamentals
        first. AI second. AI can help you build or fix a fundamental faster than
        ever before, but it cannot create one you skipped. You still have to have
        the fundamental. AI just gets you there quicker.
      </p>

      <h2 className={h2}>RevOps debt, and the two jobs AI does about it</h2>
      <p>
        Every revenue operation carries what I call RevOps debt. It is the
        accumulated mess in how you sell: dirty CRM data, pipeline stages nobody
        defined the same way, no written ideal customer profile, handoffs that drop
        leads between marketing and sales. You did not plan it. It built up while
        you were busy closing business. But it is real, and it is the exact state
        AI amplifies.
      </p>
      <p>So AI plays two roles here, and you need to hold both at once.</p>
      <p>
        The first role is the good news. AI can help you pay down RevOps debt
        faster than anything you have ever had. Work that used to take weeks now
        takes a session. Connect an AI assistant to your CRM or email tool through
        an API or an MCP server, and it can clean and standardize thousands of
        records in bulk in a single sitting, deduping companies, fixing job titles,
        filling gaps. Hand an AI tool your own business data and it will draft your
        ideal customer profile, or clean definitions for every pipeline stage, in
        minutes instead of the quarter it would take a team to argue it out. That
        is a shovel. It is the fastest shovel for digging out of RevOps debt you
        will ever hold.
      </p>
      <p>
        The second role is the catch, and it is the same rule as before. Because AI
        amplifies the state it is applied to, you have to pay the debt down before
        you point AI at scaling a process. Clean the data first, then automate the
        outreach. Define the stages first, then let AI forecast against them. Point
        AI at scaling while the debt is still there and you do not dig out. You
        scale the mess, faster and more confidently than you ever could by hand.
      </p>
      <p>
        Hold both together and the message is simple. AI is the fastest shovel you
        have ever had for digging out of RevOps debt, and it is also the reason you
        cannot skip the digging.
      </p>

      <h2 className={h2}>What &ldquo;real customers&rdquo; actually changes</h2>
      <p>
        When you have paying customers, you already have something the startup
        reader does not: data about what works. Every closed deal, every churned
        account, every support ticket is a record of your real business. That is
        the raw material AI is genuinely good at reading.
      </p>
      <p>
        This is the difference between using AI as a toy and using it as an
        instrument. A toy generates a social post. An instrument reads your last
        two years of customers and tells you which ones you should have never sold
        to. One is content. The other is a decision.
      </p>
      <p>
        The generic advice you will find points you at the toy end: draft a
        caption, make a graphic, summarize a meeting. Useful, sure. But that is not
        where the money is for you. The money is in your own data, and almost
        nobody is telling you to start there.
      </p>

      <h2 className={h2}>One move you can run this week</h2>
      <p>
        Do not buy anything for this. Export your last 50 closed-won deals and your
        last 50 closed-lost deals from your CRM. A plain CSV is fine.
      </p>
      <p>
        Then open an AI assistant you very likely already have access to, such as
        Claude, ChatGPT Enterprise, or Grok. Paste the data in and ask one
        question: what do the winners have in common that the losers do not?
        Company size, industry, lead source, how fast they replied, who the first
        contact was, how many people were involved. Let it find the pattern.
      </p>

      <StepFlow
        label="One move, this week"
        title="Turn your own closed deals into a first-draft ICP"
        steps={[
          {
            title: "Export",
            desc: "Pull your last 50 closed-won and 50 closed-lost deals from your CRM. A plain CSV is fine.",
          },
          {
            title: "Ask",
            desc: "Paste it into an AI assistant you already have and ask what the winners share that the losers do not.",
          },
          {
            title: "Read the pattern",
            desc: "In about ten minutes you have a rough draft of your ideal customer profile, from your own history.",
          },
        ]}
      />

      <p>
        You will get a rough draft of your ideal customer profile from your own
        history in about ten minutes. It will not be perfect. It does not need to
        be. It needs to be honest, and your own closed deals are the most honest
        data you own. If you want to turn that rough draft into something your team
        actually sells against, that is the{" "}
        <Link href="/learn/ideal-customer-profile" className={link}>
          ideal customer profile
        </Link>{" "}
        work, and it is a fundamental worth doing properly.
      </p>
      <p>
        Notice what happened there. You did not automate a broken process. You used
        AI to pay down a piece of RevOps debt, a missing written ideal customer
        profile, in ten minutes instead of a quarter. That is the pattern. Every
        good use of AI in your business looks like that.
      </p>

      <h2 className={h2}>Free AI tools for business, honestly</h2>
      <p>
        People search for free AI tools for small business hoping for a magic list.
        Here is the honest version.
      </p>
      <p>
        The most capable free or already-paid tool you have is a general AI
        assistant. If your team is on Google Workspace, Microsoft 365, a paid
        ChatGPT plan, or a Claude plan, you are already paying for a serious AI
        assistant right now. Before you buy anything new, go find out what you
        already pay for. Most founders are sitting on capability they never turned
        on.
      </p>
      <p>
        For the named, category-specific tools, the honest guidance is the same
        every time. Do not start by buying. HubSpot shipped an AI assistant and
        outcome-based pricing this spring, where its Breeze Customer Agent bills
        roughly fifty cents per resolved conversation instead of a flat seat fee.
        Enrichment tools like Clay repriced this year so the data costs a lot less
        than it used to. Those are real and they can be worth it. But you only know
        if they are worth it once you have run the fundamental by hand first and
        hit the ceiling of doing it manually. The tool is for scaling a thing that
        already works, not for discovering whether it works.
      </p>
      <p>
        So the free move and the paid move are the same move in the right order.
        Run it by hand with an assistant you already have. Prove the process. Then,
        and only then, pay to scale it.
      </p>

      <h2 className={h2}>The urgency is real, but it is not the tool</h2>
      <p>
        I do not like fake urgency, so here is the real version, with numbers.
      </p>
      <p>
        McKinsey estimates that effective, scaled AI deployment can lift
        productivity by 3 to 5 percent a year and growth by 10 percent or more.
        Gartner projects that up to 90 percent of B2B buying could involve AI agents
        by 2028. Those are big numbers, and they are pointed at the near future, not
        some distant one. Your buyers are already changing how they buy. You can
        read the underlying{" "}
        <a
          href="https://www.landbase.com/blog/agentic-ai-statistics"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          adoption research from Landbase
        </a>{" "}
        if you want the full set.
      </p>
      <p>
        Here is the honest part most people leave out. The number does not tell you
        to go buy software. It tells you that the advantage goes to teams that built
        AI into how the work actually runs, every week, without heroics. Dabbling
        with AI on the side changes nothing. Operationalizing it, on top of
        fundamentals that are already in order, is what pulls a business ahead.
      </p>
      <p>
        The real gap for you is not &ldquo;I do not have the tools.&rdquo; It is the
        gap between &ldquo;I could technically do this myself&rdquo; and &ldquo;I
        will actually do it, correctly, every month, with a system my team runs
        without me.&rdquo; Everyone can run the closed-won export once. Almost
        nobody turns it into a monthly habit that survives a busy quarter, which is
        how RevOps debt creeps back in even after you have paid it down. That gap is
        the whole game, and no subscription closes it for you.
      </p>

      <h2 className={h2}>What &ldquo;good AI&rdquo; actually looks like at your stage</h2>
      <p>
        I think about revenue operations in four stages, using the Revenue
        Operations Maturity Model, a method I built for measuring the revenue
        competencies of a business across four stages: Reactive, Repeatable,
        Predictable, and Compounding.
      </p>
      <p>
        AI does not move you between stages. It behaves according to the stage you
        are already at. At the Reactive stage, where the process lives in
        people&rsquo;s heads, pointing AI at it just produces confident-sounding
        chaos. At the Repeatable and Predictable stages, where the process is
        defined and the data is clean, AI becomes genuinely powerful, because now
        there is a real process to amplify. Advanced AI is not a bolt-on you add
        early. It is what high maturity looks like in practice.
      </p>

      <MaturityStrip
        title="Where AI helps, by the stage you are already at"
        notes={[
          "Process lives in people's heads. Point AI at it and you get confident-sounding chaos.",
          "The process is defined. AI starts to genuinely help.",
          "Clean data, clear stages. AI becomes genuinely powerful.",
          "Advanced AI is not a bolt-on. It is what high maturity looks like in practice.",
        ]}
        highlightFrom={2}
        footnote="AI does not move you between stages. It behaves according to the stage you are already at."
      />

      <p>
        I run my own marketing this way, and it is the clearest proof I can give
        you. The engine is built on AI, but on top of a defined process, not
        instead of one. AI drafts posts and articles in my voice, but only against
        keyword and demand data I validated first, so the machine is aimed at
        something real. One recorded conversation gets clipped by AI into a week of
        short-form video for YouTube and LinkedIn, so a single input becomes a week
        of output. Every piece ships with a tracking tag, and I measure which
        formats and topics actually earn attention and calls, at a fixed cadence so
        the numbers stay honest. Then those results condition the next round:
        create, publish, measure, learn, adjust, and do it again a little sharper. I
        approve everything that goes out in my voice, because the judgment is mine
        and the AI is the accelerant. The page you are reading now was built the
        same way.
      </p>
      <p>
        If you want to know which stage you are actually at, that is exactly what
        the{" "}
        <Link href="/scorecard" className={link}>
          Revenue Maturity Score
        </Link>{" "}
        measures. It scores your revenue operations against the model above, for
        free, in a few minutes, and it tells you where AI will help you and where it
        would just scale a problem.
      </p>

      <h2 className={h2}>Where to go from here</h2>
      <p>
        If you want the actual stack, meaning the specific tools by function and how
        to choose them without overbuying, read{" "}
        <Link href="/learn/ai-tools-for-small-business" className={link}>
          AI tools for small business
        </Link>
        . If you have decided you want a person to help you build this into your
        team instead of doing it alone, that is{" "}
        <Link href="/ai-consulting-for-small-business" className={link}>
          AI consulting for small business
        </Link>
        . And if you want to see how these fundamentals connect into one system
        that produces revenue you can forecast, start with the{" "}
        <Link href="/predictable-revenue-engine" className={link}>
          predictable revenue engine
        </Link>
        .
      </p>
      <p>
        But the first step is honest and free. Find out what stage you are at, so
        you know whether AI is your next move or a distraction from the fundamental
        you skipped.
      </p>
    </>
  );
}
