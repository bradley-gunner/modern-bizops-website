---
name: ship-to-production
description: >-
  How to ship a code change to the modernbizops.com production site end to end:
  branch, verify locally, commit with house conventions, open a PR, squash-merge
  to main, confirm the Vercel production deploy, and verify the live page. Use
  this whenever the user wants to deploy, "ship it", "push live", "put this in
  production", or asks you to create a PR and merge for this repo, even if they
  don't name the steps. Also use it as the reference for the local-preview and
  Vercel-verification gotchas specific to this repo and its git worktrees.
---

# Ship a change to modernbizops.com production

This repo (`modern-bizops-website`, Next.js on Vercel) deploys to production on
every merge to `main` via the Vercel GitHub integration. There is no separate
release step: **merging the PR is the deploy.** That makes the discipline below
matter, because a merge goes straight to the live site founders land on.

The whole loop is: branch → change → verify locally → commit → PR → squash-merge
→ confirm the Vercel deploy → verify the live page. Don't skip the two
verification ends; the local one catches build breaks before they reach a
deploy, and the live one is the only proof the thing founders see is actually
correct.

## A passing check proves nothing until you have proved it can fail (added 2026-08-12)

This governs every verification step below. A check that has never been seen to
fail is not evidence, it is a habit. Three of them passed on broken work in a
single session:

- An OG share card carried a retired tagline through five task reviews and a
  scoped re-review that verified byte sizes, path resolution, and presence in
  the built HTML. All of it passed. The words were baked into the PNG, and only
  opening it as an image found them.
- A "zero hits sitewide" grep returned zero because it was a case-sensitive
  `grep -F` run against a sentence-initial "Fifteen years". Zero hits read as a
  clean sweep and meant the pattern had never matched anything.
- Worst: a test helper stripped block comments before line comments, so a
  `*.jsx` glob sitting inside a line comment opened an unterminated block
  comment that swallowed the rest of the file. The assertion received **2,985 of
  `lib/learn/registry.js`'s 93,817 characters, 3 percent of it**. The guard
  written to stop a banned claim regressing across 26 pages was scanning three
  percent of its target and reporting green.

**Rule. When you add a guard, or lean on one that already exists, introduce a
real violation, watch the guard fail and name the offending file, then revert
the violation.** Do this for CI tests, for greps you run by hand, and for any
assertion you plan to make about the whole site. The cost is under a minute; the
failure mode is shipping with a green check that was never looking at anything.

**Check that your injected violation actually landed (added 2026-08-14.)** A
session proving a voice guard ran a `str.replace()` whose search string did not
match the file, so nothing changed, the guard passed, and the pass was briefly
read as "the guard does not bite." The fix is one line: `assert new != old` on
the injection, or grep the file for the violation before running the guard. A
no-op injection produces exactly the same green as a broken guard.

**Read the exit code you think you are reading (added 2026-08-18.)** `grep -rl X . | head`
reports `head`'s status, not `grep`'s, so `echo "exit=$?"` after it prints 0 whether or not
anything matched. A sweep "proving" a retired string was gone read clean this way. **Count
the matches instead of testing an exit code**, and make the count the assertion:

```bash
grep -rl "bdw-horizontal" .next/server/app --include='*.html' | wc -l
```

**Revert an injected violation surgically, not with `git checkout -- <file>` (added
2026-08-18.)** Proving a guard bites means editing a file you are usually already working
in. A whole-file checkout to undo the injection silently threw away five real edits in the
generator this session and they had to be reapplied from scratch. Inject into a BUILD
artifact where possible (`.next/server/app/*.html`, thrown away by the next build), or
`git stash push -- <paths>` first, or reverse the exact string you inserted.

