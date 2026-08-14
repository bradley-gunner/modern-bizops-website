/**
 * buildResult(answers, { observed }) is the orchestrator. Composes the
 * readiness band, the why-it-did-not-stick block, the belief contrast, the
 * observed findings, the dimension bars, the menu-shaped opportunity map,
 * the first move, and the CTA block into the Result payload consumed by the
 * on-screen render, the PDF, and the HubSpot persistence.
 *
 * Section order is doc 15 Part 5, verbatim. Pure function. No I/O: the
 * observed payload is fetched by the caller (the submit route) and passed in.
 */

import { getBusinessModelBenchmark, BUSINESS_MODEL_BENCHMARK_VERSION } from './businessModelBenchmarks';
import { buildOpportunityMap } from './roi';
import {
  compositeScore,
  readinessBand,
  dimensionScores,
  weakestDimension,
  weakestSignals,
  isBurnedAttempt,
} from './scoring';
import { getQuestionsFor } from './questions';
import {
  BAND_DESCRIPTORS,
  BAND_EYEBROW,
  COMPUTED_DIMENSIONS,
  COMPUTED_DIMENSIONS_INTRO,
  CTA_HEADING,
  CTA_LINES,
  DISCLOSURE,
  FIRST_MOVES,
  FOUNDING_LINE,
  FOUNDING_LINK_LABEL,
  LEVEL_WORDS,
  NO_GAP_HEADLINE,
  OBSERVED_BOUNDARY,
  OBSERVED_LINES,
  OBSERVED_MARKER,
  OBSERVED_UNREACHABLE,
  OPPORTUNITY_INTRO,
  RESULT_HEADINGS,
  SELF_REPORTED_MARKER,
  bandMarker,
  beliefContrast,
  dimensionRead,
  formatScore,
  pickFirstMoveKey,
  whyItDidNotStick,
} from './voice';
import { LADDER } from '../offers';

// The paid next rung. Destination comes from the ladder so the Scan can never
// point somewhere the rest of the site has moved away from. The route is also a
// key in the Button CTA_DESTINATIONS map, so a click here is tracked.
const AUDIT = LADDER.find((rung) => rung.id === 'audit');

function pruneAnswers(answers) {
  const visible = new Set(getQuestionsFor(answers).map((q) => q.id));
  const out = {};
  for (const id of Object.keys(answers)) {
    if (visible.has(id)) out[id] = answers[id];
  }
  return out;
}

function joinAnd(items) {
  if (items.length <= 1) return items[0] || '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
}

/**
 * Turns the raw observed payload into the display block: one authored line
 * per signal that could actually be read, each tagged good/gap/info for the
 * flag color, plus the marker and the honest boundary. Null when no URL was
 * given; { unreachable } when the site defeated the read.
 */
function buildObservedFindings(observed, generatedAt) {
  if (!observed) return null;
  const base = {
    heading: RESULT_HEADINGS.observed,
    marker: OBSERVED_MARKER,
    host: observed.host,
  };
  if (observed.status === 'unreachable') {
    return { ...base, unreachable: true, text: OBSERVED_UNREACHABLE, lines: [] };
  }

  const lines = [];
  if (observed.analytics?.checked) {
    const names = [observed.analytics.ga4 && 'GA4', observed.analytics.gtm && 'Google Tag Manager'].filter(Boolean);
    lines.push(
      names.length > 0
        ? { key: 'analytics', tone: 'good', text: OBSERVED_LINES.analyticsPresent(joinAnd(names)) }
        : { key: 'analytics', tone: 'gap', text: OBSERVED_LINES.analyticsAbsent }
    );
  }
  if (observed.emailAuth?.checked) {
    lines.push(
      observed.emailAuth.spf && observed.emailAuth.dmarc
        ? { key: 'emailAuth', tone: 'good', text: OBSERVED_LINES.emailAuthOk(observed.emailAuth.dkim === true) }
        : { key: 'emailAuth', tone: 'gap', text: OBSERVED_LINES.emailAuthMissing(observed.emailAuth.missing.join(', ')) }
    );
  }
  if (observed.adPixels?.checked) {
    if (observed.adPixels.names.length > 0) {
      lines.push({ key: 'adPixels', tone: 'info', text: OBSERVED_LINES.adPixelsPresent(joinAnd(observed.adPixels.names)) });
    } else if (!observed.analytics?.gtm) {
      // A tag manager can inject pixels the raw source does not show; only
      // claim the absence when there is no tag manager to hide behind.
      lines.push({ key: 'adPixels', tone: 'gap', text: OBSERVED_LINES.adPixelsAbsent });
    }
  }
  if (observed.schema?.checked) {
    lines.push(
      observed.schema.types.length > 0
        ? { key: 'schema', tone: 'good', text: OBSERVED_LINES.schemaPresent(observed.schema.types.slice(0, 4).join(', ')) }
        : { key: 'schema', tone: 'gap', text: OBSERVED_LINES.schemaAbsent }
    );
  }
  if (observed.freshness?.checked && observed.freshness.lastPublished) {
    const ageMs = new Date(generatedAt) - new Date(observed.freshness.lastPublished);
    const monthsAgo = Math.max(0, Math.round(ageMs / (30 * 86_400_000)));
    lines.push(
      monthsAgo >= 3
        ? { key: 'freshness', tone: 'gap', text: OBSERVED_LINES.freshnessStale(observed.freshness.lastPublished, monthsAgo) }
        : { key: 'freshness', tone: 'good', text: OBSERVED_LINES.freshnessRecent(observed.freshness.lastPublished) }
    );
  }
  if (observed.social?.checked && observed.social.platforms.length > 0) {
    lines.push({ key: 'social', tone: 'info', text: OBSERVED_LINES.socialPresence(joinAnd(observed.social.platforms)) });
  }

  if (lines.length === 0) {
    return { ...base, unreachable: true, text: OBSERVED_UNREACHABLE, lines: [] };
  }
  return { ...base, unreachable: false, boundary: OBSERVED_BOUNDARY, lines };
}

