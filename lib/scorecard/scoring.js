/**
 * Stage placement, bright-spot detection, and binding-boundary diagnosis.
 *
 * Block A = q4, q5, q6 (Stage 1 to 2 boundary). Threshold: 3 (Functional).
 * Block B = q7, q8, q9 (Stage 2 to 3 boundary). Threshold: 3 (Functional).
 * Block C = q10, q11, q12 (Stage 3 to 4 boundary). Threshold: 4 (Managed).
 *
 * Weakest-link rule: a single score below the block threshold blocks
 * advancement, mirroring the Phase B framework's own guidance.
 */

import { QUESTIONS } from './questions';

const BLOCKS = {
  A: ['q4', 'q5', 'q6'],
  B: ['q7', 'q8', 'q9'],
  C: ['q10', 'q11', 'q12'],
};

function scoresIn(answers, ids) {
  return ids.map((id) => answers[id]?.score);
}

export function stagePlacement(answers) {
  if (Math.min(...scoresIn(answers, BLOCKS.A)) < 3) return 1;
  if (Math.min(...scoresIn(answers, BLOCKS.B)) < 3) return 2;
  if (Math.min(...scoresIn(answers, BLOCKS.C)) < 4) return 3;
  return 4;
}

export function brightSpots(answers, placement) {
  const maturityIds = [...BLOCKS.A, ...BLOCKS.B, ...BLOCKS.C];
  const spots = maturityIds
    .map((id) => {
      const q = QUESTIONS.find((x) => x.id === id);
      const score = answers[id]?.score ?? 0;
      return { id, score, competencyLabel: q?.competencyLabel };
    })
    .filter((s) => s.score > placement)
    .sort((a, b) => b.score - a.score);
  return spots.slice(0, 2);
}

export function bindingBoundary(answers, placement) {
  if (placement === 4) return null;
  const blockKey = placement === 1 ? 'A' : placement === 2 ? 'B' : 'C';
  const blockIds = BLOCKS[blockKey];
  const ranked = blockIds
    .map((id) => {
      const q = QUESTIONS.find((x) => x.id === id);
      return { id, score: answers[id]?.score ?? 0, competencyLabel: q?.competencyLabel };
    })
    .sort((a, b) => a.score - b.score);
  return { failingBlock: blockKey, questions: ranked.slice(0, 2) };
}
