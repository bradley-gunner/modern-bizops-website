import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectionHeader from '@/components/scorecard/SectionHeader';

describe('SectionHeader', () => {
  it('renders the section number, label, and subline', () => {
    render(<SectionHeader section={1} />);
    expect(screen.getByText(/Section 1 of 3/)).toBeInTheDocument();
    expect(screen.getByText(/About your business/)).toBeInTheDocument();
    expect(screen.getByText(/Three questions so we know who we are comparing you to/)).toBeInTheDocument();
  });
});
