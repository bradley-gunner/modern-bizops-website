/**
 * Voice and copy templates for the AI Revenue Scan result.
 *
 * Voice rules (strict):
 *   - First-person plural Modern BizOps ("we", "you"). No "I/my/me" in
 *     client-facing copy. Answer OPTION labels in questions.js are the
 *     respondent's voice and are exempt; nothing here touches them.
 *   - No em-dashes and no contractions (this content reaches the email and
 *     PDF paths).
 *   - Loss framing on every dollar line. Source citation on every benchmark.
 *
 * THE CLAIM BOUNDARY (doc 15 Part 3, binding on every string in this file):
 * scores are "self-reported plus observed from your public surfaces," never
 * "computed from your systems." Connection language belongs to the audit
 * alone. Never state a competency count; where the idea is needed, say "the
 * certified framework." Every verdict states its basis, and "ready" is always
 * "as far as we can see." Bands are provisional by design and are never
 * presented as calibrated.
 *
 * INVERTED 2026-08-12: sanitizeVoice() used to throw on the plural and now
 * throws on the singular; see git history for the full story.
 *
 * sanitizeVoice() runs as a defense-in-depth check at template definition
 * time so a regression in this file fails the test suite immediately.
 */

import { LADDER, AUDIT_TERMS, FOUNDING_TERMS } from '../offers';

/** The paid next rung the results screen bridges to. Name and price come from
 *  the ladder so this copy can never quote a stale number. */
const AUDIT = LADDER.find((rung) => rung.id === 'audit');

export function sanitizeVoice(s) {
  if (typeof s !== 'string') return s;
  if (/—/.test(s)) {
    throw new Error(`Voice violation: em-dash in copy: ${s}`);
  }
  // "I" is case-sensitive so the bare letter i cannot trip a template; the
  // possessive and object forms are case-insensitive because they open
  // sentences. Matches "I'm" and "I've" through the word boundary.
  if (/\bI\b/.test(s) || /\b(my|me|mine|myself)\b/i.test(s)) {
    throw new Error(`Voice violation: first-person singular in copy: ${s}`);
  }
  return s;
}

export const SECTION_LABELS = {
  1: 'About your business',
  2: 'Your AI readiness',
  3: 'Your numbers',
};

export const SECTION_SUBLINES = {
  1: sanitizeVoice('Three questions so we know who we are comparing you to.'),
  2: sanitizeVoice('Now the diagnostic. Ten questions about whether AI can run on your business.'),
  3: sanitizeVoice('Three numbers about your business so we can put dollars on the gaps. A band is enough, and where you know the exact figure you can give us that instead.'),
};

/* ------------------------------------------------------------------ */
/* Section 1 of the result: the readiness band headline               */
/* ------------------------------------------------------------------ */

export const BAND_EYEBROW = sanitizeVoice('Your AI readiness');

/**
 * Scores always render to one decimal. Without this, a whole number prints as
 * "2" beside its neighbours' "1.7" and "2.3", which reads as a rounded
 * impression on a page whose whole argument is that it did real arithmetic.
 */
export function formatScore(n) {
  return Number.isFinite(n) ? n.toFixed(1) : '0.0';
}

/** The self-reported marker, rendered directly under the band headline.
 *  {composite} is the 1-decimal composite of the nine dimension questions. */
export function bandMarker(composite) {
  return sanitizeVoice(
    `Scored ${formatScore(composite)} out of 5, based on what you told us about yourself.`
  );
}

/**
 * One descriptor per band. Deliberately uneven in length and rhythm; see the
 * FIRST_MOVES comment below for why that unevenness is load-bearing. None of
 * these presents the band as calibrated, because it is not.
 */
