# Attribution at Source + Lead Qualification Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Route scorecard and playbook lead capture through the HubSpot Forms API with the visitor's `hubspotutk` cookie so HubSpot attributes Original Source correctly, and stop auto-creating deals on any lead-capture path so deals are created manually after Bradley qualifies.

**Architecture:** A new `submitHubSpotForm` helper posts to HubSpot's non-secure Forms integration endpoint; the `hutk` cookie attaches the visitor session so attribution is set on contact create. The form submission replaces the bare Contacts API upsert as the contact-create step on the scorecard and playbook routes, followed by a `markContactForReview` PATCH (lifecycle Lead, `hs_lead_status` NEW) and the existing notification task. All deal-creation code is removed from the scorecard route and both watch routes; the qualifying-property writes on the watch path are preserved.

**Tech Stack:** Next.js App Router (route handlers), Vitest + jsdom, HubSpot CRM v3 API + Forms v3 integration submit, private-app token auth.

---

## File Structure

**Create:**
- `lib/hubspot-client.js` - client-only `hubspotutk` cookie reader.
- `scripts/setup-hubspot-forms.mjs` - one-time form-creation script (operational, not unit tested).
- `app/api/capture-watch-lead/route.js` - repurposed watch booking route (no deal).
- `__tests__/lib/hubspot.test.js` - unit tests for `submitHubSpotForm` + `markContactForReview`.
- `__tests__/lib/hubspot-client.test.js` - unit test for `getHubspotutk`.
- `__tests__/api/submit-playbook-form.test.js`
- `__tests__/api/capture-watch-lead.test.js`
- `__tests__/api/qualify-watch-lead.test.js`

**Modify:**
- `lib/hubspot.js` - add env consts, `submitHubSpotForm`, `markContactForReview`. Keep all existing deal constants/helpers (still used for manual deal creation and by `hubspot-constants.test.js`).
- `app/api/scorecard/submit/route.js` - form submission + review marking, remove deal block.
- `app/api/submit-playbook-form/route.js` - form submission + review marking.
- `app/api/qualify-watch-lead/route.js` - remove deal find/upgrade/create, keep property writes, add review marking.
- `components/scorecard/QuizFlow.jsx` - pass `hutk`, `pageUri`, `pageName`.
- `app/playbook/PlaybookForm.js` - pass `hutk`, `pageUri`, `pageName`.
- `components/HubSpotMeetingRedirect.jsx` - call `/api/capture-watch-lead`.
- `__tests__/scorecard/api-submit.test.js` - rewrite for new behavior.

**Delete:**
- `app/api/create-watch-deal/route.js` - replaced by `capture-watch-lead`.

---

## Task 1: HubSpot form-submission and review helpers

**Files:**
- Modify: `lib/hubspot.js`
- Test: `__tests__/lib/hubspot.test.js`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/hubspot.test.js`:

```js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('submitHubSpotForm', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.HUBSPOT_PORTAL_ID = '111';
    process.env.HUBSPOT_LEAD_FORM_GUID = 'guid-abc';
    process.env.HUBSPOT_API_KEY = 'test-token';
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('posts non-empty fields and context to the hsforms integration endpoint', async () => {
    let calledUrl = null;
    let calledBody = null;
    global.fetch = vi.fn(async (url, opts) => {
      calledUrl = url;
      calledBody = JSON.parse(opts.body);
      return { ok: true, json: async () => ({}) };
    });
    const { submitHubSpotForm } = await import('@/lib/hubspot');
    const res = await submitHubSpotForm({
      properties: { email: 'a@b.com', firstname: 'Jane', company: '', lead_magnet: 'scorecard' },
      context: { hutk: 'cookie-1', pageUri: 'https://x/scorecard', pageName: 'Scorecard' },
    });

    expect(res.ok).toBe(true);
    expect(calledUrl).toBe(
      'https://api.hsforms.com/submissions/v3/integration/submit/111/guid-abc'
    );
    // empty `company` is dropped
    expect(calledBody.fields).toEqual([
      { name: 'email', value: 'a@b.com' },
      { name: 'firstname', value: 'Jane' },
      { name: 'lead_magnet', value: 'scorecard' },
    ]);
    expect(calledBody.context).toEqual({
      hutk: 'cookie-1',
      pageUri: 'https://x/scorecard',
      pageName: 'Scorecard',
    });
  });

  it('omits hutk from context when not provided', async () => {
    let calledBody = null;
    global.fetch = vi.fn(async (url, opts) => {
      calledBody = JSON.parse(opts.body);
      return { ok: true, json: async () => ({}) };
    });
    const { submitHubSpotForm } = await import('@/lib/hubspot');
    await submitHubSpotForm({
      properties: { email: 'a@b.com' },
      context: { pageUri: 'https://x', pageName: 'X' },
    });
    expect(calledBody.context.hutk).toBeUndefined();
    expect(calledBody.context.pageUri).toBe('https://x');
  });

  it('returns ok:false and logs when the endpoint errors', async () => {
    global.fetch = vi.fn(async () => ({ ok: false, text: async () => 'bad form' }));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { submitHubSpotForm } = await import('@/lib/hubspot');
    const res = await submitHubSpotForm({ properties: { email: 'a@b.com' }, context: {} });
    expect(res.ok).toBe(false);
  });
});

