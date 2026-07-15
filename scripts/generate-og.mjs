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

const LOGO = dataUri('logos/bdw-horizontal-one-color-white.png', 'image/png'); // 2400x725 personal white lockup
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

// Personal lockup, sized to preserve its 2400x725 (3.31:1) aspect ratio.
const Logo = () =>
  h('img', { src: LOGO, width: 254, height: 77, style: { position: 'absolute', top: 40, left: 64 } });

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

// The logo now carries the name, so the footer is role + URL.
const Footer = () =>
  h(
    'div',
    { style: { position: 'absolute', left: 64, bottom: 44, display: 'flex', alignItems: 'center', fontSize: 24 } },
    h('span', { style: { fontFamily: 'Jost', color: CREAM } }, 'Revenue Growth Coach'),
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
      h('div', { style: { marginTop: 10, fontFamily: 'Jost', fontWeight: 600, fontSize: 26, color: ORANGE } }, 'Revenue Growth Coach'),
      h('div', { style: { marginTop: 22, fontFamily: 'Jost', fontWeight: 400, fontSize: 24, lineHeight: 1.4, color: CREAM_DIM } }, subline),
    ),
    h(Headshot, {}),
  );
}

function scorecardCard({ headline, chips, footnote }) {
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
          fontFamily: 'Cormorant', fontWeight: 600, fontSize: 60, lineHeight: 1.06, color: CREAM,
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

function playbookCard() {
  const chapters = [
    'Define Your Ideal Customer',
    'Make Your Pipeline Inspectable',
    'Build the Operating Rhythm',
    'Fix the Post-Sale System',
    'Automate Before You Hire',
    'Reach Predictable Revenue',
  ];
  const outlinePill = (label) =>
    h('div', {
      style: {
        display: 'flex', alignItems: 'center', height: 38, padding: '0 20px', borderRadius: 9999,
        border: `1px solid ${ORANGE}`, color: ORANGE, fontFamily: 'Jost', fontWeight: 600, fontSize: 18, letterSpacing: 1,
      },
    }, label);
  return h(
    'div',
    { style: { width: 1200, height: 630, display: 'flex', position: 'relative', background: NAVY, fontFamily: 'Jost' } },
    h(TopBar),
    // right panel
    h('div', { style: { position: 'absolute', top: 8, left: 640, width: 560, height: 622, background: NAVY_MID } }),
    h('div', { style: { position: 'absolute', top: 8, left: 636, width: 4, height: 622, background: ORANGE } }),
    h(Logo),
    // FREE PLAYBOOK pill
    h('div', {
      style: {
        position: 'absolute', left: 64, top: 134, display: 'flex', alignItems: 'center', height: 30,
        padding: '0 14px', borderRadius: 6, background: ORANGE, color: '#FFFFFF',
        fontFamily: 'Jost', fontWeight: 600, fontSize: 16, letterSpacing: 1,
      },
    }, 'FREE PLAYBOOK'),
    // headline
    h('div', {
      style: {
        position: 'absolute', left: 64, top: 184, width: 540, display: 'flex',
        fontFamily: 'Cormorant', fontWeight: 600, fontSize: 66, lineHeight: 1.04, color: CREAM,
      },
    }, 'The Revenue Maturity Playbook'),
    // subline
    h('div', {
      style: {
        position: 'absolute', left: 64, top: 326, width: 510, display: 'flex',
        fontFamily: 'Jost', fontWeight: 400, fontSize: 24, lineHeight: 1.35, color: CREAM_DIM,
      },
    }, 'A Stage-by-Stage Framework for Growing Revenue Without Adding Headcount'),
    // bottom pills
    h('div', { style: { position: 'absolute', left: 64, bottom: 44, display: 'flex', gap: 12 } },
      outlinePill('FREE'), outlinePill('6 CHAPTERS')),
    // right panel chapters
    h('div', { style: { position: 'absolute', left: 680, top: 72, width: 480, display: 'flex', flexDirection: 'column', gap: 22 } },
      ...chapters.map((c, i) =>
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 16 } },
          h('div', {
            style: {
              width: 38, height: 38, borderRadius: 9999, background: ORANGE, color: '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Jost', fontWeight: 600, fontSize: 17,
            },
          }, String(i + 1).padStart(2, '0')),
          h('div', { style: { display: 'flex', fontFamily: 'Jost', fontWeight: 500, fontSize: 24, color: CREAM } }, c),
        ),
      ),
    ),
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
    // lockup bottom-left
    h('img', {
      src: LOGO, width: 231, height: 70,
      style: { position: 'absolute', left: 72, bottom: 36 },
    }),
  );
}

// ---- card definitions -----------------------------------------------------
const CARDS = {
  homepage: {
    changed: false,
    element: () =>
      heroCard({
        headline: 'Grow Your Revenue Without Growing Your Headcount',
        subline: 'Done-with-you coaching for founder-led B2B companies, $3M to $50M',
      }),
  },
  about: {
    changed: false,
    element: () =>
      aboutCard({
        subline: 'Helping founder-led B2B companies build revenue engines that grow without headcount',
      }),
  },
  scorecard: {
    changed: false,
    element: () =>
      scorecardCard({
        headline: 'Get Your Free Revenue Maturity Score',
        chips: [
          'CRM Architecture', 'Lead Qualification', 'Pipeline Design', 'Forecasting',
          'Revenue Cadence', 'Retention & Expansion', 'Leading Indicators',
        ],
        footnote: 'Peer-anchored to your business model · 15 questions · about 5 minutes',
      }),
  },
  'maturity-model': {
    changed: false,
    element: () =>
      heroCard({
        headline: 'The Revenue Operations Maturity Model',
        subline: 'Four stages. 44 competencies. From revenue that runs on you to revenue you can predict.',
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
  playbook: {
    changed: false,
    element: () => playbookCard(),
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
    changed: true,
    element: () =>
      learnCard({
        kicker: 'FRACTIONAL COO',
        headline: 'What a Fractional COO Actually Does',
        headlineSize: 60,
      }),
  },
  'learn-net-revenue-retention': {
    changed: true,
    element: () =>
      learnCard({
        kicker: 'NET REVENUE RETENTION',
        headline: 'The One Number That Shows Whether Growth Is Real',
        headlineSize: 56,
      }),
  },
  'learn-marketing-and-sales-alignment': {
    changed: true,
    element: () =>
      learnCard({
        kicker: 'MARKETING AND SALES ALIGNMENT',
        headline: 'One Definition of a Real Opportunity',
        headlineSize: 60,
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
