"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import { trackFormSubmit } from "@/lib/analytics";
import { getUtms } from "@/lib/utm";

// ---------------------------------------------------------------------------
// Form option catalogues (kept in sync with the API route)
// ---------------------------------------------------------------------------

const ACQUISITION_CHANNELS = [
  "Inbound (SEO, content, organic search)",
  "Paid ads (Google, Meta, LinkedIn)",
  "Outbound sales (cold email, cold calling, LinkedIn outreach)",
  "Partnerships or channel",
  "Referrals and word of mouth",
  "Events, trade shows, or conferences",
  "Other",
];

const TECH_STACK = {
  crm: ["Salesforce", "HubSpot", "Pipedrive", "Close", "Airtable", "Spreadsheets", "None", "Other"],
  marketing: ["HubSpot", "ActiveCampaign", "Klaviyo", "Mailchimp", "Customer.io", "None", "Other"],
  support: ["Intercom", "Zendesk", "Front", "Email inbox", "None", "Other"],
  analytics: ["GA4", "Mixpanel", "PostHog", "Heap", "None", "Other"],
  bi: ["Looker", "Metabase", "Tableau", "Spreadsheets", "None", "Other"],
};

const DECISION_MAKER_OPTIONS = [
  "Just me",
  "Me and a co-founder or business partner",
  "Me and my leadership team",
  "Me and investors or board",
  "Me and my spouse or family",
  "Other",
];

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------

function SectionHeader({ num, title, subtitle }) {
  return (
    <div className="border-t border-border pt-10 mt-14 first:border-0 first:pt-0 first:mt-0">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="font-display text-amber text-2xl font-semibold">
          {num}
        </span>
        <h2 className="font-display text-navy text-[26px] md:text-[30px] font-semibold leading-tight">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="font-body text-text-mid text-base">{subtitle}</p>
      )}
    </div>
  );
}

function FieldLabel({ children, required, hint }) {
  return (
    <div className="mb-2">
      <label className="block font-body font-medium text-text-primary">
        {children}
        {!required && (
          <span className="font-normal text-text-light ml-2">(optional)</span>
        )}
      </label>
      {hint && (
        <p className="font-body text-sm text-text-light mt-1">{hint}</p>
      )}
    </div>
  );
}

const inputClass =
  "w-full border border-border rounded-[6px] px-4 py-3 font-body text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-navy-mid focus:border-transparent";

const textareaClass =
  "w-full border border-border rounded-[6px] px-4 py-3 font-body text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-navy-mid focus:border-transparent resize-none";

