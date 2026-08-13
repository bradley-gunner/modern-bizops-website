import Button from '@/components/ui/Button';

// The results-screen bridge to the paid next rung. It goes through Button (not a
// bare Link) so the click fires cta_click: Button only tracks hrefs that are
// keys in its own CTA_DESTINATIONS map, and /ai-readiness-assessment is one.
export default function CtaCard({ cta }) {
  return (
    <div className="bg-navy text-cream rounded-[16px] p-8 md:p-10">
      <h3 className="font-display text-2xl md:text-3xl font-semibold mb-5">{cta.heading}</h3>
      <p className="font-body text-cream/85 mb-3">What you get:</p>
      <ul className="font-body text-cream/85 mb-6 space-y-2">
        {cta.cardLines.map((line, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-amber pt-1">•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
      {cta.focusLine && (
        <p className="font-body text-cream/90 mb-6">{cta.focusLine}</p>
      )}
      <Button href={cta.destination} ctaLocation="scorecard_result_foot">
        {cta.buttonLabel}
      </Button>
    </div>
  );
}
