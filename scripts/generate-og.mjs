/**
 * Open Graph image generator.
 *
 * Renders the 1200x630 social-share cards in public/og from a single
 * brand template so they stay pixel-consistent. Uses next/og (Satori) plus
 * the real brand fonts and headshot already in the repo. No external calls.
 *
 * Run:  node scripts/generate-og.mjs            (regenerates the off-positioning set)
 *       node scripts/generate-og.mjs --all      (regenerates every card)
 *
 * Edit the CARDS array below to change copy, then re-run. Output is written
 * to public/og/<slug>.png.
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

const LOGO = dataUri('logos/logo-og.png', 'image/png'); // 702x255 white wordmark
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

const Logo = () =>
  h('img', { src: LOGO, width: 127, height: 46, style: { position: 'absolute', top: 48, left: 64 } });

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

const Footer = () =>
  h(
    'div',
    { style: { position: 'absolute', left: 64, bottom: 44, display: 'flex', alignItems: 'center', fontSize: 24 } },
    h('span', { style: { fontFamily: 'Jost', color: CREAM } }, 'Bradley de Wet'),
    h('span', { style: { color: 'rgba(246,242,235,0.35)', margin: '0 16px' } }, '|'),
    h('span', { style: { fontFamily: 'Jost', color: ORANGE } }, 'Revenue Growth Coach'),
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
      { style: { position: 'absolute', left: 64, top: 110, display: 'flex', gap: 12 } },
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

// ---- card definitions -----------------------------------------------------
const CARDS = {
  homepage: {
    changed: true,
    element: () =>
      heroCard({
        headline: 'Grow Your Revenue Without Growing Your Headcount',
        subline: 'Done-with-you coaching for founder-led B2B companies, $3M to $50M',
      }),
  },
  about: {
    changed: true,
    element: () =>
      aboutCard({
        subline: 'Helping founder-led B2B companies build revenue engines that grow without headcount',
      }),
  },
  scorecard: {
    changed: true,
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
    changed: true,
    element: () =>
      heroCard({
        headline: 'The Revenue Operations Maturity Model',
        subline: 'Four stages. 44 competencies. From revenue that runs on you to revenue you can predict.',
        headlineSize: 58,
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
