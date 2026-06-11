import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', color: '#1a2540' },
  h1: { fontSize: 22, fontWeight: 700, marginBottom: 12, lineHeight: 1.25 },
  h2: { fontSize: 14, fontWeight: 700, marginTop: 18, marginBottom: 8 },
  p: { fontSize: 11, lineHeight: 1.45, marginBottom: 8 },
  small: { fontSize: 9, color: '#6b7280', marginTop: 4 },
  roiBlock: { marginBottom: 14, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  roiTitle: { fontSize: 12, fontWeight: 700, marginBottom: 4 },
  meta: { fontSize: 10, marginBottom: 4 },
  badge: { fontSize: 9, fontWeight: 700, marginBottom: 6 },
  badgeMeets: { color: '#0f766e' },
  badgePartial: { color: '#b45309' },
  badgeFails: { color: '#b6582a' },
  ctaBox: { marginTop: 16, padding: 12, borderWidth: 1, borderColor: '#1a2540' },
  ctaHeading: { fontSize: 13, fontWeight: 700, marginBottom: 6 },
  ctaLine: { fontSize: 10, marginBottom: 3 },
  ctaUrl: { fontSize: 11, fontWeight: 700, marginTop: 8 },
});

function badgeStyle(comparison) {
  if (comparison === 'meets') return [styles.badge, styles.badgeMeets];
  if (comparison === 'partial') return [styles.badge, styles.badgePartial];
  return [styles.badge, styles.badgeFails];
}

function ResultDocument({ result }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.h1}>{result.headline.lead}</Text>
        <Text style={styles.p}>{result.headline.subline}</Text>

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
                <Text style={styles.small}>{line.source}</Text>
              </View>
            ))}
          </>
        )}

        <Text style={styles.h2}>Why this is happening</Text>
        <Text style={styles.p}>
          This is happening because you are at Stage {result.placement.stage}: {result.placement.name}.
        </Text>
        <Text style={styles.p}>{result.placement.descriptor}</Text>
        {result.binding && (
          <Text style={styles.p}>{result.binding.translation}</Text>
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
