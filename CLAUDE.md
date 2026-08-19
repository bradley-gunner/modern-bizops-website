# modern-bizops-website — Claude Code conventions

Next.js on Vercel. **Merging a PR to `main` is the production deploy.** There is no separate
release step, so a merge goes straight to the site founders land on.

## Skills

- `ship-to-production` — the full deploy loop, and the reference for this repo's local-preview,
  worktree and Vercel gotchas. Use it for any "ship it", "push live", "merge this" request.
- `publish-learn-page` — publishing a `/learn` page.
- `seo-content-strategy` — page and keyword strategy.
- `verify-lead-capture` — confirming a form or CTA still writes through to HubSpot.
- `update-nurture-emails`. Changing the automated nurture sequence (Emails 2-6). The copy is
  hardcoded inside `apps-script/nurture-sender/Code.gs`, so a copy approval is a code change and
  no page test or site grep can see it.
- `verify-email-deliverability`. SPF, DKIM and DMARC for a sending domain. Run it before
  switching on any automated sending; unauthenticated mail fails silently into spam.
- `regenerate-og-cards`. Changing the words, logo or artwork on the OG share cards. Their
  text is baked into PNG pixels, so no grep here can see it and no page test can catch it.
- `update-legal-doc`. Any change to /privacy, /terms, /dpa or /security, which are version
  coupled to a clickwrap registry in the app repo.

## Work that ships must report back (added 2026-07-28)

This repo is invisible to the Modern BizOps operating board at
`~/Documents/Claude/Projects/Modern BizOps/state/board.db`. That board is where Bradley decides
what to work on, and it has been wrong because of it. On 2026-07-28 it carried "26 /learn pages"
when the live sitemap had 24, and it had no record of a ten-page pSEO batch that shipped from here
days earlier.

**Rule.** Anything that merges to `main` gets a receipt in
`~/Documents/Claude/Projects/Modern BizOps/state/inbox/`. Use `_TEMPLATE.md` there; the contract is
in the `README.md` beside it. `ship-to-production` step 9 does this for you.

**Never edit `board.db` or the board artifact from this repo.** One writer owns the board:
`board.py` in the Modern BizOps folder, session-triggered since 2026-08-13, with Bradley
approving in session. Drop evidence, not edits.

**A receipt is a lead, not a proof.** Always fill the `verify:` line with a URL, command or query
that lets a later session confirm the claim without trusting the receipt.

**If you changed the page inventory, say so and give the new total.** Page counts on the board have
gone stale twice. The cheapest verify line there is:

```bash
curl -s https://modernbizops.com/sitemap.xml | grep -c '<loc>'
```

## Where plans live (added 2026-07-30)

| File | Holds | Never holds |
|---|---|---|
| [ROADMAP.md](ROADMAP.md) | The forward plan for **this repo**: what is next, the backlog | Anything already shipped |
| `Modern BizOps/state/board.db` | Business priorities, which loop, what is worth doing | Engineering detail |
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

**A page's real title is the registry entry plus whatever title template applies, and only one of
those is ever written down.** `app/layout.js` sets a `%s | Modern BizOps` template, so every page
that does not opt out renders 16 characters longer than its source string. That suffix appears in
none of the drafting files under `Marketing Systems/SEO Pilot/published/`, which is why three
/learn titles sat past Google's roughly 60-character truncation for three weeks without anyone
seeing it. **Check a title tag by fetching the live page, never by reading the source string.**
`/learn/[slug]` now opts out with `title: { absolute: ... }`; the rest of the site keeps the
template deliberately, because the homepage is where the brand suffix might pay.

**Internal links never carry UTM parameters, and internal CTAs get ZERO registry rows.** They
ship as plain links tracked with the `cta_click` event plus page path. The full rule and why it
exists: `UTM/UTM Taxonomy Standard.md` §2 in the Modern BizOps folder; do not re-derive it here.
A CI test enforces the no-UTM half (PR #53); do not work around it.
