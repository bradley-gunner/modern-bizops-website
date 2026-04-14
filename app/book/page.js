"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import HubSpotMeetingRedirect from "@/components/HubSpotMeetingRedirect";
import { trackFormSubmit } from "@/lib/analytics";

const revenueOptions = [
  "Under $1M",
  "$1M–$3M",
  "$3M–$5M",
  "$5M–$15M",
  "$15M+",
];

const teamSizeOptions = ["1–5", "6–15", "16–30", "30+"];

const FREE_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "icloud.com", "mail.com", "protonmail.com", "zoho.com", "yandex.com",
  "live.com", "msn.com", "me.com", "mac.com", "comcast.net",
  "verizon.net", "att.net", "sbcglobal.net", "cox.net", "charter.net",
];

function validateEmail(email) {
  if (!email) return "Email is required";
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return "Please enter a valid email address";
  if (FREE_EMAIL_DOMAINS.includes(domain)) {
    return "Please enter your work email — we use it to prepare for your call";
  }
  return null;
}

function validatePhone(phone) {
  if (!phone) return null; // optional field
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    return "Please enter a valid phone number";
  }
  return null;
}

function HubSpotCalendar({ email, firstName, lastName }) {
  const baseUrl =
    "https://meetings-na2.hubspot.com/bradley-de-wet/revops-coaching-discovery-call?embed=true";
  const params = new URLSearchParams();
  if (email) params.set("email", email);
  if (firstName) params.set("firstName", firstName);
  if (lastName) params.set("lastName", lastName);
  const dataSrc = params.toString()
    ? `${baseUrl}&${params.toString()}`
    : baseUrl;

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="meetings-iframe-container"
      data-src={dataSrc}
    ></div>
  );
}

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    revenue: "",
    teamSize: "",
    bottleneck: "",
    previousConsultant: "",
    previousConsultantDetails: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handleStepOne = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(form.email);
    const phoneError = validatePhone(form.phone);
    if (emailError || phoneError) {
      setErrors({ email: emailError, phone: phoneError });
      return;
    }
    trackFormSubmit("book_call_qualifying", {
      revenue: form.revenue,
      team_size: form.teamSize,
    });

    setSubmitting(true);

    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        console.error("Form submission failed:", await res.text());
      }
    } catch (err) {
      // Graceful degradation — still show the calendar even if API call fails
      console.error("Form submission error:", err);
    }

    setSubmitting(false);
    setStep(3);
  };

  const stepIndicator = (
    <div className="flex items-center justify-center gap-3 mb-10">
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
      <div className="w-8 h-px bg-border" />
      <div className={`flex items-center gap-2 ${step >= 3 ? "text-navy" : "text-text-light"}`}>
        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold font-body ${step >= 3 ? "bg-navy text-white" : "bg-cream-dark text-text-light"}`}>
          3
        </span>
        <span className="font-body text-sm hidden sm:inline">Pick a Time</span>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <main className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-[600px] px-6 md:px-8">
          <h1 className="font-display text-[32px] md:text-[42px] font-semibold text-navy mb-4">
            Let&apos;s Talk About Your Revenue Engine
          </h1>
          <p className="font-body text-text-mid text-lg mb-8">
            {step === 1 && "Answer a few quick questions so I can prepare for our conversation."}
            {step === 2 && "Great — now tell me how to reach you."}
            {step === 3 && "Last step — pick a time that works for you."}
          </p>

          {stepIndicator}

          {step === 1 && (
            <form onSubmit={handleStepOne} className="space-y-8">
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

              <Button type="submit" size="large" className="w-full">
                Continue
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-8">
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
                    placeholder="Marcus"
                    className="w-full border border-border rounded-[6px] px-4 py-3 font-body text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-navy-mid focus:border-transparent"
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
                    placeholder="Chen"
                    className="w-full border border-border rounded-[6px] px-4 py-3 font-body text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-navy-mid focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
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
                  placeholder="marcus@company.com"
                  className={`w-full border rounded-[6px] px-4 py-3 font-body text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-navy-mid focus:border-transparent ${errors.email ? "border-red-400" : "border-border"}`}
                />
                {errors.email && (
                  <p className="font-body text-sm text-red-500 mt-1.5">{errors.email}</p>
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
                  className={`w-full border rounded-[6px] px-4 py-3 font-body text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-navy-mid focus:border-transparent ${errors.phone ? "border-red-400" : "border-border"}`}
                />
                {errors.phone && (
                  <p className="font-body text-sm text-red-500 mt-1.5">{errors.phone}</p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center justify-center font-body font-semibold transition-colors duration-200 rounded-full text-navy-mid hover:text-navy underline underline-offset-4 px-6 py-4 text-lg"
                >
                  Back
                </button>
                <Button type="submit" size="large" className="flex-1" disabled={submitting}>
                  {submitting ? "Submitting..." : "Continue to Calendar"}
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div>
              <div className="bg-green-pale border border-green/20 rounded-[10px] p-4 mb-8">
                <p className="font-body text-green font-medium">
                  Thanks, {form.firstName}! Now pick a time that works for you.
                </p>
              </div>

              <HubSpotMeetingRedirect
                source="book"
                email={form.email}
                firstName={form.firstName}
              />
              <HubSpotCalendar
                email={form.email}
                firstName={form.firstName}
                lastName={form.lastName}
              />

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
