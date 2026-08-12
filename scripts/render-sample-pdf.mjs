#!/usr/bin/env node
/**
 * Render a sample scorecard PDF to ./out/sample-scorecard.pdf for visual review.
 *
 * Usage:
 *   node_modules/.bin/vite-node --config vitest.config.mjs scripts/render-sample-pdf.mjs
 *
 * (Plain `node` cannot transform JSX. Passing --config vitest.config.mjs ensures
 * vite-node loads @vitejs/plugin-react with the automatic JSX runtime, which
 * handles .jsx imports without requiring an explicit React import in each file.)
 *
 * Used as a manual sprint spot check before the email-send pipeline is wired.
 * Attach the resulting PDF to the v1.1 PR.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { renderResultPdf } from '../lib/scorecard/pdfDocument.jsx';
import { buildResult } from '../lib/scorecard/resultRender.js';

const SAMPLE_ANSWERS = {
  q1: { value: '5m_15m' },
  q2: { value: 'PROFESSIONAL_SERVICES' },
  q3: { value: '51_75' },
  q4:  { value: 'A', score: 1 }, q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 },
  q7:  { value: 'B', score: 2 }, q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 },
  q10: { value: 'B', score: 2 }, q11: { value: 'A', score: 1 }, q12: { value: 'A', score: 1 },
  q13: { value: '25k_100k' }, q14: { value: 'over_180' }, q15: { value: 'over_30' },
};

const result = buildResult(SAMPLE_ANSWERS, { generatedAt: '2026-06-11T12:00:00.000Z' });
const buf = await renderResultPdf(result);

const outPath = resolve(process.cwd(), 'out', 'sample-scorecard.pdf');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, buf);
console.log(`Wrote ${outPath} (${buf.length} bytes)`);
