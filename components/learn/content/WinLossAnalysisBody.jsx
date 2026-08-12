import Link from "next/link";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";

export default function WinLossAnalysisBody() {
  return (
    <>
      <p>
        Win/loss analysis is the practice of systematically finding out why your deals
        were actually won or lost, from the buyers themselves, and using the pattern to
        change how you qualify, position, and sell. The key word is actually. Most
        companies believe they already know why they lose, because the CRM has a
        closed-lost field and the reps fill it in. That belief is the most expensive
        assumption in your sales process.
      </p>
      <p>
        Ask your CRM why you lose and it will tell you price. Ask the buyers and they
        tell a different story. Clozd, a win-loss research firm, compared the CRM data
        from 1,000 closed-lost deals against what those same buyers said in interviews:
        the rep&rsquo;s recorded reason matched the buyer&rsquo;s account only 15% of the
        time, and the competitor tagged in the CRM was wrong in roughly seven out of ten
        deals (
        <a
          href="https://www.clozd.com/blog/5-lies-your-crm-is-telling-you-about-your-buyers"
          target="_blank"
          rel="noopener noreferrer"
        >
          Clozd, first-party research
        </a>
        ). The bias is structural, not a character flaw. &ldquo;Price&rdquo; and
        &ldquo;missing feature&rdquo; are the reasons outside the rep&rsquo;s control, and
        &ldquo;we just did not have budget&rdquo; is the polite lie buyers tell to end
        the conversation gently. Your dropdown field is a collection of face-saving
        exits, and every strategy decision built on it inherits the fiction.
      </p>

      <h2 className={h2}>The founder-sized version</h2>
      <p>
        Almost everything written about win/loss analysis assumes a product-marketing
        team, a research budget, and a neutral third-party interviewer. Useful at
        enterprise scale, and completely unnecessary at yours. At your size,
        founder-led, you have an advantage the enterprise version is designed to
        simulate: you can personally call the buyer. The founder-sized program is four
        moves.
      </p>
      <p>
        <strong>Code every closed deal with a real taxonomy.</strong> Replace the
        dropdown of outcomes with reasons. &ldquo;Lost to competitor&rdquo; is an
        outcome; &ldquo;lost because they needed on-site support we do not offer&rdquo; is
        a reason. Clozd&rsquo;s same research found 44% of recorded closed-lost reasons
        were outcomes, not reasons, which is why the data resists action. Keep the
        taxonomy short, under ten codes, and make the field required with a sentence of
        context.
      </p>
      <p>
        <strong>Interview a slice of buyers each quarter, wins included.</strong> Five
        lost deals and five won deals a quarter is enough to see patterns at founder-led
        deal volume. The wins matter as much as the losses: most companies obsess over
        why they lose and never learn why they win, which means they cannot deliberately
        repeat it. Have someone other than the deal&rsquo;s salesperson make the call
        where possible, since buyers soften the truth for the person they rejected. Five
        questions carry the whole interview: What alternatives did you seriously consider?
        What almost stopped you from choosing the way you did? Where in our process did
        you lose or gain confidence? What did the winning option have that the others did
        not? If you were advising us, what would we change first?
      </p>
      <p>
        <strong>Look for the pattern quarterly, not the anecdote.</strong> One
        buyer&rsquo;s complaint is a data point; the same theme in four interviews is a
        finding. Cut the results by deal size, segment, and competitor. The question that
        matters at the end of the review: what specifically changes because of this? A
        win/loss program, formal or not, earns its existence the first time it rewrites a
        qualification criterion or kills a discount you did not need to give.
      </p>
      <p>
        <strong>Feed the findings back into the system.</strong> Losses concentrated in
        one segment tighten the{" "}
        <Link href="/learn/ideal-customer-profile" className="text-navy underline">
          ideal customer profile
        </Link>
        . Buyers stalling at the same stage rewrite that stage&rsquo;s exit criteria in
        the{" "}
        <Link href="/learn/pipeline-stage-design" className="text-navy underline">
          pipeline design
        </Link>
        . Recurring confidence gaps become sales process fixes per the{" "}
        <Link
          href="/learn/lead-qualification-framework"
          className="text-navy underline"
        >
          lead qualification framework
        </Link>
        . This closed loop is the whole point, and it is why the GTM Maturity
        Framework, a method we built for measuring the go-to-market competencies of a
        business, treats win/loss analysis as a Stage 3 competency: at the bottom of the rubric,
        win/loss data is an inconsistent CRM dropdown nobody analyzes, and at the top,
        findings update qualification criteria within 30 days and competitive win rates
        are tracked and improving. The foundations underneath it start at{" "}
        <Link
          href="/learn/revenue-operations-maturity-stage-1-reactive"
          className="text-navy underline"
        >
          Stage 1
        </Link>
        .
      </p>

      <h2 className={h2}>Your sales win rate, and what it is actually for</h2>
      <p>
        Your sales win rate is the percentage of qualified opportunities you win:
        closed-won deals divided by all closed deals (won plus lost) in the period.
        Twenty wins out of eighty closed deals is a 25% win rate. Two disciplines keep the
        number honest. Count only real opportunities, meaning deals that passed
        qualification, or your win rate becomes a measure of how optimistically you log
        pipeline. And decide explicitly how to treat deals that ended in no decision,
        because at most companies that is the largest single bucket, and silently
        excluding it flatters the number.
      </p>
      <p>
        The blended win rate is a scoreboard; the segmented win rate is the strategy
        tool. Win rate by competitor tells you who actually beats you and where. Win rate
        by deal size tells you where your sweet spot ends. Win rate by lead source tells
        you which channel produces buyers rather than browsers. Win/loss analysis is what
        explains the differences the segmentation reveals, which is why the two belong on
        the same page.
      </p>
      <p>
        On a discovery call we ask founders what the most common reason they lose deals is,
        and then a second question: how do you know that is the real reason? The gap
        between those two answers is the size of the opportunity. If your answer to the
        second question is &ldquo;the CRM field,&rdquo; you now know exactly what that
        answer is worth.
      </p>
    </>
  );
}