export const BAND_DESCRIPTORS = {
  ready_to_build: sanitizeVoice(
    'What you told us describes a business AI can run on: someone owns it, rollouts stick, and rules exist for what it may touch. The work now is picking the first system and holding the bar you already set.'
  ),
  ready_in_parts: sanitizeVoice(
    'Parts of your business are ready for AI today, and parts would quietly kill it. That mix is normal at your size. The dimension bars below show which side each piece is on, and the map under them puts dollars on what waiting costs.'
  ),
  foundations_first: sanitizeVoice(
    'You could buy a tool tomorrow and it would probably meet the same end most do: quietly abandoned by week three. Not because AI does not work, but because the conditions that hold a tool in place are not there yet. Fix two or three foundations and the same tool sticks.'
  ),
  not_ready_yet: sanitizeVoice(
    'Buying AI tools now would waste the money. That is not a verdict on your business; it is a sequencing call. The foundations below are all fixable, most without spending anything, and the first move near the bottom of this page is where we would start.'
  ),
};

/* ------------------------------------------------------------------ */
/* Section 2: why it did not stick (burned-attempt flag only)         */
/* ------------------------------------------------------------------ */

/**
 * Respondent-evidence phrases for the weakest signals, composed into the
 * opening sentence of the why-it-did-not-stick block. Keyed by question id;
 * q8 differs by score because "nobody owns it" and "the founder owns it on
 * top of everything" are different diagnoses. Questions without an entry
 * (q5 is the trigger itself, q13 is comfort rather than a failure condition)
 * never appear as reasons.
 */
const REASON_PHRASES = {
  q6: () => 'that nothing written down decides which tools get bought or killed',
  q7: () => 'that no business number was ever attached to the effort',
  q8: (score) =>
    score <= 1
      ? 'that nobody owns AI and automation'
      : 'that AI and automation sit on top of your own full plate',
  q9: () => 'that your last rollout faded once the pushing stopped',
  q10: () => 'that most of the team would ignore a new tool',
  q11: () => 'that nobody has written down what data a tool may touch',
  q12: () => 'that nothing would catch an AI mistake before a customer saw it',
};

/**
 * The burned buyer's section, and for that respondent the most valuable thing
 * on the page. Reasons rather than scores, in their own evidence, never smug.
 * This is an authored template set (the FIX_PARAGRAPHS class), not generated
 * text: the reasons are authored phrases and the diagnosis is a fixed close.
 */
export function whyItDidNotStick(weakSignals) {
  const phrases = (weakSignals || [])
    .map((s) => REASON_PHRASES[s.id]?.(s.score))
    .filter(Boolean)
    .slice(0, 3);

  if (phrases.length === 0) {
    // The burned attempt with no visible failure condition: the honest read
    // is that the Scan cannot see why, and saying so is the trust move.
    return sanitizeVoice(
      'Your answers do not show the usual conditions that kill a tool: someone owns this, your rollouts stick, and rules exist for what AI may touch. When a tool dies inside a business like that, the cause is usually the tool itself: wrong problem, or a workflow that never changed around it. From out here we cannot see which one it was. That is exactly the call the audit exists to make, because it reads the workflow instead of asking about it.'
    );
  }

  const joined =
    phrases.length === 1
      ? phrases[0]
      : phrases.length === 2
        ? `${phrases[0]}, and ${phrases[1]}`
        : `${phrases[0]}, ${phrases[1]}, and ${phrases[2]}`;

  return sanitizeVoice(
    `You told us ${joined}. That is not an AI problem. Tools installed on top of those conditions fail on roughly the same schedule every time. Yours did not fail because AI does not work for businesses like yours; it failed because nothing existed to hold it in place. The conditions are fixable, and the dimensions below show where to start.`
  );
}

/* ------------------------------------------------------------------ */
/* Section 3: the belief contrast (q4 played back)                    */
/* ------------------------------------------------------------------ */

export function beliefContrast(score) {
  if (score >= 4) {
    return sanitizeVoice(
      `You rated your CRM data ${score} out of 5. That is a belief. Data Readiness is a number the audit computes from your actual records. When confidence and the computed score disagree, the gap is usually expensive.`
    );
  }
  if (score === 3) {
    return sanitizeVoice(
      'You rated your CRM data 3 out of 5. Somewhat confident is where most founders honestly sit, and it is not a number anyone can build automation on. Data Readiness is a number the audit computes from your actual records. It replaces the shrug with a figure.'
    );
  }
  return sanitizeVoice(
    `You rated your CRM data ${score} out of 5. Low confidence is itself a finding: you already suspect the records could not carry an AI tool. Data Readiness is a number the audit computes from your actual records, so the suspicion becomes a figure and the figure becomes a work list.`
  );
}

