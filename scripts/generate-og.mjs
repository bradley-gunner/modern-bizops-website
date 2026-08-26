/**
 * Open Graph image generator.
 *
 * Renders the 1200x630 social-share cards in public/og from a single
 * brand template so they stay pixel-consistent. Uses next/og (Satori) plus
 * the real brand fonts and headshot already in the repo. No external calls.
 *
 * Run:  node scripts/generate-og.mjs            (regenerates the changed set)
 *       node scripts/generate-og.mjs --all      (regenerates every card)
 *
 * Edit the CARDS array below to change copy, then re-run. Output is written
 * to public/og/<slug>.png.
 *
 * The top-left logo is the personal "Bradley de Wet · Modern BizOps" lockup, so
 * the footer carries the role and URL (not the name again).
 *
 * Brand tokens (from app/globals.css, with the OG-specific orange sampled
 * from the original cards):
 *   navy   #0E1F38   navyMid #1C3A5C   cream #F6F2EB
 *   orange #D87222 (bar / ring / accents)   creamDim #C9D2DE
 */

import { ImageResponse } from 'next/og.js';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createElement as h } from 'react';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');

const NAVY = '#0E1F38';
const NAVY_MID = '#16304F';
const CREAM = '#F6F2EB';
const CREAM_DIM = '#C9D2DE';
const ORANGE = '#D87222';

// ---- assets as data URIs (Satori needs inlined images) --------------------
const dataUri = (path, mime) =>
  `data:${mime};base64,${readFileSync(join(PUBLIC, path)).toString('base64')}`;

const LOGO = dataUri('logos/horizontal-one-color-white-trimmed.png', 'image/png'); // 698x251 company white lockup, trimmed
const HEADSHOT = dataUri('images/bradley-headshot-og.jpg', 'image/jpeg'); // 300x300

const font = (file) => readFileSync(join(PUBLIC, 'fonts', file));
const FONTS = [
  { name: 'Cormorant', data: font('CormorantGaramond-SemiBold.ttf'), weight: 600, style: 'normal' },
  { name: 'Cormorant', data: font('CormorantGaramond-Bold.ttf'), weight: 700, style: 'normal' },
  { name: 'Jost', data: font('Jost-Regular.ttf'), weight: 400, style: 'normal' },
  { name: 'Jost', data: font('Jost-SemiBold.ttf'), weight: 600, style: 'normal' },
];

// ---- shared pieces --------------------------------------------------------
const TopBar = () =>
  h('div', { style: { position: 'absolute', top: 0, left: 0, width: '100%', height: 8, background: ORANGE } });

// Company lockup, trimmed (698x251, 2.78:1). It replaced the personal one on
// 2026-08-18, the same day the site header and footer did.
//
// The box shrank from 254x77 because the two assets carry different amounts of
// padding: the personal PNG was 2400x725 with the artwork filling 68 percent of
// the width and 51 percent of the height, the trimmed one is 93.6 percent tall.
// These numbers keep the RENDERED ARTWORK the same height it has always been on
// these cards, about 39px, rather than keeping the box the same and shrinking
// the mark inside it.
const Logo = () =>
  h('img', { src: LOGO, width: 117, height: 42, style: { position: 'absolute', top: 40, left: 64 } });

const Headshot = ({ size = 256, top = 187, right = 80 }) =>
  h(
    'div',
    {
      style: {
        position: 'absolute', top, right, display: 'flex',
        padding: 6, borderRadius: 9999, background: ORANGE,
      },
    },
    h('img', { src: HEADSHOT, width: size, height: size, style: { borderRadius: 9999 } }),
  );

// The logo now carries the name, so the footer is the positioning line + URL.
//
// That line said "Revenue Growth Coach" until 2026-08-12, which is the retired
// offer. It is baked into this shared template, so every card the script has
// ever produced carried it, including the five made hours earlier for pages
// that sell an AI automation partnership. The string below is the site footer's
// own line, verbatim (components/Footer.jsx), so the card and the page a share
// links to say the same thing.
const Footer = () =>
  h(
    'div',
    { style: { position: 'absolute', left: 64, bottom: 44, display: 'flex', alignItems: 'center', fontSize: 24 } },
    h('span', { style: { fontFamily: 'Jost', color: CREAM } }, 'The AI automation partner for B2B go-to-market'),
    h('span', { style: { color: 'rgba(246,242,235,0.35)', margin: '0 16px' } }, '|'),
    h('span', { style: { fontFamily: 'Jost', color: ORANGE } }, 'modernbizops.com'),
  );