describe('markContactForReview', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.HUBSPOT_API_KEY = 'test-token';
  });

  it('PATCHes lifecyclestage lead and hs_lead_status NEW', async () => {
    let calledUrl = null;
    let calledBody = null;
    global.fetch = vi.fn(async (url, opts) => {
      calledUrl = url;
      calledBody = JSON.parse(opts.body);
      return { ok: true, json: async () => ({}) };
    });
    const { markContactForReview } = await import('@/lib/hubspot');
    const ok = await markContactForReview('contact-9');
    expect(ok).toBe(true);
    expect(calledUrl).toBe('https://api.hubapi.com/crm/v3/objects/contacts/contact-9');
    expect(calledBody.properties).toEqual({ lifecyclestage: 'lead', hs_lead_status: 'NEW' });
  });

  it('returns false for a missing contactId without calling fetch', async () => {
    global.fetch = vi.fn();
    const { markContactForReview } = await import('@/lib/hubspot');
    const ok = await markContactForReview(null);
    expect(ok).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/lib/hubspot.test.js`
Expected: FAIL with `submitHubSpotForm is not a function` (and `markContactForReview is not a function`).

- [ ] **Step 3: Add env consts and both helpers to `lib/hubspot.js`**

After the existing `export const HUBSPOT_BASE = "https://api.hubapi.com";` line (near the top), add:

```js
// Forms API config for at-source attribution. The non-secure integration
// submit endpoint accepts the visitor's hubspotutk cookie in context, which is
// what lets HubSpot set a real Original Source instead of INTEGRATION. Both
// values come from scripts/setup-hubspot-forms.mjs and live in .env.local.
export const HUBSPOT_PORTAL_ID = process.env.HUBSPOT_PORTAL_ID;
export const HUBSPOT_LEAD_FORM_GUID = process.env.HUBSPOT_LEAD_FORM_GUID;
```

At the end of the file (after `createContactTask`), add:

```js
/**
 * Submit a lead to the shared HubSpot form via the non-secure Forms
 * integration endpoint. The hubspotutk cookie passed in context.hutk attaches
 * the visitor's session so HubSpot attributes Original Source on contact
 * create. `properties` is a flat object; empty/non-string values are dropped.
 * Returns { ok } so callers can decide whether to continue.
 */
export async function submitHubSpotForm({ properties, context }) {
  if (!HUBSPOT_PORTAL_ID || !HUBSPOT_LEAD_FORM_GUID) {
    throw new Error(
      "HUBSPOT_PORTAL_ID and HUBSPOT_LEAD_FORM_GUID must be set (run scripts/setup-hubspot-forms.mjs)"
    );
  }

  const fields = Object.entries(properties || {})
    .filter(([, v]) => typeof v === "string" && v.trim() !== "")
    .map(([name, value]) => ({ name, value }));

  const ctx = {};
  if (context?.hutk) ctx.hutk = context.hutk;
  if (context?.pageUri) ctx.pageUri = context.pageUri;
  if (context?.pageName) ctx.pageName = context.pageName;

  const res = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_LEAD_FORM_GUID}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields, context: ctx }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("[submitHubSpotForm] submission failed:", err);
    return { ok: false, error: err };
  }
  return { ok: true };
}

/**
 * Mark a contact as a new lead awaiting manual qualification: lifecycle stage
 * Lead, hs_lead_status NEW. A PATCH does not re-stamp Original Source, so any
 * attribution set on create survives. Non-fatal: returns false on failure.
 */
