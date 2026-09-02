# modern-bizops-website — Roadmap

> **What this file is.** The forward-looking engineering plan for the marketing
> site, and nothing else.
>
> | Concern | Lives in |
> |---|---|
> | What this repo will build next | **this file** |
> | Business priorities, which client, which loop, what is worth doing | `~/Documents/Claude/Projects/Modern BizOps/state/board.yaml` |
> | Forward plan for the client-facing app | `~/RevOps Coaching App/ROADMAP.md` |
> | What that app has shipped | `~/RevOps Coaching App/docs/shipped-log.md` |
>
> A board item concerning this repo carries a `roadmap:` reference naming a
> heading here; an entry here carries its board item id where one exists. The
> board says *whether and when*, this file says *what and how*. On priority the
> board wins; on technical scope this file wins.
>
> **This repo never writes `board.yaml`.** Shipped work drops a receipt in
> `state/inbox/`, per [CLAUDE.md](CLAUDE.md) and `ship-to-production` step 9.
>
> Created 2026-07-30. The inbox contract had referred to a site `ROADMAP.md`
> since 2026-07-28; it did not exist until now.

**Keep this file small.** The app repo's roadmap reached 560 KB by accumulating
per-PR history until nobody opened it, and four PRs then shipped with no
close-out at all. Shipped detail belongs in the receipt and the git log, not here.

---

## Status at a Glance

