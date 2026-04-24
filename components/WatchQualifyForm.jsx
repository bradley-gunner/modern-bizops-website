"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import PrepCTACard from "@/components/PrepCTACard";
import { trackFormSubmit } from "@/lib/analytics";

const revenueOptions = [
  "Under $1M",
  "$1M\u20133M",
  "$3M\u20135M",
  "$5M\u201315M",
  "$15M+",
];

const teamSizeOptions = ["1\u20135", "6\u201315", "16\u201330", "30+"];

const FREE_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "icloud.com", "mail.com", "protonmail.com", "zoho.com", "yandex.com",
  "live.com", "msn.com", "me.com", "mac.com", "comcast.net",
  "verizon.net", "att.net", "sbcglobal.net", "cox.net", "charter.net",
];

function validateWorkEmail(email) {
  if (!email) return "Email is required";
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return "Please enter a valid email address";
  if (FREE_EMAIL_DOMAINS.includes(domain)) {
    return "Please enter your work email. We use it to prepare for your call.";
  }
  return null;
}

/**
 * Two-step qualifying form shown on the thank-you page for /watch bookers.
 * Mirrors the /book page qualifying fields. After submission, reveals the
 * prep questionnaire CTA so the user sees one thing at a time.
 */
export default function WatchQualifyForm({ email: initialEmail = "", firstName: initialFirstName = "" }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    firstName: initialFirstName,
    lastName: "",
    email: initialEmail,
    revenue: "",
    teamSize: "",
    bottleneck: "",
    previousConsultant: "",
    previousConsultantDetails: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleStepOne = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate work email if we need them to enter it
    if (!initialEmail) {
      const emailError = validateWorkEmail(form.email);
      if (emailError) {
        setErrors({ email: emailError });
        return;
      }
    }

    setSubmitting(true);

    // Fire the form-engagement event on submit. The `generate_lead`
    // conversion already fires via TrackConversion on the thank-you page
    // when the user lands here, so this is just the form signal.
    trackFormSubmit("watch_qualify", {
      revenue: form.revenue,
      team_size: form.teamSize,
      previous_consultant: form.previousConsultant,
    });

    try {
      const res = await fetch("/api/qualify-watch-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        console.error("Qualify form submission failed:", await res.text());
      }
    } catch (err) {
      console.error("Qualify form submission error:", err);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  // After submission: show success + prep CTA
  if (submitted) {
    return (
      <div>
        <div className="bg-green-pale border border-green/20 rounded-[14px] p-6 mb-8">
          <div className="flex items-start gap-3">
            <svg
              className="h-6 w-6 text-green mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            <div>
              <p className="font-display text-lg font-semibold text-navy">
                Thanks{form.firstName ? `, ${form.firstName}` : ""}!
              </p>
              <p className="font-body text-text-mid mt-1">
                That helps me walk into our call with real context on your business.
              </p>
            </div>
          </div>
        </div>

        <PrepCTACard email={form.email || initialEmail} firstName={form.firstName || initialFirstName} />
      </div>
    );
  }

  const inputClasses = "w-full border border-border rounded-[6px] px-4 py-3 font-body text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-navy-mid focus:border-transparent";
  const inputErrorClasses = "w-full border border-red-400 rounded-[6px] px-4 py-3 font-body text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-navy-mid focus:border-transparent";

  const stepIndicator = (
    <div className="flex items-center justify-center gap-3 mb-8">
      <div className={`flex items-center gap-2 ${step >= 1 ? "text-navy" : "text-text-light"}`}>
        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold font-body ${step >= 1 ? "bg-navy text-white" : "bg-cream-dark text-text-light"}`}>
          1
        </span>
        <span className="font-body text-sm hidden sm:inline">Your Business</span>
      </div>
      <div className="w-8 h-px bg-border" />
      <div className={`flex items-center gap-2 ${step >= 2 ? "text-navy" : "text-text-light"}`}>
        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold font-body ${step >= 2 ? "bg-navy text-white" : "bg-cream-dark text-text-light"}`}>
          2
        </span>
        <span className="font-body text-sm hidden sm:inline">Your Details</span>
      </div>
    </div>
  );

  return (
    <div className="bg-cream rounded-[14px] p-6 md:p-8 mb-8">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 bg-amber rounded-full flex items-center justify-center shrink-0">
          <span className="font-display text-white text-base font-semibold">
            ★
          </span>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy mb-2">
            Help me tailor your call
          </h2>
          <p className="font-body text-text-mid mb-6">
            A few quick questions so I come prepared with insights specific to
            your business. Takes about 2 minutes.
          </p>
        </div>
      </div>

      {stepIndicator}

      {step === 1 && (
        <form onSubmit={handleStepOne} className="space-y-6">
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
              className={inputClasses}
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
              className={inputClasses}
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
              placeholder="In 2\u20133 sentences, tell me what\u2019s holding your growth back..."
              className={`${inputClasses} resize-none`}
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
                className={`${inputClasses} resize-none`}
              />
            )}
          </div>

          <Button type="submit" size="default" className="w-full">
            Continue
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-body font-medium text-text-primary mb-2">
                First name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
                placeholder="Marcus"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block font-body font-medium text-text-primary mb-2">
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                autoComplete="family-name"
                placeholder="Chen"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Email — only show if we didn't get it from the booking */}
          {!initialEmail && (
            <div>
              <label className="block font-body font-medium text-text-primary mb-2">
                Work email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="marcus@company.com"
                className={errors.email ? inputErrorClasses : inputClasses}
              />
              {errors.email && (
                <p className="font-body text-sm text-red-500 mt-1.5">
                  {errors.email}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center justify-center font-body font-semibold transition-colors duration-200 rounded-full text-navy-mid hover:text-navy underline underline-offset-4 px-6 py-3.5 text-base"
            >
              Back
            </button>
            <Button
              type="submit"
              size="default"
              className="flex-1"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
