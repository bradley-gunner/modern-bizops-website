# Nurture Sender (Google Apps Script)

Standalone Apps Script, bound to **bradley@bradleydewet.com**, that is both the
**sequencer** and the **sender** for the **templated** nurture emails (Emails
2-6 of the scorecard and playbook spines). It finds due HubSpot contacts, sends
each templated email from Bradley's Gmail (BCC the free HubSpot logging address),
advances state in HubSpot, and stops anyone who has replied, booked, or
unsubscribed.

It is **not** part of the Next.js site. Source lives here for version history;
it runs as its own script.google.com project on Bradley's Google account.

> **Hard guardrail:** this script **never** sends Email 1 of either spine. Both
> E1s are personalized Gmail drafts-for-approval owned by Bradley + the Cowork
> skills (`scorecard-personalized-email`, `playbook-personalized-email`). The
> `TEMPLATES` table has no step-1 entry, so E1 cannot be sent here.

Design + rationale: [`../../docs/superpowers/specs/2026-07-27-apps-script-nurture-sender-design.md`](../../docs/superpowers/specs/2026-07-27-apps-script-nurture-sender-design.md).
Approved copy: `Marketing Systems/Email Loop - Sequence Plan and Drafts.md` (Rev 4).

## Files

| File | Purpose |
|---|---|
| `Code.gs` | The whole sender: config, approved templates, run loop, exit checks, HubSpot API, one-time setup. |
| `appsscript.json` | Manifest: timezone, V8, Gmail + external-request + trigger scopes. |

## One-time deploy

1. Go to [script.google.com](https://script.google.com) **signed in as bradley@bradleydewet.com** and create a **New project**.
2. Paste the contents of `Code.gs` into the editor's `Code.gs`.
3. Show the manifest (Project Settings -> "Show appsscript.json manifest file"), then paste the contents of `appsscript.json` over it.
4. **Project Settings -> Script Properties**, add three:
   | Key | Value |
   |---|---|
   | `HUBSPOT_TOKEN` | HubSpot private-app token, scopes `crm.objects.contacts.read` + `crm.objects.contacts.write` (+ `crm.schemas.contacts.write` for the one-time bootstrap). |
   | `HUBSPOT_BCC` | The portal's free BCC logging address (HubSpot -> Settings -> Objects -> Activities -> Email -> "Log emails you send"; looks like `...@bcc.hubspot.com`). |
   | `SEND_MODE` | `dry_run` |
5. Run `bootstrapProperties()` once. Approve the OAuth consent when prompted. It creates the five `nurture_*` contact properties if missing (idempotent, skips any that already exist).
6. Run `run()` once (still `dry_run`) and read the execution log. See verification below.

## Verification (before going live)

1. **Dry run.** `SEND_MODE=dry_run`, run `run()`. The log should list the right contacts, tracks, and next-due emails, and correctly **skip**: `engagement_status=Test`, `nurture_status` in {replied, booked, unsubscribed, completed}, and any lead whose E1 gate (`scorecard_email1_status` / `playbook_email1_status`) is not `sent`.
2. **Test contacts.** Seed one contact per track with `engagement_status=Test`. Confirm the log shows them skipped, never sent.
3. **One narrow live send.** Set `SEND_MODE=live`, point a single real/own contact at the track (E1 gate = `sent`, `nurture_started_at` old enough for E2), run `run()`. Confirm: the email arrives **from bradley@**, lands in **Sent**, appears on the **HubSpot contact timeline** (via BCC), and `nurture_step` / `nurture_last_sent_at` advance.
4. **Reply stop.** Reply to that email from the contact side. Next `run()` should flip `nurture_status=replied` and send nothing further.
5. **Go live.** Once all pass, keep `SEND_MODE=live` and run `installTrigger()` once to schedule the daily run (~08:00 project time).

## Cadence

Day offset from `nurture_started_at` (set when the lead's E1 is marked sent):

| Email | Day |
|---|---|
| E2 | 3 |
| E3 | 7 |
| E4 | 12 |
| E5 | 18 |
| E6 | 25 |

Edit the `CADENCE` object at the top of `Code.gs` to change it. After E6, `nurture_status` is set to `completed`. The sender advances **at most one email per contact per run**, so a stale contact catches up one step per day rather than in a burst.

## HubSpot state fields (created by `bootstrapProperties()`)

`nurture_track` (scorecard|playbook), `nurture_step` (number, 0 = none sent),
`nurture_last_sent_at` (datetime), `nurture_status`
(active|replied|booked|unsubscribed|completed), `nurture_started_at` (datetime).

Reused existing fields: `lead_magnet` (track source), `engagement_status` (skip
`Test`), `scorecard_email1_status` / `playbook_email1_status` (the E1 gate),
`scorecard_top_gap` (the `{{topGap}}` merge value for Spine A).

`booked` is set by the calendar/booking side; this sender only honors it.

## Not handled here

- **E1 of either spine** (owned by the Cowork skills).
- **CAN-SPAM postal/unsubscribe footer** (deferred at current volume; unsubscribe is the reply-"unsubscribe" scan).
- **Exact dollar-figure / stage restatement and AI-dynamic drafting** (gated on the Persist-Scorecard-Outputs dispatch spec).
- **UTM registry + dashboard allowlist** entries for `utm_medium=nurture` and the `welcome_{track}_0{step}_v1` content values (register in `UTM/UTM Campaign Registry - Content.csv` + re-sync the dashboard `REGISTERED_CONTENT` allowlist as a separate step).