/* ------------------------------------------------------------------ */
/* Section 4: observed from your public surfaces                      */
/* ------------------------------------------------------------------ */

export const OBSERVED_MARKER = sanitizeVoice('Observed from your public surfaces');

export const OBSERVED_BOUNDARY = sanitizeVoice(
  'Observed is not connected. These lines are what your public surfaces show, not what your systems record.'
);

export const OBSERVED_UNREACHABLE = sanitizeVoice(
  'We could not read your site in time. Slow, blocked, and script-heavy sites defeat an outside read, so this says nothing about your business. The audit does not have this problem, because it connects instead of looking.'
);

/**
 * One authored verdict line per observed signal state. The DKIM caveat is
 * binding copy law here: SPF and DMARC live at known DNS names and are spoken
 * to definitively; DKIM is mentioned only when a common-selector probe found
 * it, and its absence is NEVER reported, because absence of evidence is not a
 * missing record.
 */
export const OBSERVED_LINES = {
  analyticsPresent: (names) =>
    sanitizeVoice(
      `Your site carries ${names}. Whatever you automate can prove what it changed, which is rarer than it sounds.`
    ),
  analyticsAbsent: sanitizeVoice(
    'We could not find an analytics tag in your page source. Anything you automate would be flying blind: without measurement, nobody can say what the automation changed.'
  ),
  emailAuthOk: (dkimFound) =>
    sanitizeVoice(
      `Your sending domain carries SPF and DMARC records${dkimFound ? ', and a DKIM key we could find' : ''}. Outbound automation would send on solid ground.`
    ),
  emailAuthMissing: (missingList) =>
    sanitizeVoice(
      `Your DNS says your sending domain is not fully authenticated (${missingList}). Any outbound automation would build on sand.`
    ),
  schemaPresent: (types) =>
    sanitizeVoice(
      `Your pages carry schema markup (${types}). Search and answer engines can read what your business is without guessing.`
    ),
  schemaAbsent: sanitizeVoice(
    'No schema markup in your page source. Search and answer engines are left to guess what your business is, and they guess conservatively.'
  ),
  freshnessRecent: (dateStr) =>
    sanitizeVoice(
      `The newest published date we could find on your content is ${dateStr}. Your content estate reads as live.`
    ),
  freshnessStale: (dateStr, monthsAgo) =>
    sanitizeVoice(
      `The newest published date we could find on your content is ${dateStr}, about ${monthsAgo} months ago. A stale estate tells buyers and crawlers the same thing: stop checking back.`
    ),
  adPixelsPresent: (names) =>
    sanitizeVoice(
      `Your page carries ${names}. Those tags exist to measure ad audiences, so paid acquisition is either running or was set up to run. What the spend brings back is a connected question.`
    ),
  // Rendered only when no ad pixels AND no tag manager were found: a tag
  // manager can inject pixels the raw page source does not show, and we never
  // claim an absence we cannot see.
  adPixelsAbsent: sanitizeVoice(
    'No ad platform tags in your page source. If you are buying traffic anywhere, nothing on the site is measuring it or building an audience from it.'
  ),
  socialPresence: (platforms) =>
    sanitizeVoice(
      `${platforms} are linked from your site. Posting rhythm is not readable from out here; reading it is part of the audit.`
    ),
};

/* ------------------------------------------------------------------ */
/* Section 5: the three askable dimensions                            */
/* ------------------------------------------------------------------ */

export const LEVEL_WORDS = {
  1: 'Absent',
  2: 'Informal',
  3: 'Functional',
  4: 'Managed',
  5: 'Optimized',
};

