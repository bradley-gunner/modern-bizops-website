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

describe('lint-scorecard-voice script', () => {
  it('exits 0 on a clean fixture', () => {
    const r = run(['__tests__/scorecard/fixtures/clean.txt']);
    expect(r.code).toBe(0);
  });

  it('exits non-zero on a dirty fixture', () => {
    const r = run(['__tests__/scorecard/fixtures/dirty.txt']);
    expect(r.code).not.toBe(0);
    expect(r.out).toMatch(/em-dash|first-person plural/i);
  });
});
