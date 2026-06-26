import { describe, it, expect, vi, beforeEach } from 'vitest';

const hubspotMock = {
  assertHubSpotConfigured: vi.fn(),
  ensureCustomContactProperties: vi.fn(async () => {}),
  submitHubSpotForm: vi.fn(async () => ({ ok: true })),
  markContactForReview: vi.fn(async () => true),
  findContactByEmail: vi.fn(async () => 'contact-123'),
  pickUtmProperties: vi.fn((utms) => utms || {}),
  createContactTask: vi.fn(async () => 'task-1'),
  BRADLEY_OWNER_ID: '85826069',
  UTM_CUSTOM_PROPERTIES: [],
  LEAD_MAGNET_PROPERTY: { name: 'lead_magnet', type: 'enumeration' },
};

vi.mock('@/lib/hubspot', () => hubspotMock);

let dealCreateCalled = false;

beforeEach(() => {
  for (const fn of Object.values(hubspotMock)) {
    if (typeof fn === 'function' && fn.mockClear) fn.mockClear();
  }
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

function fixtureBody() {
  return {
    firstName: 'Jane',
    email: 'jane@example.com',
    company: 'Acme',
    utms: { utm_source: 'linkedin', utm_medium: 'social', utm_campaign: 'maturity-scorecard' },
    hutk: 'cookie-xyz',
    pageUri: 'https://modernbizops.com/scorecard?utm_source=linkedin',
    pageName: 'Revenue Growth Scorecard',
    answers: {
      q1: { value: '7m_15m' },
      q2: { value: 'PROFESSIONAL_SERVICES' },
      q3: { value: '51_75' },
      q4: { value: 'A', score: 1 }, q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 },
      q7: { value: 'B', score: 2 }, q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 },
      q10: { value: 'B', score: 2 }, q11: { value: 'A', score: 1 }, q12: { value: 'A', score: 1 },
      q13: { value: '25k_100k' }, q14: { value: 'over_180' }, q15: { value: 'over_30' },
    },
  };
}

describe('POST /api/scorecard/submit', () => {
  it('submits the form with hutk + lead_magnet, marks for review, creates a task, no deal', async () => {
    const res = await callRoute(fixtureBody());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.contactId).toBe('contact-123');
    expect(json.result).toBeDefined();
    expect(json.result.placement.stage).toBe(1);
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
          pageName: 'Revenue Growth Scorecard',
        }),
      })
    );
    expect(hubspotMock.markContactForReview).toHaveBeenCalledWith('contact-123');
    expect(hubspotMock.createContactTask).toHaveBeenCalled();
    expect(dealCreateCalled).toBe(false);
  });

  it('returns 502 when the form submission fails', async () => {
    hubspotMock.submitHubSpotForm.mockResolvedValue({ ok: false, error: 'bad' });
    const res = await callRoute(fixtureBody());
    expect(res.status).toBe(502);
  });

  it('still returns the result when the contact is not found yet', async () => {
    hubspotMock.findContactByEmail.mockResolvedValue(null);
    const res = await callRoute(fixtureBody());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.contactId).toBeNull();
    expect(hubspotMock.markContactForReview).not.toHaveBeenCalled();
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
});
