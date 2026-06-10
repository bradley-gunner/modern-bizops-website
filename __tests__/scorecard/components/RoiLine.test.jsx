import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RoiLine from '@/components/scorecard/RoiLine';

const line = {
  key: 'salesCycle',
  title: 'Sales cycle compression',
  clientValue: { display: '240 days' },
  peerMedian: { display: '103 days' },
  peerRange: { displayLow: '60 days', displayHigh: '130 days' },
  comparison: 'fails',
  comparisonCopy: 'slower than peer',
  floorDollars: 4000000,
  medianDollars: 6600000,
  body: 'At your revenue, that is between $4.0M and $6.6M of incremental closed revenue you are not capturing this year.',
  source: 'Source: businessModelBenchmarks v1.1, professional services row.',
};

describe('RoiLine', () => {
  it('renders the title, your number, peer median, range, badge, body, source', () => {
    render(<RoiLine line={line} modelLabel="professional services" />);
    expect(screen.getByText(/Sales cycle compression/)).toBeInTheDocument();
    expect(screen.getByText(/240 days/)).toBeInTheDocument();
    expect(screen.getByText(/103 days/)).toBeInTheDocument();
    expect(screen.getByText(/60 days/)).toBeInTheDocument();
    expect(screen.getByText(/slower than peer/)).toBeInTheDocument();
    expect(screen.getByText(/businessModelBenchmarks v1\.1/)).toBeInTheDocument();
  });

  it('applies the fails badge class for comparison=fails', () => {
    const { container } = render(<RoiLine line={line} modelLabel="professional services" />);
    const badge = container.querySelector('[data-comparison]');
    expect(badge.getAttribute('data-comparison')).toBe('fails');
  });
});
