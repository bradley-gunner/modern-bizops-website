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

## Where plans live (added 2026-07-30)

| File | Holds | Never holds |
|---|---|---|
| [ROADMAP.md](ROADMAP.md) | The forward plan for **this repo**: what is next, the backlog | Anything already shipped |
| `Modern BizOps/state/board.yaml` | Business priorities, which loop, what is worth doing | Engineering detail |
| `~/RevOps Coaching App/ROADMAP.md` | The forward plan for the client-facing app | Anything about this repo |

**Linkage.** A board item concerning this repo carries a `roadmap:` reference
naming a heading in `ROADMAP.md`; an entry there carries its board item id where
one exists. Neither is the other's copy: the board says *whether and when*, the
roadmap says *what and how*. On priority the board wins; on technical scope the
roadmap wins.

**Keep `ROADMAP.md` small, and keep shipped detail out of it.** The app repo's
roadmap reached 560 KB by accumulating per-PR narrative until nobody opened it,
and then four PRs shipped from that repo with no close-out at all. Shipped detail
belongs in the receipt and the git log. "Status at a Glance" is a snapshot that
gets **rewritten** each ship, never appended to.

**Anything this repo owns that another repo gave up belongs in `ROADMAP.md`.**
The scorecard lead magnet moved here from the app repo across six weeks and two
PRs and was written into neither repo's plan until 2026-07-30. Cross-repo
ownership transfers are the thing most likely to fall between the two files.

## Copy conventions

Bradley's voice rules apply to anything a visitor reads. **No em dashes anywhere.** No corporate
jargon. No fabricated client results or implied testimonials; there are none yet. Benchmarks are
supporting proof, never the headline hook.

**Internal links never carry UTM parameters.** A UTM answers "which outside effort sent this
person here", so tagging an internal link ends the GA4 session and steals attribution from the
channel that earned the visit. Internal CTAs are plain links tracked with the `cta_click` event.
A CI test enforces this (PR #53); do not work around it.
