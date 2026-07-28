# Apps Script Nurture Sender — Design

**Date:** 2026-07-27
**Status:** Approved (Bradley, 2026-07-27) — cadence (25-day) and apex `book_link` host confirmed.
**Source spec:** `Marketing Systems/Code Session Handoff - Apps Script Nurture Sender.md`
**Approved copy:** `Marketing Systems/Email Loop - Sequence Plan and Drafts.md` (Rev 4, E2-6 both spines APPROVED Jul 27).

## Purpose

A standalone Google Apps Script (bound to bradley@bradleydewet.com) that is both the **sequencer** and the **sender** for the **templated** nurture emails (Emails 2-6 of both the scorecard and playbook spines). On a daily trigger it finds HubSpot nurture contacts due for their next templated email, sends it from Bradley's Gmail (BCC the free HubSpot logging address), advances state, and stops anyone who has replied / booked / unsubscribed.

**Hard guardrail:** it NEVER sends Email 1 of either spine. Both E1s are personalized Gmail drafts-for-approval owned by Bradley + the Cowork skills (`scorecard-personalized-email`, `playbook-personalized-email`). The template table structurally has no step-1 entry, so E1 cannot be sent by this script.

## Architecture

One Apps Script project, one file (`Code.gs`), plus `appsscript.json` and `README.md`. Single-file keeps paste-deploy into script.google.com trivial (clasp is not used).

```
Daily time trigger  →  run()
  → GET HubSpot contacts on an active nurture track
  → for each: exit checks (Test / unsubscribed / booked / replied)  → stop if any
  → E1 gate: skip until {track}_email1_status = sent; set nurture_started_at when it flips
  → compute next due email from (track, nurture_step, cadence, nurture_started_at)
  → if due: merge template → GmailApp.sendEmail(as Bradley, BCC HubSpot)  [or dry-run log]
  → PATCH HubSpot state (nurture_step++, nurture_last_sent_at=now; nurture_status=completed after E6)
```

## Deployment

- Source lives in this repo at `apps-script/nurture-sender/`, committed on branch `claude/apps-script-nurture-sender-3ceeef`, PR'd to main for version history.
- Vercel/Next ignores it (Next only builds `app/`; a top-level `apps-script/` folder is inert).
- Bradley deploys by pasting `Code.gs` + `appsscript.json` into a new script.google.com project bound to his account, sets Script Properties, runs `bootstrapProperties()` then `installTrigger()`.

## Secrets (Script Properties, never in code)

| Key | Value |
|---|---|
| `HUBSPOT_TOKEN` | Private-app token, scopes `crm.objects.contacts.read` + `.write` (+ `crm.schemas.contacts.write` for the one-time bootstrap). |
| `HUBSPOT_BCC` | Portal's free BCC logging address (`...@bcc.hubspot.com`). |
| `SEND_MODE` | `dry_run` (log only) or `live`. Starts `dry_run`. |

Portal: HubSpot na2, id 244508932.

## Config (top of Code.gs)

- **CADENCE** = `{2:3, 3:7, 4:12, 5:18, 6:25}` — day offset from `nurture_started_at`. (Approved 25-day track; the older Sequence-Plan §2 map of d2/d4/d7/d10/d14 was NOT chosen. One-line change if revisited.)
- **TEMPLATES** — `{scorecard, playbook}` → step `2..6` → `{subject, body}`, transcribed verbatim from Rev 4. E4/E5/E6 bodies+subjects are shared (spine-neutral). Signature is included in each body (GmailApp does not auto-append it). No em dashes, no CAN-SPAM footer (deferred at current volume).
- **book_link** builder: `https://modernbizops.com/book?utm_source=email&utm_medium=nurture&utm_campaign=lm_welcome_{track}&utm_content=welcome_{track}_0{step}_v1`. Apex host (canonical), avoids the www 308 hop. Only E5/E6 carry it.

## Merge tokens

- `{{firstName}}` — all emails. Fallback: `there`.
- `{{topGap}}` — Spine-A E2/E3 only, from `scorecard_top_gap`. Fallback: `the gap it flagged`.
- `{{book_link}}` — E5/E6, from the builder above.
- (`{{company}}` mentioned in the handoff is unused by the approved copy — dropped.)

## Signature (in every body)

```
--
Bradley de Wet
RevOps Coach · Modern BizOps
Making marketing, sales, and service one machine. More money, less chaos.
Get my free Revenue Growth Scorecard →
modernbizops.com | LinkedIn | YouTube
```

