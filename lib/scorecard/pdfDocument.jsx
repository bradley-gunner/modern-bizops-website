import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import { BLOCK_NAMES, LEVEL_WORDS } from './voice';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', color: '#1a2540' },
  h1: { fontSize: 22, fontWeight: 700, marginBottom: 12, lineHeight: 1.25 },
  h2: { fontSize: 14, fontWeight: 700, marginTop: 18, marginBottom: 8 },
  h3: { fontSize: 12, fontWeight: 700, marginTop: 12, marginBottom: 6 },
  p: { fontSize: 11, lineHeight: 1.45, marginBottom: 8 },
  small: { fontSize: 9, color: '#6b7280', marginTop: 4 },
  roiBlock: { marginBottom: 14, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  roiTitle: { fontSize: 12, fontWeight: 700, marginBottom: 4 },
  meta: { fontSize: 10, marginBottom: 4 },
  fixLabel: { fontSize: 9, fontWeight: 700, marginTop: 4, marginBottom: 2 },
  badge: { fontSize: 9, fontWeight: 700, marginBottom: 6 },
  badgeMeets: { color: '#0f766e' },
  badgePartial: { color: '#b45309' },
  badgeFails: { color: '#b6582a' },
  comparisonRow: { fontSize: 10, marginBottom: 4 },
  heatRow: { fontSize: 10, marginBottom: 3 },
  heatBlockHeader: { fontSize: 10, fontWeight: 700, marginTop: 8, marginBottom: 4 },
  ctaBox: { marginTop: 16, padding: 12, borderWidth: 1, borderColor: '#1a2540' },
  ctaHeading: { fontSize: 13, fontWeight: 700, marginBottom: 6 },
  ctaLine: { fontSize: 10, marginBottom: 3 },
  ctaFocus: { fontSize: 10, marginTop: 6, marginBottom: 6 },
  ctaUrl: { fontSize: 11, fontWeight: 700, marginTop: 8 },
});

function badgeStyle(comparison) {
  if (comparison === 'meets') return [styles.badge, styles.badgeMeets];
  if (comparison === 'partial') return [styles.badge, styles.badgePartial];
  return [styles.badge, styles.badgeFails];
}

function HeatMapRows({ scores }) {
  const byBlock = { A: [], B: [], C: [] };
  for (const s of scores) {
    if (byBlock[s.block]) byBlock[s.block].push(s);
  }
  return (
    <View>
      {['A', 'B', 'C'].map((block) => (
        <View key={block}>
          <Text style={styles.heatBlockHeader}>{BLOCK_NAMES[block]}</Text>
          {byBlock[block].map((s) => (
            <Text key={s.id} style={styles.heatRow}>
              {s.competencyLabel}: {s.score} of 4, {LEVEL_WORDS[s.score]}
            </Text>
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
        <Text style={styles.h1}>{result.headline.lead}</Text>
        <Text style={styles.p}>{result.headline.subline}</Text>

        {result.comparisons && result.comparisons.length > 0 && (
          <>
            <Text style={styles.h2}>How you stack up</Text>
            {result.comparisons.map((row) => (
              <Text key={row.key} style={styles.comparisonRow}>
                {row.label}: you {row.clientDisplay}; peer median {row.peerMedianDisplay} (range {row.peerRangeDisplay}); {row.comparisonCopy}.
              </Text>
            ))}
          </>
        )}

        {result.roiLines.length > 0 && (
          <>
            <Text style={styles.h2}>How I got there</Text>
            {result.roiLines.map((line) => (
              <View key={line.key} style={styles.roiBlock}>
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
            ))}
          </>
        )}

        <Text style={styles.h2}>Why this is happening</Text>
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
              <Text key={i} style={styles.comparisonRow}>- {c}</Text>
            ))}
          </>
        )}

        {result.competencyScores && result.competencyScores.length > 0 && (
          <>
            <Text style={styles.h2}>Your competency map</Text>
            <HeatMapRows scores={result.competencyScores} />
          </>
        )}

        {result.brightSpots && result.brightSpots.length > 0 && (
          <>
            <Text style={styles.h2}>What you are doing right</Text>
            <Text style={styles.p}>
              You scored above your placement on {result.brightSpots.map((s) => s.competencyLabel).join(' and ')}. That is foundation for the work ahead.
            </Text>
          </>
        )}

        <Text style={styles.h2}>What this scorecard can and cannot tell you</Text>
        <Text style={styles.p}>{result.disclosure}</Text>

        <View style={styles.ctaBox}>
          <Text style={styles.ctaHeading}>{result.cta.heading}</Text>
          {result.cta.cardLines.map((line, i) => (
            <Text key={i} style={styles.ctaLine}>- {line}</Text>
          ))}
          {result.cta.focusLine && (
            <Text style={styles.ctaFocus}>{result.cta.focusLine}</Text>
          )}
          <Text style={styles.ctaUrl}>{result.cta.buttonLabel}: https://modernbizops.com{result.cta.destination}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderResultPdf(result) {
  return renderToBuffer(<ResultDocument result={result} />);
}

export default ResultDocument;
