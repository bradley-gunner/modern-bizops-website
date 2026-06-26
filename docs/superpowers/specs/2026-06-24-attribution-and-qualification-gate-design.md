# Attribution at Source + Lead Qualification Gate - Design

**Date:** 2026-06-24
**Owner:** Bradley de Wet
**Source specs:**
- `Dispatch Spec - Attribution at Source and Lead Qualification Gate.md`
- `Dispatch Spec - Lead Magnet Source Parameter.md` (already shipped, commit `7d6e5d0`)

> Note on terminology: this doc avoids em dashes per project convention. Hyphens and rephrasing are used instead.

## Goals

1. **Fix attribution at the source.** Route scorecard and playbook lead capture through the HubSpot Forms API with the visitor's tracking cookie (`hubspotutk`) attached, so HubSpot sets native first-touch source/medium correctly instead of stamping every lead `INTEGRATION`.
2. **Separate lead capture from deal creation.** Stop auto-creating deals on lead capture. Leads come in as contacts only. A deal is created manually by Bradley after he qualifies the lead.

## Context: how the code differs from the source spec

The source spec was written against an earlier state of the repo. The actual code has drifted, so the design below reflects the current code, not the spec's assumptions:

| Area | Source spec assumed | Actual code on `main` |
|---|---|---|
| Scorecard | auto-creates a deal (remove it) | Matches. `app/api/scorecard/submit/route.js` creates a deal. |
| Playbook | auto-creates a deal (remove it) | Already does NOT create a deal. Nothing to remove. |
| Watch path | only `create-watch-deal` makes a deal | Two-stage now: `create-watch-deal` makes a deal at booking, and the new self-qualify form (`WatchQualifyForm` -> `qualify-watch-lead`) upgrades it to "Discovery Call Booked" with a dollar amount. |
| Forms API config | "portal ID is already known to the app" | No portal ID or form GUID exists anywhere in the repo. |
| `lead_magnet` field | may need creating | Already shipped as a custom contact property. |

## Decisions (confirmed with Bradley, 2026-06-24)

1. **Watch deals: strip both.** Remove deal creation from BOTH `create-watch-deal` and `qualify-watch-lead`. A booked call plus a completed self-qualify form saves contact properties and lands the contact in the manual queue. No deal until Bradley makes one.
2. **Forms API config: create via API.** A one-time setup script creates the HubSpot form via the Forms API using the existing private-app token and prints the GUID and portal ID for Bradley to paste into `.env.local`.
3. **Form count: one shared form** for both magnets, distinguished by the `lead_magnet` field.
4. **Lead task: keep it.** Each lead-capture route keeps creating a HubSpot Task assigned to Bradley (retitled to reflect "awaiting qualification"). It is the Starter-tier notification that something landed in the queue.

## Architecture

**Chosen approach (A): the Forms API submission becomes the contact-create, then a follow-up PATCH enriches.**

The `hutk` cookie attached to a Forms API submission is what gives HubSpot a real visitor session to attribute, which is the entire fix for `INTEGRATION`. So the form submission replaces the bare Contacts API upsert as the contact-create step. A follow-up PATCH then sets lifecycle and lead status (a PATCH does not re-stamp Original Source, so attribution survives).

Rejected alternatives:
- **B (dual-write):** keep the Contacts upsert AND fire a form submission. Fragile: the upsert can stamp `INTEGRATION` on create and you get a race over Original Source.
- **C (secure endpoint):** use the token-authenticated submission endpoint instead of the non-secure `hutk`-based one. More moving parts for no attribution benefit, since `hutk` is required either way. The non-secure integration endpoint is the standard path.

## Components

### 1. Shared HubSpot plumbing (`lib/hubspot.js`)

- `HUBSPOT_PORTAL_ID` and `HUBSPOT_LEAD_FORM_GUID` read from env.
- `submitHubSpotForm({ fields, context })`: POSTs to
  `https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{guid}`
  with body `{ fields: [{ name, value }], context: { hutk, pageUri, pageName } }`.
  No auth header (the cookie is the trust). Field names map to contact properties.
  Returns ok/non-ok so callers can decide whether to continue.
