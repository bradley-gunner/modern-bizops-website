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

## Facts you'll need

- **Production URLs:** apex `modernbizops.com` 307-redirects to the canonical
  `www.modernbizops.com`. Verify against the `www` host.
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

**Permission gotcha:** `curl` invocations that use a `-w "%{http_code}"`-style
format string tend to get denied in this environment. Prefer driving the page
through the Chrome MCP, or a plain `curl -s -I <url>` without the `-w` format.

## 3. Commit with house conventions

Two hard rules for this user, both load-bearing:

- **No em dashes** anywhere - code, copy, comments, and commit messages. Write
  "$3M to $50M", not "$3M–$50M". Self-check the message body before committing.
- **End every commit message** with the trailer:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

Stage only what the change touches and write a conventional-commit subject
(`feat(scope):`, `fix(scope):`, `chore(scope):`). Explain the *why* in the body,
not just the what.

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
  take roughly a minute. When ready, its `alias` array includes
  `www.modernbizops.com`, which means the live site is now serving your commit.

Match the deployment to your change by the `githubCommitSha` /
`githubCommitMessage` in the metadata so you're verifying the right build.

Don't busy-wait with chained `sleep`s (the harness blocks them). Re-query
`get_deployment` after a short pause, or use the Monitor tool with an
until-loop.

## 7. Verify the live page

The deploy being `READY` is necessary but not sufficient - confirm the actual
change on the canonical host. Navigate the Chrome MCP to
`https://www.modernbizops.com/<route>`, wait for assets (Next.js `next/image`
shows a gray placeholder for a beat before the real image paints - give it a
few seconds and re-screenshot), and confirm the specific thing you changed is
present. For an interactive change, exercise it (click play, submit a form).
This screenshot is the proof you report back, not "the deploy succeeded".

## Reporting back

Tell the user, with links: the PR (`https://github.com/<owner>/<repo>/pull/<n>`),
that it's squash-merged to `main`, the production deploy id and `READY` state,
and what you saw on the live page. Flag anything outside the repo that still
needs their hand (third-party settings, optional follow-ups) rather than
implying it's all done.
