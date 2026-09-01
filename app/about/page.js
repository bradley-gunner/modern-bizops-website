import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import CtaCallout from "@/components/learn/CtaCallout";

// THE ABOUT PAGE IS FOUNDER PROOF, and after the AI pivot it is one of only
// five nav destinations on a site selling AI automation. So it opens with the
// approved positioning paragraph and nothing else: no dek, no summary, no
// warm-up line ahead of it.
//
// The paragraph below is transcribed verbatim from section 1 of
// "08 Messaging Architecture.md" (APPROVED-BY-BRADLEY 2026-08-10), which is the
// law for every customer-facing copy surface. Do not paraphrase it, do not
// trim it, and do not translate it out of the first-person singular. It is
// Bradley's personal record, which is the "I" side of the voice split; "we" is
// for Modern BizOps as a company and does not belong in these three
// paragraphs.
//
// IT IS VERBATIM AGAIN, AFTER A ROUND TRIP ON 2026-08-12. The "we" voice sweep
// rewrote this whole page into the third person and recorded the divergence
// from doc 08 as deliberate. Bradley reversed that the same day: "If the page
// is set to be authored by a specific person such as myself then first person
// language still makes sense to use in that instance."
//
// SETTLED 2026-09-01, AND THE ANSWER IS NOT EITHER OF THE TWO OBVIOUS ONES.
// The page is company voice now, but the paragraphs below are still verbatim
// doc 08 in the first person, because they are BYLINED rather than swept. See
// the AuthoredNote comment further down for his wording and the full history.
// The rule in one line: an "I" on this page lives inside an
// authored-by-bradley region under a visible byline, and a sentence where the
// COMPANY promises something says "we". A voice sweep that removes the first
// person from these paragraphs is repeating 2026-08-12 and will fail
// __tests__/copy/voice-split.test.js on the way.
//
// "our customers" in the Contactually sentence is safe ONLY in the first
// person, where "our" is Contactually's. The sweep had to rewrite it to
// "Contactually's customers" because the third person made it read as a Modern
// BizOps client claim, and there are none. If anyone converts this page again,
// that pronoun is the one that turns into a false claim.
//
// Two things in it look like violations and are not:
//   - It names Dapper Labs, Tock and SalesIntel. Those are iExcel-era clients,
//     cleared for public naming only inside the attribution frame, and the
//     sentence carries its own: "as COO of iExcel ... for clients like ...
//     while I was there." Never lift those names out of that sentence.
//   - It says "a RevOps coaching business". That is one of the company ideas he
//     tested in January and abandoned, inside the origin narrative. It is not a
//     description of what Modern BizOps sells, which is the thing that had to
//     come off this page.
// EVERY FIRST-PERSON REGION ON THIS PAGE CARRIES ONE OF THESE.
//
// Bradley, 2026-09-01, deciding the conflict below: "I want the page to be
// company voice and for me to be quoted as telling the story or for the section
// that is using the I voice to be obvious that it's something that is authored
// by me."
//
// The conflict: David Ellis (Tugboat) rated the I-versus-we tension his
// highest-consequence finding on 2026-08-24, saying the two voices read as
// interchangeable the longer you spend on the site. On 2026-08-26 Bradley ruled
// this a brand surface. But a "we" sweep of this page ALREADY HAPPENED on
// 2026-08-12 and he reversed it the same day, and the paragraphs below are
// transcribed verbatim from doc 08, which forbids translating them out of the
// first person.
//
// So the first person did not get swept off this page again. It got a byline,
// and the sections where the COMPANY is the one making a promise moved to "we".
// That is where the interchangeability actually bit: a reader cannot tell who
// is speaking when an unmarked "I" guarantees a runbook.
//
// The markers around each region are read by __tests__/copy/voice-split.test.js,
// which now guards this page. An "I" outside a marked region fails the build.
function AuthoredNote({ children, tone = "light" }) {
  const colour = tone === "dark" ? "text-amber-light" : "text-amber";
  const rule = tone === "dark" ? "bg-amber-light/50" : "bg-amber/50";
  return (
    <p
      className={`mb-6 flex items-center justify-center gap-3 font-body text-[13px] font-medium uppercase tracking-[0.22em] ${colour}`}
    >
      <span aria-hidden="true" className={`h-px w-8 ${rule}`} />
      {children}
      <span aria-hidden="true" className={`h-px w-8 ${rule}`} />
    </p>
  );
}

