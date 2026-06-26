import { describe, it, expect, vi, beforeEach } from 'vitest';

const hubspotMock = {
  assertHubSpotConfigured: vi.fn(),
  findContactByEmail: vi.fn(async () => 'contact-5'),
  markContactForReview: vi.fn(async () => true),
  createContactTask: vi.fn(async () => 'task-1'),
};

vi.mock('@/lib/hubspot', () => hubspotMock);

let dealCreateCalled = false;

beforeEach(() => {
  for (const fn of Object.values(hubspotMock)) {
    if (typeof fn === 'function' && fn.mockClear) fn.mockClear();
  }
  hubspotMock.findContactByEmail.mockResolvedValue('contact-5');
  dealCreateCalled = false;
  global.fetch = vi.fn(async (url) => {
    if (typeof url === 'string' && url.endsWith('/crm/v3/objects/deals')) {
      dealCreateCalled = true;
    }
    return { ok: true, json: async () => ({}) };
  });
});

async function callRoute(body) {
  const { POST } = await import('@/app/api/capture-watch-lead/route');
  const req = new Request('http://test.local/api/capture-watch-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return POST(req);
}

describe('POST /api/capture-watch-lead', () => {
  it('marks the booked contact for review and creates a task, no deal', async () => {
    const res = await callRoute({ email: 'marcus@co.com', firstName: 'Marcus', lastName: 'Chen' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.contactId).toBe('contact-5');
    expect(hubspotMock.markContactForReview).toHaveBeenCalledWith('contact-5');
    expect(hubspotMock.createContactTask).toHaveBeenCalled();
    expect(dealCreateCalled).toBe(false);
  });

  it('returns contact_not_found when Meetings has not created the contact yet', async () => {
    hubspotMock.findContactByEmail.mockResolvedValue(null);
    const res = await callRoute({ email: 'late@co.com' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.reason).toBe('contact_not_found');
    expect(hubspotMock.markContactForReview).not.toHaveBeenCalled();
  });

  it('rejects missing email', async () => {
    const res = await callRoute({});
    expect(res.status).toBe(400);
  });
});