const Frame = (...children) =>
  h(
    'div',
    {
      style: {
        width: 1200, height: 630, display: 'flex', position: 'relative',
        background: NAVY, fontFamily: 'Jost',
      },
    },
    h(TopBar),
    h(Logo),
    ...children,
    h(Footer),
  );

// ---- per-card templates ---------------------------------------------------
function heroCard({ headline, subline, headlineSize = 64 }) {
  return Frame(
    h(
      'div',
      {
        style: {
          position: 'absolute', left: 64, top: 150, width: 660,
          display: 'flex', flexDirection: 'column',
        },
      },
      h(
        'div',
        { style: { fontFamily: 'Cormorant', fontWeight: 600, fontSize: headlineSize, lineHeight: 1.06, color: CREAM } },
        headline,
      ),
      h(
        'div',
        { style: { marginTop: 30, fontFamily: 'Jost', fontWeight: 400, fontSize: 27, color: ORANGE } },
        subline,
      ),
    ),
    h(Headshot, {}),
  );
}

function aboutCard({ subline }) {
  return Frame(
    h(
      'div',
      {
        style: {
          position: 'absolute', left: 64, top: 150, width: 640,
          display: 'flex', flexDirection: 'column',
        },
      },
      h('div', { style: { fontFamily: 'Cormorant', fontWeight: 600, fontSize: 52, color: ORANGE, lineHeight: 1 } }, 'Meet'),
      h('div', { style: { fontFamily: 'Cormorant', fontWeight: 600, fontSize: 72, color: CREAM, lineHeight: 1.05 } }, 'Bradley de Wet'),
      // Sits under his name, so this one is the job title rather than the
      // company positioning line the footer carries. Verbatim from the Person
      // schema in app/schema.js.
      h('div', { style: { marginTop: 10, fontFamily: 'Jost', fontWeight: 600, fontSize: 26, color: ORANGE } }, 'Founder, Modern BizOps'),
      h('div', { style: { marginTop: 22, fontFamily: 'Jost', fontWeight: 400, fontSize: 24, lineHeight: 1.4, color: CREAM_DIM } }, subline),
    ),
    h(Headshot, {}),
  );
}

function scorecardCard({ headline, chips, footnote, headlineSize = 60 }) {
  const pill = (label, filled) =>
    h(
      'div',
      {
        style: {
          display: 'flex', alignItems: 'center', height: 34, padding: '0 16px', borderRadius: 8,
          fontFamily: 'Jost', fontWeight: 600, fontSize: 18, letterSpacing: 1,
          background: filled ? ORANGE : NAVY_MID, color: filled ? '#FFFFFF' : CREAM,
        },
      },
      label,
    );
  const chip = (label) =>
    h(
      'div',
      {
        style: {
          display: 'flex', alignItems: 'center', height: 38, padding: '0 16px', borderRadius: 8,
          fontFamily: 'Jost', fontWeight: 500, fontSize: 19,
          background: NAVY_MID, color: '#E8873A', border: '1px solid rgba(216,114,34,0.35)',
        },
      },
      label,
    );
  return Frame(
    h(
      'div',
      { style: { position: 'absolute', left: 64, top: 140, display: 'flex', gap: 12 } },
      pill('FREE', true),
      pill('5 MINUTES', false),
    ),
    h(
      'div',
      {
        style: {
          position: 'absolute', left: 64, top: 180, width: 720,
          fontFamily: 'Cormorant', fontWeight: 600, fontSize: headlineSize, lineHeight: 1.06, color: CREAM,
          display: 'flex',
        },
      },
      headline,
    ),
    h(
      'div',
      {
        style: {
          position: 'absolute', left: 64, top: 330, width: 720,
          display: 'flex', flexWrap: 'wrap', gap: 10,
        },
      },
      ...chips.map(chip),
    ),
    h(
      'div',
      { style: { position: 'absolute', left: 64, bottom: 92, fontFamily: 'Jost', fontWeight: 400, fontSize: 20, color: 'rgba(246,242,235,0.55)' } },
      footnote,
    ),
    h(Headshot, { size: 224, top: 203, right: 80 }),
  );
}

