import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuizFlow from '@/components/scorecard/QuizFlow';
import { buildResult } from '@/lib/scorecard/resultRender';

function selectFirstOption() {
  fireEvent.click(screen.getAllByRole('radio')[0]);
}

function clickNext() {
  fireEvent.click(screen.getByRole('button', { name: /next/i }));
}

// A real result payload, so the test cannot pass against a shape the render
// no longer produces.
const RESULT = buildResult(
  {
    q1: { value: '5m_15m' }, q2: { value: 'B2B_PRODUCT' }, q3: { value: '51_75' },
    q4: { value: 'B', score: 2 },
    q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 }, q7: { value: 'B', score: 2 },
    q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 }, q10: { value: 'B', score: 2 },
    q11: { value: 'A', score: 1 }, q12: { value: 'B', score: 2 }, q13: { value: 'B', score: 2 },
    q14: { value: '25k_100k' }, q15: { value: 'over_180' },
  },
  { generatedAt: '2026-08-14T12:00:00.000Z' }
);

// B2B_PRODUCT hides the churn question, so the flow is 15 questions long.
function answerEveryQuestion() {
  selectFirstOption(); clickNext();                            // q1 revenue
  const q2 = screen.getAllByRole('radio');
  fireEvent.click(q2.find((r) => r.getAttribute('value') === 'B2B_PRODUCT'));
  clickNext();                                                 // q2 model
  for (let i = 0; i < 13; i++) { selectFirstOption(); clickNext(); } // q3..q15
}

beforeEach(() => {
  sessionStorage.clear();
  global.fetch = vi.fn(async () => ({
    ok: true,
    json: async () => ({ success: true, contactId: 'c-1', result: RESULT }),
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
    answerEveryQuestion();
    await waitFor(() =>
      expect(screen.getByText(/One last step before your results/i)).toBeInTheDocument()
    );
  });

  it('submits to the API and reveals the readiness band', async () => {
    render(<QuizFlow utms={{ utm_source: 'linkedin', utm_medium: 'social' }} />);
    answerEveryQuestion();
    await waitFor(() => screen.getByText(/One last step before your results/i));

    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/^Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Company$/i), { target: { value: 'Acme' } });
    fireEvent.change(screen.getByLabelText(/Company website/i), { target: { value: 'acme.com' } });
    fireEvent.click(screen.getByRole('button', { name: /show me my result/i }));

    await waitFor(() => expect(screen.getByText(RESULT.band.name)).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith('/api/scorecard/submit', expect.objectContaining({ method: 'POST' }));
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.email).toBe('jane@example.com');
    expect(body.website).toBe('acme.com');
    expect(body.utms.utm_source).toBe('linkedin');
    expect(body.answers.q1).toBeDefined();
    expect(body.answers.q13).toBeDefined();
  });

  it('carries a typed exact figure through to the submitted answers', async () => {
    render(<QuizFlow utms={{}} />);
    selectFirstOption(); // q1 band chosen, exact entry appears
    fireEvent.change(screen.getByLabelText(/Know the exact figure/i), { target: { value: '7250000' } });
    clickNext();
    const q2 = screen.getAllByRole('radio');
    fireEvent.click(q2.find((r) => r.getAttribute('value') === 'B2B_PRODUCT'));
    clickNext();
    for (let i = 0; i < 13; i++) { selectFirstOption(); clickNext(); }
    await waitFor(() => screen.getByText(/One last step before your results/i));

    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/^Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Company$/i), { target: { value: 'Acme' } });
    fireEvent.click(screen.getByRole('button', { name: /show me my result/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.answers.q1.exact).toBe(7_250_000);
  });
});

describe('QuizFlow sessionStorage persistence', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('persists answers and step to sessionStorage on change', () => {
    render(<QuizFlow utms={{}} />);
    selectFirstOption(); clickNext();
    const parsed = JSON.parse(sessionStorage.getItem('scorecard:state'));
    expect(Object.keys(parsed.answers).length).toBeGreaterThan(0);
  });

  it('restores from sessionStorage on mount', () => {
    sessionStorage.setItem(
      'scorecard:state',
      JSON.stringify({ answers: { q1: { value: 'under_1m' } }, step: 'questions', currentIndex: 1 })
    );
    render(<QuizFlow utms={{}} />);
    expect(screen.getByText(/Which best describes how your business sells/)).toBeInTheDocument();
  });

  it('saves the /book prefill identity only on an accepted submit', async () => {
    render(<QuizFlow utms={{}} />);
    answerEveryQuestion();
    await waitFor(() => screen.getByText(/One last step before your results/i));

    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/^Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Company$/i), { target: { value: 'Acme' } });
    expect(sessionStorage.getItem('scorecard:lead')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /show me my result/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    await waitFor(() =>
      expect(JSON.parse(sessionStorage.getItem('scorecard:lead'))).toEqual({
        firstName: 'Jane',
        email: 'jane@example.com',
        company: 'Acme',
        revenueBand: 'under_1m', // first option on q1
        teamSize: 'just_me', // first option on q3
      })
    );
  });
});

// The revenue bands were realigned to the /book set, retiring 3m_7m, 7m_15m and
// over_15m. A session persisted before that deploy holds a q1 value no option
// matches, and every ROI generator guards on a missing revenue, so resuming
// onto it would hand the visitor a no-gap result with nothing logged anywhere.
// These cover the discard path that prevents it.
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
    expect(screen.getByText('Annual revenue')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).not.toBeChecked();
    }
  });

  it('does not offer the retired band as an option after the restart', () => {
    sessionStorage.setItem(
      'scorecard:state',
      JSON.stringify({ answers: { q1: { value: RETIRED_BAND } }, step: 'questions', currentIndex: 0 })
    );
    render(<QuizFlow utms={{}} />);
    const values = screen.getAllByRole('radio').map((r) => r.getAttribute('value'));
    expect(values).not.toContain(RETIRED_BAND);
    expect(values).toEqual(['under_1m', '1m_3m', '3m_5m', '5m_15m', '15m_50m', '50m_plus']);
  });

  it('keeps an already-computed result, which does not depend on the stale answer', () => {
    sessionStorage.setItem(
      'scorecard:state',
      JSON.stringify({ answers: { q1: { value: RETIRED_BAND } }, step: 'result', currentIndex: 15, result: RESULT })
    );
    render(<QuizFlow utms={{}} />);
    expect(screen.getByText(RESULT.band.name)).toBeInTheDocument();
    expect(screen.queryByText('Annual revenue')).not.toBeInTheDocument();
  });

  it('still drops an answer to a question the current answers hide', () => {
    // q16 (churn) is hidden for B2B_PRODUCT. The prune behaviour has to survive
    // the renumbering.
    sessionStorage.setItem(
      'scorecard:state',
      JSON.stringify({
        answers: { q1: { value: 'under_1m' }, q2: { value: 'B2B_PRODUCT' }, q16: { value: 'over_30' } },
        step: 'questions',
        currentIndex: 2,
      })
    );
    render(<QuizFlow utms={{}} />);
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
