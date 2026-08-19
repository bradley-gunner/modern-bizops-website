---
name: seo-content-strategy
description: >-
  Use when building or planning a modernbizops.com content page meant to rank or
  attract links (a pillar page, a spoke, a resource, a blog post), when choosing
  its URL slug, hero headline, or information architecture, when doing keyword
  research for the site, or when deciding whether to stand up a blog or resources
  section. Covers keyword research, topic clusters, SEO copy, and on-brand hero
  visuals for this site.
---

# SEO content strategy for modernbizops.com

## Overview

This site's content is a keyword-research-driven, pillar-first topic cluster for
B2B companies with a real sales motion, $1M to $50M revenue (the bounding
document is `Coaching Service/ICP/Ideal Customer Profile v2.md` in the Modern
BizOps folder; "founder-led" and "owner-led" are retired as ICP vocabulary). The
domain has low organic authority, so the guiding rule is **concentrate, do not
spread**: one strong cornerstone at a time, spokes grow under it.

**Nouns are not chosen here.** Every noun a page leads with comes from
`Business Design/AI Pivot 2026/08 Messaging Architecture.md` §3 in the Modern
BizOps folder (banned and fenced nouns, the validated category terms and their
volumes). Read it before writing a headline or slug; do not work from memory of
it.

## When to use

- Building or planning a new content/resource page, spoke, or blog post
- Choosing a URL slug, hero headline, or page information architecture
- Doing keyword research to inform any of the above
- Deciding whether to stand up a blog or resources hub

Not for pure funnel pages (`/watch`, `/book`, `/scorecard` flow). Those are
conversion surfaces, not SEO content.

## The method (order matters)

1. **Research before deciding.** Pull first-party demand from Google Search
   Console (what the domain already surfaces for) and read the live SERP for each
   candidate term (who ranks, how beatable). Paid tools (Ahrefs/SEMrush) need an
   interactive OAuth login; GSC plus SERP analysis is usually enough to decide.
2. **Classify each term** by persona fit and competition (see Rules).
3. **Pillar first, spokes under /learn.** The cornerstone exists
   (`/predictable-revenue-engine`) and the spoke home exists (`/learn/[slug]`,
   live since July 2026). New spoke content goes into /learn via the
   publish-learn-page recipe; do not invent a new structure or stand up a
   separate blog.
4. **Then build and ship** (variant-ready hero, on-brand visuals). REQUIRED to
   ship: use ship-to-production.

## Rules that keep resurfacing

- **The search-ladder law: buyers search the category noun, never their
  problem.** Four independent tracks failed identically (the emotional/burnout
  track, raw founder-pain phrases, the ops-hiring trigger stage, the
  pre-category AI phrasings). People search "ai automation agency" (4,400/mo),
  the ai consultant cluster (8,100/mo), "ai readiness assessment" (720/mo), not
  a description of their pain. Content is what gives a buyer the category word;
  search surfaces lead with the validated category noun. The current validated
  terms and their volumes live in doc 08 §3, not here.
- **Read vs search surfaces.** Read surfaces (LinkedIn, email, the About page)
  lead with the transformation; search surfaces (titles, slugs, H1s on pages
  meant to rank) lead with the validated category noun. They never contradict:
  the noun is the mechanism, the transformation is the outcome. Consistency
  means the same audience, transformation, mechanism and proof, not the same
  string of words.
- **Pillar vs spoke jobs.** A pillar earns credibility, branded search, internal
  linking, and conversion; its cold-traffic SEO is modest. The winnable
  long-tail lives on spokes. Both live now: the pillar-cluster structure is
  `/predictable-revenue-engine` (model overview, conversion intent) over
  `/learn` stage hubs and competency pages (informational intent), connected by
  breadcrumbs, DefinedTermSet/DefinedTerm schema, and the pillar's competency
  cards linking to live competency pages.
- **Hero built variant-ready.** Hooks live in a config array with variant-tagged
  GA4/Clarity events. Test the message upstream (LinkedIn organic, optional small
  paid) before any on-site A/B, which cannot reach significance at current
  traffic. Slugs are 301-changeable, so do not block on them.
- **Visuals.** Give content pages a NAVY hero (funnel pages are cream) so
  navigating to one is obviously a new page. Prefer bespoke SVG (motifs,
  diagrams, category icons) over stock photos: on-brand, CSP-safe, no licensing.
  Never a busy background behind text.

<!-- TODO: channel strategy: point at Content Marketing Strategy.md when it
lands (in progress 2026-08-19). -->

## Reference implementations

- **Pillar:** `/predictable-revenue-engine` (the GTM Maturity Framework;
  instrument doc: `Coaching Service/App/Modern BizOps GTM Maturity Framework.md`
  v1.1 in the Modern BizOps folder). Data in `lib/maturity/`, components in
  `components/maturity/`, spec and plan in `docs/superpowers/`. The page's
  metadata title deliberately retains the older "Revenue Operations" term
  because it ranks on it; that is a tracked SEO retention, not an oversight.
- **Spokes:** the `/learn/[slug]` hub. Registry in `lib/learn/registry.js`,
  shell in `components/learn/`, schema builders in `lib/learn/schema.js`.
  REQUIRED to publish a new spoke: publish-learn-page.

## Related

Nouns and banned terms: doc 08 §3 (above). Audience: ICP v2 (above). REQUIRED
voice skill: write-like-bradley. Screen copy with modern-bizops-copy-audit.
No em dashes anywhere.
