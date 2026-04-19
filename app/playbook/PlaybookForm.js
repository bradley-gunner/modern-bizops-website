"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const PLAYBOOK_PDF_PATH = "/revenue-without-headcount-playbook.pdf";

export default function PlaybookForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/submit-playbook-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-[14px] border border-border p-8">
        <div className="bg-green-pale border border-green/20 rounded-[10px] p-4 mb-6">
          <p className="font-body text-green font-medium">
            {form.name ? `Thanks, ${form.name.split(" ")[0]}.` : "You're in."} Your playbook is ready.
          </p>
        </div>
        <p className="font-body text-text-mid mb-6">
          Click below to download the Revenue Without Headcount Playbook as a PDF.
        </p>
        <a
          href={PLAYBOOK_PDF_PATH}
          download
          className="inline-flex items-center justify-center font-body font-semibold bg-amber text-white hover:bg-amber-light transition-colors duration-200 rounded-full px-8 py-4 text-lg w-full text-center"
        >
          Download Playbook (PDF)
        </a>
        <p className="font-body text-sm text-text-light text-center mt-4">
          Check your inbox too. We may follow up with additional resources.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full border border-border rounded-[6px] px-4 py-3 font-body text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-navy-mid focus:border-transparent";

  return (
    <div className="bg-white rounded-[14px] border border-border p-8">
      <h3 className="font-display text-navy text-[22px] font-semibold mb-2">
        Get the Free Playbook
      </h3>
      <p className="font-body text-text-mid text-sm mb-6">
        Enter your details below and download instantly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-body font-medium text-text-primary mb-2">
            Full name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Sarah Kim"
            className={inputClass}
          />
        </div>

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
            placeholder="sarah@company.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block font-body font-medium text-text-primary mb-2">
            Company
          </label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            required
            placeholder="Acme Corp"
            className={inputClass}
          />
        </div>

        {error && (
          <div className="bg-red-pale border border-red/30 rounded-[8px] p-4">
            <p className="font-body text-red text-sm">{error}</p>
          </div>
        )}

        <Button type="submit" size="large" className="w-full" disabled={submitting}>
          {submitting ? "Submitting..." : "Download Free Playbook"}
        </Button>

        <p className="font-body text-xs text-text-light text-center">
          No spam. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
