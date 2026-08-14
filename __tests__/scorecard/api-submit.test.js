import { describe, it, expect, vi, beforeEach } from 'vitest';

const hubspotMock = {
  assertHubSpotConfigured: vi.fn(),
  ensureCustomContactProperties: vi.fn(async () => {}),
  submitHubSpotForm: vi.fn(async () => ({ ok: true })),
  markContactForReview: vi.fn(async () => true),
  ensureScorecardResultProperties: vi.fn(async () => {}),
  writeScorecardResultProperties: vi.fn(async () => true),
  uploadPrivateFileToHubSpot: vi.fn(async () => ({ id: 'file-1', url: 'https://files.example/private' })),
  createContactNote: vi.fn(async () => 'note-1'),
  findContactByEmail: vi.fn(async () => 'contact-123'),
  pickUtmProperties: vi.fn((utms) => utms || {}),
  createContactTask: vi.fn(async () => 'task-1'),
  BRADLEY_OWNER_ID: '85826069',
  UTM_CUSTOM_PROPERTIES: [],
  LEAD_MAGNET_PROPERTY: { name: 'lead_magnet', type: 'enumeration' },
};

vi.mock('@/lib/hubspot', () => hubspotMock);

// Keep the route test fast + hermetic: the real PDF renderer reads fonts/logo
// off disk and pulls in @react-pdf. The PDF itself is covered by pdf.test.js.
vi.mock('@/lib/scorecard/pdfDocument', () => ({
  renderResultPdf: vi.fn(async () => Buffer.from('%PDF-1.4 mock')),
}));

// The observed pass does real network + DNS work; the route's contract with it
// is what this suite covers, so it is mocked and its own behaviour is tested
// in observed.test.js.
const observedMock = vi.hoisted(() => ({ observeWebsite: vi.fn(async () => null) }));
vi.mock('@/lib/scorecard/observed', () => observedMock);

let dealCreateCalled = false;

beforeEach(() => {
  for (const fn of Object.values(hubspotMock)) {
    if (typeof fn === 'function' && fn.mockClear) fn.mockClear();
  }
  observedMock.observeWebsite.mockReset();
  observedMock.observeWebsite.mockResolvedValue(null);
  hubspotMock.submitHubSpotForm.mockResolvedValue({ ok: true });
  hubspotMock.findContactByEmail.mockResolvedValue('contact-123');
  dealCreateCalled = false;
  global.fetch = vi.fn(async (url) => {
    if (typeof url === 'string' && url.endsWith('/crm/v3/objects/deals')) {
      dealCreateCalled = true;
    }
    return { ok: true, json: async () => ({}) };
  });
});

async function callRoute(body) {
  const { POST } = await import('@/app/api/scorecard/submit/route');
  const req = new Request('http://test.local/api/scorecard/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return POST(req);
}

function fixtureBody(overrides = {}) {
  return {
    firstName: 'Jane',
    email: 'jane@example.com',
    company: 'Acme',
    utms: { utm_source: 'linkedin', utm_medium: 'social', utm_campaign: 'maturity-scorecard' },
    hutk: 'cookie-xyz',
    pageUri: 'https://modernbizops.com/scorecard?utm_source=linkedin',
    pageName: 'AI Revenue Scan: Free 5-Minute Diagnostic | Modern BizOps',
    answers: {
      q1: { value: '5m_15m' },
      q2: { value: 'PROFESSIONAL_SERVICES' },
      q3: { value: '51_75' },
      q4: { value: 'D', score: 4 },
      q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 }, q7: { value: 'B', score: 2 },
      q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 }, q10: { value: 'C', score: 3 },
      q11: { value: 'A', score: 1 }, q12: { value: 'B', score: 2 }, q13: { value: 'C', score: 3 },
      q14: { value: '25k_100k' }, q15: { value: 'over_180' }, q16: { value: 'over_30' },
    },
    ...overrides,
  };
}