**A scoped test passing is not the change being verified (added 2026-08-14.)**
A privacy version bump was "verified" by running `legalDocs.test.js` alone, 6/6
green. A second suite, `routes.legal.test.js`, asserted the same version through
an API response and was still pinned to the old string; the branch would have
failed the moment anything ran the full suite. **Before merging, grep the whole
repo for the literal value you changed** and run the full suite, not the file
you were looking at. Values that appear in more than one place are exactly the
ones worth grepping: version strings, counts, enum values, prices.

**When a guardrail is doing visible work on ordinary inputs, suspect the model,
not the guardrail (added 2026-08-14.)** The Scan shipped telling a $10M business
it was leaving $7,499,999 on the table, which was exactly the 75 percent
aggregate cap. The instinct to tighten the cap was wrong: one dollar generator
used a throughput model claiming annual revenue scales linearly with pipeline
turnover, and it alone produced 65 percent of the total. Retiring it dropped the
figure to 29 percent of revenue with no cap firing. Caps, clamps and `Math.min`
guards that bind on a normal profile are evidence of a broken computation
upstream. Bradley's framing, worth keeping: **a cap is an artificial
corner-cutting move rather than a fix for the actual problem.**

**A summarizer's count is not a count (added 2026-08-18).** WebFetch reported the live
sitemap held 41 `<loc>` entries. It held 39. The number went into a board receipt, where page
counts have already gone stale twice, and was only caught because the receipt rule forces a
live fetch. **Never take a number from a tool that reads a page on your behalf.** Fetch the
raw bytes and count them yourself:

```bash
python3 -c "
import urllib.request as u
h=u.urlopen(u.Request('https://modernbizops.com/sitemap.xml',headers={'User-Agent':'Mozilla/5.0'}),timeout=25).read().decode()
print(h.count('<loc>'))"
```

**A substring test is not an equality test, and old values are often substrings of new ones
(added 2026-08-18).** Verifying a booking-slug change, `if "discovery-call" in html` returned
true on a page carrying only the OLD `revops-coaching-discovery-call`, because the new value
is a substring of the old one. The check could not have failed. **Extract the whole token
with a regex and compare that**, and prove it by running the regex against a known-positive
control containing the old value:

```bash
re.findall(r'bradley-de-wet/[a-z-]+', html)   # returns the full slug, so old != new
```

Renames, version bumps and slug changes are exactly where this bites, because the two values
usually share a stem.

**Some pages hold the value in the CLIENT BUNDLE, not the server HTML (added 2026-08-18).**
`/book` renders its booking embed only after the qualifying form, so grepping the page source
for the slug found nothing and looked like a regression. The value was in
`/_next/static/*.js`. When a server-HTML grep comes back empty for something you know shipped,
pull the page's script `src`s and grep those before concluding anything.

## Facts you'll need

- **Production URLs:** the apex `modernbizops.com` **is** the canonical serving
  host, and `www.modernbizops.com` 308-redirects to it. **Verify against the
  apex.** This is a Vercel domain setting, not a code redirect, so you will not
  find it in `next.config.js`. It runs the other way round from how this skill
  described it until 2026-08-04, and the direction is load-bearing: the earlier
  www-canonical arrangement caused a real indexing bug, so do not flip it back.
  Verified 2026-08-04, apex returns 200 and www returns 308 to the apex:

  ```bash
  python3 -c "import urllib.request as u
  class N(u.HTTPRedirectHandler):
      def redirect_request(self,*a,**k): return None
  op=u.build_opener(N)
  for h in ['https://modernbizops.com/','https://www.modernbizops.com/']:
      try: print(h,'->',op.open(u.Request(h,method='HEAD',headers={'User-Agent':'Mozilla/5.0'}),timeout=20).status)
      except u.HTTPError as e: print(h,'->',e.code,e.headers.get('Location'))"
  ```
- **Vercel project id:** `prj_K6Zj9Da39ebgxcxngLupQ7SkMWi1`
- **Vercel team id:** `team_cqQoFdwHzTvwocS8Qgf9WrSA` (slug `bradley-de-wets-projects`)
- **Repo behavior:** PRs are **squash-merged**. `main` is the production branch.

