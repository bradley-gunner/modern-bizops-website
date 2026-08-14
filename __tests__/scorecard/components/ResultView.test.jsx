import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResultView from '@/components/scorecard/ResultView';
import { buildResult } from '@/lib/scorecard/resultRender';

// The burned buyer with dollar gaps. q3 is 63 people so revenue per employee
// falls below the professional-services median.
function ans(overrides = {}) {
  return {
    q1: { value: '5m_15m' }, q2: { value: 'PROFESSIONAL_SERVICES' }, q3: { value: '51_75' },
    q4: { value: 'D', score: 4 },
    q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 }, q7: { value: 'B', score: 2 },
    q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 }, q10: { value: 'C', score: 3 },
    q11: { value: 'A', score: 1 }, q12: { value: 'B', score: 2 }, q13: { value: 'C', score: 3 },
    q14: { value: '25k_100k' }, q15: { value: 'over_180' }, q16: { value: 'over_30' },
    ...overrides,
  };
}

// Numbers and answers that all clear: no dollar gap anywhere.
function noGapAns() {
  return ans({
    q3: { value: '26_50' },
    q5: { value: 'D', score: 4 }, q6: { value: 'E', score: 5 }, q7: { value: 'D', score: 4 },
    q8: { value: 'D', score: 4 }, q9: { value: 'E', score: 5 }, q10: { value: 'D', score: 4 },
    q11: { value: 'D', score: 4 }, q12: { value: 'D', score: 4 }, q13: { value: 'D', score: 4 },
    q15: { value: 'under_30' }, q16: { value: 'under_5' },
  });
}

const OBSERVED = {
  url: 'https://example.com/', host: 'example.com', status: 'ok', pageRead: true,
  analytics: { checked: true, ga4: true, gtm: false },
  adPixels: { checked: true, names: ['a Meta Pixel'] },
  social: { checked: true, platforms: ['LinkedIn'] },
  schema: { checked: true, types: [] },
  emailAuth: { checked: true, domain: 'example.com', spf: true, dmarc: false, dkim: null, missing: ['no DMARC record'] },
  freshness: { checked: true, lastPublished: '2026-02-10', source: 'sitemap' },
};

const AT = '2026-08-14T12:00:00.000Z';

describe('ResultView section order (doc 15 Part 5)', () => {
  it('renders the eight sections in order when every block applies', () => {
    const result = buildResult(ans(), { generatedAt: AT, observed: OBSERVED });
    const { container } = render(<ResultView result={result} />);
    const headings = Array.from(container.querySelectorAll('h2')).map((h) => h.textContent);
    expect(headings).toEqual([
      'Why it did not stick last time',
      'The belief the audit would test first',
      'What we could see from the outside',
      'How ready you are, dimension by dimension',
      'What not implementing AI is costing you',
      'Your first move, given away',
      'What we could not measure, and why that matters',
    ]);
  });

  it('leads with the readiness band as the h1, not a dollar figure', () => {
    const result = buildResult(ans(), { generatedAt: AT });
    const { container } = render(<ResultView result={result} />);
    expect(container.querySelector('h1').textContent).toBe('Foundations First');
    expect(container.textContent).not.toMatch(/leaving between/i);
    expect(screen.getByText(/based on what you told us about yourself/)).toBeInTheDocument();
  });

  it('drops the why-it-did-not-stick section for a never-tried respondent', () => {
    const result = buildResult(ans({ q5: { value: 'A', score: 1 } }), { generatedAt: AT });
    render(<ResultView result={result} />);
    expect(screen.queryByText(/Why it did not stick last time/)).not.toBeInTheDocument();
  });

  it('drops the observed section entirely when no URL was given', () => {
    const result = buildResult(ans(), { generatedAt: AT });
    render(<ResultView result={result} />);
    expect(screen.queryByText(/What we could see from the outside/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Observed from your public surfaces/)).not.toBeInTheDocument();
  });

  it('the retired sections are gone', () => {
    const result = buildResult(ans(), { generatedAt: AT });
    const { container } = render(<ResultView result={result} />);
    expect(container.textContent).not.toMatch(/Why this is happening/);
    expect(container.textContent).not.toMatch(/Your competency map/);
    expect(container.textContent).not.toMatch(/Stage \d/);
  });
});

