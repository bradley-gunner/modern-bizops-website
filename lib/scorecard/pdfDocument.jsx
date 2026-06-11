import { Document, Page, Text, View, Image, StyleSheet, Font, renderToBuffer } from '@react-pdf/renderer';
import path from 'node:path';
import { BLOCK_NAMES, LEVEL_WORDS } from './voice';

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

// Mirrors the web's DOT_FILL_BY_SCORE for the 4-dot competency scale.
const DOT_FILL_BY_SCORE = {
  1: '#B45309',
  2: '#E8873A',
  3: '#14B8A6',
  4: '#059669',
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
  h1: {
    fontFamily: 'Cormorant Garamond',
    fontWeight: 700,
    fontSize: 24,
    color: BRAND.navy,
    lineHeight: 1.2,
    marginBottom: 8,
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
  roiTitle: {
    fontFamily: 'Jost',
    fontWeight: 600,
    fontSize: 11,
    color: BRAND.textPrimary,
    marginBottom: 4,
  },
  meta: { fontSize: 10, color: BRAND.textMid, marginBottom: 3 },
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
  heatBlockHeader: {
    fontFamily: 'Jost',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 9,
    color: BRAND.navy,
    marginTop: 8,
    marginBottom: 4,
  },
  heatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: BRAND.border,
  },
  heatLabel: { fontSize: 9, color: BRAND.textPrimary },
  heatScale: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, marginLeft: 3 },
  levelWord: {
    fontSize: 8,
    color: BRAND.textMid,
    width: 50,
    textAlign: 'right',
    marginLeft: 6,
  },
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
  ctaFocus: { fontSize: 9, color: BRAND.cream, lineHeight: 1.5, marginTop: 6, marginBottom: 6 },
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
});

function badgeStyle(comparison) {
  if (comparison === 'meets') return [styles.badge, styles.badgeMeets];
  if (comparison === 'partial') return [styles.badge, styles.badgePartial];
  return [styles.badge, styles.badgeFails];
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
            <Text style={[...badgeStyle(row.comparison), { marginBottom: 0 }]}>
              {row.comparisonCopy.toUpperCase()}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function DotScale({ score }) {
  return (
    <View style={styles.heatScale}>
      {[1, 2, 3, 4].map((step) => (
        <View
          key={step}
          style={[
            styles.dot,
            { backgroundColor: step <= score ? DOT_FILL_BY_SCORE[score] : BRAND.border },
          ]}
        />
      ))}
      <Text style={styles.levelWord}>{LEVEL_WORDS[score]}</Text>
    </View>
  );
}

function HeatMapRows({ scores }) {
  const byBlock = { A: [], B: [], C: [] };
  for (const s of scores) {
    if (byBlock[s.block]) byBlock[s.block].push(s);
  }
  return (
    <View style={styles.card} wrap={false}>
      {['A', 'B', 'C'].map((block) => (
        <View key={block}>
          <Text style={styles.heatBlockHeader}>{BLOCK_NAMES[block]}</Text>
          {byBlock[block].map((s) => (
            <View key={s.id} style={styles.heatRow} wrap={false}>
              <Text style={styles.heatLabel}>{s.competencyLabel}</Text>
              <DotScale score={s.score} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function ResultDocument({ result }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={LOGO_PATH} style={styles.logo} />
        </View>

        <Text style={styles.h1}>{result.headline.lead}</Text>
        <Text style={styles.p}>{result.headline.subline}</Text>

        {result.comparisons && result.comparisons.length > 0 && (
          <View wrap={false}>
            <Text style={styles.h2}>How you stack up</Text>
            <ComparisonTable comparisons={result.comparisons} />
          </View>
        )}

        {result.roiLines.map((line, i) => (
          <View key={line.key} wrap={false}>
            {i === 0 && <Text style={styles.h2}>How I got there</Text>}
            <View style={styles.card}>
              <Text style={styles.roiTitle}>{line.title}</Text>
              <Text style={styles.meta}>Your number: {line.clientValue.display}</Text>
              <Text style={styles.meta}>
                Typical {result.modelLabel} peer: {line.peerMedian.display} (range {line.peerRange.displayLow} to {line.peerRange.displayHigh})
              </Text>
              <Text style={badgeStyle(line.comparison)}>{line.comparisonCopy.toUpperCase()}</Text>
              <Text style={styles.p}>{line.body}</Text>
              {line.fix && (
                <>
                  <Text style={styles.fixLabel}>HOW TO CLOSE THIS</Text>
                  <Text style={styles.p}>{line.fix}</Text>
                </>
              )}
              <Text style={styles.small}>{line.source}</Text>
            </View>
          </View>
        ))}

        <View wrap={false}>
          <Text style={styles.h2}>Why this is happening</Text>
          <View style={styles.card}>
            <Text style={styles.p}>
              You are at Stage {result.placement.stage}: {result.placement.name}.
            </Text>
            <Text style={styles.p}>{result.placement.descriptor}</Text>
            {result.binding && (
              <Text style={styles.p}>{result.binding.translation}</Text>
            )}
            {result.nextStage && (
              <>
                <Text style={styles.h3}>What crossing into {result.nextStage.name} looks like</Text>
                {result.nextStage.criteria.map((c, i) => (
                  <Text key={i} style={styles.p}>- {c}</Text>
                ))}
              </>
            )}
          </View>
        </View>

        {result.competencyScores && result.competencyScores.length > 0 && (
          <View wrap={false}>
            <Text style={styles.h2}>Your competency map</Text>
            <HeatMapRows scores={result.competencyScores} />
          </View>
        )}

        {result.brightSpots && result.brightSpots.length > 0 && (
          <View wrap={false}>
            <Text style={styles.h2}>What you are doing right</Text>
            <Text style={styles.p}>
              You scored above your placement on {result.brightSpots.map((s) => s.competencyLabel).join(' and ')}. That is foundation for the work ahead.
            </Text>
          </View>
        )}

        <View wrap={false}>
          <Text style={styles.h2}>What this scorecard can and cannot tell you</Text>
          <Text style={styles.p}>{result.disclosure}</Text>
        </View>

        <View style={styles.ctaBox} wrap={false}>
          <Text style={styles.ctaHeading}>{result.cta.heading}</Text>
          {result.cta.cardLines.map((line, i) => (
            <Text key={i} style={styles.ctaLine}>- {line}</Text>
          ))}
          {result.cta.focusLine && (
            <Text style={styles.ctaFocus}>{result.cta.focusLine}</Text>
          )}
          <View style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>
              {result.cta.buttonLabel}: modernbizops.com{result.cta.destination}
            </Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Modern BizOps Revenue Maturity Scorecard</Text>
          <Text style={styles.footerText}>{result.generatedAt.slice(0, 10)}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderResultPdf(result) {
  return renderToBuffer(<ResultDocument result={result} />);
}

export default ResultDocument;
