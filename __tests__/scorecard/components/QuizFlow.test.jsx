import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuizFlow from '@/components/scorecard/QuizFlow';

function selectFirstOption() {
  const radios = screen.getAllByRole('radio');
  fireEvent.click(radios[0]);
}

function clickNext() {
  fireEvent.click(screen.getByRole('button', { name: /next/i }));
}

beforeEach(() => {
  global.fetch = vi.fn(async () => ({
    ok: true,
    json: async () => ({
      success: true,
      contactId: 'c-1',
      dealId: 'd-1',
      result: {
        headline: { lead: 'Your operating system is leaving between $1M and $2M on the table this year.', subline: 'subline', floorDollars: 1_000_000, medianDollars: 2_000_000, modelLabel: 'B2B SaaS' },
        roiLines: [],
        placement: { stage: 1, name: 'Reactive', descriptor: 'desc' },
        binding: null,
        brightSpots: [],
        disclosure: 'disclosure',
        cta: { destination: '/watch', heading: 'CTA', cardLines: ['a','b','c','d'], buttonLabel: 'Schedule the call' },
        modelLabel: 'B2B SaaS',
        benchmarkVersion: '1.1',
        generatedAt: 'now',
      },
    }),
  }));
});

describe('QuizFlow', () => {
  it('renders the first question on mount and disables Next until selected', () => {
    render(<QuizFlow utms={{}} />);
    expect(screen.getByText(/Section 1 of 3/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    selectFirstOption();
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
  });

  it('advances to the email gate after the last shown question', async () => {
    render(<QuizFlow utms={{}} />);
    selectFirstOption(); clickNext();
    const q2Radios = screen.getAllByRole('radio');
    const productRadio = q2Radios.find((r) => r.getAttribute('value') === 'B2B_PRODUCT');
    fireEvent.click(productRadio);
    clickNext();
    selectFirstOption(); clickNext();
    for (let i = 0; i < 9; i++) { selectFirstOption(); clickNext(); }
    selectFirstOption(); clickNext();
    fireEvent.click(screen.getAllByRole('radio')[1]); clickNext();
    await waitFor(() => expect(screen.getByText(/Where should I send your scorecard/i)).toBeInTheDocument());
  });

  it('submits the form, calls /api/scorecard/submit, and reveals the result', async () => {
    render(<QuizFlow utms={{ utm_source: 'linkedin', utm_medium: 'social' }} />);
    selectFirstOption(); clickNext();
    const q2Radios = screen.getAllByRole('radio');
    fireEvent.click(q2Radios.find((r) => r.getAttribute('value') === 'B2B_PRODUCT'));
    clickNext();
    selectFirstOption(); clickNext();
    for (let i = 0; i < 9; i++) { selectFirstOption(); clickNext(); }
    selectFirstOption(); clickNext();
    fireEvent.click(screen.getAllByRole('radio')[1]); clickNext();
    await waitFor(() => screen.getByText(/Where should I send your scorecard/i));

    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Company/i), { target: { value: 'Acme' } });
    fireEvent.click(screen.getByRole('button', { name: /show me my number/i }));

    await waitFor(() => expect(screen.getByText(/leaving between \$1M and \$2M/i)).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith('/api/scorecard/submit', expect.objectContaining({
      method: 'POST',
    }));
    const callBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(callBody.email).toBe('jane@example.com');
    expect(callBody.utms.utm_source).toBe('linkedin');
    expect(callBody.answers.q1).toBeDefined();
  });
});
