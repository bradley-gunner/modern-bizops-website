import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResultView from '@/components/scorecard/ResultView';
import { buildResult } from '@/lib/scorecard/resultRender';

function ans() {
  return {
    q1: { value: '7m_15m' }, q2: { value: 'PROFESSIONAL_SERVICES' }, q3: { value: '51_75' },
    q4:  { value: 'A', score: 1 }, q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 },
    q7:  { value: 'B', score: 2 }, q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 },
    q10: { value: 'B', score: 2 }, q11: { value: 'A', score: 1 }, q12: { value: 'A', score: 1 },
    q13: { value: '25k_100k' }, q14: { value: 'over_180' }, q15: { value: 'over_30' },
  };
}

describe('ResultView', () => {
  it('renders headline, ROI lines, placement, disclosure, CTA', () => {
    const result = buildResult(ans());
    render(<ResultView result={result} />);
    expect(screen.getByText(/leaving between/i)).toBeInTheDocument();
    expect(screen.getByText(/Stage 1: Reactive/)).toBeInTheDocument();
    expect(screen.getByText(/directional read from sixteen questions/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /schedule the call/i }).getAttribute('href')).toBe('/watch');
  });

  it('does not render a roi section when roiLines is empty', () => {
    const result = buildResult({
      ...ans(),
      q4: { value: 'D', score: 4 }, q5: { value: 'D', score: 4 }, q6: { value: 'D', score: 4 },
      q7: { value: 'D', score: 4 }, q8: { value: 'D', score: 4 }, q9: { value: 'D', score: 4 },
      q10: { value: 'D', score: 4 }, q11: { value: 'D', score: 4 }, q12: { value: 'D', score: 4 },
      q14: { value: 'under_30' }, q15: { value: 'under_5' },
    });
    render(<ResultView result={result} />);
    expect(screen.queryByText(/How I got there/i)).not.toBeInTheDocument();
  });
});
