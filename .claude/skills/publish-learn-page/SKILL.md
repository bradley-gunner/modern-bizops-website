---
name: publish-learn-page
description: >-
  End-to-end recipe for publishing an approved SEO/AEO content page to the
  /learn/[slug] hub on modernbizops.com: transcribe the staged markdown spec
  verbatim into the registry-driven architecture, wire schema and OG images,
  update the sitemap, ship, and run the post-publish loop (GSC, UTM registry,
  live snippet-length check, board receipt). Use whenever a batch of approved
  /learn pages needs publishing, when upgrading a "forthcoming" competency
  mention to a live link, or when someone says "publish the next batch" for the
  SEO pilot.
---

# Publish an approved /learn page

The SEO/AEO pilot publishes long-form pages under `/learn/[slug]`. Content is
drafted and approved elsewhere; this repo implements it. (That drafting used to
happen in Cowork sessions. Cowork stopped being used in August 2026, so specs
now come from code sessions and land in the same folder.) The
architecture is registry-driven, so each new page is four code touchpoints plus
assets. Batch 1 (July 2026, PR #33) is the reference implementation.

## Source files

Approved specs live at
`~/Documents/Claude/Projects/Modern BizOps/Marketing Systems/SEO Pilot/`
(check `pending-approval/` for staged batches and `published/` for shipped ones,
which is where a batch moves on publish). Each file:

- Everything ABOVE the first `---` is draft-note commentary for Bradley.
  Ignore it for page content, but READ it: it often contains judgment calls
  and flags worth surfacing.
- Everything from `**Title tag:**` down is the page spec: title tag, meta
  description, URL slug, page type, schema recommendation, last-updated date,
  OG image location, `# H1`, byline, body copy, `## FAQ`, `**CTA:**` +
  `**CTA URL:**`, and an `**Internal links summary**`.

## Hard rules (each one has burned someone)

1. **Copy is verbatim.** No rewriting, shortening, or cleanup. If something
   looks like a typo, flag it to Bradley; never silently fix. Straight
   apostrophes in JSX need `&rsquo;`/`&ldquo;`/`&rdquo;` (eslint
   react/no-unescaped-entities) but that is escaping, not editing.
2. **Forthcoming pages never get links.** Competency pages referenced with a
   proposed slug but no live page render as plain text (usually `<strong>` +
   an italic "(page forthcoming)" note per the source). This applies to
   SCHEMA too: `DefinedTermSet.hasDefinedTerm` lists only live URLs.
3. **Never UTM-tag an internal link, and internal CTAs get zero registry
   rows.** CTA destinations ship as plain root-relative links (`/scorecard`),
   no query string, even if the spec writes them with UTM params (strip them
   and flag it back). Full rule and rationale:
   `UTM/UTM Taxonomy Standard.md` §2 in the Modern BizOps folder (this burned
   batch 1, fixed in PR #36). Per-page CTA attribution comes from the
   `cta_click` event: the shell passes `ctaLocation="learn_mid_page"` to
   Button, and root-relative hrefs hit Button's CTA_DESTINATIONS lookup
   automatically.
4. **Outbound citations** (already markdown links in the body) become
   `<a target="_blank" rel="noopener noreferrer">`.
5. **Slug mismatch gotcha:** competency-data slugs in
   `lib/maturity/competencies/` do not always match URL slugs. Example: data
   slug `crm-architecture-governance`, URL `/learn/crm-architecture-and-governance`.
   Never assume; check both.
6. No em dashes anywhere.
7. **A spec's title tag is not the rendered title, and transcribing it verbatim
   is not enough.** `app/layout.js` sets a `%s | Modern BizOps` template. Pages
   under `/learn/[slug]` opt out of it (`title: { absolute: entry.title }`, PR
   #58), so a /learn title renders exactly as the registry holds it, but the
   rest of the site does NOT, and **the suffix appears in none of the drafting
   files under `Marketing Systems/SEO Pilot/published/`.** It never did. From
   July 9 to August 4 2026 three /learn titles sat past Google's roughly
   60-character truncation while every review of them read a string 16
   characters shorter than what Google saw. `stage-1-reactive` was displaying as
   about "Stage 1: Reactive Revenue Operations, and How to Get..." and losing
   its entire hook.
   So: **keep the title at or under 60 characters and the meta between 120 and
   158, count them, and if the spec's title busts the bound flag it to Bradley
   rather than publishing it long or trimming it yourself.** Rule 1 still holds,
   the copy is his. A length problem is a question for him, not a licence to
   edit. **Check the number against the rendered page, never the source
   string** (there is a post-publish command for this below).

## The four code touchpoints

1. **Registry entry** in `lib/learn/registry.js`: slug, pageType
   (`hub`/`competency`), title, metaDescription, url, ogImage, lastUpdated,
   h1 (the `# ` heading, which can differ from the title tag), byline, the
   breadcrumb array (per the spec's schema recommendation line), faq array
   (verbatim q/a), ctaText, ctaButtonLabel (short imperative, this is UI
   chrome you write, not spec copy), ctaUrl, and `definedTermSet` (hubs) or
   `definedTerm` with `inDefinedTermSetUrl` (competency pages).
2. **Body component** in `components/learn/content/<Name>Body.jsx`: verbatim
   JSX transcription. H2s use
   `font-display font-semibold text-navy text-2xl mt-10 mb-3`; paragraphs
   inherit from the shell's `<article>`. Level 1-5 progressions render as
   `<p><strong>Level N:</strong> ...</p>` blocks, not lists.
3. **BODIES map** in `app/learn/[slug]/page.js`: add the slug -> component
   entry. Everything else (metadata, schema injection, static params) is
   driven by the registry. Note: `params` is a Promise in this Next version;
   the route already awaits it.
4. **Sitemap** in `app/sitemap.js`: add a `LAST_MODIFIED` key and a URL entry
   at `priority: 0.7`, `changeFrequency: "monthly"` (cluster pages sit below
   the 0.8 pillars).

Plus assets: copy the staged OG PNG into `public/og/` (chmod 644) and point
the registry `ogImage` at its absolute URL.

## When a formerly forthcoming page ships

Three upgrades in the same PR, not just the new page:

- Hub body: plain-text mention becomes a `<Link>`.
- Hub registry: add the URL to `definedTermSet.hasDefinedTerm`.
- If it is one of the 44 competencies: add `learnMoreUrl` to its object in
  `lib/maturity/competencies/` so the pillar's "See how I score it" card
  links out (CompetencyCard renders a Link instead of the toggle when
  `learnMoreUrl` is set), and extend the learnMoreUrl test in
  `__tests__/maturity/competencies.test.js`.

## Verify before shipping

Tests exist at `__tests__/learn/` (registry shape, schema builders); extend
them for new slugs. Then `npx vitest run`, `npx eslint` on touched files, and
`npx next build` (catches static-generation errors dev mode hides). Browser
verification per ship-to-production's worktree gotcha (run `next dev` from
the worktree on an alt port): check body, FAQ accordion, breadcrumb links,
JSON-LD parses with the right `@type`s, outbound links have target=_blank,
OG image returns 200, forthcoming mentions have no href.

## Ship and post-publish loop

REQUIRED SUB-SKILL: ship-to-production (PR, squash-merge, Vercel READY,
live verify). Then:

1. **GSC** (see ship-to-production's GSC section for the MCP no-op warning):
   sitemap should already be registered; Request Indexing each new URL via
   the GSC UI in Chrome.
2. **UTM registry**: no action for /learn CTAs. Internal links carry no UTMs
   and get no registry row (rule 3 above; the old website_modernbizops rows
   were retired July 2026). Only touch
   `~/Documents/Claude/Projects/Modern BizOps/UTM/UTM Campaign Registry - Content.csv`
   if the batch also ships a genuinely external placement.
3. **OG spot-check**: one URL through opengraph.xyz (decline cookies).
4. **Snippet length, read from the live pages.** Per rule 7, the source strings
   cannot tell you this. Run it for every slug in the batch and expect each
   title at or under 60 and each meta between 120 and 158:

   ```bash
   python3 -c "
   import urllib.request as u, re
   SLUGS = ['your-slug-here']
   for s in SLUGS:
       h = u.urlopen(u.Request('https://modernbizops.com/learn/'+s, headers={'User-Agent':'Mozilla/5.0'}), timeout=25).read().decode('utf-8','replace')
       t = re.search(r'<title[^>]*>(.*?)</title>', h, re.S).group(1).strip()
       d = re.search(r'<meta name=\"description\" content=\"(.*?)\"', h, re.S).group(1)
       print(len(t), len(d), s)"
   ```

5. **Board receipt.** `~/Documents/Claude/TASKS.md` is GONE and the global rules
   say never to create one; Cowork stopped being a reader in August 2026. A
   published batch reports back through `state/inbox/` instead, per
   ship-to-production step 9 and the contract in that folder's `README.md`.
   **A page batch always changes the page inventory, so the receipt must say so
   and give the new total**, which is the field the board has had wrong twice:
   `curl -s https://modernbizops.com/sitemap.xml | grep -c '<loc>'`
