import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookPageClient from '@/components/BookPageClient';
import {
  saveScanLead,
  readScanLeadPrefill,
  _SCAN_REVENUE_TO_BOOK,
  _SCAN_TEAM_TO_BOOK,
} from '@/lib/scan-lead';

// The /book prefill from a completed scan (board item book-prefill-from-scan,
// 2026-08-25). The scan's email gate persists identity + the two segmentation
// answers to sessionStorage; /book maps them onto its own select strings.

const FULL_LEAD = {
  firstName: 'Jane',
  email: 'jane@example.com',
  company: 'Acme',
  revenueBand: '5m_15m',
  teamSize: '26_50',
};

beforeEach(() => {
  sessionStorage.clear();
  window.history.replaceState({}, '', '/book');
});

describe('readScanLeadPrefill', () => {
  it('maps a full stored lead onto the /book field values', () => {
    saveScanLead(FULL_LEAD);
    expect(readScanLeadPrefill()).toEqual({
      firstName: 'Jane',
      email: 'jane@example.com',
      company: 'Acme',
      revenue: '$5M–$15M',
      teamSize: '16–30',
    });
  });

  it('covers every scan revenue band and every scan team band', () => {
    // The scan's live vocabularies, from lib/scorecard/questions.js. If a band
    // is added or renamed there without a mapping here, this fails by name.
    const scanRevenueBands = ['under_1m', '1m_3m', '3m_5m', '5m_15m', '15m_50m', '50m_plus'];
    const scanTeamBands = ['just_me', '2_10', '11_25', '26_50', '51_75', '75_plus'];
    for (const band of scanRevenueBands) {
      expect(_SCAN_REVENUE_TO_BOOK[band], `revenue band ${band}`).toBeTruthy();
    }
    for (const band of scanTeamBands) {
      expect(_SCAN_TEAM_TO_BOOK[band], `team band ${band}`).toBeTruthy();
    }
  });

  it('returns {} when nothing is stored', () => {
    expect(readScanLeadPrefill()).toEqual({});
  });

  it('returns {} on garbage JSON', () => {
    sessionStorage.setItem('scorecard:lead', '{not json');
    expect(readScanLeadPrefill()).toEqual({});
  });

  it('drops unknown band values and keeps the rest', () => {
    saveScanLead({ ...FULL_LEAD, revenueBand: 'retired_band', teamSize: undefined });
    const prefill = readScanLeadPrefill();
    expect(prefill.revenue).toBeUndefined();
    expect(prefill.teamSize).toBeUndefined();
    expect(prefill.email).toBe('jane@example.com');
  });
});

describe('BookPageClient scan prefill', () => {
  it('exposes only real select options for every mapped value', () => {
    // Drift guard: every string the mapping can produce must be a live option
    // in the rendered /book selects, or the prefill silently lands on nothing.
    render(<BookPageClient />);
    const revenueValues = Array.from(
      document.querySelector('select[name="revenue"]').options
    ).map((o) => o.value);
    const teamValues = Array.from(
      document.querySelector('select[name="teamSize"]').options
    ).map((o) => o.value);
    for (const mapped of Object.values(_SCAN_REVENUE_TO_BOOK)) {
      expect(revenueValues, `revenue option ${mapped}`).toContain(mapped);
    }
    for (const mapped of Object.values(_SCAN_TEAM_TO_BOOK)) {
      expect(teamValues, `team option ${mapped}`).toContain(mapped);
    }
  });

  it('prefills step 1 selects and step 2 identity from a stored scan', () => {
    saveScanLead(FULL_LEAD);
    render(<BookPageClient />);
    expect(document.querySelector('select[name="revenue"]').value).toBe('$5M–$15M');
    expect(document.querySelector('select[name="teamSize"]').value).toBe('16–30');

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(document.querySelector('input[name="firstName"]').value).toBe('Jane');
    expect(document.querySelector('input[name="email"]').value).toBe('jane@example.com');
    expect(document.querySelector('input[name="lastName"]').value).toBe('');
  });

  it('shows the untouched form when no scan is stored', () => {
    render(<BookPageClient />);
    expect(document.querySelector('select[name="revenue"]').value).toBe('');
    expect(document.querySelector('select[name="teamSize"]').value).toBe('');
  });

  it('lets query params win over the stored scan lead', () => {
    saveScanLead(FULL_LEAD);
    window.history.replaceState({}, '', '/book?firstname=Amy&email=amy%40example.com');
    render(<BookPageClient />);
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(document.querySelector('input[name="firstName"]').value).toBe('Amy');
    expect(document.querySelector('input[name="email"]').value).toBe('amy@example.com');
  });
});
