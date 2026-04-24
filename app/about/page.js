import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About Bradley de Wet",
  description:
    "15 years building revenue systems from the inside. Bradley de Wet is the founder of Modern BizOps and a former revenue operator at VC-backed startups.",
  alternates: {
    canonical: "https://modernbizops.com/about",
  },
};

const credentials = [
  { label: "15", sublabel: "Years in RevOps" },
  { label: "25+", sublabel: "Businesses Served" },
  { label: "3", sublabel: "In-Seat Operator Roles" },
];

const certifications = [
  "HubSpot Revenue Operations Certified",
  "HubSpot Solutions Partner",
];

const stories = [
  {
    years: "2014 to 2016",
    role: "Inside Sales AE, Contactually",
    headline: "I doubled my conversion rate by questioning the demo that nobody questioned",
    body: [
      "Contactually was a VC-backed CRM startup in DC. I was doing 30-minute screen-share demos all day, every day. The standard process was 3 to 4 calls spread across a 3-week free trial. Nobody had ever stopped to ask whether it actually needed to take that long.",
      "So I started testing. I built demo accounts customized for each persona I was selling to. If I was talking to a real estate agent, the demo account looked like a real estate agent's account, with email templates and workflows built around their specific pain points. Not a generic product tour. Their world, reflected back to them.",
      "Then I added an offer at the end of every demo: sign up for an annual plan today and I will copy everything you just saw into your account by tomorrow morning. A lot of people said yes.",
      "I doubled my conversion rate and closed $318,000 in churn-adjusted ARR. The sales cycle dropped from 3 to 4 calls down to about 1.5. I taught the technique to the rest of the team and the company shortened the trial period from 3 weeks to 2 weeks based on what we found.",
    ],
    lesson:
      "Every sales process has hidden leverage sitting inside it. Somebody just needs to look at it with fresh eyes and be willing to test something different.",
    stat1: { value: "2x", label: "Conversion rate" },
    stat2: { value: "$318K", label: "Churn-adjusted ARR" },
    stat3: { value: "~1.5", label: "Avg calls to close" },
  },
  {
    years: "2016 to 2017",
    role: "Customer Onboarding Manager, Contactually",
    headline: "I saved a million dollars in churned revenue by building what did not exist",
    body: [
      "When I moved from sales to customer onboarding, I discovered that nobody had a structured process for what happened after a customer paid. There was no activation framework. No milestones. No data on who was actually using the product. Customers were signing up, getting confused, and canceling within 90 days, and no one had any visibility into why.",
      "I started with brute force. I ran 2-call onboarding sessions with a subset of new customers. I tracked everything. The data showed the customers I was talking to were churning at a significantly lower rate than the ones I was not.",
      "From that I built a hypothesis: there were 4 specific things a customer needed to accomplish to reach their first real moment of value. I called it the activation funnel. I oriented every onboarding call around getting people through those 4 gates, and the numbers confirmed it was working.",
      "I hired and trained a team of 3. Tested outsourcing the calls to cut costs, then shut that down when I saw what robotic, checklist-following reps did to customer relationships. Pivoted to live webinars, then eventually automated webinars that ran as if they were live.",
      "By the time the system was fully built, it had saved the company roughly $1 million in churned annual recurring revenue across 6 quarters. That result contributed directly to the company's Series A valuation.",
    ],
    lesson:
      "Start manual. Measure what works. Systematize it. Then scale it. You do not need a massive team. You need the right system.",
    stat1: { value: "~$1M", label: "ARR saved from churn" },
    stat2: { value: "50%", label: "90-day churn reduction" },
    stat3: { value: "+$720", label: "LTV per customer" },
  },
  {
    years: "2017 to 2018",
    role: "Program Manager, Premium Services, Contactually",
    headline: "I built a premium coaching service from scratch and priced it at 8 times the standard rate",
    body: [
      "After proving I could fix sales processes and rebuild onboarding from the ground up, the company asked me to do something new: create a premium done-with-you coaching service and take it to market.",
      "Our enterprise clients were real estate brokerages who bought the software for their agents. The agents needed help actually using it. So I created a coaching program: weekly calls with a success manager who would set up advanced automations in their account and teach them how to use them.",
      "I priced it at 8 times the standard subscription rate. Eight times.",
      "I sold it through educational webinars where I would show the most advanced setups, things like automated open house follow-up sequences, and close with a simple offer: spend the next month figuring this out yourself, or let us do it with you.",
      "We reached $288,000 in annual recurring revenue. I hired and trained 2 additional team members to deliver the coaching alongside me. The model worked.",
    ],
    lesson:
      "The service I offer today is not a theory. I have built and delivered this exact model before. The difference is now I apply it to what I am best at: revenue operations.",
    stat1: { value: "$288K", label: "ARR" },
    stat2: { value: "40+", label: "Coaching customers" },
    stat3: { value: "8x", label: "Price premium" },
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main-content">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
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
                  15 Years Building Revenue Systems From the Inside
                </h1>
                <p className="font-body text-lg text-text-mid leading-relaxed mb-6 max-w-[560px]">
                  I was not a consultant who walked in with a framework. I was the operator who built the
                  sales process, rebuilt the onboarding system, and launched the premium service from
                  scratch. These are the stories that became my methodology.
                </p>

                {/* Credential stats */}
                <div className="flex flex-wrap gap-8 mb-6">
                  {credentials.map((c) => (
                    <div key={c.label}>
                      <p className="font-display text-[32px] font-semibold text-amber leading-none">
                        {c.label}
                      </p>
                      <p className="font-body text-sm text-text-mid mt-1">{c.sublabel}</p>
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

        {/* ── CONTEXT SETTER ───────────────────────────────────────────────── */}
        <section className="bg-navy">
          <div className="mx-auto max-w-[720px] px-6 md:px-8 py-14 md:py-20 text-center">
            <h2 className="font-display text-[26px] md:text-[34px] font-semibold text-cream mb-5">
              Everything I teach, I have already done
            </h2>
            <p className="font-body text-base md:text-lg text-cream/80 leading-relaxed">
              Before I started coaching founders on revenue systems, I spent several years as an
              operator inside a single VC-backed startup, moving through sales, customer onboarding,
              and premium services. The three stories below are where my methodology was built. The
              numbers are real. The lessons are what I now bring to every client engagement.
            </p>
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

        {/* ── WHY I BUILT MODERN BIZOPS ─────────────────────────────────────── */}
        <section className="bg-navy">
          <div className="mx-auto max-w-[720px] px-6 md:px-8 py-16 md:py-24">
            <p className="font-body text-sm font-semibold tracking-widest uppercase text-amber mb-4">
              The reason behind the company
            </p>
            <h2 className="font-display text-[28px] md:text-[38px] font-semibold text-cream mb-8 leading-tight">
              The playbooks I used at venture-backed companies should not be locked behind a $200,000 executive hire
            </h2>

            <div className="space-y-5 font-body text-cream/80 text-base leading-relaxed">
              <p>
                My dad ran a small computer consulting business when I was growing up. I watched what it
                takes to be the person who is responsible for everything: the sales, the delivery, the
                operations, the people. I believe small business owners are the lifeblood of this economy.
              </p>
              <p>
                After my time at Contactually, I spent four years as a fractional operator, running
                revenue operations for more than 10 companies at a time. I also started my own company,
                ran it for three years, and shut it down. I have sat in every one of these seats.
              </p>
              <p>
                What I saw over and over: founders between $3M and $15M running on gut feel and
                spreadsheets, while larger competitors had entire teams dedicated to the systems that
                drive predictable growth. The gap was not talent or effort. It was access to operational
                infrastructure.
              </p>
              <p>
                I started Modern BizOps to close that gap. The same revenue operations playbooks that
                power high-growth startups, rebuilt for companies your size, delivered with your team
                doing the implementation so the results stick after I am gone.
              </p>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
        <section className="bg-cream">
          <div className="mx-auto max-w-[900px] px-6 md:px-8 py-16 md:py-24">
            <h2 className="font-display text-[28px] md:text-[38px] font-semibold text-navy text-center mb-12">
              What people say
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Katie MacMillan */}
              <div className="bg-white rounded-[14px] border border-border p-8">
                <blockquote>
                  <p className="font-display text-xl italic text-navy leading-snug mb-6">
                    &ldquo;Working with Bradley was a genuinely great experience. He quickly became a
                    trusted partner and brought much-needed clarity and structure to our marketing and
                    operations.&rdquo;
                  </p>
                  <footer className="flex items-center gap-3">
                    <Image
                      src="/images/katie-macmillan.jpeg"
                      alt="Katie Ellis MacMillan"
                      width={52}
                      height={52}
                      className="w-13 h-13 rounded-full object-cover border-2 border-border shrink-0"
                    />
                    <div>
                      <p className="font-body font-semibold text-text-primary text-sm">
                        Katie Ellis MacMillan
                      </p>
                      <p className="font-body text-xs text-text-mid">Marketing Leader</p>
                    </div>
                  </footer>
                </blockquote>
              </div>

              {/* Brendan Troy */}
              <div className="bg-white rounded-[14px] border border-border p-8">
                <blockquote>
                  <p className="font-display text-xl italic text-navy leading-snug mb-6">
                    &ldquo;Bradley checks all the boxes. His greatest strengths fall outside the standard
                    roles and responsibilities.&rdquo;
                  </p>
                  <footer className="flex items-center gap-3">
                    <Image
                      src="/images/brendan-troy.jpeg"
                      alt="Brendan Troy"
                      width={52}
                      height={52}
                      className="w-13 h-13 rounded-full object-cover border-2 border-border shrink-0"
                    />
                    <div>
                      <p className="font-body font-semibold text-text-primary text-sm">
                        Brendan Troy
                      </p>
                      <p className="font-body text-xs text-text-mid">GTM Operator, 2 Successful Exits</p>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHO THIS IS NOT FOR ───────────────────────────────────────────── */}
        <section className="bg-white">
          <div className="mx-auto max-w-[720px] px-6 md:px-8 py-16 md:py-24">
            <h2 className="font-display text-[26px] md:text-[34px] font-semibold text-navy mb-8">
              I am not for everyone. Here is who I am for.
            </h2>
            <div className="space-y-5 font-body text-text-primary text-base leading-relaxed">
              <p>
                If you want someone to just do it for you and hand you a binder, I am not your person.
                If you are looking for a magic tool or a quick fix, this is not it.
              </p>
              <p>
                This works for founders and operators who are willing to roll up their sleeves and do
                the work alongside me. Because that is how your team actually learns the skills. That is
                how the results stick after I am gone.
              </p>
              <p>
                I am not going to build something you become dependent on me to maintain. I am going to
                teach you and your team how to build it yourselves, with my guidance, my methodology,
                and a diagnostic platform that connects to your actual business data and shows us exactly
                where to focus.
              </p>
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
        <section className="bg-navy">
          <div className="mx-auto max-w-[600px] px-6 md:px-8 py-16 md:py-24 text-center">
            <h2 className="font-display text-[28px] md:text-[40px] font-semibold text-cream mb-5 leading-tight">
              Ready to talk about your revenue engine?
            </h2>
            <p className="font-body text-cream/80 text-lg mb-8 leading-relaxed">
              A free 45-minute discovery call. We look at where your business is, where you want it to
              be, and whether I can help you get there. No pitch. An honest conversation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center font-body font-semibold bg-amber text-white hover:bg-amber-light transition-colors duration-200 rounded-full px-8 py-4 text-base"
              >
                Book a Discovery Call
              </Link>
              <Link
                href="/scorecard"
                className="inline-flex items-center justify-center font-body font-semibold border border-cream/30 text-cream hover:bg-white/10 transition-colors duration-200 rounded-full px-8 py-4 text-base"
              >
                Take the Free Scorecard
              </Link>
            </div>

            <p className="font-body text-sm text-cream/50 mt-6">
              45 minutes · No obligation · HubSpot Solutions Partner
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
