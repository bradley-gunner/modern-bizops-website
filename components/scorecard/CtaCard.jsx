import Link from 'next/link';

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
      <p className="font-body text-cream/80 mb-6">Start with a 20-minute fit call to see if it makes sense for your business.</p>
      <Link
        href={cta.destination}
        className="inline-flex items-center justify-center font-body font-semibold bg-amber text-white hover:bg-amber-light transition-colors duration-200 rounded-full px-8 py-3"
      >
        {cta.buttonLabel}
      </Link>
    </div>
  );
}