/* authored-by-bradley:start */
const POSITIONING = [
  "I spent over a decade building revenue engines at high-growth startups, as the person doing the work. At Contactually I carried an inside sales quota and closed $318,000 in churn-adjusted ARR. I built the onboarding program that cut first-90-day churn in half, which saved about a million dollars in revenue over six quarters. I was the company's first recruiter and stood up the applicant tracking system. And I taught realtors, our customers, how to generate real business from their networks with CRM technology. At FiscalNote I was a client success manager with a portfolio that included Fortune 500 companies. I founded Tasting Club, a virtual tastings marketplace, and ran it for three years. Then I spent four and a half years as COO of iExcel, a digital marketing agency, where I doubled revenue, ran delivery, invoicing, hiring, and payroll, and executed marketing and sales operations for clients like Dapper Labs, Tock, and SalesIntel while I was there.",
  "In January I left and gave myself one rule: build everything with AI, or do not build it at all. I was not setting out to start an AI automation company. I tested company ideas, field-operations systems for HVAC companies, a RevOps coaching business, and built every system AI-first. Teaching myself to build was not new: I built Tasting Club's product myself on Bubble, a no-code tool. What was new was how far AI took it. I built my marketing website from scratch with AI coding tools. I built a working diagnostic web app the same way, the one that runs my audits: it connects to more than twenty tools through their APIs and computes a maturity heat map from a client's actual stack. I wired my own operations to APIs and MCP servers for analytics, search, CRM, and publishing. Six months of doing nothing but building with AI later, an AI automation company stopped being an idea and became the obvious thing to build. That is how I became an AI guy: not by rebranding, by shipping. And because I have sat in the executor seat and rolled out new process to real teams, I know where adoption sticks and where it dies. So every automation I build ships with the adoption work on the other side.",
  "Most AI automation fails for a boring reason: it is built on a broken operations foundation. The debt you could tolerate for years, dirty data, duct-tape process, fields nobody fills in, now decides whether AI works for you at all.",
  // RE-DERIVED 2026-08-18 (doc 08 Why amendment, section 1). This paragraph is
  // new and is the join between the operations-debt pillar and the Why: the debt
  // is not only why automation fails, it is the mechanism by which the gains
  // concentrate. A company that can buy the repair gets the outcome; a company
  // that cannot gets the demo.
  "That is also the mechanism that decides who gets the gains. A company with a transformation budget pays somebody to fix the foundation and moves on. A company with forty people gets sold the tool and none of the repair. The tool does not work, and the conclusion everybody draws is that AI is not for businesses that size. The gap was never technical. It is who gets sold the repair.",
  // "I fix" became "We fix" for the we-voice, and "when I leave" became "when the
  // engagement ends" because Partner and Care Plan are ongoing rungs where nobody
  // leaves. Both per the same amendment.
  "We fix the foundation and build the automation on top of it, one named system at a time, at a published price, with your team owning it when the engagement ends.",
];
/* authored-by-bradley:end */

export const metadata = {
  // Root layout applies a "%s | Modern BizOps" template, so this bare title
  // renders at 36.
  title: "About Bradley de Wet",
  description:
    "Bradley de Wet spent over a decade in the executor seat at high-growth startups, and now builds AI automation for B2B go-to-market.",
  alternates: {
    canonical: "https://modernbizops.com/about",
  },
  openGraph: {
    title: "About Bradley de Wet | Modern BizOps",
    description:
      "Bradley de Wet spent over a decade in the executor seat at high-growth startups, and now builds AI automation for B2B go-to-market.",
    url: "https://modernbizops.com/about",
    siteName: "Modern BizOps",
    images: [
      {
        url: "/og/og-about.png",
        width: 1200,
        height: 630,
        alt: "Meet Bradley de Wet, founder of Modern BizOps",
      },
    ],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Bradley de Wet | Modern BizOps",
    description:
      "Over a decade in the executor seat. Operator first, consultant never.",
    images: ["/og/og-about.png"],
  },
};