- `markContactForReview(contactId)`: PATCHes `lifecyclestage = lead` and
  `hs_lead_status = NEW` so the manual qualification queue is filterable.

### 2. Setup script (`scripts/setup-hubspot-forms.mjs`)

- Run once by Bradley. Creates ONE non-marketing form via the Forms v3 API
  (`POST /marketing/v3/forms`) with fields: `email`, `firstname`, `lastname`,
  `company`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`,
  `utm_term`, `lead_magnet`.
- Prints the form GUID and the portal ID (from `/account-info/v3/details`) for
  Bradley to paste into `.env.local`.
- Idempotent-ish: if a form with the known name already exists, print its GUID
  rather than creating a duplicate.

### 3. Scorecard route (`app/api/scorecard/submit/route.js`)

New flow:
1. Validate (unchanged).
2. `ensureCustomContactProperties` for utm_* and lead_magnet (the form references these properties).
3. `submitHubSpotForm` with fields `email`, `firstname`, `company`, the utms, and `lead_magnet: scorecard`, plus context `{ hutk, pageUri, pageName }`.
4. `findContactByEmail` to get the contact id.
5. `markContactForReview(contactId)`.
6. `buildResult(answers)` (unchanged, needed for the response).
7. `createContactTask` (retitled "New lead to qualify: ...").
8. Return `{ success, contactId, result }`.

Remove: the deal-creation block, `findExistingRevopsDealForContact`, and the now-unused deal imports (`REVOPS_PIPELINE_ID`, `NEW_LEAD_STAGE`, etc.).

### 4. Playbook route (`app/api/submit-playbook-form/route.js`)

Same shape, `lead_magnet: playbook`. Replaces the `upsertContactByEmail` call with the form submission plus `markContactForReview`. Keeps the task.

### 5. Client flows pass the cookie

- New helper `lib/hubspot-client.js` with `getHubspotutk()` that parses the `hubspotutk` cookie from `document.cookie`. Keeps cookie parsing in one place.
- `components/scorecard/QuizFlow.jsx` and `app/playbook/PlaybookForm.js`: include `hutk` (from the helper), `pageUri` (`window.location.href`), and `pageName` (`document.title`) in the POST body.
- No GA4 changes. The `lead_magnet` GA4 work already shipped.

### 6. Watch path: strip both deals

- `app/api/create-watch-deal/route.js`: repurpose and rename to
  `app/api/capture-watch-lead/route.js`. Stop creating a deal. Instead
  `markContactForReview` on the Meetings-created contact and create a
  "Booked call - qualify" task (booked calls carry
  `engagements_last_meeting_booked_*`, so they are the hotter segment to
  qualify first). Update `components/HubSpotMeetingRedirect.jsx` to call the
  renamed route.
- `app/api/qualify-watch-lead/route.js`: keep writing ALL of the qualifying
  contact properties the route writes today, so no answer is lost when the deal
  goes away. That is the full set: `company_annual_revenue`,
  `sales_marketing_team_size`, `growth_bottleneck`, `previous_consultant`,
  `previous_consultant_details`, plus `firstname`, `lastname`, and `phone`. The
  `ensureCustomContactProperties` call that creates those custom properties on
  demand also stays. Remove ONLY the `findContactDeal` helper and the deal
  find/upgrade/create blocks. The route becomes contact-enrichment only. Also
  call `markContactForReview` for safety (the contact may already be Lead from
  booking). The qualifying answers then live on the contact record, which is
  where Bradley reads them when working the queue.

### 7. The manual qualification gate (process this enables)

Out of code scope, documented in the PR for Bradley to set up in HubSpot:
- A saved view / active list "New leads to qualify" = lifecycle stage is Lead,
  has no associated deal, `engagement_status` is not Test.
- Booked-call leads are distinguishable in that view by their
  `engagements_last_meeting_booked_*` properties (qualify those first).

## Data flow after the change

```
Scorecard / Playbook submit:
  client reads hubspotutk cookie + page info
    -> POST to server route
      -> submitHubSpotForm (hutk attaches the session -> real Original Source)
        -> findContactByEmail -> markContactForReview (lifecycle Lead, lead_status NEW)
          -> createContactTask (queue notification)
  NO deal created.

