import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CtaCard from '@/components/scorecard/CtaCard';

const cta = {
  destination: '/ai-readiness-assessment',
  heading: 'The AI Revenue Audit',
  cardLines: [
    'A connected read of your CRM and revenue tools, with the numbers computed from your own records',
    'Your maturity stage and your AI readiness profile scored against the certified framework',
    'A ranked list of what to automate first',
    '$2,500, and it credits 100 percent toward your first build or your first Partner month inside 90 days',
  ],
  buttonLabel: 'See the AI Revenue Audit',
  foundingLine: 'While the founding window is open, the audit fee credits 100 percent toward your first build and founding clients get the first two months of the Care Plan included.',
  foundingHref: '/founding-clients',
  foundingLinkLabel: 'See the founding-client terms',
};

describe('CtaCard', () => {
  it('renders the heading, the four bullet lines, and the tracked audit link', () => {
    render(<CtaCard cta={cta} />);
    expect(screen.getByText(cta.heading)).toBeInTheDocument();
    for (const line of cta.cardLines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
    const link = screen.getByRole('link', { name: /see the ai revenue audit/i });
    expect(link.getAttribute('href')).toBe('/ai-readiness-assessment');
  });

  it('renders the founding-client sentence with its link', () => {
    render(<CtaCard cta={cta} />);
    expect(screen.getByText(/founding window is open/)).toBeInTheDocument();
    expect(screen.getByText(/first two months of the Care Plan included/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /see the founding-client terms/i }).getAttribute('href')
    ).toBe('/founding-clients');
  });

  it('omits the founding block when the window is closed (no foundingLine)', () => {
    const { foundingLine, ...withoutFounding } = cta;
    render(<CtaCard cta={withoutFounding} />);
    expect(screen.queryByText(/founding window/)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /founding-client terms/i })).not.toBeInTheDocument();
  });

  it('carries no UTM parameter on any internal link', () => {
    const { container } = render(<CtaCard cta={cta} />);
    for (const a of container.querySelectorAll('a')) {
      expect(a.getAttribute('href')).not.toMatch(/utm_/);
    }
  });

  it('does not render the retired focus line or fit-call copy', () => {
    const { container } = render(<CtaCard cta={cta} />);
    expect(container.textContent).not.toMatch(/stopped guessing/i);
    expect(container.textContent).not.toMatch(/20-minute fit call/i);
  });
});
