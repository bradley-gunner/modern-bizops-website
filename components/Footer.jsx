import Link from "next/link";
import Image from "next/image";

// The footer carries the depth the nav gave up when it dropped to five items.
//
// TWO JOBS. The first is the obvious one: an existing client needs the app
// login, and a reader who got this far needs the call. The second is crawl
// equity. Every indexed page the nav no longer reaches is linked here, because
// removing the last internal link to a ranking page is a real cost this
// restructure has no reason to pay. /predictable-revenue-engine, /watch,
// /revenue-operations-consulting and /learn are in this list for that reason.
const FOOTER_COLUMNS = [
  {
    heading: "Work with us",
    links: [
      { label: "AI Automation Services", href: "/ai-automation-services" },
      { label: "Pricing", href: "/pricing" },
      { label: "The AI Revenue Audit", href: "/ai-readiness-assessment" },
      { label: "Free AI Revenue Scan", href: "/scorecard" },
      // The only nav-surface link this page gets. It is a hand-raise for a
      // reader who has already priced the work, not a search entry.
      { label: "Founding Clients", href: "/founding-clients" },
      { label: "Book a Call", href: "/book" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Learning Library", href: "/learn" },
      { label: "The Revenue Maturity Model", href: "/predictable-revenue-engine" },
      { label: "How We Work", href: "/revenue-operations-consulting" },
      { label: "Watch the Walkthrough", href: "/watch" },
      { label: "About Bradley", href: "/about" },
    ],
  },
];

// External destinations, kept apart from the internal columns because they open
// off-site. Client Login moved down here out of the header: existing clients
// still need it, and a login is not a reason for a first-time visitor to lose a
// nav slot.
const CONNECT_LINKS = [
  { label: "Client Login", href: "https://app.modernbizops.com", newTab: false },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/bradleydewet",
    newTab: true,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@BradleydeWetModernBizOps",
    newTab: true,
  },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Data Processing Agreement", href: "/dpa" },
  { label: "Security", href: "/security" },
];

const LINK_CLASS =
  "font-body text-sm text-text-light hover:text-white transition-colors";

export default function Footer() {
  return (
    <footer className="bg-navy text-white py-12">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div>
            <Link href="/" aria-label="Modern BizOps home">
              <Image
                src="/logos/bdw-horizontal-one-color-white.png"
                alt="Bradley de Wet, Modern BizOps"
                width={480}
                height={145}
                sizes="(max-width: 768px) 150px, 200px"
                className="h-14 md:h-[88px] w-auto mb-2"
              />
            </Link>
            <p className="font-body text-text-light text-sm max-w-xs">
              The AI automation partner for B2B go-to-market.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-8">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading}>
                <p className="font-body font-semibold text-sm mb-3">
                  {column.heading}
                </p>
                <nav
                  aria-label={column.heading}
                  className="flex flex-col gap-2"
                >
                  {column.links.map((link) => (
                    <Link key={link.href} href={link.href} className={LINK_CLASS}>
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}

            <div>
              <p className="font-body font-semibold text-sm mb-3">Connect</p>
              <nav aria-label="Connect" className="flex flex-col gap-2">
                {CONNECT_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    {...(link.newTab
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : { rel: "noopener" })}
                    className={LINK_CLASS}
                  >
                    {link.label}
                  </a>
                ))}
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
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-xs text-text-light hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
