import { LADDER, AUDIT_TERMS } from "./offers";

const rung = Object.fromEntries(LADDER.map((r) => [r.id, r]));

/**
 * The homepage FAQ, section 8 of the modal anatomy.
 *
 * SINGLE SOURCE OF TRUTH. This array feeds both the rendered accordion
 * (components/home/HomeFaq.jsx) and the FAQPage JSON-LD (getFAQSchema in
 * app/schema.js). Google requires FAQPage structured data to match the FAQs a
 * visitor can actually see, and the previous version of getFAQSchema drifted
 * from the visible list because the two were written in different files. They
 * cannot drift now, and __tests__/home/faq.test.js fails if they do.
 *
 * Five of these are the objection preempts from the buyer research, in the
 * order a buyer meets them: what it costs, whether the diagnostic is money
 * burned, whether their mess disqualifies them, whether it will work at all,
 * whether it replaces the team, whether it traps them, and whether they should
 * just hire instead.
 *
 * Every price interpolates from lib/offers.js, and so does every commercial
 * term: the credit, the window it holds for, and what it credits toward all
 * come from AUDIT_TERMS. Never type a number in here.
 */
export const HOME_FAQ = [
  {
    q: "What does this cost?",
    a: `The Scan is free. The Audit is ${rung.audit.price} and it credits ${AUDIT_TERMS.creditPercent} toward whatever you build next. Builds run ${rung.builds.price} at a fixed price, set before the work starts. The Partner retainer is ${rung.partner.price}, or ${rung["partner-plus"].price} once the automation runs across more than one function. Every one of those numbers is published before you talk to anybody.`,
  },
  {
    q: `Is the ${rung.audit.price} audit money I lose if I stop there?`,
    a: `No. It credits ${AUDIT_TERMS.creditPercent} toward ${AUDIT_TERMS.creditTarget}, as long as you start within ${AUDIT_TERMS.creditWindow}. You also keep the heat map and the automation map either way. It is only sunk if you do nothing with it.`,
  },
  {
    q: "What if our CRM is a mess?",
    a: "That is the normal starting point, and it is exactly what the audit is for. The audit prices the cleanup as its own line, so you can see what the repair costs before you agree to any of it. Nobody has to tidy the CRM up before booking a call.",
  },
  {
    q: "We tried AI once and it did not work.",
    a: "Good. You are the buyer this was designed for. Ask what will not work here and you get the answer before you pay for it. If your foundation cannot carry the thing you want, the audit says so, in writing.",
  },
  {
    q: "Is this about replacing my team with AI?",
    a: "No. It is capacity for the team you have. Every build has a named owner on your side, and we do not start one without that name. Automation nobody owns stops firing, and it can be a month before anyone notices.",
  },
  {
    q: "How do I avoid getting locked in?",
    a: "Fixed scope, your systems, your data, and the runbooks handed over when the build ships. You leaving is written into the scope document on day one. When it is done, you do not need us.",
  },
  {
    q: "Why not just hire someone to do this in-house?",
    a: "Hire when the work outgrows the menu. That is the honest answer. Under 1 percent of companies your size have this seat filled today, and the ladder costs a fraction of the salary. When you do hire, the runbooks we leave behind are what that person starts from.",
  },
];
