import ResultView from '@/components/scorecard/ResultView';
import { buildResult } from '@/lib/scorecard/resultRender';

export const metadata = {
  title: 'AI Revenue Scan preview',
  alternates: { canonical: "https://modernbizops.com/scorecard/preview" },
  robots: { index: false, follow: false },
};

const SAMPLE_ANSWERS = {
  q1: { value: '5m_15m' },
  q2: { value: 'PROFESSIONAL_SERVICES' },
  q3: { value: '51_75' },
  q4: { value: 'A', score: 1 }, q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 },
  q7: { value: 'B', score: 2 }, q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 },
  q10: { value: 'B', score: 2 }, q11: { value: 'A', score: 1 }, q12: { value: 'A', score: 1 },
  q13: { value: '25k_100k' }, q14: { value: 'over_180' }, q15: { value: 'over_30' },
};

const NO_GAP_ANSWERS = {
  q1: { value: '5m_15m' },
  q2: { value: 'PROFESSIONAL_SERVICES' },
  // 38 employees, so revenue per employee clears the peer median and this
  // fixture stays a genuine no-gap preview under the current revenue bands.
  q3: { value: '26_50' },
  q4: { value: 'D', score: 4 }, q5: { value: 'D', score: 4 }, q6: { value: 'D', score: 4 },
  q7: { value: 'A', score: 1 }, q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 },
  q10: { value: 'B', score: 2 }, q11: { value: 'A', score: 1 }, q12: { value: 'A', score: 1 },
  q13: { value: '25k_100k' }, q14: { value: 'under_30' }, q15: { value: 'under_5' },
};

export default async function ScorecardPreviewPage({ searchParams }) {
  const params = await searchParams;
  const variant = params?.variant === 'no-gap' ? 'no-gap' : 'default';
  const answers = variant === 'no-gap' ? NO_GAP_ANSWERS : SAMPLE_ANSWERS;
  const result = buildResult(answers, { generatedAt: '2026-06-11T12:00:00.000Z' });
  return (
    <div className="mx-auto max-w-3xl px-6 md:px-8 py-12">
      <div className="font-body text-xs text-text-light text-center mb-6">
        Preview ({variant}). No CRM writes. Append ?variant=no-gap to see the no-gap path.
      </div>
      <ResultView result={result} />
    </div>
  );
}
