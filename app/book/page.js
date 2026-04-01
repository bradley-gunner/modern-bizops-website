"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";

const revenueOptions = [
  "Under $1M",
  "$1M–$3M",
  "$3M–$5M",
  "$5M–$15M",
  "$15M+",
];

const teamSizeOptions = ["1–5", "6–15", "16–30", "30+"];

export default function BookPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    revenue: "",
    teamSize: "",
    bottleneck: "",
    previousConsultant: "",
    previousConsultantDetails: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would submit to HubSpot Forms API
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-[600px] px-6 md:px-8">
          <h1 className="font-display text-[32px] md:text-[42px] font-semibold text-navy mb-4">
            Let&apos;s Talk About Your Revenue Engine
          </h1>
          <p className="font-body text-text-mid text-lg mb-10">
            Answer a few quick questions so I can prepare for our conversation.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Revenue */}
              <div>
                <label className="block font-body font-medium text-text-primary mb-2">
                  What&apos;s your company&apos;s annual revenue?
                </label>
                <select
                  name="revenue"
                  value={form.revenue}
                  onChange={handleChange}
                  required
                  className="w-full border border-border rounded-[6px] px-4 py-3 font-body text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-navy-mid focus:border-transparent"
                >
                  <option value="">Select...</option>
                  {revenueOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team size */}
              <div>
                <label className="block font-body font-medium text-text-primary mb-2">
                  How many people are on your sales and marketing team?
                </label>
                <select
                  name="teamSize"
                  value={form.teamSize}
                  onChange={handleChange}
                  required
                  className="w-full border border-border rounded-[6px] px-4 py-3 font-body text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-navy-mid focus:border-transparent"
                >
                  <option value="">Select...</option>
                  {teamSizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bottleneck */}
              <div>
                <label className="block font-body font-medium text-text-primary mb-2">
                  What&apos;s your #1 growth bottleneck right now?
                </label>
                <textarea
                  name="bottleneck"
                  value={form.bottleneck}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="In 2–3 sentences, tell me what's holding your growth back..."
                  className="w-full border border-border rounded-[6px] px-4 py-3 font-body text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-navy-mid focus:border-transparent resize-none"
                />
              </div>

              {/* Previous consultant */}
              <div>
                <label className="block font-body font-medium text-text-primary mb-2">
                  Have you worked with a consultant or coach on this before?
                </label>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="previousConsultant"
                      value="yes"
                      checked={form.previousConsultant === "yes"}
                      onChange={handleChange}
                      className="w-4 h-4 text-navy accent-navy"
                    />
                    <span className="font-body text-text-primary">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="previousConsultant"
                      value="no"
                      checked={form.previousConsultant === "no"}
                      onChange={handleChange}
                      className="w-4 h-4 text-navy accent-navy"
                    />
                    <span className="font-body text-text-primary">No</span>
                  </label>
                </div>
                {form.previousConsultant === "yes" && (
                  <textarea
                    name="previousConsultantDetails"
                    value={form.previousConsultantDetails}
                    onChange={handleChange}
                    rows={2}
                    placeholder="What was the experience like? (optional)"
                    className="w-full border border-border rounded-[6px] px-4 py-3 font-body text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-navy-mid focus:border-transparent resize-none"
                  />
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block font-body font-medium text-text-primary mb-1">
                  Phone number{" "}
                  <span className="font-normal text-text-light">(optional)</span>
                </label>
                <p className="font-body text-sm text-text-light mb-2">
                  We&apos;ll text you a confirmation and prep guide.
                </p>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full border border-border rounded-[6px] px-4 py-3 font-body text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-navy-mid focus:border-transparent"
                />
              </div>

              <Button type="submit" size="large" className="w-full">
                Continue to Calendar
              </Button>
            </form>
          ) : (
            /* Post-form: Calendar embed placeholder */
            <div>
              <div className="bg-green-pale border border-green/20 rounded-[10px] p-4 mb-8">
                <p className="font-body text-green font-medium">
                  Thanks! Now pick a time that works for you.
                </p>
              </div>

              <div className="bg-cream border border-border rounded-[14px] p-8 md:p-12">
                <div className="text-center">
                  <svg
                    className="mx-auto h-16 w-16 text-text-light mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                  <p className="font-body text-text-mid font-medium mb-2">
                    HubSpot Meetings Calendar
                  </p>
                  <p className="font-body text-sm text-text-light">
                    Replace this placeholder with your HubSpot Meetings embed
                  </p>
                </div>
              </div>

              <p className="font-body text-sm text-text-mid text-center mt-6">
                What to expect: A 45-minute conversation about where your
                business is now and where it could be. Come as you are — no prep
                required.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
