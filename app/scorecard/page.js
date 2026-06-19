import Link from 'next/link';
import Image from 'next/image';
import ScorecardExperience from '@/components/scorecard/ScorecardExperience';

export const metadata = {
  title: 'Modern BizOps Maturity Scorecard',
  description:
    'In five minutes, find the dollar amount your operating system is leaving on the table and the one gap I would fix first. Fifteen questions. Peer-anchored ROI math from named public benchmark reports.',
  alternates: {
    canonical: 'https://modernbizops.com/scorecard',
  },
  openGraph: {
    title: 'Modern BizOps Maturity Scorecard',
    description:
      'Find the dollar amount your operating system is leaving on the table this year. Peer-anchored against your business model.',
    url: 'https://modernbizops.com/scorecard',
    images: [
      {
        url: 'https://modernbizops.com/og/og-scorecard.png',
        width: 1200,
        height: 630,
        alt: 'Modern BizOps Maturity Scorecard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern BizOps Maturity Scorecard',
    description: 'Fifteen questions. Peer-anchored ROI. The one gap I would fix first.',
    images: ['https://modernbizops.com/og/og-scorecard.png'],
  },
};

export default function ScorecardPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="px-6 md:px-8 py-5">
        <Link href="/">
          <Image
            src="/logos/horizontal-full-color-light.png"
            alt="Modern BizOps"
            width={330}
            height={90}
            sizes="(max-width: 768px) 180px, 300px"
            className="h-14 md:h-[88px] w-auto"
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