function TextSelect({ name, value, onChange, options, placeholder = "Select..." }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={inputClass}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

// ---------------------------------------------------------------------------
// Main form component
// ---------------------------------------------------------------------------

function PrepFormInner() {
  const params = useSearchParams();

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    // Section 1 — Business Today
    businessDescription: "",
    acquisitionChannels: [],
    bestFitChannel: "",
    avgDealSize: "",
    salesCycleDays: "",
    winRatePct: "",
    newCustomersPerMonth: "",
    // Section 2 — Team & Systems
    techStackCrm: "",
    techStackMarketing: "",
    techStackSupport: "",
    techStackAnalytics: "",
    techStackBi: "",
    revenueTeamStructure: "",
    externalHelpEngaged: "",
    // Section 3 — What You're Trying to Solve
    bookingTrigger: "",
    priorConsultantDetail: "",
    desiredOutcome: "",
    // Section 4 — About the Call
    decisionMakers: "",
    prepOther: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill email + first name from URL (HubSpot Meetings confirmation email
  // will link here with `?email={{contact.email}}&firstName={{contact.firstname}}`).
  useEffect(() => {
    const email = params.get("email") || "";
    const firstName = params.get("firstName") || "";
    setForm((f) => ({ ...f, email, firstName }));
  }, [params]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const toggleChannel = (channel) => {
    setForm((f) => {
      const has = f.acquisitionChannels.includes(channel);
      return {
        ...f,
        acquisitionChannels: has
          ? f.acquisitionChannels.filter((c) => c !== channel)
          : [...f.acquisitionChannels, channel],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.email) {
      setError(
        "We need your email to link these responses to your booked call. If you arrived here without the prep link, check the confirmation email."
      );
      return;
    }

    setSubmitting(true);
    trackFormSubmit("discovery_call_prep", {
      has_trigger: Boolean(form.bookingTrigger),
      has_outcome: Boolean(form.desiredOutcome),
    });

    try {
      const res = await fetch("/api/submit-prep-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, utms: getUtms() }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Submission failed");
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Something went wrong. Please try again, or just come to the call. Bradley will ask these questions live."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ----- Success state ------------------------------------------------------
  if (submitted) {
    return (
      <>
        <Header />
        <main className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-[640px] px-6 md:px-8">
            <div className="bg-green-pale border border-green/20 rounded-[12px] p-8 mb-8">
              <h1 className="font-display text-[32px] md:text-[40px] font-semibold text-navy mb-3">
                {form.firstName ? `Thanks, ${form.firstName}.` : "Thanks."}
              </h1>
              <p className="font-body text-text-primary text-lg leading-relaxed">
                Your responses are in. I&apos;ll review them before our call
                so we can spend the 45 minutes on the real conversation. Not
                on catching up.
              </p>
            </div>

            <div className="space-y-6 font-body text-text-mid">
              <div>
                <h2 className="font-display text-navy text-xl font-semibold mb-2">
                  What happens next
                </h2>
                <p>
                  You&apos;ll get a reminder the day before our call. Nothing
                  else to do on your end. Come as you are. No slides. No
                  reports.
                </p>
              </div>
              <div>
                <h2 className="font-display text-navy text-xl font-semibold mb-2">
                  Need to reschedule?
                </h2>
                <p>
                  The reschedule link is in your confirmation email. If you
                  can&apos;t find it, just email{" "}
                  <a
                    href="mailto:bradley@bradleydewet.com"
                    className="text-amber hover:underline"
                  >
                    bradley@bradleydewet.com
                  </a>
                  .
                </p>
              </div>
              <div>
                <h2 className="font-display text-navy text-xl font-semibold mb-2">
                  In the meantime
                </h2>
                <p>
                  If you want to see how I think about operational problems,
                  there&apos;s more on{" "}
                  <a
                    href="https://www.linkedin.com/in/bradleydewet"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber hover:underline"
                  >
                    LinkedIn
                  </a>
                  . Otherwise, talk soon.
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ----- Form state ---------------------------------------------------------
  return (
    <>
      <Header />
      <main className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[720px] px-6 md:px-8">
          {/* Intro */}
          <h1 className="font-display text-[32px] md:text-[42px] font-semibold text-navy mb-4 leading-tight">
            Pre-Call Prep
          </h1>
          <p className="font-body text-text-mid text-lg mb-2">
            {form.firstName && <>Hi {form.firstName}. </>}
            Eleven questions, about five minutes. These help me walk into our
            call with a real point of view on your business. So we spend the
            time on the conversation, not on me catching up.
          </p>
          <p className="font-body text-text-mid text-base mb-10">
            Be as specific as you can. If a question doesn&apos;t apply, or
            you don&apos;t know the answer, say so. &ldquo;I don&apos;t
            know&rdquo; is useful information too.
          </p>

          {!form.email && (
            <div className="bg-amber-pale border border-amber/30 rounded-[10px] p-4 mb-8">
              <p className="font-body text-text-primary text-sm">
                We couldn&apos;t detect your email from the link. Add it
                below so these responses attach to your booked call.
              </p>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="you@company.com"
                className={`${inputClass} mt-3`}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* =============================================================== */}
            {/* SECTION 1 — Your Business Today                                 */}
            {/* =============================================================== */}
            <SectionHeader
              num="01"
              title="Your Business Today"
              subtitle="A quick sketch of what you do and how you sell it."
            />

            <div>
              <FieldLabel required>
                In 2–3 sentences, what do you do, who do you sell to, and how
                do you sell it?
              </FieldLabel>
              <textarea
                name="businessDescription"
                value={form.businessDescription}
                onChange={handleChange}
                rows={3}
                required
                placeholder="Example: 'We're a logistics SaaS selling to mid-market trucking companies. Mostly outbound sales, 90-day cycle, sold through a 3-call process.'"
                className={textareaClass}
              />
            </div>

            <div>
              <FieldLabel required>How do customers find you today?</FieldLabel>
              <p className="font-body text-sm text-text-light mb-3">
                Select all that apply.
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {ACQUISITION_CHANNELS.map((channel) => (
                  <label
                    key={channel}
                    className="flex items-start gap-3 p-3 border border-border rounded-[6px] cursor-pointer hover:border-navy-mid transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={form.acquisitionChannels.includes(channel)}
                      onChange={() => toggleChannel(channel)}
                      className="mt-1 w-4 h-4 accent-navy"
                    />
                    <span className="font-body text-text-primary text-sm leading-snug">
                      {channel}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel required hint="Not the most. The best.">
                Which of these produces your best-fit customers?
              </FieldLabel>
              <input
                type="text"
                name="bestFitChannel"
                value={form.bestFitChannel}
                onChange={handleChange}
                placeholder="e.g., Referrals from accountants"
                className={inputClass}
              />
            </div>

            <div>
              <FieldLabel hint="Rough estimates are fine. 'Don't know' is a valid answer.">
                Roughly, what are your current numbers?
              </FieldLabel>
              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block font-body text-sm text-text-mid mb-1">
                    Average deal size (USD)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="avgDealSize"
                    value={form.avgDealSize}
                    onChange={handleChange}
                    placeholder="$25,000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block font-body text-sm text-text-mid mb-1">
                    Sales cycle (days)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="salesCycleDays"
                    value={form.salesCycleDays}
                    onChange={handleChange}
                    placeholder="60"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block font-body text-sm text-text-mid mb-1">
                    Win rate (%)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="winRatePct"
                    value={form.winRatePct}
                    onChange={handleChange}
                    placeholder="25"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block font-body text-sm text-text-mid mb-1">
                    New customers per month
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="newCustomersPerMonth"
                    value={form.newCustomersPerMonth}
                    onChange={handleChange}
                    placeholder="5"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* =============================================================== */}
            {/* SECTION 2 — Your Team and Systems                               */}
            {/* =============================================================== */}
            <SectionHeader
              num="02"
              title="Your Team and Systems"
              subtitle="Tells me what we'd actually be working with."
            />

            <div>
              <FieldLabel required hint="Pick the closest match. 'Other' is fine.">
                What tools does your team use today?
              </FieldLabel>
              <div className="space-y-4 mt-3">
                {[
                  ["CRM", "techStackCrm", TECH_STACK.crm],
                  ["Marketing automation or email", "techStackMarketing", TECH_STACK.marketing],
                  ["Customer support or success", "techStackSupport", TECH_STACK.support],
                  ["Web or product analytics", "techStackAnalytics", TECH_STACK.analytics],
                  ["BI or reporting", "techStackBi", TECH_STACK.bi],
                ].map(([label, name, options]) => (
                  <div key={name} className="grid sm:grid-cols-[180px_1fr] gap-3 items-center">
                    <span className="font-body text-sm text-text-mid">
                      {label}
                    </span>
                    <TextSelect
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      options={options}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel
                required
                hint="Who owns sales, marketing, customer success today? Where are the gaps?"
              >
                Who owns revenue-related functions? Give me the rough org.
              </FieldLabel>
              <textarea
                name="revenueTeamStructure"
                value={form.revenueTeamStructure}
                onChange={handleChange}
                rows={4}
                required
                placeholder="Example: 'I own sales and do most of the selling myself. One BDR. My co-founder owns marketing; we use a part-time agency for paid. No one owns CS yet.'"
                className={textareaClass}
              />
            </div>

            <div>
              <FieldLabel hint="Fractional leaders, agencies, contractors. Anyone helping with sales, marketing, or ops.">
                Are you currently working with any external help? If yes, what
                are they doing for you?
              </FieldLabel>
              <textarea
                name="externalHelpEngaged"
                value={form.externalHelpEngaged}
                onChange={handleChange}
                rows={3}
                placeholder="Optional"
                className={textareaClass}
              />
            </div>

            {/* =============================================================== */}
            {/* SECTION 3 — What You're Trying to Solve                         */}
            {/* =============================================================== */}
            <SectionHeader
              num="03"
              title="What You're Trying to Solve"
              subtitle="The heart of our call."
            />

            <div>
              <FieldLabel
                required
                hint="The specific moment or signal. 'Missed our Q1 number.' 'Lost a key rep.' 'Investor asked about our pipeline.' Whatever the real story is."
              >
                What actually triggered you to book this call, and why now,
                not six months ago?
              </FieldLabel>
              <textarea
                name="bookingTrigger"
                value={form.bookingTrigger}
                onChange={handleChange}
                rows={4}
                required
                placeholder=""
                className={textareaClass}
              />
            </div>

            <div>
              <FieldLabel hint="What was the best part of it? What got in the way of it sticking?">
                If you&apos;ve worked with a consultant or coach before on
                this, tell me more about that experience.
              </FieldLabel>
              <textarea
                name="priorConsultantDetail"
                value={form.priorConsultantDetail}
                onChange={handleChange}
                rows={3}
                placeholder="Optional"
                className={textareaClass}
              />
            </div>

            <div>
              <FieldLabel
                required
                hint="Specific is better than big. 'Close rate from 18% to 28%' is more useful than 'grow revenue.'"
              >
                If everything went well over the next 90 days, what would be
                different? If you could move one metric, what would it be?
              </FieldLabel>
              <textarea
                name="desiredOutcome"
                value={form.desiredOutcome}
                onChange={handleChange}
                rows={4}
                required
                className={textareaClass}
              />
            </div>

            {/* =============================================================== */}
            {/* SECTION 4 — About Our Call                                      */}
            {/* =============================================================== */}
            <SectionHeader
              num="04"
              title="About Our Call"
              subtitle="Two quick things so I arrive prepared."
            />

            <div>
              <FieldLabel required>
                Who else is involved in deciding whether to move forward with
                something like this?
              </FieldLabel>
              <TextSelect
                name="decisionMakers"
                value={form.decisionMakers}
                onChange={handleChange}
                options={DECISION_MAKER_OPTIONS}
              />
            </div>

            <div>
              <FieldLabel hint="Context, constraints, things you'd rather I hear from you than stumble into on the call.">
                Anything else I should know before we talk?
              </FieldLabel>
              <textarea
                name="prepOther"
                value={form.prepOther}
                onChange={handleChange}
                rows={3}
                placeholder="Optional"
                className={textareaClass}
              />
            </div>

            {/* ----- Submit ---------------------------------------------------- */}
            {error && (
              <div className="bg-red-pale border border-red/30 rounded-[8px] p-4">
                <p className="font-body text-red text-sm">{error}</p>
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <Button
                type="submit"
                size="large"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit prep responses"}
              </Button>
              <p className="font-body text-sm text-text-light text-center mt-4">
                Your responses go directly to Bradley. No list, no automated
                sequence. Just prep for our conversation.
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PrepForm() {
  return (
    <Suspense fallback={null}>
      <PrepFormInner />
    </Suspense>
  );
}
