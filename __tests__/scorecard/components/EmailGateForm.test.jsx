import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmailGateForm from '@/components/scorecard/EmailGateForm';

describe('EmailGateForm', () => {
  it('renders First name, Email, Company and the optional website field', () => {
    render(<EmailGateForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/First name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Company$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company website/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show me my result/i })).toBeInTheDocument();
  });

  it('the website field is optional and carries the decided microcopy', () => {
    render(<EmailGateForm onSubmit={() => {}} />);
    const field = screen.getByLabelText(/Company website/i);
    expect(field).not.toBeRequired();
    expect(screen.getByText(/optional, and worth it/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Give us your URL and the result includes what we can see from the outside\./i)
    ).toBeInTheDocument();
  });

  it('calls onSubmit with the typed values including the website', () => {
    const onSubmit = vi.fn();
    render(<EmailGateForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/^Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Company$/i), { target: { value: 'Acme' } });
    fireEvent.change(screen.getByLabelText(/Company website/i), { target: { value: '  acme.com  ' } });
    fireEvent.click(screen.getByRole('button', { name: /show me my result/i }));
    expect(onSubmit).toHaveBeenCalledWith({
      firstName: 'Jane', email: 'jane@example.com', company: 'Acme', website: 'acme.com',
    });
  });

  it('submits an empty website when the field is left blank', () => {
    const onSubmit = vi.fn();
    render(<EmailGateForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/^Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Company$/i), { target: { value: 'Acme' } });
    fireEvent.click(screen.getByRole('button', { name: /show me my result/i }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ website: '' }));
  });

  it('heading reads "One last step before your results."', () => {
    render(<EmailGateForm onSubmit={() => {}} />);
    expect(screen.getByText(/One last step before your results/i)).toBeInTheDocument();
  });

  it('body does not promise an emailed PDF', () => {
    render(<EmailGateForm onSubmit={() => {}} />);
    expect(screen.queryByText(/PDF copy/i)).not.toBeInTheDocument();
    expect(screen.getByText(/full Scan result is on screen the moment you submit/i)).toBeInTheDocument();
  });

  it('the one-personal-note promise survives, with no em-dash', () => {
    render(<EmailGateForm onSubmit={() => {}} />);
    const footer = screen.getByText(/We will follow up with one personal note/i);
    expect(footer.textContent).toMatch(/No newsletter, no drip sequence/);
    expect(footer.textContent).toMatch(/deleted at any time/i);
    expect(footer.textContent).not.toMatch(/—/);
  });

  it('disables submit while submitting', () => {
    render(<EmailGateForm onSubmit={() => {}} submitting />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