describe('ResultView observed block', () => {
  it('renders the marker, one line per signal, and the boundary', () => {
    const result = buildResult(ans(), { generatedAt: AT, observed: OBSERVED });
    const { container } = render(<ResultView result={result} />);
    expect(screen.getByText('Observed from your public surfaces')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-observed]').length).toBeGreaterThanOrEqual(4);
    // The DMARC finding appears in the observed line AND again as the named
    // gap on the blocked follow-up verdict; both are intended.
    expect(screen.getAllByText(/no DMARC record/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/These lines are what your public surfaces show/)).toBeInTheDocument();
  });

  it('renders the graceful-absence copy for an unreachable site', () => {
    const result = buildResult(ans(), {
      generatedAt: AT,
      observed: { ...OBSERVED, status: 'unreachable', pageRead: false,
        analytics: { checked: false }, adPixels: { checked: false }, social: { checked: false },
        schema: { checked: false }, emailAuth: { checked: false },
        freshness: { checked: false, lastPublished: null, source: null } },
    });
    render(<ResultView result={result} />);
    expect(screen.getByText(/could not read your site in time/)).toBeInTheDocument();
  });
});

describe('ResultView dimension bars', () => {
  it('renders three labelled bars with means and level words', () => {
    const result = buildResult(ans(), { generatedAt: AT });
    const { container } = render(<ResultView result={result} />);
    expect(container.querySelectorAll('[data-dimension]').length).toBe(3);
    expect(screen.getByText('AI Strategy and Use-Case Alignment')).toBeInTheDocument();
    expect(screen.getByText(/1\.7 of 5/)).toBeInTheDocument();
    expect(screen.getByText('Self-reported')).toBeInTheDocument();
  });
});

describe('ResultView opportunity map', () => {
  it('renders six menu-named rows, each with a verdict and its basis', () => {
    const result = buildResult(ans(), { generatedAt: AT, observed: OBSERVED });
    const { container } = render(<ResultView result={result} />);
    const rows = container.querySelectorAll('[data-area]');
    expect(rows.length).toBe(6);
    expect(screen.getByText('Follow-up and pipeline automation')).toBeInTheDocument();
    expect(screen.getByText('Busywork automation')).toBeInTheDocument();
    expect(screen.getByText('Dead-lead reactivation')).toBeInTheDocument();
    expect(screen.getByText('Speed to lead')).toBeInTheDocument();
    expect(screen.getByText('Invoice collection')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-verdict]').length).toBe(6);
    expect(screen.getAllByText(/^Basis: /).length).toBe(6);
  });

  it('shows the arithmetic under every computed dollar row', () => {
    const result = buildResult(ans(), { generatedAt: AT });
    render(<ResultView result={result} />);
    expect(screen.getAllByText(/^The math:/).length).toBeGreaterThan(0);
  });

  it('renders the "How to close this" block on every row', () => {
    const result = buildResult(ans(), { generatedAt: AT });
    render(<ResultView result={result} />);
    expect(screen.getAllByText(/How to close this/i).length).toBe(6);
  });

  it('keeps the peer comparison table inside the section', () => {
    const result = buildResult(ans(), { generatedAt: AT });
    render(<ResultView result={result} />);
    expect(screen.getByText('The benchmarks behind the dollar lines')).toBeInTheDocument();
    expect(screen.getByText('Revenue per employee')).toBeInTheDocument();
  });

  it('the no-gap variant still renders a full map (never an empty page)', () => {
    const result = buildResult(noGapAns(), { generatedAt: AT });
    const { container } = render(<ResultView result={result} />);
    expect(screen.getByText(/Your numbers hold up against professional services peers/)).toBeInTheDocument();
    expect(container.querySelectorAll('[data-area]').length).toBe(5);
    expect(container.querySelectorAll('[data-verdict]').length).toBe(5);
    expect(container.querySelector('h1').textContent).toBe('Ready to Build');
  });
});

describe('ResultView CTA block', () => {
  it('greys the three computed dimensions and links the audit', () => {
    const result = buildResult(ans(), { generatedAt: AT });
    const { container } = render(<ResultView result={result} />);
    expect(container.querySelectorAll('[data-computed-dimension]').length).toBe(3);
    expect(screen.getByText('Data Readiness')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /see the ai revenue audit/i }).getAttribute('href')
    ).toBe('/ai-readiness-assessment');
  });

  it('renders the founding-client sentence linking /founding-clients', () => {
    const result = buildResult(ans(), { generatedAt: AT });
    render(<ResultView result={result} />);
    expect(screen.getByText(/founding window is open/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /founding-client terms/i }).getAttribute('href')
    ).toBe('/founding-clients');
  });

  it('carries no internal link with a UTM parameter', () => {
    const result = buildResult(ans(), { generatedAt: AT, observed: OBSERVED });
    const { container } = render(<ResultView result={result} />);
    for (const a of container.querySelectorAll('a[href^="/"]')) {
      expect(a.getAttribute('href')).not.toMatch(/utm_/);
    }
  });

  it('renders no em-dash anywhere on the page', () => {
    const result = buildResult(ans(), { generatedAt: AT, observed: OBSERVED });
    const { container } = render(<ResultView result={result} />);
    expect(container.textContent).not.toMatch(/—/);
  });
});