## 1. Branch

Never commit straight to `main`. If you're already on a `claude/*` working
branch you may keep using it; otherwise cut a short, descriptive branch:

```bash
git checkout -b claude/<short-slug>
```

## 2. Verify locally before you commit

Only needed when the change is observable in the browser (a rendered page,
asset, or client behavior). Skip it for pure config/docs/test changes that the
preview can't exercise.

**Worktree gotcha:** when you're working inside `.claude/worktrees/<name>`, the
Claude preview MCP (`preview_start`) runs `next dev` from the **main repo root**,
not the worktree, so it serves the OLD code and your edits never appear. Start
the dev server yourself from the worktree on an alt port instead (the preview
tool holds 3000):

```bash
(npx next dev -p 3005 > /tmp/dev.log 2>&1 &)
```

Then drive a real browser against it. Navigate the Chrome MCP to
`http://localhost:3005/<route>`, screenshot, and exercise the change (click,
scroll, read console for page-origin errors). Ignore console errors whose stack
frames are `chrome-extension://…` - those are the user's browser extensions, not
the page. Stop the server when done: `pkill -f "next dev -p 3005"`.

**Reviewing rendered output: build, do not run a dev server (added 2026-08-12).**
The dev server compiles each route on demand, so a sweep that touches many
routes crawls. Two agents stalled doing exactly that in one session and one was
killed by a 600-second watchdog. When what you need is the rendered text or
markup rather than a live interaction, build once and grep the HTML:

```bash
npm run build
grep -rn '<pattern>' .next/server/app --include='*.html'
```

Recurse with `--include` rather than globbing `.next/server/app/*.html`: the
`/learn` pages build into a `learn/` subdirectory, so the top-level glob skips
every one of them and hands you a clean zero. That is the section above in
miniature.

Keep the dev server for the thing it is actually good at: a single route you
need to click through. And for a title tag, prefer the live check in step 7,
since this repo's rule is that a title is confirmed on the live page and never
from the source string.

**The in-app browser only paints the TOP of a long page (added 2026-08-18).** Screenshots
of anything below the fold on `/` or `/about` come back as a blank cream rectangle, on
production as well as locally, and `read_page` confirms it: the accessibility tree stops
after the header. Scrolling by JS, by `End`, or by `computer` scroll does not fix it
reliably. This is a tool limitation, not a broken page, and it is easy to lose twenty
minutes to.

Three ways through, cheapest first:

1. **Measure in the DOM instead of looking.** `javascript_tool` reads the real geometry even
   when the pane will not paint it: element rects, computed styles, `currentSrc`. Enough for
   "does the button clear the text", "is the header still 97px", "which image loaded".
2. **Render the component alone on a throwaway route.** A short page paints fine. This is
   the only way to actually SEE a below-the-fold component:

   ```jsx
   // app/zz-preview/page.js. DELETE before committing.
   import FinalCta from "@/components/home/FinalCta";
   import Footer from "@/components/Footer";
   export default function P() { return (<><main><FinalCta /></main><Footer /></>); }
   ```

   Include the neighbours the change is ABOUT (here the footer, because the bug was the CTA
   blending into it). Delete the route before staging; it is a harness, not a deliverable.
3. **Short pages render normally.** `/watch` and `/revenue-operations-consulting` paint to
   the bottom, so a component used on both a long and a short page can be checked on the
   short one.

**Permission gotcha:** `curl` invocations that use a `-w "%{http_code}"`-style
format string tend to get denied in this environment. Prefer driving the page
through the Chrome MCP, or a plain `curl -s -I <url>` without the `-w` format.

## 3. Commit with house conventions

Two hard rules for this user, both load-bearing:

- **No em dashes** anywhere - code, copy, comments, and commit messages. Write
  "$3M to $50M", not "$3M–$50M". Self-check the message body before committing.