export async function markContactForReview(contactId) {
  if (!contactId) return false;
  const res = await fetch(
    `${HUBSPOT_BASE}/crm/v3/objects/contacts/${contactId}`,
    {
      method: "PATCH",
      headers: hsHeaders(),
      body: JSON.stringify({
        properties: { lifecyclestage: "lead", hs_lead_status: "NEW" },
      }),
    }
  );
  if (!res.ok) {
    console.error("[markContactForReview] failed:", await res.text());
    return false;
  }
  return true;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/lib/hubspot.test.js`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/hubspot.js __tests__/lib/hubspot.test.js
git commit -m "feat(hubspot): add Forms API submit and mark-for-review helpers"
```

---

## Task 2: Client-side hubspotutk cookie reader

**Files:**
- Create: `lib/hubspot-client.js`
- Test: `__tests__/lib/hubspot-client.test.js`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/hubspot-client.test.js`:

```js
import { describe, it, expect, afterEach } from 'vitest';
import { getHubspotutk } from '@/lib/hubspot-client';

describe('getHubspotutk', () => {
  afterEach(() => {
    // clear any cookies set during a test
    document.cookie = 'hubspotutk=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });

  it('returns the hubspotutk cookie value when present', () => {
    document.cookie = 'foo=bar';
    document.cookie = 'hubspotutk=abc123def';
    expect(getHubspotutk()).toBe('abc123def');
  });

  it('returns empty string when the cookie is absent', () => {
    expect(getHubspotutk()).toBe('');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/lib/hubspot-client.test.js`
Expected: FAIL with `Failed to resolve import "@/lib/hubspot-client"`.

- [ ] **Step 3: Create `lib/hubspot-client.js`**

```js
// Client-only helper. Reads the HubSpot tracking cookie (hubspotutk) that the
// HubSpot tracking script sets in the browser. We forward this to our form
// routes so the server-side Forms API submission can attach the visitor's
// session for at-source attribution. Returns "" when unavailable (SSR, cookie
// blocked, or not yet set).
export function getHubspotutk() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/lib/hubspot-client.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/hubspot-client.js __tests__/lib/hubspot-client.test.js
git commit -m "feat(hubspot): add client hubspotutk cookie reader"
```

---

## Task 3: Scorecard route - form submission, no deal

**Files:**
- Modify: `app/api/scorecard/submit/route.js`
- Test (rewrite): `__tests__/scorecard/api-submit.test.js`

- [ ] **Step 1: Rewrite the failing test**

Replace the entire contents of `__tests__/scorecard/api-submit.test.js` with:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/scorecard/api-submit.test.js`
Expected: FAIL (route still upserts + creates a deal; `submitHubSpotForm` not called).

- [ ] **Step 3: Rewrite `app/api/scorecard/submit/route.js`**

Replace the entire file with:

```js
import { NextResponse } from 'next/server';
import {
  assertHubSpotConfigured,
  ensureCustomContactProperties,
  submitHubSpotForm,
  markContactForReview,
  findContactByEmail,
  pickUtmProperties,
  createContactTask,
  BRADLEY_OWNER_ID,
  UTM_CUSTOM_PROPERTIES,
  LEAD_MAGNET_PROPERTY,
} from '@/lib/hubspot';
import { buildResult } from '@/lib/scorecard/resultRender';

let propertiesEnsured = false;

const REQUIRED_ANSWER_IDS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14'];

function validateAnswers(answers) {
  if (!answers || typeof answers !== 'object') return false;
  for (const id of REQUIRED_ANSWER_IDS) {
    if (!answers[id] || typeof answers[id].value !== 'string') return false;
  }
  return true;
}

export async function POST(request) {
  try {
    assertHubSpotConfigured();

    const body = await request.json();
    const { firstName, email, company, utms, answers, hutk, pageUri, pageName } = body || {};

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!validateAnswers(answers)) {
      return NextResponse.json({ error: 'Answers payload is malformed' }, { status: 400 });
    }

    if (!propertiesEnsured) {
      await ensureCustomContactProperties([
        ...UTM_CUSTOM_PROPERTIES,
        LEAD_MAGNET_PROPERTY,
      ]);
      propertiesEnsured = true;
    }

    // Submit through the HubSpot form so the hutk cookie attaches the visitor
    // session and HubSpot sets a real Original Source. This creates/updates the
    // contact; we do NOT create a deal (deals are made manually after Bradley
    // qualifies the lead).
    const submission = await submitHubSpotForm({
      properties: {
        email,
        firstname: firstName || '',
        company: company || '',
        lead_magnet: 'scorecard',
        ...pickUtmProperties(utms),
      },
      context: { hutk, pageUri, pageName },
    });

    if (!submission.ok) {
      return NextResponse.json({ error: 'Failed to submit lead' }, { status: 502 });
    }

    const result = buildResult(answers);

    // Look up the contact the form just created/updated so we can flag it for
    // the manual qualification queue and notify Bradley. If HubSpot has not
    // finished indexing the contact yet, still return the result so the user
    // sees their scorecard; Bradley can flag lifecycle from the queue.
    const contactId = await findContactByEmail(email);

    if (contactId) {
      await markContactForReview(contactId);
      await createContactTask({
        contactId,
        subject: `New lead to qualify: ${firstName || email} (Stage ${result.placement.stage})`,
        body: `New scorecard submission. Stage ${result.placement.stage} (${result.placement.name}). Model: ${result.modelLabel}. Headline gap: ${result.headline.lead}`,
        ownerId: BRADLEY_OWNER_ID,
        priority: 'HIGH',
        dueInHours: 24,
      });
    }

    return NextResponse.json({ success: true, contactId, result });
  } catch (err) {
    console.error('[submit-scorecard] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/scorecard/api-submit.test.js`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add app/api/scorecard/submit/route.js __tests__/scorecard/api-submit.test.js
git commit -m "feat(scorecard): submit via HubSpot form, mark for review, drop auto-deal"
```

---

## Task 4: Playbook route - form submission, no deal

**Files:**
- Modify: `app/api/submit-playbook-form/route.js`
- Test: `__tests__/api/submit-playbook-form.test.js`

- [ ] **Step 1: Write the failing test**

Create `__tests__/api/submit-playbook-form.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/api/submit-playbook-form.test.js`
Expected: FAIL (route still calls `upsertContactByEmail`; `submitHubSpotForm` not called).

- [ ] **Step 3: Rewrite `app/api/submit-playbook-form/route.js`**

Replace the entire file with:

```js
import { NextResponse } from "next/server";
import {
  assertHubSpotConfigured,
  ensureCustomContactProperties,
  submitHubSpotForm,
  markContactForReview,
  findContactByEmail,
  createContactTask,
  pickUtmProperties,
  UTM_CUSTOM_PROPERTIES,
  LEAD_MAGNET_PROPERTY,
} from "@/lib/hubspot";

let propertiesEnsured = false;

export async function POST(request) {
  try {
    assertHubSpotConfigured();

    const data = await request.json();

    if (!data.email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const nameParts = (data.name || "").trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    if (!propertiesEnsured) {
      await ensureCustomContactProperties([
        ...UTM_CUSTOM_PROPERTIES,
        LEAD_MAGNET_PROPERTY,
      ]);
      propertiesEnsured = true;
    }

    // Submit through the HubSpot form so the hutk cookie attaches the visitor
    // session for Original Source attribution. No deal is created.
    const submission = await submitHubSpotForm({
      properties: {
        email: data.email,
        firstname: firstName,
        lastname: lastName,
        company: data.company || "",
        lead_magnet: "playbook",
        ...pickUtmProperties(data.utms),
      },
      context: { hutk: data.hutk, pageUri: data.pageUri, pageName: data.pageName },
    });

    if (!submission.ok) {
      return NextResponse.json(
        { error: "Failed to process your request. Please try again." },
        { status: 502 }
      );
    }

    const contactId = await findContactByEmail(data.email);

    if (contactId) {
      await markContactForReview(contactId);
      createContactTask({
        contactId,
        subject: `New lead to qualify: ${data.name || data.email} (Playbook)`,
        body: [
          `${data.name || data.email} downloaded the Revenue Maturity Playbook.`,
          data.company ? `Company: ${data.company}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
        priority: "MEDIUM",
      });
    }

    return NextResponse.json({ success: true, contactId });
  } catch (error) {
    console.error("Playbook form submit error:", error);
    return NextResponse.json(
      { error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/api/submit-playbook-form.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add app/api/submit-playbook-form/route.js __tests__/api/submit-playbook-form.test.js
git commit -m "feat(playbook): submit via HubSpot form, mark for review, no deal"
```

---

## Task 5: Watch booking route - capture lead, no deal

**Files:**
- Create: `app/api/capture-watch-lead/route.js`
- Delete: `app/api/create-watch-deal/route.js`
- Modify: `components/HubSpotMeetingRedirect.jsx`
- Test: `__tests__/api/capture-watch-lead.test.js`

- [ ] **Step 1: Write the failing test**

Create `__tests__/api/capture-watch-lead.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/api/capture-watch-lead.test.js`
Expected: FAIL with `Failed to resolve import "@/app/api/capture-watch-lead/route"`.

- [ ] **Step 3: Create `app/api/capture-watch-lead/route.js`**

```js
import { NextResponse } from "next/server";
import {
  assertHubSpotConfigured,
  findContactByEmail,
  markContactForReview,
  createContactTask,
} from "@/lib/hubspot";

/**
 * POST /api/capture-watch-lead
 *
 * Called client-side after a prospect books a discovery call via /watch.
 * HubSpot Meetings creates the contact (with native attribution). This route
 * flags that contact for the manual qualification queue (lifecycle Lead,
 * hs_lead_status NEW) and notifies Bradley with a task. It does NOT create a
 * deal: a booked call is not a qualified opportunity. Bradley creates the deal
 * manually after qualifying. Booked-call leads carry
 * engagements_last_meeting_booked_* so they are the hotter segment to triage.
 *
 * Expects JSON body: { email: string, firstName?: string, lastName?: string }
 */
export async function POST(request) {
  try {
    assertHubSpotConfigured();

    const { email, firstName, lastName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const contactId = await findContactByEmail(email);

    if (!contactId) {
      // Meetings may not have finished creating the contact. Don't block the
      // client redirect; Bradley can flag lifecycle from the queue.
      console.warn(
        `[capture-watch-lead] Contact not found for ${email}. ` +
          `HubSpot Meetings may not have finished creating the record yet.`
      );
      return NextResponse.json({
        success: false,
        reason: "contact_not_found",
        email,
      });
    }

    await markContactForReview(contactId);

    const contactName = [firstName, lastName].filter(Boolean).join(" ") || email;
    createContactTask({
      contactId,
      subject: `New lead to qualify: ${contactName} (Booked call)`,
      body: `${contactName} booked a discovery call via /watch. Review and qualify before creating a deal.`,
      priority: "HIGH",
      dueInHours: 24,
    });

    return NextResponse.json({ success: true, contactId });
  } catch (err) {
    console.error("[capture-watch-lead] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Delete the old route**

Run: `git rm app/api/create-watch-deal/route.js`

- [ ] **Step 5: Update `components/HubSpotMeetingRedirect.jsx`**

Replace the JSDoc comment block (lines 7-17) so the `/watch` description reads:

```jsx
/**
 * Listens for HubSpot Meetings' `meetingBookSucceeded` postMessage event.
 *
 * /book path:  email and firstName are passed as props (from the qualifying
 *              form state). The contact is already handled by /api/submit-form
 *              before this component fires, so we just redirect.
 *
 * /watch path: No qualifying form, so email/firstName come from the HubSpot
 *              Meetings payload. We fire /api/capture-watch-lead to flag the
 *              Meetings-created contact for the qualification queue (no deal),
 *              then redirect.
 */
```

Then change the fetch call inside the `source === "watch"` block (currently `await fetch("/api/create-watch-deal", {`) and its surrounding comment:

```jsx
      // For /watch bookings, flag the Meetings-created contact for the
      // qualification queue. No deal is created here.
      if (source === "watch" && bookerEmail) {
        try {
          await fetch("/api/capture-watch-lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: bookerEmail,
              firstName: bookerFirstName,
              lastName: bookerLastName,
            }),
          });
          // Fire-and-forget: don't block the redirect. If it fails, the contact
          // still exists and Bradley can flag it manually from HubSpot.
        } catch (err) {
          console.error("[HubSpotMeetingRedirect] Lead capture failed:", err);
        }
      }
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run __tests__/api/capture-watch-lead.test.js`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
git add app/api/capture-watch-lead/route.js __tests__/api/capture-watch-lead.test.js components/HubSpotMeetingRedirect.jsx
git rm app/api/create-watch-deal/route.js
git commit -m "feat(watch): replace create-watch-deal with capture-watch-lead (no deal)"
```

---

## Task 6: Watch qualify route - keep properties, drop deal

**Files:**
- Modify: `app/api/qualify-watch-lead/route.js`
- Test: `__tests__/api/qualify-watch-lead.test.js`

- [ ] **Step 1: Write the failing test**

Create `__tests__/api/qualify-watch-lead.test.js`:

```js
import { describe, it, expect, vi, beforeEach } from 'vitest';

const hubspotMock = {
  assertHubSpotConfigured: vi.fn(),
  ensureCustomContactProperties: vi.fn(async () => {}),
  findContactByEmail: vi.fn(async () => 'contact-42'),
  markContactForReview: vi.fn(async () => true),
  hsHeaders: vi.fn(() => ({ 'Content-Type': 'application/json' })),
  HUBSPOT_BASE: 'https://api.hubapi.com',
};

vi.mock('@/lib/hubspot', () => hubspotMock);

let contactPatchBody = null;
let dealCalled = false;

beforeEach(() => {
  for (const fn of Object.values(hubspotMock)) {
    if (typeof fn === 'function' && fn.mockClear) fn.mockClear();
  }
  hubspotMock.findContactByEmail.mockResolvedValue('contact-42');
  contactPatchBody = null;
  dealCalled = false;
  global.fetch = vi.fn(async (url, opts) => {
    if (typeof url === 'string' && url.includes('/crm/v3/objects/contacts/')) {
      contactPatchBody = JSON.parse(opts.body);
      return { ok: true, json: async () => ({}) };
    }
    if (typeof url === 'string' && url.includes('/crm/v3/objects/deals')) {
      dealCalled = true;
      return { ok: true, json: async () => ({ results: [], id: 'deal-x' }) };
    }
    return { ok: true, json: async () => ({}) };
  });
});

async function callRoute(body) {
  const { POST } = await import('@/app/api/qualify-watch-lead/route');
  const req = new Request('http://test.local/api/qualify-watch-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return POST(req);
}

function fixtureBody() {
  return {
    email: 'marcus@co.com',
    firstName: 'Marcus',
    lastName: 'Chen',
    phone: '555-1234',
    revenue: '$5M\u201315M',
    teamSize: '6\u201315',
    bottleneck: 'Pipeline stalls at proposal stage.',
    previousConsultant: 'yes',
    previousConsultantDetails: 'Big 4, not a fit.',
  };
}

describe('POST /api/qualify-watch-lead', () => {
  it('writes the full qualifying property set and creates no deal', async () => {
    const res = await callRoute(fixtureBody());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.contactId).toBe('contact-42');

    expect(contactPatchBody.properties).toEqual(
      expect.objectContaining({
        company_annual_revenue: '5m_15m',
        sales_marketing_team_size: '6_15',
        growth_bottleneck: 'Pipeline stalls at proposal stage.',
        previous_consultant: 'yes',
        previous_consultant_details: 'Big 4, not a fit.',
        firstname: 'Marcus',
        lastname: 'Chen',
        phone: '555-1234',
      })
    );
    expect(hubspotMock.markContactForReview).toHaveBeenCalledWith('contact-42');
    expect(dealCalled).toBe(false);
  });

  it('rejects missing email', async () => {
    const res = await callRoute({ revenue: '$5M\u201315M' });
    expect(res.status).toBe(400);
  });

  it('returns 404 when the contact is not found', async () => {
    hubspotMock.findContactByEmail.mockResolvedValue(null);
    const res = await callRoute(fixtureBody());
    expect(res.status).toBe(404);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/api/qualify-watch-lead.test.js`
Expected: FAIL (route still searches/creates deals; `dealCalled` becomes true; `markContactForReview` not imported).

- [ ] **Step 3: Rewrite `app/api/qualify-watch-lead/route.js`**

Replace the entire file with:

```js
import { NextResponse } from "next/server";
import {
  HUBSPOT_BASE,
  hsHeaders,
  assertHubSpotConfigured,
  findContactByEmail,
  markContactForReview,
  ensureCustomContactProperties,
} from "@/lib/hubspot";

// Enum maps mirror the /book qualifying form. Kept here (not moved to the deal
// layer) because they translate the form's display labels into the contact
// property option values. The revenue-to-amount map was removed with the deal
// logic; amounts are set when Bradley creates the deal manually.
const REVENUE_OPTIONS = {
  "Under $1M": "under_1m",
  "$1M\u20133M": "1m_3m",
  "$3M\u20135M": "3m_5m",
  "$5M\u201315M": "5m_15m",
  "$15M\u201350M": "15m_50m",
  "$50M+": "50m_plus",
  "$15M+": "15m_plus", // legacy band, retained for historical/in-flight submissions
};

const TEAM_SIZE_OPTIONS = {
  "1\u20135": "1_5",
  "6\u201315": "6_15",
  "16\u201330": "16_30",
  "30+": "30_plus",
};

const CUSTOM_PROPERTIES = [
  {
    name: "company_annual_revenue",
    label: "Company Annual Revenue",
    type: "enumeration",
    fieldType: "select",
    groupName: "contactinformation",
    options: Object.entries(REVENUE_OPTIONS).map(([label, value], i) => ({
      label,
      value,
      displayOrder: i,
    })),
  },
  {
    name: "sales_marketing_team_size",
    label: "Sales & Marketing Team Size",
    type: "enumeration",
    fieldType: "select",
    groupName: "contactinformation",
    options: Object.entries(TEAM_SIZE_OPTIONS).map(([label, value], i) => ({
      label,
      value,
      displayOrder: i,
    })),
  },
  {
    name: "growth_bottleneck",
    label: "Growth Bottleneck",
    type: "string",
    fieldType: "textarea",
    groupName: "contactinformation",
  },
  {
    name: "previous_consultant",
    label: "Previous Consultant",
    type: "enumeration",
    fieldType: "select",
    groupName: "contactinformation",
    options: [
      { label: "Yes", value: "yes", displayOrder: 0 },
      { label: "No", value: "no", displayOrder: 1 },
    ],
  },
  {
    name: "previous_consultant_details",
    label: "Previous Consultant Details",
    type: "string",
    fieldType: "textarea",
    groupName: "contactinformation",
  },
];

let propertiesEnsured = false;

async function ensureProperties() {
  if (propertiesEnsured) return;
  await ensureCustomContactProperties(CUSTOM_PROPERTIES);
  propertiesEnsured = true;
}

/**
 * POST /api/qualify-watch-lead
 *
 * Called from the thank-you page when a /watch booker fills in the qualifying
 * form post-booking. Writes the qualifying answers onto the contact and keeps
 * it flagged for the manual qualification queue. It does NOT create or upgrade
 * a deal: a self-reported qualifying form is not a qualified opportunity.
 * Bradley creates the deal manually after qualifying.
 *
 * Expects JSON body matching the qualifying form fields:
 * { email, firstName, lastName, revenue, teamSize, bottleneck,
 *   previousConsultant, previousConsultantDetails, phone? }
 */
export async function POST(request) {
  try {
    assertHubSpotConfigured();
    await ensureProperties();

    const formData = await request.json();
    const { email } = formData;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const contactId = await findContactByEmail(email);
    if (!contactId) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const contactProps = {
      company_annual_revenue:
        REVENUE_OPTIONS[formData.revenue] || formData.revenue,
      sales_marketing_team_size:
        TEAM_SIZE_OPTIONS[formData.teamSize] || formData.teamSize,
      growth_bottleneck: formData.bottleneck || "",
      previous_consultant: formData.previousConsultant || "",
      previous_consultant_details: formData.previousConsultantDetails || "",
    };

    if (formData.firstName) contactProps.firstname = formData.firstName;
    if (formData.lastName) contactProps.lastname = formData.lastName;
    if (formData.phone) contactProps.phone = formData.phone;

    const updateRes = await fetch(
      `${HUBSPOT_BASE}/crm/v3/objects/contacts/${contactId}`,
      {
        method: "PATCH",
        headers: hsHeaders(),
        body: JSON.stringify({ properties: contactProps }),
      }
    );

    if (!updateRes.ok) {
      const err = await updateRes.text();
      console.error("[qualify-watch-lead] Contact update failed:", err);
      return NextResponse.json(
        { error: "Failed to update contact", details: err },
        { status: 502 }
      );
    }

    // Keep the contact in the manual qualification queue. It is likely already
    // Lead from booking; this is a safety net and sets hs_lead_status NEW.
    await markContactForReview(contactId);

    return NextResponse.json({ success: true, contactId });
  } catch (err) {
    console.error("[qualify-watch-lead] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/api/qualify-watch-lead.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add app/api/qualify-watch-lead/route.js __tests__/api/qualify-watch-lead.test.js
git commit -m "feat(watch): qualify route writes contact props only, no deal"
```

---

## Task 7: Client flows forward the cookie and page context

**Files:**
- Modify: `components/scorecard/QuizFlow.jsx`
- Modify: `app/playbook/PlaybookForm.js`
- Test: `__tests__/scorecard/components/QuizFlow.test.jsx` (extend if a submit case exists; otherwise verify via existing render test plus the route tests already covering the server contract)

Note: the server already accepts and ignores absent `hutk`/`pageUri`/`pageName` (Tasks 3-4 default them to undefined), so this task wires the client to send real values.

- [ ] **Step 1: Update `components/scorecard/QuizFlow.jsx`**

Add the import near the top (after the analytics import on line 4):

```jsx
import { getHubspotutk } from '@/lib/hubspot-client';
```

In the `submit` function, change the `fetch` body to include the cookie and page context. Replace:

```jsx
        body: JSON.stringify({ firstName, email, company, utms, answers }),
```

with:

```jsx
        body: JSON.stringify({
          firstName,
          email,
          company,
          utms,
          answers,
          hutk: getHubspotutk(),
          pageUri: typeof window !== 'undefined' ? window.location.href : '',
          pageName: typeof document !== 'undefined' ? document.title : '',
        }),
```

- [ ] **Step 2: Update `app/playbook/PlaybookForm.js`**

Add the import (after the `getUtms` import on line 11):

```jsx
import { getHubspotutk } from "@/lib/hubspot-client";
```

In `handleSubmit`, replace:

```jsx
        body: JSON.stringify({ ...form, utms: getUtms() }),
```

with:

```jsx
        body: JSON.stringify({
          ...form,
          utms: getUtms(),
          hutk: getHubspotutk(),
          pageUri: typeof window !== "undefined" ? window.location.href : "",
          pageName: typeof document !== "undefined" ? document.title : "",
        }),
```

- [ ] **Step 3: Run the existing client component tests to confirm no regression**

Run: `npx vitest run __tests__/scorecard/components/QuizFlow.test.jsx`
Expected: PASS (the change only adds fields to the request body; existing assertions about flow/rendering are unaffected).

- [ ] **Step 4: Commit**

```bash
git add components/scorecard/QuizFlow.jsx app/playbook/PlaybookForm.js
git commit -m "feat(lead-capture): forward hubspotutk and page context to form routes"
```

---

## Task 8: One-time HubSpot form setup script

**Files:**
- Create: `scripts/setup-hubspot-forms.mjs`

This is an operational script run by hand against the live HubSpot account; it is not unit tested. Verify by dry-run code review plus a live run.

- [ ] **Step 1: Create `scripts/setup-hubspot-forms.mjs`**

```js
/**
 * One-time setup: create the shared non-marketing HubSpot form used by the
 * scorecard and playbook lead-capture routes, and print the values to paste
 * into .env.local.
 *
 * Why: routing lead capture through a HubSpot form (with the visitor's
 * hubspotutk cookie) is what makes HubSpot set a real Original Source instead
 * of stamping leads INTEGRATION. The form must contain every field we submit,
 * or HubSpot rejects the submission.
 *
 * Run:  HUBSPOT_API_KEY=... node scripts/setup-hubspot-forms.mjs
 *
 * Output: the form GUID and portal ID. Add to .env.local (and Vercel env):
 *   HUBSPOT_PORTAL_ID=...
 *   HUBSPOT_LEAD_FORM_GUID=...
 *
 * Idempotent: if a form named FORM_NAME already exists, its GUID is printed
 * instead of creating a duplicate.
 */

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const BASE = "https://api.hubapi.com";
const FORM_NAME = "Lead Capture (Scorecard + Playbook)";

if (!HUBSPOT_API_KEY) {
  console.error("HUBSPOT_API_KEY is not set. Run with HUBSPOT_API_KEY=... node scripts/setup-hubspot-forms.mjs");
  process.exit(1);
}

function headers() {
  return {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    "Content-Type": "application/json",
  };
}

// Fields the lead-capture routes submit. Names map to existing contact
// properties (utm_* and lead_magnet are created by the app's
// ensureCustomContactProperties; email/firstname/lastname/company are
// HubSpot defaults).
const FIELD_NAMES = [
  "email",
  "firstname",
  "lastname",
  "company",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "lead_magnet",
];

function fieldObject(name) {
  return {
    objectTypeId: "0-1", // contact
    name,
    required: name === "email",
    hidden: !["email", "firstname", "company"].includes(name),
  };
}

async function getPortalId() {
  const res = await fetch(`${BASE}/account-info/v3/details`, { headers: headers() });
  if (!res.ok) {
    console.error("Failed to read account info:", await res.text());
    process.exit(1);
  }
  const data = await res.json();
  return data.portalId;
}

async function findExistingForm() {
  const res = await fetch(`${BASE}/marketing/v3/forms/?limit=200`, { headers: headers() });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.results || []).find((f) => f.name === FORM_NAME) || null;
}

async function createForm() {
  const body = {
    name: FORM_NAME,
    formType: "non_marketable",
    fieldGroups: [
      {
        groupType: "default_group",
        richTextType: "text",
        fields: FIELD_NAMES.map(fieldObject),
      },
    ],
    configuration: {
      language: "en",
      createNewContactForNewEmail: true,
      postSubmitAction: { type: "thank_you", value: "Thanks!" },
    },
    displayOptions: { renderRawHtml: false },
    legalConsentOptions: { type: "none" },
  };

  const res = await fetch(`${BASE}/marketing/v3/forms/`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error("Failed to create form:", await res.text());
    process.exit(1);
  }
  return res.json();
}

async function main() {
  const portalId = await getPortalId();

  let form = await findExistingForm();
  if (form) {
    console.log(`Form "${FORM_NAME}" already exists.`);
  } else {
    form = await createForm();
    console.log(`Created form "${FORM_NAME}".`);
  }

  console.log("\nAdd these to .env.local (and your Vercel project env):\n");
  console.log(`HUBSPOT_PORTAL_ID=${portalId}`);
  console.log(`HUBSPOT_LEAD_FORM_GUID=${form.id || form.guid}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Review the script (do not run against production yet)**

Run: `node --check scripts/setup-hubspot-forms.mjs`
Expected: no output (syntax valid). The live run happens in Task 10 manual steps.

- [ ] **Step 3: Commit**

```bash
git add scripts/setup-hubspot-forms.mjs
git commit -m "chore(hubspot): add one-time lead-capture form setup script"
```

---

## Task 9: Full suite, lint, and attribution-doc comment

**Files:**
- Modify: `lib/analytics.js` (extend the existing setup comment to mention the at-source attribution dependency) - optional doc-only.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS. All existing scorecard tests plus the four new route/helper test files green. `hubspot-constants.test.js` still passes because the deal constants remain exported.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no errors. (If an unused-import error appears in any rewritten route, remove the unused import and re-run.)

- [ ] **Step 3: Add an attribution note to `lib/analytics.js`**

After the existing `LEAD MAGNET DIMENSION` comment block (ends near line 33), append:

```js
// AT-SOURCE ATTRIBUTION (code, shipped with the qualification-gate change).
//
// Scorecard and playbook leads are submitted through a HubSpot form via
// lib/hubspot.submitHubSpotForm with the visitor's hubspotutk cookie attached,
// so HubSpot sets a real Original Source instead of INTEGRATION. If Original
// Source is blank on Starter, the utm_* contact properties still carry
// attribution. Lead capture no longer creates deals; deals are created
// manually after qualification.
```

- [ ] **Step 4: Run lint once more**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add lib/analytics.js
git commit -m "docs(analytics): note at-source attribution and manual deal gate"
```

---

## Task 10: Manual verification and PR (operator steps)

These steps require the live HubSpot account and a deploy; they are performed by Bradley and recorded in the PR description.

- [ ] **Step 1: Create the form and capture env vars**

Run: `HUBSPOT_API_KEY=<token> node scripts/setup-hubspot-forms.mjs`
Paste the printed `HUBSPOT_PORTAL_ID` and `HUBSPOT_LEAD_FORM_GUID` into `.env.local` and the Vercel project env. Redeploy/restart so the routes pick them up.

- [ ] **Step 2: Attribution test (scorecard)**

Load `/scorecard?utm_source=linkedin&utm_medium=social&utm_campaign=evergreen_scorecard`, complete a submission with `bradley+attrtest@bradleydewet.com`. In HubSpot, confirm the new contact has Original Source other than `INTEGRATION` and that `utm_*` and `lead_magnet` are populated. Repeat for `/playbook`.

- [ ] **Step 3: No-deal check**

Confirm the scorecard and playbook submissions created the contact but NO deal in the RevOps Coaching pipeline.

- [ ] **Step 4: Lifecycle check**

Confirm the new contact is lifecycle stage Lead with `hs_lead_status = NEW`.

- [ ] **Step 5: Plan/Starter check**

If Original Source stays blank on Starter, confirm `utm_*` still carry attribution and note the outcome in the PR.

- [ ] **Step 6: Booking-path check**

Book a call via /watch. Confirm the contact is still created (via Meetings), now has NO deal, is lifecycle Lead in the queue, and still carries `engagements_last_meeting_booked_*`. Fill the post-booking qualify form; confirm the qualifying properties land on the contact and still no deal.

- [ ] **Step 7: Cleanup**

Mark the test contact(s) `engagement_status = Test`.

- [ ] **Step 8: Build the qualification queue view**

In HubSpot, create the saved view / active list "New leads to qualify": lifecycle stage is Lead, has no associated deal, `engagement_status` is not Test. Booked-call leads are distinguishable by `engagements_last_meeting_booked_*` (qualify those first).

- [ ] **Step 9: Open the PR**

Include a checklist covering: setup script run + env vars set (local and Vercel), Original Source verified (or utm_* fallback noted), and the qualification queue view built.

---

## Self-Review Notes

- **Spec coverage:** Forms API submission (Tasks 1, 3, 4); no deal on scorecard (Task 3); playbook already dealless, now form-routed (Task 4); strip both watch deals (Tasks 5, 6); lifecycle Lead + hs_lead_status NEW (Task 1 helper, applied in 3/4/5/6); keep notification task (Tasks 3, 4, 5); one shared form via API (Task 8); client cookie forwarding (Tasks 2, 7); qualifying-property preservation (Task 6); queue view + manual checks (Task 10). All spec sections map to a task.
- **Deferred scope respected:** no historical backfill, no qualify-and-create-deal UI, no pipeline/stage changes, no scorecard-answer capture. Deal constants kept (still exported, used for future manual deal creation; not a deferred-item leak because nothing in the plan depends on auto-deal behavior).
- **Type/name consistency:** `submitHubSpotForm({ properties, context })` returning `{ ok }`, `markContactForReview(contactId)` returning boolean, and `getHubspotutk()` are used with identical signatures across Tasks 1-7.