/**
 * One line of read per dimension, keyed by the rounded level bucketed into
 * weak (1..2), middle (3), strong (4..5). Nine authored lines, deliberately
 * uneven.
 */
const DIMENSION_READS = {
  strategy: {
    weak: sanitizeVoice('AI is not attached to anything yet: no named workflow, no number it is supposed to move. This is the cheapest dimension to fix, because it is a decision, not a purchase.'),
    middle: sanitizeVoice('There is real activity here, but it runs on individual initiative rather than on decisions. The gap between a 3 and a 4 is writing down what the effort is for and who calls it.'),
    strong: sanitizeVoice('AI has a job description in your business: named workflows, a number, a way to kill what does not earn its keep.'),
  },
  people: {
    weak: sanitizeVoice('This is where tools go to die. Nobody with protected time owns the rollout, and the last one faded. Fix ownership before spending another dollar on software.'),
    middle: sanitizeVoice('Adoption happens here when someone pushes, and stops when they stop. A named owner with protected time is the difference, and it usually costs a calendar change, not a hire.'),
    strong: sanitizeVoice('Rollouts stick in your business. That is the strongest signal in this Scan that an automation would still be running six months after it ships.'),
  },
  governance: {
    weak: sanitizeVoice('Nothing currently decides what AI may touch, and nothing would catch it being wrong. Every automation you add multiplies that exposure. One written page and one review step change the math.'),
    middle: sanitizeVoice('Rules exist, mostly informally. Informal rules govern the people who already agree with them. Writing them down is what makes them govern the tool.'),
    strong: sanitizeVoice('Written rules, real review. You can extend AI further with confidence, because when it is wrong, you will know before the customer does.'),
  },
};

export function dimensionRead(key, level) {
  const bucket = level <= 2 ? 'weak' : level === 3 ? 'middle' : 'strong';
  return DIMENSION_READS[key]?.[bucket] || '';
}

export const SELF_REPORTED_MARKER = sanitizeVoice('Self-reported');

/* ------------------------------------------------------------------ */
/* Section 6: the opportunity map                                     */
/* ------------------------------------------------------------------ */

/** The Builds-menu areas the dollar lines attach to, in menu language, so the
 *  Scan and the menu speak the same nouns (doc 10). */
export const AREA_TITLES = {
  followupPipeline: 'Follow-up and pipeline automation',
  busywork: 'Busywork automation',
  onboardingCs: 'Onboarding and customer-success automation',
  deadLead: 'Dead-lead reactivation',
  speedToLead: 'Speed to lead',
  invoiceCollection: 'Invoice collection',
};

export const COMPARISON_COPY = {
  salesCycle:         { meets: 'at or faster than peer', partial: 'slower than peer median', fails: 'slower than peer' },
  retention:          { meets: 'at or above peer',       partial: 'below peer median',        fails: 'below peer' },
  revenuePerEmployee: { meets: 'at or above peer',       partial: 'below peer median',        fails: 'below peer' },
  leadResponse:       { meets: 'at or faster than peer', partial: 'slower than peer median', fails: 'slower than peer' },
};

const ROI_TITLES = {
  revenuePerEmployee: 'Revenue per employee gap',
  salesCycle:         'Sales cycle compression',
  retention:          'Retention gap',
  leadResponse:       'Lead response peer gap',
};

export function bandTitle(key) {
  return ROI_TITLES[key] || key;
}

export const OPPORTUNITY_INTRO = sanitizeVoice(
  'Each dollar figure is the gap between your own inputs and the cited peer benchmark, loss-framed because that is what it is. The verdict on each row says whether you could start now, based only on what we can see from out here.'
);

export const VERDICT_LABELS = {
  ready: 'Ready, as far as we can see',
  blocked: 'Not yet',
  audit: 'The audit computes this',
};

/** A row that surfaced no dollar gap still renders, with its verdict; the
 *  no-gap variant of the page must never be empty. */
export const NO_GAP_ROW_LINE = sanitizeVoice(
  'Your inputs hold up against the peer benchmark here, so there is no defensible dollar line to put on it. The verdict still tells you whether you could automate this today.'
);

