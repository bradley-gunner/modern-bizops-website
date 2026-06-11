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
  source: 'Source: Focus Digital Sales Cycle by Industry 2025 (Consulting 103d) (2025).',
};

describe('RoiLine', () => {
  it('renders the title, your number, peer median, range, badge, body, source', () => {
    render(<RoiLine line={line} modelLabel="professional services" />);
    expect(screen.getByText(/Sales cycle compression/)).toBeInTheDocument();
    expect(screen.getByText(/240 days/)).toBeInTheDocument();
    expect(screen.getByText(/103 days/)).toBeInTheDocument();
    expect(screen.getByText(/60 days/)).toBeInTheDocument();
    expect(screen.getByText(/slower than peer/)).toBeInTheDocument();
    expect(screen.getByText(/Focus Digital/)).toBeInTheDocument();
  });

  it('applies the fails badge class for comparison=fails', () => {
    const { container } = render(<RoiLine line={line} modelLabel="professional services" />);
    const badge = container.querySelector('[data-comparison]');
    expect(badge.getAttribute('data-comparison')).toBe('fails');
  });
});

const lineWithFix = {
  ...line,
  fix: 'Cycle time compresses when stage transitions stop being judgment calls. Rewrite your stage exit criteria as buyer-verified facts.',
};

describe('RoiLine fix paragraph', () => {
  it('renders the fix paragraph under the body', () => {
    render(<RoiLine line={lineWithFix} modelLabel="professional services" />);
    expect(screen.getByText(/Cycle time compresses/)).toBeInTheDocument();
  });

  it('renders "How to close this" label above the fix when fix is present', () => {
    render(<RoiLine line={lineWithFix} modelLabel="professional services" />);
    expect(screen.getByText(/How to close this/i)).toBeInTheDocument();
  });

  it('does not render a fix block when line.fix is missing', () => {
    render(<RoiLine line={line} modelLabel="professional services" />);
    expect(screen.queryByText(/How to close this/i)).not.toBeInTheDocument();
  });
});
