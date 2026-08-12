import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(here, '..', '..', 'scripts', 'lint-scorecard-voice.mjs');

function run(args) {
  try {
    const out = execFileSync('node', [SCRIPT, ...args], { encoding: 'utf8' });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status, out: (e.stdout || '') + (e.stderr || '') };
  }
}

// The lint was inverted on 2026-08-12. It used to fail on "we/our/us" and pass
// first-person singular; Bradley retired the singular as a brand voice, so the
// guard now enforces the opposite. These tests assert the new intent, including
// the fact that the plural is explicitly allowed, so a revert cannot pass
// quietly.
describe('lint-scorecard-voice script', () => {
  it('exits 0 on a clean fixture', () => {
    const r = run(['__tests__/scorecard/fixtures/clean.txt']);
    expect(r.code).toBe(0);
  });

  it('exits non-zero on a dirty fixture', () => {
    const r = run(['__tests__/scorecard/fixtures/dirty.txt']);
    expect(r.code).not.toBe(0);
    expect(r.out).toMatch(/em-dash|first-person singular/i);
  });

  it('flags first-person singular copy, naming it as such', () => {
    const r = run(['__tests__/scorecard/fixtures/dirty.txt']);
    expect(r.out).toMatch(/first-person singular/);
    expect(r.out).toMatch(/I built this/);
    expect(r.out).toMatch(/Tell me about my number/);
  });

  it('still flags an em-dash', () => {
    const r = run(['__tests__/scorecard/fixtures/dirty.txt']);
    expect(r.out).toMatch(/em-dash/);
  });

  it('no longer flags the first-person plural, which is now the house voice', () => {
    const r = run(['__tests__/scorecard/fixtures/clean.txt']);
    expect(r.out).not.toMatch(/first-person plural/i);
    expect(r.code).toBe(0);
  });

  it('lints the three guarded scorecard surfaces by default and they pass', () => {
    const r = run([]);
    expect(r.code).toBe(0);
    expect(r.out).toMatch(/Voice lint passed/);
  });
});