export const NOT_TRACKED_ROW_LINE = sanitizeVoice(
  'You told us you do not track this number, so we will not invent one. The benchmark below is what peers run at; the audit computes your side of the comparison from your own records.'
);

export const NO_GAP_HEADLINE = {
  lead: sanitizeVoice('Your numbers hold up against {model_label} peers.'),
  subline: sanitizeVoice('No defensible dollar gap from your inputs. The verdicts below still tell you which automations you could start on now, and the audit computes the picture the numbers cannot show.'),
};

/** The speed-to-lead row computes nothing and says so: we do not ask response
 *  time because almost nobody knows it. `fmtResponseDays` renders the
 *  benchmark median honestly (hours under a day). */
export function fmtResponseDays(days) {
  if (!Number.isFinite(days)) return '';
  if (days < 1) {
    const hours = Math.max(1, Math.round(days * 24));
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }
  const rounded = Math.round(days);
  return rounded === 1 ? '1 day' : `${rounded} days`;
}

/**
 * The sales-cycle row states its gap in days and hands the dollar figure to
 * the audit. It used to compute one, from `(clientDays / peerMedian - 1) *
 * revenue`, which is a throughput model: it asserts that annual revenue scales
 * linearly with how fast the pipeline turns over. On a 240-day cycle against a
 * 103-day median that claimed revenue would be 2.33x higher, i.e. $13.3M of
 * "uncaptured revenue" on a $10M business, and the per-line and aggregate caps
 * existed largely to hide it.
 *
 * The model is wrong, not merely large. Cycle length does not govern annual
 * revenue; lead supply, capacity and demand do. A shorter cycle pulls revenue
 * forward and loses fewer deals to decay, and what THAT is worth depends on
 * deal volume and win rates, which this instrument does not ask for and cannot
 * responsibly guess. So the row says what it knows and stops.
 * (Corrected 2026-08-14 on Bradley's read: fix the logic, do not cap around it.)
 */
export function salesCycleBody(clientDisplay, medianDisplay, modelLabel) {
  return sanitizeVoice(
    `Your sales cycle runs about ${clientDisplay} against a ${medianDisplay} median for ${modelLabel} peers. A cycle that long costs you in two ways that are both real: deals decay while they wait, and revenue you have effectively already won lands months later than it could. We are not going to put a dollar figure on that from out here, because what it is worth depends on how many deals are in flight and what share of them die in the gap. That is a count, not an estimate, and the audit takes it from your CRM.`
  );
}

export function speedToLeadBody(modelLabel, medianDisplay) {
  return sanitizeVoice(
    `We did not ask your lead response time, because almost nobody knows it without measuring. The published market data says typical ${modelLabel} peers take about ${medianDisplay} to answer a new lead, and the vendor who replies in minutes tends to get the first conversation. What your response time actually is, and what closing the gap is worth at your deal size, the audit computes from your CRM timestamps.`
  );
}

/** The two menu areas with no computed dollar line and no published benchmark
 *  we could honestly cite: they state the leak in market-evidence language,
 *  use the respondent's own inputs where one exists, and hand the count to
 *  the audit. Added 2026-08-14 when Bradley asked for a menu-shaped map. */
export function deadLeadBody(dealDisplay, dealProvenance) {
  return sanitizeVoice(
    `Somewhere in your CRM sit the leads you already paid for that nobody is working. Among the builds, reactivation tends to pay for itself first, because the acquisition cost is already spent and one recovered deal at your ${dealDisplay} average (${dealProvenance}) covers real ground. How many leads sit dormant, and what a systematic re-work of that pool is worth, the audit counts from your CRM.`
  );
}

export const DEAD_LEAD_BODY_GENERIC = sanitizeVoice(
  'Somewhere in your CRM sit the leads you already paid for that nobody is working. Among the builds, reactivation tends to pay for itself first, because the acquisition cost is already spent. How many leads sit dormant, and what a systematic re-work of that pool is worth, the audit counts from your CRM.'
);

