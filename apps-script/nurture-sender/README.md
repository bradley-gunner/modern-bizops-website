# Nurture Sender (Google Apps Script)

Standalone Apps Script, bound to **bradley@bradleydewet.com**, that is both the
**sequencer** and the **sender** for the **templated** nurture emails (Emails
2-6 of the AI Revenue Scan track). It finds due HubSpot contacts, sends
each templated email from Bradley's Gmail (BCC the free HubSpot logging address),
advances state in HubSpot, and stops anyone who has replied, booked, or
unsubscribed.

It is **not** part of the Next.js site. Source lives here for version history;
it runs as its own script.google.com project on Bradley's Google account.

> **Hard guardrail:** this script **never** sends Email 1. E1 is a personalized
> Gmail draft-for-approval owned by Bradley + the Cowork skill
> (`scorecard-personalized-email`). The `TEMPLATES` table has no step-1 entry, so
> E1 cannot be sent here.

> **Spine B (the `/playbook` track) was deleted 2026-08-18** with the `/playbook`
> lead magnet. Verified in HubSpot the same day: all 8 contacts carrying a
> `lead_magnet` value were Bradley's own test rows, the single playbook one was
> `bradley+pbtest@`, and every `nurture_*` field was empty or test-only. The sender
> had never run on a real person, so nothing was stranded and no migration was
> needed. `deriveTrack_('playbook')` now returns `''`, so a playbook contact is
> **skipped**, never mis-routed into Scan copy. The `lm_welcome_playbook` UTM
> registry row is **retired in place, not deleted**, because historical links keep
> firing it.

Design + rationale: [`../../docs/superpowers/specs/2026-07-27-apps-script-nurture-sender-design.md`](../../docs/superpowers/specs/2026-07-27-apps-script-nurture-sender-design.md).
Approved copy: `Marketing Systems/Email Loop - Sequence Plan and Drafts.md` (**Rev 5**,
approved by Bradley 2026-08-18). Approval record and reasoning:
`Marketing Systems/Email Loop - Pivot Copy Pass v2 (2026-08-18).md`.

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
5. Run `bootstrapProperties()` once. Approve the OAuth consent when prompted. It creates the five `nurture_*` contact properties plus `scorecard_email1_status` if missing (idempotent, skips any that already exist, so it will **not** rewrite a `nurture_track` property that already carries the retired `Playbook` option, and it will not delete `playbook_email1_status` if that already exists. Both are left in place; retiring a magnet does not require destroying its data).
6. Run `logSignature()` once and read the log to confirm the sender sees your real Gmail signature (see Email format below).
7. Run `run()` once (still `dry_run`) and read the execution log. See verification below.

## Email format & signature

Emails send as **minimal HTML** (`GmailApp.sendEmail` with `htmlBody`), styled to still read like a personal typed email, with the plain-text version kept as the automatic fallback part. HTML gives working links and correct rendering of glyphs like `·`/`→` that mojibake in a plain-text-only send.