Watch booking:
  HubSpot Meetings creates the contact (native attribution)
    -> capture-watch-lead: markContactForReview + "Booked call - qualify" task
  later, self-qualify form:
    -> qualify-watch-lead: write qualifying properties, markContactForReview
  NO deal created at any point.

Bradley reviews the queue -> manually creates a deal for qualified leads.
```

## Error handling

- `submitHubSpotForm` non-ok: log the response body and return a 502 from the
  route so the client shows its error state. Do not fall through to a partial
  contact with no attribution.
- `findContactByEmail` returns null after a form submission (HubSpot eventual
  consistency): the contact still exists with attribution; skip
  `markContactForReview` and the task, log a warning, and still return success
  to the client so the user gets their result/download. Bradley can mark
  lifecycle from the queue. This mirrors the existing `create-watch-deal`
  tolerance for Meetings lag.
- Task creation stays fire-and-forget (already the pattern); a failed task does
  not fail the request.

## Testing (TDD)

1. `__tests__/scorecard/api-submit.test.js` currently asserts deal creation and
   will break. Update it first to assert: no deal POST fires, a form submission
   fires with `hutk` in context, the contact is marked for review, and the task
   is created. Keep the result-shape assertions.
2. Add coverage for the playbook route (`submit-playbook-form`): form
   submission with `lead_magnet: playbook` and no deal.
3. Add coverage for the watch routes: `capture-watch-lead` marks for review and
   creates a task but creates no deal; `qualify-watch-lead` still PATCHes the
   full qualifying property set onto the contact (revenue, team size,
   bottleneck, previous consultant + details, firstname, lastname, phone) and
   creates no deal.
4. Run the full vitest suite to confirm no regressions elsewhere.

## Acceptance criteria (from the source spec)

1. Submitting `/scorecard?utm_source=linkedin&utm_medium=social&utm_campaign=evergreen_scorecard`
   with a test email yields a contact whose Original Source is something other
   than `INTEGRATION`, with `utm_*` and `lead_magnet` populated. Repeat for
   `/playbook`.
2. Scorecard/playbook submission creates the contact but NO deal.
3. New contact is lifecycle stage Lead with `hs_lead_status = NEW`.
4. Plan check: if Original Source stays blank on Starter, the `utm_*` fields
   still carry attribution. Note the outcome in the PR.
5. A booked call via /watch still creates the contact (via Meetings), now
   creates no deal, lands in the queue (lifecycle Lead), and still carries its
   `engagements_last_meeting_booked_*` attribution. Meetings-based contact
   creation must not regress.
6. Use `bradley+attrtest@bradleydewet.com`; mark `engagement_status = Test`
   after.

## Manual steps (PR checklist)

- [ ] Run `node scripts/setup-hubspot-forms.mjs`; paste `HUBSPOT_PORTAL_ID` and
      `HUBSPOT_LEAD_FORM_GUID` into `.env.local` (and Vercel env).
- [ ] Build the "New leads to qualify" saved view / list in HubSpot.
- [ ] Verify Original Source on Starter (fall back to `utm_*` if blank, note it).

## What is NOT in this sprint

- **Historical backfill.** Existing contacts keep their current Original Source
  and any auto-created deals. Out of scope; Bradley can clean up manually.
- **A "qualify and create deal" UI/helper.** Deal creation stays fully manual in
  HubSpot for now. A small "Create deal for this contact" helper was discussed
  in the source spec but explicitly deferred.
- **Pipeline/stage changes.** No change to deal stages, pipeline structure, or
  the tier-to-amount map. The qualifying form still collects revenue/team size;
  it just no longer writes a deal.
- **GA4 admin config.** The `lead_magnet` GA4 custom dimension and key-event
  marking belong to the already-shipped lead-magnet work, not this change.
- **Removing the tier-to-amount logic from `qualify-watch-lead`.** The amount
  map and revenue/team-size enum maps stay (still used to write contact
  properties); only the deal write is removed. Kept so a future manual or
  helper-driven deal creation can reuse the mapping.