function buildDimensions(answers) {
  return dimensionScores(answers).map((d) => ({
    ...d,
    // `mean` stays a number for HubSpot and the export; `meanDisplay` is what
    // renders, always to one decimal so a whole number cannot print as "2"
    // beside its neighbours' "1.7".
    meanDisplay: formatScore(d.mean),
    levelWord: LEVEL_WORDS[d.level],
    read: dimensionRead(d.key, d.level),
  }));
}

function buildFirstMove(answers) {
  const weakest = weakestDimension(answers);
  if (!weakest) return null;
  const lowest = weakest.ids
    .map((id) => ({ id, score: answers[id]?.score ?? 0 }))
    .sort((a, b) => a.score - b.score)[0];
  const key = pickFirstMoveKey(weakest.key, lowest?.id);
  return {
    heading: RESULT_HEADINGS.firstMove,
    dimensionKey: weakest.key,
    dimensionLabel: weakest.label,
    key,
    text: FIRST_MOVES[key],
  };
}

export function buildResult(rawAnswers, { generatedAt = new Date().toISOString(), observed = null } = {}) {
  const answers = pruneAnswers(rawAnswers);
  const benchmark = getBusinessModelBenchmark(answers.q2?.value);

  const composite = compositeScore(answers);
  const band = readinessBand(composite);
  const burned = isBurnedAttempt(answers);

  const opportunity = buildOpportunityMap(answers, benchmark, observed);
  const beliefScore = answers.q4?.score ?? null;

  return {
    band: {
      key: band.key,
      name: band.name,
      composite,
      eyebrow: BAND_EYEBROW,
      marker: bandMarker(composite),
      descriptor: BAND_DESCRIPTORS[band.key],
    },
    burnedAttempt: burned,
    whyItDidNotStick: burned
      ? { heading: RESULT_HEADINGS.whyStick, text: whyItDidNotStick(weakestSignals(answers)) }
      : null,
    belief: beliefScore
      ? { heading: RESULT_HEADINGS.belief, score: beliefScore, text: beliefContrast(beliefScore) }
      : null,
    observed,
    observedFindings: buildObservedFindings(observed, generatedAt),
    dimensions: {
      heading: RESULT_HEADINGS.dimensions,
      marker: SELF_REPORTED_MARKER,
      items: buildDimensions(answers),
    },
    opportunity: {
      heading: RESULT_HEADINGS.opportunity,
      intro: OPPORTUNITY_INTRO,
      comparisonsHeading: RESULT_HEADINGS.comparisons,
      noGap: opportunity.hasDollarGap
        ? null
        : {
            lead: NO_GAP_HEADLINE.lead.replaceAll('{model_label}', benchmark.label),
            subline: NO_GAP_HEADLINE.subline,
          },
      ...opportunity,
    },
    firstMove: buildFirstMove(answers),
    computedDimensions: {
      heading: RESULT_HEADINGS.computed,
      intro: COMPUTED_DIMENSIONS_INTRO,
      items: COMPUTED_DIMENSIONS,
    },
    disclosure: DISCLOSURE,
    cta: {
      destination: AUDIT.href,
      heading: CTA_HEADING,
      cardLines: CTA_LINES,
      buttonLabel: `See the ${AUDIT.name}`,
      foundingLine: FOUNDING_LINE,
      foundingHref: '/founding-clients',
      foundingLinkLabel: FOUNDING_LINK_LABEL,
    },
    modelLabel: benchmark.label,
    benchmarkVersion: BUSINESS_MODEL_BENCHMARK_VERSION,
    generatedAt,
  };
}
