#!/usr/bin/env node
/**
 * Voice lint for scorecard client-facing copy.
 *
 * Checks (per file):
 *   1. No em-dash (U+2014).
 *   2. No first-person plural (\b(we|our|us)\b case-insensitive).
 *
 * Usage:
 *   node scripts/lint-scorecard-voice.mjs <file> [<file>...]
 *
 * When invoked with no arguments, lints the default surface list (the scorecard
 * roi and result-render modules).
 *
 * Intentionally excluded:
 *   - lib/scorecard/voice.js: contains the lint patterns inside its own
 *     sanitizer regex and error strings; module-load sanitizeVoice throws are
 *     the runtime test for that file.
 *   - lib/scorecard/questions.js: the maturity option labels are role-played
 *     respondent dialogue ("We have a documented ICP..."), where the user
 *     describes their own company in first person. Those labels are not
 *     marketer voice and are out of scope for this lint. The marketer-authored
 *     prompts and peer-anchor templates in this file are covered by the voice
 *     sanitizer at runtime.
 *
 * app/scorecard/page.js will be added to the default targets when Task 15
 * lands the rewritten page.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const DEFAULT_TARGETS = [
  'lib/scorecard/roi.js',
  'lib/scorecard/resultRender.js',
];

const EM_DASH = /—/;
const FIRST_PERSON_PLURAL = /\b(we|our|us)\b/i;

function lintFile(path) {
  const errors = [];
  if (!existsSync(path)) {
    errors.push(`File not found: ${path}`);
    return errors;
  }
  const content = readFileSync(path, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (EM_DASH.test(line)) {
      errors.push(`${path}:${i + 1}: em-dash: ${line.trim()}`);
    }
    if (FIRST_PERSON_PLURAL.test(line)) {
      errors.push(`${path}:${i + 1}: first-person plural: ${line.trim()}`);
    }
  });
  return errors;
}

const args = process.argv.slice(2);
const targets = args.length > 0 ? args : DEFAULT_TARGETS;

let total = 0;
for (const target of targets) {
  const errors = lintFile(resolve(process.cwd(), target));
  for (const err of errors) {
    console.error(err);
    total++;
  }
}

if (total > 0) {
  console.error(`\nVoice lint failed: ${total} violation(s).`);
  process.exit(1);
}
console.log('Voice lint passed.');
process.exit(0);
