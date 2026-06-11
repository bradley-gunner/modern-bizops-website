import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StagePlacementCard from '@/components/scorecard/StagePlacementCard';

const placement = { stage: 2, name: 'Repeatable', descriptor: 'A system exists that the team can follow without you managing every interaction.' };
const binding = { failingBlock: 'B', questions: [{ id: 'q7', competencyLabel: 'revenue forecasting' }], translation: 'What you told me about your revenue forecasting is the bottleneck that shows up in the dollar gaps above.' };

describe('StagePlacementCard', () => {
  it('renders the stage number and name in the heading', () => {
    render(<StagePlacementCard placement={placement} binding={binding} />);
    expect(screen.getByText(/Stage 2: Repeatable/)).toBeInTheDocument();
    expect(screen.getByText(/A system exists/)).toBeInTheDocument();
    expect(screen.getByText(/bottleneck that shows up/)).toBeInTheDocument();
  });

  it('hides binding translation when binding is null (Stage 4)', () => {
    render(<StagePlacementCard placement={{ stage: 4, name: 'Compounding', descriptor: 'The system improves itself.' }} binding={null} />);
    expect(screen.getByText(/Stage 4: Compounding/)).toBeInTheDocument();
    expect(screen.queryByText(/bottleneck/)).not.toBeInTheDocument();
  });
});

const nextStage = {
  name: 'Repeatable',
  criteria: [
    'Everyone who touches customers uses the same CRM.',
    'Each pipeline stage has documented exit criteria.',
  ],
};

describe('StagePlacementCard next-stage preview', () => {
  it('renders the next stage name and criteria when provided', () => {
    render(<StagePlacementCard placement={placement} binding={binding} nextStage={nextStage} />);
    expect(screen.getByText(/What crossing into Repeatable looks like/i)).toBeInTheDocument();
    expect(screen.getByText(/Everyone who touches customers/)).toBeInTheDocument();
    expect(screen.getByText(/documented exit criteria/)).toBeInTheDocument();
  });

  it('hides the preview when nextStage is null (Stage 4)', () => {
    render(<StagePlacementCard placement={{ stage: 4, name: 'Compounding', descriptor: 'desc' }} binding={null} nextStage={null} />);
    expect(screen.queryByText(/What crossing into/i)).not.toBeInTheDocument();
  });

  it('hides the preview when nextStage is undefined (no prop passed)', () => {
    render(<StagePlacementCard placement={placement} binding={binding} />);
    expect(screen.queryByText(/What crossing into/i)).not.toBeInTheDocument();
  });
});
