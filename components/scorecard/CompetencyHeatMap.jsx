import { BLOCK_NAMES, LEVEL_WORDS } from '@/lib/scorecard/voice';

const DOT_FILL_BY_SCORE = {
  1: 'bg-amber-700',
  2: 'bg-amber-500',
  3: 'bg-teal-500',
  4: 'bg-emerald-600',
};

function Dots({ score }) {
  return (
    <span className="inline-flex gap-1" aria-hidden="true">
      {[1, 2, 3, 4].map((n) => (
        <span
          key={n}
          className={`inline-block w-2.5 h-2.5 rounded-full ${n <= score ? DOT_FILL_BY_SCORE[score] : 'bg-border'}`}
        />
      ))}
    </span>
  );
}

function Block({ block, rows }) {
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="font-display text-sm font-semibold tracking-wide text-navy mb-3 uppercase">
        {BLOCK_NAMES[block]}
      </h4>
      <ul className="space-y-2">
        {rows.map((row) => (
          <li
            key={row.id}
            data-row-id={row.id}
            data-score={row.score}
            className="flex items-center justify-between gap-4"
          >
            <span className="font-body text-text-primary">{row.competencyLabel}</span>
            <span className="flex items-center gap-3">
              <Dots score={row.score} />
              <span className="font-body text-sm text-text-mid w-20 text-right">
                {LEVEL_WORDS[row.score]}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CompetencyHeatMap({ scores }) {
  const byBlock = { A: [], B: [], C: [] };
  for (const row of scores) {
    if (byBlock[row.block]) byBlock[row.block].push(row);
  }
  return (
    <div className="bg-white rounded-[14px] border border-border p-6 md:p-8">
      <Block block="A" rows={byBlock.A} />
      <Block block="B" rows={byBlock.B} />
      <Block block="C" rows={byBlock.C} />
    </div>
  );
}
