import { Document, Page, Text, View, Image, StyleSheet, Font, renderToBuffer } from '@react-pdf/renderer';
import path from 'node:path';
import { LEVEL_WORDS } from './voice';

const FONT_DIR = path.join(process.cwd(), 'public', 'fonts');
const LOGO_PATH = path.join(process.cwd(), 'public', 'logos', 'horizontal-full-color-light.png');

Font.register({
  family: 'Cormorant Garamond',
  fonts: [
    { src: path.join(FONT_DIR, 'CormorantGaramond-SemiBold.ttf'), fontWeight: 600 },
    { src: path.join(FONT_DIR, 'CormorantGaramond-Bold.ttf'), fontWeight: 700 },
  ],
});

Font.register({
  family: 'Jost',
  fonts: [
    { src: path.join(FONT_DIR, 'Jost-Regular.ttf'), fontWeight: 400 },
    { src: path.join(FONT_DIR, 'Jost-SemiBold.ttf'), fontWeight: 600 },
  ],
});

// Disable hyphenation so Jost copy does not break mid-word like default Helvetica behavior.
Font.registerHyphenationCallback((word) => [word]);

const BRAND = {
  navy: '#0E1F38',
  navyMid: '#1C3A5C',
  amber: '#B5520A',
  amberPale: '#FEF3E8',
  cream: '#F6F2EB',
  creamDark: '#EDE5D5',
  border: '#D8CEBC',
  textPrimary: '#1A1A2A',
  textMid: '#4A5568',
  textLight: '#6B7A8E',
  green: '#1A5E3A',
  greenPale: '#EBF5F0',
  red: '#B83A2B',
  redPale: '#FDF0EE',
  white: '#FFFFFF',
};

