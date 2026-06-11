import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComparisonTable from '@/components/scorecard/ComparisonTable';

const rows = [
  {
    key: 'revenuePerEmployee',
    label: 'Revenue per employee',
    clientDisplay: '$125K per employee',
    peerMedianDisplay: '$130K per employee',
    peerRangeDisplay: '$100K to $200K',
    comparison: 'partial',
    comparisonCopy: 'below peer median',
    source: 'Source: SaaS Capital 2025 Revenue per Employee Benchmarks (private SaaS, n=1000+) (2025).',
  },
  {
    key: 'salesCycle',
    label: 'Sales cycle (first qualified conversation to close)',
    clientDisplay: '30 to 90 days',
    peerMedianDisplay: '84 days',
    peerRangeDisplay: '30 days to 120 days',
    comparison: 'meets',
    comparisonCopy: 'at or faster than peer',
    source: 'Source: Optifai B2B SaaS Sales Cycle Benchmark (n=939) (2025).',
  },
  {
    key: 'retention',
    label: 'Gross revenue retention',
    clientDisplay: '60%',
    peerMedianDisplay: '90%',
    peerRangeDisplay: '82% to 95%',
    comparison: 'fails',
    comparisonCopy: 'below peer',
    source: 'Source: SaaS Capital 2026 Net Revenue Retention research brief (2026).',
  },
];

describe('ComparisonTable', () => {
  it('renders a row per comparison entry with all columns', () => {
    render(<ComparisonTable rows={rows} />);
    for (const r of rows) {
      expect(screen.getByText(r.label)).toBeInTheDocument();
      expect(screen.getByText(r.clientDisplay)).toBeInTheDocument();
      expect(screen.getByText(r.peerMedianDisplay)).toBeInTheDocument();
    }
  });

  it('renders the comparison badge with data-comparison attribute', () => {
    const { container } = render(<ComparisonTable rows={rows} />);
    const badges = container.querySelectorAll('[data-comparison]');
    expect(badges).toHaveLength(3);
    const values = Array.from(badges).map((b) => b.getAttribute('data-comparison'));
    expect(values).toEqual(['partial', 'meets', 'fails']);
  });

  it('renders nothing when rows is empty', () => {
    const { container } = render(<ComparisonTable rows={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when rows is undefined', () => {
    const { container } = render(<ComparisonTable rows={undefined} />);
    expect(container.firstChild).toBeNull();
  });
});