The signature is **read live from your Gmail settings** (`Gmail.Users.Settings.SendAs.list`, primary send-as) on each run, so it always matches whatever is set in Gmail, with no hand-maintained copy. This uses the Gmail **advanced service**, which must be enabled once in the editor: **Services (+) -> Gmail API -> Add** (this also enables the Gmail API on the script's system Cloud project, which the Cloud console cannot do for system projects). `getSignatureHtml_()` is cached per run; if the call ever fails it falls back to `SIGNATURE_HTML_FALLBACK` so sends never break. Run `logSignature()` to see exactly what it will use.

## Verification (before going live)

1. **Dry run.** `SEND_MODE=dry_run`, run `run()`. The log should list the right contacts, tracks, and next-due emails, and correctly **skip**: `engagement_status=Test`, `nurture_status` in {replied, booked, unsubscribed, completed}, and any lead whose E1 gate (`scorecard_email1_status`) is not `sent`.
2. **Test contacts.** Seed a contact with `engagement_status=Test`. Confirm the log shows it skipped, never sent.
3. **One narrow live send.** Set `SEND_MODE=live`, point a single real/own contact at the track (E1 gate = `sent`, `nurture_started_at` old enough for E2), run `run()`. Confirm: the email arrives **from bradley@**, lands in **Sent**, appears on the **HubSpot contact timeline** (via BCC), and `nurture_step` / `nurture_last_sent_at` advance.
4. **Reply stop.** Reply to that email from the contact side. Next `run()` should flip `nurture_status=replied` and send nothing further. Confirm the log does **not** say the optional properties were rejected (see the booked exit below); if it does, the booked exit is off.
5. **Booked stop.** Book a meeting as that contact through `/book`. The next `run()` should flip `nurture_status=booked` and send nothing further.
6. **Go live.** Once all pass, keep `SEND_MODE=live` and run `installTrigger()` once to schedule the daily run (~08:00 project time).

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

`nurture_track` (`scorecard`; the identifier deliberately kept the old product's
name, matching `lead_magnet` and the `/scorecard` route), `nurture_step` (number, 0 = none sent),
`nurture_last_sent_at` (datetime), `nurture_status`
(active|replied|booked|unsubscribed|completed), `nurture_started_at` (datetime).

Reused existing fields: `lead_magnet` (track source), `engagement_status` (skip
`Test`), `scorecard_email1_status` (the E1 gate),
`scorecard_top_gap` (the `{{topGap}}` merge value), and
`engagements_last_meeting_booked` (the booked exit, below).

**`scorecard_top_gap` can be the literal string `None`.** The Scan writes that when no
dollar line surfaced. `topGapLabel_()` maps it (and empty) to the fallback
"the gap it flagged", and lowercases a normal label so it reads mid-sentence. Without
that, E2 went out saying "Your weakest area was None."

### The booked exit (fixed 2026-08-18)

This README used to say "`booked` is set by the calendar/booking side; this sender only
honors it." **Nothing ever set it.** A repo-wide grep for `nurture_status` outside
`Code.gs` returns only the design doc, so a lead who booked a discovery call stayed
`active` and kept receiving the sequence, including E5 asking them to book the call they
had just booked.

The sender now reads `engagements_last_meeting_booked`, a standard HubSpot property
stamped when a meeting is booked through the Meetings tool, which is how `/book` works.
A booking at or after `nurture_started_at` stops the track with `nurture_status = booked`.

- **No new token scope.** It is a contact property, covered by `crm.objects.contacts.read`.
- **It cannot take the run down.** It is requested via `OPTIONAL_FETCH_PROPS`; if the
  portal rejects it, `fetchActiveContacts_` retries with the required set and logs a loud
  warning that the booked exit is inactive for that run. **Check the dry-run log for that
  warning**, because the degraded mode is exactly the bug this fixed.

## The E1 gate (how E2 is released)

E2 does not send until the lead's **personalized Email 1** (composed and hand-sent
by Bradley via the Cowork skill) has gone out. The sender clears the gate two ways:

1. **Explicit**. If `{track}_email1_status` is `sent`, the gate is cleared (fast path).
2. **Auto-detected**. Otherwise the sender looks in Bradley's Sent mail for the
   first message he sent to that lead **on/after the lead's `createdate`** (its funnel
   entry). Finding one means Email 1 went out: the sender sets `{track}_email1_status
   = 'sent'`, sets `nurture_status = active`, and anchors `nurture_started_at` to that
   email's actual date, so the E2 d3 / E3 d7 / … cadence counts from when E1 was sent.

So no manual bookkeeping is required: send Email 1 by hand, and the next daily run
picks it up. The `createdate` floor keeps a pre-existing unrelated thread from
falsely clearing the gate for a lead who was already a contact.

## Not handled here

- **E1** (owned by the Cowork skill).
- **CAN-SPAM postal/unsubscribe footer** (deferred at current volume; unsubscribe is the reply-"unsubscribe" scan). **When it is added, keep `stripQuoted_()`**: the planned footer says *reply "unsubscribe"*, and without stripping the quoted original every ordinary reply would quote it, match, and permanently suppress the lead who just answered.
- **Email authentication for bradleydewet.com.** **No longer a blocker, corrected 2026-08-25 against live DNS.** This line used to read "SPF does not authorize Google and no DKIM record is published ... the largest real blocker to the sequence landing in inboxes." All three records are published now: SPF is `v=spf1 include:_spf.google.com include:244508932.spf02.hubspotemail.net ~all` (Google authorized), a 2048-bit key is published at `google._domainkey.bradleydewet.com`, and DMARC is `p=none` with an rua address. What a published DKIM record still cannot prove is that Google Workspace is actively signing with it, so the remaining check is a real header read: confirm `DKIM-Signature ... d=bradleydewet.com` and `dkim=pass` on the first sequence email that actually goes out.
- **Exact dollar-figure / stage restatement and AI-dynamic drafting** (gated on the Persist-Scorecard-Outputs dispatch spec).
- **UTM registry + dashboard allowlist** entries for `utm_medium=nurture`, the `utm_campaign=lm_welcome_scan` row (new at Rev 5) and the `welcome_scorecard_0{step}_v1` content values (register in `UTM/UTM Campaign Registry - Content.csv` + re-sync the dashboard `REGISTERED_CONTENT` allowlist as a separate step). Sequence Plan section 7 changed the campaign to `lm_welcome_scan` but left its `utm_content` list on `welcome_scorecard_0X_v1`; the code follows the doc literally on both. Flagged for Bradley, one line to change either way.
