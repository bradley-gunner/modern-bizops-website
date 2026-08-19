---
name: update-nurture-emails
description: Change the copy, cadence, merge fields or routing of the automated nurture sequence (Emails 2-6) that the Apps Script sender sends to AI Revenue Scan leads. The email bodies are hardcoded inside apps-script/nurture-sender/Code.gs, so a copy approval is a code change that no page test and no grep of the site can see. Use whenever a Sequence Plan revision is approved, a lead magnet is retired, a merge field changes, or someone asks to update the nurture emails, the drip, or the email loop.
---

# Update the nurture emails

The templated nurture emails are **hardcoded inline in
[`apps-script/nurture-sender/Code.gs`](../../../apps-script/nurture-sender/Code.gs)**, not in a
CMS, not in HubSpot, and not in any file the Next.js build touches. That single fact drives
everything below: **a copy approval is a code change**, nothing on the site renders this copy,
and no existing test or grep will notice when it goes stale.

It went stale exactly that way once. Rev 4 sat in this file for three weeks containing **no
mention of AI across all six emails**, because it had been written for the retired RevOps
coaching business and passed every review by not contradicting anything.

## Before you touch the file

1. **Read the source of truth, all of it.**
   `~/Documents/Claude/Projects/Modern BizOps/Marketing Systems/Email Loop - Sequence Plan and Drafts.md`,
   section 5. Check the **Rev number in the header** and read the approval record it names
   (currently `Email Loop - Pivot Copy Pass v2 (2026-08-18).md`, APPROVED-BY-BRADLEY).
2. **Copy the approved text verbatim.** Do not paraphrase, do not fix his grammar, do not
   "improve" a line. Bradley works this copy line by line and edits some of it himself.
3. **Never touch Email 1.** There is a hard guardrail: `TEMPLATES` has no step-1 entry, so E1
   cannot be sent by this script. E1 is composed per lead by the
   `scorecard-personalized-email` Cowork skill and hand-sent by Bradley. It also **gates the
   whole sequence**: E2 does not fire until E1 has actually gone out.

## Verify the copy mechanically, never by reading

Transcription errors are invisible on review and permanent once sent. Load the templates out of
the file and diff **every paragraph** against the approved doc:

```bash
node -e "const fs=require('fs'),vm=require('vm');const c={console};vm.createContext(c);
vm.runInContext(fs.readFileSync('apps-script/nurture-sender/Code.gs','utf8')+';__O__=JSON.stringify(TEMPLATES);',c);
const t=JSON.parse(c.__O__).scorecard;
for(const s of [2,3,4,5,6])console.log('E'+s,t[s].body.split('\n\n').length+' paras |',t[s].subject);"
```

Then compare each body against the doc's paragraphs. **Prove the comparison bites** before you
trust it: change one word in a copy of the file and confirm the check fails and names the
paragraph. Inject into a scratchpad copy, never the repo file.

`node --check` it too (copy to a `.js` first, since `node --check` rejects the `.gs` extension).

## The traps that have actually bitten

**Merge fields can carry sentinel values that read as English.** `scorecard_top_gap` is written
as the literal string `'None'` when the Scan surfaces no dollar line, and `'None'` is truthy, so
a plain `|| fallback` passes it straight through. E2 shipped as *"Your weakest area was None."*
`topGapLabel_()` now handles it. **Any new merge field: go read what the writer actually emits**
(`lib/scorecard/hubspotResultProperties.js`), including its empty case, and render the email with
that value before believing it.

**Merge values are title-cased and every slot is mid-sentence.** "Sales cycle" in *"the
unglamorous work underneath Sales cycle"* reads wrong. `topGapLabel_()` lowercases a normal
label and leaves an acronym alone.

**Copy that states a time interval is coupled to `CADENCE`, and they live in different files.**
E5 said "a week and a half" while firing on **day 18**, because the copy was written against the
Sequence Plan section 2 table while the design spec had separately approved a 25-day track and
explicitly rejected that table. **The code is the authority on cadence.** If a revision touches a
time claim, check it against `CADENCE = {2:3, 3:7, 4:12, 5:18, 6:25}` and fix whichever side
Bradley says, then fix BOTH files in the same pass so the paragraph diff still passes.

**Never widen an opt-out pattern.** Any reply already halts the sequence. The unsubscribe scan
only chooses between `replied` and `unsubscribed` (permanent, never re-enroll), so a false
positive does not delay an email, it **buries a hot lead**. A bare `/\bstop\b/i` used to match
*"I want to stop wasting money on tools."* Keep `stripQuoted_()` too: the deferred CAN-SPAM
footer says reply "unsubscribe", and without stripping the quote every ordinary reply matches.

**Retiring a lead magnet is a code change in roughly 28 places.** Track constants, `TEMPLATES`,
`FETCH_PROPS`, `deriveTrack_`, the enrollment query, and `bootstrapProperties`. Make
`deriveTrack_` return `''` for the retired value so such a contact is **skipped**, never
mis-routed into another track's copy. **UTM registry rows are retired in place, never deleted**,
because historical links keep firing them.

**The track identifier is `scorecard` on purpose.** It matches what the site writes
(`app/api/scorecard/submit/route.js`) and the `scorecard_top_gap` / `scorecard_email1_status`
properties that already exist. The product was renamed to the AI Revenue Scan; the route and the
attribution identifiers deliberately were not. Do not "tidy" this to `scan`.

## The signature is read live, so do not hardcode it

`getSignatureHtml_()` pulls Bradley's real signature from Gmail on every run via the Gmail
advanced service. When he changes it in Gmail, every send changes with it and this repo needs no
edit. `SIGNATURE_TEXT` and `SIGNATURE_HTML_FALLBACK` are **fallbacks for a failed fetch only**;
keep them looking like the live block (including its lack of a `--` delimiter) and re-sync them
when he changes it.

## UTM

Only E5 and E6 carry a link, both to `/book`. `bookLink()` builds it. Any new campaign or content
value must be registered in
`~/Documents/Claude/Projects/Modern BizOps/UTM/UTM Campaign Registry - *.csv`, and the
registry's `assembled_url` must match what `bookLink()` emits **byte for byte**; diff them, do
not eyeball. Nurture links legitimately carry UTMs: these are external-channel links, unlike the
internal site links the CI guard forbids.

## Shipping and switch-on are two different things

Merging to `main` version-controls the script. **It does not deploy it.** The script runs as its
own project on Bradley's Google account, so pasting `Code.gs` into script.google.com, running the
README's five-step `dry_run` verification, then `SEND_MODE=live` and `installTrigger()` are
**his** actions. Never attempt them, and never report a merge as "the nurture sequence is live".

Check script.google.com state before writing a handoff: the project has been deployed in
`dry_run` since July with a heartbeat trigger, so this is usually a **paste over existing code**,
not a first-time setup, whatever a stale handoff doc says.

Deliverability is a real precondition and is not in this repo. See `verify-email-deliverability`.

Finally, `apps-script/` is not part of the Next.js build. Confirm the copy is not publicly served
after any deploy:

```bash
python3 -c "
import urllib.request as u, urllib.error
try: print(u.urlopen('https://modernbizops.com/apps-script/nurture-sender/Code.gs').status)
except urllib.error.HTTPError as e: print(e.code, '(404 expected)')"
```
