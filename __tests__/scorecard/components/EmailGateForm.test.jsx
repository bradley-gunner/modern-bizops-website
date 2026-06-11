import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmailGateForm from '@/components/scorecard/EmailGateForm';

describe('EmailGateForm', () => {
  it('renders First name, Email, Company fields and a submit button', () => {
    render(<EmailGateForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/First name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show me my number/i })).toBeInTheDocument();
  });

  it('calls onSubmit with the typed values', () => {
    const onSubmit = vi.fn();
    render(<EmailGateForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Company/i), { target: { value: 'Acme' } });
    fireEvent.click(screen.getByRole('button', { name: /show me my number/i }));
    expect(onSubmit).toHaveBeenCalledWith({ firstName: 'Jane', email: 'jane@example.com', company: 'Acme' });
  });

  it('renders the trust footer copy with no em-dash', () => {
    render(<EmailGateForm onSubmit={() => {}} />);
    const footer = screen.getByText(/scorecard and one follow-up note/i);
    expect(footer).toBeInTheDocument();
    expect(footer.textContent).not.toMatch(/—/);
  });

  it('disables submit while submitting', () => {
    render(<EmailGateForm onSubmit={() => {}} submitting />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
