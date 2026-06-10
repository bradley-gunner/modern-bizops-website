import { describe, it, expect } from 'vitest';
import { renderResultPdf } from '@/lib/scorecard/pdfDocument';
import { buildResult } from '@/lib/scorecard/resultRender';

function ans() {
  return {
    q1: { value: '7m_15m' },
    q2: { value: 'PROFESSIONAL_SERVICES' },
    q3: { value: '51_75' },
    q4:  { value: 'A', score: 1 }, q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 },
    q7:  { value: 'B', score: 2 }, q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 },
    q10: { value: 'B', score: 2 }, q11: { value: 'A', score: 1 }, q12: { value: 'A', score: 1 },
    q13: { value: '25k_100k' }, q14: { value: 'over_180' }, q15: { value: 'over_30' },
  };
}

describe('renderResultPdf', () => {
  it('renders a non-empty Buffer', async () => {
    const result = buildResult(ans(), { generatedAt: '2026-06-10T12:00:00.000Z' });
    const buf = await renderResultPdf(result);
    expect(buf).toBeInstanceOf(Buffer);
    expect(buf.length).toBeGreaterThan(1000);
  });

  it('Buffer starts with the PDF magic bytes (%PDF-)', async () => {
    const result = buildResult(ans(), { generatedAt: '2026-06-10T12:00:00.000Z' });
    const buf = await renderResultPdf(result);
    expect(buf.toString('utf8', 0, 5)).toBe('%PDF-');
  });
});
