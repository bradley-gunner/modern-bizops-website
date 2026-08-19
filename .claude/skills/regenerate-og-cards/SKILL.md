---
name: regenerate-og-cards
description: Change the words, logo or artwork on the modernbizops.com Open Graph share cards. The text lives in PNG pixels, so no grep in this repo can see it and no page test can catch it, which is how a card kept selling a retired offer for months and another claimed a competency count that had been revised. Use whenever card copy goes stale, a brand asset changes, a page's H1 or dek moves and its card should follow, or someone asks to update a share preview or social image.
---

# Regenerate the share cards on modernbizops.com

38 PNGs in `public/og`, 1200x630, all produced by `scripts/generate-og.mjs`. **The words are
baked into the pixels.** That single fact drives everything below: the copy audit greps
cannot see them, the page tests cannot see them, and the card and the page it fronts can
contradict each other indefinitely with nobody noticing.

The failures this has already produced, all real:

- The shared footer template said "Revenue Growth Coach" for months after that offer was
  retired, so **every card the script had ever produced** carried it, including five made
  hours after the pivot for pages selling an AI automation partnership.
- The scorecard card claimed 51 competencies after the v1.2 inventory revised it to 60.
- The homepage card led with "Grow Your Revenue Without Growing Your Headcount", a pre-pivot
  promise, on the most-shared image on the site.
- One card rendered "REVENUE MATURITY MODEL" months after the framework was renamed, with
  zero occurrences of that name left anywhere in the codebase.

## The loop

### 1. Re-render at HEAD before you change anything

Not optional, and it costs one command:

```bash
node scripts/generate-og.mjs --all && git status --short public/og
```

**Expect zero changed files.** That single step establishes two things at once:

- The renderer is **deterministic**, so byte comparison is a valid detector for everything
  that follows.
- **No card's committed pixels have drifted from its source.** If a card's text in the
  script had been edited without regenerating, a later sweep would silently rewrite that
  card's copy along with whatever you meant to change, and nobody would see it, because the
  words are in pixels.

A non-empty diff here is the finding. Stop and work out which card drifted and why before
changing anything.

### 2. Edit the copy in `CARDS`

Each entry is `{ changed: bool, element: () => <template>({...}) }`. Templates:

| Template | Used by | Logo position |
|---|---|---|
| `heroCard({headline, subline, headlineSize})` | homepage, offer and BOFU pages | top left, via the shared `Frame` |
| `aboutCard({subline})` | /about | top left, via `Frame` |
| `learnCard({kicker, headline, headlineSize})` | every /learn page | bottom left, drawn inside the template |

Headline column is 660px (hero) or 650px (learn). A 106-character sentence will not set at
64px in that width, so a long page H1 usually has to be split rather than quoted whole:
**what we do in the headline, what you get in the subline.** Take the words from the page.
Do not write new copy for the card unless you are asked to.

Write a comment above the card saying what changed and why. Every entry in that file carries
its history, and that history is the only record of what a card used to say.

### 3. Render, then LOOK at the PNG

```bash
node scripts/generate-og.mjs          # only cards with changed: true
node scripts/generate-og.mjs --all    # every card
```

**Then open the PNG and read it with your eyes.** The Read tool renders it. This is the step
that catches what nothing else can: it is how the retired tagline baked into a card was
finally found, after five task reviews had verified byte sizes, path resolution and presence
in the built HTML and all passed.

Sample across templates, not just the card you edited: one `heroCard`, one `learnCard`, and
`aboutCard` if the frame changed. A change to `Frame`, `Logo`, `Headshot` or `Footer`
touches all 38.

### 4. Reset the `changed` flags

`__tests__/og/card-copy.test.js` asserts no `changed: true` survives in a commit. The
committed state is always all-false, so an unrelated later run cannot rewrite a PNG nobody
meant to touch.

### 5. Run the copy guard

```bash
npx vitest run __tests__/og/card-copy.test.js
```

It reads the generator source, which is the only place the words exist as text, and holds it
to the same copy law the pages obey: no retired vocabulary, no retired product names, no em
dashes, no contractions, footer line identical to `components/Footer.jsx`, and **every card a
live page points at must be buildable by the script**.

It cannot see the rendered artwork. It replaces the possibility of a retired phrase sitting
in the template unnoticed. It does not replace step 3.

### 6. Verify the deployed bytes, not the 200

After the merge deploys, the old PNG keeps serving for a while and 200s the whole time:

```bash
curl -s https://modernbizops.com/og/og-homepage.png | md5
md5 -q public/og/og-homepage.png
```

Equal means that exact artwork is live. Record the hash in the deploy receipt so a later
session can tell a stale card from a fresh one.

## Things that will catch you

**A card can be missing from `CARDS` entirely.** Three were: they predated the table, so
`--all` silently skipped them for months while their pages stayed live in the sitemap. The
count of PNGs in `public/og` and the count of card entries are not the same number unless
someone checks. The test now asserts it with no exemptions, but if you add a page's card by
hand, add its entry too.

**The logo is drawn in two places with different boxes.** `Logo` (the shared frame,
top-left) and `learnCard`'s own bottom-left `img`. Changing the asset means resizing both.
Size from the **artwork**, not the box: the brand PNGs carry very different amounts of
padding, so keeping the box constant shrinks the mark. Current: company lockup
`horizontal-one-color-white-trimmed.png` at 117x42 and 106x38, holding the artwork at the
~39px and ~36px it has always had. See the `logo_system` memory.

**The footer line is a second copy of the site footer's positioning line.** Two copies of one
sentence, and only one of them got updated when the offer changed. The test pins them
together now; do not let them drift again.

**Import must be `next/og.js` with the extension.** Bare `next/og` does not resolve in a
standalone Node ESM script.

**Brand tokens differ from the CSS ones.** OG accent orange is `#D87222`, brighter than the
site `--amber` `#B5520A`. Navy `#0E1F38`, cream `#F6F2EB`. Sample from an existing PNG rather
than guessing.

## When a card's copy is retired vocabulary

Check the page first. A card kicker saying something the page no longer says is usually the
card being stale, not a decision: aligning it with the live page is a correction, not a copy
change. A card saying something **no page says any more** is a decision, and it belongs to
whoever owns the copy. Say which one you think it is and why.
