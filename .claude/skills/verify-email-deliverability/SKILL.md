---
name: verify-email-deliverability
description: Check or fix SPF, DKIM and DMARC for a domain that sends mail (bradleydewet.com, modernbizops.com), and verify the result against real DNS rather than a dashboard. Use before switching on any automated sending (nurture sequences, cold outreach, transactional mail), when mail is landing in spam, when adding a new sending service, or when tightening a DMARC policy. Also use when someone asks why emails are not being delivered or opened.
---

# Verify and fix email authentication

Unauthenticated mail lands in spam, silently, with no bounce and no error. Perfect copy in a
spam folder is worth nothing, so this check comes **before** switching on any automated sending,
not after the first send goes badly.

DNS for both domains is at **Cloudflare** (account `ead4dec108892a7ca216160c07bad288`), driven
through the browser with `mcp__claude-in-chrome__*` against Bradley's logged-in session. DKIM
keys are generated in the **Google Workspace Admin console**, not in Cloudflare.

## Diagnose first, in one command

```bash
D=bradleydewet.com
echo "NS   "; dig +short NS $D
echo "MX   "; dig +short MX $D
echo "SPF  "; dig +short TXT $D | grep -i spf
echo "DMARC"; dig +short TXT _dmarc.$D
echo "DKIM "; dig +short TXT google._domainkey.$D | head -c 80
```

Read it as a system, not four separate facts. **The MX tells you who sends.** If MX is
`smtp.google.com` then mail goes out through Google, so SPF must include `_spf.google.com` and a
Google DKIM key must exist. bradleydewet.com failed exactly this way: SPF authorized only
HubSpot while every Gmail send softfailed, and no DKIM record existed at all.

## Three traps, all of which cost time here

**The zone's own NS records lie.** bradleydewet.com's Cloudflare zone contains four
`ns-cloud-*.googledomains.com` NS records, which read as "Google is authoritative, your
Cloudflare edits are inert". They are stale leftovers; the real delegation is
`naya.ns.cloudflare.com` / `damon.ns.cloudflare.com`. **Always confirm delegation with
`dig +short NS <domain>`, never by reading the NS rows inside the zone editor.**

**A missing DKIM record is not proved by one selector.** Probe several
(`google`, `google1`, `google2`, `selector1`, `selector2`, `default`, `dkim`, `s1`, `s2`) and
**run the same probe against a control domain that you know publishes DKIM**, so an empty result
means "absent" rather than "my lookup is broken":

```bash
dig +short TXT google._domainkey.anthropic.com | head -c 60   # control: must be non-empty
```

**Read the exit code you think you are reading.** `dig ... | head` reports `head`'s status.
Count bytes or matches and assert on the count.

## DKIM: Admin console first, Cloudflare second

You cannot create a DKIM record from Cloudflare alone, and inventing a key is worse than
publishing none.

1. Google Admin > **Apps > Google Workspace > Gmail > Authenticate email**. Select the domain.
   Status will read "Not authenticating email".
2. **Generate new record**: 2048-bit, default `google` prefix.
3. Copy the value into a Cloudflare TXT record named `google._domainkey`. The value is ~410
   chars; **the harness may block the raw string from reaching you, which is fine**: select it
   in the page, press `cmd+c`, and paste with `cmd+v` so it never passes through the
   conversation. Verify by shape instead of by reading:

   ```bash
   python3 -c "
   import subprocess, re
   raw=subprocess.run(['dig','+short','TXT','google._domainkey.bradleydewet.com'],capture_output=True,text=True).stdout
   v=''.join(re.findall(r'\"([^\"]*)\"', raw))   # DNS concatenates chunked TXT strings
   m=re.match(r'^v=DKIM1;\s*k=rsa;\s*p=([A-Za-z0-9+/=]+)\$', v)
   print('len', len(v), 'key', len(m.group(1)) if m else 0, 'wellformed', bool(m))"
   ```

   A 2048-bit key is **392 base64 chars, 410 total**. Anything shorter means Cloudflare's TXT
   chunking or a truncated paste ate it. Join the quoted chunks before measuring.
4. Back in Admin, click **Start authentication**. Status must flip to **"Authenticating email
   with DKIM"**. That is Google's own confirmation it can resolve and match the key, and is
   better evidence than your own lookup.

## SPF

Add to the existing record, never replace it. bradleydewet.com sends through **both** Google and
HubSpot, so both includes must survive:

```
v=spf1 include:_spf.google.com include:244508932.spf02.hubspotemail.net ~all
```

**Budget is 10 DNS lookups.** Check what each include expands to (`dig +short TXT _spf.google.com`);
flat ip4/ip6 lists cost 1 each, nested includes cost more. Keep `~all` (softfail) rather than
`-all` until DMARC reporting proves every legitimate sender passes.

## DMARC: never tighten on the same day you fix auth

Correct order is **authenticate, then observe, then enforce.** Jumping to `p=quarantine` or
`p=reject` the hour SPF and DKIM go live is how legitimate mail disappears, because you do not
yet know every service that sends as the domain. bradleydewet.com's zone also carries
Squarespace, Webflow and `base44.onrender.com` records.

Start by making DMARC actually collect evidence, which a bare `p=none` does not:

```
v=DMARC1; p=none; rua=mailto:bradley@bradleydewet.com
```

Then after roughly two weeks of clean aggregate reports, move to `p=quarantine`, then `p=reject`.
Reports are daily XML attachments, so suggest a dedicated alias if the inbox gets noisy.

## A non-sending domain is a different problem

**modernbizops.com has no MX records at all** and no SPF. The textbook hardening for a domain
that sends nothing is `v=spf1 -all` plus `p=reject`, which stops spoofing outright. **Do not
apply it reflexively.** Establish first that nothing sends as that domain: HubSpot forms and the
app portal's transactional mail are both plausible, and `-all` would lose that mail silently with
no bounce. Board item `modernbizops-spf-record` tracks it.

## Verify against DNS, not the dashboard

A saved record in Cloudflare is not a published record. Confirm across resolvers, including the
authoritative one, and expect Cloudflare's record-count UI to lag:

```bash
for r in "" "@naya.ns.cloudflare.com" "@8.8.8.8" "@1.1.1.1"; do
  echo -n "$r "; dig +short $r TXT google._domainkey.bradleydewet.com | wc -c
done
```

Identical non-trivial byte counts across all four is the proof. A single lookup can come back
empty transiently; retry before concluding anything is wrong.