describe('POST /api/scorecard/submit', () => {
  it('submits the form with hutk + lead_magnet, marks for review, creates a task, no deal', async () => {
    const res = await callRoute(fixtureBody());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.contactId).toBe('contact-123');
    expect(json.result.band.name).toBe('Foundations First');
    expect(json.dealId).toBeUndefined();

    expect(hubspotMock.submitHubSpotForm).toHaveBeenCalledWith(
      expect.objectContaining({
        properties: expect.objectContaining({
          email: 'jane@example.com',
          firstname: 'Jane',
          company: 'Acme',
          lead_magnet: 'scorecard',
          utm_source: 'linkedin',
        }),
        context: expect.objectContaining({
          hutk: 'cookie-xyz',
          pageUri: 'https://modernbizops.com/scorecard?utm_source=linkedin',
          pageName: 'AI Revenue Scan: Free 5-Minute Diagnostic | Modern BizOps',
        }),
      })
    );
    expect(hubspotMock.markContactForReview).toHaveBeenCalledWith('contact-123');
    expect(hubspotMock.createContactTask).toHaveBeenCalled();
    expect(dealCreateCalled).toBe(false);

    expect(hubspotMock.writeScorecardResultProperties).toHaveBeenCalledWith(
      'contact-123',
      expect.objectContaining({
        scorecard_readiness_band: 'Foundations First',
        scorecard_burned_attempt: 'true',
        scorecard_business_model: 'PROFESSIONAL_SERVICES',
        scorecard_dollar_gap_total: expect.any(Number),
        scorecard_result_json: expect.any(String),
      })
    );

    expect(hubspotMock.uploadPrivateFileToHubSpot).toHaveBeenCalledWith(
      expect.objectContaining({ folderPath: '/scorecard-results' })
    );
    expect(hubspotMock.writeScorecardResultProperties).toHaveBeenCalledWith(
      'contact-123',
      { scorecard_pdf_url: 'file-1' }
    );
    expect(hubspotMock.createContactNote).toHaveBeenCalledWith(
      expect.objectContaining({ contactId: 'contact-123', attachmentIds: 'file-1' })
    );
  });

  it('leads the qualification task with the burned-attempt flag and the band', async () => {
    await callRoute(fixtureBody());
    const task = hubspotMock.createContactTask.mock.calls[0][0];
    expect(task.subject).toMatch(/BURNED ATTEMPT, Foundations First/);
    expect(task.body).toMatch(/Burned attempt: yes/);
    expect(task.body).toMatch(/Connect comfort \(q13\): 3 of 5/);
    // The retired stage vocabulary is gone from the queue signal.
    expect(task.subject).not.toMatch(/Stage \d/);
  });

  it('omits the burned marker for a never-tried respondent (negative control)', async () => {
    const body = fixtureBody();
    body.answers.q5 = { value: 'A', score: 1 };
    await callRoute(body);
    const task = hubspotMock.createContactTask.mock.calls[0][0];
    expect(task.subject).not.toMatch(/BURNED ATTEMPT/);
    expect(task.body).toMatch(/Burned attempt: no/);
  });

  it('does not run the observed pass when no website was given', async () => {
    await callRoute(fixtureBody());
    expect(observedMock.observeWebsite).not.toHaveBeenCalled();
    const props = hubspotMock.writeScorecardResultProperties.mock.calls[0][1];
    expect(props.scorecard_url_given).toBe('false');
    expect(props.website).toBeUndefined();
  });

  it('runs the observed pass and persists the website when one was given', async () => {
    observedMock.observeWebsite.mockResolvedValue({
      url: 'https://acme.com/', host: 'acme.com', status: 'ok', pageRead: true,
      analytics: { checked: true, ga4: true, gtm: false },
      adPixels: { checked: true, names: [] },
      social: { checked: true, platforms: [] },
      schema: { checked: true, types: ['Organization'] },
      emailAuth: { checked: true, domain: 'acme.com', spf: true, dmarc: false, dkim: null, missing: ['no DMARC record'] },
      freshness: { checked: false, lastPublished: null, source: null },
    });
    const res = await callRoute(fixtureBody({ website: 'acme.com' }));
    const json = await res.json();

    expect(observedMock.observeWebsite).toHaveBeenCalledWith('acme.com');
    expect(json.result.observedFindings.lines.length).toBeGreaterThan(0);

    // The website rides the contact PATCH, never the form fields: the v3 form
    // API rejects fields the form definition does not carry.
    const formProps = hubspotMock.submitHubSpotForm.mock.calls[0][0].properties;
    expect(formProps.website).toBeUndefined();
    const patched = hubspotMock.writeScorecardResultProperties.mock.calls[0][1];
    expect(patched.website).toBe('acme.com');
    expect(patched.scorecard_url_given).toBe('true');
  });

  it('still returns a result when the observed pass comes back unreadable', async () => {
    observedMock.observeWebsite.mockResolvedValue({
      url: 'https://slow.example/', host: 'slow.example', status: 'unreachable', pageRead: false,
      analytics: { checked: false }, adPixels: { checked: false }, social: { checked: false },
      schema: { checked: false }, emailAuth: { checked: false },
      freshness: { checked: false, lastPublished: null, source: null },
    });
    const res = await callRoute(fixtureBody({ website: 'slow.example' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.result.observedFindings.unreachable).toBe(true);
    expect(json.result.band.name).toBe('Foundations First');
  });

  it('returns 502 when the form submission fails', async () => {
    hubspotMock.submitHubSpotForm.mockResolvedValue({ ok: false, error: 'bad' });
    const res = await callRoute(fixtureBody());
    expect(res.status).toBe(502);
  });

  it('still returns the result when the contact never indexes, after bounded retries', async () => {
    vi.useFakeTimers();
    hubspotMock.findContactByEmail.mockResolvedValue(null);
    const p = callRoute(fixtureBody());
    await vi.runAllTimersAsync();
    const res = await p;
    vi.useRealTimers();

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.contactId).toBeNull();
    expect(hubspotMock.findContactByEmail).toHaveBeenCalledTimes(5);
    expect(hubspotMock.markContactForReview).not.toHaveBeenCalled();
    expect(hubspotMock.writeScorecardResultProperties).not.toHaveBeenCalled();
  });

  it('retries past the search-index lag and enriches once the contact appears', async () => {
    vi.useFakeTimers();
    hubspotMock.findContactByEmail
      .mockResolvedValueOnce(null)
      .mockResolvedValue('contact-123');
    const p = callRoute(fixtureBody());
    await vi.runAllTimersAsync();
    const res = await p;
    vi.useRealTimers();

    const json = await res.json();
    expect(json.contactId).toBe('contact-123');
    expect(hubspotMock.findContactByEmail).toHaveBeenCalledTimes(2);
    expect(hubspotMock.markContactForReview).toHaveBeenCalledWith('contact-123');
    expect(hubspotMock.writeScorecardResultProperties).toHaveBeenCalledWith(
      'contact-123',
      expect.objectContaining({ scorecard_readiness_band: 'Foundations First' })
    );
  });

  it('rejects missing email', async () => {
    const body = fixtureBody();
    delete body.email;
    const res = await callRoute(body);
    expect(res.status).toBe(400);
  });

  it('rejects malformed answers', async () => {
    const body = fixtureBody();
    body.answers = {};
    const res = await callRoute(body);
    expect(res.status).toBe(400);
  });

  it('accepts a payload with no q16 (churn hidden for the model)', async () => {
    const body = fixtureBody();
    body.answers.q2 = { value: 'B2B_PRODUCT' };
    delete body.answers.q16;
    const res = await callRoute(body);
    expect(res.status).toBe(200);
  });

  it('rejects a payload missing a required diagnostic answer', async () => {
    const body = fixtureBody();
    delete body.answers.q13;
    const res = await callRoute(body);
    expect(res.status).toBe(400);
  });
});