function watchCard({ headline, subline }) {
  return Frame(
    h(
      'div',
      { style: { position: 'absolute', left: 64, top: 188, width: 640, display: 'flex', flexDirection: 'column' } },
      h('div', { style: { fontFamily: 'Cormorant', fontWeight: 600, fontSize: 66, lineHeight: 1.06, color: CREAM, display: 'flex' } }, headline),
      h('div', { style: { marginTop: 14, fontFamily: 'Jost', fontWeight: 600, fontSize: 24, color: ORANGE, display: 'flex' } }, subline),
    ),
    // play button
    h(
      'div',
      {
        style: {
          position: 'absolute', top: 243, right: 190, width: 140, height: 140, borderRadius: 9999,
          background: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center',
        },
      },
      h('svg', { width: 50, height: 56, viewBox: '0 0 50 56', style: { marginLeft: 8 } },
        h('polygon', { points: '0,0 50,28 0,56', fill: '#FFFFFF' })),
    ),
    h(Headshot, { size: 120, top: 415, right: 55 }),
  );
}


// /learn article cards. Batch 1's three cards were produced outside this
// script (Cowork session, July 2026); this template reproduces that design so
// later batches stay pixel-consistent: navy vignette, orange kicker, bold
// cream headline with orange underline, ringed headshot, lockup bottom-left.
function learnCard({ kicker, headline, headlineSize = 64 }) {
  return h(
    'div',
    {
      style: {
        width: 1200, height: 630, display: 'flex', position: 'relative',
        backgroundColor: NAVY, fontFamily: 'Jost',
        backgroundImage: 'radial-gradient(circle at 30% 35%, #14284A 0%, #0E1F38 65%, #0A1729 100%)',
      },
    },
    // kicker
    h(
      'div',
      { style: { position: 'absolute', left: 80, top: 100, display: 'flex', alignItems: 'center' } },
      h('div', { style: { width: 10, height: 30, borderRadius: 5, background: ORANGE, marginRight: 18 } }),
      h(
        'div',
        { style: { fontFamily: 'Jost', fontWeight: 600, fontSize: 23, letterSpacing: 3, color: ORANGE, display: 'flex' } },
        kicker,
      ),
    ),
    // headline + underline
    h(
      'div',
      { style: { position: 'absolute', left: 80, top: 160, width: 650, display: 'flex', flexDirection: 'column' } },
      h(
        'div',
        {
          style: {
            fontFamily: 'Jost', fontWeight: 600, fontSize: headlineSize,
            lineHeight: 1.16, color: '#F2EFE9', display: 'flex',
          },
        },
        headline,
      ),
      h('div', { style: { width: 260, height: 8, borderRadius: 4, background: ORANGE, marginTop: 26 } }),
    ),
    h(Headshot, { size: 318, top: 137, right: 72 }),
    // lockup bottom-left. 106x38 for the trimmed company lockup holds the
    // artwork at the ~36px it had at the old 231x70. See the Logo note above.
    h('img', {
      src: LOGO, width: 106, height: 38,
      style: { position: 'absolute', left: 72, bottom: 36 },
    }),
  );
}