## HubSpot state fields (create once via `bootstrapProperties()` if missing; never duplicate)

| Property | Type | Values / notes |
|---|---|---|
| `nurture_track` | enumeration (dropdown) | `scorecard`, `playbook` — derive from `lead_magnet` if unset |
| `nurture_step` | number | last templated email number sent (0 = none) |
| `nurture_last_sent_at` | datetime | timestamp of last templated send |
| `nurture_status` | enumeration | `active`, `replied`, `booked`, `unsubscribed`, `completed` (default `active`) |
| `nurture_started_at` | datetime | day-0 anchor; set when the lead's E1 is marked sent |

Reused existing fields: `lead_magnet`, `engagement_status` (skip `Test`), `scorecard_email1_status` / `playbook_email1_status` (the E1 gate).

## Exit checks (per contact, in order — any hit stops the templated track)

1. `engagement_status = Test` → never send.
2. `nurture_status ∈ {unsubscribed, booked, replied}` → stop.
3. **Reply scan:** `GmailApp.search('from:{email} newer_than:{N}d')` where N = whole days since `nurture_last_sent_at` (min 1). If the newest message on a matching thread is inbound (from the contact) and dated after `nurture_last_sent_at` → set `nurture_status = replied`, stop. Bradley owns the 1:1 thread from there.
4. **Unsubscribe scan:** if that inbound reply body contains `unsubscribe` / `remove me` / `stop` → set `nurture_status = unsubscribed`, stop (permanent).

## Send

```js
GmailApp.sendEmail(email, subject, plainBody, { bcc: HUBSPOT_BCC, name: 'Bradley de Wet' });
```
Then PATCH `nurture_step = targetStep`, `nurture_last_sent_at = now`, and `nurture_status = completed` if `targetStep === 6`.

**Idempotency:** never send if `nurture_step >= targetStep` (a same-day re-run won't double-send; the next step isn't due yet). In `dry_run`, log intended recipient/subject/step and advance nothing.

## Contact discovery

`POST /crm/v3/objects/contacts/search` filtered to `nurture_status = active` OR (`nurture_status` unknown AND `lead_magnet` in {scorecard, playbook}). Paginate. For a contact with no `nurture_track`, derive it from `lead_magnet`. Request the properties the run needs (email, firstname, lead_magnet, engagement_status, nurture_*, {track}_email1_status, scorecard_top_gap).

## Bootstrap & trigger (one-time, run manually)

- `bootstrapProperties()` — GET each `nurture_*` property; POST-create only the missing ones. Idempotent.
- `installTrigger()` — create a daily time-based trigger on `run()` if none exists.

## Verification (per handoff §7, before `live`)

1. `SEND_MODE = dry_run`, run `run()` manually → log shows correct contacts / tracks / next-due emails; correctly skips Test, replied/booked/unsubscribed, and any lead whose E1 gate ≠ sent.
2. Seed one Test contact per track (`engagement_status = Test`) → confirm never sent.
3. Flip one real/own contact to `live` narrowly → email arrives from bradley@, lands in Sent, shows on the HubSpot timeline (via BCC), `nurture_step`/`last_sent_at` advance.
4. Reply from the contact side → next run flips `nurture_status = replied`, sends nothing further.
5. Only then set `SEND_MODE = live` and rely on the daily trigger.

## What's NOT in this build

- **E1 of either spine** — personalized Gmail drafts owned by the Cowork skills (`scorecard-personalized-email` / `playbook-personalized-email`). Wiring either E1 here is explicitly forbidden.
- **CAN-SPAM postal/unsubscribe footer** — deferred by Bradley (Jul 26) at current low volume; the copy block exists in the Sequence Plan §6 for when it's re-added at scale.
- **Exact-dollar-figure / stage / top-gap restatement in copy, and AI-dynamic drafting** — gated on `Dispatch Spec - Persist Scorecard Outputs to HubSpot.md`. Current copy references the result without reproducing a number.
- **clasp automation** — manual paste deploy chosen. A future `clasp push` setup is a one-time add if edit velocity warrants.
- **UTM registry + dashboard allowlist entries** for the new `welcome_{track}_0{step}_v1` content values and `utm_medium=nurture` — a post-go-live registration step (`UTM Campaign Registry - Content.csv` + dashboard `REGISTERED_CONTENT`), not code in this script.
- **`booked` status setter** — set by the calendar/booking side; this sender only honors it.
