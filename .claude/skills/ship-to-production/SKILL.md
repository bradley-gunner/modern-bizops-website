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

- **`board:`** the item ids from `state/board.yaml` this closes, advances or unblocks. Read the
  board first, do not guess ids. If nothing matches, say so under `new:`.
- **`verify:`** the URL, command or connector query a later session runs to confirm this
  independently. **A receipt is a lead, not a proof.** The dreaming pass re-checks before it
  proposes anything, and if the probe disagrees the probe wins.
- **Page inventory.** If this PR added, removed or renamed any indexable page, say so explicitly
  and give the new total. Page counts on the board have gone stale twice, and a live sitemap
  fetch is the cheapest verify line there is:
  `curl -s https://modernbizops.com/sitemap.xml | grep -c '<loc>'`

**Do NOT edit `board.yaml` or the board artifact from this repo.** One writer owns the board, and
that is the dreaming pass with Bradley approving.

If the Modern BizOps folder is unreachable, say so in your report-back rather than skipping
silently.

## Reporting back

Tell the user, with links: the PR (`https://github.com/<owner>/<repo>/pull/<n>`),
that it's squash-merged to `main`, the production deploy id and `READY` state,
and what you saw on the live page. Flag anything outside the repo that still
needs their hand (third-party settings, optional follow-ups) rather than
implying it's all done.
