# modern-bizops-website — Claude Code conventions

Next.js on Vercel. **Merging a PR to `main` is the production deploy.** There is no separate
release step, so a merge goes straight to the site founders land on.

## Skills

- `ship-to-production` — the full deploy loop, and the reference for this repo's local-preview,
  worktree and Vercel gotchas. Use it for any "ship it", "push live", "merge this" request.
- `publish-learn-page` — publishing a `/learn` page.
- `seo-content-strategy` — page and keyword strategy.
- `verify-lead-capture` — confirming a form or CTA still writes through to HubSpot.

## Work that ships must report back (added 2026-07-28)

This repo is invisible to the Modern BizOps operating board at
`~/Documents/Claude/Projects/Modern BizOps/state/board.yaml`. That board is where Bradley decides
what to work on, and it has been wrong because of it. On 2026-07-28 it carried "26 /learn pages"
when the live sitemap had 24, and it had no record of a ten-page pSEO batch that shipped from here
days earlier.

**Rule.** Anything that merges to `main` gets a receipt in
`~/Documents/Claude/Projects/Modern BizOps/state/inbox/`. Use `_TEMPLATE.md` there; the contract is
in the `README.md` beside it. `ship-to-production` step 9 does this for you.

**Never edit `board.yaml` or the board artifact from this repo.** One writer owns the board, and
that is the weekly dreaming pass with Bradley approving. Drop evidence, not edits.

**A receipt is a lead, not a proof.** Always fill the `verify:` line with a URL, command or query
that lets a later session confirm the claim without trusting the receipt.

**If you changed the page inventory, say so and give the new total.** Page counts on the board have
gone stale twice. The cheapest verify line there is:

```bash
curl -s https://www.modernbizops.com/sitemap.xml | grep -c '<loc>'
```

## Copy conventions

Bradley's voice rules apply to anything a visitor reads. **No em dashes anywhere.** No corporate
jargon. No fabricated client results or implied testimonials; there are none yet. Benchmarks are
supporting proof, never the headline hook.

**Internal links never carry UTM parameters.** A UTM answers "which outside effort sent this
person here", so tagging an internal link ends the GA4 session and steals attribution from the
channel that earned the visit. Internal CTAs are plain links tracked with the `cta_click` event.
A CI test enforces this (PR #53); do not work around it.
