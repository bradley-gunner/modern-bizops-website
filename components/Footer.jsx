import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white py-12">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <p className="font-display text-xl font-semibold mb-2">
              Modern BizOps
            </p>
            <p className="font-body text-text-light text-sm max-w-xs">
              The operating system for capital-efficient growth.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="font-body font-semibold text-sm mb-3">Pages</p>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="font-body text-sm text-text-light hover:text-white transition-colors"
                >
                  Home
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
              </nav>
            </div>

            <div>
              <p className="font-body font-semibold text-sm mb-3">Connect</p>
              <nav className="flex flex-col gap-2">
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
          <div className="flex gap-6">
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
          </div>
        </div>
      </div>
    </footer>
  );
}
