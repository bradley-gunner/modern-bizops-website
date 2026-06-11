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
    expect(screen.getByText(/What I am comparing you against/i)).toBeInTheDocument();
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
});
