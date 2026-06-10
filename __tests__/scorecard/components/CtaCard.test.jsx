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