export const INVOICE_COLLECTION_BODY = sanitizeVoice(
  'Won revenue is not revenue until it is collected. Invoices that chase themselves close the gap between closed and banked, and the chase costs nobody on your team an hour. Whether your gap is days or months is sitting in your invoicing tool, and the audit reads it from there.'
);

/* ------------------------------------------------------------------ */
/* The shown-arithmetic line under every computed dollar row          */
/* ------------------------------------------------------------------ */

/** How an input entered the math, said in plain sight so the figure earns
 *  trust by showing its work (Bradley, 2026-08-14, "Both"). */
export function provenancePhrase(exact) {
  return exact ? 'your exact figure' : 'the middle of the band you picked';
}

export const MATH_LINES = {
  revenuePerEmployee: ({ revenueDisplay, revenueProv, teamDisplay, teamProv, rpeDisplay, medianDisplay }) =>
    sanitizeVoice(
      `The math: ${revenueDisplay} annual revenue (${revenueProv}) across ${teamDisplay} people (${teamProv}) is ${rpeDisplay} per employee, against the ${medianDisplay} peer median. The gap times your headcount is the dollar line.`
    ),
  retention: ({ grrDisplay, churnProv, medianDisplay, revenueDisplay, revenueProv }) =>
    sanitizeVoice(
      `The math: your ${grrDisplay} gross retention (${churnProv}) against the ${medianDisplay} peer median, applied to your ${revenueDisplay} revenue (${revenueProv}). The dollar line is the revenue that gap gives up each year.`
    ),
};

export const CAP_NOTE = sanitizeVoice(
  'The figure shown is capped so the claim can never exceed what your revenue could support.'
);

/* ------------------------------------------------------------------ */
/* Section 7: the first move, given away                              */
/* ------------------------------------------------------------------ */

/**
 * THE PARAGRAPHS BELOW ARE DELIBERATELY UNEVEN, same convention as the
 * FIX_PARAGRAPHS block further down: different lengths, different rhythms,
 * each closing on a mechanic or a timeframe a reader could check. If a future
 * pass is tempted to "tidy" these into a consistent shape: that IS the bug.
 *
 * Six authored prescriptions, selected by the weakest askable dimension and
 * the lowest-scoring question inside it (see pickFirstMoveKey). The give-away
 * is deliberate: the ones who want it done buy anyway, and the ones who do it
 * themselves become the audience.
 */
export const FIRST_MOVES = {
  strategy_number: sanitizeVoice(
    'Pick one number this quarter and write it down before you touch a tool: minutes from lead to first reply, hours a week your team spends retyping, proposals out the door per week. One number, a before measurement, a date. AI efforts without a before number do not fail loudly; they just never get to claim they worked.'
  ),
  strategy_rule: sanitizeVoice(
    'Write the tool rule before the next tool: what a new tool must improve, who signs off, and the date it gets killed if usage does not hold. One page is enough. The rule costs nothing, and it converts tool-buying from a debate into a decision.'
  ),
  people_owner: sanitizeVoice(
    'Name an automation owner this week. Not a committee, one person, with two protected hours and the authority to kill tools that do not earn their keep. At your size this is the single condition that most decides whether anything else in this result improves.'
  ),
  people_rollout: sanitizeVoice(
    'Before any new AI tool, run one rollout the boring way. Pick something small, name the two people who will use it daily, write the one-page way-we-work-now, and check usage every Friday for a month. Whatever pattern shows up is the pattern an AI tool will inherit, so rehearse it on something cheap first.'
  ),
  governance_rules: sanitizeVoice(
    'Write down what customer data an AI tool may touch, this week, even if the whole answer is one paragraph. Name the data that is off limits, the data that is fine, and who decides the gray cases. Every automation decision downstream gets faster once that page exists.'
  ),
  governance_review: sanitizeVoice(
    'Put one human checkpoint in front of anything automated that reaches a customer: one named person, reviewing before it sends, with the power to stop it. It costs a few minutes a day, and it is the difference between an embarrassing draft and an embarrassing incident.'
  ),
};

