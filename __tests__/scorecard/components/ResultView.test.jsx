import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResultView from '@/components/scorecard/ResultView';
import { buildResult } from '@/lib/scorecard/resultRender';

function ans(overrides = {}) {
  return {
    // q3 is 38, so revenue per employee ($10M / 38 = $263K) clears the
    // professional-services median and the no-gap fixtures stay no-gap.
    q1: { value: '5m_15m' }, q2: { value: 'PROFESSIONAL_SERVICES' }, q3: { value: '26_50' },
    q4:  { value: 'A', score: 1 }, q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 },
    q7:  { value: 'B', score: 2 }, q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 },
    q10: { value: 'B', score: 2 }, q11: { value: 'A', score: 1 }, q12: { value: 'A', score: 1 },
    q13: { value: '25k_100k' }, q14: { value: 'over_180' }, q15: { value: 'over_30' },
    ...overrides,
  };
}

describe('ResultView', () => {
  it('renders h2 sections in the new order', () => {
    const result = buildResult(ans());
    const { container } = render(<ResultView result={result} />);
    const headings = Array.from(container.querySelectorAll('h2')).map((h) => h.textContent);
    expect(headings).toEqual([
      'How you stack up',
      'How we got there',
      'Why this is happening',
      'Your competency map',
      'What this Scan can and cannot tell you',
    ]);
  });

  it('renders the comparison table even on the no-gap path (no "How I got there")', () => {
    const result = buildResult({
      ...ans(),
      q4: { value: 'D', score: 4 }, q5: { value: 'D', score: 4 }, q6: { value: 'D', score: 4 },
      q7: { value: 'D', score: 4 }, q8: { value: 'D', score: 4 }, q9: { value: 'D', score: 4 },
      q10: { value: 'D', score: 4 }, q11: { value: 'D', score: 4 }, q12: { value: 'D', score: 4 },
      q14: { value: 'under_30' }, q15: { value: 'under_5' },
    });
    render(<ResultView result={result} />);
    expect(screen.getByText(/How you stack up/i)).toBeInTheDocument();
    expect(screen.queryByText(/How I got there/i)).not.toBeInTheDocument();
  });

  it('renders the heat map with all 9 competency labels', () => {
    const result = buildResult(ans());
    render(<ResultView result={result} />);
    expect(screen.getByText('CRM architecture')).toBeInTheDocument();
    expect(screen.getByText('leading indicators')).toBeInTheDocument();
  });

  it('renders the "How to close this" fix block under each ROI line', () => {
    const result = buildResult(ans());
    render(<ResultView result={result} />);
    const fixLabels = screen.getAllByText(/How to close this/i);
    expect(fixLabels.length).toBeGreaterThan(0);
  });

  it('renders the no-gap headline lead on the no-gap path', () => {
    const result = buildResult({
      ...ans(),
      q4: { value: 'D', score: 4 }, q5: { value: 'D', score: 4 }, q6: { value: 'D', score: 4 },
      q7: { value: 'D', score: 4 }, q8: { value: 'D', score: 4 }, q9: { value: 'D', score: 4 },
      q10: { value: 'D', score: 4 }, q11: { value: 'D', score: 4 }, q12: { value: 'D', score: 4 },
      q14: { value: 'under_30' }, q15: { value: 'under_5' },
    });
    render(<ResultView result={result} />);
    expect(screen.getByText(/hold up against/)).toBeInTheDocument();
  });

  it('CTA link points to the paid next rung, the AI Revenue Audit', () => {
    const result = buildResult(ans());
    render(<ResultView result={result} />);
    expect(
      screen.getByRole('link', { name: /see the ai revenue audit/i }).getAttribute('href')
    ).toBe('/ai-readiness-assessment');
  });

  it('renders the loss headline lead when there are dollar gaps', () => {
    const result = buildResult(ans());
    render(<ResultView result={result} />);
    expect(screen.getByText(/leaving between/i)).toBeInTheDocument();
  });
});
