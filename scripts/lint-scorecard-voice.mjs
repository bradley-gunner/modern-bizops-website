#!/usr/bin/env node
/**
 * Voice lint for scorecard client-facing copy.
 *
 * Checks (per file):
 *   1. No em-dash (U+2014).
 *   2. No first-person singular (I, my, me, mine, myself, and the I'm/I've/I'll
 *      contractions), case-insensitive on the possessives and objects.
 *
 * INVERTED 2026-08-12. Until then check 2 was the exact opposite: it hard-failed
 * on \b(we|our|us)\b, because the Scan surfaces were the deliberate carve-out
 * that stayed in Bradley's first-person singular while the rest of the site
 * moved to "we". Bradley retired the singular as a brand voice that day ("we
 * need to retire the first person I language as a general brand voice rule"),
 * which turned this guard into a guard against the house voice. It now enforces
 * the voice that is current rather than the one that was retired. The em-dash
 * check is untouched.
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
 *     respondent dialogue ("Our deal information lives in my head..."), where
 *     the user describes their own company in first person. A singular check
 *     would fire on every one of them, and the speaker there is the reader, not
 *     the brand. The marketer-authored prompts and peer-anchor templates in
 *     this file are covered by the voice sanitizer at runtime.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const DEFAULT_TARGETS = [
  'lib/scorecard/roi.js',
  'lib/scorecard/resultRender.js',
  'app/scorecard/page.js',
];

const EM_DASH = /—/;

// Two patterns because the casing rules differ. "I" is matched case-sensitively
// so a loop index `i` does not trip the lint; the possessive and object forms
// are case-insensitive because they open sentences. The trailing (?!-) keeps
// Tailwind margin utilities (my-9, me-4) out of the match.
const FIRST_PERSON_I = /\bI\b/;
const FIRST_PERSON_OTHER = /\b(my|me|mine|myself)\b(?!-)/i;

// Code comments are exempt. Bradley's ruling is about what a visitor reads, and
// a JSDoc line like "Pure function. No I/O." is neither copy nor voice.
const COMMENT_LINE = /^\s*(\/\/|\/\*|\*)/;

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
    if (COMMENT_LINE.test(line)) return;
    if (FIRST_PERSON_I.test(line) || FIRST_PERSON_OTHER.test(line)) {
      errors.push(`${path}:${i + 1}: first-person singular: ${line.trim()}`);
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
