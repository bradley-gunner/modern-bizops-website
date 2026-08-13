import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CtaCard from '@/components/scorecard/CtaCard';

const cta = {
  destination: '/ai-readiness-assessment',
  heading: 'The AI Revenue Audit',
  cardLines: [
    'A connected read of your CRM and revenue tools, computed rather than self-reported',
    'More than fifty competencies scored, against the nine this Scan asked you about',
    'A ranked list of what to automate first',
    '$2,500, and it credits 100 percent toward your first build',
  ],
  buttonLabel: 'See the AI Revenue Audit',
};

describe('CtaCard', () => {
  it('renders heading, four bullet lines, and a link to the Audit with no UTMs', () => {
    render(<CtaCard cta={cta} />);
    expect(screen.getByText(cta.heading)).toBeInTheDocument();
    for (const line of cta.cardLines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
    const link = screen.getByRole('link', { name: /see the ai revenue audit/i });
    expect(link.getAttribute('href')).toBe('/ai-readiness-assessment');
  });
});

describe('CtaCard focus line', () => {
  it('renders the personalized focusLine from cta', () => {
    const ctaWithFocus = {
      ...cta,
      focus: 'lead qualification',
      focusLine: 'The AI Revenue Audit starts where this Scan stopped guessing. It goes into your systems, measures your lead qualification gap for real, and comes back with what to automate first and what it costs.',
    };
    render(<CtaCard cta={ctaWithFocus} />);
    expect(screen.getByText(/lead qualification gap/)).toBeInTheDocument();
  });

  it('falls back to the generic focusLine when focus is null', () => {
    const ctaNoFocus = {
      ...cta,
      focus: null,
      focusLine: 'The AI Revenue Audit starts where this Scan stopped guessing. It goes into your systems, measures the real picture, and comes back with what to automate first and what it costs.',
    };
    render(<CtaCard cta={ctaNoFocus} />);
    expect(screen.getByText(/AI Revenue Audit starts where this Scan/)).toBeInTheDocument();
    expect(screen.getByText(/measures the real picture/)).toBeInTheDocument();
  });

  it('does not render the old fit-call line', () => {
    const ctaWithFocus = {
      ...cta,
      focus: 'lead qualification',
      focusLine: 'The AI Revenue Audit measures your lead qualification gap for real.',
    };
    render(<CtaCard cta={ctaWithFocus} />);
    expect(screen.queryByText(/20-minute fit call/i)).not.toBeInTheDocument();
  });
});
