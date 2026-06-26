import { describe, it, expect, vi, beforeEach } from 'vitest';

const hubspotMock = {
  assertHubSpotConfigured: vi.fn(),
  ensureCustomContactProperties: vi.fn(async () => {}),
  submitHubSpotForm: vi.fn(async () => ({ ok: true })),
  markContactForReview: vi.fn(async () => true),
  findContactByEmail: vi.fn(async () => 'contact-77'),
  pickUtmProperties: vi.fn((utms) => utms || {}),
  createContactTask: vi.fn(async () => 'task-1'),
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
  hubspotMock.findContactByEmail.mockResolvedValue('contact-77');
  dealCreateCalled = false;
  global.fetch = vi.fn(async (url) => {
    if (typeof url === 'string' && url.endsWith('/crm/v3/objects/deals')) {
      dealCreateCalled = true;
    }
    return { ok: true, json: async () => ({}) };
  });
});

async function callRoute(body) {
  const { POST } = await import('@/app/api/submit-playbook-form/route');
  const req = new Request('http://test.local/api/submit-playbook-form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return POST(req);
}

describe('POST /api/submit-playbook-form', () => {
  it('submits the form with lead_magnet playbook, marks for review, no deal', async () => {
    const res = await callRoute({
      name: 'Sarah Kim',
      email: 'sarah@company.com',
      company: 'Globex',
      utms: { utm_source: 'newsletter' },
      hutk: 'ck-1',
      pageUri: 'https://modernbizops.com/playbook',
      pageName: 'Revenue Maturity Playbook',
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.contactId).toBe('contact-77');

    expect(hubspotMock.submitHubSpotForm).toHaveBeenCalledWith(
      expect.objectContaining({
        properties: expect.objectContaining({
          email: 'sarah@company.com',
          firstname: 'Sarah',
          lastname: 'Kim',
          company: 'Globex',
          lead_magnet: 'playbook',
          utm_source: 'newsletter',
        }),
        context: expect.objectContaining({ hutk: 'ck-1' }),
      })
    );
    expect(hubspotMock.markContactForReview).toHaveBeenCalledWith('contact-77');
    expect(hubspotMock.createContactTask).toHaveBeenCalled();
    expect(dealCreateCalled).toBe(false);
  });

  it('rejects missing email', async () => {
    const res = await callRoute({ name: 'No Email' });
    expect(res.status).toBe(400);
  });

  it('returns 502 when the form submission fails', async () => {
    hubspotMock.submitHubSpotForm.mockResolvedValue({ ok: false });
    const res = await callRoute({ name: 'Sarah Kim', email: 'sarah@company.com' });
    expect(res.status).toBe(502);
  });
});