// Score colors for the 1..5 scale (screen keeps its own copy in the bar fill).
const SCORE_FILL = {
  1: '#B45309',
  2: '#E8873A',
  3: '#D8A03A',
  4: '#14B8A6',
  5: '#059669',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: BRAND.cream,
    padding: 40,
    paddingBottom: 56,
    fontFamily: 'Jost',
    fontSize: 10,
    color: BRAND.textPrimary,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
    paddingBottom: 12,
    marginBottom: 16,
  },
  logo: { width: 140 },
  eyebrow: {
    fontFamily: 'Jost',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 9,
    color: BRAND.amber,
    marginBottom: 6,
  },
  h1: {
    fontFamily: 'Cormorant Garamond',
    fontWeight: 700,
    fontSize: 30,
    color: BRAND.navy,
    lineHeight: 1.15,
    marginBottom: 6,
  },
  h2: {
    fontFamily: 'Cormorant Garamond',
    fontWeight: 700,
    fontSize: 16,
    color: BRAND.navy,
    marginTop: 18,
    marginBottom: 8,
  },
  h3: {
    fontFamily: 'Jost',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 9,
    color: BRAND.navy,
    marginTop: 10,
    marginBottom: 4,
  },
  p: {
    fontFamily: 'Jost',
    fontWeight: 400,
    fontSize: 10,
    lineHeight: 1.5,
    color: BRAND.textMid,
    marginBottom: 8,
  },
  small: { fontSize: 8, color: BRAND.textLight, marginTop: 4 },
  card: {
    backgroundColor: BRAND.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BRAND.border,
    padding: 12,
    marginBottom: 10,
  },
  marker: {
    fontFamily: 'Jost',
    fontWeight: 600,
    fontSize: 7,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: BRAND.cream,
    backgroundColor: BRAND.navy,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  markerSelf: {
    color: BRAND.textMid,
    backgroundColor: BRAND.creamDark,
  },
  rowTitle: {
    fontFamily: 'Jost',
    fontWeight: 600,
    fontSize: 11,
    color: BRAND.textPrimary,
    marginBottom: 2,
  },
  rowMetric: {
    fontFamily: 'Jost',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontSize: 7,
    color: BRAND.textLight,
    marginBottom: 4,
  },
  meta: { fontSize: 10, color: BRAND.textMid, marginBottom: 3 },
  mathLine: { fontSize: 8.5, color: BRAND.textLight, lineHeight: 1.45, marginTop: 2, marginBottom: 2 },
  fixLabel: {
    fontFamily: 'Jost',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 8,
    color: BRAND.navy,
    marginTop: 6,
    marginBottom: 2,
  },
  badge: {
    fontFamily: 'Jost',
    fontWeight: 600,
    fontSize: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgeMeets: { backgroundColor: BRAND.greenPale, color: BRAND.green },
  badgePartial: { backgroundColor: BRAND.amberPale, color: BRAND.amber },
  badgeFails: { backgroundColor: BRAND.redPale, color: BRAND.red },
  badgeAudit: { backgroundColor: BRAND.creamDark, color: BRAND.navyMid },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: BRAND.border,
    paddingBottom: 4,
    marginBottom: 2,
  },
  tableHeaderCell: {
    fontFamily: 'Jost',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 7,
    color: BRAND.textLight,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: BRAND.border,
    paddingVertical: 6,
  },
  colMetric: { flex: 2, paddingRight: 6 },
  colValue: { flex: 1, paddingRight: 6 },
  colBadge: { flex: 1 },
  metricLabel: {
    fontFamily: 'Jost',
    fontWeight: 600,
    fontSize: 9,
    color: BRAND.textPrimary,
  },
  metricSource: { fontSize: 7, color: BRAND.textLight, marginTop: 2 },
  cellValue: { fontSize: 9, color: BRAND.textMid },
  dimRow: { marginBottom: 8 },
  dimHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 3 },
  dimLabel: { fontFamily: 'Jost', fontWeight: 600, fontSize: 10, color: BRAND.textPrimary },
  dimLevel: { fontSize: 8, color: BRAND.textLight },
  barTrack: { height: 6, borderRadius: 3, backgroundColor: BRAND.creamDark, marginBottom: 4 },
  barFill: { height: 6, borderRadius: 3 },
  dimRead: { fontSize: 8.5, color: BRAND.textMid, lineHeight: 1.4 },
  obsRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 3, borderBottomWidth: 0.5, borderBottomColor: BRAND.creamDark },
  obsDot: { width: 5, height: 5, borderRadius: 2.5, marginTop: 4, marginRight: 6 },
  obsText: { flex: 1, fontSize: 9, color: BRAND.textMid, lineHeight: 1.4 },
  greyDim: { flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: BRAND.creamDark, opacity: 0.8 },
  greyDimBody: { flex: 1 },
  greyDimName: { fontFamily: 'Jost', fontWeight: 600, fontSize: 9.5, color: BRAND.textPrimary, marginBottom: 1 },
  greyDimLine: { fontSize: 8.5, color: BRAND.textMid, lineHeight: 1.4 },
  ctaBox: {
    backgroundColor: BRAND.navy,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  ctaHeading: {
    fontFamily: 'Cormorant Garamond',
    fontWeight: 700,
    fontSize: 14,
    color: BRAND.cream,
    marginBottom: 6,
  },
  ctaLine: { fontSize: 9, color: '#E3E0D9', lineHeight: 1.5, marginBottom: 3 },
  ctaFounding: { fontSize: 9, color: BRAND.cream, lineHeight: 1.5, marginTop: 6, marginBottom: 6 },
  ctaButton: {
    backgroundColor: BRAND.amber,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  ctaButtonText: {
    fontFamily: 'Jost',
    fontWeight: 600,
    fontSize: 10,
    color: BRAND.white,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { fontSize: 7, color: BRAND.textLight },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 8,
  },
  metaName: {
    fontFamily: 'Cormorant Garamond',
    fontWeight: 700,
    fontSize: 14,
    color: BRAND.navy,
  },
  metaSub: { fontSize: 9, color: BRAND.textMid, marginTop: 2 },
  metaDate: { fontSize: 8, color: BRAND.textLight },
  qaBlockLabel: {
    fontFamily: 'Jost',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 9,
    color: BRAND.navy,
    marginTop: 8,
    marginBottom: 4,
  },
  qaRow: {
    borderBottomWidth: 0.5,
    borderBottomColor: BRAND.border,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  qaBody: { flex: 1, paddingRight: 8 },
  qaPrompt: { fontSize: 9, color: BRAND.textPrimary, fontFamily: 'Jost', fontWeight: 600, marginBottom: 2 },
  qaAnswer: { fontSize: 9, color: BRAND.textMid, lineHeight: 1.4 },
  qaScorePill: {
    fontFamily: 'Jost',
    fontWeight: 600,
    fontSize: 7,
    color: BRAND.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
});

const SECTION_LABELS = {
  1: 'Your business',
  2: 'Your AI readiness',
  3: 'Your numbers',
};

const OBS_DOT_COLOR = { good: BRAND.green, gap: BRAND.red, info: BRAND.navyMid };

function comparisonBadgeStyle(comparison) {
  if (comparison === 'meets') return [styles.badge, styles.badgeMeets];
  if (comparison === 'partial') return [styles.badge, styles.badgePartial];
  return [styles.badge, styles.badgeFails];
}

function verdictBadgeStyle(state) {
  if (state === 'ready') return [styles.badge, styles.badgeMeets];
  if (state === 'blocked') return [styles.badge, styles.badgeFails];
  return [styles.badge, styles.badgeAudit];
}

function ComparisonTable({ comparisons }) {
  return (
    <View style={styles.card} wrap={false}>
      <View style={styles.tableHeaderRow}>
        <Text style={[styles.tableHeaderCell, styles.colMetric]}>Metric</Text>
        <Text style={[styles.tableHeaderCell, styles.colValue]}>You</Text>
        <Text style={[styles.tableHeaderCell, styles.colValue]}>Peer median</Text>
        <Text style={[styles.tableHeaderCell, styles.colBadge]}>Standing</Text>
      </View>
      {comparisons.map((row) => (
        <View key={row.key} style={styles.tableRow} wrap={false}>
          <View style={styles.colMetric}>
            <Text style={styles.metricLabel}>{row.label}</Text>
            {row.source && <Text style={styles.metricSource}>{row.source}</Text>}
          </View>
          <Text style={[styles.cellValue, styles.colValue]}>{row.clientDisplay}</Text>
          <Text style={[styles.cellValue, styles.colValue]}>
            {row.peerMedianDisplay} (range {row.peerRangeDisplay})
          </Text>
          <View style={styles.colBadge}>
            <Text style={[...comparisonBadgeStyle(row.comparison), { marginBottom: 0 }]}>
              {row.comparisonCopy.toUpperCase()}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function MetaBlock({ meta }) {
  if (!meta || (!meta.firstName && !meta.company)) return null;
  const dateStr = (meta.generatedAt || '').slice(0, 10);
  return (
    <View style={styles.metaRow}>
      <View>
        {meta.firstName ? <Text style={styles.metaName}>{meta.firstName}</Text> : null}
        {meta.company ? <Text style={styles.metaSub}>{meta.company}</Text> : null}
      </View>
      {dateStr ? <Text style={styles.metaDate}>Prepared {dateStr}</Text> : null}
    </View>
  );
}

function OpportunityRowPdf({ row, modelLabel }) {
  const line = row.line;
  return (
    <View style={styles.card} wrap={false}>
      <Text style={styles.rowTitle}>{row.areaTitle}</Text>
      {row.metricTitle && <Text style={styles.rowMetric}>{row.metricTitle}</Text>}
      {line && (
        <>
          <Text style={styles.meta}>Your number: {line.clientValue.display}</Text>
          <Text style={styles.meta}>
            Typical {modelLabel} peer: {line.peerMedian.display} (range {line.peerRange.displayLow} to {line.peerRange.displayHigh})
          </Text>
          <Text style={comparisonBadgeStyle(line.comparison)}>{line.comparisonCopy.toUpperCase()}</Text>
          <Text style={styles.p}>{line.body}</Text>
          <Text style={styles.mathLine}>{line.mathLine}</Text>
          {row.capNote && <Text style={styles.mathLine}>{row.capNote}</Text>}
        </>
      )}
      {!line && row.kind === 'computed' && row.statusLine && <Text style={styles.p}>{row.statusLine}</Text>}
      {row.kind === 'evidence' && <Text style={styles.p}>{row.body}</Text>}
      <Text style={verdictBadgeStyle(row.verdict.state)}>{row.verdict.label.toUpperCase()}</Text>
      {row.verdict.gap && <Text style={styles.meta}>Blocked by: {row.verdict.gap}.</Text>}
      <Text style={styles.mathLine}>Basis: {row.verdict.basis}.</Text>
      {row.fix && (
        <>
          <Text style={styles.fixLabel}>HOW TO CLOSE THIS</Text>
          <Text style={styles.p}>{row.fix}</Text>
        </>
      )}
      {row.source && <Text style={styles.small}>{row.source}</Text>}
    </View>
  );
}

function QASection({ questions }) {
  if (!questions || questions.length === 0) return null;
  const bySection = { 1: [], 2: [], 3: [] };
  for (const q of questions) {
    (bySection[q.section] || (bySection[q.section] = [])).push(q);
  }
  return (
    <View break>
      <Text style={styles.h2}>Your answers</Text>
      <Text style={styles.p}>The full set of responses this result was built from.</Text>
      <View style={styles.card}>
        {[1, 2, 3].map((section) =>
          bySection[section] && bySection[section].length > 0 ? (
            <View key={section}>
              <Text style={styles.qaBlockLabel}>{SECTION_LABELS[section]}</Text>
              {bySection[section].map((q) => (
                <View key={q.id} style={styles.qaRow} wrap={false}>
                  <View style={styles.qaBody}>
                    <Text style={styles.qaPrompt}>{q.prompt}</Text>
                    <Text style={styles.qaAnswer}>{q.answer || 'No answer'}</Text>
                  </View>
                  {typeof q.score === 'number' ? (
                    <Text style={[styles.qaScorePill, { backgroundColor: SCORE_FILL[q.score] || BRAND.textLight }]}>
                      {q.score}/5 {LEVEL_WORDS[q.score]}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null
        )}
      </View>
    </View>
  );
}

/** Mirrors the on-screen section order exactly (doc 15 Part 5): band, why it
 *  did not stick, belief contrast, observed, dimensions, opportunity map,
 *  first move, computed dimensions into the CTA. Same markers throughout. */
function ResultDocument({ result, meta, questions }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={LOGO_PATH} style={styles.logo} alt="" />
        </View>

        <MetaBlock meta={meta} />

        {/* 1. The readiness band */}
        <Text style={styles.eyebrow}>{result.band.eyebrow}</Text>
        <Text style={styles.h1}>{result.band.name}</Text>
        <Text style={styles.small}>{result.band.marker}</Text>
        <Text style={[styles.p, { marginTop: 8 }]}>{result.band.descriptor}</Text>

        {/* 2. Why it did not stick */}
        {result.whyItDidNotStick && (
          <View wrap={false}>
            <Text style={styles.h2}>{result.whyItDidNotStick.heading}</Text>
            <View style={styles.card}>
              <Text style={styles.p}>{result.whyItDidNotStick.text}</Text>
            </View>
          </View>
        )}

        {/* 3. The belief contrast */}
        {result.belief && (
          <View wrap={false}>
            <Text style={styles.h2}>{result.belief.heading}</Text>
            <View style={styles.card}>
              <Text style={styles.p}>{result.belief.text}</Text>
            </View>
          </View>
        )}

        {/* 4. Observed from public surfaces */}
        {result.observedFindings && (
          <View wrap={false}>
            <Text style={styles.h2}>{result.observedFindings.heading}</Text>
            <View style={styles.card}>
              <Text style={styles.marker}>{result.observedFindings.marker}</Text>
              {result.observedFindings.unreachable ? (
                <Text style={styles.p}>{result.observedFindings.text}</Text>
              ) : (
                <>
                  {result.observedFindings.lines.map((line) => (
                    <View key={line.key} style={styles.obsRow} wrap={false}>
                      <View style={[styles.obsDot, { backgroundColor: OBS_DOT_COLOR[line.tone] || BRAND.navyMid }]} />
                      <Text style={styles.obsText}>{line.text}</Text>
                    </View>
                  ))}
                  <Text style={[styles.small, { marginTop: 6 }]}>{result.observedFindings.boundary}</Text>
                </>
              )}
            </View>
          </View>
        )}

        {/* 5. The three askable dimensions */}
        <View wrap={false}>
          <Text style={styles.h2}>{result.dimensions.heading}</Text>
          <View style={styles.card}>
            <Text style={[styles.marker, styles.markerSelf]}>{result.dimensions.marker}</Text>
            {result.dimensions.items.map((d) => (
              <View key={d.key} style={styles.dimRow} wrap={false}>
                <View style={styles.dimHead}>
                  <Text style={styles.dimLabel}>{d.label}</Text>
                  <Text style={styles.dimLevel}>{d.meanDisplay} of 5 · {d.levelWord}</Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${Math.round((d.mean / 5) * 100)}%`, backgroundColor: SCORE_FILL[d.level] || BRAND.amber },
                    ]}
                  />
                </View>
                <Text style={styles.dimRead}>{d.read}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 6. The opportunity map */}
        <Text style={styles.h2}>{result.opportunity.heading}</Text>
        {result.opportunity.noGap ? (
          <>
            <Text style={styles.p}>{result.opportunity.noGap.lead}</Text>
            <Text style={styles.p}>{result.opportunity.noGap.subline}</Text>
          </>
        ) : (
          <Text style={styles.p}>{result.opportunity.intro}</Text>
        )}
        {result.opportunity.rows.map((row) => (
          <OpportunityRowPdf key={row.area} row={row} modelLabel={result.modelLabel} />
        ))}
        {result.opportunity.comparisons && result.opportunity.comparisons.length > 0 && (
          <View wrap={false}>
            <Text style={styles.h3}>{result.opportunity.comparisonsHeading}</Text>
            <ComparisonTable comparisons={result.opportunity.comparisons} />
          </View>
        )}

        {/* 7. The first move */}
        {result.firstMove && (
          <View wrap={false}>
            <Text style={styles.h2}>{result.firstMove.heading}</Text>
            <View style={styles.card}>
              <Text style={styles.fixLabel}>FROM YOUR WEAKEST DIMENSION: {result.firstMove.dimensionLabel.toUpperCase()}</Text>
              <Text style={styles.p}>{result.firstMove.text}</Text>
            </View>
          </View>
        )}

        {/* 8. What we could not measure: the CTA block */}
        <View wrap={false}>
          <Text style={styles.h2}>{result.computedDimensions.heading}</Text>
          <Text style={styles.p}>{result.computedDimensions.intro}</Text>
          <View style={styles.card}>
            {result.computedDimensions.items.map((item) => (
              <View key={item.key} style={styles.greyDim} wrap={false}>
                <View style={styles.greyDimBody}>
                  <Text style={styles.greyDimName}>{item.name}</Text>
                  <Text style={styles.greyDimLine}>{item.line}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View wrap={false}>
          <Text style={styles.h2}>What this Scan can and cannot tell you</Text>
          <Text style={styles.p}>{result.disclosure}</Text>
        </View>

        <View style={styles.ctaBox} wrap={false}>
          <Text style={styles.ctaHeading}>{result.cta.heading}</Text>
          {result.cta.cardLines.map((line, i) => (
            <Text key={i} style={styles.ctaLine}>- {line}</Text>
          ))}
          {result.cta.foundingLine && (
            <Text style={styles.ctaFounding}>
              {result.cta.foundingLine} modernbizops.com{result.cta.foundingHref}
            </Text>
          )}
          <View style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>
              {result.cta.buttonLabel}: modernbizops.com{result.cta.destination}
            </Text>
          </View>
        </View>

        <QASection questions={questions} />

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Modern BizOps AI Revenue Scan</Text>
          <Text style={styles.footerText}>{result.generatedAt.slice(0, 10)}</Text>
        </View>
      </Page>
    </Document>
  );
}

/**
 * Render the branded result PDF. `options.meta` adds the prospect name/company/
 * date header; `options.questions` (from answeredQuestions()) adds the "Your
 * answers" appendix. Both are optional, so the 1-arg form stays valid.
 */
export async function renderResultPdf(result, { meta, questions } = {}) {
  return renderToBuffer(<ResultDocument result={result} meta={meta} questions={questions} />);
}

export default ResultDocument;
