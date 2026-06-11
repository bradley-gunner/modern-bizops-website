import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionCard from '@/components/scorecard/QuestionCard';
import { QUESTIONS } from '@/lib/scorecard/questions';

describe('QuestionCard', () => {
  it('renders the prompt and four options for a maturity question', () => {
    const q = QUESTIONS.find((x) => x.id === 'q4');
    render(<QuestionCard question={q} answers={{ q2: { value: 'PROFESSIONAL_SERVICES' } }} onSelect={() => {}} />);
    expect(screen.getByText(/How do the people who touch customers/)).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
  });

  it('interpolates {model_label} into the peer anchor sentence', () => {
    const q = QUESTIONS.find((x) => x.id === 'q4');
    render(<QuestionCard question={q} answers={{ q2: { value: 'B2B_SAAS' } }} onSelect={() => {}} />);
    expect(screen.getByText(/Most B2B SaaS founders at your revenue level run on a CRM/)).toBeInTheDocument();
  });

  it('calls onSelect with the chosen option when a radio is clicked', () => {
    const q = QUESTIONS.find((x) => x.id === 'q4');
    const onSelect = vi.fn();
    render(<QuestionCard question={q} answers={{ q2: { value: 'B2B_SAAS' } }} onSelect={onSelect} />);
    fireEvent.click(screen.getAllByRole('radio')[2]); // option C, score 3
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'C', score: 3 }));
  });

  it('renders option.description under the label when present (q2)', () => {
    const q = QUESTIONS.find((x) => x.id === 'q2');
    render(<QuestionCard question={q} answers={{}} onSelect={() => {}} />);
    expect(screen.getByText(/recurring subscription software sold to other businesses/i)).toBeInTheDocument();
    expect(screen.getByText(/connecting two sides of a transaction/i)).toBeInTheDocument();
  });

  it('does not render a description span for maturity options (which lack description)', () => {
    const q4 = QUESTIONS.find((x) => x.id === 'q4');
    const { container } = render(<QuestionCard question={q4} answers={{ q2: { value: 'B2B_SAAS' } }} onSelect={() => {}} />);
    // Maturity options carry no description field; ensure we did not insert empty description nodes
    expect(container.querySelectorAll('[data-description]').length).toBe(0);
  });
});