**Last updated:** 2026-09-02. **Last shipped:** 2026-09-02 ([#95](https://github.com/bradley-gunner/modern-bizops-website/pull/95), AEO batch 2, the pricing cluster: four `/learn` pages, each with hero, stat cards and a comparison block, plus ten cross-links on seven existing pages; [#94](https://github.com/bradley-gunner/modern-bizops-website/pull/94) homepage amber band and video placement).

- **Live inventory:** 44 URLs in the sitemap, **31 of them `/learn` pages**. Verified against the live sitemap on 2026-09-02 after the #95 deploy. This file does not track the page list; the sitemap and GSC do. See "Where page counts come from" below.
- **In flight:** nothing.
- **Owed on #95:** the four link-free LinkedIn promo posts (board item `seo-batch2-publish-through-promotion`; GSC and Bing indexing are done). New reusable block `components/learn/ComparisonTable.jsx` for any future side-by-side.
- **Next:** the October Observe pass reads the batch 2 GSC and Bing rows into next-batch sequencing. The agency income/market-size long-tail stays excluded (maker and job-seeker intent).
- **PR #10: closed 2026-08-02** by Bradley as obsolete (see below).

---

## Now

### Fix titles and metas on the ranking /learn pages

Board: `learn-pages-ctr` — **killed on the board**; section kept as written pending the roadmap refresh.

Rewrite title and meta for `stage-1-reactive`, `what-is-revops`,
`pipeline-stage-design` and `ideal-customer-profile`. Done when all four have
rewritten snippets and CTR has been re-checked in GSC two weeks later.

These four already rank, so the impressions exist and the click-through is the
gap. That makes this the cheapest available lead work on the site.

### Improve rank on the four high-impression pages

Board: `learn-pages-rank` (next up, `leads` loop).

Run `seo-page-reconcile` on `marketing-and-sales-alignment`, `ai-consulting`,
`win-loss` and `conversion-rate-optimization`. They carry 262, 130, 138 and 43
impressions at positions 68, 85, 55 and 78. Done when all four move inside
position 30.

The diagnosis is already made: **volume exists, competitiveness does not.** These
pages are being served for queries people actually run and are losing on merit.

### Two pages have never returned an impression

`revenue-lifecycle-design` and `customer-retention-strategy` are in the sitemap
and indexed, and have produced **zero** impressions since publication. That is a
different failure from ranking badly — a page at position 85 is at least being
served. Treat it as a distinct diagnosis (indexing, targeting or demand), not as
a worse version of the rank problem.

Recorded on the board inside the `learn-pages-ctr` and `seo-bookkeeping` notes,
which is how it nearly stayed invisible.

---

## Next

### The lead magnet lives here now, and only here

**This is the most important cross-repo fact on this roadmap.**

The app repo deleted its entire lead-scorecard funnel in Sprint 36 PR B — engine,
routes, HubSpot sync, public pages, admin page and the `LeadScorecardResult`
table — explicitly because the lead magnet was moving to this site. On 2026-07-27
the app also 301'd `app.modernbizops.com/scorecard` to
`https://modernbizops.com/scorecard`, because the stale URL was still indexed on
the app subdomain and competing with the live funnel.

So `/scorecard` here is now the **only** scorecard. There is no fallback in the
app and no second copy. Leads persist in HubSpot regardless, so nothing was lost
in the move, but anything that breaks this funnel breaks lead capture outright.

Nothing is currently queued against it. It is written down because the ownership
transfer happened across two repos over six weeks and appeared in neither one's
plan.

### Site PR #10 — closed 2026-08-02 as obsolete

**Resolved.** Bradley closed it on 2026-08-02 with a closing comment on the PR;
the companion `docs/handoff/scorecard-handoff.md` was deleted in the 2026-08-19
repo-cleanup PR (#85). The record below stands as written.

[PR #10](https://github.com/bradley-gunner/modern-bizops-website/pull/10),
`docs(scorecard): v1.2 handoff`, opened **2026-06-11**, +181 lines, untouched
since. Currently reports `MERGEABLE`, though it reported `UNKNOWN` in late July,
so treat the mergeability as incidental.

**It is very likely obsolete.** It is a handoff document for a scorecard version
that was superseded twice over: v1.1 shipped on 2026-06-11, the scorecard then
became an on-site quiz, and the app-side `/portal/scorecard` was 301'd away
entirely. The repo has merged through #55 in the meantime.

**Probably a close rather than a merge — but that is a judgment about Bradley's
own work, so it stays here rather than being actioned.** It was tracked by no
board item and no memory file for seven weeks, and is the single best argument
for the `open_prs` check now in `verify_system.py`.

### Populate the Daily Content Process learning log

Board: `content-learning-log` (next up, `leads` loop). Backfill from the last
three Sunday reviews. Done when the log has entries and the idea menus cite it.

Content-process work rather than site code, listed here because it gates the
quality of everything in "Now".

---

## Backlog

*Trigger-driven. Pull one forward when its trigger fires, not because the list
is long.*

- **Where page counts come from.** Board item `seo-bookkeeping` says "CLAUDE.md
  records all 24 /learn pages", and the slimmed Modern BizOps CLAUDE.md now says
  in terms that live page counts come from the sitemap and GSC and **never** from
  that file. Satisfying the item as written would regrow the file that was just
  cut. **This is flagged for Bradley on the board and needs one sentence from
  him**, not a session: either a small live-pages record beside the board, or
  fold it into `learn-pages-rank`. Until then, the authoritative count is
  `curl -s https://www.modernbizops.com/sitemap.xml | grep -c '<loc>'`.
- **`Audit Engine` → `Revenue Intelligence Platform`.** A cross-repo rename open
  since 2026-06-12. The app repo renamed its login card and this site was named
  as part of the same coordinated PR that never happened. Audit this site for the
  old name before the app finishes its half, so the two land together.
- **Verify the `/book` confirmation email carries the `/prep` link.** Board item
  `hubspot-prep-link-verify`, open since **2026-05-06** and tracked nowhere until
  it was recovered on 2026-07-28 from a CLAUDE.md section that was about to be
  archived. Nobody has confirmed that a booking through the public `/book` path
  fires the `/prep` questionnaire link, so the 20 HubSpot prep properties sit
  empty and the gap repeats for every prospect. Mostly a HubSpot Meetings
  template check plus one test booking. **Note:** the app's outbound email is
  currently down (SendGrid credits), which does not affect HubSpot Meetings
  sending but is worth knowing before diagnosing a missing email.
- **Stories bank specifics.** Board item `stories-bank-capture`. Bradley
  confirmed on 2026-07-14 that he built and scaled sales, marketing and customer
  success teams, but which company, which teams and what moved from what to what
  were never written down, so no page here can cite the strongest proof the
  business has. Needs a conversation, not a session.
- **Never-indexed page diagnosis** — see "Now". Promote to Now once the CTR work
  lands and there is a clean GSC read to compare against.

---

## When a PR ships

1. Drop the receipt in `~/Documents/Claude/Projects/Modern BizOps/state/inbox/`.
   `ship-to-production` step 9 does this. It is the only step whose output leaves
   this repo.
2. Update "Status at a Glance" here — **rewrite it, do not append to it.**
3. Move or delete anything in "Now" that the PR finished. This file holds the
   future only; the receipt and the git log hold the past.
4. If you changed the page inventory, put the new sitemap count in the receipt's
   `verify:` line. Page counts on the board have gone stale twice.
