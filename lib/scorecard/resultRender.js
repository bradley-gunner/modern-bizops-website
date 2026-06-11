/**
 * buildResult(answers) is the orchestrator. Composes ROI lines, stage placement,
 * bright spots, binding-boundary diagnosis, headline, disclosure, and CTA into
 * the Result payload consumed by both the on-screen render and the PDF.
 *
 * Pure function. No I/O.
 */

import { getBusinessModelBenchmark, BUSINESS_MODEL_BENCHMARK_VERSION } from './businessModelBenchmarks';
import { generateRoiLines } from './roi';
import { stagePlacement, brightSpots, bindingBoundary } from './scoring';
import { getQuestionsFor } from './questions';
import {
  STAGE_NAMES,
  STAGE_DESCRIPTORS,
  DISCLOSURE,
  CTA_HEADING,
  CTA_LINES,
  NO_GAP_HEADLINE,
  NO_GAP_BINDING,
  formatUsd,
  sanitizeVoice,
} from './voice';

function pruneAnswers(answers) {
  const visible = new Set(getQuestionsFor(answers).map((q) => q.id));
  const out = {};
  for (const id of Object.keys(answers)) {
    if (visible.has(id)) out[id] = answers[id];
  }
  return out;
}

function defaultBindingTranslation(binding) {
  if (!binding || binding.questions.length === 0) return '';
  const [first, second] = binding.questions;
  const labels = second
    ? `your ${first.competencyLabel} and your ${second.competencyLabel}`
    : `your ${first.competencyLabel}`;
  return sanitizeVoice(
    `What you told me about ${labels} is the bottleneck that shows up in the dollar gaps above.`
  );
}

function buildHeadline(roiLines, modelLabel) {
  if (roiLines.length === 0) {
    return {
      lead: NO_GAP_HEADLINE.lead.replaceAll('{model_label}', modelLabel),
      subline: NO_GAP_HEADLINE.subline,
      floorDollars: 0,
      medianDollars: 0,
      modelLabel,
    };
  }
  const floor = roiLines.reduce((s, l) => s + l.floorDollars, 0);
  const median = roiLines.reduce((s, l) => s + l.medianDollars, 0);
  return {
    lead: sanitizeVoice(`Your operating system is leaving between ${formatUsd(floor)} and ${formatUsd(median)} on the table this year.`),
    subline: sanitizeVoice(`That is the gap between where you sit today and where ${modelLabel} peers in your revenue range operate. The conservative read is ${formatUsd(floor)} per year. The peer-median read is closer to ${formatUsd(median)}. Here is exactly how I got there.`),
    floorDollars: floor,
    medianDollars: median,
    modelLabel,
  };
}

export function buildResult(rawAnswers, { generatedAt = new Date().toISOString() } = {}) {
  const answers = pruneAnswers(rawAnswers);
  const benchmark = getBusinessModelBenchmark(answers.q2?.value);
  const roiLines = generateRoiLines(answers, benchmark);
  const placement = stagePlacement(answers);
  const binding = bindingBoundary(answers, placement);
  const spots = brightSpots(answers, placement);
  const translation = roiLines.length === 0
    ? NO_GAP_BINDING(binding)
    : defaultBindingTranslation(binding);

  return {
    headline: buildHeadline(roiLines, benchmark.label),
    roiLines,
    placement: {
      stage: placement,
      name: STAGE_NAMES[placement],
      descriptor: STAGE_DESCRIPTORS[placement],
    },
    binding: binding ? { ...binding, translation } : null,
    brightSpots: spots,
    disclosure: DISCLOSURE,
    cta: {
      destination: '/watch',
      heading: CTA_HEADING,
      cardLines: CTA_LINES,
      buttonLabel: 'Schedule the call',
    },
    modelLabel: benchmark.label,
    benchmarkVersion: BUSINESS_MODEL_BENCHMARK_VERSION,
    generatedAt,
  };
}