// ---- card definitions -----------------------------------------------------
const CARDS = {
  // Primary BOFU / How It Works offer page. Uses the hero template (headline +
  // dek subline + headshot), matching the other primary pages rather than the
  // /learn kicker cards.
  'revenue-operations-consulting': {
    changed: false,
    element: () =>
      heroCard({
        headline: 'Revenue Operations Consulting',
        subline: 'From someone who has run the function, not just advised on it',
        headlineSize: 60,
      }),
  },
  // Wave 2 AI cluster. The two /learn pages use the kicker learn-card template;
  // the root-level BOFU service page uses the hero template, matching the other
  // primary offer pages (revenue-operations-consulting).
  'learn-ai-for-small-business': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'AI FOR SMALL BUSINESS',
        headline: 'What Actually Works When You Have Real Customers',
        headlineSize: 52,
      }),
  },
  'learn-ai-tools-for-small-business': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'AI TOOLS FOR SMALL BUSINESS',
        headline: 'The Stack a Real Business Can Run',
        headlineSize: 58,
      }),
  },
  'service-ai-consulting': {
    changed: false,
    element: () =>
      // Subline is the page dek, and that dek was shortened to "Foundations
      // first." by the approved step-16 retarget. The card followed it.
      heroCard({
        headline: 'AI Consulting for Small Business',
        subline: 'Foundations first.',
        headlineSize: 58,
      }),
  },
  // Re-rendered 2026-08-18 with the literal H1 (PR #76). The card carried the
  // outcome-led headline the page no longer leads with, and a subline quoting
  // a dek that had been replaced, so both halves were stale against the page
  // they front.
  //
  // The H1 is 106 characters and will not set at 64px in a 660px column, so
  // the card splits it at its own natural seam: what we do in the headline,
  // what you get in the subline. Every word is from the H1 itself, nothing
  // invented for the card. Title case because that is what every other card
  // uses. The page's new dek (foundations, transparent pricing, no lock-in)
  // is the differentiator set, which is an argument rather than a hook, so it
  // stays on the page and off the share card.
  homepage: {
    changed: false,
    element: () =>
      heroCard({
        headline: 'We Implement AI Automation for Your B2B Business',
        subline: 'More leads, more sales, and less busywork',
      }),
  },
  // Subline read "Helping founder-led B2B companies build revenue engines that
  // grow without headcount" until 2026-08-12, which is the retired positioning
  // and no longer describes the page. It now echoes the About H1 and the
  // opening of the approved positioning paragraph.
  about: {
    changed: false,
    element: () =>
      aboutCard({
        subline: 'Over a decade in the executor seat, now building the automation',
      }),
  },
  // Slug stays `scorecard` because the route and the og:image path do; the
  // card is the AI Revenue Scan, the free first rung of the ladder. "Free" is
  // carried by the FREE pill above the headline, so the headline does not
  // repeat it, which is what keeps it on one line at the default 60px.
  scorecard: {
    // Re-rendered 2026-08-14 with the Scan rebuild. The chips were the seven
    // RETIRED RevOps competencies (CRM Architecture, Pipeline Design and
    // friends), which the instrument stopped asking about, and the footnote
    // said 15 questions. Artwork survives every text search, so a stale claim
    // baked in here is the historical worst case. PNG regenerated; flag reset
    // to false per the committed-state rule.
    changed: false,
    element: () =>
      scorecardCard({
        headline: 'Get Your AI Revenue Scan',
        chips: [
          'AI Strategy', 'People & Adoption', 'Governance & Trust',
          'What we see from the outside', 'What it is costing you',
        ],
        footnote: 'Peer-anchored to your business model · 16 questions · about 5 minutes',
      }),
  },
  'maturity-model': {
    // Re-rendered 2026-08-14: the card said 51 competencies, which the v1.2
    // certified inventory (60) retired. Same hidden-surface class as the
    // scorecard card above. PNG regenerated; flag reset to false.
    changed: false,
    element: () =>
      heroCard({
        headline: 'The GTM Maturity Framework',
        subline: 'Four stages. 60 competencies. From revenue that runs on you to revenue you can predict.',
        headlineSize: 58,
      }),
  },
  book: {
    changed: false,
    element: () =>
      heroCard({
        headline: 'Book a Free Discovery Call',
        subline: "45 minutes. No obligation. Let's find your biggest revenue growth lever.",
      }),
  },
  watch: {
    changed: false,
    element: () =>
      watchCard({
        headline: 'Watch How It Works',
        subline: 'See the revenue engine framework in action',
      }),
  },
  'learn-ideal-customer-profile': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'IDEAL CUSTOMER PROFILE',
        headline: 'Why You Keep Winning the Wrong Clients',
      }),
  },
  'learn-revenue-lifecycle-design': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'REVENUE LIFECYCLE DESIGN',
        headline: 'Why Deals Stall After the Demo',
      }),
  },
  'learn-data-quality-management': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'DATA QUALITY MANAGEMENT',
        headline: 'Why Every Revenue Meeting Starts With an Argument About the Numbers',
        headlineSize: 50,
      }),
  },
  'learn-lead-qualification-framework': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'LEAD QUALIFICATION FRAMEWORK',
        headline: 'How to Tell a Real Lead From a Waste of Time',
        headlineSize: 60,
      }),
  },
  // Wave 1 pillar-map calibration batch. Headlines follow the batch 2
  // precedent: the title tag's hook, shortened where the full tag overflows
  // the card.
  'learn-fractional-coo': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'FRACTIONAL COO',
        headline: 'What a Fractional COO Actually Does',
        headlineSize: 60,
      }),
  },
  'learn-net-revenue-retention': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'NET REVENUE RETENTION',
        headline: 'The One Number That Shows Whether Growth Is Real',
        headlineSize: 56,
      }),
  },
  'learn-marketing-and-sales-alignment': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'MARKETING AND SALES ALIGNMENT',
        headline: 'One Definition of a Real Opportunity',
        headlineSize: 60,
      }),
  },
  // Wave 1 remaining-six batch. Headline = the title tag's hook clause,
  // shortened where the full clause overflows the 650px text column.
  'learn-what-is-revops': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'WHAT IS REVOPS?',
        headline: 'Revenue Operations, Explained for Founders',
        headlineSize: 56,
      }),
  },
  'learn-revenue-per-employee': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'REVENUE PER EMPLOYEE',
        headline: 'The Number That Says Whether You Can Grow Without Hiring',
        headlineSize: 48,
      }),
  },
  'learn-smarketing': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'SMARKETING',
        headline: 'When Marketing and Sales Stop Grading Their Own Homework',
        headlineSize: 50,
      }),
  },
  'learn-mql-to-sql-conversion-rate': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'MQL TO SQL CONVERSION RATE',
        headline: 'Exactly Where the Marketing-to-Sales Handoff Breaks',
        headlineSize: 50,
      }),
  },
  'learn-involuntary-churn': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'INVOLUNTARY CHURN',
        headline: 'The Customers You Lose Without Anyone Deciding to Leave',
        headlineSize: 50,
      }),
  },
  'learn-win-loss-analysis': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'WIN/LOSS ANALYSIS',
        headline: 'Find Out Why You Actually Win Deals',
        headlineSize: 60,
      }),
  },
  // Wave 2 fractional-COO cluster: the MOFU cost-comparison page. Headline is
  // the title tag's hook clause verbatim, at the smaller size it needs to fit.
  'learn-fractional-coo-cost': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'FRACTIONAL COO COST',
        headline: 'What You Pay, What You Get, and When You Do Not Need One',
        headlineSize: 46,
      }),
  },
  // Wave 4: retention, subscription-recovery, lifecycle, conversion cluster.
  // Headline = each page's on-page dek (title-tag hook), sized to fit the 650px
  // column the way the earlier learn cards are.
  'learn-customer-retention-strategy': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'CUSTOMER RETENTION STRATEGY',
        headline: 'Keep the Revenue You Already Won',
        headlineSize: 60,
      }),
  },
  'learn-reduce-customer-churn': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'REDUCE CUSTOMER CHURN',
        headline: 'Catch It While You Can Still Change the Outcome',
        headlineSize: 52,
      }),
  },
  'learn-payment-recovery': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'PAYMENT RECOVERY',
        headline: 'What to Fix in Your Billing Before You Buy Software for It',
        headlineSize: 44,
      }),
  },
  'learn-customer-lifecycle-marketing': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'CUSTOMER LIFECYCLE MARKETING',
        headline: 'Revenue From the Customers You Already Paid to Acquire',
        headlineSize: 48,
      }),
  },
  'learn-conversion-rate-optimization': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'CONVERSION RATE OPTIMIZATION',
        headline: 'Fix the Funnel, Not the Button',
        headlineSize: 60,
      }),
  },
  // The August 2026 refit: the four offer pages and the /learn index. Their
  // og:image paths were written into lib/offerPages.js and lib/learnIndex.js
  // before any card existed, so every share of those five pages rendered with
  // no card at all. The four offer pages use the hero template, matching the
  // other primary pages (revenue-operations-consulting, service-ai-consulting);
  // the /learn index uses the kicker card, because it is the front door to the
  // pages that already carry that design.
  //
  // No card here states a price. A PNG cannot track lib/offers.js, so a number
  // baked into one is a number that goes stale the first time a price moves.
  'ai-readiness-assessment': {
    changed: false,
    element: () =>
      heroCard({
        headline: 'The AI Revenue Audit',
        subline: 'The honest diagnosis before you spend more on AI',
        headlineSize: 62,
      }),
  },
  'ai-automation-services': {
    changed: false,
    element: () =>
      heroCard({
        headline: 'Revenue Automation Builds',
        subline: 'Twelve named systems, published fixed prices, a clock on every one',
        headlineSize: 58,
      }),
  },
  pricing: {
    changed: false,
    element: () =>
      heroCard({
        headline: 'Every Price We Charge, on One Page',
        subline: 'The full ladder, with no call needed to get a number',
        headlineSize: 58,
      }),
  },
  'founding-clients': {
    changed: false,
    element: () =>
      heroCard({
        headline: 'Be the First in Your Industry',
        subline: 'One founding client in each of six industries',
        headlineSize: 58,
      }),
  },
  // These three were generated by an earlier run and then dropped out of this
  // array, so `--all` did not reach them and they kept whatever logo and copy
  // was current when they were made. All three pages are live and in the
  // sitemap. Definitions restored 2026-08-18 so the set is actually complete.
  //
  // Headlines are transcribed from the existing PNGs, so the cards keep the
  // hook they have always had. The one change is the stage-1 kicker, which
  // read "REVENUE MATURITY MODEL" on the old card: that name appears nowhere
  // in the codebase now (50 uses of "GTM Maturity Framework", zero of the old
  // one), and the maturity-model card here already uses the current name.
  'learn-crm-architecture': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'CRM ARCHITECTURE & GOVERNANCE',
        headline: 'CRM Not Working for Your Team?',
        headlineSize: 60,
      }),
  },
  'learn-pipeline-stage-design': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'PIPELINE STAGE DESIGN',
        headline: 'Why Is Your Sales Cycle So Long?',
        headlineSize: 60,
      }),
  },
  'learn-stage-1-reactive': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'GTM MATURITY FRAMEWORK \u00B7 STAGE 1',
        headline: 'Stage 1: Reactive Revenue Operations',
        headlineSize: 56,
      }),
  },
  'learn-index': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'LEARNING LIBRARY',
        headline: 'Every Guide We Have Published, in One Place',
        headlineSize: 52,
      }),
  },
  // Step-15 AEO batch, 2026-08-26: the three buying-decision pages. Headlines
  // follow the batch precedent (the title tag's hook, in the words the page
  // uses), kickers name the target query noun.
  'learn-ai-automation-agency-cost': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'AI AUTOMATION AGENCY COST',
        headline: 'How Much Does an AI Automation Agency Cost?',
        headlineSize: 52,
      }),
  },
  'learn-ai-consultant-vs-in-house': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'AI CONSULTANT VS. IN-HOUSE',
        headline: 'How to Actually Decide',
        headlineSize: 60,
      }),
  },
  'learn-best-ai-automation-agencies-b2b': {
    changed: false,
    element: () =>
      learnCard({
        kicker: 'BEST AI AUTOMATION AGENCIES',
        headline: 'Ranked by What Each Firm Is Actually Best At',
        headlineSize: 52,
      }),
  },
};

// ---- render ---------------------------------------------------------------
async function render(slug, element) {
  const resp = new ImageResponse(element(), { width: 1200, height: 630, fonts: FONTS });
  const buf = Buffer.from(await resp.arrayBuffer());
  const out = join(PUBLIC, 'og', `og-${slug}.png`);
  writeFileSync(out, buf);
  console.log(`wrote ${out} (${buf.length} bytes)`);
}

const all = process.argv.includes('--all');
const slugs = Object.entries(CARDS).filter(([, c]) => all || c.changed).map(([s]) => s);
for (const slug of slugs) {
  await render(slug, CARDS[slug].element);
}
console.log(`done: ${slugs.join(', ')}`);
