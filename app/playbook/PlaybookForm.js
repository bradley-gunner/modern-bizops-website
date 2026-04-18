"use client";

import { useState } from "react";

/*
 * HubSpot Forms API v3 endpoint.
 * HUBSPOT_PORTAL_ID and HUBSPOT_FORM_GUID are placeholders — replace with real
 * values from HubSpot > Marketing > Forms > [form name] > Embed Code.
 * The portal ID is the number in your HubSpot account URL:
 * app.hubspot.com/forms/{portalId}/...
 */
const HUBSPOT_PORTAL_ID = "YOUR_PORTAL_ID";
const HUBSPOT_FORM_GUID = "YOUR_FORM_GUID";
const PDF_URL = "/downloads/headcount-optimizer-playbook.pdf";

export default function PlaybookForm() {
  const [fields, setFields] = useState({ firstName: "", email: "", company: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: [
              { name: "firstname", value: fields.firstName },
              { name: "email", value: fields.email },
              { name: "company", value: fields.company },
            ],
            context: {
              pageUri: "https://modernbizops.com/playbook",
              pageName: "Headcount Optimizer Playbook",
            },
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Submission failed");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or email bradley@bradleydewet.com.");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-[16px] border border-border p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center mx-auto mb-4">
          <span className="text-cream text-xl font-bold">&#10003;</span>
        </div>
        <h3 className="font-display text-[22px] font-semibold text-navy mb-2">
          Your playbook is ready.
        </h3>
        <p className="font-body text-sm text-text-mid mb-6">
          A copy has also been sent to {fields.email}.
        </p>
        <a
          href={PDF_URL}
          download
          className="inline-flex items-center justify-center font-body font-semibold bg-amber text-white hover:bg-amber-light transition-colors duration-200 rounded-full px-8 py-3 text-base"
        >
          Download the Playbook
        </a>
      </div>
    );
  }

  return (
    <div id="download-form" className="bg-white rounded-[16px] border border-border p-7 shadow-sm">
      <p className="font-body text-sm font-semibold tracking-widest uppercase text-amber mb-1">
        Free Download
      </p>
      <h2 className="font-display text-[20px] md:text-[24px] font-semibold text-navy mb-5">
        Get the Playbook
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="font-body text-xs font-semibold text-text-mid uppercase tracking-wide block mb-1.5">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            value={fields.firstName}
            onChange={handleChange}
            placeholder="Jane"
            className="w-full font-body text-sm text-text-primary bg-cream border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition-colors"
          />
        </div>

        <div>
          <label htmlFor="email" className="font-body text-xs font-semibold text-text-mid uppercase tracking-wide block mb-1.5">
            Work Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={fields.email}
            onChange={handleChange}
            placeholder="jane@company.com"
            className="w-full font-body text-sm text-text-primary bg-cream border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition-colors"
          />
        </div>

        <div>
          <label htmlFor="company" className="font-body text-xs font-semibold text-text-mid uppercase tracking-wide block mb-1.5">
            Company Name
          </label>
          <input
            id="company"
            name="company"
            type="text"
            required
            autoComplete="organization"
            value={fields.company}
            onChange={handleChange}
            placeholder="Acme Inc."
            className="w-full font-body text-sm text-text-primary bg-cream border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition-colors"
          />
        </div>

        {status === "error" && (
          <p className="font-body text-sm text-red-600">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full font-body font-semibold bg-amber text-white hover:bg-amber-light disabled:opacity-60 transition-colors duration-200 rounded-full py-3.5 text-base mt-2"
        >
          {status === "loading" ? "Sending..." : "Send Me the Playbook"}
        </button>
      </form>

      <p className="font-body text-xs text-text-light mt-4 text-center">
        No spam. Unsubscribe at any time.
      </p>
    </div>
  );
}