// Every number here is in the paragraph above it or in the career record it was
// transcribed from. The row read "15 / Years in RevOps" and "25+ / Companies"
// until 2026-08-11: the first asserts a number nothing new is allowed to
// assert, and the second was a headline stat built by adding up client counts
// across employers, which is the additive-total shape already removed from the
// founding clients page.
const credentials = [
  { label: "10+", sublabel: "Years building revenue engines" },
  { label: "~$1M", sublabel: "Revenue saved from churn at Contactually" },
  { label: "2x", sublabel: "Agency revenue as COO" },
];

// The certification list said "HubSpot Revenue Operations Certified", which
// appears nowhere in the verified career record. These three do.
const certifications = [
  "HubSpot Solutions Partner",
  "HubSpot Marketing Hub Implementation",
  "Professional Scrum Master I",
];

// Dates corrected to the verified career record. The onboarding and premium
// services roles overlapped in real life, which is why two rows carry the same
// span; the page previously split them into tidy non-overlapping ranges that
// the record does not support.
/* authored-by-bradley:start */
const stories = [
  {
    years: "2014 to 2016",
    role: "Inside Sales, Contactually",
    headline:
      "I doubled my conversion rate for some segments by questioning the demo that nobody questioned",
    body: [
      "Contactually was a VC-backed CRM startup in DC. I was doing 30-minute screen-share demos all day, every day. The standard process was 3 to 4 calls spread across a 3-week free trial. Nobody had ever stopped to ask whether it actually needed to take that long.",
      "So I started testing. I built demo accounts customized for each persona I was selling to. If I was talking to a real estate agent, the demo account looked like a real estate agent’s account, with email templates and workflows built around their specific pain points. Not a generic product tour. Their world, reflected back to them.",
      "Then I added an offer at the end of every demo: sign up for an annual plan today and I will copy everything you just saw into your account by tomorrow morning. A lot of people said yes.",
      "I doubled my conversion rate for some segments and closed $318,000 in churn-adjusted ARR. The sales cycle dropped from 3 to 4 calls down to about 1.5. I taught the technique to the rest of the team and the company shortened the trial period from 3 weeks to 2 weeks based on what we found.",
    ],
    // The three lesson callouts were the only blocks on this page with no
    // number, no name and no date in them, and all three closed on an epigram
    // that would have sat under any LinkedIn post. Each one now carries a
    // specific from the story directly above it. Keep it that way.
    lesson:
      "Nobody at Contactually had ever timed the trial. Three weeks was in the playbook because three weeks had always been in the playbook, and testing it took the company down to two.",
    // "for some segments" is the career record's own qualifier on this number.
    // Dropping it turns a segment result into a book-wide one.
    stat1: { value: "2x", label: "Conversion rate, some segments" },
    stat2: { value: "$318K", label: "Churn-adjusted ARR" },
    stat3: { value: "~1.5", label: "Avg calls to close" },
  },
  {
    years: "2016 to 2018",
    role: "Customer Onboarding Manager, Contactually",
    headline: "I saved a million dollars in churned revenue by building what did not exist",
    body: [
      "When I moved from sales to customer onboarding, I discovered that nobody had a structured process for what happened after a customer paid. There was no activation framework. No milestones. No data on who was actually using the product. Customers were signing up, getting confused, and canceling within 90 days, and no one had any visibility into why.",
      "I started with brute force. I ran 2-call onboarding sessions with a subset of new customers. I tracked everything. The data showed the customers I was talking to were churning at a significantly lower rate than the ones I was not.",
      "From that I built a hypothesis: there were 4 specific things a customer needed to accomplish to reach their first real moment of value. I called it the activation funnel. I oriented every onboarding call around getting people through those 4 gates, and the numbers confirmed it was working.",
      "I hired and trained a team of 3. Tested outsourcing the calls to cut costs, then shut that down when I saw what robotic, checklist-following reps did to customer relationships. Pivoted to live webinars, then eventually automated webinars that ran as if they were live.",
      "By the time the system was fully built, it had saved the company roughly $1 million in churned annual recurring revenue across 6 quarters. That result contributed directly to the company’s Series A valuation.",
    ],
    lesson:
      "I ran the onboarding calls myself first, and the data from those calls is where the four gates came from. Only then did I hire the team of 3 to run them. Building it in that order is why it kept working once it was not me on the call.",
    stat1: { value: "~$1M", label: "ARR saved from churn" },
    stat2: { value: "50%", label: "90-day churn reduction" },
    stat3: { value: "+$720", label: "LTV per customer" },
  },
  {
    years: "2016 to 2018",
    role: "Program Manager, Premium Services, Contactually",
    headline: "I built a premium service from scratch and priced it at 8 times the standard rate",
    body: [
      "After proving I could fix sales processes and rebuild onboarding from the ground up, the company asked me to do something new: create a premium done-with-you service and take it to market.",
      "Contactually’s enterprise customers were real estate brokerages who bought the software for their agents. The agents needed help actually using it. So I built a premium plan: weekly working calls with a success manager who would set up advanced automations in their account and show them how to run it.",
      "I priced it at 8 times the standard subscription rate. Eight times.",
      "I sold it through educational webinars where I would show the most advanced setups, things like automated open house follow-up sequences, and close with a simple offer: spend the next month figuring this out yourself, or let us do it with you.",
      // A "hired and trained 2 additional team members" line stood here until
      // 2026-08-12. The career record has a team of 3 on the ONBOARDING role
      // and no headcount at all on this one, so the number had no source.
      "I closed $288,000 in annual recurring revenue. The model worked.",
    ],
    lesson:
      "The offer had a name and a number on it, and that is what made eight times the standard rate sellable. Every build Modern BizOps sells has its price printed next to it for the same reason.",
    stat1: { value: "$288K", label: "ARR closed" },
    stat2: { value: "40+", label: "Customers on the premium plan" },
    stat3: { value: "8x", label: "Price premium" },
  },
];
/* authored-by-bradley:end */

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main-content">

        {/* ── HERO: headshot, H1, then the approved paragraph, in that order ── */}
        <section className="bg-cream">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-16 md:py-24">
            <div className="flex flex-col md:flex-row gap-12 items-start max-w-[960px] mx-auto">
              <div className="flex-shrink-0">
                <div className="w-52 h-52 md:w-64 md:h-64 rounded-[14px] overflow-hidden shadow-sm">
                  <Image
                    src="/images/bradley-headshot.jpg"
                    alt="Bradley de Wet, founder of Modern BizOps"
                    width={256}
                    height={256}
                    sizes="(max-width: 768px) 208px, 256px"
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="flex-1 pt-2">
                <p className="font-body text-sm font-semibold tracking-widest uppercase text-amber mb-4">
                  About Bradley de Wet
                </p>
                <h1 className="font-display text-[34px] md:text-[48px] leading-tight font-semibold text-navy mb-6">
                  Over a Decade in the Executor Seat
                </h1>

                {/* Credential stats */}
                <div className="flex flex-wrap gap-8 mb-6">
                  {credentials.map((c) => (
                    <div key={c.label}>
                      <p className="font-display text-[32px] font-semibold text-amber leading-none">
                        {c.label}
                      </p>
                      <p className="font-body text-sm text-text-mid mt-1 max-w-[180px]">
                        {c.sublabel}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1.5 font-body text-xs font-medium text-amber border border-amber/30 bg-amber-pale rounded-full px-3 py-1"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3 h-3"
                        aria-hidden="true"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── THE POSITIONING PARAGRAPH, VERBATIM ──────────────────────────── */}
        <section className="bg-white">
          <div className="mx-auto max-w-[760px] px-6 md:px-8 py-16 md:py-24">
            <AuthoredNote>Bradley de Wet, in his own words</AuthoredNote>
            <div className="space-y-6 font-body text-text-primary text-[17px] md:text-lg leading-relaxed">
              {POSITIONING.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {/* ── BRIDGE INTO THE THREE STORIES ────────────────────────────────── */}
        <section className="bg-navy">
          <div className="mx-auto max-w-[720px] px-6 md:px-8 py-14 md:py-20 text-center">
            <AuthoredNote tone="dark">
              The next three sections are Bradley&rsquo;s account
            </AuthoredNote>
            {/* authored-by-bradley:start */}
            <h2 className="font-display text-[26px] md:text-[34px] font-semibold text-cream mb-5">
              Everything I build, I have run myself
            </h2>
            <p className="font-body text-base md:text-lg text-cream/80 leading-relaxed">
              That is the summary. Below is the long version of three roles, all
              at Contactually. Inside sales, customer onboarding, and a premium
              service I priced and sold myself. Every number in them is one I
              carried.
            </p>
            {/* authored-by-bradley:end */}
          </div>
        </section>

        {/* ── THREE STORIES ─────────────────────────────────────────────────── */}
        {stories.map((story, idx) => (
          <section
            key={story.role}
            className={idx % 2 === 0 ? "bg-white" : "bg-cream"}
          >
            <div className="mx-auto max-w-[900px] px-6 md:px-8 py-16 md:py-24">
              <div className="mb-2">
                <span className="font-body text-xs font-semibold tracking-widest uppercase text-amber">
                  {story.years}
                </span>
              </div>
              <p className="font-body text-sm text-text-mid mb-3">{story.role}</p>
              <h2 className="font-display text-[26px] md:text-[34px] font-semibold text-navy mb-8 max-w-[700px]">
                {story.headline}
              </h2>

              {/* Stats row */}
              <div className="flex flex-wrap gap-8 mb-10 pb-10 border-b border-border">
                {[story.stat1, story.stat2, story.stat3].map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-[28px] md:text-[36px] font-semibold text-amber leading-none">
                      {s.value}
                    </p>
                    <p className="font-body text-sm text-text-mid mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Story body */}
              <div className="space-y-5 font-body text-text-primary text-base leading-relaxed max-w-[720px]">
                {story.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Lesson callout */}
              <div className="mt-8 pl-5 border-l-4 border-amber">
                <p className="font-body text-base text-text-mid italic leading-relaxed">
                  {story.lesson}
                </p>
              </div>
            </div>
          </section>
        ))}

        {/* ── THE WHY ───────────────────────────────────────────────────────── */}
        {/* Doc 08 Messaging Architecture, the unnumbered "The Why" section
            (added and APPROVED 2026-08-18). Per its demonstrated-Why rule, the
            Why is stated IN FULL in exactly two places: this page and the VSL.
            Everywhere else it appears only as consequence, and the Learn pages
            and the three AEO assets are excluded outright. The homepage does
            not state it either; it carries it by embedding the VSL.

            THE VOICE SHIFT IS DELIBERATE: "I believes, we builds." Layers 1 and
            2 are first person because nobody believes a company has
            convictions; layer 3 turns to "we" because the practices belong to
            the business. This does not reopen the 2026-08-12 decision retiring
            first person as the general brand voice, it applies that decision's
            own carve-out for authored-by-a-person surfaces.

            This replaced the pre-amendment section ("My dad ran a small
            computer consulting business...", headed "The systems that make a
            venture-backed company run should not cost a
            two-hundred-thousand-dollar hire to get"). That version was not
            wrong, it argued a different thing: a gap in who can afford systems,
            rather than a distribution problem in who gets sold the repair.

            DO NOT LABEL THIS. Section 3 fences "mission", "our mission" and
            "purpose-driven" to internal use, and bans democratize, abundance,
            benevolent, "here to help", "your guide", empower, unlock and "level
            the playing field" outright. The Why is shown, never announced. */}
        <section className="bg-navy">
          <div className="mx-auto max-w-[720px] px-6 md:px-8 py-16 md:py-24">
            {/* The eyebrow carries the attribution rather than a second label
                being added beside it. Doc 08 section 3 fences "mission", "our
                mission" and "purpose-driven" to internal use, so this names the
                author, never the genre. */}
            <p className="font-body text-sm font-semibold tracking-widest uppercase text-amber mb-4">
              Bradley, on the reason behind the company
            </p>
            <h2 className="font-display text-[28px] md:text-[38px] font-semibold text-cream mb-8 leading-tight">
              AI is about to make a small number of companies enormously more productive, and most of them are already the biggest
            </h2>

            {/* Layer 1, the belief. First person: the conviction is Bradley's. */}
            <div className="space-y-5 font-body text-cream/80 text-base leading-relaxed">
              <p>
                The largest companies in every market have the budget for the
                transformation, the staff to run the pilot, and data that is
                already in decent shape. They are going to be fine.
              </p>
              <p>
                The businesses that employ{" "}
                <a
                  href="https://advocacy.sba.gov/2026/02/03/frequently-asked-questions-about-small-business-2026/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-light underline underline-offset-4 hover:text-amber"
                >
                  nearly half the private workforce
                </a>{" "}
                in this country are getting pitched left, right and center on
                the promise of AI, and are buying services and implementation
                that often do not produce the value they were promised. That is
                not because the technology does not work at their size. It is
                because nobody will sell them the unglamorous part of fixing
                their underlying systems, and that unglamorous part is the
                biggest part of the job.
              </p>
              {/* authored-by-bradley:start */}
              <p>
                If this holds, the productivity gains from this decade land
                almost entirely on people who were already ahead. I do not think
                that is inevitable. I think it is a distribution problem, and
                distribution problems get solved when somebody decides to do the
                boring work at a price a small or medium size business can
                actually pay.
              </p>
              <p className="text-cream font-semibold">
                That is what Modern BizOps is built for.
              </p>

              {/* Layer 2, the where. Still first person. */}
              <p className="pt-4">
                The businesses I am talking about are not abstractions. They are
                the companies on the commercial strip outside your office. A
                staffing firm with forty people. A field services company
                running eleven trucks. A CPA firm that has done the same three
                things well for twenty years.
              </p>
              {/* authored-by-bradley:end */}
              <p>
                When one of them gets meaningfully cheaper to run, the money
                does not leave town. It turns into a raise, or a hire, or a
                price that holds while the competition raises theirs.
              </p>

              {/* Layer 3, the commercial expression. Voice turns to "we": the
                  practices belong to the business. All four predate the Why and
                  were chosen commercially, which is why they are named as
                  structural necessity and never as policy or generosity. */}
              <p className="pt-4">
                This is why the company is built the way it is. We publish
                prices, so you can decide without sitting through a sales
                process. We work on one named system at a time, so the bill is
                never a transformation. Your team owns what we build, and gets
                the training, so the capability stays in the building when we
                are no longer working together. We run audits that tell you what
                not to buy. And if there is nothing there worth building, you
                get your money back.
              </p>
              <p>
                None of this is generosity in our minds. It is what the work has
                to look like if small and medium size businesses are ever going
                to capture any of the value from AI.
              </p>
            </div>
          </div>
        </section>

        {/* ── NO CLIENT RESULTS YET, SAID OUT LOUD ─────────────────────────── */}
        {/* This band replaced a "What people say" section carrying two named
            quotes with headshots.

            Katie Ellis MacMillan's read "Working with Bradley was a genuinely
            great experience ... brought much-needed clarity and structure to our
            marketing and operations." That is a delivered-work claim in a
            client's voice, with no employer, no date and no attribution frame.
            On a page that is now one of five nav destinations for a company with
            zero clients, a visitor reads it as a Modern BizOps result. Cut.

            Brendan Troy's ("Bradley checks all the boxes ...") is a genuine peer
            character reference and claims no engagement and no outcome. It was
            still cut, for two reasons that have nothing to do with the quote
            itself: a two-card grid under "What people say" is testimonial
            furniture regardless of what the cards say, and leaving one card
            standing in that frame makes the frame louder, not quieter. It also
            endorses Bradley as a hire, which is proof for the wrong purchase.

            Nothing was fabricated to replace them. The honest version of this
            section is the sentence below. */}
        <section className="bg-cream">
          <div className="mx-auto max-w-[720px] px-6 md:px-8 py-16 md:py-24">
            <h2 className="font-display text-[28px] md:text-[38px] font-semibold text-navy mb-6 leading-tight">
              There is no client logo wall on this page
            </h2>
            <div className="space-y-5 font-body text-text-primary text-base md:text-lg leading-relaxed">
              <p>
                Modern BizOps is new. It has no case studies and no client
                results, and we are not going to borrow someone
                else&rsquo;s, or dress up work our founder did under another
                company&rsquo;s name as if it were ours. Everything above
                happened before Modern BizOps existed, in seats he held at other
                companies and in the one company he founded himself.
              </p>
              <p>
                That is the whole reason the{" "}
                <Link
                  href="/founding-clients"
                  className="text-navy underline underline-offset-4 hover:text-amber transition-colors"
                >
                  founding client program
                </Link>{" "}
                exists, and why it is priced the way it is. The first companies
                through the door are trading a shorter track record for terms
                nobody after them gets.
              </p>
            </div>
          </div>
        </section>

        {/* ── WHO THIS IS NOT FOR ───────────────────────────────────────────── */}
        <section className="bg-white">
          <div className="mx-auto max-w-[720px] px-6 md:px-8 py-16 md:py-24">
            {/* This heading and the last paragraph below are where the
                unmarked first person did real damage, and they are the reason
                the page moved rather than the stories. A guarantee about
                runbooks and lock-in is the COMPANY promising, and an unmarked
                "I" made a reader work out which of the two voices was on the
                hook for it. Ellis called that interchangeable, and here he was
                right. */}
            <h2 className="font-display text-[26px] md:text-[34px] font-semibold text-navy mb-8">
              We are not for everyone. Here is who we are for.
            </h2>
            <div className="space-y-5 font-body text-text-primary text-base leading-relaxed">
              <p>
                If you are looking for a magic tool, or for AI to be the thing
                that finally makes a broken process work, this is not it.
                Automating a process nobody has defined just produces the wrong
                answer faster.
              </p>
              <p>
                This works for founders and operators who will give the build a
                real system of record to sit on and one person on their side who
                owns it afterward. We do the building. Your team has to be
                willing to run it.
              </p>
              <p>
                And we are not going to build something you stay dependent on
                us to maintain. Every system ships with a runbook and a handover
                to the person on your side who owns it. Every price we charge is
                published, so you can rule us out without booking a call.
              </p>
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
        {/* Both of these were bare <Link>s, which fire no cta_click at all. */}
        {/* A navy card on a light band, not a full-bleed navy section: the
            footer is bg-navy too, so the old treatment ran the close and the
            sitemap together into one field with only a hairline between them.
            Plain band rather than a <Section> for the reason CtaCallout's other
            callers give: it carries its own max-width, centering and margin. */}
        <div className="bg-cream px-6 py-6 md:px-8 md:py-10">
          <CtaCallout>
            <h2 className="font-display text-[28px] md:text-[40px] font-semibold text-cream mb-5 leading-tight">
              Want to know what is worth automating first?
            </h2>
            <p className="font-body text-cream/80 text-lg mb-8 leading-relaxed">
              Start with the free Scan. Sixteen questions, about five minutes,
              and no call required. If you would rather talk it through, the
              call confirms your fit and your price.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/scorecard" ctaLocation="about_foot">
                Get the Free Scan
              </Button>
              <Button href="/book" variant="secondary" ctaLocation="about_foot">
                Book a call
              </Button>
            </div>

            <p className="font-body text-sm text-cream/50 mt-6">
              Five minutes · No call required · HubSpot Solutions Partner
            </p>
          </CtaCallout>
        </div>

      </main>
      <Footer />
    </>
  );
}
