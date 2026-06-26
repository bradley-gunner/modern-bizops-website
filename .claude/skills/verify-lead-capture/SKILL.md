---
name: verify-lead-capture
description: >-
  Use when verifying that a lead-capture or attribution change to the
  modernbizops.com site (scorecard, playbook, book, or watch flows) actually
  creates the right HubSpot contact, especially on a Vercel preview deploy or
  before merging to production. Also use when a form submission appears to
  succeed but no HubSpot contact shows up, or when checking Original Source,
  lead_magnet, lifecycle/lead status, or the no-deal invariant on captured
  leads. Pairs with ship-to-production.
---

# Verify a lead-capture change against HubSpot

This site captures leads four ways, and a "successful" form submission in the
browser does NOT prove a contact was created. HubSpot silently drops some
submissions, and the failure is invisible from the page. Verify in HubSpot, not
just the UI.

## Which mechanism each path uses (this decides how it can fail)

| Path | Contact created by | Subject to form spam filter? |
|---|---|---|
| `/scorecard`, `/playbook` | HubSpot **Forms API** (`submitHubSpotForm`, with `hutk`) | **Yes** |
| `/book` qualifying form | HubSpot **Forms API** (identity+utm), then a Contacts PATCH for qualifying answers | **Yes** |
| `/watch` booking + self-qualify | HubSpot **Meetings** tool + Contacts API | No |

Only the Forms-API paths can be spam-dropped. The Contacts API and Meetings tool
bypass the filter (which is why the old `/book` write and `/watch` always created
contacts).

## STEP 0 (do this FIRST, it is the #1 cause of "no contact"): register the domain

HubSpot silently rejects Forms-API submissions from any domain **not** listed in
**Settings → Reports & Analytics Tracking → Advanced Tracking → Additional site
domains**. The submission returns 200, but no contact is created - it lands in the
form's **Spam Submissions** with type **"Unregistered Site Domain"** and is
deleted after 90 days.

- **Production** `modernbizops.com` must stay registered, or live leads are
  dropped. This is a hard pre-merge requirement.
- **Each Vercel preview** is a *different* `*.vercel.app` subdomain (e.g.
  `modern-bizops-website-git-claud-<hash>-...vercel.app`). To test on a preview,
  that exact subdomain must be added too. It is ephemeral - remove it after.

If a contact does not appear after submitting, **check the form's Spam
Submissions** (Marketing → Forms → the form → the Spam submissions count) before
assuming the code is broken.

## Procedure

1. Get the preview URL from the PR's Vercel check (or `gh pr view <n> --json
   statusCheckRollup`). Ask the human to add that preview subdomain in HubSpot
   (Step 0); confirm it is saved before submitting.
2. Drive the form in Chrome with a labeled test email per path
   (`bradley+<path>test@bradleydewet.com`) and UTMs in the URL
   (`?utm_source=linkedin&utm_medium=social&utm_campaign=evergreen_<path>`). Use a
   fresh tab per path so the first-touch UTM sessionStorage does not carry over.
   For `/book`, use a valid 10-digit phone or its field validation blocks submit.
3. Wait ~20-60s (HubSpot form processing + search-index lag), then query the
   contact by email via the HubSpot MCP `search_crm_objects` (objectType
   `contacts`, filter `email EQ ...`) requesting these exact properties:

   `email, firstname, lastname, lead_magnet, utm_source, utm_medium,
   utm_campaign, company_annual_revenue, sales_marketing_team_size,
   growth_bottleneck, lifecyclestage, hs_lead_status, hs_analytics_source,
   hs_analytics_source_data_1, num_associated_deals`

4. Check against "what good looks like" below.
5. Cleanup: set `engagement_status = Test` on each test contact (MCP
   `manage_crm_objects` update). Tell the human to remove the ephemeral preview
   subdomain from HubSpot when done.

## What good looks like

| Property | Pass condition |
|---|---|
| contact exists | A record for the test email (if absent, check Spam Submissions first) |
| `lead_magnet` | `scorecard` / `playbook` (not set for `/book` or `/watch`) |
| `utm_source/medium/campaign` | match the URL you used |
| `lifecyclestage` / `hs_lead_status` | `lead` / `NEW` (proves `markContactForReview` ran) |
| `num_associated_deals` | absent / 0 - **the no-deal invariant** |
| `company_annual_revenue` etc. (`/book`) | the qualifying answers are populated |
| `hs_analytics_source` / `_data_1` (Original Source) | see interpretation below |

### Interpreting Original Source (do not false-fail this)

- `INTEGRATION` → the bug we fixed; this means it did NOT go through the form.
- A real channel like `SOCIAL_MEDIA` / `LinkedIn` → ideal (the `hutk` resolved to
  a UTM-tagged tracked session). This is what production should show.
- `OFFLINE` / `FORM` → acceptable, especially on a preview whose pageviews were
  not yet tracked when you submitted. The `utm_*` fields carry the channel as the
  documented fallback, so PASS as long as `utm_*` are correct.

## Common mistakes

- Trusting the browser success screen as proof - it only means the API returned
  200, not that a contact exists.
- Forgetting Step 0, then debugging the code when the real cause is the
  unregistered domain (check Spam Submissions).
- Failing the change because Original Source is `OFFLINE/FORM` on a preview - that
  is fine; `utm_*` is the fallback.
- Searching the HubSpot UI immediately and seeing nothing - the search index lags;
  wait and re-query, or query by `email EQ` via the API.
- Leaving test contacts in funnel reporting - always mark `engagement_status =
  Test`.
