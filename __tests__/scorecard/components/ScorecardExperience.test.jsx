import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScorecardExperience from '@/components/scorecard/ScorecardExperience';

vi.mock('@/components/UtmCapture', () => ({ default: () => null }));

describe('ScorecardExperience', () => {
  it('renders the landing headline and "Find your number" CTA on mount', () => {
    render(<ScorecardExperience />);
    expect(screen.getByText(/find the dollar amount your operating system is leaving on the table/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /find your number/i })).toBeInTheDocument();
  });

  it('renders the below-the-fold credibility framing copy', () => {
    render(<ScorecardExperience />);
    expect(screen.getByText(/What you will get back/i)).toBeInTheDocument();
    expect(screen.getByText(/What we are comparing you against/i)).toBeInTheDocument();
    expect(screen.getByText(/What this is not/i)).toBeInTheDocument();
  });

  it('transitions to the quiz when the CTA is clicked', () => {
    render(<ScorecardExperience />);
    fireEvent.click(screen.getByRole('button', { name: /find your number/i }));
    expect(screen.getByText(/Section 1 of 3/)).toBeInTheDocument();
  });

  it('has no em-dash in landing copy', () => {
    const { container } = render(<ScorecardExperience />);
    expect(container.textContent).not.toMatch(/—/);
  });

  it('renders the shorter landing headline (single sentence)', () => {
    render(<ScorecardExperience />);
    expect(screen.getByText(/Find the dollar amount your operating system is leaving on the table this year\./i)).toBeInTheDocument();
  });

  it('subhead does not restrict ICP to B2B founders', () => {
    render(<ScorecardExperience />);
    const subhead = screen.getByText(/every dollar of revenue growth requires another hire/i);
    expect(subhead).toBeInTheDocument();
    expect(subhead.textContent).not.toMatch(/B2B founders/);
  });

  it('renders the time expectation under the CTA', () => {
    render(<ScorecardExperience />);
    expect(screen.getByText(/Fifteen questions\. About five minutes\./i)).toBeInTheDocument();
  });
});