/** Maps the weakest dimension plus its lowest-scoring question to one of the
 *  six authored first moves. Deterministic; falls back to the dimension's
 *  first-listed move if the id is somehow unknown. */
export function pickFirstMoveKey(dimensionKey, weakestQuestionId) {
  const table = {
    strategy: { q5: 'strategy_number', q6: 'strategy_rule', q7: 'strategy_number', default: 'strategy_number' },
    people: { q8: 'people_owner', q9: 'people_rollout', q10: 'people_rollout', default: 'people_owner' },
    governance: { q11: 'governance_rules', q12: 'governance_review', q13: 'governance_rules', default: 'governance_rules' },
  };
  const dim = table[dimensionKey] || table.strategy;
  return dim[weakestQuestionId] || dim.default;
}

/* ------------------------------------------------------------------ */
/* Section 8: what we could not measure (the CTA block)               */
/* ------------------------------------------------------------------ */

export const COMPUTED_DIMENSIONS_INTRO = sanitizeVoice(
  'Three of the six AI readiness dimensions cannot be scored from questions, because they live in your systems, not in any self-report. This Scan did not score them, and neither could any quiz. That is not a gap in the Scan; it is the boundary between asking and measuring.'
);

export const COMPUTED_DIMENSIONS = [
  {
    key: 'data',
    name: 'Data Readiness',
    line: sanitizeVoice('Whether your CRM records are clean, complete and consistent enough for AI to act on. Scoring it means reading the records themselves, which is what the audit connects to do.'),
  },
  {
    key: 'systems',
    name: 'Systems Readiness',
    line: sanitizeVoice('Whether your tools are connected enough for automation to move work between them. The only honest way to score it is from the inside, integration by integration.'),
  },
  {
    key: 'process',
    name: 'Process Readiness',
    line: sanitizeVoice('Whether your workflows are consistent enough to automate, or whether every deal takes its own path. Computed from how your pipeline actually behaves, not from how anyone describes it.'),
  },
];

export const DISCLOSURE = sanitizeVoice(
  `Every score on this page is self-reported plus observed from your public surfaces: what you told us about yourself, and the handful of signals a public website gives away. Nothing here came from inside your systems. The ${AUDIT.name} is the connected version. It computes your maturity stage and your AI readiness from your actual records against the certified framework, then ranks what to automate first against the outcome you want. Where a verdict above says the audit computes this, that is not a hedge; it is the honest boundary of what an outside read can know.`
);

export const CTA_HEADING = `The ${AUDIT.name}`;

export const CTA_LINES = [
  sanitizeVoice('A connected read of your CRM and revenue tools, with the numbers computed from your own records'),
  sanitizeVoice('Your maturity stage and your AI readiness profile scored against the certified framework, including the three dimensions greyed out above'),
  sanitizeVoice('A ranked list of what to automate first, scored on what it is worth: more leads, more booked calls, more closed deals, less busywork'),
  sanitizeVoice(`${AUDIT.price}, and it credits ${AUDIT_TERMS.creditPercent} toward ${AUDIT_TERMS.creditTarget} inside ${AUDIT_TERMS.creditWindow}`),
];

/** The founding-client sentence, in while the founding window is open
 *  (DECIDED-BY-BRADLEY 2026-08-14). Terms come from lib/offers.js, never
 *  hardcoded; the card links /founding-clients beside it. */
export const FOUNDING_LINE = sanitizeVoice(
  `While the founding window is open, the audit fee credits ${AUDIT_TERMS.creditPercent} toward your first build and founding clients get ${FOUNDING_TERMS.carePlanIncluded}.`
);

export const FOUNDING_LINK_LABEL = sanitizeVoice('See the founding-client terms');

/* ------------------------------------------------------------------ */
/* Result section headings (shared by screen and PDF, so they mirror) */
/* ------------------------------------------------------------------ */

