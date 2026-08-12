import Link from "next/link";
import Button from "@/components/ui/Button";
import StatCards from "@/components/learn/StatCards";
import CoachingContrast from "@/components/revenue-consulting/CoachingContrast";
import EngagementFlow from "@/components/revenue-consulting/EngagementFlow";

const h2 = "font-display font-semibold text-navy text-2xl mt-10 mb-3";
const link = "text-navy underline";

// Body copy is transcribed verbatim from the approved spec
// (9.1-revenue-operations-consulting.md). The only edits are JSX entity
// escaping (react/no-unescaped-entities) and the internal/outbound links called
// for in the build spec. The three visual blocks are interleaved where their
// source section sits: the coaching-vs-consulting contrast under its heading,
// the benchmark cards after both benchmarks are cited in prose, and the
// engagement flow under "How it works".
export default function RevenueConsultingBody() {
  return (
    <>
      <p>
        <Link href="/learn/what-is-revops" className={link}>
          Revenue operations
        </Link>{" "}
        consulting is bringing in outside help to align your marketing, sales,
        and customer success into one revenue engine, so growth stops depending
        on who happens to be in the room. That is the textbook definition. The
        problem is in how it is usually delivered.
      </p>
      <p>
        Most revenue operations consulting builds the system for you, or worse,
        hands you a report and leaves. Either way, the expertise walks out the
        door when the engagement ends. Your team is left running a machine they
        did not build and do not fully understand. Six months later the process
        has quietly drifted back to how it was before, because nobody inside the
        company owned it.
      </p>
      <p>This is built the opposite way.</p>

      <h2 className={h2}>
        Consulting builds it for you. Coaching builds it into you.
      </h2>
      <p>Here is the distinction that decides whether the results last.</p>
      <p>
        A traditional consultant or agency does the work themselves. They
        configure your CRM, redesign your process, and present the finished
        thing. It looks great on day one. But your team did not build it, so your
        team does not truly own it, and the person who understood why every
        decision was made is now working with their next client.
      </p>
      <p>
        This model is coaching, not consulting in that sense. An experienced
        operator, someone who has actually run the revenue function, coaches your
        own employee to build the system. Your team does the work. We provide the
        roadmap and the guidance. When the engagement ends, the capability stays
        in the building, because the people who run it every day are the ones who
        built it. They understand their own system well enough to coach the next
        hire on it.
      </p>
      <p>
        That is the whole point. We do not build something you become dependent on
        us to maintain. You end up with a working system and a team that owns it,
        not a vendor you have to keep on retainer to keep the lights on.
      </p>

      <CoachingContrast />

      <p>
        This is not a fringe idea. In 2021, Gartner{" "}
        <a
          href="https://www.gartner.com/en/newsroom/press-releases/2021-05-17-gartner-predicts-75--of-the-highest-growth-companies-"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          predicted that by 2025, 75 percent of the highest-growth companies in
          the world would deploy a revenue operations model
        </a>
        . The best companies already run on this. The question for a founder-led
        business is how to get there without a{" "}
        <Link href="/learn/fractional-coo" className={link}>
          six-figure hire
        </Link>{" "}
        or an agency retainer that never transfers the knowledge.
      </p>

      <h2 className={h2}>What revenue operations consulting actually covers</h2>
      <p>
        The work lives in four places, and they are connected. Fix one in
        isolation and the other three pull it back.
      </p>
      <p>
        Your CRM and pipeline. Most companies at this size have a CRM that is
        a glorified contact list. Half the team does not use it properly, the
        data is not trusted, and you cannot see the real state of the pipeline
        without calling a meeting and asking people directly. The fix is{" "}
        <Link href="/learn/crm-architecture-and-governance" className={link}>
          architecture
        </Link>
        , not another tool.
      </p>
      <p>
        <Link href="/learn/marketing-and-sales-alignment" className={link}>
          Marketing and sales alignment
        </Link>
        . Marketing generates leads and nobody can prove which ones turn into
        revenue. Sales says the leads are weak. Marketing says sales does not
        follow up. Both are partly right, and the argument continues because
        there is no shared definition of a good lead and no accountability tied
        to it.
      </p>
      <p>
        The{" "}
        <Link href="/learn/net-revenue-retention" className={link}>
          post-sale motion
        </Link>
        . Onboarding is inconsistent. Some clients have a great first 90 days,
        others churn quietly. This is where most of the enterprise value in your
        business actually sits, and it is usually the least operationalized. The
        math is stark: Bain and Company research found that{" "}
        <a
          href="https://www.bain.com/insights/zero-defections-quality-comes-to-services-harvard-business-review-hbr/"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          increasing customer retention by 5 percent can increase profits by 25
          to 95 percent
        </a>
        . Most companies chase new logos while that leak runs unattended.
      </p>
      <p>
        Measurement. You are paying for eight or more software tools and you
        still build spreadsheets on Sunday nights to understand your own numbers.
        Real measurement means customer acquisition cost payback, lifetime value
        to acquisition cost, and gross margin per client are visible every Monday
        without you chasing anyone.
      </p>
      <p>
        In the{" "}
        <Link href="/predictable-revenue-engine" className={link}>
          GTM Maturity Framework
        </Link>
        , a method we built for scoring the revenue competencies of a business
        across four stages, these are not four projects. They are competencies
        inside one system, and the order you fix them in is the difference
        between a roadmap and a to-do list.
      </p>

      <StatCards
        label="Benchmarks"
        title="This is not a fringe idea."
        stats={[
          {
            big: "75%",
            desc: "Gartner predicted that by 2025, 75 percent of the highest-growth companies in the world would deploy a revenue operations model.",
            source: "Gartner, 2021",
          },
          {
            big: "25–95%",
            desc: "Bain and Company research found that increasing customer retention by 5 percent can increase profits by 25 to 95 percent.",
            source: "Bain and Company (Reichheld, HBR)",
          },
        ]}
      />

      <h2 className={h2}>When you actually need this</h2>
      <p>
        You do not need this because a competitor has it. You need it when the
        symptoms start compounding.
      </p>
      <p>
        Growth has become tied to headcount. Every time you want to close more
        deals or serve more clients, the answer is hire someone, and margins
        erode to pay for systems that should be doing the work.
      </p>
      <p>
        You are the bottleneck. Every real decision routes through you, because
        nobody else has the systems or the data to make it without you. You
        cannot take a week off without the pipeline stalling.
      </p>
      <p>
        Someone asked a question you could not answer. A bank, an investor, or an
        acquirer asked about customer acquisition cost, retention, or unit
        economics, and you did not have a confident number to give them.
      </p>
      <p>
        If none of that is happening yet, you probably do not need this. If two
        or more are, working harder is not the fix. The system is.
      </p>

      <h2 className={h2}>How it works: the platform plus the coaching</h2>
      <p>
        This is where the software earns its place. A consultant with a slide
        deck is working from a few interviews and their own opinion. This works
        from three things at once, so the picture is well-rounded and actually
        representative of your business.
      </p>
      <p>
        The engagement runs on the Revenue Intelligence Platform, a custom-built
        system that structures the whole engagement.
      </p>
      <p>
        First, it builds the assessment from three inputs, not one. The platform
        connects to your actual tools and reads the data already in your systems.
        You complete a structured questionnaire about how the business really
        runs. And we do a working call together, so the assessment captures the
        context that data and a form alone cannot. Those three inputs combine
        into a heat map of exactly where each competency stands today, and where
        the revenue is leaking. It is more rigorous than a survey and more
        grounded than a consultant&rsquo;s first impression, because it is both
        at once.
      </p>
      <p>
        Second, it structures the coaching. The assessment produces a prioritized
        roadmap, the specific competencies holding revenue back, in the order
        that actually compounds. Every weekly coaching session targets a
        competency from that roadmap. Your team builds the system, one competency
        at a time, with our guidance. AI is built into the plan wherever it
        genuinely accelerates a competency, never bolted on for its own sake.
      </p>
      <p>
        Third, it proves the results. The platform continuously measures
        improvement from your connected tool data and your call transcripts, so
        progress is something you can see in the numbers, not something you take
        on faith. That is the difference between coaching that feels good and
        coaching that shows up in the forecast.
      </p>
      <p>
        The core roadmap runs roughly 12 to 16 weeks. The through line is
        ownership. You execute the changes yourself with our guidance, so you
        understand the ins and outs of your own system. When we are done, you own
        it, and you do not need us.
      </p>

      <EngagementFlow />

      <h2 className={h2}>Why us</h2>
      <p>
        Our founder has been in the seat, not on the sidelines, and in every
        role he has held he was the person building the revenue system, not the
        person advising on it from a distance. That is exactly why the coaching
        model works. He can coach your employee to build it because he has been
        that employee.
      </p>
      <p>
        At Contactually, a VC-backed SaaS company, he was an inside sales AE,
        then the company&rsquo;s first customer onboarding manager, and then took
        a premium coaching-and-software subscription product to market. In every
        one of those roles he was an individual executor and a builder of the
        revenue process, not a delegator. That last product, coaching paired with
        software, is close to what Modern BizOps is now.
      </p>
      <p>
        He then started his own company, Tasting Club, and built its revenue
        operations process and systems from scratch, so he knows what it is to be
        the founder who has to make the engine work.
      </p>
      <p>
        And as COO and head of account management at a boutique digital marketing
        agency, he managed a portfolio of clients himself, executing directly and
        supervising a team to pay down the revenue operations debt inside client
        systems so their marketing campaigns could actually perform.
      </p>
      <p>
        Over a decade of doing the work, in the seat, is what he brings to your
        team. We are not going to hand you best practices from a blog. We are
        going to show you what we have built, and then coach your people to build
        it inside your business.
      </p>

      {/* Mid-page CTA. Floats in a navy card so it reads as its own moment.
          ctaLocation distinguishes it from the closing CTA in GA4. */}
      <div className="mx-auto mt-12 max-w-[760px] rounded-2xl bg-navy px-8 py-12 text-center text-white shadow-[0_22px_50px_-20px_rgba(14,31,56,0.6)] md:px-12 md:py-14">
        <h2 className="font-display text-2xl font-semibold text-white md:text-[28px]">
          Ready to see where your revenue engine actually stands?
        </h2>
        <p className="mx-auto mt-4 mb-6 max-w-[52ch] text-white/80">
          If your growth is tied to headcount and you are tired of being the
          bottleneck, let us find out whether your business is a good fit for this
          work. Book a call and we will give you our honest assessment, including if
          the answer is not yet.
        </p>
        <Button href="/book" ctaLocation="how_it_works_mid_page">
          Book a call
        </Button>
      </div>
    </>
  );
}
