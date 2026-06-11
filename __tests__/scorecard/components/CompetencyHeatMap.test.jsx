import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CompetencyHeatMap from '@/components/scorecard/CompetencyHeatMap';

const sample = [
  { id: 'q4', competencyLabel: 'CRM architecture', score: 1, block: 'A' },
  { id: 'q5', competencyLabel: 'lead qualification', score: 2, block: 'A' },
  { id: 'q6', competencyLabel: 'pipeline stage design', score: 3, block: 'A' },
  { id: 'q7', competencyLabel: 'revenue forecasting', score: 2, block: 'B' },
  { id: 'q8', competencyLabel: 'operating cadence and reporting', score: 2, block: 'B' },
  { id: 'q9', competencyLabel: 'shared revenue definitions', score: 4, block: 'B' },
  { id: 'q10', competencyLabel: 'win and loss analysis', score: 1, block: 'C' },
  { id: 'q11', competencyLabel: 'expansion and net revenue retention', score: 1, block: 'C' },
  { id: 'q12', competencyLabel: 'leading indicators', score: 1, block: 'C' },
];

describe('CompetencyHeatMap', () => {
  it('renders three block headings with client-facing names', () => {
    render(<CompetencyHeatMap scores={sample} />);
    expect(screen.getByText('Foundations')).toBeInTheDocument();
    expect(screen.getByText('Operating discipline')).toBeInTheDocument();
    expect(screen.getByText('Compound growth')).toBeInTheDocument();
  });

  it('renders all 9 competency labels', () => {
    render(<CompetencyHeatMap scores={sample} />);
    for (const row of sample) {
      expect(screen.getByText(row.competencyLabel)).toBeInTheDocument();
    }
  });

  it('renders the level word per row', () => {
    render(<CompetencyHeatMap scores={sample} />);
    expect(screen.getAllByText('Absent').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Functional').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Managed').length).toBeGreaterThanOrEqual(1);
  });

  it('renders 9 dot-scale rows with data-row-id and data-score attributes matching the score', () => {
    const { container } = render(<CompetencyHeatMap scores={sample} />);
    const rows = container.querySelectorAll('[data-row-id]');
    expect(rows).toHaveLength(9);
    for (const row of rows) {
      const id = row.getAttribute('data-row-id');
      const score = Number(row.getAttribute('data-score'));
      const expected = sample.find((s) => s.id === id).score;
      expect(score).toBe(expected);
    }
  });
});