export const RESULT_HEADINGS = {
  whyStick: sanitizeVoice('Why it did not stick last time'),
  belief: sanitizeVoice('The belief the audit would test first'),
  observed: sanitizeVoice('What we could see from the outside'),
  dimensions: sanitizeVoice('How ready you are, dimension by dimension'),
  opportunity: sanitizeVoice('What not implementing AI is costing you'),
  comparisons: sanitizeVoice('The benchmarks behind the dollar lines'),
  firstMove: sanitizeVoice('Your first move, given away'),
  computed: sanitizeVoice('What we could not measure, and why that matters'),
};

/* ------------------------------------------------------------------ */
/* Formatting helpers and citations                                   */
/* ------------------------------------------------------------------ */

export function sourceCitation(modelLabel) {
  return `Source: businessModelBenchmarks v1.2, ${modelLabel} row.`;
}

export function formatUsd(n) {
  if (!Number.isFinite(n) || n < 0) return '$0';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

export function metricCitation(metric) {
  if (!metric?.source) return '';
  const year = metric.asOf ? ` (${metric.asOf})` : '';
  return `Source: ${metric.source}${year}.`;
}

/**
 * THE FOUR PARAGRAPHS BELOW ARE DELIBERATELY UNEVEN. Until 2026-08-12 every one
 * of them was exactly four sentences in the same order (diagnosis, three-verb
 * imperative, payoff, epigram) and all four landed within eight words of each
 * other. Read one and you could predict the next three, which is the definition
 * of the AI-writing tell this rewrite removed. They now run 3, 5, 3 and 5
 * sentences and 81, 69, 46 and 70 words, and each closes on a mechanic or a
 * timeframe a reader could check.
 *
 * If a future pass is tempted to "tidy" these into a consistent shape: that IS
 * the bug. Keep them uneven.
 *
 * 2026-08-14: these survive the Scan rebuild as the per-area "how to close
 * this" copy in the opportunity map (doc 15 Part 5 section 7 says exactly
 * this). leadResponse serves the speed-to-lead row. deadLead and
 * invoiceCollection were added the same day for the menu-shaped map; the
 * unevenness rule covers them too.
 */
export const FIX_PARAGRAPHS = {
  revenuePerEmployee: sanitizeVoice('Hiring is the expensive way to close this gap, and a new hire takes about two quarters to show up in the number at all. Pick the two or three handoffs that today wait on you personally, write them into the CRM as stage exit criteria your team can clear without asking you, and hold one half day a week for the work only you can do. Every handoff you give away moves the number with the same payroll underneath it.'),
  salesCycle: sanitizeVoice('Cycle time compresses when a stage change stops being a judgment call. Rewrite your stage exit criteria so every one of them is a fact the buyer confirmed. A demo that happened does not count. Make them required fields in the CRM, then walk a sample of stuck deals against them every two weeks. Inside a month you will be able to name the deals that were never real.'),
  retention: sanitizeVoice('Pull the last ten lost accounts and code the real reason against the qualification criteria each one passed on the way in. Fix the criteria, then fix the first thirty days. Renewal is a lagging number, so give it two quarters before you judge the change.'),
  leadResponse: sanitizeVoice('Start by timing it. Give every form submission two timestamps, one for when it landed and one for when a human first replied, and the gap between them is your number. Set a target the team is held to, and route anything that blows past it to an automated first touch inside fifteen minutes. None of that needs new software. Your CRM and your form tool already do both halves.'),
  deadLead: sanitizeVoice('Export every lead marked closed-lost or gone quiet in the last two years. Sort by deal size, pick the top fifty, and have one person send each a plain check-in with a real reason to reply. No sequence tool needed for the first pass; the reply rate tells you what a systematic pass is worth.'),
  invoiceCollection: sanitizeVoice('Pull every invoice more than thirty days old and count the dollars. Then turn on two automated nudges, day seven and day twenty-one, using the reminder feature your invoicing tool almost certainly already has, and route anything past forty-five days to a human call. Most stacks have the buttons; nobody has pressed them.'),
};
