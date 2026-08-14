import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScorecardExperience from '@/components/scorecard/ScorecardExperience';

vi.mock('@/components/UtmCapture', () => ({ default: () => null }));

describe('ScorecardExperience landing', () => {
  it('leads with the decided H1 about why AI has not stuck', () => {
    render(<ScorecardExperience />);
    expect(
      screen.getByText(/Find out why AI has not stuck in your business yet, and what it is costing you\./i)
    ).toBeInTheDocument();
  });

  it('no longer promises a dollar figure in the headline', () => {
    const { container } = render(<ScorecardExperience />);
    expect(container.textContent).not.toMatch(/Find the dollar amount/i);
    expect(screen.queryByRole('button', { name: /find your number/i })).not.toBeInTheDocument();
  });

  it('subline speaks to leaders, not founders specifically', () => {
    render(<ScorecardExperience />);
    const subhead = screen.getByText(/keep hearing what AI should be doing for them/i);
    expect(subhead.textContent).toMatch(/Built for leaders/);
    expect(subhead.textContent).not.toMatch(/Built for founders/);
  });

  it('renders the three credibility blocks', () => {
    render(<ScorecardExperience />);
    expect(screen.getByText(/What you will get back/i)).toBeInTheDocument();
    expect(screen.getByText(/What we are comparing you against/i)).toBeInTheDocument();
    expect(screen.getByText(/What this is not/i)).toBeInTheDocument();
  });

  it('the promise list follows the doc 15 Part 2 order and drops the stage promise', () => {
    render(<ScorecardExperience />);
    const promise = screen.getByText(/Why AI has or has not worked for you so far/i);
    expect(promise.textContent).toMatch(/dollar value of the gaps at your size/);
    expect(promise.textContent).toMatch(/ready to start on now/);
    expect(promise.textContent).toMatch(/public surfaces/);
    expect(promise.textContent).toMatch(/first move we would make in your seat/);
    // The retired promise.
    expect(promise.textContent).not.toMatch(/stage on the GTM Maturity Framework/i);
  });

  it('"What this is not" carries the new claim boundary and no competency count', () => {
    render(<ScorecardExperience />);
    const block = screen.getByText(/Every score here is self-reported plus observed/i);
    expect(block.textContent).toMatch(/certified framework/);
    expect(block.textContent).not.toMatch(/fifty-one|forty-four|\d+ competenc/i);
  });

  it('states the honest question count under the CTA', () => {
    render(<ScorecardExperience />);
    expect(screen.getByText(/Sixteen questions\. About five minutes\. No call\./i)).toBeInTheDocument();
  });

  it('transitions to the quiz when the CTA is clicked', () => {
    render(<ScorecardExperience />);
    fireEvent.click(screen.getByRole('button', { name: /start the scan/i }));
    expect(screen.getByText(/Section 1 of 3/)).toBeInTheDocument();
  });

  it('has no em-dash in landing copy', () => {
    const { container } = render(<ScorecardExperience />);
    expect(container.textContent).not.toMatch(/—/);
  });
});
