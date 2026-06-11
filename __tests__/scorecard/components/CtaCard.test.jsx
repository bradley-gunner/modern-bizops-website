import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CtaCard from '@/components/scorecard/CtaCard';

const cta = {
  destination: '/watch',
  heading: 'The Modern BizOps Maturity Assessment',
  cardLines: [
    'Automated analysis of your CRM and revenue tools',
    'All 44 competencies scored, not just nine',
    'A 90-minute working session with me to walk you through it',
    'A 12-week operational roadmap mapped to your stated business outcome',
  ],
  buttonLabel: 'Schedule the call',
};

describe('CtaCard', () => {
  it('renders heading, four bullet lines, and a link to /watch with no UTMs', () => {
    render(<CtaCard cta={cta} />);
    expect(screen.getByText(cta.heading)).toBeInTheDocument();
    for (const line of cta.cardLines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
    const link = screen.getByRole('link', { name: /schedule the call/i });
    expect(link.getAttribute('href')).toBe('/watch');
  });
});

describe('CtaCard focus line', () => {
  it('renders the personalized focusLine from cta', () => {
    const ctaWithFocus = {
      ...cta,
      focus: 'lead qualification',
      focusLine: 'Book 30 minutes. I will have read your results before the call. I will walk you through your lead qualification gap and what the first 90 days of fixing it looks like.',
    };
    render(<CtaCard cta={ctaWithFocus} />);
    expect(screen.getByText(/lead qualification gap/)).toBeInTheDocument();
  });

  it('falls back to the generic focusLine when focus is null', () => {
    const ctaNoFocus = {
      ...cta,
      focus: null,
      focusLine: 'Book 30 minutes. I will have read your results before the call. I will walk you through where to put the first 90 days of work.',
    };
    render(<CtaCard cta={ctaNoFocus} />);
    expect(screen.getByText(/Book 30 minutes/)).toBeInTheDocument();
    expect(screen.getByText(/first 90 days of work/)).toBeInTheDocument();
  });

  it('does not render the old fit-call line', () => {
    const ctaWithFocus = {
      ...cta,
      focus: 'lead qualification',
      focusLine: 'Book 30 minutes. I will walk you through your lead qualification gap.',
    };
    render(<CtaCard cta={ctaWithFocus} />);
    expect(screen.queryByText(/20-minute fit call/i)).not.toBeInTheDocument();
  });
});
