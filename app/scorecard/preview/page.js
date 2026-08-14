import ResultView from '@/components/scorecard/ResultView';
import { buildResult } from '@/lib/scorecard/resultRender';

export const metadata = {
  title: 'AI Revenue Scan preview',
  alternates: { canonical: "https://modernbizops.com/scorecard/preview" },
  robots: { index: false, follow: false },
};

// The burned buyer: professional services, $5M to $15M, tried a tool or two
// (q5 = B, the burned-attempt flag), founder owns AI on top of everything,
// no data rules. Composite lands at 2.0 = Foundations First.
const SAMPLE_ANSWERS = {
  q1: { value: '5m_15m' },
  q2: { value: 'PROFESSIONAL_SERVICES' },
  q3: { value: '51_75' },
  q4: { value: 'D', score: 4 },
  q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 }, q7: { value: 'B', score: 2 },
  q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 }, q10: { value: 'C', score: 3 },
  q11: { value: 'A', score: 1 }, q12: { value: 'B', score: 2 }, q13: { value: 'C', score: 3 },
  q14: { value: '25k_100k' }, q15: { value: 'over_180' }, q16: { value: 'over_30' },
};

// A deterministic observed fixture so the observed block previews without any
// network I/O: GA4 present, DMARC missing (feeds the blocked verdict), no
// schema, stale content, a Meta Pixel, two linked social platforms.
const SAMPLE_OBSERVED = {
  url: 'https://example.com/',
  host: 'example.com',
  status: 'ok',
  pageRead: true,
  analytics: { checked: true, ga4: true, gtm: false },
  adPixels: { checked: true, names: ['a Meta Pixel'] },
  social: { checked: true, platforms: ['LinkedIn', 'YouTube'] },
  schema: { checked: true, types: [] },
  emailAuth: { checked: true, domain: 'example.com', spf: true, dmarc: false, dkim: null, missing: ['no DMARC record'] },
  freshness: { checked: true, lastPublished: '2026-02-10', source: 'sitemap' },
};

// Numbers that clear every benchmark AND strong answers: Ready to Build with
// no dollar gap, which is the variant that must never render an empty page.
const NO_GAP_ANSWERS = {
  q1: { value: '5m_15m' },
  q2: { value: 'PROFESSIONAL_SERVICES' },
  // 38 employees, so revenue per employee clears the peer median and this
  // fixture stays a genuine no-gap preview under the current revenue bands.
  q3: { value: '26_50' },
  q4: { value: 'E', score: 5 },
  q5: { value: 'D', score: 4 }, q6: { value: 'E', score: 5 }, q7: { value: 'D', score: 4 },
  q8: { value: 'D', score: 4 }, q9: { value: 'E', score: 5 }, q10: { value: 'D', score: 4 },
  q11: { value: 'D', score: 4 }, q12: { value: 'D', score: 4 }, q13: { value: 'D', score: 4 },
  q14: { value: '25k_100k' }, q15: { value: 'under_30' }, q16: { value: 'under_5' },
};

const VARIANTS = {
  default: { answers: SAMPLE_ANSWERS, observed: SAMPLE_OBSERVED },
  'no-gap': { answers: NO_GAP_ANSWERS, observed: null },
  'no-url': { answers: SAMPLE_ANSWERS, observed: null },
  unreachable: {
    answers: SAMPLE_ANSWERS,
    observed: {
      url: 'https://example.com/', host: 'example.com', status: 'unreachable', pageRead: false,
      analytics: { checked: false }, adPixels: { checked: false }, social: { checked: false },
      schema: { checked: false }, emailAuth: { checked: false },
      freshness: { checked: false, lastPublished: null, source: null },
    },
  },
};

export default async function ScorecardPreviewPage({ searchParams }) {
  const params = await searchParams;
  const variant = VARIANTS[params?.variant] ? params.variant : 'default';
  const { answers, observed } = VARIANTS[variant];
  const result = buildResult(answers, { generatedAt: '2026-08-14T12:00:00.000Z', observed });
  return (
    <div className="mx-auto max-w-3xl px-6 md:px-8 py-12">
      <div className="font-body text-xs text-text-light text-center mb-6">
        Preview ({variant}). No CRM writes. Variants: ?variant=no-gap, ?variant=no-url, ?variant=unreachable.
      </div>
      <ResultView result={result} />
    </div>
  );
}
