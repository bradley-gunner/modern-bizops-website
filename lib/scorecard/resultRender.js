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
import {
  STAGE_NAMES,
  STAGE_DESCRIPTORS,
  DISCLOSURE,
  CTA_HEADING,
  CTA_LINES,
  formatUsd,
  sanitizeVoice,
} from './voice';

function bindingTranslation(binding) {
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
  const floor = roiLines.reduce((s, l) => s + l.floorDollars, 0);
  const median = roiLines.reduce((s, l) => s + l.medianDollars, 0);
  const subline = roiLines.length === 0
    ? sanitizeVoice('Your inputs land at or above peer on the metrics I can compute. Below is the read on where you sit operationally and what would lock that in.')
    : sanitizeVoice(`That is the gap between where you sit today and where ${modelLabel} peers in your revenue range operate. The conservative read is ${formatUsd(floor)} per year. The peer-median read is closer to ${formatUsd(median)}. Here is exactly how I got there.`);
  const lead = roiLines.length === 0
    ? sanitizeVoice('No dollar gap I can defensibly call out from your inputs.')
    : sanitizeVoice(`Your operating system is leaving between ${formatUsd(floor)} and ${formatUsd(median)} on the table this year.`);
  return {
    lead,
    subline,
    floorDollars: floor,
    medianDollars: median,
    modelLabel,
  };
}

export function buildResult(answers, { generatedAt = new Date().toISOString() } = {}) {
  const benchmark = getBusinessModelBenchmark(answers.q2?.value);
  const roiLines = generateRoiLines(answers, benchmark);
  const placement = stagePlacement(answers);
  const binding = bindingBoundary(answers, placement);
  const spots = brightSpots(answers, placement);

  return {
    headline: buildHeadline(roiLines, benchmark.label),
    roiLines,
    placement: {
      stage: placement,
      name: STAGE_NAMES[placement],
      descriptor: STAGE_DESCRIPTORS[placement],
    },
    binding: binding ? { ...binding, translation: bindingTranslation(binding) } : null,
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
