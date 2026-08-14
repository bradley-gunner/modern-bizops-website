---
name: update-legal-doc
description: Change the content or version of a legal page on modernbizops.com (/privacy, /terms, /dpa, /security). These pages are coupled to a clickwrap registry in a different repo, and changing one without the other is the failure this skill exists to prevent. Use whenever a disclosure is added, a processor changes, a policy is amended, or someone asks to bump a legal version string.
---

# Change a legal page on modernbizops.com

Four pages are legal documents: `/privacy`, `/terms`, `/dpa`, `/security`. Each
prints a version string, and each is **coupled to a registry in a different
repo**: `server/src/lib/legalDocs.js` in the RevOps Coaching App (GitHub
`bradley-gunner/audit-engine`). The app records which version a user accepted.

**A site page and a registry that disagree is the failure mode.** Each page
carries a `VERSION COUPLING` comment saying exactly that. Do not treat it as
decoration.

## Step 1: decide whether the version moves at all

Adding or clarifying content does **not** automatically require a bump. There is
a live precedent both ways:

- **Content added, version held.** The Microsoft Clarity disclosure (2026-06-27)
  and the HubSpot + public-surface-read disclosures (2026-08-14, first pass) were
  added with the version string deliberately unchanged, on the grounds that they
  clarify rather than widen, with the full bump deferred to the pending Privacy
  Policy audit. **Record the reasoning in the page's comment when you do this**,
  or the next session reads it as an oversight.
- **Version moved.** Later the same day Bradley asked for the bump, and it moved
  to `privacy-2026-08-14`.

If you are unsure, say so and ask. A held version with a written reason is safe;
a silent mismatch is not.

## Step 2: understand `gated` vs `material`, which are different things

Read them out of `legalDocs.js` rather than assuming:

- **`gated`** decides whether a bump forces a re-acceptance interstitial.
  `GATED_DOC_TYPES` is `['TERMS', 'DPA']` only. **PRIVACY and SECURITY are
  ungated**, so bumping them records the change and forces nothing. This makes a
  privacy bump far lower risk than it first appears, and worth checking before
  you warn anyone about re-consent.
- **`material`** drives `lastMaterialVersion()`, which re-acceptance compares
  against for the gated docs.

**Bradley's rule (2026-08-14): reserve `material: true` for a change that
actually widens what is collected or who receives it. A clarification is
`material: false`.** Marking a clarification material moves the signal for
something that did not change the deal, which is how the signal stops meaning
anything.

## Step 3: change both halves in one window

1. **Site** (`app/privacy/page.js` or the sibling page): the "Last updated" line,
   the `Version: ...` line, and the `VERSION COUPLING` comment, which should
   record what changed and why the material flag is what it is.
2. **App** (`server/src/lib/legalDocs.js`): append an entry to that doc's
   `versions[]` array. Do not edit the existing entry; the history is the point.

## Step 4: run the FULL app test suite, not the obvious file

**The version is pinned in two places and this has already bitten.** A session
ran `server/src/__tests__/legalDocs.test.js`, saw 6/6 green, and called the
change verified. `server/src/__tests__/routes.legal.test.js` asserts the same
version through the `/api/legal/current` response and was still pinned to the
old string. The branch would have failed the moment anything ran the suite.

```bash
cd "$HOME/RevOps Coaching App"
grep -rn "privacy-2026" server/src client/src docs   # find every pin first
npx vitest run server/src/__tests__                  # then run all of it
```

Historical planning documents under `docs/superpowers/plans/` and `specs/` also
contain the old version. **Leave those alone**: they record what was true when
they were written, and rewriting them falsifies the archaeology.

## Step 5: ship both, app first

Both repos squash-merge PRs to `main`. Open one PR in each, cross-link them in
both bodies, and say plainly in each that they must merge in the same window.

**Merge the app registry first, then the site page.** The content is usually
already live (it ships ahead of the version string), so the registry pointing at
the new version makes it accurate about reality sooner. The reverse leaves the
app recording acceptances against a version whose published page still shows the
old string.

The site repo's own loop still applies for its half: use `ship-to-production`.

Two mechanical notes:
- The site PR will sit at `mergeStateStatus: UNSTABLE` while the Vercel preview
  builds. That is not a failure. Wait for `CLEAN` rather than reaching for
  `--admin`, which bypasses branch protection.
- The app repo's `main` often carries unrelated uncommitted changes from other
  sessions. Stage your files explicitly and check the PR's file list before
  merging.

## Step 6: verify the live page, defeating the CDN

`/privacy` is a static page and sits behind Vercel's edge cache, so a query-string
cache-buster is not reliable. Send a no-cache header:

```bash
python3 -c "
import urllib.request as u, re
req=u.Request('https://modernbizops.com/privacy', headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache','Pragma':'no-cache'})
h=u.urlopen(req,timeout=40).read().decode('utf-8','replace')
t=re.sub(r'<[^>]+>',' ',h); t=re.sub(r'\s+',' ',t)
m=re.search(r'Version: [a-z]+-[0-9-]+ \(effective [^)]+\)', t); print(m.group(0) if m else 'NOT FOUND')"
```

A stale read here is how a session briefly concluded the deploy had not landed
when it had. Confirm the Vercel deployment is `READY` and carries the apex alias
before blaming the code.

## Step 7: receipt

Per the repo rule, drop a receipt in the Modern BizOps `state/inbox/`. Name both
PRs, both merge commits, and the material decision with its reasoning, because
that decision is the part a future reader will want and cannot re-derive.
