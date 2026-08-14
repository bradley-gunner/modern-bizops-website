import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionCard from '@/components/scorecard/QuestionCard';
import { QUESTIONS } from '@/lib/scorecard/questions';

const q = (id) => QUESTIONS.find((x) => x.id === id);

describe('QuestionCard', () => {
  it('renders a diagnostic question with five options', () => {
    render(<QuestionCard question={q('q5')} onSelect={() => {}} onExact={() => {}} />);
    expect(screen.getByText(/Where is AI actually being used in your go-to-market today\?/)).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  it('calls onSelect with the chosen option and its 1..5 score', () => {
    const onSelect = vi.fn();
    render(<QuestionCard question={q('q5')} onSelect={onSelect} onExact={() => {}} />);
    fireEvent.click(screen.getAllByRole('radio')[4]);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'E', score: 5 }));
  });

  it('renders the burned-attempt option in the respondent voice, verbatim', () => {
    render(<QuestionCard question={q('q5')} onSelect={() => {}} onExact={() => {}} />);
    expect(screen.getByText('We tried a tool or two, but they did not stick.')).toBeInTheDocument();
  });

  it('renders option.description under the label when present (q2)', () => {
    render(<QuestionCard question={q('q2')} onSelect={() => {}} onExact={() => {}} />);
    expect(screen.getByText(/recurring subscription software sold to other businesses/i)).toBeInTheDocument();
    expect(screen.getByText(/connecting two sides of a transaction/i)).toBeInTheDocument();
  });

  it('does not insert empty description nodes for diagnostic options', () => {
    const { container } = render(<QuestionCard question={q('q5')} onSelect={() => {}} onExact={() => {}} />);
    expect(container.querySelectorAll('[data-description]').length).toBe(0);
  });
});

describe('QuestionCard optional exact entry', () => {
  it('does not offer exact entry before a band is chosen', () => {
    render(<QuestionCard question={q('q1')} onSelect={() => {}} onExact={() => {}} />);
    expect(screen.queryByLabelText(/Know the exact figure/i)).not.toBeInTheDocument();
  });

  it('offers exact entry once a band is chosen on a financial input', () => {
    render(<QuestionCard question={q('q1')} selected={{ value: '5m_15m' }} onSelect={() => {}} onExact={() => {}} />);
    expect(screen.getByLabelText(/Know the exact figure\? Annual revenue/i)).toBeInTheDocument();
  });

  it('never offers exact entry on a diagnostic question', () => {
    render(<QuestionCard question={q('q5')} selected={{ value: 'B', score: 2 }} onSelect={() => {}} onExact={() => {}} />);
    expect(screen.queryByLabelText(/Know the exact/i)).not.toBeInTheDocument();
  });

  it('never offers exact entry on a not-tracked answer', () => {
    render(<QuestionCard question={q('q15')} selected={{ value: 'not_tracked' }} onSelect={() => {}} onExact={() => {}} />);
    expect(screen.queryByLabelText(/Know the exact/i)).not.toBeInTheDocument();
  });

  it('parses a typed figure, stripping currency punctuation', () => {
    const onExact = vi.fn();
    render(<QuestionCard question={q('q1')} selected={{ value: '5m_15m' }} onSelect={() => {}} onExact={onExact} />);
    fireEvent.change(screen.getByLabelText(/Know the exact figure/i), { target: { value: '7,250,000' } });
    expect(onExact).toHaveBeenLastCalledWith(7_250_000);
  });

  it('converts a typed percentage to the ratio the math uses', () => {
    const onExact = vi.fn();
    render(<QuestionCard question={q('q16')} selected={{ value: '5_15' }} onSelect={() => {}} onExact={onExact} />);
    fireEvent.change(screen.getByLabelText(/Know the exact percentage/i), { target: { value: '18' } });
    expect(onExact).toHaveBeenLastCalledWith(0.18);
  });

  it('clearing the field reports undefined so the band midpoint takes over again', () => {
    const onExact = vi.fn();
    render(<QuestionCard question={q('q1')} selected={{ value: '5m_15m' }} onSelect={() => {}} onExact={onExact} />);
    const input = screen.getByLabelText(/Know the exact figure/i);
    fireEvent.change(input, { target: { value: '7250000' } });
    fireEvent.change(input, { target: { value: '' } });
    expect(onExact).toHaveBeenLastCalledWith(undefined);
  });

  it('restores a previously typed figure when the taker navigates back', () => {
    render(<QuestionCard question={q('q1')} selected={{ value: '5m_15m', exact: 7_250_000 }} onSelect={() => {}} onExact={() => {}} />);
    expect(screen.getByLabelText(/Know the exact figure/i).value).toBe('7250000');
  });
});