- **End every commit message** with the trailer
  `Co-Authored-By: Claude <model name> <noreply@anthropic.com>`, using the
  model actually running (e.g. `Claude Sonnet 5`, `Claude Opus 4.8`). The
  harness system prompt states the current model.

Stage only what the change touches and write a conventional-commit subject
(`feat(scope):`, `fix(scope):`, `chore(scope):`). Explain the *why* in the body,
not just the what.

**`git add -A` is blocked by a hook and this is not a nuisance to work around.**
`session_scope.py` rejects it, because several concurrent sessions and scheduled
passes write this repo and `-A` would sweep another session's uncommitted work
into your commit, making it unrevertible on its own. Pass the explicit paths:

```bash
git add app/learn/[slug]/page.js lib/learn/registry.js
```

Branching in a worktree also needs the explicit base, since the local checkout
is usually sitting on an already-merged branch rather than `main`:

```bash
git fetch origin main && git checkout -b claude/<slug> origin/main
```

## 4. Push and open the PR

```bash
git push -u origin <branch>
gh pr create --title "<conventional subject>" --base main --head <branch> \
  --body "<summary + verification notes>"
```

End the PR body with the Claude Code attribution line:
`🤖 Generated with [Claude Code](https://claude.com/claude-code)`

## 5. Squash-merge (this is the deploy)

**Lead-capture / HubSpot changes - gate before merging.** If the change touches a
lead path (`/scorecard`, `/playbook`, `/book`, `/watch`) or the code behind it
(`app/api/submit-*`, `lib/hubspot*`), the merge can silently drop real leads:
HubSpot rejects form submissions from any unregistered site domain as spam with
no visible error. Before merging, confirm `modernbizops.com` is still registered
in HubSpot's site domains and verify the change end-to-end against HubSpot (a
browser success screen does NOT prove a contact was created). **REQUIRED
SUB-SKILL:** Use verify-lead-capture.

**When a live test submission is not authorized, fall back to a read-only proxy
and label it honestly (added 2026-08-12).** Query HubSpot for recent contacts
carrying `lead_magnet` and confirm the path produced them with
`lifecyclestage: lead`, `hs_lead_status: NEW`, and the no-deal invariant
holding. Then say plainly what that does and does not establish: **it proves the
path worked when those contacts were created. It does NOT prove the
site-domain registration is correct today**, which is the failure this gate
exists to catch, and which is silent. The proxy is sufficient only when the
change touches none of the form payload, the form id, or the domain. If it
touches any of the three, ask for authorization to submit a real test rather
than merging on the proxy.

**Stacked PRs: merge the child into the parent first (added 2026-08-12).** When
a second PR is based on the first, merging the parent to `main` first puts an
intermediate state live, because the merge is the deploy. Merge the child into
the parent branch, then squash-merge the parent to `main`, so the whole change
reaches production as ONE deploy. This session shipped both refit PRs that way
deliberately.

```bash
gh pr merge <PR#> --squash
```

**Worktree gotcha:** `gh pr merge --delete-branch` fails inside a worktree with
`fatal: 'main' is already checked out` - because it tries to switch the local
checkout to `main`, which the main repo already holds. The **merge still
succeeds**; only the local branch-switch fails. Confirm with
`gh pr view <PR#> --json state -q .state` (expect `MERGED`), then delete the
remote branch separately:

```bash
git push origin --delete <branch>
```

## 6. Confirm the Vercel production deploy

Merging kicks off a production build. Confirm it reached `READY` rather than
assuming. Use the Vercel MCP tools (load via ToolSearch if deferred):

- `list_deployments` with the project/team ids above - the newest entry with
  `target: "production"` should carry your squash-merge commit. It starts
  `BUILDING`.
