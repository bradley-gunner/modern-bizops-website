import Link from 'next/link';
import Image from 'next/image';
import ScorecardExperience from '@/components/scorecard/ScorecardExperience';

// The offer name only. The route stays /scorecard because the page has link
// equity and inbound links, and the Scan is a brand surface, not a search one.
const TITLE = 'AI Revenue Scan: Free 5-Minute Diagnostic';
const DESCRIPTION =
  'Sixteen questions, about five minutes, no call. Find out why AI has not stuck in your business yet, what it is costing you, and where you are ready to start.';

export const metadata = {
  // The root layout appends "| Modern BizOps" via its title template, so the
  // bare 41 characters here render at 57.
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://modernbizops.com/scorecard',
  },
  openGraph: {
    title: TITLE,
    description:
      'The free first rung: why AI has or has not worked for you, the dollar value of the gaps, and which automations you are ready to start on now.',
    url: 'https://modernbizops.com/scorecard',
    images: [
      {
        url: 'https://modernbizops.com/og/og-scorecard.png',
        width: 1200,
        height: 630,
        alt: 'Modern BizOps AI Revenue Scan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: 'Sixteen questions. Peer-anchored benchmarks. The first move we would make in your seat.',
    images: ['https://modernbizops.com/og/og-scorecard.png'],
  },
};

export default function ScorecardPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="px-6 md:px-8 py-5">
        <Link href="/">
          <Image
            src="/logos/horizontal-full-color-light-trimmed.png"
            alt="Modern BizOps"
            width={697}
            height={251}
            sizes="(max-width: 768px) 110px, 145px"
            className="h-[31px] md:h-12 w-auto"
            priority
          />
        </Link>
      </div>

      <ScorecardExperience />

      <footer className="border-t border-border px-6 py-4 text-center bg-cream">
        <div className="flex justify-center gap-6">
          <Link href="/privacy" className="font-body text-xs text-text-light hover:text-text-mid transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="font-body text-xs text-text-light hover:text-text-mid transition-colors">
            Terms
          </Link>
        </div>
      </footer>
    </div>
  );
}
