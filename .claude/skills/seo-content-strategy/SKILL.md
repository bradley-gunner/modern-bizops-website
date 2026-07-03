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
founder-led B2B companies ($3M to $50M). The domain has low organic authority, so
the guiding rule is **concentrate, do not spread**: one strong cornerstone at a
time, spokes grow under it.

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
3. **Pillar first.** Build ONE cornerstone and let spokes grow beneath it. Do not
   stand up a thin blog on a low-authority domain.
4. **Then build and ship** (variant-ready hero, on-brand visuals). REQUIRED to
   ship: use ship-to-production.

## Rules that keep resurfacing

- **Buyer language, not category language.** Founders do NOT search "revenue
  operations." Lead headlines and target spokes with founder problem-language:
  "grow revenue without adding headcount" (rational, already has SEO equity,
  protect it), "make my business run without you" (emotional, in test),
  "predictable sales pipeline." "Revenue Operations" and "Revenue Operations
  Maturity Model" are a brand/framework NAME for branded search and credibility,
  NOT an acquisition keyword. Do not chase the head term for traffic: wrong
  persona, unwinnable for a new domain.
- **Pillar vs spoke jobs.** A pillar earns credibility, branded search, internal
  linking, and conversion to the scorecard; its cold-traffic SEO is modest. The
  winnable long-tail lives on spokes.
- **Hero built variant-ready.** Hooks live in a config array with variant-tagged
  GA4/Clarity events. Test the message upstream (LinkedIn organic, optional small
  paid) before any on-site A/B, which cannot reach significance at current
  traffic. Slugs are 301-changeable, so do not block on them.
- **Visuals.** Give content pages a NAVY hero (funnel pages are cream) so
  navigating to one is obviously a new page. Prefer bespoke SVG (motifs,
  diagrams, category icons) over stock photos: on-brand, CSP-safe, no licensing.
  Never a busy background behind text.

## Reference implementation

`/predictable-revenue-engine` (the Revenue Operations Maturity Model pillar). Data
in `lib/maturity/`, components in `components/maturity/`, spec and plan in
`docs/superpowers/`. Mirror its shape for the next content page.

## Related

Check the `positioning` and `product-naming` project memories before writing copy
(locked audience, the two message tracks, canonical names). REQUIRED voice skill:
write-like-bradley. Screen copy with modern-bizops-copy-audit. Full strategy
rationale: project memory `content_seo_strategy.md`. No em dashes anywhere.