- `get_deployment <id>` - poll until `state` / `readyState` is `READY`. Builds
  take roughly half a minute. When ready, its `alias` array includes the apex
  `modernbizops.com`, which means the live site is now serving your commit.
  **`list_deployments` does not return `alias` at all**, so the alias check has
  to come from `get_deployment`; do not go looking for it in the list output.
  The array carries five entries, both site hosts among them (verified against
  the PR #58 production deploy, 2026-08-04):

      "alias": [
        "modernbizops.com",
        "modern-bizops-website.vercel.app",
        "www.modernbizops.com",
        "modern-bizops-website-bradley-de-wets-projects.vercel.app",
        "modern-bizops-website-git-main-bradley-de-wets-projects.vercel.app"
      ]

  **`www.modernbizops.com` is in there too, so checking for it is not a false
  signal, just the wrong one.** Both hosts are aliased to the deployment and
  Vercel redirects www to the apex at the edge. Check for the apex, because that
  is the host that serves and the host you verify in step 7.

Match the deployment to your change by the `githubCommitSha` /
`githubCommitMessage` in the metadata so you're verifying the right build.

Don't busy-wait with chained `sleep`s (the harness blocks them). Re-query
`get_deployment` after a short pause, or use the Monitor tool with an
until-loop.

**The Vercel connector rate-limits, sometimes for minutes at a stretch, and it
returns "The connector's server is rate-limiting requests" rather than anything
deploy-shaped.** Do not read that as a deploy problem. Two ways through, and
prefer the second: run a background `sleep 100` and retry after, or **skip
straight to step 7 and verify the live page**. A correct live page is stronger
evidence than a READY state anyway, since READY only says a build finished. Come
back for the deployment id afterwards when you need it for the receipt.

**If no production deployment ever appears (the merge did not trigger a build).**
Sometimes the squash-merge to `main` produces NO production deployment at all,
so "poll until READY" would wait forever. Symptoms: `list_deployments` shows
only the branch `Preview` (`target: null`) for your commit and no
`target: "production"` entry, and `get_project`'s `latestDeployment` is that
preview. In the dashboard, the Deployments list has a Preview row for your PR
but no Production row (every healthy PR has both). This is not a slow build; the
push-to-`main` webhook silently no-op'd, or Vercel skipped a build identical to
the already-built preview. Do not wait it out.

Recover by promoting the branch's Ready build. Open that Preview deployment in
the Vercel dashboard (Chrome MCP), open the `⋯` **Deployment Actions** menu, and
click **Promote to Production**. Its dialog confirms it builds a NEW deployment
using the production environment and aliases it to the production domains (so
env vars are correct, not carried over from preview). It is reversible via
Instant Rollback. Then confirm the new production deployment reaches `READY` and
carries the apex `modernbizops.com` alias, and verify the live page as in step 7.
(Root cause was a one-off dropped webhook; the next normal merge should deploy on
its own.)

## 7. Verify the live page

The deploy being `READY` is necessary but not sufficient - confirm the actual
change on the canonical host, which is the **apex**. Navigate the Chrome MCP to
`https://modernbizops.com/<route>`, wait for assets (Next.js `next/image`
shows a gray placeholder for a beat before the real image paints - give it a
few seconds and re-screenshot), and confirm the specific thing you changed is
present. For an interactive change, exercise it (click play, submit a form).
This screenshot is the proof you report back, not "the deploy succeeded".

**Poll for the TRANSITION, not for the presence of the new thing (added 2026-08-18).** Fetch
in a short loop and print old-count and new-count each pass. Seeing the old value once and
the new value on a later pass is strictly stronger evidence than one fetch that happens to
show the new value: it proves the check discriminates, it proves you were looking at the
right string, and it dates the deploy. Every live verification this session used this shape
and one of them caught that the first two fetches were still the previous build.

```bash
python3 - <<'EOF'
import urllib.request as u, time
for i in range(8):
    h = u.urlopen(u.Request('https://modernbizops.com/?cb=%d' % i,
        headers={'User-Agent':'Mozilla/5.0'}), timeout=30).read().decode('utf-8','replace')
    old, new = h.count("<the string being replaced>"), h.count("<the new string>")
    print(f"attempt {i+1}: old={old} new={new}")
    if new and not old: break
    time.sleep(20)
EOF
```

**A binary asset is verified by its BYTES, not by a 200 (added 2026-08-18).** OG cards,
posters and logos keep serving the old file for a while after a deploy, and they 200 the
whole time. Hash the deployed file against the local one:

```bash
curl -s https://modernbizops.com/og/og-homepage.png | md5
```

Compare to `md5 -q public/og/og-homepage.png`. Equal means that exact artwork is live.
And when the asset carries WORDS, hashing is still not enough: open it and read it. Baked-in
text is invisible to every grep in this repo, which is how a share card claimed 51
competencies and another said "REVENUE MATURITY MODEL" months after the rename.

**Head-level checks need the browser or a raw fetch, not WebFetch.** WebFetch
converts the page to markdown and strips the `<head>`, so it cannot see the
`<title>`, meta tags, canonical, or JSON-LD. WebFetch is fine for body content,
but a cache-buster query (`?v=check`) avoids its 15-minute per-URL cache when you
re-check.

For `<head>` content the fastest path is `python3` with `urllib`, which needs no
browser and gives you the exact string and its length. `curl` is blocked in some
sessions, so prefer this:

```bash
python3 -c "
import urllib.request as u, re
h = u.urlopen(u.Request('https://modernbizops.com/<route>', headers={'User-Agent':'Mozilla/5.0'}), timeout=25).read().decode('utf-8','replace')
for pat in [r'<title[^>]*>(.*?)</title>', r'<meta name=\"description\" content=\"(.*?)\"', r'<link rel=\"canonical\" href=\"(.*?)\"']:
    m = re.search(pat, h, re.S)
    print(len(m.group(1)) if m else '-', repr(m.group(1)) if m else 'NOT FOUND')"
```

**Lengths matter, not just presence.** Google truncates titles past roughly 60
characters and meta descriptions past roughly 155 to 160. A title can be present,
correct, and still be losing its hook in the SERP, which is exactly what happened
to three /learn pages for three weeks (PR #58). If the change touched a title or
meta, print the length and check it against those bounds; do not eyeball it.

Use the Chrome MCP instead when you need to SEE the page (layout, images, an
interactive flow), and screenshot that as the proof you report back.

## 8. Google Search Console (only for new or meaningfully changed indexable pages)

Skip this for fixes, styling, or funnel pages. For a NEW public page (or a big
content change worth recrawling), get it into Google's queue.

**A title or meta change on an already-indexed page does NOT qualify**, even
though it is an SEO change and the temptation is real. Google recrawls known
pages on its own, the daily Request Indexing quota is only about 10 to 12, and
spending it re-queueing pages Google already has is how a genuinely new page
waits. Request indexing for those only if the new snippet still has not appeared
in the SERP after a couple of weeks.

**The GSC MCP `submit_url` tool is a no-op.** It returns
`"submission_status": "SUBMITTED_FOR_INDEXING"` plus a fine-print note that the
response is SIMULATED, because the Search Console API has no request-indexing
endpoint for regular pages (the real Indexing API only covers job postings and
livestreams). Do not report success from that tool. The property is
`sc-domain:modernbizops.com`.

What actually works, via the Chrome MCP driving the GSC UI
(`https://search.google.com/search-console`):

1. **Sitemap**: Indexing > Sitemaps. `https://modernbizops.com/sitemap.xml`
   should already be registered (first registered July 2026); if the new URL is
   in `app/sitemap.js` it gets discovered from there. If the sitemaps list is
   ever empty, submit the full sitemap URL in the "Add a new sitemap" field.
2. **Request Indexing per URL**: paste the full URL into the top "Inspect any
   URL" search box, wait for inspection (a few seconds), then click REQUEST
   INDEXING. A "Submitting request" spinner runs 30-60 seconds, then "Indexing
   requested" confirms the priority crawl queue. Repeat per URL; there is a
   daily quota (roughly 10-12), so batch accordingly.

A fresh page typically shows "Discovered - currently not indexed" right after
sitemap pickup; that is normal, not an error.

## 9. Write the board receipt (added 2026-07-28)

**Last step, and not optional.** Everything above ends inside this repo, Vercel, or GSC. None of
it is visible to the Modern BizOps operating board, which is where Bradley actually decides what
to work on. This step is the only thing that crosses that boundary.

Why it exists: on 2026-07-28 the board was reconciled against live sources and nine claims were
wrong. Every one of them described work that had finished somewhere else and never came back. The
board carried "26 /learn pages" when the sitemap had 24, and did not know about a ten-page pSEO
batch that had shipped from this repo days earlier.

Write one file, using the template and contract in
`/Users/bradleydewet/Documents/Claude/Projects/Modern BizOps/state/inbox/`:

```bash
INBOX="/Users/bradleydewet/Documents/Claude/Projects/Modern BizOps/state/inbox"
cp "$INBOX/_TEMPLATE.md" "$INBOX/$(date +%F)-site-<PR#>.md"
# then fill it in
```

Fill every field. Three matter most for this repo:

- **`board:`** the item ids this closes, advances or unblocks. **Read `state/board.db`, NOT
  `state/board.yaml` (corrected 2026-08-14).** The yaml is stale and a session grepping it
  reported three ids as non-existent when all three were in the db. That turns a lookup miss
  into a confidently wrong claim, and a receipt saying "no item covers this" proposes a
  duplicate. Do not guess ids; if nothing matches after querying the db, say so under `new:`.

  ```bash
  cd "$HOME/Documents/Claude/Projects/Modern BizOps/state" && python3 -c "
  import sqlite3; c=sqlite3.connect('board.db'); c.row_factory=sqlite3.Row
  for r in c.execute('select id,title,stage,next_action,done_when from items where id=?',('<item-id>',)):
      print(dict(r))"
  ```

  **Check the item's `done_when` before writing `closes:`.** Most items that a PR seems to
  finish have a second clause the merge does not satisfy (an observation in a third-party
  system, a change in another repo). Write `advances:` and say precisely which half is done.
- **`verify:`** the URL, command or connector query a later session runs to confirm this
  independently. **A receipt is a lead, not a proof.** The dreaming pass re-checks before it
  proposes anything, and if the probe disagrees the probe wins.
- **Page inventory.** If this PR added, removed or renamed any indexable page, say so explicitly
  and give the new total. Page counts on the board have gone stale twice, and a live sitemap
  fetch is the cheapest verify line there is:
  `curl -s https://modernbizops.com/sitemap.xml | grep -c '<loc>'`

**Do NOT edit `board.db`, `board.yaml` or the board artifact from this repo.** One writer owns
the board, and that is the dreaming pass with Bradley approving. Reading the db to find the
right ids is correct and expected; writing to it is not.

**Write the receipt even when the PR is not merged yet**, marking `merged:` and `commit:`
honestly (`not-yet`, the branch head) with a line at the top saying nothing is live. The inbox
exists because work finishes somewhere else and never comes back; a receipt written at merge
time is one interrupted session away from never existing. Update the front matter when it
merges.

If the Modern BizOps folder is unreachable, say so in your report-back rather than skipping
silently.

## Reporting back

Tell the user, with links: the PR (`https://github.com/<owner>/<repo>/pull/<n>`),
that it's squash-merged to `main`, the production deploy id and `READY` state,
and what you saw on the live page. Flag anything outside the repo that still
needs their hand (third-party settings, optional follow-ups) rather than
implying it's all done.
