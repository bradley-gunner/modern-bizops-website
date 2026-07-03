import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-navy text-white py-12">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <Image
              src="/logos/bdw-horizontal-one-color-white.png"
              alt="Bradley de Wet, Modern BizOps"
              width={480}
              height={145}
              sizes="(max-width: 768px) 150px, 200px"
              className="h-14 md:h-[88px] w-auto mb-2"
            />
            <p className="font-body text-text-light text-sm max-w-xs">
              The platform for capital-efficient growth.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="font-body font-semibold text-sm mb-3">Pages</p>
              <nav aria-label="Site pages" className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="font-body text-sm text-text-light hover:text-white transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="font-body text-sm text-text-light hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/predictable-revenue-engine"
                  className="font-body text-sm text-text-light hover:text-white transition-colors"
                >
                  The Model
                </Link>
                <Link
                  href="/watch"
                  className="font-body text-sm text-text-light hover:text-white transition-colors"
                >
                  Watch
                </Link>
                <Link
                  href="/book"
                  className="font-body text-sm text-text-light hover:text-white transition-colors"
                >
                  Book a Call
                </Link>
                <a
                  href="https://app.modernbizops.com"
                  rel="noopener"
                  className="font-body text-sm text-text-light hover:text-white transition-colors"
                >
                  Client Login
                </a>
              </nav>
            </div>

            <div>
              <p className="font-body font-semibold text-sm mb-3">Connect</p>
              <nav aria-label="Social links" className="flex flex-col gap-2">
                <a
                  href="https://linkedin.com/in/bradleydewet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-text-light hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://youtube.com/@modernbizops"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-text-light hover:text-white transition-colors"
                >
                  YouTube
                </a>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-navy-mid flex flex-col md:flex-row justify-between gap-4">
          <p className="font-body text-xs text-text-light">
            &copy; {new Date().getFullYear()} Modern BizOps. All rights
            reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="font-body text-xs text-text-light hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-body text-xs text-text-light hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/dpa"
              className="font-body text-xs text-text-light hover:text-white transition-colors"
            >
              Data Processing Agreement
            </Link>
            <Link
              href="/security"
              className="font-body text-xs text-text-light hover:text-white transition-colors"
            >
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
