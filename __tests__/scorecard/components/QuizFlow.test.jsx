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
  beforeEach(() => {
    sessionStorage.clear();
  });

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
    await waitFor(() => expect(screen.getByText(/One last step before your results/i)).toBeInTheDocument());
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
    await waitFor(() => screen.getByText(/One last step before your results/i));

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

describe('QuizFlow sessionStorage persistence', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('persists answers and step to sessionStorage on change', () => {
    render(<QuizFlow utms={{}} />);
    selectFirstOption(); clickNext();
    const stored = sessionStorage.getItem('scorecard:state');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored);
    expect(parsed.answers).toBeDefined();
    expect(Object.keys(parsed.answers).length).toBeGreaterThan(0);
  });

  it('restores from sessionStorage on mount', () => {
    sessionStorage.setItem(
      'scorecard:state',
      JSON.stringify({
        answers: { q1: { value: 'under_1m' } },
        step: 'questions',
        currentIndex: 1,
      })
    );
    render(<QuizFlow utms={{}} />);
    // After restore, should be on q2 (index 1)
    expect(screen.getByText(/Which best describes how your business sells/)).toBeInTheDocument();
  });
});

// The revenue bands were realigned to the /book set, retiring 3m_7m, 7m_15m and
// over_15m. A session persisted before that deploy holds a q1 value no option
// matches, and every ROI generator guards on `if (!revenue) return null`, so
// resuming onto it would hand the visitor a no-gap result with nothing logged
// anywhere. These cover the discard path that prevents it.
describe('QuizFlow restore discards answers on retired option values', () => {
  const RETIRED_BAND = '7m_15m';

  beforeEach(() => {
    sessionStorage.clear();
  });

  it('restarts an in-progress session whose stored revenue band was retired', () => {
    sessionStorage.setItem(
      'scorecard:state',
      JSON.stringify({
        answers: { q1: { value: RETIRED_BAND }, q2: { value: 'B2B_SAAS' } },
        step: 'questions',
        currentIndex: 2,
      })
    );
    render(<QuizFlow utms={{}} />);
    // Back at q1, not resumed at index 2, and nothing is pre-selected.
    expect(screen.getByText('Annual revenue')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).not.toBeChecked();
    }
  });

  it('does not offer the retired band as an option after the restart', () => {
    sessionStorage.setItem(
      'scorecard:state',
      JSON.stringify({
        answers: { q1: { value: RETIRED_BAND } },
        step: 'questions',
        currentIndex: 0,
      })
    );
    render(<QuizFlow utms={{}} />);
    const values = screen.getAllByRole('radio').map((r) => r.getAttribute('value'));
    expect(values).not.toContain(RETIRED_BAND);
    expect(values).toEqual(['under_1m', '1m_3m', '3m_5m', '5m_15m', '15m_50m', '50m_plus']);
  });

  it('keeps an already-computed result, which does not depend on the stale answer', () => {
    const result = {
      headline: { lead: 'Your operating system is leaving between $1M and $2M on the table this year.', subline: 'subline', floorDollars: 1_000_000, medianDollars: 2_000_000, modelLabel: 'B2B SaaS' },
      roiLines: [],
      comparisons: [],
      placement: { stage: 1, name: 'Reactive', descriptor: 'desc' },
      nextStage: null,
      competencyScores: [],
      binding: null,
      brightSpots: [],
      disclosure: 'disclosure',
      cta: {
        destination: '/ai-readiness-assessment',
        heading: 'The AI Revenue Audit',
        cardLines: ['a', 'b', 'c', 'd'],
        buttonLabel: 'See the AI Revenue Audit',
      },
      modelLabel: 'B2B SaaS',
      benchmarkVersion: '1.2',
      generatedAt: 'now',
    };
    sessionStorage.setItem(
      'scorecard:state',
      JSON.stringify({ answers: { q1: { value: RETIRED_BAND } }, step: 'result', currentIndex: 14, result })
    );
    render(<QuizFlow utms={{}} />);
    expect(screen.getByText(/leaving between \$1M and \$2M/i)).toBeInTheDocument();
    expect(screen.queryByText('Annual revenue')).not.toBeInTheDocument();
  });

  it('still drops an answer to a question the current answers hide', () => {
    // q15 (churn) is hidden for B2B_PRODUCT. The pre-existing prune behaviour
    // has to survive the widening to option values.
    sessionStorage.setItem(
      'scorecard:state',
      JSON.stringify({
        answers: { q1: { value: 'under_1m' }, q2: { value: 'B2B_PRODUCT' }, q15: { value: 'over_30' } },
        step: 'questions',
        currentIndex: 2,
      })
    );
    render(<QuizFlow utms={{}} />);
    // q15 was dropped, so this counts as a discard and the quiz restarts.
    expect(screen.getByText('Annual revenue')).toBeInTheDocument();
  });

  it('resumes untouched when every stored answer is still live', () => {
    sessionStorage.setItem(
      'scorecard:state',
      JSON.stringify({
        answers: { q1: { value: '5m_15m' }, q2: { value: 'B2B_SAAS' } },
        step: 'questions',
        currentIndex: 2,
      })
    );
    render(<QuizFlow utms={{}} />);
    expect(screen.getByText('Total team size')).toBeInTheDocument();
  });
});
